import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SundaySaleProvider } from './context/SundaySaleContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <WishlistProvider>
        <CartProvider>
          <SundaySaleProvider>
            <AdminAuthProvider>
              <App />
            </AdminAuthProvider>
          </SundaySaleProvider>
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  </React.StrictMode>
);

