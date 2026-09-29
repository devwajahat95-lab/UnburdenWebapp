import { useEffect, useState, useRef } from 'react';
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
  const [applying, setApplying] = useState(false);
  const [dirtyIds, setDirtyIds] = useState(new Set());
  // load() is called from a realtime callback set up once on mount, so it
  // needs a ref (not the state variable directly) to always see the LATEST
  // dirty set rather than whatever it was at mount time.
  const dirtyIdsRef = useRef(dirtyIds);
  useEffect(() => { dirtyIdsRef.current = dirtyIds; }, [dirtyIds]);
  const [error, setError] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '', subtitle: '', description: '', price_cents: 0, type: 'digital', image_url: '', badge: '', sort_order: 0,
  });
  const [newGalleryUrls, setNewGalleryUrls] = useState([]);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
    if (err) { setError(err.message); setLoading(false); return; }
    // Merge instead of overwrite: any row you're actively editing (dirty)
    // keeps YOUR local version instead of being clobbered by the realtime
    // refresh — otherwise a background update could wipe out unsaved edits
    // while you're still typing.
    setProducts(prev => {
      const dirtyMap = new Map(prev.filter(p => dirtyIdsRef.current.has(p.id)).map(p => [p.id, p]));
      return (data || []).map(p => dirtyMap.get(p.id) || p);
    });
    setLoading(false);
  };

  useEffect(() => {
    load();

    // True real-time: Supabase pushes any insert/update/delete on `products`
    // straight to this open tab over a websocket — no polling, no backend
    // route, and no extra Vercel function needed.
    const channel = supabase
      .channel('admin-products-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        load();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Warn on refresh/tab-close if there are unapplied edits, so they're never
  // silently lost the way they could be before.
  useEffect(() => {
    const handler = (e) => {
      if (dirtyIdsRef.current.size > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const markDirty = (id) => setDirtyIds(prev => new Set(prev).add(id));

  const updateField = (id, field, value) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    markDirty(id);
  };

  const updateGalleryUrl = (id, index, value) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const urls = [...(p.image_urls || [])];
      urls[index] = value;
      return { ...p, image_urls: urls };
    }));
    markDirty(id);
  };

  const addGalleryUrl = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, image_urls: [...(p.image_urls || []), ''] } : p));
    markDirty(id);
  };

  const removeGalleryUrl = (id, index) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const urls = [...(p.image_urls || [])];
      urls.splice(index, 1);
      return { ...p, image_urls: urls };
    }));
    markDirty(id);
  };

  // One global action instead of a Save button per row — applies every
  // pending edit across all products in one go.
  const applyChanges = async () => {
    if (dirtyIds.size === 0) return;
    setApplying(true);
    setError('');

    const idsToApply = Array.from(dirtyIds);
    const results = await Promise.all(idsToApply.map(id => {
      const product = products.find(p => p.id === id);
      if (!product) return Promise.resolve({ id, error: null });
      return supabase.from('products').update({
        title: product.title,
        subtitle: product.subtitle,
        description: product.description,
        price_cents: parseInt(product.price_cents, 10) || 0,
        image_url: product.image_url || null,
        image_urls: (product.image_urls || []).filter(u => u && u.trim() !== ''),
        badge: product.badge || null,
        sort_order: parseInt(product.sort_order, 10) || 0,
        stock: product.stock === '' || product.stock === null ? null : parseInt(product.stock, 10),
        active: product.active,
      }).eq('id', id).then(({ error: err }) => ({ id, error: err }));
    }));

    const failed = results.filter(r => r.error);
    if (failed.length > 0) {
      setError(`Failed to save ${failed.length} of ${idsToApply.length} product(s): ${failed[0].error.message}`);
      // Only clear dirty flags for the ones that actually succeeded
      const failedIds = new Set(failed.map(f => f.id));
      setDirtyIds(new Set(idsToApply.filter(id => failedIds.has(id))));
    } else {
      setDirtyIds(new Set());
    }
    setApplying(false);
  };

  // Active is the one field that saves the instant you click it, separate
  // from the rest of the form — toggling a product on/off should never
  // silently get lost if you forget to click Apply Changes afterward.
  // Uses setProducts directly (not updateField) so it doesn't mark the row
  // dirty — it's already saved, no pending change to apply.
  const toggleActive = async (product) => {
    const newValue = !product.active;
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: newValue } : p)); // optimistic
    const { error: err } = await supabase.from('products').update({ active: newValue }).eq('id', product.id);
    if (err) {
      setError(err.message);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: product.active } : p)); // revert
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This can't be undone.`)) return;
    const { error: err } = await supabase.from('products').delete().eq('id', product.id);
    if (err) { setError(err.message); return; }
    setProducts(prev => prev.filter(p => p.id !== product.id));
  };

  const createProduct = async () => {
    setError('');
    const { error: err } = await supabase.from('products').insert({
      ...newProduct,
      price_cents: parseInt(newProduct.price_cents, 10) || 0,
      sort_order: parseInt(newProduct.sort_order, 10) || 0,
      image_urls: newGalleryUrls.filter(u => u && u.trim() !== ''),
      active: true,
    });
    if (err) { setError(err.message); return; }
    setNewProduct({ title: '', subtitle: '', description: '', price_cents: 0, type: 'digital', image_url: '', badge: '', sort_order: 0 });
    setNewGalleryUrls([]);
    setShowNew(false);
    load();
  };

  if (loading) return <p style={{ color: '#9b9b9b' }}>Loading products...</p>;

  return (
    <div>
      {error && <p style={{ color: '#c0392b', marginBottom: 16 }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <button onClick={() => setShowNew(s => !s)} className="btn-outline">
          {showNew ? 'Cancel' : '+ Add Product'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {dirtyIds.size > 0 && (
            <span style={{ fontSize: '0.82rem', color: '#C6A03C', fontWeight: 600 }}>
              {dirtyIds.size} unsaved change{dirtyIds.size > 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={applyChanges}
            disabled={dirtyIds.size === 0 || applying}
            className="btn-primary"
            style={{ opacity: dirtyIds.size === 0 ? 0.5 : 1, cursor: dirtyIds.size === 0 ? 'default' : 'pointer' }}
          >
            {applying ? 'Applying...' : 'Apply Changes'}
          </button>
        </div>
      </div>

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
          <input placeholder="Image URL (cover)" value={newProduct.image_url} onChange={e => setNewProduct(p => ({ ...p, image_url: e.target.value }))} style={inputStyle} />
          <input placeholder="Badge (optional)" value={newProduct.badge} onChange={e => setNewProduct(p => ({ ...p, badge: e.target.value }))} style={inputStyle} />

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: 6 }}>Additional gallery images (optional)</label>
            {newGalleryUrls.map((url, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <input value={url} onChange={e => setNewGalleryUrls(u => u.map((x, idx) => idx === i ? e.target.value : x))} style={{ ...inputStyle, flex: 1 }} placeholder={`Gallery image ${i + 1} URL`} />
                <button type="button" onClick={() => setNewGalleryUrls(u => u.filter((_, idx) => idx !== i))} style={removeBtnStyle}>✕</button>
              </div>
            ))}
            <button type="button" onClick={() => setNewGalleryUrls(u => [...u, ''])} className="btn-outline" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>+ Add image</button>
          </div>

          <button onClick={createProduct} className="btn-primary" style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>Create Product</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {products.map(product => (
          <div key={product.id} style={{ border: dirtyIds.has(product.id) ? '1px solid #C6A03C' : '1px solid rgba(31,81,84,0.12)', borderRadius: 10, padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, opacity: product.active ? 1 : 0.55, position: 'relative' }}>
            {dirtyIds.has(product.id) && (
              <span style={{ position: 'absolute', top: -9, left: 14, background: '#C6A03C', color: '#163a3d', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                Edited
              </span>
            )}
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
            <input value={product.image_url || ''} onChange={e => updateField(product.id, 'image_url', e.target.value)} style={{ ...inputStyle, gridColumn: '1 / -1' }} placeholder="Cover image URL" />

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.78rem', color: '#666', display: 'block', marginBottom: 6 }}>Additional gallery images</label>
              {(product.image_urls || []).map((url, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <input value={url} onChange={e => updateGalleryUrl(product.id, i, e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder={`Gallery image ${i + 1} URL`} />
                  <button type="button" onClick={() => removeGalleryUrl(product.id, i)} style={removeBtnStyle}>✕</button>
                </div>
              ))}
              <button type="button" onClick={() => addGalleryUrl(product.id)} className="btn-outline" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>+ Add image</button>
            </div>

            <input type="number" value={product.sort_order ?? 0} onChange={e => updateField(product.id, 'sort_order', e.target.value)} style={inputStyle} placeholder="Sort order" />
            <input type="number" value={product.stock ?? ''} onChange={e => updateField(product.id, 'stock', e.target.value)} style={inputStyle} placeholder="Stock (blank = unlimited)" />

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#3d3d3d' }}>
                <input type="checkbox" checked={!!product.active} onChange={() => toggleActive(product)} />
                Active {' '}<span style={{ color: '#9b9b9b', fontSize: '0.75rem' }}>(saves instantly)</span>
              </label>
              <button onClick={() => deleteProduct(product)} style={{ padding: '6px 16px', fontSize: '0.85rem', background: 'white', color: '#c0392b', border: '1px solid rgba(192,57,43,0.35)', borderRadius: 8, cursor: 'pointer' }}>
                Delete
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
const removeBtnStyle = { padding: '0 10px', borderRadius: 6, border: '1px solid rgba(192,57,43,0.3)', background: 'white', color: '#c0392b', cursor: 'pointer', fontSize: '0.85rem' };
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
