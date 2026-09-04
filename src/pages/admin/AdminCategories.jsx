import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { parseResponseJson } from '../../utils/apiHelper';
import {
  Tag,
  PlusCircle,
  Trash2,
  Package,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  FolderPlus
} from 'lucide-react';

export default function AdminCategories() {
  const { adminToken } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/categories');
      const data = await parseResponseJson(res);
      if (data.success) {
        setCategories(data.categories || []);
      } else {
        throw new Error(data.error || 'Failed to load categories');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);
    setError(null);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: newCatName.trim(),
          icon: newCatIcon.trim() || '📦'
        })
      });

      const data = await parseResponseJson(res);
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add category');
      }

      setFeedback(`Category "${data.category.name}" added successfully!`);
      setNewCatName('');
      setNewCatIcon('📦');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to remove category "${cat.name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      const data = await parseResponseJson(res);
      if (data.success) {
        setFeedback(`Category "${cat.name}" removed.`);
        fetchCategories();
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#e51b23]">
            Store Catalog
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organize products by category. Changes take effect on the customer store in real time.
          </p>
        </div>

        <button
          onClick={fetchCategories}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm self-start"
          title="Refresh Categories"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* FEEDBACK & ERROR ALERTS */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
      )}

      {/* ADD NEW CATEGORY CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <FolderPlus className="w-5 h-5 text-[#ffd000]" />
          <span>Add New Category</span>
        </div>

        <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Icon / Emoji
            </label>
            <input
              type="text"
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              placeholder="e.g. 🎧"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#ffd000]"
            />
          </div>

          <div className="sm:col-span-7">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Bluetooth Speakers, Neckbands, Screen Guards"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#ffd000]"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Adding...' : 'Add Category'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* CATEGORIES GRID */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-display font-black text-lg text-slate-900">
          Existing Categories ({categories.length})
        </h3>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-xs font-bold">
            Loading categories...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#ffd000]/60 bg-slate-50/60 hover:bg-white transition-all flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-xs flex-shrink-0">
                    {cat.icon || '🏷️'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{cat.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {cat.productCount || 0} Products
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/category/${cat.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="View on Store"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
