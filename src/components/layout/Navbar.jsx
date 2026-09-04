import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSundaySale } from '../../context/SundaySaleContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Search,
  Heart,
  ShoppingCart,
  ShoppingBag,
  Menu,
  X,
  Smartphone,
  ChevronDown,
  User,
  Settings,
  Flame,
  ShieldCheck,
  LogOut,
  Phone,
  MessageCircle,
  Tag,
  Package
} from 'lucide-react';
import SearchModal from './SearchModal';


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { totalItems, subtotal, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLive: isSundaySaleLive } = useSundaySale();
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const { customerUser, isAuthenticated: isCustomer, logout: customerLogout } = useCustomerAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`sticky top-0 z-[1000] w-full bg-white transition-shadow duration-200 ${
          isScrolled ? 'shadow-md border-b border-slate-200' : 'border-b border-[#dedede]'
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-2.5 min-[360px]:px-3 sm:px-6 h-[64px] min-[360px]:h-[70px] sm:h-[84px] md:h-[90px] flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* LEFT: BRAND LOGO LOCKUP */}
          <Link to="/" className="flex items-center gap-1.5 min-[360px]:gap-2 sm:gap-2.5 flex-shrink-0 group min-w-0">
            <div className="w-6 h-8 min-[360px]:w-7 min-[360px]:h-9 sm:w-8 sm:h-10 border-2 border-black rounded-lg flex items-center justify-center p-0.5 relative flex-shrink-0">
              <div className="w-1.5 h-0.5 bg-black rounded-full absolute top-0.5 sm:top-1" />
              <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="font-display font-black text-lg min-[360px]:text-xl sm:text-2xl md:text-[26px] tracking-tight leading-none truncate">
                <span className="text-[#e51b23]">PREM</span>{' '}
                <span className="text-[#050505]">MOBILE</span>
              </div>
              <span className="hidden min-[480px]:flex text-[9.5px] sm:text-[10.5px] font-bold text-[#050505] tracking-tight mt-0.5 sm:mt-1 leading-tight items-center gap-1">
                Deal Aise Jo Deewana Bana De 🔥
              </span>
            </div>
          </Link>

          {/* CENTER: DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {/* HOME */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center ${
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

            {/* PRODUCTS */}
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `relative text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center ${
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

            {/* CATEGORIES WITH DROPDOWN */}
            <div
              className="relative py-2"
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <Link
                to="/categories"
                className={`text-[14px] font-extrabold tracking-wide uppercase transition-colors flex items-center gap-1 ${
                  location.pathname.startsWith('/categories') || location.pathname.startsWith('/category')
                    ? 'text-[#e51b23]'
                    : 'text-[#050505] hover:text-[#e51b23]'
                }`}
              >
                <span>CATEGORIES</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </Link>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <Link
                    to="/category/smartphones"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Smartphones
                  </Link>
                  <Link
                    to="/category/earbuds"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Earbuds
                  </Link>
                  <Link
                    to="/category/headphones"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Headphones
                  </Link>
                  <Link
                    to="/category/smartwatches"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Smartwatches
                  </Link>
                  <Link
                    to="/category/power-banks"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Power Banks
                  </Link>
                  <Link
                    to="/category/chargers"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Chargers
                  </Link>
                  <Link
                    to="/category/covers"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Mobile Covers
                  </Link>
                  <Link
                    to="/category/gadgets"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Gadgets & Home Tech
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <Link
                    to="/categories"
                    className="block px-4 py-2 text-xs font-black text-[#e51b23] hover:bg-slate-50"
                  >
                    View All Categories →
                  </Link>
                </div>
              )}
            </div>

            {/* SALE WITH DYNAMIC FLAME BADGE */}
            <NavLink
              to="/sale"
              className={({ isActive }) =>
                `relative text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex items-center gap-1.5 ${
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
                  <div className="flex items-center gap-1">
                    {isSundaySaleLive ? (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e51b23] text-white text-[11px] font-black animate-pulse shadow-sm">
                        <Flame className="w-3 h-3 fill-white" />
                        <span>SALE LIVE</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span>SALE</span>
                        <Flame className="w-3.5 h-3.5 text-[#e51b23]" />
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-[#e51b23] rounded-full" />
                  )}
                </>
              )}
            </NavLink>

            {/* COMBOS */}
            <NavLink
              to="/combos"
              className={({ isActive }) =>
                `relative text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center ${
                  isActive
                    ? 'text-[#e51b23]'
                    : 'text-[#050505] hover:text-[#e51b23]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-1">
                    <span>COMBOS</span>
                    <span className="text-xs">🎁</span>
                  </div>
                  {isActive && (
                    <span className="absolute -bottom-2 w-full h-[3px] bg-[#e51b23] rounded-full" />
                  )}
                </>
              )}
            </NavLink>

            {/* OFFERS */}
            <NavLink
              to="/offers"
              className={({ isActive }) =>
                `relative text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center ${
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

            {/* ABOUT US */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center ${
                  isActive
                    ? 'text-[#e51b23]'
                    : 'text-[#050505] hover:text-[#e51b23]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>ABOUT</span>
                  {isActive && (
                    <span className="absolute -bottom-2 w-full h-[3px] bg-[#e51b23] rounded-full" />
                  )}
                </>
              )}
            </NavLink>

            {/* CONTACT */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `relative text-[14px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center ${
                  isActive
                    ? 'text-[#e51b23]'
                    : 'text-[#050505] hover:text-[#e51b23]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>CONTACT</span>
                  {isActive && (
                    <span className="absolute -bottom-2 w-full h-[3px] bg-[#e51b23] rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* RIGHT: SEARCH, USER ACCOUNT / LOGIN, WISHLIST, CART & MOBILE MENU */}
          <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-3 flex-shrink-0">

            {/* 1. Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] hover:bg-slate-100 p-1.5 sm:p-2 rounded-xl transition-colors shrink-0"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4 min-[360px]:w-[18px] min-[360px]:h-[18px] sm:w-5 sm:h-5 stroke-[2.2]" />
              <span className="hidden md:inline-block text-[10px] font-bold text-[#050505] mt-0.5 leading-none">
                Search
              </span>
            </button>

            {/* 2. User Account / Profile / Login */}
            {isCustomer ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 sm:gap-1.5 py-1 px-1.5 sm:py-1.5 sm:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#050505] transition-colors cursor-pointer shrink-0"
                  title="My Account"
                  aria-label="My Account"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#ffd000] text-black font-black text-[10px] sm:text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                    {customerUser?.name ? customerUser.name[0].toUpperCase() : '👤'}
                  </div>
                  <div className="hidden min-[480px]:flex flex-col text-left">
                    <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Customer</span>
                    <span className="text-[11px] sm:text-xs font-black max-w-[65px] sm:max-w-[110px] truncate text-slate-900 leading-tight">
                      {customerUser?.name || 'Customer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-900 truncate">{customerUser?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{customerUser?.email || customerUser?.mobile}</p>
                    </div>
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
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        customerLogout();
                      }}
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
                className="hidden min-[380px]:flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] hover:bg-slate-100 p-1.5 sm:p-2 rounded-xl transition-colors shrink-0"
                title="Customer Login"
                aria-label="Customer Login"
              >
                <User className="w-4 h-4 min-[360px]:w-[18px] min-[360px]:h-[18px] sm:w-5 sm:h-5 stroke-[2.2]" />
                <span className="hidden md:inline-block text-[10px] font-bold text-[#050505] mt-0.5 leading-none">
                  Login
                </span>
              </Link>
            )}

            {/* 3. Wishlist Button with Badge */}
            <Link
              to="/wishlist"
              className="flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] hover:bg-slate-100 p-1.5 sm:p-2 rounded-xl transition-colors relative shrink-0"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <div className="relative inline-flex items-center justify-center">
                <Heart className="w-4 h-4 min-[360px]:w-[18px] min-[360px]:h-[18px] sm:w-5 sm:h-5 stroke-[2.2]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-[#e51b23] text-white text-[9px] font-black flex items-center justify-center shadow-xs leading-none">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline-block text-[10px] font-bold text-[#050505] mt-0.5 leading-none">
                Wishlist
              </span>
            </Link>

            {/* 4. Cart Button with Badge & Total - GUARANTEED FULLY VISIBLE & NEVER CUT OFF */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors text-[#050505] shrink-0"
              title="Cart View & Checkout"
              aria-label={`Cart with ${totalItems} items`}
            >
              <div className="relative flex flex-col items-center justify-center">
                <div className="relative inline-flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 min-[360px]:w-[18px] min-[360px]:h-[18px] sm:w-5 sm:h-5 stroke-[2.2] text-[#050505]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-[#e51b23] text-white text-[9px] font-black flex items-center justify-center shadow-xs leading-none">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline-block text-[10px] font-bold text-[#050505] mt-0.5 leading-none">
                  Cart
                </span>
              </div>

              {/* LIVE TOTAL PRICE PREVIEW (On larger screens) */}
              {totalItems > 0 && (
                <div className="hidden xl:flex flex-col text-left pl-1.5 border-l border-slate-300 leading-tight">
                  <span className="text-[9px] font-black text-[#e51b23] uppercase">Total</span>
                  <span className="text-xs font-black font-display text-[#050505]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              )}
            </button>

            {/* 5. Switch to Admin Button (Desktop & Tablet) */}
            <Link
              to={isAdmin ? "/admin/dashboard" : "/admin/login"}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#050505] hover:bg-slate-800 text-[#ffd000] border border-[#ffd000]/40 font-black text-xs uppercase tracking-wider transition-all shadow-xs shrink-0"
              title={isAdmin ? "Go to Admin Dashboard" : "Switch to Admin Login"}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#ffd000]" />
              <span className="hidden xl:inline">{isAdmin ? 'ADMIN DASHBOARD' : 'SWITCH TO ADMIN'}</span>
              <span className="xl:hidden">ADMIN</span>
            </Link>

            {/* 6. Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 min-[360px]:p-2 text-[#050505] hover:bg-slate-100 rounded-xl shrink-0 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 min-[360px]:w-6 min-[360px]:h-6" /> : <Menu className="w-5 h-5 min-[360px]:w-6 min-[360px]:h-6" />}
            </button>

          </div>

        </div>

        {/* MOBILE MENU DRAWER */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3.5 shadow-2xl max-h-[85vh] overflow-y-auto">
            
            {/* Customer Header / Welcome Banner */}
            {isCustomer ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-black text-white flex items-center justify-between border border-[#ffd000]/30 shadow-md">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#ffd000] text-black font-black text-base flex items-center justify-center flex-shrink-0 shadow-sm">
                    {customerUser?.name ? customerUser.name[0].toUpperCase() : '👤'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">{customerUser?.name}</p>
                    <p className="text-[11px] text-slate-300 truncate">{customerUser?.email || customerUser?.mobile}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    customerLogout();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white font-black text-[10px] uppercase hover:bg-red-700 transition-colors shrink-0"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-gradient-to-r from-[#ffd000] to-[#ffb700] text-[#050505] flex items-center justify-between shadow-md group"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-black" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide">LOGIN / CREATE ACCOUNT</p>
                    <p className="text-[10.5px] font-bold text-black/80">Track orders & unlock member deals</p>
                  </div>
                </div>
                <span className="font-black text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            )}

            {/* Quick Search Trigger */}
            <div
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium cursor-pointer border border-slate-200"
            >
              <Search className="w-4 h-4 text-[#e51b23] shrink-0" />
              <span className="truncate">Search phones, earbuds, Sunday deals...</span>
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

              {isCustomer && (
                <>
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-blue-50 text-xs font-bold text-blue-900 flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-blue-700" />
                    <span>MY ORDERS</span>
                  </Link>
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>MY PROFILE</span>
                  </Link>
                </>
              )}

              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#050505]">
                ABOUT US
              </Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#050505]">
                CONTACT
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

      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
