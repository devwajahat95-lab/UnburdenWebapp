import { useState, useEffect } from 'react';
import { Play, Headphones, ArrowRight, Rss } from 'lucide-react';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&q=80';

function formatDuration(seconds) {
  if (!seconds) return '';
  return `${Math.round(seconds / 60)} min`;
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function mapEpisode(episode) {
  return {
    ep: episode.episode_number,
    slug: episode.slug,
    title: episode.title,
    duration: formatDuration(episode.duration_seconds),
    date: formatDate(episode.published_at),
    img: episode.og_image_url || PLACEHOLDER_IMG,
    desc: episode.description,
    audioUrl: episode.audio_url,
  };
}

export default function Podcast() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/podcast/episodes')
      .then(res => { if (!res.ok) throw new Error('Failed to load episodes'); return res.json(); })
      .then(data => { if (!cancelled) setEpisodes(data.map(mapEpisode)); })
      .catch(() => { if (!cancelled) setLoadError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const latest = episodes[0];

  return (
    <div>
      <section style={{background:'linear-gradient(145deg,#163a3d,#1F5154)',padding:'20px 0 20px',color:'white'}}>
        <div className="container">
          <div className="grid-2" style={{gap:64,alignItems:'center'}}>
            <div>
              <span className="tag" style={{color:'#9FE0B4'}}>Twice Monthly · Free</span>
              <h1 style={{fontSize:'clamp(2rem,5vw,3.2rem)',color:'white',marginBottom:16,fontFamily:"'Cormorant Garamond',serif"}}>
                The Unburdened Life Podcast
              </h1>
              <p style={{color:'rgba(255,255,255,0.78)',lineHeight:1.8,fontSize:'1rem',marginBottom:28}}>
                Real conversations about moral injury, workplace PTSD, and what it actually takes to stop giving past empty. New episodes every other Tuesday.
              </p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                {['Spotify','Apple Podcasts','Google Podcasts'].map(p=>(
                  <a key={p} href="#" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',color:'white',padding:'9px 18px',borderRadius:8,fontSize:'0.82rem',fontWeight:500,display:'flex',alignItems:'center',gap:8,transition:'background 0.2s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.18)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                    <Headphones size={15}/> {p}
                  </a>
                ))}
                <a href="#" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',color:'white',padding:'9px 18px',borderRadius:8,fontSize:'0.82rem',fontWeight:500,display:'flex',alignItems:'center',gap:8}}>
                  <Rss size={15}/> RSS
                </a>
              </div>
            </div>
            {latest && <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:12,padding:'28px',display:'flex',gap:20,alignItems:'flex-start'}}>
              <img src={latest.img} alt="Latest episode" style={{width:90,height:90,borderRadius:12,objectFit:'cover',flexShrink:0}}/>
              <div>
                <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.5)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:6}}>Latest Episode · Ep {latest.ep}</div>
                <h3 style={{color:'white',fontSize:'1rem',lineHeight:1.4,marginBottom:10}}>{latest.title}</h3>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <button onClick={()=>latest.audioUrl && window.open(latest.audioUrl,'_blank')} style={{background:'#C6A03C',color:'#163a3d',border:'none',borderRadius:8,padding:'8px 16px',fontWeight:600,fontSize:'0.82rem',cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
                    <Play size={14} fill="currentColor"/> Listen Now
                  </button>
                  <span style={{color:'rgba(255,255,255,0.45)',fontSize:'0.78rem'}}>{latest.duration}</span>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </section>

      {/* Episodes */}
      <section className="section">
        <div className="container">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:36}}>
            <h2 style={{fontSize:'1.8rem',color:'#163a3d'}}>All Episodes</h2>
            <span style={{fontSize:'0.82rem',color:'#9b9b9b'}}>{episodes.length} episodes shown</span>
          </div>
          {loading && <p style={{color:'#9b9b9b',fontSize:'0.9rem'}}>Loading episodes...</p>}
          {loadError && <p style={{color:'#9b9b9b',fontSize:'0.9rem'}}>Couldn't load episodes right now. Try refreshing.</p>}
          {!loading && !loadError && episodes.length === 0 && <p style={{color:'#9b9b9b',fontSize:'0.9rem'}}>No episodes published yet — check back soon.</p>}
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            {episodes.map(ep=>(
              <div key={ep.slug || ep.ep} className="episode-row" style={{background:'white',borderRadius:12,padding:'20px',boxShadow:'0 2px 12px rgba(31,81,84,0.06)',border:'1px solid rgba(31,81,84,0.05)',transition:'box-shadow 0.2s',cursor:'pointer'}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='0 6px 24px rgba(31,81,84,0.12)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 12px rgba(31,81,84,0.06)'}>
                <img src={ep.img} alt={ep.title} style={{width:80,height:80,borderRadius:12,objectFit:'cover'}}/>
                <div>
                  <div style={{fontSize:'0.72rem',color:'#9b9b9b',letterSpacing:'0.06em',marginBottom:4}}>Ep {ep.ep} · {ep.date} · {ep.duration}</div>
                  <h4 style={{fontSize:'1rem',color:'#163a3d',marginBottom:6,lineHeight:1.35}}>{ep.title}</h4>
                  <p style={{fontSize:'0.82rem',color:'#6b6b6b',lineHeight:1.6}}>{ep.desc}</p>
                </div>
                <button onClick={()=>ep.audioUrl && window.open(ep.audioUrl,'_blank')} style={{background:'#1F5154',color:'white',border:'none',borderRadius:8,padding:'10px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontSize:'0.82rem',fontWeight:600,flexShrink:0,whiteSpace:'nowrap'}}>
                  <Play size={14} fill="white"/> Play
                </button>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:36}}>
            <button className="btn-outline">Load More Episodes <ArrowRight size={16}/></button>
          </div>
        </div>
      </section>

      <section className="section" style={{background:'#F0FAF3',textAlign:'center'}}>
        <div className="container" style={{maxWidth:540}}>
          <h2 style={{fontSize:'1.8rem',color:'#163a3d',marginBottom:12}}>Get new episodes in your inbox</h2>
          <p style={{color:'#6b6b6b',fontSize:'0.9rem',marginBottom:24}}>Plus the Worry Sniff Tracker free when you sign up.</p>
          <div style={{display:'flex',gap:12,maxWidth:400,margin:'0 auto'}}>
            <input type="email" placeholder="your@email.com" style={{flex:1,padding:'13px 16px',border:'1.5px solid #e0e0e0',borderRadius:8,fontSize:'0.9rem',fontFamily:'DM Sans,sans-serif'}}/>
            <button className="btn-primary" style={{whiteSpace:'nowrap'}}>Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
