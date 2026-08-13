import { Play, Headphones, ArrowRight, Rss } from 'lucide-react';

const episodes = [
  { ep: 42, title: 'When Staying Is the Problem   Moral Injury and the Cost of Loyalty', duration:'48 min', date:'Nov 12, 2025', img:'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&q=80', desc:'Why the people most committed to their work are often the ones getting harmed the most by it   and what the research actually says about when to stay vs. leave.' },
  { ep: 41, title: "The Truth Tax: What You’re Paying That Never Shows Up on a Budget", duration:'41 min', date:'Oct 28, 2025', img:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80', desc:"An honest accounting of the invisible costs   cognitive, emotional, physical   of absorbing harm you didn’t cause in workplaces that depend on your silence." },
  { ep: 40, title: 'Giving Past Empty Is Not Dedication. It Is Structural.', duration:'36 min', date:'Oct 14, 2025', img:'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80', desc:'The difference between burnout (personal) and moral injury (structural). Why most burnout advice fails people doing high-stakes work.' },
  { ep: 39, title: 'Self-Stewardship Is Not Self-Care', duration:'45 min', date:'Sep 30, 2025', img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80', desc:'The reframe that changes everything. Self-care is a spa day. Self-stewardship is treating yourself as a resource that has limits   and building your life accordingly.' },
  { ep: 38, title: "That’s Not Your Sack: Identifying Institutional Harm", duration:'52 min', date:'Sep 16, 2025', img:'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80', desc:"How to tell the difference between personal accountability and the weight of institutional dysfunction you’ve been quietly absorbing." },
  { ep: 37, title: 'Break Out, Not Drop Out', duration:'44 min', date:'Sep 2, 2025', img:'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80', desc:'The practical, non-dramatic way to exit situations that are harming you   without torching your career, your relationships, or your sense of self.' },
];

export default function Podcast() {
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
            <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:12,padding:'28px',display:'flex',gap:20,alignItems:'flex-start'}}>
              <img src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&q=80" alt="Latest episode" style={{width:90,height:90,borderRadius:12,objectFit:'cover',flexShrink:0}}/>
              <div>
                <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.5)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:6}}>Latest Episode · Ep 42</div>
                <h3 style={{color:'white',fontSize:'1rem',lineHeight:1.4,marginBottom:10}}>When Staying Is the Problem   Moral Injury and the Cost of Loyalty</h3>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <button style={{background:'#C6A03C',color:'#163a3d',border:'none',borderRadius:8,padding:'8px 16px',fontWeight:600,fontSize:'0.82rem',cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
                    <Play size={14} fill="currentColor"/> Listen Now
                  </button>
                  <span style={{color:'rgba(255,255,255,0.45)',fontSize:'0.78rem'}}>48 min</span>
                </div>
              </div>
            </div>
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
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            {episodes.map(ep=>(
              <div key={ep.ep} className="episode-row" style={{background:'white',borderRadius:12,padding:'20px',boxShadow:'0 2px 12px rgba(31,81,84,0.06)',border:'1px solid rgba(31,81,84,0.05)',transition:'box-shadow 0.2s',cursor:'pointer'}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='0 6px 24px rgba(31,81,84,0.12)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 12px rgba(31,81,84,0.06)'}>
                <img src={ep.img} alt={ep.title} style={{width:80,height:80,borderRadius:12,objectFit:'cover'}}/>
                <div>
                  <div style={{fontSize:'0.72rem',color:'#9b9b9b',letterSpacing:'0.06em',marginBottom:4}}>Ep {ep.ep} · {ep.date} · {ep.duration}</div>
                  <h4 style={{fontSize:'1rem',color:'#163a3d',marginBottom:6,lineHeight:1.35}}>{ep.title}</h4>
                  <p style={{fontSize:'0.82rem',color:'#6b6b6b',lineHeight:1.6}}>{ep.desc}</p>
                </div>
                <button style={{background:'#1F5154',color:'white',border:'none',borderRadius:8,padding:'10px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontSize:'0.82rem',fontWeight:600,flexShrink:0,whiteSpace:'nowrap'}}>
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
