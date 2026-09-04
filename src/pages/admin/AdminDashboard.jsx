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
  ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const { adminToken } = useAdminAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    todayOrders: 0
  });

  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [sundaySale, setSundaySale] = useState({
    isLive: false,
    statusText: 'OFFLINE',
    dayInfo: { currentDay: 'Friday', isSunday: false }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
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

      // 3. Sunday Sale
      const saleRes = await fetch('/api/sunday-sale/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const saleData = await parseResponseJson(saleRes);

      setStats({
        totalProducts: prods.length,
        activeProducts: activeProds.length,
        totalOrders: allOrders.length,
        todayOrders: todayOrders.length
      });

      setSundaySale({
        isLive: saleData.isLive,
        statusText: saleData.statusText || 'OFFLINE',
        dayInfo: saleData.dayInfo || { currentDay: new Date().toLocaleDateString('en-US', { weekday: 'long' }) }
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useRealtimeSync(fetchDashboardData, ['PRODUCTS_UPDATED', 'ORDERS_UPDATED'], 3000);

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
        fetchDashboardData();
      }
    } catch (e) {
      alert('Error updating status: ' + e.message);
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#E31B23] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-[#E31B23]" />
            <span>Store Overview</span>
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Today: <span className="font-bold text-slate-900">{currentDayName}</span>
            {sundaySale.dayInfo?.isSimulated && (
              <span className="ml-2 px-2 py-0.5 rounded bg-amber-500 text-slate-900 text-[10px] font-black uppercase">
                Simulated {sundaySale.dayInfo?.simulatedDay}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm"
            title="Refresh Data"
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

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
        </div>
      )}

      {/* QUICK PRODUCT SEARCH WIDGET (ADMIN DASHBOARD) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#E31B23]" />
              <span>Search Products by Name ({allProducts.length} Total Inventory)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Quickly find any product among hundreds of inventory items to edit, inspect, or add to sales.
            </p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-[#E31B23] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All Products →</span>
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
                No products found matching "<strong className="text-slate-700">{searchQuery}</strong>". Try a different product name or brand.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                      <th className="p-3">Product</th>
                      <th className="p-3">Category / Brand</th>
                      <th className="p-3">Regular Price</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {searchedProducts.slice(0, 10).map(p => {
                      let images = [];
                      try { images = JSON.parse(p.images); } catch (e) { images = ['/images/placeholder.jpg']; }
                      const mainImg = images[0] || '/images/placeholder.jpg';

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
                          <td className="p-3 font-bold text-slate-900">
                            {formatCurrency(p.regularPrice)}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleProductStatus(p)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
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

      {/* 4 KEY STAT METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Products */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Total Products</span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display font-black text-3xl sm:text-4xl text-slate-900">
              {stats.totalProducts}
            </span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Active Products</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display font-black text-3xl sm:text-4xl text-emerald-600">
              {stats.activeProducts}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display font-black text-3xl sm:text-4xl text-slate-900">
              {stats.totalOrders}
            </span>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Today's Orders</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E31B23] flex items-center justify-center border border-rose-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display font-black text-3xl sm:text-4xl text-[#E31B23]">
              {stats.todayOrders}
            </span>
          </div>
        </div>

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
