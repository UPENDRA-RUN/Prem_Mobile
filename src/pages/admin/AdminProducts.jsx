import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
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
  Star
} from 'lucide-react';

export default function AdminProducts() {
  const { adminToken } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [feedback, setFeedback] = useState(null);

  const fetchProducts = async () => {
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
  };

  useEffect(() => {
    fetchProducts();
  }, [adminToken]);

  const handleToggleFeatured = async (product) => {
    const updatedFeatured = product.isFeatured ? 0 : 1;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ isFeatured: updatedFeatured })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(`Product "${product.name}" ${updatedFeatured ? 'marked as featured ⭐' : 'unmarked from featured'}.`);
        fetchProducts();
      }
    } catch (e) {
      alert('Error updating featured status: ' + e.message);
    }
  };

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
        setFeedback(`Product "${product.name}" ${updatedActive ? 'activated' : 'deactivated'}.`);
        fetchProducts();
      }
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
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

  const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#e51b23]">
            Inventory Management
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Products ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#050505]"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#050505]"
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
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Regular Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-bold">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Product Name & Image */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={p.image || '/images/prem-main.jpg'}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                            {p.name}
                          </div>
                          <span className="text-[11px] text-slate-400 block sm:hidden">
                            {p.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                      {p.category}
                    </td>

                    {/* Regular Price */}
                    <td className="py-3.5 px-4 text-xs font-black text-slate-900">
                      {formatCurrency(p.regularPrice)}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                      {p.stock} in stock
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {p.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black uppercase">
                          Disabled
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          title={p.isFeatured ? 'Featured (Click to unfeature)' : 'Mark as Featured'}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            p.isFeatured
                              ? 'bg-amber-50 text-amber-500 border-amber-300 shadow-xs'
                              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-amber-400' : ''}`} />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(p)}
                          title={p.isActive ? 'Disable Product' : 'Enable Product'}
                          className={`p-1.5 rounded-lg border text-xs ${
                            p.isActive
                              ? 'text-amber-600 hover:bg-amber-50 border-amber-200'
                              : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          to={`/admin/products/edit/${p.id}`}
                          title="Edit Product"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(p)}
                          title="Delete Product"
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
