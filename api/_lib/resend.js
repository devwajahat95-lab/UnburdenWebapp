import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.NODE_ENV === 'production'
  ? 'The Unburdened Collective <hello@yourdomain.com>'
  : 'The Unburdened Collective <onboarding@resend.dev>';

export async function sendEmail({ to, subject, html }) {
  const result = await resend.emails.send({ from: FROM, to, subject, html });
  if (result.error) throw new Error(`Resend error: ${result.error.message}`);
  return result;
}

export { resend };
