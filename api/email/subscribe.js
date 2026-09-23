import { supabase } from '../_lib/supabase';
import { subscribeLimiter } from '../_lib/ratelimit';
import { sendEmail } from '../_lib/resend';

// Copy varies slightly by where the person subscribed. The footer promises
// the Worry Sniff Tracker specifically, so it gets its own message.
// TODO: once the Worry Sniff Tracker PDF is uploaded to R2 (tuc-public/lead-magnets/),
// add a real download link/button into the 'footer' case below.
function buildWelcomeEmail({ name, entry_point }) {
  const greeting = name ? `Hi ${name},` : 'Hi there,';

  if (entry_point === 'footer') {
    return {
      subject: 'Welcome — your Worry Sniff Tracker is on its way',
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #163a3d;">
          <p>${greeting}</p>
          <p style="line-height: 1.7; color: #444;">Thanks for joining the list. The Worry Sniff Tracker is being finalized and will land in your inbox shortly — no need to do anything else in the meantime.</p>
          <p style="font-size: 0.85rem; color: #9b9b9b;">— The Unburdened Collective</p>
        </div>
      `,
    };
  }

  if (entry_point === 'cop-waitlist') {
    return {
      subject: "You're on the CoP Cohort waitlist",
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #163a3d;">
          <p>${greeting}</p>
          <p style="line-height: 1.7; color: #444;">You're officially on the waitlist for the CoP Cohort. Members get first access when applications open — we'll email you the moment that happens.</p>
          <p style="font-size: 0.85rem; color: #9b9b9b;">— The Unburdened Collective</p>
        </div>
      `,
    };
  }

  return {
    subject: "You're subscribed",
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #163a3d;">
        <p>${greeting}</p>
        <p style="line-height: 1.7; color: #444;">You're on the list — thanks for signing up.</p>
        <p style="font-size: 0.85rem; color: #9b9b9b;">— The Unburdened Collective</p>
      </div>
    `,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const { success } = await subscribeLimiter.limit(`subscribe:${ip}`);
  if (!success) return res.status(429).json({ error: 'Too many requests. Try again later.' });

  const { email, name, entry_point } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  const { error } = await supabase.from('subscribers').upsert(
    {
      email,
      name: name || null,
      entry_point: entry_point || null,
      tags: entry_point ? [entry_point] : [],
      subscribed: true,
    },
    { onConflict: 'email' }
  );

  if (error) return res.status(500).json({ error: 'Could not subscribe right now' });

  try {
    const { subject, html } = buildWelcomeEmail({ name, entry_point });
    await sendEmail({ to: email, subject, html });
  } catch (err) {
    // Don't fail the whole request just because the email didn't send —
    // the subscriber is already saved. Log and move on.
    console.error('Welcome email failed to send:', err.message);
  }

  return res.json({ subscribed: true });
}
