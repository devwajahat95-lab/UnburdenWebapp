import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, LogOut } from 'lucide-react';
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
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); setAccountMenuOpen(false); }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Close the account dropdown when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dashboardLink = user?.user_metadata?.role === 'admin' ? '/admin' : '/members';
  const accountLabel = user?.user_metadata?.role === 'admin' ? 'Admin' : 'Account';

  const handleSignOut = async () => {
    setAccountMenuOpen(false);
    await supabase.auth.signOut();
    navigate('/login');
  };

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

        {user ? (
          <div ref={accountMenuRef} style={{ position: 'relative', marginLeft: 14 }}>
            <button
              onClick={() => setAccountMenuOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'inherit', padding: 0 }}
            >
              <User size={16} /> {accountLabel} <ChevronDown size={14} style={{ transform: accountMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {accountMenuOpen && (
              <div style={{
                position: 'absolute', top: '130%', right: 0, background: 'white', borderRadius: 10,
                boxShadow: '0 12px 32px rgba(31,81,84,0.18)', minWidth: 160, overflow: 'hidden', zIndex: 50,
              }}>
                <Link to={dashboardLink} onClick={() => setAccountMenuOpen(false)}
                  style={{ display: 'block', padding: '11px 16px', fontSize: '0.85rem', color: '#163a3d', textDecoration: 'none' }}>
                  Dashboard
                </Link>
                <button onClick={handleSignOut}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: '0.85rem', color: '#c0392b', background: 'none', border: 'none', borderTop: '1px solid rgba(31,81,84,0.08)', cursor: 'pointer' }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 14, fontSize: '0.85rem', fontWeight: 600, color: 'inherit', textDecoration: 'none' }}>
            <User size={16} /> Login
          </Link>
        )}

        <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={pathname === l.to ? 'active' : ''}>{l.label}</Link>
          ))}
          {user ? (
            <>
              <Link to={dashboardLink} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={16} /> {accountLabel} Dashboard
              </Link>
              <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#c0392b', padding: 0, cursor: 'pointer', font: 'inherit' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={16} /> Login
            </Link>
          )}
          <button className="btn-primary" onClick={onAssessment} style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}>
            Take the Assessment
          </button>
        </div>
      )}
    </nav>
  );
}
