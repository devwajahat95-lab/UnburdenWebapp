import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, BookOpen, Users, Calendar, Play } from 'lucide-react';
import TiltCard from '../components/TiltCard';

// Inline reveal hook for this file
function useReveal(threshold = 0.13) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

const testimonials = [
  { name: "Marcus T.", role: "ICU Nurse, 14 years", quote: "I thought grinding was just the price of caring. Emily helped me see I had been carrying a sack that was not mine for a decade. I put it down.", stars: 5 },
  { name: "Renee A.", role: "School Principal", quote: "This is not therapy-lite. It is its own thing   real, grounded, no fluff. My team noticed a difference in me before I did.", stars: 5 },
  { name: "David K.", role: "Social Work Director", quote: "The Truth Tax framework alone was worth every penny. I finally had language for what had been draining me for years.", stars: 5 },
];

const features = [
  "Clinical LMHC credential + lived experience   not one or the other",
  "Proprietary framework built from moral injury research",
  "Coaching that meets you in the real cost of over-leveraging yourself",
  "A community of people who understand the burnout",
];

const pills = ['Put the Sack Down', 'The Truth Tax', 'Self-Stewardship', 'Break Out, Not Drop Out',
               'Put the Sack Down', 'The Truth Tax', 'Self-Stewardship', 'Break Out, Not Drop Out'];

