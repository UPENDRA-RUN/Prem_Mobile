import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { parseResponseJson } from '../../utils/apiHelper';
import {
  Star,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  RefreshCw,
  Sparkles,
  Filter,
  Image as ImageIcon,
  MessageSquare,
  AlertCircle,
  Check,
  X,
  ExternalLink
} from 'lucide-react';

export default function AdminReviews() {
  const { adminToken } = useAdminAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, avgRating: 5.0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, APPROVED, PENDING, REJECTED
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchReviews = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const res = await fetch('/api/reviews/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setReviews(data.data.reviews || []);
        setStats(data.data.stats || { total: 0, approved: 0, pending: 0, rejected: 0, avgRating: 5.0 });
      }
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [adminToken]);

  useRealtimeSync(() => fetchReviews(true), ['REVIEWS_UPDATED', 'ORDER_CREATED', 'PRODUCTS_UPDATED']);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoadingId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/reviews/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setMessage({ type: 'success', text: `Review status updated to ${newStatus}` });
        fetchReviews(true);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update status' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error updating status' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer review?')) return;
    setActionLoadingId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/reviews/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setMessage({ type: 'success', text: 'Review deleted successfully' });
        fetchReviews(true);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete review' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error deleting review' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'APPROVED') return r.status === 'APPROVED';
    if (filter === 'PENDING') return r.status === 'PENDING';
    if (filter === 'REJECTED') return r.status === 'REJECTED';
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-[#center] font-bold text-xl">
              ⭐
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Customer Ratings & Photo Reviews</h1>
              <p className="text-sm text-slate-500">Moderate customer feedback and unboxing photos from Gwalior shoppers</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-Time Sync
          </span>

          <button
            onClick={() => fetchReviews()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          {message.text}
        </div>
      )}

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reviews</span>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{stats.total}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{stats.approved}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{stats.pending}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Store Rating</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-slate-800">{stats.avgRating}</p>
            <span className="text-amber-500 font-bold text-lg">★</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100 shadow-sm w-fit overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-400 ml-2" />
        {[
          { id: 'ALL', label: `All Reviews (${stats.total})` },
          { id: 'APPROVED', label: `Approved (${stats.approved})` },
          { id: 'PENDING', label: `Pending (${stats.pending})` },
          { id: 'REJECTED', label: `Rejected (${stats.rejected})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filter === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading customer reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">No Reviews Found</h3>
          <p className="text-slate-500 text-sm">There are no reviews under the "{filter}" filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Product Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <img
                    src={rev.productImage}
                    alt={rev.productName}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                    onError={(e) => { e.target.src = '/images/prem-main.jpg'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 truncate text-sm">{rev.productName || `Product #${rev.productId}`}</h4>
                    <span className="inline-block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {rev.productCategory || 'Catalog Item'}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rev.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                    rev.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {rev.status}
                  </span>
                </div>

                {/* Rating & Reviewer info */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="font-bold text-sm text-slate-700 ml-1">{rev.rating}.0</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="mt-2">
                  <p className="font-semibold text-slate-800 text-sm">{rev.customerName}</p>
                  {rev.customerEmail && (
                    <p className="text-xs text-slate-400">{rev.customerEmail}</p>
                  )}
                </div>

                {/* Feedback Comment */}
                <p className="mt-3 text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{rev.comment}"
                </p>

                {/* Unboxing Photo Thumbnail if available */}
                {rev.photoUrl && (
                  <div className="mt-3">
                    <span className="text-xs font-bold text-slate-500 block mb-1 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> Unboxing Photo:
                    </span>
                    <button
                      onClick={() => setSelectedPhoto(rev.photoUrl)}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 block w-28 h-20 bg-slate-100"
                    >
                      <img
                        src={rev.photoUrl}
                        alt="Unboxing photo"
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop'; }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-xs font-semibold">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {rev.status !== 'APPROVED' && (
                    <button
                      disabled={actionLoadingId === rev.id}
                      onClick={() => handleUpdateStatus(rev.id, 'APPROVED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {rev.status !== 'REJECTED' && (
                    <button
                      disabled={actionLoadingId === rev.id}
                      onClick={() => handleUpdateStatus(rev.id, 'REJECTED')}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}
                </div>

                <button
                  disabled={actionLoadingId === rev.id}
                  onClick={() => handleDeleteReview(rev.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Zoom Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2 border border-slate-700">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhoto}
              alt="Unboxing Customer Photo"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
