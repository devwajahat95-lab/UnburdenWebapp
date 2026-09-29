import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

const links = [
  { to: '/', label: 'Home' },
  { to: '/work-with-me', label: 'Work With Me' },
  { to: '/collective', label: 'The Collective' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/podcast', label: 'Podcast' },
];

export default function Nav({ onAssessment }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const accountLink = user
    ? (user.user_metadata?.role === 'admin' ? '/admin' : '/members')
    : '/login';
  const accountLabel = user ? (user.user_metadata?.role === 'admin' ? 'Admin' : 'Account') : 'Login';

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-mark">UC</div>
          <div className="nav-logo-text">
            The Unburdened Collective
            <span>Coaching &amp; Community</span>
          </div>
        </Link>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={pathname === l.to ? 'active' : ''}>{l.label}</Link>
            </li>
          ))}
        </ul>

        <button className="btn-primary nav-cta" onClick={onAssessment} style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
          Take the Assessment
        </button>

        <Link to={accountLink} className="nav-account-link" title={accountLabel}
          style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 14, fontSize: '0.85rem', fontWeight: 600, color: 'inherit', textDecoration: 'none' }}>
          <User size={16} /> {accountLabel}
        </Link>

        <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={pathname === l.to ? 'active' : ''}>{l.label}</Link>
          ))}
          <Link to={accountLink} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={16} /> {accountLabel}
          </Link>
          <button className="btn-primary" onClick={onAssessment} style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}>
            Take the Assessment
          </button>
        </div>
      )}
    </nav>
  );
}
