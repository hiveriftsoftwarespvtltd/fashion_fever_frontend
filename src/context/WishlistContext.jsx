import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist } from '../api/wishlistService';
import { useUser } from './UserContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useUser();
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = async () => {
    if (!user) {
      setWishlistCount(0);
      return;
    }
    try {
      const response = await getWishlist();
      if (response.success && response.data && response.data.items) {
        setWishlistCount(response.data.items.length);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist count", error);
    }
  };

  useEffect(() => {
    fetchWishlistCount();
  }, [user]);

  const updateWishlistCount = (newCount) => {
    setWishlistCount(newCount);
  };

  const incrementWishlistCount = () => {
    setWishlistCount(prev => prev + 1);
  };

  const decrementWishlistCount = () => {
    setWishlistCount(prev => Math.max(0, prev - 1));
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistCount, 
      updateWishlistCount, 
      incrementWishlistCount, 
      decrementWishlistCount,
      refreshWishlistCount: fetchWishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
