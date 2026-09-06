import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCustomerAuth } from './CustomerAuthContext';
import { useAdminAuth } from './AdminAuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const customerAuth = useCustomerAuth();
  const adminAuth = useAdminAuth();

  const customerUser = customerAuth?.customerUser;
  const isAdmin = adminAuth?.isAuthenticated;

  // Compute storage key based on active user context
  const getActiveUserKey = () => {
    if (isAdmin) return 'admin';
    if (customerUser?.id) return `user_${customerUser.id}`;
    if (customerUser?.email) return `user_${customerUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    if (customerUser?.mobile) return `user_${customerUser.mobile}`;
    return 'guest';
  };

  const activeUserKey = getActiveUserKey();
  const storageKey = `premmobile_wishlist_${activeUserKey}`;

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlistToast, setWishlistToast] = useState(null);

  // Switch wishlist state dynamically when user context changes (e.g. login/logout)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setWishlist(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setWishlist([]);
    }
  }, [storageKey]);

  // Persist wishlist to active user's storage key
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist, storageKey]);

  const showToast = (message) => {
    setWishlistToast(message);
    setTimeout(() => {
      setWishlistToast(null);
    }, 3000);
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed from Wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved to Wishlist!`);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
        wishlistToast
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
