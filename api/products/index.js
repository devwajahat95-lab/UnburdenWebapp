import { supabase } from '../_lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) return res.status(500).json({ error: 'Failed to load products' });

  const stripped = data.map(({ r2_key, ...rest }) => rest);
  return res.json(stripped);
}