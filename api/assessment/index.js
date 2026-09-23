import { supabase } from '../_lib/supabase';
import { sendEmail } from '../_lib/resend';
import { assessmentLimiter } from '../_lib/ratelimit';

const scoreMap = {
  "Other people's expectations": { score: 'carrying-others', result_tag: 'boundaries' },
  "A role I outgrew but can't leave": { score: 'role-bound', result_tag: 'transition' },
  "My organisation's dysfunction": { score: 'org-dysfunction', result_tag: 'moral-injury' },
  'A version of myself I was supposed to be': { score: 'identity-weight', result_tag: 'identity' },
};

const resultContent = {
  boundaries: {
    headline: "What you're carrying isn't yours",
    body: "The weight you named is coming from other people's expectations — not from you. The starting point isn't doing more. It's learning to set boundaries around what's actually yours to carry.",
    ctaText: '1:1 Coaching', ctaPath: '/work-with-me',
  },
  transition: {
    headline: "You've outgrown the role you're in",
    body: "This isn't burnout in the usual sense — it's the specific exhaustion of staying somewhere you've already outgrown. An Intensive is built for exactly this: getting clear on the exit that doesn't cost you everything.",
    ctaText: 'Explore the Intensive', ctaPath: '/work-with-me',
  },
  'moral-injury': {
    headline: "This is structural, not personal",
    body: "What you're describing has a name: moral injury. It's not a personal failing, it's the cost of staying loyal to institutions that don't reciprocate. Start with the podcast and blog to hear how others have named the same thing.",
    ctaText: 'Listen & Read', ctaPath: '/podcast',
  },
  identity: {
    headline: "You've lost track of who you are outside the role",
    body: "When the weight is about identity, the way forward usually isn't solitary — it's communal. The Collective is a place to rebuild a sense of self alongside people doing the same work.",
    ctaText: 'See The Collective', ctaPath: '/collective',
  },
};

function buildResultsEmail({ name, result_tag }) {
  const content = resultContent[result_tag] || resultContent.identity;
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://yourdomain.com';
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  return `<div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #163a3d;"><p>${greeting}</p><h2 style="font-family: Georgia, serif; color: #163a3d;">${content.headline}</h2><p style="line-height: 1.7; color: #444;">${content.body}</p><p style="margin: 28px 0;"><a href="${siteUrl}${content.ctaPath}" style="background:#1F5154;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;">${content.ctaText} →</a></p><p style="font-size: 0.85rem; color: #9b9b9b;">— The Unburdened Collective</p></div>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const { success } = await assessmentLimiter.limit(`assessment:${ip}`);
  if (!success) return res.status(429).json({ error: 'Too many requests. Try again later.' });

  const { email, name, answers } = req.body || {};
  if (!answers?.q1 || !answers?.q2 || !answers?.q3 || !answers?.q4) {
    return res.status(400).json({ error: 'All 4 answers are required' });
  }

  const scored = scoreMap[answers.q3] || { score: 'unknown', result_tag: 'identity' };
  const { error: insertError } = await supabase.from('assessment_responses').insert({
    email: email || null, name: name || null, answers,
    score: scored.score, result_tag: scored.result_tag,
  });
  if (insertError) return res.status(500).json({ error: 'Could not save your results' });

  if (email) {
    await supabase.from('subscribers').upsert({
      email, name: name || null, entry_point: 'assessment',
      tags: ['assessment', scored.result_tag], subscribed: true,
    }, { onConflict: 'email' });

    try {
      await sendEmail({
        to: email,
        subject: 'Your Unburdening Assessment results',
        html: buildResultsEmail({ name, result_tag: scored.result_tag }),
      });
    } catch (err) {
      console.error('Assessment results email failed to send:', err.message);
    }
  }

  return res.json({ success: true, score: scored.score, result_tag: scored.result_tag });
}
