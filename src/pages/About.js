import { useState } from 'react';
import { ArrowRight, Award, Heart, BookOpen } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import emily from "../images/emily.jpeg";

export default function About() {
  const [modal, setModal] = useState(null);
  return (
    <div>
      {modal && <BookingModal type={modal} onClose={()=>setModal(null)}/>}

      <section style={{background:'linear-gradient(145deg,#163a3d,#1F5154)',padding:'20px 0 40px',color:'white'}}>
        <div className="container">
          <div className="grid-2" style={{gap:64,alignItems:'center'}}>
            <div>
              <span className="tag" style={{color:'#9FE0B4'}}>LMHC · Framework Creator · Survivor</span>
              <h1 style={{fontSize:'clamp(2.2rem,5vw,3.5rem)',color:'white',marginBottom:20,fontFamily:"'Cormorant Garamond',serif"}}>
                Emily Bliss
              </h1>
              <p style={{fontSize:'1.05rem',color:'rgba(255,255,255,0.8)',lineHeight:1.8,marginBottom:24}}>
                Licensed Mental Health Counselor. Moral injury researcher. Person who kept carrying a sack that nearly killed her   and built a framework from what it took to put it down.
              </p>
              <p style={{fontSize:'0.95rem',color:'rgba(255,255,255,0.65)',lineHeight:1.8}}>
                The Unburdened Collective exists because the gap between "clinical knowledge" and "what actually helps people" is where most professionals fall through. Emily sits on both sides of that gap, by design.
              </p>
            </div>
            <div style={{position:'relative'}}>
              {/* <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80" alt="Emily" style={{width:'100%',borderRadius:12,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}/> */}
              <img src={emily} alt="Emily" style={{width:'100%',borderRadius:12,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}/>
              <div style={{position:'absolute',bottom:-20,right:-20,background:'#C6A03C',padding:'16px 20px',borderRadius:4}}>
                <div style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#163a3d'}}>Licensed LMHC</div>
                <div style={{fontSize:'0.7rem',color:'rgba(22,58,61,0.7)',marginTop:4}}>15+ years clinical + coaching</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The story */}
      <section className="section">
        <div className="container" style={{maxWidth:780}}>
          <span className="eyebrow">The Origin</span>
          <h2 style={{fontSize:'clamp(1.6rem,4vw,2.4rem)',color:'#163a3d',marginBottom:24}}>The heart attack changed the question.</h2>
          <div style={{display:'flex',flexDirection:'column',gap:20,color:'#3d3d3d',fontSize:'1rem',lineHeight:1.85}}>
            <p>Emily spent fifteen years in clinical settings, first as a floor therapist, then in leadership, watching smart, capable, deeply caring people burn out not from weakness but from a system that kept handing them more sacks to carry. She carried them too.</p>
            <p>In 2019, at the tail end of a 70-hour week, she had a cardiac event. She was 41. What followed wasn't a breakdown   it was a clarification. She didn't need more self-care. She needed to understand the <em>structure of the harm</em>: who built it, why it persists, and how you dismantle it without dropping everything you love about the work.</p>
            <p>That clarity became the framework. The Unburdened Life, the book. The Unburdened Collective, the community. The Truth Tax, the Worry Sniff Tracker, Put the Sack Down   these aren't metaphors. They're the tools that came from doing the actual work.</p>
          </div>
          <div style={{marginTop:32,display:'flex',gap:16}}>
            <button className="btn-primary" onClick={()=>setModal('coaching')}>Work With Emily <ArrowRight size={16}/></button>
            <a href="/shop" className="btn-outline">Read the Book</a>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="section" style={{background:'#F0FAF3'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:40}}>
            <span className="eyebrow">The Credential Behind the Work</span>
            <h2 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',color:'#163a3d'}}>Clinical training is the moat   not the disclaimer</h2>
          </div>
          <div className="grid-3">
            {[
              {icon:<Award size={24}/>,color:'#1F5154',title:'LMHC, Licensed',desc:'Licensed Mental Health Counselor with 13+ years clinical practice in hospital, organizational, and private settings.'},
              {icon:<BookOpen size={24}/>,color:'#C6A03C',title:'Moral Injury Research',desc:'Graduate-level training in moral injury frameworks   the clinical concept behind workplace PTSD, institutional harm, and ethical exhaustion.'},
              {icon:<Heart size={24}/>,color:'#C7B6EA',title:'Lived Experience',desc:'Not theorized from the outside. The framework came from inside the harm   which is what makes it different from 99% of what\'s out there.'},
            ].map(c=>(
              <div key={c.title} style={{background:'white',borderRadius:12,padding:'28px 24px',boxShadow:'0 2px 16px rgba(31,81,84,0.06)'}}>
                <div style={{width:48,height:48,borderRadius:'50%',background:`${c.color}15`,display:'flex',alignItems:'center',justifyContent:'center',color:c.color,marginBottom:16}}>{c.icon}</div>
                <h4 style={{fontSize:'1rem',color:'#163a3d',marginBottom:8}}>{c.title}</h4>
                <p style={{fontSize:'0.85rem',color:'#6b6b6b',lineHeight:1.65}}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jeff */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{gap:64,alignItems:'center'}}>
            <img src="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&q=80" alt="Jeff" style={{width:'100%',borderRadius:12,boxShadow:'0 12px 40px rgba(31,81,84,0.1)'}}/>
            <div>
              <span className="eyebrow">Meet Jeff</span>
              <h2 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',color:'#163a3d',marginBottom:16}}>He kept the lights on. Now he keeps the architecture solid.</h2>
              <p style={{color:'#3d3d3d',lineHeight:1.8,marginBottom:16}}>While Emily was doing the work, Jeff was doing the other work   keeping the household running, navigating his own career, watching someone he loved keep giving past empty and not knowing how to stop her.</p>
              <p style={{color:'#3d3d3d',lineHeight:1.8}}>He's on the site because he's part of what this looks like when it works. Not a mascot. Not a sidekick. The person who made it possible to put the sack down.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
