import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCustomerAuth } from './CustomerAuthContext';
import { useAdminAuth } from './AdminAuthContext';
import { Scale, X, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const CompareContext = createContext();
const MAX_COMPARE_LIMIT = 2;

// Modal Component rendered when compare list is full (2/2)
function CompareFullModal({ isOpen, pendingProduct, compareItems, onReplace, onClose }) {
  if (!isOpen || !pendingProduct) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 animate-scale-up relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
            <Scale className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 leading-tight">Comparison Limit Reached (2/2)</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">You can compare a maximum of 2 products at a time.</p>
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-semibold text-amber-900">
          To add <strong className="text-slate-900 font-black">{pendingProduct.name}</strong> to your comparison, please select an existing product below to remove:
        </div>

        <div className="space-y-2.5">
          {compareItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image || (item.images && item.images[0]) || '/images/prem-main.jpg'}
                  alt={item.name}
                  className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-200 flex-shrink-0"
                  onError={(e) => { e.currentTarget.src = '/images/prem-main.jpg'; }}
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{item.name}</h4>
                  <p className="text-[11px] font-black text-[#E31B23]">{formatCurrency(item.price)}</p>
                </div>
              </div>

              <button
                onClick={() => onReplace(item.id, pendingProduct)}
                className="px-3 py-2 rounded-xl bg-[#E31B23] hover:bg-red-700 text-white font-black text-[11px] uppercase tracking-wider shadow-sm transition flex-shrink-0 flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <span>Remove & Add</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-1 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [compareFullModalData, setCompareFullModalData] = useState({ isOpen: false, pendingProduct: null });

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
    if (!product || !product.id) return false;
    if (compareItems.some(item => item.id === product.id)) {
      showToast(`${product.name} is already in comparison list`);
      return false;
    }
    if (compareItems.length >= MAX_COMPARE_LIMIT) {
      setCompareFullModalData({ isOpen: true, pendingProduct: product });
      return false;
    }

    setCompareItems(prev => [...prev, product]);
    showToast(`Added ${product.name} to comparison list (${compareItems.length + 1}/${MAX_COMPARE_LIMIT})`);
    return true;
  };

  const replaceInCompare = (removeProductId, newProduct) => {
    setCompareItems(prev => {
      const filtered = prev.filter(item => item.id !== removeProductId);
      return [...filtered, newProduct];
    });
    setCompareFullModalData({ isOpen: false, pendingProduct: null });
    showToast(`Replaced item with ${newProduct.name} in comparison list (2/2)`);
  };

  const closeCompareFullModal = () => {
    setCompareFullModalData({ isOpen: false, pendingProduct: null });
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
        replaceInCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        compareCount: compareItems.length,
        compareToast,
        maxCompareLimit: MAX_COMPARE_LIMIT
      }}
    >
      {children}
      <CompareFullModal
        isOpen={compareFullModalData.isOpen}
        pendingProduct={compareFullModalData.pendingProduct}
        compareItems={compareItems}
        onReplace={replaceInCompare}
        onClose={closeCompareFullModal}
      />
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
