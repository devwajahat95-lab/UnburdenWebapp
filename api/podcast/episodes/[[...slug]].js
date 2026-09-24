import { supabase } from '../../../_lib/supabase';

// Optional catch-all: [[...slug]] matches BOTH /api/podcast/episodes
// (slug undefined) AND /api/podcast/episodes/:slug. Merged from two files —
// see known_gaps.md Gap 14.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const slugParam = req.query.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

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