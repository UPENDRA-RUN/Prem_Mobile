import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { formatCurrency } from '../../utils/formatters';
import { parseResponseJson } from '../../utils/apiHelper';
import {
  Package,
  CheckCircle2,
  ShoppingCart,
  Calendar,
  Flame,
  ArrowRight,
  PlusCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Search,
  Edit2,
  ExternalLink,
  DollarSign,
  Ticket,
  Check,
  XCircle,
  Truck,
  Layers
} from 'lucide-react';

export default function AdminDashboard() {
  const { adminToken } = useAdminAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    pendingOrdersCount: 0
  });

  const [allProducts, setAllProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [sundaySale, setSundaySale] = useState({
    isLive: false,
    statusText: 'OFFLINE',
    dayInfo: { currentDay: 'Friday', isSunday: false }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      // 1. Products
      const prodRes = await fetch('/api/products/admin/all', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const prodData = await parseResponseJson(prodRes);
      const prods = prodData.products || [];
      setAllProducts(prods);
      const activeProds = prods.filter(p => p.isActive);

      // 2. Orders
      const orderRes = await fetch('/api/orders/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const orderData = await parseResponseJson(orderRes);
      const allOrders = orderData.orders || [];
      const todayStr = new Date().toISOString().slice(0, 10);
      const todayOrders = allOrders.filter(o => o.createdAt?.startsWith(todayStr));
      const pendingOrders = allOrders.filter(o => o.status === 'PENDING');

      const revenue = allOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      setRecentOrders(allOrders.slice(0, 5));

      // 3. Sunday Sale
      const saleRes = await fetch('/api/sunday-sale/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const saleData = await parseResponseJson(saleRes);

      setStats({
        totalProducts: prods.length,
        activeProducts: activeProds.length,
        totalOrders: allOrders.length,
        todayOrders: todayOrders.length,
        totalRevenue: revenue,
        pendingOrdersCount: pendingOrders.length
      });

      setSundaySale({
        isLive: saleData.isLive,
        statusText: saleData.statusText || 'OFFLINE',
        dayInfo: saleData.dayInfo || { currentDay: new Date().toLocaleDateString('en-US', { weekday: 'long' }) }
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useRealtimeSync(fetchDashboardData, ['PRODUCTS_UPDATED', 'ORDERS_UPDATED', 'SALE_UPDATED'], 15000);

  const handleToggleProductStatus = async (product) => {
    const updatedActive = product.isActive ? 0 : 1;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ isActive: updatedActive })
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setActionMessage(`Product "${product.name}" is now ${updatedActive ? 'Active' : 'Disabled'}.`);
        fetchDashboardData(true);
      }
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/admin/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setActionMessage(`Order #${orderId} status updated to ${newStatus}.`);
        fetchDashboardData(true);
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (err) {
      alert('Error updating order status: ' + err.message);
    }
  };

  const currentDayName = sundaySale.dayInfo?.currentDay || sundaySale.dayInfo?.dayName || new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Filtered products for search
  const searchedProducts = searchQuery.trim()
    ? allProducts.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">● PENDING</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">● CONFIRMED</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">● DELIVERED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300">● CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* HEADER & INSTANT SHORTCUT BAR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#E31B23] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-[#E31B23]" />
              <span>Admin Control Center</span>
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight mt-0.5">
              Store Dashboard & Quick Actions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Today: <span className="font-bold text-slate-900">{currentDayName}</span> • Real-time synchronization active
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDashboardData()}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/admin/products/new"
              className="px-4 py-2.5 rounded-xl bg-[#E31B23] hover:bg-[#c9141b] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-transform hover:scale-102"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* 1-CLICK QUICK ACTION SHORTCUT BUTTONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/products/new"
            className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-black text-xs uppercase tracking-wider flex items-center gap-2.5 transition shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FFD400] text-black flex items-center justify-center flex-shrink-0 font-bold group-hover:scale-105 transition-transform">
              +
            </div>
            <div className="min-w-0">
              <span className="block truncate">Add Product</span>
              <span className="text-[10px] font-normal text-amber-700 block">New inventory item</span>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-black text-xs uppercase tracking-wider flex items-center gap-2.5 transition shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block truncate">Store Orders</span>
              <span className="text-[10px] font-normal text-blue-700 block">{stats.pendingOrdersCount} pending action</span>
            </div>
          </Link>

          <Link
            to="/admin/coupons"
            className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-black text-xs uppercase tracking-wider flex items-center gap-2.5 transition shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold group-hover:scale-105 transition-transform">
              <Ticket className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block truncate">Promo Coupons</span>
              <span className="text-[10px] font-normal text-emerald-700 block">Discounts & Codes</span>
            </div>
          </Link>

          <Link
            to="/admin/sale"
            className="p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 font-black text-xs uppercase tracking-wider flex items-center gap-2.5 transition shadow-2xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#E31B23] text-white flex items-center justify-center flex-shrink-0 font-bold group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 fill-white" />
            </div>
            <div className="min-w-0">
              <span className="block truncate">Sunday Sale</span>
              <span className="text-[10px] font-normal text-rose-700 block">{sundaySale.isLive ? 'Sale is LIVE 🔥' : 'Weekly Event'}</span>
            </div>
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
        </div>
      )}

      {/* 4 KEY STAT METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Sales Revenue */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display font-black text-2xl sm:text-3xl text-emerald-600 block truncate">
              {formatCurrency(stats.totalRevenue)}
            </span>
            <span className="text-[10px] font-bold text-slate-400">All-time Store Revenue</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Pending Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display font-black text-2xl sm:text-3xl text-amber-600 block">
              {stats.pendingOrdersCount}
            </span>
            <span className="text-[10px] font-bold text-slate-400">Needs Confirmation</span>
          </div>
        </div>

        {/* Active Catalog Products */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Active Catalog</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display font-black text-2xl sm:text-3xl text-blue-600 block">
              {stats.activeProducts} / {stats.totalProducts}
            </span>
            <span className="text-[10px] font-bold text-slate-400">Live Products in Store</span>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Today's Orders</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#E31B23] flex items-center justify-center border border-rose-200">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display font-black text-2xl sm:text-3xl text-[#E31B23] block">
              {stats.todayOrders}
            </span>
            <span className="text-[10px] font-bold text-slate-400">New Orders Today</span>
          </div>
        </div>

      </div>

      {/* REAL-TIME RECENT ORDERS CONTROL PANEL */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#E31B23]" />
              <span>Recent Customer Orders</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and process incoming customer orders directly with 1-click status controls.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-black text-[#E31B23] hover:underline flex items-center gap-1 shrink-0 uppercase tracking-wider"
          >
            <span>All Orders ({stats.totalOrders}) →</span>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium">
            No customer orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                  <th className="p-3">Order Number</th>
                  <th className="p-3">Customer Details</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Quick Status Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentOrders.map((order) => {
                  const comboItems = (order.items || []).filter(it => Boolean(it.isCombo || String(it.productNameSnapshot || '').includes('COMBO')));
                  const hasCombo = comboItems.length > 0;

                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-black text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{order.orderNumber}</span>
                            {hasCombo && (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFD400] text-[#050505] text-[9px] font-black uppercase tracking-wider border border-amber-400 shadow-2xs">
                                🎁 COMBO
                              </span>
                            )}
                          </div>
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{order.customerName}</div>
                          <div className="text-[11px] text-slate-500">{order.mobile} • {order.city}</div>
                        </td>
                        <td className="p-3 font-black text-slate-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="p-3">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {order.status !== 'CONFIRMED' && order.status !== 'DELIVERED' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-black text-[10px] uppercase border border-blue-200 transition active:scale-95 cursor-pointer"
                                title="Mark as Confirmed"
                              >
                                Confirm
                              </button>
                            )}
                            {order.status !== 'DELIVERED' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black text-[10px] uppercase border border-emerald-200 transition active:scale-95 cursor-pointer"
                                title="Mark as Delivered"
                              >
                                Deliver
                              </button>
                            )}
                            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-[10px] uppercase border border-rose-200 transition active:scale-95 cursor-pointer"
                                title="Cancel Order"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {hasCombo && (
                        <tr className="bg-amber-50/40 border-b border-amber-200/60">
                          <td colSpan={5} className="px-3 py-2.5">
                            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2">
                              <div className="font-black text-[10px] uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                                <span>📦 COMBO PACKAGING CHECKLIST (Items to include in parcel):</span>
                              </div>
                              {comboItems.map((cItem, cIdx) => {
                                let bundleList = [];
                                if (cItem.bundledItems) {
                                  try {
                                    bundleList = typeof cItem.bundledItems === 'string' ? JSON.parse(cItem.bundledItems) : cItem.bundledItems;
                                  } catch (e) {}
                                }
                                return (
                                  <div key={cIdx} className="space-y-1">
                                    <span className="font-black text-slate-900 text-xs">{cItem.productNameSnapshot} (Qty: {cItem.quantity})</span>
                                    {Array.isArray(bundleList) && bundleList.length > 0 ? (
                                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                                        {bundleList.map((bItem, bIdx) => (
                                          <span key={bIdx} className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-amber-200 font-bold text-slate-900 text-[11px] shadow-2xs">
                                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white font-black text-[9px] flex items-center justify-center shrink-0">✓</span>
                                            Add {bItem.quantity || 1}× {bItem.name || bItem.customItemName} to package
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-[11px] text-amber-800 italic">See catalog for bundled item details.</p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUICK PRODUCT SEARCH WIDGET (ADMIN DASHBOARD) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#E31B23]" />
              <span>Search Products ({allProducts.length} Total Inventory)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Quickly find any product to edit price, stock, or active state.
            </p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-[#E31B23] hover:underline flex items-center gap-1 shrink-0 uppercase tracking-wider"
          >
            <span>Inventory Manager →</span>
          </Link>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product by name, brand, or category... (e.g. iPhone, Samsung, Charger)"
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#E31B23] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* SEARCH RESULTS TABLE */}
        {searchQuery.trim() !== '' && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                Found {searchedProducts.length} result{searchedProducts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {searchedProducts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium">
                No products found matching "<strong className="text-slate-700">{searchQuery}</strong>".
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                      <th className="p-3">Product</th>
                      <th className="p-3">Category / Brand</th>
                      <th className="p-3">Price (₹)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {searchedProducts.slice(0, 10).map(p => {
                      let images = [];
                      try { images = JSON.parse(p.images); } catch (e) { images = ['/images/placeholder.jpg']; }
                      const mainImg = images[0] || '/images/placeholder.jpg';
                      const sellingPrice = p.offerPrice ?? p.price ?? p.currentPrice ?? p.salePrice ?? p.regularPrice;
                      const isDiscounted = p.regularPrice > sellingPrice && sellingPrice > 0;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={mainImg}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-contain bg-white border p-0.5 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block text-sm">{p.name}</span>
                                <span className="text-[10px] text-slate-400">ID: #{p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600">
                            <div>{p.category}</div>
                            <div className="text-[10px] text-slate-400">{p.brand}</div>
                          </td>
                          <td className="p-3">
                            <div>
                              <span className="font-bold text-slate-900">{formatCurrency(sellingPrice)}</span>
                              {isDiscounted && (
                                <span className="text-[10px] text-slate-400 line-through block">{formatCurrency(p.regularPrice)}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleProductStatus(p)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                                p.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {p.isActive ? '● Active' : '○ Disabled'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/products/edit/${p.id}`}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition-colors"
                              >
                                <Edit2 className="w-3 h-3 text-slate-600" />
                                <span>Edit</span>
                              </Link>
                              <Link
                                to="/admin/sale"
                                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1 border border-amber-200 transition-colors"
                              >
                                <Flame className="w-3 h-3 text-amber-600" />
                                <span>Sale</span>
                              </Link>
                              <Link
                                to={`/product/${p.id}`}
                                target="_blank"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                title="View in Store"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SUNDAY SALE EVENT STATUS PANEL */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[10px] font-black text-[#E31B23] uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-[#E31B23]" />
              <span>WEEKLY EVENT CONTROL</span>
            </span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight mt-0.5">
              Sunday Shopping Sale Status
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              sundaySale.isLive
                ? 'bg-emerald-500 text-white shadow-md animate-pulse'
                : 'bg-slate-100 text-slate-600 border border-slate-300'
            }`}>
              ● {sundaySale.statusText}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* CURRENT DAY */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">CURRENT DAY</span>
            <span className="font-black text-base text-slate-900">
              {currentDayName}
            </span>
          </div>

          {/* CAN ACTIVATE TODAY? */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">CAN ACTIVATE TODAY?</span>
            <span className="font-black text-base text-amber-600">
              {currentDayName === 'Sunday' || sundaySale.dayInfo?.isSunday ? 'YES (Sunday Active)' : 'NO (Sundays only)'}
            </span>
          </div>

          {/* CUSTOMER VIEW */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">CUSTOMER VIEW</span>
            <span className="font-black text-base text-slate-800">
              {sundaySale.isLive ? 'Showing Live Sale Products & Offers' : 'Showing Closed Message'}
            </span>
          </div>

        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to="/admin/sale"
            className="px-5 py-3 rounded-2xl bg-[#E31B23] hover:bg-[#c9141b] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-transform hover:scale-102"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>MANAGE SALE EVENT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/sunday-sale"
            target="_blank"
            className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-300 transition-colors"
          >
            Preview Customer Sale Page ↗
          </Link>
        </div>
      </div>

    </div>
  );
}
