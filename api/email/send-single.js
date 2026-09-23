import { sendEmail } from '../_lib/resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { to, subject, html } = req.body || {};
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'to, subject, and html are required' });
  }

  try {
    await sendEmail({ to, subject, html });
    return res.json({ sent: true });
  } catch (err) {
    return res.status(500).json({ error: 'Email send failed' });
  }
}
