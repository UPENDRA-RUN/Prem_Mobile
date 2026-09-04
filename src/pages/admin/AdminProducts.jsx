import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { formatCurrency } from '../../utils/formatters';
import {
  Package,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Power,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function AdminProducts() {
  const { adminToken } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [feedback, setFeedback] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products/admin/all', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useRealtimeSync(fetchProducts, ['PRODUCTS_UPDATED'], 3000);

  const handleToggleStatus = async (product) => {
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
      const data = await res.json();
      if (data.success) {
        setFeedback(`Product "${product.name}" ${updatedActive ? 'activated' : 'disabled'}.`);
        fetchProducts();
      }
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"? This action is instant and real-time.`)) return;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(`Product "${product.name}" deleted successfully.`);
        fetchProducts();
      }
    } catch (e) {
      alert('Error deleting product: ' + e.message);
    }
  };

  const handleClearAllSampleData = async () => {
    if (!window.confirm('Are you sure you want to PURGE ALL sample dummy products? This will give you a 100% clean slate to add your own real products.')) return;

    try {
      const res = await fetch('/api/products/clear-all', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setFeedback('All sample products purged successfully! Ready to upload your own custom products.');
        fetchProducts();
      }
    } catch (e) {
      alert('Error clearing products: ' + e.message);
    }
  };

  const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#E31B23] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-[#E31B23]" />
            <span>Product & Image Management Hub</span>
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
            Store Products ({products.length})
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {products.length > 0 && (
            <button
              onClick={handleClearAllSampleData}
              className="px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
              title="Purge all sample dummy products for a clean slate"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Sample Products</span>
            </button>
          )}

          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm"
            title="Refresh Real-Time Inventory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            to="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-[#E31B23] hover:bg-[#c9141b] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-transform hover:scale-102"
          >
            <PlusCircle className="w-4 h-4 fill-white text-[#E31B23]" />
            <span>ADD NEW PRODUCT</span>
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search products by name, brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#E31B23] focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23] cursor-pointer"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-4 sm:px-6">Product</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price (₹)</th>
                <th className="py-4 px-4">Stock</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-500 space-y-3">
                    <Package className="w-12 h-12 text-slate-300 mx-auto" />
                    <div>
                      <p className="text-slate-900 font-black text-base">No products in inventory.</p>
                      <p className="text-xs text-slate-500 font-medium">Click "ADD NEW PRODUCT" above to upload your first product & photos!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Product Name & Image */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={p.image || '/images/prem-main.jpg'}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/prem-main.jpg';
                            }}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                            {p.name}
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            Brand: <strong className="text-slate-700">{p.brand || 'Prem Mobile'}</strong>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                      {p.category}
                    </td>

                    {/* Regular Price */}
                    <td className="py-4 px-4 text-xs font-black text-[#E31B23]">
                      {formatCurrency(p.regularPrice)}
                    </td>

                    {/* Stock */}
                    <td className="py-4 px-4 text-xs font-bold text-slate-700">
                      {p.stock} units
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {p.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">
                          Live Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-black uppercase">
                          Disabled
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          title={p.isActive ? 'Disable Product' : 'Enable Product'}
                          className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                            p.isActive
                              ? 'text-amber-600 hover:bg-amber-50 border-amber-200'
                              : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                          }`}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        <Link
                          to={`/admin/products/edit/${p.id}`}
                          title="Edit Product & Photos"
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(p)}
                          title="Delete Product"
                          className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
