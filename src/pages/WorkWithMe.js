import { useState } from 'react';
import { Clock, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const services = [
  {
    type:'coaching', icon:<Clock size={32}/>, color:'#1F5154',
    title:'1:1 Coaching',
    tagline:'For the person who knows something has to change.',
    desc:'Recurring sessions built around your specific weight   burnout, moral injury, caregiver overload, leadership pressure. Not advice. Not therapy. A framework that names what’s happening and builds the path out.',
    includes:['60-min bi-weekly sessions','Intake + ongoing progress tracking','Asynchronous support between sessions','Access to the full workbook library','Priority booking for group classes'],
    price:'$350 / session or $1,200 / 4-pack',
    img:'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&q=80',
  },
  {
    type:'class', icon:<Users size={32}/>, color:'#C6A03C',
    title:'Group Classes',
    tagline:'Capped at 12. Live. No performance required.',
    desc:'Monthly 90-minute live sessions on specific themes   the Truth Tax, workplace PTSD, giving past empty. Come as you are. The format is conversation, not lecture.',
    includes:['90-min live Zoom session','Recording available 48hr after','Companion worksheet','Community thread in The Collective','Monthly theme rotation'],
    price:'$65 per class · $180 / quarter',
    img:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80',
  },
  {
    type:'intensive', icon:<Zap size={32}/>, color:'#C7B6EA',
    title:'Intensives',
    tagline:'One extended session. Real movement.',
    desc:'A half-day or full-day deep dive for those at a crossroads   transition, crisis of direction, or simply ready to do the hard part fast. High-ticket. High-contact. Limited availability.',
    includes:['3hr or 6hr single session','Pre-intensive intake + goal mapping','Post-intensive follow-up call','30-day email access','Personalized framework doc delivered after'],
    price:'$950 (half-day) · $1,800 (full-day)',
    img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80',
  },
];

export default function WorkWithMe() {
  const [modal, setModal] = useState(null);
  return (
    <div>
      {modal && <BookingModal type={modal} onClose={()=>setModal(null)}/>}
      <section className="page-hero">
        <div className="container">
          <span className="tag" style={{color:'#9FE0B4'}}>Coaching, Classes &amp; Intensives</span>
          <h1>Work With Me</h1>
          <p>Three distinct ways to engage. All grounded in the same framework. None of it is therapy   and that is the point.</p>
        </div>
      </section>

      <section style={{background:'#FAF8F4',padding:'16px 0'}}>
        <div className="container">
          <div className="disclaimer-banner">
            <strong>Scope of service:</strong> All offerings   coaching, classes, and intensives   are coaching and psychoeducation, not therapy, clinical treatment, or crisis care. If you are in crisis: <a href="tel:988">988</a> · <a href="https://crisistextline.org">Crisis Text Line</a> · 911. <a href="/scope-of-service">Full scope →</a>
          </div>
        </div>
      </section>

      {services.map((s,i)=>(
        <section key={s.type} className="section" style={{background: i%2===0?'white':'#FAF8F4'}}>
          <div className="container">
            <div className="grid-2" style={{gap:64,alignItems:'center',direction: i===1?'rtl':'ltr'}}>
              <div style={{direction:'ltr'}}>
                <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
                  <div style={{width:56,height:56,borderRadius:'50%',background:`${s.color}15`,display:'flex',alignItems:'center',justifyContent:'center',color:s.color,flexShrink:0}}>
                    {s.icon}
                  </div>
                  <div>
                    <span className="eyebrow" style={{margin:0}}>{s.title}</span>
                    <div style={{fontSize:'0.85rem',color:'#6b6b6b',marginTop:2}}>{s.tagline}</div>
                  </div>
                </div>
                <p style={{color:'#3d3d3d',lineHeight:1.8,marginBottom:24,fontSize:'1rem'}}>{s.desc}</p>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10,marginBottom:28}}>
                  {s.includes.map(item=>(
                    <li key={item} style={{display:'flex',gap:10,alignItems:'flex-start',fontSize:'0.88rem',color:'#3d3d3d'}}>
                      <CheckCircle size={16} style={{color:'#1F5154',flexShrink:0,marginTop:2}}/>
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{display:'flex',alignItems:'center',gap:24,flexWrap:'wrap'}}>
                  <div style={{fontSize:'1.1rem',fontWeight:700,color:'#163a3d'}}>{s.price}</div>
                  <button className="btn-primary" onClick={()=>setModal(s.type)}>
                    Book Now <ArrowRight size={16}/>
                  </button>
                </div>
              </div>
              <img src={s.img} alt={s.title} style={{width:'100%',borderRadius:12,boxShadow:'0 12px 40px rgba(31,81,84,0.15)',direction:'ltr'}}/>
            </div>
          </div>
        </section>
      ))}

      <section className="section" style={{background:'#1F5154',textAlign:'center'}}>
        <div className="container" style={{maxWidth:600}}>
          <h2 style={{color:'white',marginBottom:16}}>Not sure where to start?</h2>
          <p style={{color:'rgba(255,255,255,0.75)',marginBottom:28}}>Take the Unburdening Assessment. It takes five minutes and tells you exactly which path fits where you are right now.</p>
          <button className="btn-white" onClick={()=>setModal('assessment')}>Take the Assessment   Free <ArrowRight size={16}/></button>
        </div>
      </section>
    </div>
  );
}
