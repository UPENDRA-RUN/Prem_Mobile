import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSundaySale } from '../../context/SundaySaleContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCompare } from '../../context/CompareContext';
import {
  Search,
  Heart,
  ShoppingCart,
  ShoppingBag,
  Menu,
  X,
  Smartphone,
  User,
  Flame,
  ShieldCheck,
  LogOut,
  Tag,
  Package,
  BarChart3,
  Scale,
  Download,
  Sparkles
} from 'lucide-react';
import SearchModal from './SearchModal';
import NotificationDropdown from './NotificationDropdown';
import StoreLiveBadge from '../common/StoreLiveBadge';
import { usePwaInstall } from '../common/PwaInstallPrompt';
import { purgeAllAuthSessions } from '../../utils/authCleanup';

export default function MobileNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { isLive: isSundaySaleLive } = useSundaySale();
  const { isAuthenticated: isAdmin, logout: adminLogout } = useAdminAuth();
  const { customerUser, isAuthenticated: isCustomer, logout: customerLogout } = useCustomerAuth();
  const { canInstall, isInstalled, isIos, triggerInstall } = usePwaInstall();

  React.useEffect(() => {
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener('open-search-modal', handleOpen);
    return () => window.removeEventListener('open-search-modal', handleOpen);
  }, []);

  const isUserAdmin = Boolean(isAdmin) || customerUser?.role === 'ADMIN' || customerUser?.role === 'admin' || customerUser?.isAdmin === true;

  const handleGlobalLogout = () => {
    setIsMobileMenuOpen(false);
    if (typeof adminLogout === 'function') adminLogout();
    if (typeof customerLogout === 'function') customerLogout();
    purgeAllAuthSessions();
    window.location.href = '/';
  };

  return (
    <>
      <div className="w-full bg-white px-3 sm:px-4 h-[58px] min-[380px]:h-[64px] flex items-center justify-between gap-2 border-b border-slate-200 shadow-xs">
        
        {/* LEFT: BRAND LOGO */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group min-w-0">
          <div className="w-7 h-9 min-[380px]:w-8 min-[380px]:h-10 border-2 border-black rounded-xl flex items-center justify-center p-0.5 relative flex-shrink-0 bg-white group-hover:border-[#e51b23] transition-colors shadow-xs">
            <div className="w-2 h-0.5 bg-black rounded-full absolute top-1" />
            <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:text-[#e51b23] transition-colors" />
          </div>
          <div className="flex flex-col min-w-0 justify-center">
            <div className="font-display font-black text-lg min-[380px]:text-xl tracking-tight leading-none truncate">
              <span className="text-[#e51b23]">PREM</span>{' '}
              <span className="text-[#050505]">MOBILE</span>
            </div>
            <span className="text-[9px] font-bold text-[#050505] tracking-tight mt-0.5 leading-tight truncate">
              Deal Aise Jo Deewana Bana De 🔥
            </span>
          </div>
        </Link>

        {/* RIGHT: SEARCH, NOTIFICATIONS, CART, HAMBURGER */}
        <div className="flex items-center gap-1 min-[380px]:gap-1.5 flex-shrink-0">
          {/* Notification Bell */}
          <NotificationDropdown />

          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-9 h-9 min-[380px]:w-10 min-[380px]:h-10 flex items-center justify-center text-[#050505] hover:text-[#e51b23] hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            title="Search Store"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Cart Button with Count Badge */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="w-9 h-9 min-[380px]:w-10 min-[380px]:h-10 flex items-center justify-center text-[#050505] hover:bg-slate-100 rounded-xl transition-colors relative shrink-0"
            title="Shopping Cart"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <ShoppingCart className="w-5 h-5 stroke-[2.2] text-[#050505]" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#e51b23] text-white text-[10px] font-black flex items-center justify-center shadow-xs leading-none">
                {totalItems}
              </span>
            )}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-9 h-9 min-[380px]:w-10 min-[380px]:h-10 flex items-center justify-center text-[#050505] hover:bg-slate-100 rounded-xl shrink-0 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 stroke-[2.4]" /> : <Menu className="w-6 h-6 stroke-[2.4]" />}
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER / SLIDE-DOWN */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-in">
          
          {/* Customer Header / Welcome Banner */}
          {isCustomer ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-black text-white flex items-center justify-between border border-[#ffd000]/30 shadow-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-[#ffd000] text-black font-black text-base flex items-center justify-center flex-shrink-0 shadow-sm">
                  {customerUser?.name ? customerUser.name[0].toUpperCase() : '👤'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate">{customerUser?.name}</p>
                  <p className="text-xs text-slate-300 truncate">{customerUser?.email || customerUser?.mobile}</p>
                </div>
              </div>
              <button
                onClick={handleGlobalLogout}
                className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase hover:bg-red-700 transition-colors shrink-0 cursor-pointer"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-[#ffd000] to-[#ffb700] text-[#050505] flex items-center justify-between shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-[#ffd000] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide">LOGIN / CREATE ACCOUNT</p>
                  <p className="text-[11px] font-bold text-black/80">Track orders & unlock member deals</p>
                </div>
              </div>
              <span className="font-black text-base group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          )}

          {/* Store Live Status in Drawer */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-slate-500">Pinto Park Store Status:</span>
            <StoreLiveBadge />
          </div>

          {/* Quick Search Trigger */}
          <div
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSearchOpen(true);
            }}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium cursor-pointer border border-slate-200"
          >
            <Search className="w-4 h-4 text-[#e51b23] shrink-0" />
            <span className="truncate">Search phones, earbuds, Sunday deals...</span>
          </div>

          {/* App Action Buttons (Wishlist, Compare, Orders) */}
          <div className="grid grid-cols-3 gap-2">
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex flex-col items-center justify-center text-center gap-1"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-[#e51b23]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[16px] h-4 rounded-full bg-[#e51b23] text-white text-[9px] font-black flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-800">Wishlist</span>
            </Link>

            <Link
              to="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex flex-col items-center justify-center text-center gap-1"
            >
              <div className="relative">
                <Scale className="w-5 h-5 text-[#050505]" />
                {compareCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[16px] h-4 rounded-full bg-black text-[#ffd000] text-[9px] font-black flex items-center justify-center">
                    {compareCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-800">Compare</span>
            </Link>

            <Link
              to="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex flex-col items-center justify-center text-center gap-1"
            >
              <Package className="w-5 h-5 text-blue-600" />
              <span className="text-[11px] font-bold text-slate-800">Orders</span>
            </Link>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#050505] flex items-center gap-2">
              <span>🏠</span>
              <span>HOME</span>
            </Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#050505] flex items-center gap-2">
              <span>📦</span>
              <span>PRODUCTS</span>
            </Link>
            <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#050505] flex items-center gap-2">
              <span>📂</span>
              <span>CATEGORIES</span>
            </Link>
            <Link
              to="/sale"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center justify-between ${
                isSundaySaleLive ? 'bg-[#e51b23] text-white shadow-sm' : 'bg-red-50 text-[#e51b23]'
              }`}
            >
              <span>{isSundaySaleLive ? 'SALE LIVE' : 'SPECIAL SALE'}</span>
              <Flame className="w-3.5 h-3.5 fill-current" />
            </Link>

            <Link to="/combos" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-purple-50 text-xs font-bold text-purple-900 flex items-center justify-between">
              <span>COMBOS</span>
              <span>🎁</span>
            </Link>
            <Link to="/offers" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-amber-50 text-xs font-bold text-amber-900 flex items-center justify-between">
              <span>OFFERS</span>
              <Tag className="w-3.5 h-3.5 text-amber-700" />
            </Link>

            {(isCustomer || isUserAdmin) && (
              <>
                {isUserAdmin ? (
                  <>
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-amber-50 text-xs font-bold text-amber-900 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>ADMIN DASHBOARD</span>
                    </Link>
                    <Link to="/admin/analytics" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-indigo-50 text-xs font-bold text-indigo-900 flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-indigo-700" />
                      <span>ADMIN ANALYTICS</span>
                    </Link>
                  </>
                ) : (
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>MY PROFILE</span>
                  </Link>
                )}
              </>
            )}

            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="col-span-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#050505] text-center">
              ABOUT US & CONTACT STORE
            </Link>
          </div>

          {/* Quick Actions Footer inside Drawer */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full h-11 rounded-xl bg-[#ffd000] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-[#050505]" />
              <span>EXPLORE ALL PRODUCTS</span>
            </Link>

            {/* PWA Install App CTA Button - Only shown when app is NOT installed and device can install */}
            {!isInstalled && (canInstall || isIos) && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  triggerInstall();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e51b23] to-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
              >
                <Download className="w-4 h-4 text-white" />
                <span>INSTALL PREM MOBILE APP 📲</span>
              </button>
            )}

            {/* Switch to Admin option */}
            <Link
              to={isAdmin ? "/admin/dashboard" : "/admin/login"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#050505] text-xs font-bold text-[#ffd000] flex items-center justify-center gap-2 border border-[#ffd000]/40 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#ffd000]" />
              <span>{isAdmin ? 'ADMIN DASHBOARD' : 'SWITCH TO ADMIN'}</span>
            </Link>
          </div>

        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
