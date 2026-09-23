import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function CalEmbed({ calLink }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cal.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <div
      data-cal-link={calLink}
      data-cal-config='{"layout":"month_view"}'
      style={{ width: '100%', height: 640 }}
    />
  );
}

export default function BookingModal({ type, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:'', email:'', goal:'', prior:'', scope: false });
  const [done, setDone] = useState(false);

  const titles = {
    coaching: 'Book a Coaching Session',
    class: 'Reserve Your Spot   Group Class',
    intensive: 'Apply for an Intensive',
    assessment: 'Take the Unburdening Assessment',
  };

  const set = k => e => setForm(f => ({...f, [k]: e.target.type==='checkbox' ? e.target.checked : e.target.value}));

  const submit = e => { e.preventDefault(); setDone(true); };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><X size={20}/></button>
        {done ? (
          <div style={{textAlign:'center',padding:'20px 0'}}>
            <div style={{fontSize:'3rem',marginBottom:16}}>✓</div>
            <h3>You're confirmed.</h3>
            <p>Check your email for next steps. Emily looks forward to the conversation.</p>
            <button className="btn-primary" style={{marginTop:24}} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h3>{titles[type] || 'Book a Session'}</h3>
            <p>All 1:1 work is coaching — not therapy. <a href="/scope-of-service" target="_blank" style={{color:'#1F5154'}}>See scope of service →</a></p>

            {/* Replace native form with Cal.com embed for bookings (coaching/intensive/class) */}
            {type && type !== 'assessment' ? (
              <CalEmbed calLink="emily-hartwell/coaching-session" />
            ) : (
              /* keep the lightweight assessment flow as the existing form */
              <form onSubmit={submit}>
                <input placeholder="Full name" value={form.name} onChange={set('name')} required/>
                <input type="email" placeholder="Email address" value={form.email} onChange={set('email')} required/>
                <select value={form.goal} onChange={set('goal')} required>
                  <option value="">What's feeling heaviest right now?</option>
                  <option>Workplace burnout / moral injury</option>
                  <option>Leadership pressure</option>
                  <option>Caregiver overload</option>
                  <option>Life transition</option>
                  <option>I'm not sure yet</option>
                </select>
                <textarea placeholder="Briefly describe what’s been weighing on you..." rows={3} value={form.prior} onChange={set('prior')} style={{resize:'vertical'}}/>
                <div className="scope-note">
                  <strong>Scope acknowledgment:</strong> I understand The Unburdened Collective offers coaching and psychoeducation — not therapy, diagnosis, or crisis care. For mental health emergencies I will contact 988, Crisis Text Line, or 911.
                </div>
                <label style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:16,cursor:'pointer',fontSize:'0.85rem',color:'#3d3d3d'}}>
                  <input type="checkbox" checked={form.scope} onChange={set('scope')} required style={{width:'auto',marginTop:2}}/>
                  I've read and agree to the scope of service above.
                </label>
                <button className="btn-primary" type="submit">Start the Assessment →</button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
