import { supabase } from '../_lib/supabase';
import { sendEmail } from '../_lib/resend';

// NOTE on verification: Cal.com's webhook signing uses an HMAC of the RAW
// request body, which requires bodyParser: false + a manual buffer read (the
// same pattern as the Stripe webhook). This route currently uses Vercel's
// default JSON body parsing for simplicity, so signature verification is
// NOT implemented yet. TODO before relying on this in production: switch to
// bodyParser:false, read the raw buffer, and verify the
// `X-Cal-Signature-256` header against CALCOM_WEBHOOK_SECRET the same way
// stripe.js verifies Stripe's signature.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { triggerEvent, payload } = req.body || {};
  if (!triggerEvent || !payload) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  try {
    switch (triggerEvent) {
      case 'BOOKING_CREATED':
        await handleBookingCreated(payload);
        break;
      case 'BOOKING_CANCELLED':
        await handleBookingCancelled(payload);
        break;
      case 'BOOKING_RESCHEDULED':
        await handleBookingRescheduled(payload);
        break;
      // Other trigger events (BOOKING_PAYMENT_INITIATED, MEETING_ENDED, etc.)
      // are intentionally ignored — the spec's payment model has Cal.com
      // collect payment before BOOKING_CREATED ever fires, so by the time we
      // see a booking it's already paid.
    }
    return res.json({ ok: true });
  } catch (err) {
    // Log but still return 200 — Cal.com retries on non-2xx, and a bug in
    // our handler shouldn't cause it to keep hammering the same event.
    console.error('Cal.com webhook handler error:', err);
    return res.status(200).json({ ok: true, warning: 'Handler error logged' });
  }
}

function inferEventType(payload) {
  const slug = (payload?.eventType?.slug || payload?.eventSlug || '').toLowerCase();
  if (slug.includes('intensive')) return 'intensive';
  if (slug.includes('class') || slug.includes('group')) return 'class';
  return 'coaching';
}

function extractZoomLink(payload) {
  if (payload?.videoCallData?.url) return payload.videoCallData.url;
  if (typeof payload?.location === 'string' && payload.location.startsWith('http')) return payload.location;
  return null;
}

function bookingConfirmationHtml(booking) {
  const when = booking.start_at
    ? new Date(booking.start_at).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })
    : 'the scheduled time';
  return `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #163a3d;">
      <h2 style="font-family: Georgia, serif;">You're confirmed</h2>
      <p style="color: #444;">Your session is booked for ${when}.</p>
      ${booking.zoom_link ? `<p><a href="${booking.zoom_link}" style="color:#C6A03C;">Join link</a></p>` : ''}
      <p style="font-size: 0.85rem; color: #9b9b9b;">— The Unburdened Collective</p>
    </div>
  `;
}

async function handleBookingCreated(payload) {
  const bookingUid = String(payload.uid || payload.bookingId || '');
  if (!bookingUid) {
    console.error('BOOKING_CREATED payload missing uid/bookingId');
    return;
  }

  const attendee = payload.attendees?.[0] || {};

  const { data: booking, error } = await supabase
    .from('bookings')
    .upsert(
      {
        calcom_booking_id: bookingUid,
        attendee_email: attendee.email || null,
        attendee_name: attendee.name || null,
        start_at: payload.startTime || null,
        end_at: payload.endTime || null,
        event_type: inferEventType(payload),
        zoom_link: extractZoomLink(payload),
        intake_answers: payload.responses || null,
        // BookingModal requires checking the scope-of-service box BEFORE the
        // Cal.com embed even renders — anyone who reached Cal.com to create
        // this booking has already agreed, so this is always true here.
        scope_acknowledged: true,
        status: 'confirmed',
      },
      { onConflict: 'calcom_booking_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Failed to save booking:', error.message, error);
    return;
  }

  if (attendee.email) {
    try {
      await sendEmail({
        to: attendee.email,
        subject: 'Your session is confirmed — The Unburdened Collective',
        html: bookingConfirmationHtml(booking),
      });
    } catch (err) {
      console.error('Booking confirmation email failed to send:', err.message);
    }
  }

  if (process.env.EMILY_EMAIL) {
    try {
      await sendEmail({
        to: process.env.EMILY_EMAIL,
        subject: `New booking: ${attendee.name || attendee.email || 'Someone'}`,
        html: `<p>${attendee.name || 'Someone'} (${attendee.email || 'no email'}) booked a ${booking.event_type} session.</p>
               <p>${booking.start_at ? new Date(booking.start_at).toLocaleString() : 'Time TBD'}</p>`,
      });
    } catch (err) {
      console.error('Emily booking notification email failed to send:', err.message);
    }
  }
}

async function handleBookingCancelled(payload) {
  const bookingUid = String(payload.uid || payload.bookingId || '');
  if (!bookingUid) return;
  await supabase.from('bookings').update({ status: 'cancelled' }).eq('calcom_booking_id', bookingUid);
}

async function handleBookingRescheduled(payload) {
  const bookingUid = String(payload.uid || payload.bookingId || '');
  if (!bookingUid) return;
  await supabase
    .from('bookings')
    .update({
      status: 'rescheduled',
      start_at: payload.startTime || null,
      end_at: payload.endTime || null,
    })
    .eq('calcom_booking_id', bookingUid);
}
