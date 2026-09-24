import { supabase } from '../_lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'session_id is required' });

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, total_cents, status, items, shipping_address, created_at')
    .eq('stripe_session_id', session_id)
    .single();

  if (error || !order) {
    // The webhook can take a few seconds to land after Stripe redirects the
    // browser back — 404 here just means "not yet", not "never".
    return res.status(404).json({ error: 'Order not found yet' });
  }

  const { data: downloads } = await supabase
    .from('downloads')
    .select('product_id, download_token')
    .eq('order_id', order.id);

  const downloadByProduct = Object.fromEntries((downloads || []).map((d) => [d.product_id, d.download_token]));

  const items = (order.items || []).map((item) => ({
    ...item,
    download_token: item.type === 'digital' ? downloadByProduct[item.product_id] || null : null,
  }));

  return res.json({ ...order, items });
}
