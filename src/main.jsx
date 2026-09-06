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

// Register Service Worker for PWA Offline Caching & Installation (Production Only)
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] ServiceWorker registered successfully with scope:', reg.scope);
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New deployment version detected! Reloading for fresh bundle...');
                  window.location.reload();
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn('[PWA] ServiceWorker registration failed:', err);
        });
    });
  } else {
    // In development mode, unregister any existing service worker & clear caches to prevent stale cache white screens
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then(() => {
          console.log('[PWA Dev] Unregistered existing ServiceWorker to ensure fresh Vite HMR');
        });
      }
    });
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
  }
}
