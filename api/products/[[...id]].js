import { supabase } from '../../_lib/supabase';

// Optional catch-all: [[...id]] matches BOTH /api/products (id undefined)
// AND /api/products/:id (id = ['the-id']). Merged from two separate files
// to save a serverless function slot — see known_gaps.md Gap 14.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const idParam = req.query.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single();

    if (error) console.error('GET /api/products/:id — Supabase error:', error.message, error);
    if (error || !data) return res.status(404).json({ error: 'Product not found' });

    const { r2_key, ...stripped } = data;
    return res.json(stripped);
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('GET /api/products — Supabase error:', error.message, error);
    return res.status(500).json({ error: 'Failed to load products' });
  }

  // r2_key is a private object key for the paid download — never expose it to the browser
  const stripped = data.map(({ r2_key, ...rest }) => rest);
  return res.json(stripped);
}