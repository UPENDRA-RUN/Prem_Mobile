import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSundaySale } from '../../context/SundaySaleContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCompare } from '../../context/CompareContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Search,
  Heart,
  ShoppingCart,
  ShoppingBag,
  Smartphone,
  ChevronDown,
  User,
  Flame,
  ShieldCheck,
  LogOut,
  BarChart3,
  Scale
} from 'lucide-react';
import SearchModal from './SearchModal';
import NotificationDropdown from './NotificationDropdown';
import StoreLiveBadge from '../common/StoreLiveBadge';
import { purgeAllAuthSessions } from '../../utils/authCleanup';

export default function DesktopNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { totalItems, subtotal, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { isLive: isSundaySaleLive } = useSundaySale();
  const { isAuthenticated: isAdmin, logout: adminLogout } = useAdminAuth();
  const { customerUser, isAuthenticated: isCustomer, logout: customerLogout } = useCustomerAuth();
  const location = useLocation();

  React.useEffect(() => {
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener('open-search-modal', handleOpen);
    return () => window.removeEventListener('open-search-modal', handleOpen);
  }, []);

  const isUserAdmin = Boolean(isAdmin) || customerUser?.role === 'ADMIN' || customerUser?.role === 'admin' || customerUser?.isAdmin === true;

  const handleGlobalLogout = () => {
    setIsUserMenuOpen(false);
    if (typeof adminLogout === 'function') adminLogout();
    if (typeof customerLogout === 'function') customerLogout();
    purgeAllAuthSessions();
    window.location.href = '/';
  };

  return (
    <>
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 h-[84px] md:h-[90px] flex items-center justify-between gap-2 lg:gap-3 xl:gap-4">
        
        {/* LEFT: BRAND LOGO LOCKUP */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-10 min-[1280px]:w-9 min-[1280px]:h-11 border-2 border-black rounded-xl flex items-center justify-center p-0.5 relative flex-shrink-0 bg-white group-hover:border-[#e51b23] transition-colors shadow-xs">
              <div className="w-2 h-0.5 bg-black rounded-full absolute top-1" />
              <Smartphone className="w-4 h-4 min-[1280px]:w-5 min-[1280px]:h-5 text-black group-hover:text-[#e51b23] transition-colors" />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <div className="font-display font-black text-xl min-[1280px]:text-2xl md:text-[26px] tracking-tight leading-none">
                <span className="text-[#e51b23]">PREM</span>{' '}
                <span className="text-[#050505]">MOBILE</span>
              </div>
              <span className="hidden min-[1400px]:flex text-[10.5px] font-bold text-[#050505] tracking-tight mt-1 leading-tight items-center gap-1">
                Deal Aise Jo Deewana Bana De 🔥
              </span>
            </div>
          </Link>
          <div className="hidden 2xl:block pl-2 border-l border-slate-200">
            <StoreLiveBadge />
          </div>
        </div>

        {/* CENTER: DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1 min-[1280px]:gap-2 min-[1400px]:gap-3.5 min-[1536px]:gap-5 flex-shrink-0">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative text-[11px] min-[1280px]:text-[12px] min-[1400px]:text-[13px] min-[1536px]:text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center flex-shrink-0 whitespace-nowrap ${
                isActive
                  ? 'text-[#e51b23]'
                  : 'text-[#050505] hover:text-[#e51b23]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>HOME</span>
                {isActive && (
                  <span className="absolute -bottom-2 w-full h-[3px] bg-[#e51b23] rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `relative text-[11px] min-[1280px]:text-[12px] min-[1400px]:text-[13px] min-[1536px]:text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center flex-shrink-0 whitespace-nowrap ${
                isActive || location.pathname === '/shop' || location.pathname === '/products'
                  ? 'text-[#e51b23]'
                  : 'text-[#050505] hover:text-[#e51b23]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>PRODUCTS</span>
                {(isActive || location.pathname === '/shop' || location.pathname === '/products') && (
                  <span className="absolute -bottom-2 w-full h-[3px] bg-[#e51b23] rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <div
            className="relative py-2 flex-shrink-0 whitespace-nowrap"
            onMouseEnter={() => setIsCategoryDropdownOpen(true)}
            onMouseLeave={() => setIsCategoryDropdownOpen(false)}
          >
            <Link
              to="/categories"
              className={`text-[11px] min-[1280px]:text-[12px] min-[1400px]:text-[13px] min-[1536px]:text-[14px] font-extrabold tracking-wide uppercase transition-colors flex items-center gap-0.5 min-[1280px]:gap-1 ${
                location.pathname.startsWith('/categories') || location.pathname.startsWith('/category')
                  ? 'text-[#e51b23]'
                  : 'text-[#050505] hover:text-[#e51b23]'
              }`}
            >
              <span>CATEGORIES</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </Link>

            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in">
                <Link to="/category/smartphones" className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]">
                  Smartphones
                </Link>
                <Link to="/category/earbuds" className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]">
                  Earbuds
                </Link>
                <Link to="/category/headphones" className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]">
                  Headphones
                </Link>
                <Link to="/category/smartwatches" className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]">
                  Smartwatches
                </Link>
                <Link to="/category/power-banks" className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]">
                  Power Banks
                </Link>
                <Link to="/category/chargers" className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]">
                  Chargers
                </Link>
                <Link to="/category/covers" className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]">
                  Mobile Covers
                </Link>
                <Link to="/category/gadgets" className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]">
                  Gadgets & Home Tech
                </Link>
                <div className="border-t border-slate-100 my-1" />
                <Link to="/categories" className="block px-4 py-2 text-xs font-black text-[#e51b23] hover:bg-slate-50">
                  View All Categories →
                </Link>
              </div>
            )}
          </div>

          <NavLink
            to="/sale"
            className={({ isActive }) =>
              `relative text-[11px] min-[1280px]:text-[12px] min-[1400px]:text-[13px] min-[1536px]:text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex items-center gap-0.5 min-[1280px]:gap-1 flex-shrink-0 whitespace-nowrap ${
                isActive
                  ? 'text-[#e51b23]'
                  : isSundaySaleLive
                  ? 'text-[#e51b23] hover:text-[#b91017]'
                  : 'text-[#050505] hover:text-[#e51b23]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-0.5 min-[1280px]:gap-1">
                  {isSundaySaleLive ? (
                    <span className="flex items-center gap-1 px-1.5 min-[1280px]:px-2 py-0.5 rounded-full bg-[#e51b23] text-white text-[9.5px] min-[1280px]:text-[10px] min-[1400px]:text-[11px] font-black animate-pulse shadow-sm">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>SALE LIVE</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-0.5 min-[1280px]:gap-1">
                      <span>SALE</span>
                      <Flame className="w-3 h-3 min-[1280px]:w-3.5 min-[1280px]:h-3.5 text-[#e51b23]" />
                    </div>
                  )}
                </div>
                {isActive && (
                  <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-[#e51b23] rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/combos"
            className={({ isActive }) =>
              `relative text-[11px] min-[1280px]:text-[12px] min-[1400px]:text-[13px] min-[1536px]:text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center flex-shrink-0 whitespace-nowrap ${
                isActive
                  ? 'text-[#e51b23]'
                  : 'text-[#050505] hover:text-[#e51b23]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-0.5 min-[1280px]:gap-1">
                  <span>COMBOS</span>
                  <span className="text-[11px] min-[1280px]:text-xs">🎁</span>
                </div>
                {isActive && (
                  <span className="absolute -bottom-2 w-full h-[3px] bg-[#e51b23] rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/offers"
            className={({ isActive }) =>
              `relative text-[11px] min-[1280px]:text-[12px] min-[1400px]:text-[13px] min-[1536px]:text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center flex-shrink-0 whitespace-nowrap ${
                isActive
                  ? 'text-[#e51b23]'
                  : 'text-[#050505] hover:text-[#e51b23]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>OFFERS</span>
                {isActive && (
                  <span className="absolute -bottom-2 w-full h-[3px] bg-[#e51b23] rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `relative text-[11px] min-[1280px]:text-[12px] min-[1400px]:text-[13px] min-[1536px]:text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center flex-shrink-0 whitespace-nowrap ${
                isActive || location.pathname === '/contact'
                  ? 'text-[#e51b23]'
                  : 'text-[#050505] hover:text-[#e51b23]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>ABOUT</span>
                {(isActive || location.pathname === '/contact') && (
                  <span className="absolute -bottom-2 w-full h-[3px] bg-[#e51b23] rounded-full" />
                )}
              </>
            )}
          </NavLink>
        </nav>

        {/* RIGHT ACTIONS: SEARCH, USER ACCOUNT, WISHLIST, COMPARE, CART */}
        <div className="flex items-center gap-1 min-[1280px]:gap-1.5 min-[1400px]:gap-2.5 flex-shrink-0 ml-auto">
          <NotificationDropdown />

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] hover:bg-slate-100 p-1 min-[1280px]:p-1.5 rounded-xl transition-colors shrink-0"
            title="Search store (Ctrl+K)"
            aria-label="Search"
          >
            <Search className="w-4 h-4 min-[1280px]:w-5 min-[1280px]:h-5 stroke-[2.2]" />
            <span className="text-[9px] min-[1280px]:text-[9.5px] font-bold text-[#050505] mt-0.5 leading-none">
              Search
            </span>
          </button>

          <Link
            to="/compare"
            className="flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] hover:bg-slate-100 p-1 min-[1280px]:p-1.5 rounded-xl transition-colors relative shrink-0"
            title="Compare Products"
            aria-label="Compare Products"
          >
            <div className="relative inline-flex items-center justify-center">
              <Scale className="w-4 h-4 min-[1280px]:w-5 min-[1280px]:h-5 stroke-[2.2]" />
              {compareCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#050505] text-[#FFD400] text-[8.5px] font-black flex items-center justify-center shadow-xs leading-none border border-[#FFD400]">
                  {compareCount}
                </span>
              )}
            </div>
            <span className="text-[9px] min-[1280px]:text-[9.5px] font-bold text-[#050505] mt-0.5 leading-none">
              Compare
            </span>
          </Link>

          <Link
            to="/wishlist"
            className="flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] hover:bg-slate-100 p-1 min-[1280px]:p-1.5 rounded-xl transition-colors relative shrink-0"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <div className="relative inline-flex items-center justify-center">
              <Heart className="w-4 h-4 min-[1280px]:w-5 min-[1280px]:h-5 stroke-[2.2]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#e51b23] text-white text-[8.5px] font-black flex items-center justify-center shadow-xs leading-none">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[9px] min-[1280px]:text-[9.5px] font-bold text-[#050505] mt-0.5 leading-none">
              Wishlist
            </span>
          </Link>

          {(isCustomer || isUserAdmin || Boolean(customerUser)) ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1 py-1 px-1.5 min-[1280px]:py-1.5 min-[1280px]:px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#050505] transition-colors cursor-pointer shrink-0"
                title="My Account"
                aria-label="My Account"
              >
                <div className={`w-5 h-5 min-[1280px]:w-6 min-[1280px]:h-6 rounded-full font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs ${
                  isUserAdmin ? 'bg-[#FFD400] text-[#050505]' : 'bg-[#ffd000] text-black'
                }`}>
                  {customerUser?.name ? customerUser.name[0].toUpperCase() : (isUserAdmin ? 'A' : '👤')}
                </div>
                <div className="flex flex-col text-left">
                  <span className={`text-[8px] min-[1280px]:text-[8.5px] font-extrabold uppercase tracking-wider leading-none ${
                    isUserAdmin ? 'text-amber-600' : 'text-slate-400'
                  }`}>
                    {isUserAdmin ? 'ADMIN' : 'CUSTOMER'}
                  </span>
                  <span className="text-[10.5px] min-[1280px]:text-[11px] min-[1400px]:text-xs font-black max-w-[55px] min-[1280px]:max-w-[75px] min-[1400px]:max-w-[110px] truncate text-slate-900 leading-tight">
                    {customerUser?.name || (isUserAdmin ? 'Prem Mobile Admin' : 'Customer')}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {customerUser?.name || (isUserAdmin ? 'Prem Mobile Admin' : 'User')}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {customerUser?.email || (isUserAdmin ? 'admin@premmobile.com' : customerUser?.mobile || '')}
                    </p>
                  </div>

                  {isUserAdmin ? (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                      <Link
                        to="/admin/analytics"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                      >
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        <span>Admin Analytics</span>
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#e51b23] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#e51b23] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#e51b23] transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>
                    </>
                  )}

                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={handleGlobalLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] hover:bg-slate-100 p-1 min-[1280px]:p-1.5 rounded-xl transition-colors shrink-0"
              title="Customer Login"
              aria-label="Customer Login"
            >
              <User className="w-4 h-4 min-[1280px]:w-5 min-[1280px]:h-5 stroke-[2.2]" />
              <span className="text-[9px] min-[1280px]:text-[9.5px] font-bold text-[#050505] mt-0.5 leading-none">
                Login
              </span>
            </Link>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-1 min-[1280px]:gap-1.5 px-2 py-1 min-[1280px]:px-3 min-[1280px]:py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-[#050505] shrink-0"
            title="Cart View & Checkout"
            aria-label={`Cart with ${totalItems} items`}
          >
            <div className="relative inline-flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 min-[1280px]:w-5 min-[1280px]:h-5 stroke-[2.2] text-[#050505]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#e51b23] text-white text-[8.5px] font-black flex items-center justify-center shadow-xs leading-none">
                  {totalItems}
                </span>
              )}
            </div>

            {totalItems > 0 && (
              <div className="flex flex-col text-left pl-1 min-[1280px]:pl-1.5 border-l border-slate-300 leading-tight">
                <span className="text-[8px] min-[1280px]:text-[8.5px] font-black text-[#e51b23] uppercase">Total</span>
                <span className="text-[10.5px] min-[1280px]:text-xs font-black font-display text-[#050505]">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            )}
          </button>

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1 px-2 py-1 min-[1280px]:px-2.5 min-[1280px]:py-2 rounded-xl bg-[#050505] hover:bg-slate-800 text-[#ffd000] border border-[#ffd000]/40 font-black text-[10px] min-[1280px]:text-[11px] min-[1400px]:text-xs uppercase tracking-wider transition-all shadow-xs shrink-0"
              title="Go to Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#ffd000]" />
              <span className="hidden min-[1400px]:inline">ADMIN DASHBOARD</span>
              <span className="inline min-[1400px]:hidden">ADMIN</span>
            </Link>
          )}
        </div>

      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
