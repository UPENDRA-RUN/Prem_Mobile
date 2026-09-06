import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SundaySaleProvider } from './context/SundaySaleContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { CompareProvider } from './context/CompareContext';
import { NotificationProvider } from './context/NotificationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <CustomerAuthProvider>
          <AdminAuthProvider>
            <WishlistProvider>
              <CompareProvider>
                <NotificationProvider>
                  <CartProvider>
                    <SundaySaleProvider>
                      <App />
                    </SundaySaleProvider>
                  </CartProvider>
                </NotificationProvider>
              </CompareProvider>
            </WishlistProvider>
          </AdminAuthProvider>
        </CustomerAuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

// Register Service Worker for PWA Offline Caching & Installation
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[PWA] ServiceWorker registered successfully with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] ServiceWorker registration failed:', err);
      });
  });
}

