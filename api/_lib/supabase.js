import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Log loudly instead of letting createClient() throw synchronously and
  // white-screen the entire app on every page — a missing frontend env var
  // should degrade (auth/cart features break) rather than crash everything.
  console.error(
    'REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY are missing. ' +
    'Add them in Vercel → Environment Variables (all environments) and redeploy.'
  );
}

export const supabase = createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder-anon-key');
