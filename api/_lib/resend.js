import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// EMAIL_SANDBOX=true forces the Resend sandbox sender regardless of NODE_ENV.
// Useful for testing real email delivery on a deployed Vercel environment
// before a verified domain exists — set this in Vercel's env vars temporarily,
// using the exact email address your Resend account was signed up with as
// the recipient (the sandbox address can only send to that one address).
// Remove this variable (or set it to anything other than 'true') once a real
// domain is verified in Resend and hello@yourdomain.com below is updated.
const useSandbox = process.env.EMAIL_SANDBOX === 'true' || process.env.NODE_ENV !== 'production';

const FROM = useSandbox
  ? 'The Unburdened Collective <onboarding@resend.dev>'
  : 'The Unburdened Collective <onboarding@resend.dev>';

export async function sendEmail({ to, subject, html }) {
  const result = await resend.emails.send({ from: FROM, to, subject, html });
  if (result.error) throw new Error(`Resend error: ${result.error.message}`);
  return result;
}

export { resend };
