// src/hooks/useCart.js
import { useState, useEffect } from 'react';

export function useCart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uc_cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('uc_cart', JSON.stringify(cart));
  }, [cart]);

  const add = (product) => setCart(c => [...c, product]);
  const remove = (id) => setCart(c => c.filter((_, i) => i !== id));
  const clear = () => setCart([]);
  const total = cart.reduce((s, p) => s + (p.price === 'Free' ? 0 : parseFloat(p.price.replace('$', ''))), 0);

  return { cart, add, remove, clear, total };
}