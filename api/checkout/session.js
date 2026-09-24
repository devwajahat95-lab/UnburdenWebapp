import Stripe from 'stripe';
import { supabase } from '../_lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
// TODO: consent_collection (terms_of_service: 'required') was removed below
// because it requires Stripe's Business Details to be fully activated, which
// this sandbox account hasn't done. Once real business details are set up
// (before going live with real payments), re-add:
//   consent_collection: { terms_of_service: 'required' },
// and set a real Terms of Service URL at dashboard.stripe.com/settings/public.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { items, userId, email } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items in cart' });
  }

  // NEVER trust client-supplied prices — re-fetch each product fresh from
  // Supabase and build Stripe line items from the server's own data.
  const productIds = items.map((i) => i.id);
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, price_cents, type, download_limit, active')
    .in('id', productIds)
    .eq('active', true);

  if (error) return res.status(500).json({ error: 'Could not verify products' });

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const missing = productIds.filter((id) => !productMap[id]);
  if (missing.length > 0) {
    return res.status(400).json({ error: 'One or more items are no longer available' });
  }

  const lineItems = items.map((item) => {
    const product = productMap[item.id];
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.title,
          metadata: {
            productId: product.id,
            type: product.type,
            downloadLimit: String(product.download_limit || 5),
          },
        },
        unit_amount: product.price_cents,
      },
      quantity,
    };
  });

  const hasPhysical = items.some((item) => productMap[item.id]?.type === 'physical');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: email || undefined,
      // Section 2.6 GAP #6 — userId flows into the webhook via metadata, then
      // into orders.user_id. null/empty means guest checkout.
      metadata: { userId: userId || '' },
      success_url: `${siteUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop`,
      ...(hasPhysical
        ? { shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] } }
        : {}),
    });
    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout session creation failed:', err.message);
    return res.status(500).json({ error: 'Could not start checkout' });
  }
}
