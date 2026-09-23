import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uc_cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('uc_cart', JSON.stringify(items));
  }, [items]);

  const [guestSessionId] = useState(() => {
    let id = localStorage.getItem('guestCartSession');
    if (!id) {
      id = uuid();
      localStorage.setItem('guestCartSession', id);
    }
    return id;
  });

  const addItem = useCallback((product) => {
    setItems(prev => prev.some(item => item.id === product.id) ? prev : [...prev, product]);
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('uc_cart');
  }, []);

  const total = items.reduce((sum, product) => {
    if (!product.price || product.price === 'Free') return sum;
    const cents = typeof product.price_cents === 'number'
      ? product.price_cents
      : Math.round(parseFloat(product.price.replace('$', '')) * 100);
    return sum + cents;
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount: items.length,
      total,
      totalDisplay: total === 0 ? 'Free' : `$${(total / 100).toFixed(2)}`,
      guestSessionId,
      addItem,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
