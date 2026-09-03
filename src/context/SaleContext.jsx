import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SaleContext = createContext();

export function SaleProvider({ children }) {
  const [saleData, setSaleData] = useState({
    isLive: false,
    status: 'OFFLINE', // 'OFFLINE', 'READY', 'LIVE', 'ENDED'
    sale: null,
    items: [],
    products: [],
    message: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSale = useCallback(async () => {
    try {
      const res = await fetch('/api/sale');
      if (res.ok) {
        const data = await res.json();
        const items = data.items || [];
        setSaleData({
          isLive: Boolean(data.isLive),
          status: data.status || 'OFFLINE',
          sale: data.sale || null,
          items,
          products: items, // Alias for backward compatibility
          message: data.message || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch sale status:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSale();
    // Poll every 15 seconds so customer UI updates rapidly when admin goes live
    const interval = setInterval(fetchSale, 15000);
    return () => clearInterval(interval);
  }, [fetchSale]);

  return (
    <SaleContext.Provider value={{ ...saleData, isLoading, refreshSale: fetchSale }}>
      {children}
    </SaleContext.Provider>
  );
}

export function useSale() {
  const context = useContext(SaleContext);
  if (!context) {
    throw new Error('useSale must be used within a SaleProvider');
  }
  return context;
}

// Backward-compatible aliases
export const SundaySaleProvider = SaleProvider;
export const useSundaySale = useSale;
