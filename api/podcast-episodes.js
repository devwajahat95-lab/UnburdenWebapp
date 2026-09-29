import { supabase } from './_lib/supabase';

// Flat file (see api/products.js for why — the [[...slug]].js optional
// catch-all convention isn't reliable outside Next.js). vercel.json rewrites
// map both /api/podcast/episodes and /api/podcast/episodes/:slug to this file.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  const { slug } = req.query;

  if (slug) {
    const { data, error } = await supabase
      .from('podcast_episodes')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .single();

    if (error) console.error('GET /api/podcast/episodes/:slug — Supabase error:', error.message, error);
    if (error || !data) return res.status(404).json({ error: 'Episode not found' });
    return res.json(data);
  }

  const { limit } = req.query;
  const parsedLimit = Math.min(parseInt(limit, 10) || 50, 100);

  const { data, error } = await supabase
    .from('podcast_episodes')
    .select('id, episode_number, title, slug, description, duration_seconds, audio_url, og_image_url, published_at')
    .eq('active', true)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(parsedLimit);

  if (error) {
    console.error('GET /api/podcast/episodes — Supabase error:', error.message, error);
    return res.status(500).json({ error: 'Failed to load episodes' });
  }

  return res.json(data);
}
