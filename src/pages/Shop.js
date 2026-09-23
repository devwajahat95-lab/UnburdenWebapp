import { useState, useEffect } from 'react';
import { ShoppingCart, Download, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const PLACEHOLDER_IMG = {
  digital: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80',
  physical: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80',
};

function formatPrice(cents) {
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(2).replace(/\.00$/, '')}`;
}

function mapProduct(product) {
  return {
    id: product.id,
    title: product.title,
    subtitle: product.subtitle,
    price: formatPrice(product.price_cents),
    price_cents: product.price_cents,
    badge: product.badge,
    img: product.image_url || PLACEHOLDER_IMG[product.type] || PLACEHOLDER_IMG.digital,
    desc: product.description,
  };
}

function ProductCard({ p, onAdd }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => { setAdded(true); setTimeout(()=>setAdded(false),2000); onAdd && onAdd(p); };
  return (
    <div className="card reveal-item">
      <div style={{position:'relative',overflow:'hidden',height:200}}>
        <img src={p.img} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.3s'}}
          onMouseEnter={e=>e.target.style.transform='scale(1.05)'}
          onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
        {p.badge && <div style={{position:'absolute',top:12,left:12,background:'#C6A03C',color:'#163a3d',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'4px 10px',borderRadius:2}}>{p.badge}</div>}
      </div>
      <div style={{padding:'22px 20px'}}>
        <div style={{fontSize:'0.72rem',color:'#9b9b9b',letterSpacing:'0.06em',marginBottom:4}}>{p.subtitle}</div>
        <h3 style={{fontSize:'1.05rem',color:'#163a3d',marginBottom:8,lineHeight:1.3}}>{p.title}</h3>
        <p style={{fontSize:'0.82rem',color:'#6b6b6b',lineHeight:1.65,marginBottom:16}}>{p.desc}</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:'1.15rem',fontWeight:700,color:'#1F5154',fontFamily:"'Cormorant Garamond',serif"}}>{p.price}</div>
          <button onClick={handleAdd} style={{background: added?'#9FE0B4':'#1F5154',color: added?'#163a3d':'white',border:'none',borderRadius:8,padding:'9px 16px',fontSize:'0.82rem',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6,transition:'all 0.2s'}}>
            {added ? '✓ Added' : <><Download size={14}/> {p.price==='Free'?'Get Free':'Add to Cart'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const { itemCount, totalDisplay, addItem } = useCart();
  const [downloads, setDownloads] = useState([]);
  const [physical, setPhysical] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/products')
      .then(res => { if (!res.ok) throw new Error('Failed to load products'); return res.json(); })
      .then(products => {
        if (cancelled) return;
        setDownloads(products.filter(product => product.type === 'digital').map(mapProduct));
        setPhysical(products.filter(product => product.type === 'physical').map(mapProduct));
      })
      .catch(() => { if (!cancelled) setLoadError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="tag" style={{color:'#9FE0B4'}}>Digital Downloads · Physical Products</span>
          <h1>The Shop</h1>
          <p>Workbooks, guides, recorded classes, and the Grounding Collection. Start with the free assessment if you’re not sure where to begin.</p>
        </div>
      </section>

      {itemCount > 0 && (
        <div style={{position:'fixed',bottom:24,right:24,background:'#1F5154',color:'white',padding:'14px 20px',borderRadius:12,boxShadow:'0 8px 24px rgba(31,81,84,0.3)',zIndex:50,display:'flex',alignItems:'center',gap:12}}>
          <ShoppingCart size={18}/>
          <span style={{fontWeight:600}}>{itemCount} item{itemCount>1?'s':''}</span>
          <span style={{color:'rgba(255,255,255,0.6)'}}>·</span>
          <span style={{color:'#C6A03C',fontWeight:700}}>{totalDisplay}</span>
          <button style={{marginLeft:8,background:'#C6A03C',color:'#163a3d',border:'none',borderRadius:8,padding:'6px 14px',fontWeight:600,fontSize:'0.82rem',cursor:'pointer'}}>Checkout →</button>
        </div>
      )}

      <section className="section">
        <div className="container">
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:32}}>
            <Download size={20} style={{color:'#1F5154'}}/>
            <h2 style={{fontSize:'1.6rem',color:'#163a3d'}}>Digital Downloads</h2>
          </div>
          {loading && <p style={{color:'#9b9b9b',fontSize:'0.9rem'}}>Loading...</p>}
          {loadError && <p style={{color:'#9b9b9b',fontSize:'0.9rem'}}>Couldn't load products right now. Try refreshing.</p>}
          {!loading && !loadError && downloads.length === 0 && <p style={{color:'#9b9b9b',fontSize:'0.9rem'}}>No digital products yet — check back soon.</p>}
          <div className="grid-3">
            {downloads.map(p=><ProductCard key={p.id} p={p} onAdd={addItem}/>)}
          </div>
        </div>
      </section>

      <section className="section" style={{background:'#F0FAF3'}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:32}}>
            <Package size={20} style={{color:'#1F5154'}}/>
            <h2 style={{fontSize:'1.6rem',color:'#163a3d'}}>The Grounding Collection</h2>
          </div>
          {!loading && !loadError && physical.length === 0 && <p style={{color:'#9b9b9b',fontSize:'0.9rem'}}>No physical products yet — check back soon.</p>}
          <div className="grid-2" style={{maxWidth:700,gap:24}}>
            {physical.map(p=><ProductCard key={p.id} p={p} onAdd={addItem}/>)}
          </div>
          <p style={{marginTop:16,fontSize:'0.8rem',color:'#9b9b9b'}}>Physical products ship in 3-5 business days. Free shipping over $75.</p>
        </div>
      </section>

      <section className="section" style={{background:'#1F5154',textAlign:'center'}}>
        <div className="container" style={{maxWidth:560}}>
          <h2 style={{color:'white',marginBottom:12}}>Want everything in one place?</h2>
          <p style={{color:'rgba(255,255,255,0.75)',marginBottom:24}}>The Collective membership includes the full digital library plus live monthly classes.</p>
          <a href="/collective" className="btn-white">See Membership Options <ArrowRight size={16}/></a>
        </div>
      </section>
    </div>
  );
}
