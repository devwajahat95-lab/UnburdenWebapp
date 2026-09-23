import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e) => { e.preventDefault(); if (email) { setDone(true); setEmail(''); } };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">
              <div className="nav-logo-mark">UC</div>
              <div className="nav-logo-text">The Unburdened Collective<span>Coaching &amp; Community</span></div>
            </div>
            <p>Workplace PTSD is real. Moral injury is real. You don’t have to keep carrying a sack that was never yours. This is where you put it down.</p>
            <div style={{display:'flex',gap:12,marginTop:20}}>
              <a href={process.env.REACT_APP_INSTAGRAM_URL || '#'} aria-label="Instagram" target="_blank" rel="noopener noreferrer" style={{color:'rgba(255,255,255,0.5)'}}><Instagram size={20}/></a>
              <a href={process.env.REACT_APP_SPOTIFY_URL || '#'} aria-label="Spotify Podcast" target="_blank" rel="noopener noreferrer" style={{color:'rgba(255,255,255,0.5)'}}><Linkedin size={20}/></a>
            </div>
          </div>
          <div>
            <h4>Navigate</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/work-with-me">Work With Me</Link></li>
              <li><Link to="/collective">The Collective</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About Emily</Link></li>
              <li><Link to="/podcast">Podcast</Link></li>
            </ul>
          </div>
          <div>
            <h4>Legal &amp; Care</h4>
            <ul>
              <li><Link to="/scope-of-service">Scope of Service</Link></li>
              <li><a href="mailto:hello@unburdenedcollective.com">Contact</a></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms</Link></li>
            </ul>
            <div style={{marginTop:16}}>
              <p style={{margin:0,fontSize:'0.78rem',color:'rgba(255,255,255,0.45)'}}>
                Crisis: <a href="tel:988" style={{color:'#9FE0B4'}}>988</a> · <a href="https://crisistextline.org" style={{color:'#9FE0B4'}}>Crisis Text Line</a> · 911
              </p>
            </div>
          </div>
          <div className="footer-newsletter">
            <h4>Join the List</h4>
            <p style={{fontSize:'0.82rem',marginBottom:14}}>Get the Worry Sniff Tracker free. No noise   just the real stuff.</p>
            {done ? (
              <p style={{color:'#9FE0B4',fontWeight:600}}>✓ You're in. Check your email.</p>
            ) : (
              <form onSubmit={submit}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                <button type="submit">Get the Tracker →</button>
              </form>
            )}
          </div>
        </div>
        <div className="footer-disclaimer">
          <p>© 2025 Blissful Balance LLC · The Unburdened Collective is coaching and psychoeducation   <strong>not therapy</strong>, not clinical treatment. <Link to="/scope-of-service">Full scope →</Link></p>
          <p style={{display:'flex',alignItems:'center',gap:4,whiteSpace:'nowrap'}}>Made with <Heart size={12} fill="currentColor" style={{color:'#C7B6EA',margin:'0 2px'}}/> by Emily &amp; Jeff</p>
        </div>
      </div>
    </footer>
  );
}
