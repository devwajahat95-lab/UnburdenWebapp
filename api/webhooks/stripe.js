import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabase } from '../_lib/supabase';
import { sendEmail } from '../_lib/resend';

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
        if (event.data.object.mode === 'payment') await handleCheckoutComplete(event.data.object);
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
    return res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(200).json({ received: true, warning: 'Handler error logged' });
  }
}

function orderConfirmationHtml(downloadLinksHtml, order) {
  return `<div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #163a3d;"><h2 style="font-family: Georgia, serif;">Your order is confirmed</h2><p style="color: #444;">Order total: $${(order.total_cents / 100).toFixed(2)}</p>${downloadLinksHtml ? `<div style="margin: 20px 0;">${downloadLinksHtml}</div>` : ''}<p style="font-size: 0.85rem; color: #9b9b9b;">— The Unburdened Collective</p></div>`;
}

async function handleCheckoutComplete(session) {
  const { data: existing } = await supabase.from('orders').select('id').eq('stripe_session_id', session.id).single();
  if (existing) return;

  const fullSession = await stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items.data.price.product'] });
  const itemsSnapshot = (fullSession.line_items?.data || []).map(item => ({
    product_id: item.price?.product?.metadata?.productId || null,
    title: item.price?.product?.name || item.description,
    price_cents: item.price?.unit_amount || 0,
    type: item.price?.product?.metadata?.type || 'digital',
    quantity: item.quantity || 1,
    stripe_line_item_id: item.id,
  }));

  const { data: order } = await supabase.from('orders').insert({
    user_id: session.metadata?.userId || null,
    stripe_session_id: session.id,
    stripe_payment_intent: session.payment_intent,
    total_cents: session.amount_total,
    status: 'paid',
    items: itemsSnapshot,
    shipping_address: session.shipping_details || null,
    fulfillment_status: 'unfulfilled',
  }).select().single();
  if (!order) return;

  const digitalItems = itemsSnapshot.filter(item => item.type === 'digital');
  const downloads = [];
  for (const item of digitalItems) {
    const lineItem = fullSession.line_items?.data?.find(li => li.id === item.stripe_line_item_id);
    const { data: download } = await supabase.from('downloads').insert({
      order_id: order.id,
      user_id: session.metadata?.userId || null,
      product_id: item.product_id,
      max_downloads: parseInt(lineItem?.price?.product?.metadata?.downloadLimit || '5', 10),
    }).select().single();
    downloads.push({ ...download, product_title: item.title });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  if (session.customer_email) {
    const downloadLinks = downloads.map(download => `<a href="${siteUrl}/api/downloads/${download.download_token}" style="display:block;margin:8px 0;color:#C6A03C;">Download: ${download.product_title}</a>`).join('');
    try {
      await sendEmail({
        to: session.customer_email,
        subject: 'Your order is confirmed — The Unburdened Collective',
        html: orderConfirmationHtml(downloadLinks, order),
      });
    } catch (err) {
      console.error('Order confirmation email failed to send:', err.message);
    }
  }

  const physicalItems = itemsSnapshot.filter(item => item.type === 'physical');
  if (physicalItems.length > 0 && process.env.EMILY_EMAIL) {
    try {
      await sendEmail({
        to: process.env.EMILY_EMAIL,
        subject: `New physical order to ship — Order ${order.id.slice(0, 8).toUpperCase()}`,
        html: `<p>Order from ${session.customer_email}</p><p>Items: ${physicalItems.map(item => item.title).join(', ')}</p><p>Ship to: ${JSON.stringify(session.shipping_details?.address || {})}</p><p>Manage: ${siteUrl}/admin</p>`,
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
  if (!userId) {
    console.error('Subscription event with no userId in metadata:', subscription.id);
    return;
  }

  const status = ['active', 'trialing', 'past_due'].includes(subscription.status)
    ? subscription.status
    : subscription.status === 'canceled' ? 'cancelled' : 'active';

  await supabase.from('memberships').upsert({
    user_id: userId,
    stripe_customer_id: subscription.customer,
    stripe_subscription_id: subscription.id,
    tier,
    status,
    current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
  }, { onConflict: 'user_id' });
}

async function handleSubCancelled(subscription) {
  await supabase.from('memberships').update({ status: 'cancelled' }).eq('stripe_subscription_id', subscription.id);
}

async function handlePaymentFailed(invoice) {
  if (!invoice.subscription) return;
  await supabase.from('memberships').update({ status: 'past_due' }).eq('stripe_subscription_id', invoice.subscription);
}
