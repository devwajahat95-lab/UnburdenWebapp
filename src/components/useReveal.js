import { useEffect, useRef } from 'react';

/**
 * Attach scroll-reveal to any element.
 * Usage: const ref = useReveal(); <div ref={ref} className="reveal">...
 */
export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/**
 * Attach reveal to multiple children with stagger.
 * Usage: const ref = useRevealGroup(); <div ref={ref}>...
 */
export function useRevealGroup(selector = '.reveal-item', threshold = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const items = container.querySelectorAll(selector);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    items.forEach(item => obs.observe(item));
    return () => obs.disconnect();
  }, [selector, threshold]);
  return ref;
}
