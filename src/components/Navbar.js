import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      background: 'var(--teal)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600 }}>U</span>
    </div>
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 500, color: 'var(--teal-dark)', lineHeight: 1.1 }}>
        The Unburdened
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', lineHeight: 1 }}>
        Collective
      </div>
    </div>
  </div>
);

const navItems = [
  { id: \'home\', label: \'Home\' },
  { id: \'work\', label: \'Work With Me\' },
  { id: \'collective\', label: \'The Collective\' },
  { id: \'shop\', label: \'Shop\' },
  { id: \'about\', label: \'About\' },
  { id: \'podcast\', label: \'Podcast\' },
];

export default function Navbar({ page, nav, onAssessment }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener(\'scroll\', fn);
    return () => window.removeEventListener(\'scroll\', fn);
  }, []);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(250,248,244,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(31,81,84,0.08)' : 'none',
        transition: 'all 0.3s ease',
        padding: scrolled ? '12px 0' : '20px 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div onClick={() => nav(\'home\')}><Logo /></div>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => nav(item.id)}
                style={{
                  background: \'none\', border: \'none\', padding: 0,
                  fontFamily: \'var(--font-body)\',
                  fontSize: \'0.85rem\', fontWeight: page === item.id ? 500 : 400,
                  color: page === item.id ? \'var(--teal)\' : \'var(--text-mid)\',
                  letterSpacing: \'0.02em\',
                  borderBottom: page === item.id ? \'1.5px solid var(--gold)\' : \'1.5px solid transparent\',
                  paddingBottom: 2,
                  transition: \'all 0.2s\',
                }}
              >
                {item.label}
              </button>
            ))}
            <button className="btn-primary" onClick={onAssessment} style={{ fontSize: '0.75rem', padding: '10px 22px' }}>
              Take the Assessment
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: \'none\', border: \'none\', color: \'var(--teal)\', display: \'none\' }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: 'var(--cream)', padding: '100px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { nav(item.id); setMenuOpen(false); }}
              style={{
                background: \'none\', border: \'none\', padding: \'16px 0\',
                fontFamily: \'var(--font-display)\',
                fontSize: \'1.8rem\', fontWeight: 500, textAlign: \'left\',
                color: page === item.id ? \'var(--teal)\' : \'var(--text-dark)\',
                borderBottom: \'1px solid rgba(31,81,84,0.1)\',
              }}
            >
              {item.label}
            </button>
          ))}
          <button className="btn-primary" onClick={() => { onAssessment(); setMenuOpen(false); }} style={{ marginTop: 24, textAlign: \'center\' }}>
            Take the Assessment
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
