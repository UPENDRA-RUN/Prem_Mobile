import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { parseResponseJson } from '../../utils/apiHelper';
import { formatCurrency } from '../../utils/formatters';
import {
  Ticket,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Power,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  X,
  TrendingUp,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';

export default function AdminCoupons() {
  const { adminToken } = useAdminAuth();
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, totalSavings: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Form State for New Coupon
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENT',
    value: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    expiryDate: '',
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const res = await fetch('/api/coupons/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await parseResponseJson(res);
      if (data.success && data.data) {
        setCoupons(data.data.coupons || []);
        setStats(data.data.stats || { total: 0, active: 0, expired: 0, totalSavings: 0 });
      }
    } catch (err) {
      console.error('Error fetching admin coupons:', err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [adminToken]);

  useRealtimeSync(() => fetchCoupons(true), ['COUPONS_UPDATED', 'ORDER_CREATED']);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = async (coupon) => {
    setActionLoadingId(coupon.id);
    setFeedback(null);
    try {
      const updatedActive = coupon.isActive ? 0 : 1;
      const res = await fetch(`/api/coupons/admin/${coupon.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ isActive: updatedActive })
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setFeedback({ type: 'success', text: `Coupon "${coupon.code}" ${updatedActive ? 'activated' : 'deactivated'}.` });
        fetchCoupons(true);
      } else {
        setFeedback({ type: 'error', text: data.message || 'Failed to toggle status' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Error toggling coupon status' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete promo coupon "${code}"?`)) return;
    setActionLoadingId(id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/coupons/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setFeedback({ type: 'success', text: `Coupon "${code}" deleted successfully.` });
        fetchCoupons(true);
      } else {
        setFeedback({ type: 'error', text: data.message || 'Failed to delete coupon' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Error deleting coupon' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.value) {
      setFeedback({ type: 'error', text: 'Coupon code and discount value are required.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/coupons/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          code: formData.code.trim().toUpperCase(),
          type: formData.type,
          value: Number(formData.value),
          minOrderAmount: Number(formData.minOrderAmount || 0),
          maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
          usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
          expiryDate: formData.expiryDate || null,
          isActive: formData.isActive
        })
      });

      const data = await parseResponseJson(res);
      if (data.success) {
        setFeedback({ type: 'success', text: `Coupon "${formData.code.toUpperCase()}" created successfully!` });
        setIsModalOpen(false);
        setFormData({
          code: '',
          type: 'PERCENT',
          value: '',
          minOrderAmount: '',
          maxDiscountAmount: '',
          usageLimit: '',
          expiryDate: '',
          isActive: true
        });
        fetchCoupons(true);
      } else {
        setFeedback({ type: 'error', text: data.message || 'Failed to create coupon' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Network error creating coupon' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            🎟️
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Promo Code & Coupon Manager</h1>
            <p className="text-sm text-slate-500">Issue, track, and expire discount codes for Gwalior shoppers</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchCoupons()}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh coupons"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#E31B23] hover:bg-[#c9141b] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition hover:scale-102"
          >
            <PlusCircle className="w-4 h-4" />
            <span>CREATE PROMO CODE</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          {feedback.text}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Coupons</span>
            <Ticket className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{stats.total}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Promos</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{stats.active}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Expired</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{stats.expired}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Savings Passed</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{formatCurrency(stats.totalSavings)}</p>
        </div>
      </div>

      {/* Coupons Table */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading store coupons...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No Promo Coupons Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">Create your first discount coupon code to incentivize Gwalior shoppers!</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#050505] text-[#FFD400] font-black text-xs uppercase tracking-wider shadow-md"
          >
            CREATE FIRST COUPON
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount Type & Value</th>
                <th className="p-4">Min Order Threshold</th>
                <th className="p-4">Redemptions</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {coupons.map((c) => {
                const isExpired = c.expiryDate && c.expiryDate < new Date().toISOString().split('T')[0];

                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    
                    {/* Code */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-800 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-lg text-sm tracking-wider">
                          {c.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(c.code)}
                          className="p-1 text-slate-400 hover:text-slate-700 transition"
                          title="Copy Code"
                        >
                          {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Type & Value */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 text-sm block">
                          {c.type === 'PERCENT' ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                        </span>
                        {c.type === 'PERCENT' && c.maxDiscountAmount && (
                          <span className="text-[11px] text-slate-400 font-normal">Cap: up to ₹{c.maxDiscountAmount}</span>
                        )}
                      </div>
                    </td>

                    {/* Min Order */}
                    <td className="p-4 font-semibold">
                      {c.minOrderAmount > 0 ? formatCurrency(c.minOrderAmount) : 'No Minimum'}
                    </td>

                    {/* Redemptions */}
                    <td className="p-4">
                      <span className="font-bold text-slate-800">{c.timesUsed}</span>
                      {c.usageLimit && <span className="text-slate-400 font-normal"> / {c.usageLimit} max</span>}
                    </td>

                    {/* Expiry */}
                    <td className="p-4">
                      {c.expiryDate ? (
                        <span className={`font-semibold ${isExpired ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                          {c.expiryDate} {isExpired ? '(Expired)' : ''}
                        </span>
                      ) : (
                        <span className="text-slate-400">Never Expire</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        isExpired ? 'bg-rose-100 text-rose-800' :
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isExpired ? 'EXPIRED' : c.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={actionLoadingId === c.id}
                          onClick={() => handleToggleStatus(c)}
                          className={`p-2 rounded-xl transition ${
                            c.isActive ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                          title={c.isActive ? 'Deactivate Coupon' : 'Activate Coupon'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        <button
                          disabled={actionLoadingId === c.id}
                          onClick={() => handleDeleteCoupon(c.id, c.code)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in border border-slate-100">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-display font-black text-xl text-slate-800">Create Promo Coupon</h2>
              <p className="text-xs text-slate-500 mt-1">Issue discount code for Prem Mobile storefront</p>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              
              {/* Code */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GWALIOR10 or SUNDAY500"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                />
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    {formData.type === 'PERCENT' ? 'Discount % *' : 'Flat Savings ₹ *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={formData.type === 'PERCENT' ? 'e.g. 10' : 'e.g. 500'}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                  />
                </div>
              </div>

              {/* Min Order & Max Cap */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Min Cart Order ₹
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 999 (0 for none)"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Max Cap Savings ₹
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500 (Optional)"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Usage Limit & Expiry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Usage Limit (Max Uses)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 500 (Optional)"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#050505] hover:bg-slate-800 text-[#FFD400] font-black text-xs uppercase tracking-wider shadow-lg transition"
              >
                {isSubmitting ? 'Creating Promo Code...' : 'CREATE PROMO CODE NOW'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
