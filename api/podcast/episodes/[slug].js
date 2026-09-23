import { supabase } from '../../_lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { slug } = req.query;
  const { data, error } = await supabase
    .from('podcast_episodes')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .single();

  if (error || !data) return res.status(404).json({ error: 'Episode not found' });
  return res.json(data);
}