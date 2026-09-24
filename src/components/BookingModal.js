import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// TODO: these are placeholder slugs (Section 2.7 of the spec). Replace with
// Emily's real Cal.com username/event slugs once she creates her account —
// e.g. 'emily-tuc/coaching-session' becomes whatever Cal.com actually assigns.
const CAL_SLUGS = {
  coaching: 'emily-tuc/coaching-session',
  class: 'emily-tuc/group-class',
  intensive: 'emily-tuc/intensive',
};

function CalEmbed({ calLink }) {
  useEffect(() => {
    if (window.Cal) return; // already loaded from a previous open
    const script = document.createElement('script');
    script.src = 'https://cal.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      data-cal-link={calLink}
      data-cal-config='{"layout":"month_view"}'
      style={{ width: '100%', minHeight: 480 }}
    />
  );
}

export default function BookingModal({ type, onClose }) {
  const [scopeAgreed, setScopeAgreed] = useState(false);

  const titles = {
    coaching: 'Book a Coaching Session',
    class: 'Reserve Your Spot — Group Class',
    intensive: 'Apply for an Intensive',
  };

  const calLink = CAL_SLUGS[type];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: scopeAgreed ? 720 : 520 }}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <h3>{titles[type] || 'Book a Session'}</h3>
        <p>
          All 1:1 work is coaching — not therapy.{' '}
          <a href="/scope-of-service" target="_blank" rel="noreferrer" style={{ color: '#1F5154' }}>
            See scope of service →
          </a>
        </p>

        {!scopeAgreed ? (
          <div>
            <div className="scope-note">
              <strong>Scope acknowledgment:</strong> I understand The Unburdened Collective offers
              coaching and psychoeducation — not therapy, diagnosis, or crisis care. For mental
              health emergencies I will contact 988, Crisis Text Line, or 911.
            </div>
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', margin: '16px 0', cursor: 'pointer', fontSize: '0.85rem', color: '#3d3d3d' }}>
              <input
                type="checkbox"
                onChange={e => e.target.checked && setScopeAgreed(true)}
                style={{ width: 'auto', marginTop: 2 }}
              />
              I've read and agree to the scope of service above.
            </label>
            <p style={{ fontSize: '0.8rem', color: '#9b9b9b' }}>
              Check the box above to continue to booking &amp; payment.
            </p>
          </div>
        ) : calLink ? (
          <CalEmbed calLink={calLink} />
        ) : (
          <p style={{ color: '#c0392b' }}>Booking isn't available for this session type yet.</p>
        )}
      </div>
    </div>
  );
}
