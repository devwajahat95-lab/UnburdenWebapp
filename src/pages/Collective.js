import { useState } from 'react';
import { ArrowRight, Check, Lock, Users, BookOpen, Video, MessageCircle } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const tiers = [
  {
    name:'Member', price:'$29/mo', color:'#1F5154',
    desc:'The content library, monthly classes, and a community who already understands what you carry.',
    features:['Monthly group class (live + recording)','Full content library access','Worry Sniff Tracker + Energy Map tools','Community forum','Monthly theme drops'],
    cta:'Join as Member',
  },
  {
    name:'Inner Circle', price:'$79/mo', color:'#C6A03C', featured:true,
    desc:'Everything in Member, plus a monthly 1:1 touchpoint with Emily and priority booking.',
    features:['Everything in Member','Monthly 30-min 1:1 with Emily','Priority coaching booking','Advance access to new tools + content','CoP cohort early access','Quarterly intensive discount (20%)'],
    cta:'Join Inner Circle',
  },
];

export default function Collective() {
  const [modal, setModal] = useState(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');

  const joinWaitlist = async (e) => {
    e.preventDefault();
    if (!waitlistEmail || waitlistSubmitting) return;
    setWaitlistSubmitting(true);
    setWaitlistError('');
    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail, entry_point: 'cop-waitlist' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      setWaitlistDone(true);
      setWaitlistEmail('');
    } catch (err) {
      setWaitlistError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setWaitlistSubmitting(false);
    }
  };
  return (
    <div>
      {modal && <BookingModal type={modal} onClose={()=>setModal(null)}/>}
      <section style={{
        background:'linear-gradient(145deg,#163a3d,#1F5154)',
        padding:'20px 0 20px', color:'white', textAlign:'center',
      }}>
        <div className="container">
          <span className="tag" style={{color:'#9FE0B4'}}>Community · Library · Practice</span>
          <h1 style={{fontSize:'clamp(2.2rem,5vw,3.8rem)',color:'white',marginBottom:20,fontFamily:"'Cormorant Garamond',serif"}}>
            The Unburdened Collective
          </h1>
          <p style={{fontSize:'1.1rem',color:'rgba(255,255,255,0.75)',maxWidth:580,margin:'0 auto 36px'}}>
            A membership for people doing real work in hard places   nurses, teachers, directors, caregivers   
            who are done performing okay.
          </p>
          <div style={{display:'flex',gap:40,justifyContent:'center',flexWrap:'wrap'}}>
            {[{icon:<Users size={20}/>,label:'Active Members',val:'340+'},{icon:<Video size={20}/>,label:'Classes in Library',val:'28'},{icon:<BookOpen size={20}/>,label:'Tools & Guides',val:'15+'}].map(s=>(
              <div key={s.label} style={{textAlign:'center'}}>
                <div style={{color:'#C6A03C',display:'flex',justifyContent:'center',marginBottom:8}}>{s.icon}</div>
                <div style={{fontSize:'1.6rem',fontWeight:700,color:'white',fontFamily:"'Cormorant Garamond',serif"}}>{s.val}</div>
                <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.55)',marginTop:2}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{background:'#F0FAF3'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:48}}>
            <span className="eyebrow">What You Get</span>
            <h2 style={{fontSize:'clamp(1.8rem,4vw,2.5rem)',color:'#163a3d'}}>Built for the long haul, not the quick fix</h2>
          </div>
          <div className="grid-4">
            {[
              {icon:<Video size={24}/>,color:'#1F5154',title:'Live Monthly Classes',desc:'90-min sessions capped at 12. Real conversation, not lecture.'},
              {icon:<BookOpen size={24}/>,color:'#C6A03C',title:'Content Library',desc:'Every past class, worksheet, and guide. Yours to access any time.'},
              {icon:<MessageCircle size={24}/>,color:'#9FE0B4',title:'Community Forum',desc:'A private space of people who don\'t need you to explain it.'},
              {icon:<Lock size={24}/>,color:'#C7B6EA',title:'CoP Cohort Access',desc:'The annual cohort program   member waitlist gets first access.'},
            ].map(f=>(
              <div key={f.title} style={{background:'white',borderRadius:12,padding:'28px 22px',boxShadow:'0 2px 16px rgba(31,81,84,0.06)'}}>
                <div style={{width:48,height:48,borderRadius:'50%',background:`${f.color}18`,display:'flex',alignItems:'center',justifyContent:'center',color:f.color,marginBottom:16}}>{f.icon}</div>
                <h4 style={{fontSize:'1rem',color:'#163a3d',marginBottom:8}}>{f.title}</h4>
                <p style={{fontSize:'0.85rem',color:'#6b6b6b',lineHeight:1.65}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:48}}>
            <span className="eyebrow">Membership Tiers</span>
            <h2 style={{fontSize:'clamp(1.8rem,4vw,2.5rem)',color:'#163a3d'}}>Choose your level of support</h2>
          </div>
          <div className="grid-2" style={{maxWidth:760,margin:'0 auto',gap:24}}>
            {tiers.map(t=>(
              <div key={t.name} style={{
                border: t.featured?`2px solid ${t.color}`:'2px solid #e8e8e8',
                borderRadius:12, padding:'36px 28px',
                background: t.featured?'white':'#FAFAFA',
                position:'relative',
                boxShadow: t.featured?'0 12px 40px rgba(198,160,60,0.15)':'none',
              }}>
                {t.featured && <div style={{position:'absolute',top:-14,left:'50%',transform:'translateX(-50%)',background:'#C6A03C',color:'#163a3d',fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'4px 16px',borderRadius:12}}>Most Popular</div>}
                <div style={{fontSize:'0.8rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:t.color,marginBottom:8}}>{t.name}</div>
                <div style={{fontSize:'2rem',fontWeight:700,color:'#163a3d',fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>{t.price}</div>
                <p style={{fontSize:'0.85rem',color:'#6b6b6b',lineHeight:1.65,marginBottom:24}}>{t.desc}</p>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10,marginBottom:28}}>
                  {t.features.map(f=>(
                    <li key={f} style={{display:'flex',gap:10,alignItems:'flex-start',fontSize:'0.85rem',color:'#3d3d3d'}}>
                      <Check size={15} style={{color:t.color,flexShrink:0,marginTop:2}}/>{f}
                    </li>
                  ))}
                </ul>
                <button
                  className={t.featured?'btn-primary':'btn-outline'}
                  style={{width:'100%',justifyContent:'center',fontSize:'0.9rem'}}
                  onClick={()=>setModal('assessment')}
                >
                  {t.cta} <ArrowRight size={15}/>
                </button>
              </div>
            ))}
          </div>
          <p style={{textAlign:'center',marginTop:24,fontSize:'0.82rem',color:'#9b9b9b'}}>
            Cancel any time. No lock-in. 30-day money-back guarantee.
          </p>
        </div>
      </section>

      {/* CoP Waitlist */}
      <section className="section" style={{background:'#1F5154'}}>
        <div className="container" style={{maxWidth:640,textAlign:'center'}}>
          <span className="tag" style={{color:'#9FE0B4'}}>Coming October 2025</span>
          <h2 style={{color:'white',marginBottom:16}}>The CoP Cohort   Join the Waitlist</h2>
          <p style={{color:'rgba(255,255,255,0.75)',marginBottom:28,fontSize:'0.95rem',lineHeight:1.75}}>
            A structured 12-week cohort for people ready to do the deepest version of this work. 
            Capped at 20. Members get first access.
          </p>
          {waitlistDone ? (
            <p style={{color:'#9FE0B4',fontWeight:600,fontSize:'0.95rem'}}>✓ You're on the list. We'll email you when applications open.</p>
          ) : (
            <form onSubmit={joinWaitlist} style={{display:'flex',gap:12,maxWidth:400,margin:'0 auto',flexWrap:'wrap',justifyContent:'center'}}>
              <input type="email" placeholder="your@email.com" value={waitlistEmail} onChange={e=>setWaitlistEmail(e.target.value)} required
                style={{flex:1,minWidth:220,padding:'13px 16px',borderRadius:8,border:'none',fontSize:'0.9rem',fontFamily:'DM Sans,sans-serif'}}/>
              <button type="submit" className="btn-primary" disabled={waitlistSubmitting} style={{whiteSpace:'nowrap'}}>
                {waitlistSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
              {waitlistError && <p style={{width:'100%',color:'#f5a3a3',fontSize:'0.8rem',marginTop:4}}>{waitlistError}</p>}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
