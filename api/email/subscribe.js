import { supabase } from '../_lib/supabase';
import { subscribeLimiter } from '../_lib/ratelimit';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const { success } = await subscribeLimiter.limit(`subscribe:${ip}`);
  if (!success) return res.status(429).json({ error: 'Too many requests. Try again later.' });

  const { email, name, entry_point } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  const { error } = await supabase.from('subscribers').upsert({
    email, name: name || null, entry_point: entry_point || null,
    tags: entry_point ? [entry_point] : [], subscribed: true,
  }, { onConflict: 'email' });

  if (error) return res.status(500).json({ error: 'Could not subscribe right now' });
  return res.json({ subscribed: true });
}
