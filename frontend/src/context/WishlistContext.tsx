import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WishlistItem } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string, productName?: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data.data);
    } catch (error) {
      console.warn('Failed to load wishlist:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = async (productId: string, productName?: string) => {
    if (!isAuthenticated) {
      showToast('Please log in to save items to your wishlist.', 'info');
      return;
    }

    try {
      const res = await api.post('/wishlist/toggle', { productId });
      await fetchWishlist();
      const inList = res.data.data?.inWishlist;
      showToast(
        inList
          ? `Added ${productName || 'item'} to wishlist! ❤️`
          : `Removed from wishlist.`,
        inList ? 'success' : 'info'
      );
    } catch (error: any) {
      showToast('Could not update wishlist.', 'error');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) return;
    try {
      await api.delete(`/wishlist/${productId}`);
      await fetchWishlist();
      showToast('Removed from wishlist.', 'info');
    } catch (error) {
      showToast('Could not remove from wishlist.', 'error');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        itemCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
