import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { formatCurrency } from '../../utils/formatters';
import { parseResponseJson } from '../../utils/apiHelper';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Award,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Percent,
  Layers,
  Calendar
} from 'lucide-react';

export default function AdminAnalytics() {
  const { adminToken } = useAdminAuth();
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(null);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await parseResponseJson(res);
      if (data.success && data.metrics) {
        setMetrics(data.metrics);
        setLastUpdatedTime(new Date());
      } else {
        throw new Error(data.error || 'Failed to calculate analytics metrics');
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err.message);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Real-time synchronization whenever orders or products change
  useRealtimeSync(fetchAnalytics, ['ORDERS_UPDATED', 'PRODUCTS_UPDATED'], 12000);

  if (isLoading && !metrics) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-12 border-4 border-[#E31B23] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-wider text-slate-500">
          Calculating Real-Time Store Metrics...
        </p>
      </div>
    );
  }

  const fin = metrics?.financials || {};
  const ord = metrics?.orders || {};
  const cust = metrics?.customers || {};
  const inv = metrics?.inventory || {};
  const statusCounts = ord.statusCounts || { PENDING: 0, CONFIRMED: 0, DELIVERED: 0, CANCELLED: 0 };
  const totalOrdersCount = ord.totalOrders || 0;

  // Calculate percentages for order funnel
  const getPercent = (count) => (totalOrdersCount > 0 ? Math.round((count / totalOrdersCount) * 100) : 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#E31B23] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-Time Business Intelligence</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>LIVE SYNC</span>
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1">
            Store Metrics & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time financial revenue, order fulfillment status, customer leaderboards, and stock warnings.
            {lastUpdatedTime && (
              <span className="ml-1 text-slate-400">
                (Last updated: {lastUpdatedTime.toLocaleTimeString()})
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAnalytics(false)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm flex items-center gap-2 text-xs font-bold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. TOP METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Stat 1: Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Store Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {formatCurrency(fin.totalRevenue || 0)}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Today: {formatCurrency(fin.todayRevenue || 0)}
              </span>
              <span className="text-slate-400">({ord.todayOrders || 0} orders today)</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Stat 2: Average Order Value */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Order Value</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {formatCurrency(fin.aov || 0)}
            </h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Average spent per completed customer purchase
            </p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Stat 3: Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Store Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {ord.totalOrders || 0}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-amber-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{ord.fulfillmentRate || 100}% Fulfillment Success Rate</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Stat 4: Registered Customers & Discounts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Shoppers</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {cust.registeredUsersCount || 0}
            </h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Saved Total Discounts: <strong className="text-purple-700">{formatCurrency(fin.totalDiscounts || 0)}</strong>
            </p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

      </div>

      {/* 2. ORDER FULFILLMENT FUNNEL & SUNDAY SALE INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT 7 COLS: ORDER STATUS DISTRIBUTION */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-display font-black text-xl text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#E31B23]" />
              <span>Order Status & Fulfillment Pipeline</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live breakdown of customer order status across lifecycle steps.
            </p>
          </div>

          {/* VISUAL PROGRESS BAR */}
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${getPercent(statusCounts.DELIVERED)}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Delivered: ${statusCounts.DELIVERED}`}
            />
            <div
              style={{ width: `${getPercent(statusCounts.CONFIRMED)}%` }}
              className="bg-blue-500 transition-all duration-500"
              title={`Confirmed / Shipping: ${statusCounts.CONFIRMED}`}
            />
            <div
              style={{ width: `${getPercent(statusCounts.PENDING)}%` }}
              className="bg-amber-400 transition-all duration-500"
              title={`Pending: ${statusCounts.PENDING}`}
            />
            <div
              style={{ width: `${getPercent(statusCounts.CANCELLED)}%` }}
              className="bg-red-500 transition-all duration-500"
              title={`Cancelled: ${statusCounts.CANCELLED}`}
            />
          </div>

          {/* STATUS CARDS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-700 text-xs font-black">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending</span>
              </div>
              <div className="text-xl font-black text-slate-900">{statusCounts.PENDING}</div>
              <div className="text-[10px] font-bold text-amber-700">{getPercent(statusCounts.PENDING)}% of total</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-700 text-xs font-black">
                <Truck className="w-3.5 h-3.5" />
                <span>Confirmed</span>
              </div>
              <div className="text-xl font-black text-slate-900">{statusCounts.CONFIRMED}</div>
              <div className="text-[10px] font-bold text-blue-700">{getPercent(statusCounts.CONFIRMED)}% of total</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-black">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Delivered</span>
              </div>
              <div className="text-xl font-black text-slate-900">{statusCounts.DELIVERED}</div>
              <div className="text-[10px] font-bold text-emerald-700">{getPercent(statusCounts.DELIVERED)}% of total</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200/70 text-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-red-700 text-xs font-black">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Cancelled</span>
              </div>
              <div className="text-xl font-black text-slate-900">{statusCounts.CANCELLED}</div>
              <div className="text-[10px] font-bold text-red-700">{getPercent(statusCounts.CANCELLED)}% of total</div>
            </div>

          </div>
        </div>

        {/* RIGHT 5 COLS: SUNDAY SALE & SPECIAL DEALS INSIGHTS */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0c0f17] to-[#161a26] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD400]/10 border border-[#FFD400]/30 text-[#FFD400] text-xs font-bold mb-3">
              <Flame className="w-3.5 h-3.5 fill-[#FFD400]" />
              <span>Sunday Event Analytics</span>
            </div>
            <h3 className="font-display font-black text-2xl text-white tracking-tight">
              Sunday Sale Performance
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Revenue and orders generated during special Sunday Event sales.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-slate-300">Sunday Sale Revenue</span>
                <span className="text-lg font-black text-[#FFD400]">{formatCurrency(ord.sundaySaleRevenue || 0)}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-slate-300">Sunday Sale Orders</span>
                <span className="text-base font-black text-white">{ord.sundaySaleOrdersCount || 0} Orders</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Catalog Active Items: <strong className="text-white">{inv.activeCatalogProducts || 0}</strong></span>
            <span>Total Catalog: <strong className="text-white">{inv.totalCatalogProducts || 0}</strong></span>
          </div>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFD400]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

      </div>

      {/* 3. CATEGORY REVENUE DISTRIBUTION & LOW STOCK ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CATEGORY SALES PERFORMANCE (8 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-black text-xl text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#E31B23]" />
                <span>Category Sales Distribution</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Revenue generated across smartphone, accessory, and gadget categories.
              </p>
            </div>
          </div>

          {(!metrics?.categoryStats || metrics.categoryStats.length === 0) ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed text-slate-400 text-xs font-medium">
              No category sales data recorded yet. Place customer orders to view category distribution.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {metrics.categoryStats.map((cat, idx) => {
                const totalCatRev = fin.totalRevenue || 1;
                const pct = Math.min(100, Math.round(((cat.revenue || 0) / totalCatRev) * 100));

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{cat.categoryName}</span>
                      <span className="font-black text-slate-900">
                        {formatCurrency(cat.revenue || 0)}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">({cat.unitsSold || 0} units)</span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(5, pct)}%` }}
                        className="h-full bg-gradient-to-r from-[#E31B23] to-amber-500 rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* LOW STOCK ALERTS (5 COLS) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900 tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Low Stock Warnings ({inv.lowStockProducts?.length || 0})</span>
              </h3>
              <p className="text-xs text-slate-500">Products with stock under 5 items needing restock.</p>
            </div>
          </div>

          {(!inv.lowStockProducts || inv.lowStockProducts.length === 0) ? (
            <div className="p-8 text-center bg-emerald-50/60 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All active products have healthy stock levels!</span>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {inv.lowStockProducts.map(p => (
                <div key={p.id} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-contain bg-white border p-0.5 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">{p.category}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      p.stock === 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {p.stock === 0 ? 'OUT OF STOCK' : `${p.stock} left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 4. LEADERBOARDS: TOP PRODUCTS & TOP SPENDING CUSTOMERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* TOP SELLING PRODUCTS LEADERBOARD (6 COLS) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Top Selling Products</span>
              </h3>
              <p className="text-xs text-slate-500">Ranked by total quantity sold and revenue generated.</p>
            </div>
          </div>

          {(!metrics?.topProducts || metrics.topProducts.length === 0) ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed text-slate-400 text-xs font-medium">
              No sales recorded yet. Top performing products will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                    <th className="py-2.5 px-1">Product</th>
                    <th className="py-2.5 px-2 text-center">Units Sold</th>
                    <th className="py-2.5 px-2 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {metrics.topProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-1">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-black text-[10px] flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </span>
                          <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-white border shrink-0" />
                          <span className="font-bold text-slate-900 truncate max-w-[180px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-black text-slate-800">
                        {p.unitsSold}
                      </td>
                      <td className="py-3 px-2 text-right font-black text-emerald-600">
                        {formatCurrency(p.revenue || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TOP SPENDING CUSTOMERS LEADERBOARD (6 COLS) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Top VIP Customers</span>
              </h3>
              <p className="text-xs text-slate-500">Highest-spending shoppers ordered on Prem Mobile.</p>
            </div>
          </div>

          {(!cust.topCustomers || cust.topCustomers.length === 0) ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed text-slate-400 text-xs font-medium">
              No customer spending data available yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                    <th className="py-2.5 px-1">Customer</th>
                    <th className="py-2.5 px-2 text-center">Orders</th>
                    <th className="py-2.5 px-2 text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {cust.topCustomers.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-1">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0">
                            {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-slate-900 truncate">{c.name}</h5>
                            <span className="text-[10px] text-slate-400">{c.mobile}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-black text-slate-800">
                        {c.totalOrders}
                      </td>
                      <td className="py-3 px-2 text-right font-black text-purple-700">
                        {formatCurrency(c.totalSpent || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
