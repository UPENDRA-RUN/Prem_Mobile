import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Flame,
  Settings,
  LogOut,
  Menu,
  X,
  Smartphone,
  ExternalLink,
  PlusCircle,
  Sparkles,
  Layers
} from 'lucide-react';

export default function AdminLayout() {
  const { adminUser, logout } = useAdminAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Manage Products & Images', icon: Package, badge: '📦' },
    { to: '/admin/combos', label: 'Combos & Bundle Packs', icon: Layers, badge: '🎁' },
    { to: '/admin/orders', label: 'Store Orders', icon: ShoppingCart, badge: '🛒' },
    { to: '/admin/sale', label: 'Sunday & Custom Sales', icon: Flame, badge: '🔥' },
    { to: '/admin/settings', label: 'Store Settings & Danger Zone', icon: Settings, badge: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-white text-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E31B23] flex items-center justify-center shadow">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-black text-sm tracking-tight">
            <span className="text-[#E31B23]">PREM</span> ADMIN
          </span>
        </Link>

        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
          aria-label="Toggle Navigation"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* SIDEBAR (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white text-slate-700 flex flex-col justify-between border-r border-slate-200 z-40 transition-transform duration-200 shadow-sm ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* LOGO */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E31B23] border-2 border-[#FFD400] flex items-center justify-center shadow-md">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg text-slate-900 tracking-tight leading-none">
                  <span className="text-[#E31B23]">PREM</span> MOBILE
                </span>
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider mt-1">
                  ADMIN CONTROL HUB
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* PRIMARY CALL TO ACTION: ADD PRODUCT & MANAGE IMAGES */}
          <div className="p-4 space-y-2">
            <Link
              to="/admin/products/new"
              onClick={() => setIsMobileNavOpen(false)}
              className="w-full py-3 px-4 rounded-2xl bg-[#E31B23] hover:bg-[#c9141b] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102"
            >
              <PlusCircle className="w-4 h-4 fill-white text-[#E31B23]" />
              <span>ADD NEW PRODUCT</span>
            </Link>

            <Link
              to="/admin/products"
              onClick={() => setIsMobileNavOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-[#E31B23]" />
              <span>MANAGE PRODUCTS & IMAGES</span>
            </Link>
          </div>

          {/* NAV LINKS */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md font-black scale-102'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM USER & ACTIONS */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          <div className="px-3.5 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E31B23] text-white font-black text-xs flex items-center justify-center shadow-sm">
              {adminUser?.name ? adminUser.name[0].toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{adminUser?.name || 'Prem Mobile Admin'}</p>
              <p className="text-[10px] text-slate-500 truncate">{adminUser?.email || 'admin@premmobile.com'}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <span>Preview Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-7xl bg-slate-50">
        <Outlet />
      </main>

    </div>
  );
}
