import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message || 'Invalid email or password.');
      setLoading(false);
      return;
    }

    const isAdmin = data?.user?.user_metadata?.role === 'admin';
    navigate(redirect || (isAdmin ? '/admin' : '/members'));
  };

  return (
    <section className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <h1 style={{ marginBottom: 8 }}>Member Login</h1>
        <p style={{ color: '#666', marginBottom: 32 }}>Sign in to access your account.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#163a3d' }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid rgba(31,81,84,0.2)', fontSize: '0.95rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#163a3d' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid rgba(31,81,84,0.2)', fontSize: '0.95rem' }}
            />
          </div>

          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem' }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </section>
  );
}
