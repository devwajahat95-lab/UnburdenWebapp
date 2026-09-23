import { supabase } from './supabase';

export async function apiFetch(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = {
    'Content-Type': 'application/json',
    ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(path, {
    method: options.method || 'GET',
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    if (response.status === 401) {
      window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
      return;
    }
    const requestError = new Error(error.error || 'Request failed');
    requestError.status = response.status;
    throw requestError;
  }

  return response.json();
}
