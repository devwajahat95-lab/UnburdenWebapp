import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Members() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (!session) {
        navigate('/login?redirect=/members');
        return;
      }
      setUser(session.user);
      setChecking(false);
    });
    return () => { cancelled = true; };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (checking) {
    return <section className="section"><div className="container"><p style={{ color: '#9b9b9b' }}>Loading...</p></div></section>;
  }

  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ marginBottom: 8 }}>The Collective</h1>
        <p style={{ color: '#666', marginBottom: 4 }}>Welcome back, {user?.email}.</p>
        <p style={{ color: '#9b9b9b', marginBottom: 32 }}>Member resources (content library, class recordings) are coming soon.</p>

        {isAdmin && (
          <Link to="/admin" className="btn-outline" style={{ display: 'inline-flex', marginBottom: 16 }}>
            Go to Admin Dashboard
          </Link>
        )}
        <div>
          <button onClick={handleSignOut} className="btn-outline">Sign Out</button>
        </div>
      </div>
    </section>
  );
}
