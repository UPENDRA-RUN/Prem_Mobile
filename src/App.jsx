import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Layout Components
import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingActions from './components/layout/FloatingActions';
import CartDrawer from './components/common/CartDrawer';
import Toast from './components/common/Toast';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetails from './pages/ProductDetails';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import AccountSettings from './pages/AccountSettings';
import DesignTokensGuide from './pages/DesignTokensGuide';
import SkeletonGuide from './pages/SkeletonGuide';
import LoadingGuide from './pages/LoadingGuide';
import InputFieldGuide from './pages/InputFieldGuide';
import ContextMenuGuide from './pages/ContextMenuGuide';
import ButtonGuide from './pages/ButtonGuide';
import TabsGuide from './pages/TabsGuide';
import ToastGuide from './pages/ToastGuide';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-navy-900 font-sans">
      <ScrollToTop />
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <AnnouncementBar />

      {/* 2. STICKY NAVBAR */}
      <Navbar />

      {/* 3. MAIN ROUTED VIEW */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:category" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/design-tokens" element={<DesignTokensGuide />} />
          <Route path="/skeleton-guide" element={<SkeletonGuide />} />
          <Route path="/loading-guide" element={<LoadingGuide />} />
          <Route path="/input-guide" element={<InputFieldGuide />} />
          <Route path="/context-menu-guide" element={<ContextMenuGuide />} />
          <Route path="/button-guide" element={<ButtonGuide />} />
          <Route path="/tabs-guide" element={<TabsGuide />} />
          <Route path="/toast-guide" element={<ToastGuide />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* 4. FOOTER */}
      <Footer />

      {/* 5. GLOBAL DRAWERS & FLOATING BUTTONS */}
      <CartDrawer />
      <Toast />
      <FloatingActions />
    </div>
  );
}
