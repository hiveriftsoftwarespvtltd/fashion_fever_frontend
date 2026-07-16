import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import {
  getUserCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  decrementCartQuantity,
  clearCart as apiClearCart
} from '../api/cartService';
import { toast } from '../utils/toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartId, setCartId] = useState(null);

  // Sync / Fetch user's cart from backend database
  const fetchUserCart = async () => {
    if (!user) {
      setCart([]);
      setCartId(null);
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await getUserCart();
      if (res?.success) {
        setCartId(res.data?._id || res.data?.id || null);
        const items = res.data?.items || [];
        const formatted = items.map(item => ({
          id: item.variant?._id || item.product?._id,
          productId: item.product?._id,
          variantId: item.variant?._id,
          name: `${item.product?.name || ''} ${item.variant?.attributes?.Color ? `(${item.variant.attributes.Color})` : ''}`,
          price: item.variant?.salesPrice || item.variant?.price || 0,
          originalPrice: item.variant?.price || 0,
          image: item.variant?.thumbnail?.url || item.product?.images?.[0]?.url || '',
          qty: item.quantity,
          attributes: item.variant?.attributes || {}
        }));
        setCart(formatted);
      }
    } catch (err) {
      console.error("Failed to load backend cart in context:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch cart whenever user logs in, logs out, or changes
  useEffect(() => {
    fetchUserCart();
  }, [user]);

  // Add Item (Optimistic UI + API Sync)
  const addToCart = async (product, variantId, productId) => {
    const vId = variantId || product.id;
    const pId = productId || product.productId;

    if (!pId || !vId) {
      console.warn("Product or Variant ID missing when adding to cart!");
      return;
    }

    // 1. Optimistic Update on client for instant UI feedback
    setCart(prev => {
      const exists = prev.find(item => item.id === vId);
      if (exists) {
        return prev.map(item => item.id === vId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, id: vId, productId: pId, variantId: vId, qty: 1 }];
    });

    // 2. Push to backend database in background
    try {
      const res = await apiAddToCart(pId, vId);
      if (!res?.success) {
        // Rollback on failure
        fetchUserCart();
        toast.error(res?.message || "Failed to add to database cart");
      }
    } catch (err) {
      fetchUserCart();
      console.error("Backend add error:", err);
    }
  };

  // Remove Item (Optimistic UI + API Sync)
  const removeFromCart = async (variantId) => {
    // 1. Optimistic update
    setCart(prev => prev.filter(item => item.id !== variantId));

    // 2. Call backend
    try {
      const res = await apiRemoveFromCart(variantId);
      if (!res?.success) {
        fetchUserCart();
        toast.error(res?.message || "Failed to remove item from database");
      }
    } catch (err) {
      fetchUserCart();
      console.error("Backend remove error:", err);
    }
  };

  // Update Quantity (Optimistic UI + API Sync)
  const updateQty = async (variantId, delta, productId) => {
    // 1. Optimistic update
    setCart(prev => prev.map(item => 
      item.id === variantId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));

    // 2. Call backend
    try {
      let res;
      if (delta > 0) {
        res = await apiAddToCart(productId || variantId, variantId);
      } else {
        res = await decrementCartQuantity(variantId);
      }

      if (!res?.success) {
        fetchUserCart();
        toast.error(res?.message || "Failed to update quantity in database");
      }
    } catch (err) {
      fetchUserCart();
      console.error("Backend update quantity error:", err);
    }
  };

  // Clear Cart
  const clearCart = async () => {
    setCart([]);
    try {
      await apiClearCart();
    } catch (err) {
      console.error("Failed to clear backend cart:", err);
    }
  };

  // Compute Totals
  const cartTotal = Math.round(cart.reduce((acc, item) => acc + (item.price * item.qty), 0) * 100) / 100;
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      isLoading,
      addToCart, 
      removeFromCart, 
      updateQty, 
      clearCart,
      cartTotal, 
      cartCount,
      fetchUserCart,
      cartId
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
