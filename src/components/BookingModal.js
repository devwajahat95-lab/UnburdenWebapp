import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// TODO: these are placeholder slugs (Section 2.7 of the spec). Replace with
// Emily's real Cal.com username/event slugs once she creates her account —
// each is a full "username/event-slug" path, exactly as Cal.com's own
// generated embed code specifies (grab it from Event Type → Embed → the
// calLink value in the snippet, not the short share-link shown elsewhere).
const CAL_SLUGS = {
  coaching: 'wajahat-dev-vji8jb/30min',
  class: 'emily-tuc/group-class',
  intensive: 'emily-tuc/intensive',
};

// Cal.com's official embed bootstrap snippet, adapted for React. A bare
// data-cal-link attribute on a div only works for POPUP/button triggers —
// an inline embed needs this loader plus an explicit namespaced
// Cal.ns[namespace]("inline", {...}) call, which is what was missing before.
function loadCalScript() {
  if (window.Cal) return;
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement('script')).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ['initNamespace', namespace]);
        } else {
          p(cal, ar);
        }
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');
}

function CalEmbed({ calLink, namespace }) {
  const containerRef = useRef(null);
  const elementId = useRef(`cal-inline-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    loadCalScript();
    window.Cal('init', namespace, { origin: 'https://app.cal.com' });
    window.Cal.ns[namespace]('inline', {
      elementOrSelector: `#${elementId.current}`,
      calLink,
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
    });
    window.Cal.ns[namespace]('ui', { hideEventTypeDetails: false, layout: 'month_view' });
  }, [calLink, namespace]);

  return (
    <div
      id={elementId.current}
      ref={containerRef}
      style={{ width: '100%', minHeight: 480, overflow: 'scroll' }}
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
          <CalEmbed calLink={calLink} namespace={type} />
        ) : (
          <p style={{ color: '#c0392b' }}>Booking isn't available for this session type yet.</p>
        )}
      </div>
    </div>
  );
}
