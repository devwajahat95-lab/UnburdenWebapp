import { supabase } from '../_lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Product not found' });

  const { r2_key, ...stripped } = data;
  return res.json(stripped);
}