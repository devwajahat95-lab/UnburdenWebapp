import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

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

        <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={pathname === l.to ? 'active' : ''}>{l.label}</Link>
          ))}
          <button className="btn-primary" onClick={onAssessment} style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}>
            Take the Assessment
          </button>
        </div>
      )}
    </nav>
  );
}
