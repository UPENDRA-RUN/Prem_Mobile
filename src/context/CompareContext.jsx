import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCustomerAuth } from './CustomerAuthContext';
import { useAdminAuth } from './AdminAuthContext';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const customerAuth = useCustomerAuth();
  const adminAuth = useAdminAuth();

  const customerUser = customerAuth?.customerUser;
  const isAdmin = adminAuth?.isAuthenticated;

  // Storage key based on active user context
  const getActiveUserKey = () => {
    if (isAdmin) return 'admin';
    if (customerUser?.id) return `user_${customerUser.id}`;
    if (customerUser?.email) return `user_${customerUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    if (customerUser?.mobile) return `user_${customerUser.mobile}`;
    return 'guest';
  };

  const activeUserKey = getActiveUserKey();
  const storageKey = `premmobile_compare_${activeUserKey}`;

  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [compareToast, setCompareToast] = useState(null);

  // Switch storage when user context changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCompareItems(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setCompareItems([]);
    }
  }, [storageKey]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(compareItems));
    } catch (e) {
      console.error('Failed to save compare items to localStorage', e);
    }
  }, [compareItems, storageKey]);

  const showToast = (msg) => {
    setCompareToast(msg);
    setTimeout(() => {
      setCompareToast(null);
    }, 3000);
  };

  const addToCompare = (product) => {
    if (!product || !product.id) return;
    if (compareItems.some(item => item.id === product.id)) {
      showToast(`${product.name} is already in comparison list`);
      return;
    }
    if (compareItems.length >= 4) {
      showToast('You can compare a maximum of 4 products at once');
      return;
    }

    setCompareItems(prev => [...prev, product]);
    showToast(`Added ${product.name} to comparison list (${compareItems.length + 1}/4)`);
  };

  const removeFromCompare = (productId) => {
    setCompareItems(prev => prev.filter(item => item.id !== productId));
  };

  const toggleCompare = (product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      showToast(`Removed ${product.name} from comparison list`);
    } else {
      addToCompare(product);
    }
  };

  const isInCompare = (productId) => {
    return compareItems.some(item => item.id === productId);
  };

  const clearCompare = () => {
    setCompareItems([]);
    showToast('Comparison list cleared');
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        compareCount: compareItems.length,
        compareToast
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
