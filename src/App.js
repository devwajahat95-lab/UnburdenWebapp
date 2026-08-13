import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import AssessmentModal from './components/AssessmentModal';
import BookingModal from './components/BookingModal';
import Home from './pages/Home';
import WorkWithMe from './pages/WorkWithMe';
import Collective from './pages/Collective';
import Shop from './pages/Shop';
import About from './pages/About';
import Podcast from './pages/Podcast';
import ScopeOfService from './pages/ScopeOfService';
import './index.css';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Global reveal observer — handles all reveal variants + staggered items
const REVEAL_SELECTOR = '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible), .reveal-item:not(.visible)';

function RevealObserver() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const attach = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach(el => {
        const rect = el.getBoundingClientRect();
        // Already in viewport — make visible immediately
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        } else {
          obs.observe(el);
        }
      });
    };

    attach();
    // Re-run when new elements mount (route changes, lazy loads)
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { obs.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}

export default function App() {
  const [modal, setModal] = useState(null); // 'assessment' | 'coaching' | 'class' | 'intensive' | null

  return (
    <BrowserRouter>
      <ScrollTop />
      <RevealObserver />

      {modal === 'assessment' && <AssessmentModal onClose={() => setModal(null)} />}
      {modal && modal !== 'assessment' && <BookingModal type={modal} onClose={() => setModal(null)} />}

      <Nav onAssessment={() => setModal('assessment')} />

      <main style={{ paddingTop: 68 }}>
        <Routes>
          <Route path="/"               element={<Home onAssessment={() => setModal('assessment')} />} />
          <Route path="/work-with-me"   element={<WorkWithMe />} />
          <Route path="/collective"     element={<Collective />} />
          <Route path="/shop"           element={<Shop />} />
          <Route path="/about"          element={<About />} />
          <Route path="/podcast"        element={<Podcast />} />
          <Route path="/scope-of-service" element={<ScopeOfService />} />
          <Route path="*" element={<div style={{ padding:'160px 0', textAlign:'center' }}><h2>Page not found</h2></div>} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}