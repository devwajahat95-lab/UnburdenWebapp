import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabase } from '../_lib/supabase';
import { sendEmail } from '../_lib/resend';

// REQUIRED — without this, Stripe signature verification fails because
// Vercel would otherwise pre-parse the body before we can verify it raw.
export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // Subscription-mode sessions are handled entirely through the
        // customer.subscription.* events below, not here.
        if (event.data.object.mode === 'payment') {
          await handleCheckoutComplete(event.data.object);
        }
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubUpsert(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubCancelled(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
    }
    res.json({ received: true });
  } catch (err) {
    // Log but still return 200 — Stripe retries on non-2xx, and a bug in our
    // handler shouldn't cause Stripe to keep hammering the same event.
    console.error('Webhook handler error:', err);
    res.status(200).json({ received: true, warning: 'Handler error logged' });
  }
}

function orderConfirmationHtml(downloadLinksHtml, order) {
  return `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #163a3d;">
      <h2 style="font-family: Georgia, serif;">Your order is confirmed</h2>
      <p style="color: #444;">Order total: $${(order.total_cents / 100).toFixed(2)}</p>
      ${downloadLinksHtml ? `<div style="margin: 20px 0;">${downloadLinksHtml}</div>` : ''}
      <p style="font-size: 0.85rem; color: #9b9b9b;">— The Unburdened Collective</p>
    </div>
  `;
}

async function handleCheckoutComplete(session) {
  // Idempotency — Stripe can deliver the same event more than once.
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single();
  if (existing) return;

  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items.data.price.product'],
  });

  const itemsSnapshot = (fullSession.line_items?.data || []).map((item) => ({
    product_id: item.price?.product?.metadata?.productId || null,
    title: item.price?.product?.name || item.description,
    price_cents: item.price?.unit_amount || 0,
    type: item.price?.product?.metadata?.type || 'digital',
    quantity: item.quantity || 1,
    stripe_line_item_id: item.id,
  }));

  const { data: order } = await supabase
    .from('orders')
    .insert({
      user_id: session.metadata?.userId || null,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent,
      total_cents: session.amount_total,
      status: 'paid',
      items: itemsSnapshot,
      shipping_address: session.shipping_details || null,
      fulfillment_status: 'unfulfilled',
    })
    .select()
    .single();

  const digitalItems = itemsSnapshot.filter((i) => i.type === 'digital');
  const downloads = [];
  for (const item of digitalItems) {
    const lineItem = fullSession.line_items?.data?.find((li) => li.id === item.stripe_line_item_id);
    const { data: dl } = await supabase
      .from('downloads')
      .insert({
        order_id: order.id,
        user_id: session.metadata?.userId || null,
        product_id: item.product_id,
        max_downloads: parseInt(lineItem?.price?.product?.metadata?.downloadLimit || '5', 10),
      })
      .select()
      .single();
    downloads.push({ ...dl, product_title: item.title });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  // session.customer_email is only set when we pre-fill it (logged-in users).
  // For guest checkouts, Stripe collects the email on its hosted page and
  // puts it in customer_details.email instead — check both.
  const customerEmail = session.customer_email || session.customer_details?.email;

  if (customerEmail) {
    const downloadLinks = downloads
      .map(
        (dl) =>
          `<a href="${siteUrl}/api/downloads/${dl.download_token}" style="display:block;margin:8px 0;color:#C6A03C;">Download: ${dl.product_title}</a>`
      )
      .join('');
    try {
      await sendEmail({
        to: customerEmail,
        subject: 'Your order is confirmed — The Unburdened Collective',
        html: orderConfirmationHtml(downloadLinks, order),
      });
    } catch (err) {
      console.error('Order confirmation email failed to send:', err.message);
    }
  }

  const physicalItems = itemsSnapshot.filter((i) => i.type === 'physical');
  if (physicalItems.length > 0 && process.env.EMILY_EMAIL) {
    try {
      await sendEmail({
        to: process.env.EMILY_EMAIL,
        subject: `New physical order to ship — Order ${order.id.slice(0, 8).toUpperCase()}`,
        html: `<p>Order from ${customerEmail || 'unknown email'}</p>
               <p>Items: ${physicalItems.map((i) => i.title).join(', ')}</p>
               <p>Ship to: ${JSON.stringify(session.shipping_details?.address || {})}</p>
               <p>Manage: ${siteUrl}/admin</p>`,
      });
    } catch (err) {
      console.error('Physical order notification email failed to send:', err.message);
    }
  }
}

function tierFromPriceId(priceId) {
  if (priceId === process.env.STRIPE_MEMBER_PRICE_ID) return 'member';
  if (priceId === process.env.STRIPE_INNER_CIRCLE_PRICE_ID) return 'inner-circle';
  return null;
}

async function handleSubUpsert(subscription) {
  const priceId = subscription.items?.data?.[0]?.price?.id;
  const tier = tierFromPriceId(priceId);
  const userId = subscription.metadata?.userId || null;

  // Without a userId we have no way to link this subscription to an account —
  // log it rather than silently writing an orphaned membership row.
  if (!userId) {
    console.error('Subscription event with no userId in metadata:', subscription.id);
    return;
  }

  const status = ['active', 'trialing', 'past_due'].includes(subscription.status)
    ? subscription.status
    : subscription.status === 'canceled'
    ? 'cancelled'
    : 'active';

  await supabase.from('memberships').upsert(
    {
      user_id: userId,
      stripe_customer_id: subscription.customer,
      stripe_subscription_id: subscription.id,
      tier,
      status,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
    },
    { onConflict: 'user_id' }
  );
}

async function handleSubCancelled(subscription) {
  await supabase
    .from('memberships')
    .update({ status: 'cancelled' })
    .eq('stripe_subscription_id', subscription.id);
}

async function handlePaymentFailed(invoice) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;
  await supabase
    .from('memberships')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);
}
