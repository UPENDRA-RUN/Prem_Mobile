import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('premmobile_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load wishlist from localStorage', e);
      return [];
    }
  });

  const [wishlistToast, setWishlistToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('premmobile_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

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
