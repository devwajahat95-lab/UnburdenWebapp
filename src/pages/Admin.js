import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const TABS = ['Products', 'Orders', 'Bookings'];

function formatPrice(cents) {
  return (cents / 100).toFixed(2);
}

// ───────────────────────── Products ─────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '', subtitle: '', description: '', price_cents: 0, type: 'digital', image_url: '', badge: '', sort_order: 0,
  });

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
    if (err) setError(err.message);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateField = (id, field, value) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const save = async (product) => {
    setSavingId(product.id);
    setError('');
    const { error: err } = await supabase.from('products').update({
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      price_cents: parseInt(product.price_cents, 10) || 0,
      image_url: product.image_url || null,
      badge: product.badge || null,
      sort_order: parseInt(product.sort_order, 10) || 0,
      stock: product.stock === '' || product.stock === null ? null : parseInt(product.stock, 10),
      active: product.active,
    }).eq('id', product.id);
    if (err) setError(err.message);
    setSavingId(null);
  };

  const createProduct = async () => {
    setError('');
    const { error: err } = await supabase.from('products').insert({
      ...newProduct,
      price_cents: parseInt(newProduct.price_cents, 10) || 0,
      sort_order: parseInt(newProduct.sort_order, 10) || 0,
      active: true,
    });
    if (err) { setError(err.message); return; }
    setNewProduct({ title: '', subtitle: '', description: '', price_cents: 0, type: 'digital', image_url: '', badge: '', sort_order: 0 });
    setShowNew(false);
    load();
  };

  if (loading) return <p style={{ color: '#9b9b9b' }}>Loading products...</p>;

  return (
    <div>
      {error && <p style={{ color: '#c0392b', marginBottom: 16 }}>{error}</p>}
      <button onClick={() => setShowNew(s => !s)} className="btn-outline" style={{ marginBottom: 20 }}>
        {showNew ? 'Cancel' : '+ Add Product'}
      </button>

      {showNew && (
        <div style={{ background: '#FAF8F4', borderRadius: 10, padding: 16, marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <input placeholder="Title" value={newProduct.title} onChange={e => setNewProduct(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
          <input placeholder="Subtitle" value={newProduct.subtitle} onChange={e => setNewProduct(p => ({ ...p, subtitle: e.target.value }))} style={inputStyle} />
          <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, gridColumn: '1 / -1', minHeight: 60 }} />
          <input type="number" placeholder="Price (cents)" value={newProduct.price_cents} onChange={e => setNewProduct(p => ({ ...p, price_cents: e.target.value }))} style={inputStyle} />
          <select value={newProduct.type} onChange={e => setNewProduct(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
            <option value="digital">digital</option>
            <option value="physical">physical</option>
            <option value="membership">membership</option>
          </select>
          <input placeholder="Image URL" value={newProduct.image_url} onChange={e => setNewProduct(p => ({ ...p, image_url: e.target.value }))} style={inputStyle} />
          <input placeholder="Badge (optional)" value={newProduct.badge} onChange={e => setNewProduct(p => ({ ...p, badge: e.target.value }))} style={inputStyle} />
          <button onClick={createProduct} className="btn-primary" style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>Create Product</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid rgba(31,81,84,0.12)', borderRadius: 10, padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, opacity: product.active ? 1 : 0.55 }}>
            <input value={product.title || ''} onChange={e => updateField(product.id, 'title', e.target.value)} style={inputStyle} placeholder="Title" />
            <input value={product.subtitle || ''} onChange={e => updateField(product.id, 'subtitle', e.target.value)} style={inputStyle} placeholder="Subtitle" />
            <textarea value={product.description || ''} onChange={e => updateField(product.id, 'description', e.target.value)} style={{ ...inputStyle, gridColumn: '1 / -1', minHeight: 50 }} placeholder="Description" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#9b9b9b', fontSize: '0.85rem' }}>$</span>
              <input type="number" value={product.price_cents ? (product.price_cents / 100) : 0}
                onChange={e => updateField(product.id, 'price_cents', Math.round(parseFloat(e.target.value || 0) * 100))}
                style={inputStyle} />
            </div>
            <input value={product.badge || ''} onChange={e => updateField(product.id, 'badge', e.target.value)} style={inputStyle} placeholder="Badge" />
            <input value={product.image_url || ''} onChange={e => updateField(product.id, 'image_url', e.target.value)} style={{ ...inputStyle, gridColumn: '1 / -1' }} placeholder="Image URL" />
            <input type="number" value={product.sort_order ?? 0} onChange={e => updateField(product.id, 'sort_order', e.target.value)} style={inputStyle} placeholder="Sort order" />
            <input type="number" value={product.stock ?? ''} onChange={e => updateField(product.id, 'stock', e.target.value)} style={inputStyle} placeholder="Stock (blank = unlimited)" />

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#3d3d3d' }}>
                <input type="checkbox" checked={!!product.active} onChange={e => updateField(product.id, 'active', e.target.checked)} />
                Active
              </label>
              <button onClick={() => save(product)} disabled={savingId === product.id} className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                {savingId === product.id ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────── Orders ─────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => { setOrders(data || []); setLoading(false); });
  }, []);

  if (loading) return <p style={{ color: '#9b9b9b' }}>Loading orders...</p>;
  if (orders.length === 0) return <p style={{ color: '#9b9b9b' }}>No orders yet.</p>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#9b9b9b', borderBottom: '1px solid rgba(31,81,84,0.1)' }}>
            <th style={thStyle}>Date</th><th style={thStyle}>Status</th><th style={thStyle}>Total</th><th style={thStyle}>Items</th><th style={thStyle}>Fulfillment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid rgba(31,81,84,0.06)' }}>
              <td style={tdStyle}>{new Date(o.created_at).toLocaleDateString()}</td>
              <td style={tdStyle}>{o.status}</td>
              <td style={tdStyle}>${formatPrice(o.total_cents)}</td>
              <td style={tdStyle}>{(o.items || []).map(i => i.title).join(', ')}</td>
              <td style={tdStyle}>{o.fulfillment_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ───────────────────────── Bookings ─────────────────────────
function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('bookings').select('*').order('start_at', { ascending: false }).limit(50)
      .then(({ data }) => { setBookings(data || []); setLoading(false); });
  }, []);

  if (loading) return <p style={{ color: '#9b9b9b' }}>Loading bookings...</p>;
  if (bookings.length === 0) return <p style={{ color: '#9b9b9b' }}>No bookings yet.</p>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#9b9b9b', borderBottom: '1px solid rgba(31,81,84,0.1)' }}>
            <th style={thStyle}>When</th><th style={thStyle}>Attendee</th><th style={thStyle}>Type</th><th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} style={{ borderBottom: '1px solid rgba(31,81,84,0.06)' }}>
              <td style={tdStyle}>{b.start_at ? new Date(b.start_at).toLocaleString() : '—'}</td>
              <td style={tdStyle}>{b.attendee_name || b.attendee_email}</td>
              <td style={tdStyle}>{b.event_type}</td>
              <td style={tdStyle}>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inputStyle = { padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(31,81,84,0.18)', fontSize: '0.88rem', fontFamily: 'DM Sans, sans-serif' };
const thStyle = { padding: '8px 12px', fontWeight: 600 };
const tdStyle = { padding: '8px 12px' };

export default function Admin() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [tab, setTab] = useState('Products');

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (!session) { navigate('/login?redirect=/admin'); return; }
      if (session.user?.user_metadata?.role !== 'admin') { navigate('/members'); return; }
      setAuthorized(true);
      setChecking(false);
    });
    return () => { cancelled = true; };
  }, [navigate]);

  if (checking || !authorized) {
    return <section className="section"><div className="container"><p style={{ color: '#9b9b9b' }}>Checking access...</p></div></section>;
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 style={{ marginBottom: 24 }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: '1px solid rgba(31,81,84,0.1)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                background: 'none', border: 'none', padding: '10px 4px', marginRight: 20, cursor: 'pointer',
                fontWeight: 600, fontSize: '0.95rem', color: tab === t ? '#163a3d' : '#9b9b9b',
                borderBottom: tab === t ? '2px solid #C6A03C' : '2px solid transparent',
              }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Products' && <ProductsTab />}
        {tab === 'Orders' && <OrdersTab />}
        {tab === 'Bookings' && <BookingsTab />}
      </div>
    </section>
  );
}
