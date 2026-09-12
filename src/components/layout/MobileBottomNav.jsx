import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Flame, Heart, User, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useSundaySale } from '../../context/SundaySaleContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function MobileBottomNav() {
  const { wishlistCount } = useWishlist();
  const { isLive: isSundaySaleLive } = useSundaySale();
  const { isAuthenticated: isCustomer } = useCustomerAuth();
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const location = useLocation();

  // Don't show bottom nav in admin portal
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-t border-white/10 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.6)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 h-[56px] min-[380px]:h-[60px] items-center max-w-lg mx-auto px-1">
        
        {/* 1. HOME */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center h-full transition-colors ${
              isActive ? 'text-[#ffd000]' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] font-bold mt-0.5 tracking-tight">Home</span>
            </>
          )}
        </NavLink>

        {/* 2. CATEGORIES */}
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center h-full transition-colors ${
              isActive || location.pathname.startsWith('/category')
                ? 'text-[#ffd000]'
                : 'text-slate-400 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Grid3X3 className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] font-bold mt-0.5 tracking-tight">Categories</span>
            </>
          )}
        </NavLink>

        {/* 3. SUNDAY SALE (SPECIAL PULSE BADGE) */}
        <NavLink
          to="/sunday-sale"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center h-full relative transition-colors ${
              isActive
                ? 'text-[#e51b23]'
                : isSundaySaleLive
                ? 'text-[#ffd000]'
                : 'text-slate-400 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Flame
                  className={`w-5 h-5 ${
                    isSundaySaleLive
                      ? 'fill-[#e51b23] text-[#e51b23] animate-pulse'
                      : isActive
                      ? 'fill-current'
                      : 'stroke-[1.8]'
                  }`}
                />
                {isSundaySaleLive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#e51b23] animate-ping" />
                )}
              </div>
              <span
                className={`text-[10px] font-black mt-0.5 tracking-tight ${
                  isSundaySaleLive ? 'text-[#ffd000]' : ''
                }`}
              >
                Sale
              </span>
            </>
          )}
        </NavLink>

        {/* 4. WISHLIST */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center h-full relative transition-colors ${
              isActive ? 'text-[#e51b23]' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Heart
                  className={`w-5 h-5 ${
                    isActive ? 'fill-[#e51b23] stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#e51b23] text-white text-[8.5px] font-black flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold mt-0.5 tracking-tight">Wishlist</span>
            </>
          )}
        </NavLink>

        {/* 5. ACCOUNT / ORDERS */}
        <NavLink
          to={isCustomer || isAdmin ? '/orders' : '/account'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center h-full transition-colors ${
              isActive ? 'text-[#ffd000]' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isCustomer ? (
                <ShoppingBag className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              ) : (
                <User className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              )}
              <span className="text-[10px] font-bold mt-0.5 tracking-tight">
                {isCustomer ? 'Orders' : 'Account'}
              </span>
            </>
          )}
        </NavLink>

      </div>
    </nav>
  );
}