export default function Home({ onAssessment }) {
  const secRef = useReveal();
  const sec2Ref = useReveal();
  const sec3Ref = useReveal();
  const sec4Ref = useReveal();

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero" style={{
        minHeight: '70vh',
        background: 'linear-gradient(145deg, #163a3d 0%, #1F5154 55%, #2a6b6f 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 10,
      }}>
        {/* Bg texture */}
        <div style={{ position:'absolute',inset:0, backgroundImage:`url(https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&q=80)`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.07 }}/>
        {/* Floating orb */}
        <div className="hero-orb hero-radial" style={{ position:'absolute',top:'18%',right:'5%', width:480,height:480,borderRadius:'50%', background:'radial-gradient(circle,rgba(198,160,60,0.14) 0%,transparent 70%)', }}/>
        {/* Lilac orb */}
        <div className="hero-orb" style={{ position:'absolute',bottom:'10%',left:'3%', width:300,height:300,borderRadius:'50%', background:'radial-gradient(circle,rgba(199,182,234,0.08) 0%,transparent 70%)', animationDelay:'2.5s', }}/>

        <div className="container" style={{ position:'relative',zIndex:1 }}>
          <div className="hero-inner">
            {/* Text */}
            <div className="hero-text">
              <div style={{
                display:'inline-flex',alignItems:'center',gap:4,
                background:'rgba(198,160,60,0.14)', border:'1px solid rgba(198,160,60,0.32)',
                color:'#C6A03C', fontSize:'0.7rem', fontWeight:600,
                letterSpacing:'0.13em', textTransform:'uppercase',
                padding:'3px 7px', borderRadius:10, marginBottom:11,
                animation:'fadeIn 0.6s ease forwards',
              }}>
                ✦ Coaching · Community · Clarity
              </div>
              <h1 style={{
                fontSize:'clamp(2.6rem,5.5vw,4.4rem)',
                color:'white', fontFamily:"'Cormorant Garamond',serif",
                lineHeight:1.08, marginBottom:11,
                animation:'fadeIn 0.7s ease 0.1s both',
              }}>
                You have been giving<br/>
                <em style={{ color:'#C6A03C', fontStyle:'italic' }}>past empty.</em><br/>
                <span style={{ fontSize:'0.85em', opacity:0.9 }}>Time to put the sack down.</span>
              </h1>
              <p style={{
                fontSize:'1.05rem', color:'rgba(255,255,255,0.75)',
                maxWidth:460, marginBottom:0, lineHeight:1.8,
                animation:'fadeIn 0.7s ease 0.2s both',
              }}>
                Workplace PTSD and moral injury do not fix themselves with more hustle.
                The Unburdened Collective is where high-achieving, over-leveraged people
                find a framework that fits what they carry.
              </p>
            </div>

            {/* CTA card   reference image style */}
            <div className="hero-cta cta-panel-dark" style={{
              background:'rgba(255,255,255,0.06)',
              border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:8, padding:'14px 12px', backdropFilter:'blur(6px)',
              animation:'fadeIn 0.7s ease 0.3s both',
            }}>
              <div style={{ fontSize:'0.72rem',color:'rgba(255,255,255,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:5 }}>START HERE</div>
              <h3 style={{ color:'white',fontFamily:"'Cormorant Garamond',serif",fontSize:'1.2rem',marginBottom:4,lineHeight:1.3 }}>
                The Free Unburdening Assessment
              </h3>
              <p style={{ fontSize:'0.84rem',color:'rgba(255,255,255,0.6)',lineHeight:1.65,marginBottom:10 }}>
                4 questions. 2 minutes. A personalised reflection and your first framework tool   free.
              </p>
              <button className="btn-primary" onClick={onAssessment} style={{ width:'100%', justifyContent:'center', fontSize:'0.95rem', padding:'7px' }}>
                Take the Assessment <ArrowRight size={16}/>
              </button>
              <Link to="/work-with-me" className="btn-outline" style={{
                width:'100%', justifyContent:'center', marginTop:5,
                color:'rgba(255,255,255,0.8)', borderColor:'rgba(255,255,255,0.28)',
              }}>
                See How We Work
              </Link>
              <div style={{ display:'flex',gap:10,marginTop:10,paddingTop:9,borderTop:'1px solid rgba(255,255,255,0.1)' }}>
                {['LMHC Licensed','800+ Coached','5-Star'].map(s => (
                  <div key={s} style={{ fontSize:'0.7rem',color:'rgba(255,255,255,0.5)',textAlign:'center',flex:1 }}>
                    <div style={{ color:'#C6A03C',fontSize:'1rem',fontWeight:700,fontFamily:"'Cormorant Garamond',serif" }}>✓</div>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER STRIP ── */}
      <div style={{ background:'#C6A03C', padding:'7px 0', overflow:'hidden' }}>
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...pills, ...pills].map((p, i) => (
              <span key={i} style={{ color:'#163a3d', fontWeight:600, fontSize:'0.8rem', letterSpacing:'0.04em', padding:'0 16px', borderRight: i % 8 !== 7 ? '1px solid rgba(22,58,61,0.2)' : 'none' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── ABOUT / WHAT THIS IS ── */}
      <section className="section" style={{ background:'#F0FAF3' }}>
        <div className="container">
          <div ref={secRef} className="grid-2 reveal" style={{ gap:28, alignItems:'center' }}>
            <div>
              <span className="eyebrow">What This Is Really About</span>
              <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.7rem)', color:'#163a3d', marginBottom:9 }}>
                Moral injury does not look like a breakdown.<br />It looks like <em>you.</em>
              </h2>
              <p style={{ color:'#3d3d3d', fontSize:'0.97rem', lineHeight:1.85, marginBottom:9 }}>
                High-functioning. Still showing up. Saying yes when you mean no. Covering gaps that are not your job.
                Absorbing harm you did not cause. That is not resilience   that is the Truth Tax. And it compounds.
              </p>
              <p style={{ color:'#3d3d3d', fontSize:'0.97rem', lineHeight:1.85, marginBottom:13 }}>
                Emily Bliss, LMHC, built this framework from clinical training and the inside of a hospital during a
                cardiac event   she knows what it costs to keep carrying what does not belong to you.
              </p>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:5, marginBottom:14 }}>
                {features.map((f, i) => (
                  <li key={i} style={{ display:'flex', gap:11, alignItems:'flex-start', fontSize:'0.88rem', color:'#3d3d3d' }}>
                    <CheckCircle size={16} style={{ color:'#1F5154', flexShrink:0, marginTop:2 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                <Link to="/about" className="btn-outline">Meet Emily</Link>
                <button className="btn-primary" onClick={onAssessment}>Start the Assessment</button>
              </div>
            </div>

            {/* Image with badge   reference card style */}
            <div style={{ position:'relative', height:'100%' }}>
              <div style={{ borderRadius:7, overflow:'hidden', boxShadow:'0 12px 32px rgba(31,81,84,0.18)', height:'100%' }}>
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80" alt="Emily coaching" style={{ width:'100%', height:'100%', display:'block', objectFit:'cover' }}/>
              </div>
              {/* Float badge */}
              <div style={{ position:'absolute', bottom:-10, left:-10, background:'#1F5154', color:'white', padding:'9px 11px', borderRadius:6, boxShadow:'0 5px 16px rgba(31,81,84,0.28)', minWidth:180 }}>
                <div style={{ fontSize:'2rem', fontFamily:"'Cormorant Garamond',serif", color:'#C6A03C', fontWeight:700, lineHeight:1 }}>800+</div>
                <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.7)', marginTop:2 }}>people who put the sack down</div>
              </div>
              {/* Lilac accent dot */}
              <div style={{ position:'absolute', top:-7, right:-7, width:24, height:24, borderRadius:'50%', background:'rgba(199,182,234,0.55)', backdropFilter:'blur(2px)' }}/>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 PATHS   styled like reference cards ── */}
      <section className="section" ref={sec2Ref}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom:44 }}>
            <span className="eyebrow">Choose Your Path</span>
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.5rem)', color:'#163a3d' }}>How We Work Together</h2>
          </div>
          <div className="grid-3">
            {[
              { icon:<Calendar size={26}/>, title:'1:1 Coaching', desc:'Direct, deep, outcome-led. For the person ready to stop performing okay.', link:'/work-with-me', cta:'Book a Session', accent:'#1F5154', bg:'rgba(31,81,84,0.07)', delay:'d1' },
              { icon:<Users size={26}/>, title:'The Collective', desc:'Monthly membership with live practice, a content library, and a community who gets it.', link:'/collective', cta:'Join the Collective', accent:'#C6A03C', bg:'rgba(198,160,60,0.08)', delay:'d2' },
              { icon:<BookOpen size={26}/>, title:'Workbooks & Guides', desc:'The framework in your hands. Start with the Unburdening Assessment or the Energy Map.', link:'/shop', cta:'Browse the Shop', accent:'#9FE0B4', bg:'rgba(159,224,180,0.12)', delay:'d3' },
            ].map(p => (
              <TiltCard key={p.title} className={`card reveal-item ${p.delay}`} style={{ padding:'16px 12px', textAlign:'center', borderRadius:7 }} max={8}>
                <div style={{ width:26, height:26, borderRadius:6, background:p.bg, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 9px', color:p.accent }}>
                  {p.icon}
                </div>
                <h3 style={{ fontSize:'1.2rem', color:'#163a3d', marginBottom:5 }}>{p.title}</h3>
                <p style={{ color:'#6b6b6b', fontSize:'0.87rem', lineHeight:1.7, marginBottom:11 }}>{p.desc}</p>
                <Link to={p.link} className="btn-outline" style={{ fontSize:'0.83rem', padding:'4px 10px' }}>{p.cta}</Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS   dark section ── */}
      <section className="section" style={{ background:'#163a3d' }} ref={sec3Ref}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom:44 }}>
            <span className="tag" style={{ color:'#9FE0B4' }}>What People Say</span>
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.4rem)', color:'white' }}>
              They came in depleted.<br />They left with their sack on the ground.
            </h2>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <TiltCard key={i} className={`reveal-item d${i+1}`} max={6} style={{
                background:'rgba(255,255,255,0.055)',
                border:'1px solid rgba(159,224,180,0.18)',
                borderRadius:7, padding:'13px 11px',
              }}>
                <div style={{ display:'flex', gap:1, marginBottom:7 }}>
                  {[...Array(t.stars)].map((_, j) => <Star key={j} size={13} fill="#C6A03C" color="#C6A03C"/>)}
                </div>
                <p style={{ color:'rgba(255,255,255,0.82)', fontSize:'0.88rem', lineHeight:1.75, marginBottom:9, fontStyle:'italic' }}>
                  "{t.quote}"
                </p>
                <div style={{ borderTop:'1px solid rgba(159,224,180,0.15)', paddingTop:7 }}>
                  <div style={{ fontWeight:600, color:'white', fontSize:'0.88rem' }}>{t.name}</div>
                  <div style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.78rem', marginTop:1 }}>{t.role}</div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── PODCAST TEASER   reference card layout ── */}
      <section className="section" style={{ background:'#FAF8F4' }}>
        <div className="container">
          <div className="grid-2" style={{ gap:32, alignItems:'stretch' }}>
            {/* Big featured card */}
            <div style={{ borderRadius:7, overflow:'hidden', position:'relative', minHeight:140, cursor:'pointer', boxShadow:'0 4px 16px rgba(31,81,84,0.12)' }}
              className="lift">
              <img src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=700&q=80" alt="Podcast" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(22,58,61,0.92) 0%,rgba(22,58,61,0.2) 60%,transparent 100%)' }}/>
              <div style={{ position:'absolute', bottom:12, left:12, right:12 }}>
                <div style={{ fontSize:'0.7rem', color:'#9FE0B4', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:3 }}>Latest Episode · Ep 42</div>
                <h3 style={{ color:'white', fontFamily:"'Cormorant Garamond',serif", fontSize:'1.15rem', lineHeight:1.35, marginBottom:7 }}>
                  When Staying Is the Problem   Moral Injury and the Cost of Loyalty
                </h3>
                <Link to="/podcast" style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#C6A03C', color:'#163a3d', padding:'4px 9px', borderRadius:4, fontSize:'0.82rem', fontWeight:600 }}>
                  <Play size={13} fill="currentColor"/> Listen Now
                </Link>
              </div>
            </div>

            {/* Stack of smaller cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { ep:41, title:"The Truth Tax: What You're Paying That Never Shows Up on a Budget", img:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80' },
                { ep:40, title:"Giving Past Empty Is Not Dedication. It Is Structural.", img:'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&q=80' },
                { ep:39, title:"Self-Stewardship Is Not Self-Care", img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80' },
              ].map(ep => (
                <Link key={ep.ep} to="/podcast" style={{ display:'flex', gap:7, alignItems:'center', background:'white', borderRadius:6, padding:'7px', boxShadow:'0 2px 12px rgba(31,81,84,0.07)', transition:'transform 0.25s,box-shadow 0.25s', cursor:'pointer' }}
                  className="lift">
                  <img src={ep.img} alt="" style={{ width:30, height:30, borderRadius:4, objectFit:'cover', flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'0.68rem', color:'#9b9b9b', marginBottom:2 }}>Ep {ep.ep}</div>
                    <div style={{ fontSize:'0.84rem', color:'#163a3d', fontWeight:500, lineHeight:1.4 }}>{ep.title}</div>
                  </div>
                  <Play size={14} color="#C6A03C" style={{ flexShrink:0 }}/>
                </Link>
              ))}
              <Link to="/podcast" className="btn-outline" style={{ justifyContent:'center', marginTop:2 }}>
                All Episodes <ArrowRight size={15}/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section ref={sec4Ref} className="section cta-panel-dark" style={{ background:'#1F5154', textAlign:'center' }}>
        <div className="container reveal" style={{ maxWidth:600 }}>
          <span className="tag" style={{ color:'#9FE0B4' }}>Ready?</span>
          <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.6rem)', color:'white', marginBottom:7 }}>
            The sack does not get lighter from carrying it longer.
          </h2>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.97rem', lineHeight:1.75, marginBottom:14 }}>
            Take the free Unburdening Assessment. Five minutes to name what has been
            weighing you down   and where to start putting it down.
          </p>
          <button className="btn-primary" onClick={onAssessment} style={{ fontSize:'1rem', padding:'7px 18px' }}>
            Take the Assessment   Free <ArrowRight size={17}/>
          </button>
          <p style={{ marginTop:7, fontSize:'0.78rem', color:'rgba(255,255,255,0.4)' }}>
            No credit card. No pushy emails. Just honest next steps.
          </p>
        </div>
      </section>
    </div>
  );
}
