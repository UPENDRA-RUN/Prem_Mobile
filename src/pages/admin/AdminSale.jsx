import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Flame,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Save,
  Search,
  Check,
  Percent,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
  X,
  Edit3,
  RefreshCw
} from 'lucide-react';

export default function AdminSale() {
  const { adminToken } = useAdminAuth();

  const [sale, setSale] = useState(null);
  const [candidateProducts, setCandidateProducts] = useState([]);
  const [status, setStatus] = useState('OFFLINE'); // 'DRAFT', 'READY', 'LIVE', 'ENDED', 'OFFLINE'
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form Fields
  const [name, setName] = useState('Special Sale Event');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedItems, setSelectedItems] = useState({}); // { [productId]: salePrice }
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [conflictModal, setConflictModal] = useState(null); // { message, liveSaleId }

  const fetchAdminSale = async () => {
    if (!adminToken) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/sale/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setSale(data.sale);
        setStatus(data.status || 'OFFLINE');
        setCandidateProducts(data.candidateProducts || []);

        if (data.sale) {
          setName(data.sale.name || 'Special Sale Event');
          setStartDate(data.sale.startDate || new Date().toISOString().split('T')[0]);
          setEndDate(data.sale.endDate || new Date().toISOString().split('T')[0]);
          setStartTime(data.sale.startTime || '');
          setEndTime(data.sale.endTime || '');
        }

        // Initialize selected items map
        const initialMap = {};
        for (const p of data.candidateProducts || []) {
          if (p.isSelected && p.salePrice) {
            initialMap[p.id] = p.salePrice;
          }
        }
        setSelectedItems(initialMap);
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to load sale state.' });
      }
    } catch (err) {
      console.error('Failed to load admin sale state:', err);
      setNotification({ type: 'error', message: 'Network error loading sale state.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdminSale();
    }
  }, [adminToken]);

  // Product Selection Handlers
  const handleToggleProduct = (product) => {
    setSelectedItems(prev => {
      const updated = { ...prev };
      if (updated[product.id] !== undefined) {
        delete updated[product.id];
      } else {
        // Default 25% discount rounded to nearest ₹10
        const defaultSalePrice = Math.max(10, Math.round((product.regularPrice * 0.75) / 10) * 10);
        updated[product.id] = defaultSalePrice;
      }
      return updated;
    });
  };

  const handlePriceChange = (productId, price) => {
    const val = parseFloat(price) || 0;
    setSelectedItems(prev => ({
      ...prev,
      [productId]: val
    }));
  };

  // Bulk discount helper
  const handleBulkDiscount = (percentage) => {
    setSelectedItems(prev => {
      const updated = { ...prev };
      for (const idStr of Object.keys(updated)) {
        const id = Number(idStr);
        const prod = candidateProducts.find(p => p.id === id);
        if (prod) {
          const discountMultiplier = (100 - percentage) / 100;
          updated[id] = Math.max(10, Math.round((prod.regularPrice * discountMultiplier) / 10) * 10);
        }
      }
      return updated;
    });
    setNotification({
      type: 'success',
      message: `Applied ${percentage}% discount to all selected products.`
    });
  };

  // 1. SAVE SALE (Sets status to READY, does NOT activate)
  const handleSaveSale = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    const itemsPayload = Object.entries(selectedItems).map(([pId, price]) => ({
      productId: Number(pId),
      salePrice: Number(price)
    }));

    try {
      const res = await fetch('/api/sale/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          saleId: sale?.id,
          name: name.trim() || 'Special Sale Event',
          startDate,
          endDate,
          startTime: startTime || '',
          endTime: endTime || '',
          items: itemsPayload
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save sale configuration.');
      }

      setSale(data.sale);
      setStatus(data.status);
      setNotification({
        type: 'success',
        message: data.message || `Sale saved! Status is now ${data.status}. Press [GO LIVE] when ready.`
      });
      fetchAdminSale();
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // 2. GO LIVE FLOW (Strict manual activation)
  const handleConfirmGoLive = async () => {
    setActionLoading(true);
    setNotification(null);
    setShowGoLiveModal(false);

    try {
      // First save if any changes pending
      const itemsPayload = Object.entries(selectedItems).map(([pId, price]) => ({
        productId: Number(pId),
        salePrice: Number(price)
      }));

      const saveRes = await fetch('/api/sale/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          saleId: sale?.id,
          name: name.trim() || 'Special Sale Event',
          startDate,
          endDate,
          startTime: startTime || '',
          endTime: endTime || '',
          items: itemsPayload
        })
      });
      const saveData = await saveRes.json();
      const currentSaleId = saveData.sale?.id || sale?.id;

      // Request Go Live
      const liveRes = await fetch('/api/sale/admin/go-live', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ saleId: currentSaleId })
      });

      const liveData = await liveRes.json();
      if (!liveRes.ok || !liveData.success) {
        if (liveData.liveSaleId) {
          // Conflict modal: Another sale is currently live
          setConflictModal({
            message: liveData.error,
            liveSaleId: liveData.liveSaleId
          });
          return;
        }
        throw new Error(liveData.error || 'Failed to activate sale.');
      }

      setSale(liveData.sale);
      setStatus('LIVE');
      setNotification({
        type: 'success',
        message: liveData.message || '🔥 Sale is now LIVE! Customers can immediately see special prices.'
      });
      fetchAdminSale();
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // 3. END SALE FLOW (Manual end)
  const handleConfirmEndSale = async () => {
    setActionLoading(true);
    setNotification(null);
    setShowEndModal(false);

    try {
      const res = await fetch('/api/sale/admin/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ saleId: sale?.id })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to end sale.');
      }

      setSale(data.sale);
      setStatus('ENDED');
      setNotification({
        type: 'success',
        message: data.message || 'Sale ended. All products have returned to regular prices.'
      });
      fetchAdminSale();
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Products
  const categories = ['ALL', ...new Set(candidateProducts.map(p => p.category))];
  const filteredProducts = candidateProducts.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedCount = Object.keys(selectedItems).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* HEADER MATCHING ADMIN THEME */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Promotions & Flash Deals
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>🔥 Sale Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, schedule, and control live sales on any day of the week with manual Go Live activation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminSale}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
            title="Refresh Sale State"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/sale"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-wider shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Preview Customer Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {notification && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xs animate-fade-in ${
          notification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. CURRENT SALE STATUS & MASTER ACTION CONTROLS */}
      <div className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-xs transition-all ${
        status === 'LIVE'
          ? 'border-2 border-emerald-500 ring-4 ring-emerald-50'
          : status === 'READY'
          ? 'border-2 border-amber-300 ring-4 ring-amber-50'
          : 'border border-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Status Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Current Status:</span>
              
              {status === 'LIVE' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>🟢 SALE LIVE</span>
                </span>
              )}

              {status === 'READY' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>🟡 SALE READY (NOT LIVE)</span>
                </span>
              )}

              {(status === 'OFFLINE' || status === 'DRAFT') && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>🔴 OFFLINE</span>
                </span>
              )}

              {status === 'ENDED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-black uppercase tracking-wider">
                  <span>⚪ SALE ENDED</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {status === 'LIVE'
                ? `🔥 "${name}" is Currently Active!`
                : status === 'READY'
                ? `Ready to Activate: "${name}"`
                : `Offline: Configure & Press GO LIVE`}
            </h2>

            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              {status === 'LIVE'
                ? 'Customers on the website see the special discounted prices and live banner. You can end this sale manually anytime.'
                : status === 'READY'
                ? 'The sale is configured with products and promotional prices, but is strictly OFFLINE until you press [GO LIVE].'
                : 'Configure the sale dates and select products below. Saving sets the sale to READY. Pressing [GO LIVE] makes it active.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {status === 'LIVE' ? (
              <button
                onClick={() => setShowEndModal(true)}
                disabled={actionLoading}
                className="px-6 py-3.5 rounded-xl bg-[#e51b23] hover:bg-[#c91219] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform active:scale-95"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>🔴 END SALE NOW</span>
              </button>
            ) : (
              <button
                onClick={() => setShowGoLiveModal(true)}
                disabled={selectedCount === 0 || actionLoading}
                className="px-6 py-3.5 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] disabled:bg-slate-100 disabled:text-slate-400 text-[#050505] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                title={selectedCount === 0 ? 'Select at least 1 product to Go Live' : 'Make Sale Live to Customers'}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>🔴 GO LIVE NOW</span>
              </button>
            )}

            <button
              onClick={handleSaveSale}
              disabled={isSaving}
              className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4 text-[#ffd000]" />
              <span>{isSaving ? 'SAVING...' : 'SAVE SALE'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. SALE SCHEDULING (LIGHT THEME MATCHING PREM MOBILE) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ffd000]" />
              <span>Sale Schedule & Details</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select ANY date of the week (no Sunday restriction). Scheduling sets the timeframe; only manual GO LIVE makes it live.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
            Flexible Any-Day Schedule
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Sale Name */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sale Event Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Big Mobile Sale / Special Dhamaka"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Start Date (Any Day) *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              End Date (Any Day) *
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
            />
          </div>

          {/* Optional Start Time */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Start Time (Optional)</span>
              </label>
              {startTime && (
                <button
                  type="button"
                  onClick={() => setStartTime('')}
                  className="text-[10px] text-slate-400 hover:text-red-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
            />
          </div>

          {/* Optional End Time */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>End Time (Optional Auto-End)</span>
              </label>
              {endTime && (
                <button
                  type="button"
                  onClick={() => setEndTime('')}
                  className="text-[10px] text-slate-400 hover:text-red-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
            />
          </div>

        </div>
        <p className="text-[11px] text-slate-400 italic">
          💡 Leave start and end times blank if you want the sale to run continuously until you manually click "End Sale".
        </p>
      </div>

      {/* 3. PRODUCT SELECTION & SALE PRICING */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900">
              Select Products & Set Sale Prices ({selectedCount} Selected)
            </h3>
            <p className="text-xs text-slate-500">
              Check the items to include. Enter the promotional sale price for each.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase hidden md:inline">Quick Presets:</span>
            <button
              onClick={() => handleBulkDiscount(20)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              20% Off
            </button>
            <button
              onClick={() => handleBulkDiscount(30)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              30% Off
            </button>
            <button
              onClick={() => handleBulkDiscount(40)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              40% Off
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title or brand..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-[#050505]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#050505] text-[#ffd000]'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                <th className="p-3 w-12 text-center">Include</th>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Regular Price</th>
                <th className="p-3">Sale Price (₹)</th>
                <th className="p-3">Discount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredProducts.map(p => {
                const isSelected = selectedItems[p.id] !== undefined;
                const currentSalePrice = isSelected ? selectedItems[p.id] : '';
                const savings = isSelected ? Math.max(0, p.regularPrice - (Number(currentSalePrice) || p.regularPrice)) : 0;
                const discountPercent = isSelected && p.regularPrice > 0
                  ? Math.round((savings / p.regularPrice) * 100)
                  : 0;

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${isSelected ? 'bg-amber-50/40' : 'hover:bg-slate-50'}`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleProduct(p)}
                        className="w-4 h-4 rounded text-[#ffd000] focus:ring-[#ffd000] bg-white border-slate-300 cursor-pointer accent-[#ffd000]"
                      />
                    </td>

                    {/* Product Name & Thumbnail */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block text-sm">{p.name}</span>
                          <span className="text-[11px] text-slate-400">{p.brand}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3 text-slate-600">
                      {p.category}
                    </td>

                    {/* Regular Price */}
                    <td className="p-3 font-bold text-slate-800">
                      {formatCurrency(p.regularPrice)}
                    </td>

                    {/* Sale Price Input */}
                    <td className="p-3">
                      {isSelected ? (
                        <div className="flex items-center gap-1.5 max-w-[140px]">
                          <span className="text-slate-400 font-bold">₹</span>
                          <input
                            type="number"
                            min="1"
                            max={p.regularPrice - 1}
                            value={currentSalePrice}
                            onChange={(e) => handlePriceChange(p.id, e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border-2 border-amber-400 text-slate-900 font-black text-sm focus:outline-none focus:border-[#e51b23]"
                          />
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not included</span>
                      )}
                    </td>

                    {/* Discount Badge */}
                    <td className="p-3">
                      {isSelected && discountPercent > 0 ? (
                        <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[11px]">
                          {discountPercent}% OFF (Save ₹{savings})
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Save & Go Live Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected for this sale event.
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveSale}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-200 transition-colors"
            >
              <Save className="w-4 h-4 text-[#ffd000]" />
              <span>Save Changes</span>
            </button>

            {status !== 'LIVE' && (
              <button
                onClick={() => setShowGoLiveModal(true)}
                disabled={selectedCount === 0 || actionLoading}
                className="px-6 py-2.5 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] disabled:bg-slate-100 disabled:text-slate-400 text-[#050505] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>GO LIVE</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* MODAL 1: GO LIVE CONFIRMATION */}
      {showGoLiveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Flame className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                Make this sale live now?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to make <strong className="text-slate-900">"{name}"</strong> live?
                Once activated, customers across the store will immediately see the special sale prices and top banner.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div>• Products included: <strong className="text-slate-900">{selectedCount}</strong></div>
              <div>• Schedule: <strong className="text-slate-900">{startDate} to {endDate}</strong></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowGoLiveModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmGoLive}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-[#e51b23] hover:bg-[#c91219] text-white text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{actionLoading ? 'Activating...' : 'GO LIVE NOW'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: END SALE CONFIRMATION */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                Are you sure you want to end this sale?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The website will immediately stop showing sale prices, and all products will return to their regular catalog prices.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmEndSale}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-[#e51b23] hover:bg-[#c91219] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-transform active:scale-95"
              >
                {actionLoading ? 'Ending...' : 'END SALE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFLICTING LIVE SALE ALERT (SECTION 12) */}
      {conflictModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-300 shadow-2xl space-y-6 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                Another Sale is Currently Live
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {conflictModal.message || 'Another sale is currently live. Please end the current sale before starting a new one.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConflictModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  setConflictModal(null);
                  fetchAdminSale();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] text-xs font-black uppercase tracking-wider shadow-xs transition-colors"
              >
                VIEW CURRENT SALE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
