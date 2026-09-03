import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
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
  RefreshCw
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

  const [sundaySale, setSundaySale] = useState({
    isLive: false,
    statusText: 'OFFLINE',
    dayInfo: { dayName: 'Friday', isSunday: false }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Products
      const prodRes = await fetch('/api/products/admin/all', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const prodData = await prodRes.json();
      const allProds = prodData.products || [];
      const activeProds = allProds.filter(p => p.isActive);

      // 2. Orders
      const orderRes = await fetch('/api/orders/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const orderData = await orderRes.json();
      const allOrders = orderData.orders || [];
      const todayStr = new Date().toISOString().slice(0, 10);
      const todayOrders = allOrders.filter(o => o.createdAt?.startsWith(todayStr));

      // 3. Sunday Sale
      const saleRes = await fetch('/api/sunday-sale/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const saleData = await saleRes.json();

      setStats({
        totalProducts: allProds.length,
        activeProducts: activeProds.length,
        totalOrders: allOrders.length,
        todayOrders: todayOrders.length
      });

      setSundaySale({
        isLive: saleData.isLive,
        statusText: saleData.statusText || 'OFFLINE',
        dayInfo: saleData.dayInfo || {}
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [adminToken]);

  const handleEndSale = async () => {
    if (!window.confirm('Are you sure you want to end today\'s Sunday Sale?')) return;
    try {
      const res = await fetch('/api/sunday-sale/admin/end', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage('Sunday Sale has been ended.');
        fetchDashboardData();
      }
    } catch (e) {
      alert('Failed to end sale: ' + e.message);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#e51b23]">
            Store Overview
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Today: <span className="font-bold text-slate-700">{sundaySale.dayInfo?.dayName || 'Today'}</span>
            {sundaySale.dayInfo?.isSimulated && (
              <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                Simulated {sundaySale.dayInfo?.simulatedDay}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
        </div>
      )}

      {/* 4 KEY STAT METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Products */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Total Products</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Active Products</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Today's Orders</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#e51b23] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display font-black text-3xl sm:text-4xl text-[#e51b23]">
              {stats.todayOrders}
            </span>
          </div>
        </div>

      </div>

      {/* SUNDAY SALE STATUS CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e51b23]/10 text-[#e51b23] text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-[#e51b23]" />
              <span>WEEKLY EVENT CONTROL</span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900">
              Sunday Shopping Sale Status
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {sundaySale.isLive ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>🟢 SUNDAY SALE LIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e51b23]" />
                <span>🔴 OFFLINE</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-400 block mb-1">CURRENT DAY</span>
            <span className="font-black text-base text-slate-800">{sundaySale.dayInfo?.dayName}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-400 block mb-1">CAN ACTIVATE TODAY?</span>
            <span className="font-black text-base text-slate-800">
              {sundaySale.dayInfo?.isSunday ? 'YES (Today is Sunday)' : 'NO (Sundays only)'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-400 block mb-1">CUSTOMER VIEW</span>
            <span className="font-black text-base text-slate-800">
              {sundaySale.isLive ? 'Showing Live Sale Prices' : 'Showing Closed Message'}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {sundaySale.isLive ? (
            <>
              <Link
                to="/admin/sale"
                className="px-6 py-3 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
              >
                <span>MANAGE LIVE SALE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleEndSale}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-sm"
              >
                END SALE
              </button>
            </>
          ) : (
            <Link
              to="/admin/sale"
              className="px-6 py-3 rounded-xl bg-[#050505] hover:bg-[#222] text-[#ffd000] font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-[#ffd000]" />
              <span>MANAGE SALE EVENT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <Link
            to="/sale"
            target="_blank"
            className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider"
          >
            Preview Customer Sale Page ↗
          </Link>
        </div>


      </div>

    </div>
  );
}
