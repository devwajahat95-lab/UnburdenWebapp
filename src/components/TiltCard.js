import { useRef } from 'react';

/**
 * Wraps children in a div that tilts in 3D toward the mouse cursor.
 * Strictly visual — no layout impact. Respects reduced-motion.
 */
export default function TiltCard({ children, className = '', style = {}, max = 10 }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0..1
    const y = (e.clientY - rect.top) / rect.height;    // 0..1
    const rotateY = (x - 0.5) * (max * 2);
    const rotateX = (0.5 - y) * (max * 2);
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}
