import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | notfound | error

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    let cancelled = false;
    let attempts = 0;

    // The webhook that actually creates the order runs asynchronously via
    // Stripe, separately from this redirect — it can take a couple seconds
    // to land. Poll briefly instead of failing on the first try.
    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetch(`/api/orders/by-session?session_id=${encodeURIComponent(sessionId)}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setOrder(data);
            setStatus('ready');
          }
          return;
        }
        if (attempts < 6 && !cancelled) {
          setTimeout(poll, 1500);
        } else if (!cancelled) {
          setStatus('notfound');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 560, textAlign: 'center' }}>
        {status === 'loading' && (
          <p style={{ color: '#9b9b9b' }}>Confirming your order...</p>
        )}

        {status === 'notfound' && (
          <>
            <CheckCircle size={48} color="#C6A03C" style={{ marginBottom: 16 }} />
            <h1 style={{ marginBottom: 12 }}>Payment received</h1>
            <p style={{ color: '#666', marginBottom: 24 }}>
              Your payment went through, but we're still finalizing your order details.
              If you don't see a confirmation email shortly, reach out and we'll sort it out.
            </p>
            <Link to="/shop" className="btn-outline">Back to Shop</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 style={{ marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ color: '#666', marginBottom: 24 }}>
              We couldn't load your order confirmation. If you completed a payment, check your email for confirmation.
            </p>
            <Link to="/shop" className="btn-outline">Back to Shop</Link>
          </>
        )}

        {status === 'ready' && order && (
          <>
            <CheckCircle size={48} color="#C6A03C" style={{ marginBottom: 16 }} />
            <h1 style={{ marginBottom: 8 }}>Thank you!</h1>
            <p style={{ color: '#666', marginBottom: 32 }}>
              Your order is confirmed. A receipt has been sent to your email.
            </p>

            <div style={{ background: '#FAF8F4', borderRadius: 12, padding: 24, textAlign: 'left', marginBottom: 24 }}>
              {(order.items || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(31,81,84,0.1)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#163a3d' }}>{item.title}</div>
                    {item.download_token && (
                      <a href={`/api/downloads/${item.download_token}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#C6A03C', fontSize: '0.85rem', marginTop: 4 }}>
                        <Download size={14} /> Download
                      </a>
                    )}
                  </div>
                  <span style={{ color: '#666' }}>{formatPrice(item.price_cents * (item.quantity || 1))}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontWeight: 700, color: '#163a3d' }}>
                <span>Total</span>
                <span>{formatPrice(order.total_cents)}</span>
              </div>
            </div>

            <Link to="/shop" className="btn-outline" style={{ justifyContent: 'center' }}>
              Continue Shopping <ArrowRight size={15} />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
