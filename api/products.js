import { supabase } from './_lib/supabase';

// Flat file, no bracket-based dynamic routing at all — handles both
// GET /api/products (list) and GET /api/products/:id (detail, via a plain
// vercel.json rewrite that maps the URL to this file with ?id=... attached).
// Switched away from the [[...id]].js optional-catch-all convention because
// that syntax is Next.js-specific and isn't reliably supported by Vercel's
// generic (non-Next.js) serverless function routing — see known_gaps.md.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  const { id } = req.query;

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

  const stripped = data.map(({ r2_key, ...rest }) => rest);
  return res.json(stripped);
}
