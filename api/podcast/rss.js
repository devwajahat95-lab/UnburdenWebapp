import { supabase } from '../_lib/supabase';

function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDuration(seconds) {
  if (!seconds) return '00:00:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = Math.floor(seconds % 60);
  return [hours, minutes, remainder].map(n => String(n).padStart(2, '0')).join(':');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://yourdomain.com';
  const { data: episodes, error } = await supabase
    .from('podcast_episodes')
    .select('*')
    .eq('active', true)
    .not('published_at', 'is', null)
    .not('audio_url', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Failed to build feed' });

  const items = (episodes || []).map(ep => `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <link>${siteUrl}/podcast/${escapeXml(ep.slug)}</link>
      <guid isPermaLink="false">${escapeXml(ep.slug)}</guid>
      <pubDate>${new Date(ep.published_at).toUTCString()}</pubDate>
      <description>${escapeXml(ep.description || '')}</description>
      <enclosure url="${escapeXml(ep.audio_url)}" type="audio/mpeg" />
      <itunes:title>${escapeXml(ep.title)}</itunes:title>
      <itunes:summary>${escapeXml(ep.description || '')}</itunes:summary>
      <itunes:duration>${formatDuration(ep.duration_seconds)}</itunes:duration>
      ${ep.episode_number ? `<itunes:episode>${ep.episode_number}</itunes:episode>` : ''}
      ${ep.og_image_url ? `<itunes:image href="${escapeXml(ep.og_image_url)}" />` : ''}
      <itunes:explicit>false</itunes:explicit>
    </item>`).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>The Unburdened Life Podcast</title>
    <link>${siteUrl}/podcast</link>
    <language>en-us</language>
    <description>Real conversations about moral injury, workplace PTSD, and what it actually takes to stop giving past empty.</description>
    <itunes:author>The Unburdened Collective</itunes:author>
    <itunes:type>episodic</itunes:type>
    <itunes:explicit>false</itunes:explicit>
    <itunes:category text="Health &amp; Fitness">
      <itunes:category text="Mental Health" />
    </itunes:category>
    <itunes:owner>
      <itunes:name>The Unburdened Collective</itunes:name>
      <itunes:email>${process.env.EMILY_EMAIL || 'hello@yourdomain.com'}</itunes:email>
    </itunes:owner>
    ${items}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  return res.send(rss);
}