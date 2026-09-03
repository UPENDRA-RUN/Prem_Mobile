import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSundaySale } from '../../context/SundaySaleContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
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
  ShieldCheck
} from 'lucide-react';
import SearchModal from './SearchModal';


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  
  const { totalItems, subtotal, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLive: isSundaySaleLive } = useSundaySale();
  const { isAuthenticated: isAdmin } = useAdminAuth();
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
        <div className="max-w-[1500px] mx-auto px-6 h-[90px] flex items-center justify-between gap-4">
          
          {/* LEFT: BRAND LOGO LOCKUP */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-10 border-2 border-black rounded-lg flex items-center justify-center p-0.5 relative flex-shrink-0">
              <div className="w-1.5 h-0.5 bg-black rounded-full absolute top-1" />
              <Smartphone className="w-4 h-4 text-black" />
            </div>
            <div className="flex flex-col">
              <div className="font-display font-black text-2xl sm:text-[26px] tracking-tight leading-none">
                <span className="text-[#e51b23]">PREM</span>{' '}
                <span className="text-[#050505]">MOBILE</span>
              </div>
              <span className="text-[10.5px] font-bold text-[#050505] tracking-tight mt-1 leading-tight flex items-center gap-1">
                Deal Aise Jo Deewana Bana De 🔥
              </span>
            </div>
          </Link>

          {/* CENTER: DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
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
                  isActive || location.pathname === '/shop'
                    ? 'text-[#e51b23]'
                    : 'text-[#050505] hover:text-[#e51b23]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>PRODUCTS</span>
                  {(isActive || location.pathname === '/shop') && (
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


          {/* RIGHT: SEARCH, USER ACCOUNT / LOGIN, WISHLIST, CART & LIVE TOTAL, SHOP NOW */}
          <div className="flex items-center gap-4 sm:gap-5">

            
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] transition-colors p-1"
              title="Search"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-bold text-[#050505] mt-0.5 leading-none">
                Search
              </span>
            </button>

            {/* User Account Settings & Login */}
            <Link
              to="/account"
              className="flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] transition-colors p-1"
              title="My Account Settings"
            >
              <User className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-bold text-[#050505] mt-0.5 leading-none">
                Account
              </span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] transition-colors p-1 relative shrink-0"
              title="Wishlist"
            >
              <div className="relative inline-flex items-center justify-center">
                <Heart className="w-5 h-5 stroke-[2.2]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#e51b23] text-white text-[9px] font-black flex items-center justify-center shadow-xs leading-none">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-[#050505] mt-0.5 leading-none">
                Wishlist
              </span>
            </Link>

            {/* Cart with Item Count & Optional Total Price */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-slate-100 transition-colors text-[#050505] shrink-0"
              title="Cart View & Checkout"
            >
              <div className="relative flex flex-col items-center justify-center">
                <div className="relative inline-flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 stroke-[2.2] text-[#050505]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#e51b23] text-white text-[9px] font-black flex items-center justify-center shadow-xs leading-none">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-[#050505] mt-0.5 leading-none">
                  Cart
                </span>
              </div>

              {/* LIVE TOTAL PRICE PREVIEW BADGE */}
              {totalItems > 0 && (
                <div className="hidden 2xl:flex flex-col text-left pl-1.5 border-l border-slate-300 leading-tight">
                  <span className="text-[9px] font-black text-[#e51b23] uppercase">Total</span>
                  <span className="text-xs font-black font-display text-[#050505]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              )}
            </button>

            {/* Admin Quick Badge (ONLY VISIBLE IF LOGGED IN AS ADMIN) */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#050505] text-[#ffd000] border border-[#ffd000]/40 font-black text-xs uppercase tracking-wider hover:bg-black/90 shadow-sm"
                title="Open Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#ffd000]" />
                <span>ADMIN</span>
              </Link>
            )}



            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#050505] hover:bg-slate-100 rounded-xl shrink-0"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-4 shadow-xl">
            <div
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-100 text-slate-500 text-sm cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#e51b23]" />
              <span>Search products, brands, Sunday deals...</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link to="/" className="px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-[#050505]">HOME</Link>
              <Link to="/products" className="px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-[#050505]">PRODUCTS</Link>
              <Link to="/categories" className="px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-[#050505]">CATEGORIES</Link>
              <Link to="/sale" className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-between ${isSundaySaleLive ? 'bg-[#e51b23] text-white shadow-sm' : 'bg-red-50 text-[#e51b23]'}`}>
                <span>{isSundaySaleLive ? 'SALE LIVE' : 'SPECIAL SALE'}</span>
                <Flame className="w-3.5 h-3.5 fill-current" />
              </Link>

              <Link to="/offers" className="px-4 py-2.5 rounded-xl bg-amber-50 text-xs font-bold text-amber-900">OFFERS</Link>
              <Link to="/about" className="px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-[#050505]">ABOUT US</Link>
              <Link to="/contact" className="px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-[#050505]">CONTACT</Link>
              <Link to="/account" className="px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-[#050505]">MY ACCOUNT</Link>
              
              {/* Admin Portal link only shown to logged-in admins */}
              {isAdmin && (
                <Link to="/admin/dashboard" className="col-span-2 px-4 py-2.5 rounded-xl bg-[#050505] text-xs font-bold text-[#ffd000] flex items-center justify-center gap-2 border border-[#ffd000]/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ffd000]" />
                  <span>ADMIN DASHBOARD</span>
                </Link>
              )}
            </div>

            <Link
              to="/products"
              className="w-full h-12 rounded-lg bg-[#ffd000] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4 text-[#050505]" />
              <span>SHOP PRODUCTS</span>
            </Link>

          </div>
        )}

      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
