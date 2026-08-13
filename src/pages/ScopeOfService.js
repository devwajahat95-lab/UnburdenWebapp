import { AlertTriangle, Phone, MessageSquare, Heart } from 'lucide-react';

export default function ScopeOfService() {
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="tag" style={{color:'#C7B6EA'}}>Non-Negotiable Clarity</span>
          <h1>Scope of Service</h1>
          <p>Honest, clear, and required. Read before booking.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{maxWidth:760}}>
          <div style={{background:'#fff8e8',border:'2px solid #C6A03C',borderRadius:12,padding:'24px 28px',marginBottom:40,display:'flex',gap:16,alignItems:'flex-start'}}>
            <AlertTriangle size={24} style={{color:'#C6A03C',flexShrink:0,marginTop:2}}/>
            <div>
              <strong style={{color:'#163a3d',display:'block',marginBottom:8}}>If you are in crisis right now:</strong>
              <p style={{color:'#3d3d3d',margin:0,lineHeight:1.7}}>
                Call or text <strong style={{color:'#1F5154'}}>988</strong> (Suicide and Crisis Lifeline) · 
                Text HOME to <strong style={{color:'#1F5154'}}>741741</strong> (Crisis Text Line) · 
                Call <strong style={{color:'#1F5154'}}>911</strong> · 
                Go to your nearest emergency room.
              </p>
            </div>
          </div>

          <h2 style={{fontSize:'1.8rem',color:'#163a3d',marginBottom:16}}>What The Unburdened Collective Is</h2>
          <p style={{color:'#3d3d3d',lineHeight:1.8,marginBottom:16}}>The Unburdened Collective offers <strong>coaching</strong> and <strong>psychoeducation</strong>. These are distinct from therapy and clinical treatment. Emily Bliss holds an LMHC license   that clinical credential informs the quality and rigor of this work. It does not make the work therapy.</p>
          <p style={{color:'#3d3d3d',lineHeight:1.8,marginBottom:32}}>Coaching is a forward-focused, action-oriented partnership. Psychoeducation provides information about psychological concepts and frameworks. Both can be powerful. Neither is a substitute for clinical care.</p>

          <h2 style={{fontSize:'1.8rem',color:'#163a3d',marginBottom:16}}>What This Work Is Not</h2>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
            {[
              'A licensed therapy practice or clinical mental health treatment',
              'Diagnosis, assessment, or treatment of any mental health condition',
              'Crisis intervention or emergency mental health services',
              'A substitute for medication management or psychiatric care',
              'A replacement for an ongoing therapeutic relationship',
            ].map(i=>(
              <li key={i} style={{display:'flex',gap:12,alignItems:'flex-start',color:'#3d3d3d',fontSize:'0.95rem',padding:'10px 14px',background:'#FAF8F4',borderRadius:8,borderLeft:'3px solid #C7B6EA'}}>
                <span style={{color:'#C7B6EA',fontWeight:700,flexShrink:0}}>✗</span> {i}
              </li>
            ))}
          </ul>

          <h2 style={{fontSize:'1.8rem',color:'#163a3d',marginBottom:16}}>Who This Is For</h2>
          <p style={{color:'#3d3d3d',lineHeight:1.8,marginBottom:32}}>This work is appropriate for adults who are functioning   working, managing their lives, navigating real stress   and looking for a framework and community to help them do it more sustainably. If you're in active crisis, experiencing symptoms of a serious mental health condition, or have been recently hospitalized for mental health reasons, please work with a licensed clinician before engaging with coaching.</p>

          <h2 style={{fontSize:'1.8rem',color:'#163a3d',marginBottom:16}}>Crisis Resources</h2>
          <div className="grid-3" style={{marginBottom:32,gap:16}}>
            {[
              {icon:<Phone size={20}/>,color:'#1F5154',name:'988 Lifeline',detail:'Call or text 988',sub:'24/7, free, confidential'},
              {icon:<MessageSquare size={20}/>,color:'#C6A03C',name:'Crisis Text Line',detail:'Text HOME to 741741',sub:'24/7 text-based support'},
              {icon:<Heart size={20}/>,color:'#C7B6EA',name:'Emergency Services',detail:'Call 911',sub:'Life-threatening emergencies'},
            ].map(r=>(
              <div key={r.name} style={{background:'white',border:'1px solid #e8e8e8',borderRadius:12,padding:'20px',textAlign:'center'}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:`${r.color}12`,display:'flex',alignItems:'center',justifyContent:'center',color:r.color,margin:'0 auto 12px'}}>{r.icon}</div>
                <div style={{fontWeight:600,color:'#163a3d',fontSize:'0.9rem',marginBottom:4}}>{r.name}</div>
                <div style={{color:'#1F5154',fontWeight:600,fontSize:'0.85rem',marginBottom:4}}>{r.detail}</div>
                <div style={{color:'#9b9b9b',fontSize:'0.78rem'}}>{r.sub}</div>
              </div>
            ))}
          </div>

          <div style={{background:'#FAF8F4',borderRadius:12,padding:'24px',border:'1px solid rgba(31,81,84,0.08)'}}>
            <p style={{fontSize:'0.82rem',color:'#6b6b6b',lineHeight:1.8,margin:0}}>
              This scope of service is adapted from the psychoeducational disclaimer used across all Blissful Balance LLC / Unburdened Life framework materials. 
              It is reviewed regularly and updated as needed. Questions: <a href="mailto:hello@unburdenedcollective.com" style={{color:'#1F5154'}}>hello@unburdenedcollective.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
