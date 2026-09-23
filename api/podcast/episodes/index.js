import { supabase } from '../../_lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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