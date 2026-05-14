import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, icon = '✅') => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setItemCount(0);
      setTotal(0);
      return;
    }
    try {
      setLoading(true);
      const data = await cartAPI.get();
      setItems(data.items || []);
      setItemCount(data.itemCount || 0);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId) => {
    try {
      await cartAPI.addItem(productId, 1);
      await fetchCart();
      showToast('Added to cart!', '🛒');
    } catch (err) {
      showToast(err.message, '❌');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await cartAPI.updateQuantity(productId, quantity);
      await fetchCart();
    } catch (err) {
      showToast(err.message, '❌');
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartAPI.removeItem(productId);
      await fetchCart();
      showToast('Item removed', '🗑️');
    } catch (err) {
      showToast(err.message, '❌');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{
      items, itemCount, total, loading,
      addToCart, updateQuantity, removeItem, clearCart, fetchCart, toast
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
