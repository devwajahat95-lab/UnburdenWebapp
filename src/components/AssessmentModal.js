import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

const questions = [
  {
    q: "When you lay your head down at night, what shows up most?",
    options: ["Replaying the day's mistakes", "Worry about what's coming tomorrow", "A numb kind of exhaustion", "Guilt about what I didn't do"],
  },
  {
    q: "Which of these feels most true right now?",
    options: ["I'm giving past empty", "I've lost who I was before this job", "I'm performing okay but dying inside", "I don't know what I want anymore"],
  },
  {
    q: "What's the weight you're carrying that isn't yours?",
    options: ["Other people's expectations", "A role I outgrew but can't leave", "My organization's dysfunction", "A version of myself I was supposed to be"],
  },
  {
    q: "What would putting the sack down look like for you?",
    options: ["Real rest   not earned, just taken", "Work that doesn't hollow me out", "Relationships where I'm not the fixer", "Permission to want something different"],
  },
];

export default function AssessmentModal({ onClose }) {
  // step: 0=intro, 1-4=questions, 5=email, 6=done
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const totalSteps = 5; // 4 questions + email = 5 pip stops
  const currentQ = (step >= 1 && step <= 4) ? questions[step - 1] : null;

  const pick = (opt) => {
    setAnswers(a => ({ ...a, [step]: opt }));
    setStep(s => s + 1);
  };

  const submit = () => { if (email) setStep(6); };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="assessment-card">
        {/* Close */}
        <button className="modal-close-btn" onClick={onClose}><X size={15} /></button>

        {/* Progress pips (steps 1-5) */}
        {step > 0 && step < 6 && (
          <div className="progress-bar">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`progress-pip${i <= step ? ' filled' : ''}`} />
            ))}
          </div>
        )}

        {/* ── INTRO ── */}
        {step === 0 && (
          <div className="step-panel" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(159,224,180,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px', fontSize: '1.8rem',
            }}>🌿</div>
            <span className="eyebrow" style={{ color: '#1F5154' }}>The Unburdening Assessment</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#163a3d', margin: '4px 0 7px' }}>
              What's in the sack you're carrying?
            </h2>
            <p style={{ color: '#6b6b6b', lineHeight: 1.7, fontSize: '0.92rem', maxWidth: 380, margin: '0 auto 14px' }}>
              Four questions. Two minutes. No right answers   just honest ones.
              You'll get a personalised reflection and a free starter guide.
            </p>
            <button className="btn-primary" onClick={() => setStep(1)} style={{ width: '100%', justifyContent: 'center', padding: '7px' }}>
              Start the Assessment <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── QUESTIONS ── */}
        {currentQ && (
          <div className="step-panel">
            <p style={{ fontSize: '0.72rem', color: '#9b9b9b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>
              Question {step} of 4
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.15rem,2.5vw,1.45rem)', color: '#163a3d', marginBottom: 10, lineHeight: 1.3 }}>
              {currentQ.q}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              {currentQ.options.map((opt, i) => (
                <button key={i} className="option-btn" onClick={() => pick(opt)}>
                  {opt}
                  <ChevronRight size={15} color="#9b9b9b" style={{ flexShrink: 0, marginLeft: 8 }} />
                </button>
              ))}
            </div>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                background: 'none', border: 'none', color: '#9b9b9b',
                fontSize: '0.8rem', marginTop: 7, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
              }}>
                <ChevronLeft size={13} /> Back
              </button>
            )}
          </div>
        )}

        {/* ── EMAIL ── */}
        {step === 5 && (
          <div className="step-panel">
            <span className="eyebrow">Almost there</span>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', color: '#163a3d', marginBottom: 5 }}>
              Where should we send your results?
            </h3>
            <p style={{ color: '#6b6b6b', marginBottom: 10, fontSize: '0.88rem', lineHeight: 1.65 }}>
              Your personalised reflection + the Put the Sack Down starter guide lands in your inbox.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Your first name"
                style={{ border: '1.5px solid rgba(31,81,84,0.18)', padding: '12px 14px', fontSize: '0.9rem', background: 'white' }}
              />
              <input
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                type="email"
                style={{ border: '1.5px solid rgba(31,81,84,0.18)', padding: '12px 14px', fontSize: '0.9rem', background: 'white' }}
              />
              <button className="btn-primary" onClick={submit} style={{ width: '100%', justifyContent: 'center', padding: '7px', marginTop: 2 }}>
                Send My Results
              </button>
            </div>
            <button onClick={() => setStep(4)} style={{
              background: 'none', border: 'none', color: '#9b9b9b',
              fontSize: '0.8rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
            }}>
              <ChevronLeft size={13} /> Back
            </button>
          </div>
        )}

        {/* ── DONE ── */}
        {step === 6 && (
          <div className="step-panel" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div style={{
              width: 36, height: 36, background: 'rgba(159,224,180,0.2)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 10px', fontSize: '2rem',
            }}>🌿</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.3rem,3vw,1.8rem)', color: '#163a3d', marginBottom: 6 }}>
              The sack's getting lighter already.
            </h3>
            <p style={{ color: '#6b6b6b', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: 14 }}>
              Check your inbox. Your results and the starter guide are on their way.
              Welcome to the Collective.
            </p>
            <button className="btn-outline" onClick={onClose} style={{ margin: '0 auto' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
