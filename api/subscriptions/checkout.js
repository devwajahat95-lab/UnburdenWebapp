import Stripe from 'stripe';
import { requireAuth } from '../_lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = await requireAuth(req, res);
  if (!user) return;

  const { tier } = req.body || {};
  const priceId = tier === 'member'
    ? process.env.STRIPE_MEMBER_PRICE_ID
    : tier === 'inner-circle'
    ? process.env.STRIPE_INNER_CIRCLE_PRICE_ID
    : null;

  if (!priceId) return res.status(400).json({ error: "tier must be 'member' or 'inner-circle'" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      subscription_data: { metadata: { userId: user.id } },
      success_url: `${siteUrl}/members?subscribed=true`,
      cancel_url: `${siteUrl}/collective`,
    });
    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe subscription checkout failed:', err.message);
    return res.status(500).json({ error: 'Could not start checkout' });
  }
}