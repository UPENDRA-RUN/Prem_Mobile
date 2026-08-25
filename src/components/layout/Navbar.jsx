import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  Search,
  Heart,
  ShoppingCart,
  ShoppingBag,
  Menu,
  X,
  Smartphone,
  ChevronDown
} from 'lucide-react';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
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
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
            {/* HOME */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative text-[14.5px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center ${
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

            {/* SHOP */}
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `relative text-[14.5px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center ${
                  isActive
                    ? 'text-[#e51b23]'
                    : 'text-[#050505] hover:text-[#e51b23]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>SHOP</span>
                  {isActive && (
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
                className={`text-[14.5px] font-extrabold tracking-wide uppercase transition-colors flex items-center gap-1 ${
                  location.pathname.startsWith('/categories')
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
                    to="/shop?category=Smartphones"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Smartphones
                  </Link>
                  <Link
                    to="/shop?category=Earbuds"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Earbuds
                  </Link>
                  <Link
                    to="/shop?category=Headphones"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Headphones
                  </Link>
                  <Link
                    to="/shop?category=Smartwatches"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Smartwatches
                  </Link>
                  <Link
                    to="/shop?category=Power%20Banks"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Power Banks
                  </Link>
                  <Link
                    to="/shop?category=Chargers"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Chargers
                  </Link>
                  <Link
                    to="/shop?category=Gadgets"
                    className="block px-4 py-2 text-xs font-bold text-[#050505] hover:bg-slate-50 hover:text-[#e51b23]"
                  >
                    Gadgets & Home Tech
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <Link
                    to="/categories"
                    className="block px-4 py-2 text-xs font-black text-[#e51b23] hover:bg-slate-50"
                  >
                    View All 12 Categories →
                  </Link>
                </div>
              )}
            </div>

            {/* OFFERS */}
            <NavLink
              to="/offers"
              className={({ isActive }) =>
                `relative text-[14.5px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center ${
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
                `relative text-[14.5px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center ${
                  isActive
                    ? 'text-[#e51b23]'
                    : 'text-[#050505] hover:text-[#e51b23]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>ABOUT US</span>
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
                `relative text-[14.5px] font-extrabold tracking-wide uppercase transition-colors py-2 flex flex-col items-center ${
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

          {/* RIGHT: SEARCH, WISHLIST, CART, SHOP NOW */}
          <div className="flex items-center gap-5 sm:gap-6">
            
            {/* Search (Icon on top, label below) */}
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

            {/* Wishlist (Icon with red 0 badge + label below) */}
            <Link
              to="/wishlist"
              className="flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] transition-colors p-1 relative"
              title="Wishlist"
            >
              <div className="relative">
                <Heart className="w-5 h-5 stroke-[2.2]" />
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#e51b23] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#050505] mt-0.5 leading-none">
                Wishlist
              </span>
            </Link>

            {/* Cart (Icon with red 0 badge + label below) */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex flex-col items-center justify-center text-[#050505] hover:text-[#e51b23] transition-colors p-1 relative"
              title="Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#e51b23] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#050505] mt-0.5 leading-none">
                Cart
              </span>
            </button>

            {/* Large Yellow SHOP NOW Button */}
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#ffd000] hover:bg-[#ffcb05] text-[#050505] font-black text-[13px] uppercase tracking-wider transition-all duration-200 shadow-sm"
              style={{
                width: '160px',
                height: '46px',
                borderRadius: '8px'
              }}
            >
              <ShoppingBag className="w-4 h-4 text-[#050505] stroke-[2.5]" />
              <span>SHOP NOW</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#050505] hover:bg-slate-100 rounded-xl"
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
              <Link to="/shop" className="px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-[#050505]">SHOP</Link>
              <Link to="/categories" className="px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-[#050505]">CATEGORIES</Link>
              <Link to="/offers" className="px-4 py-2.5 rounded-xl bg-red-50 text-xs font-bold text-[#e51b23]">OFFERS 🔥</Link>
              <Link to="/about" className="px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-[#050505]">ABOUT US</Link>
              <Link to="/contact" className="px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-[#050505]">CONTACT</Link>
            </div>

            <Link
              to="/shop"
              className="w-full h-12 rounded-lg bg-[#ffd000] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4 text-[#050505]" />
              <span>SHOP NOW</span>
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
