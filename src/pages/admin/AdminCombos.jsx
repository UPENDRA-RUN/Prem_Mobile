import React, { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { formatCurrency } from '../../utils/formatters';
import { uploadToCloudinary } from '../../utils/cloudinary';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Package,
  Sparkles,
  ShoppingBag,
  Upload,
  Search,
  Loader2
} from 'lucide-react';

export default function AdminCombos() {
  const { adminToken } = useAdminAuth();
  const fileInputRef = useRef(null);

  const [combos, setCombos] = useState([]);
  const [candidateProducts, setCandidateProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [bundleSearchQuery, setBundleSearchQuery] = useState('');

  // Form & Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    regularPrice: '',
    comboPrice: '',
    badgeText: 'COMBO SAVINGS',
    isActive: true,
    isFeatured: true,
    items: [] // [{ productId: '', customItemName: '', quantity: 1 }]
  });

  const fetchData = async () => {
    if (!adminToken) return;
    setIsLoading(true);
    try {
      const [combosRes, prodRes] = await Promise.all([
        fetch('/api/combos/admin', { headers: { Authorization: `Bearer ${adminToken}` } }),
        fetch('/api/products/admin/all', { headers: { Authorization: `Bearer ${adminToken}` } })
      ]);

      const combosData = await combosRes.json();
      const prodData = await prodRes.json();

      if (combosData.success) {
        setCombos(combosData.combos || []);
      }
      if (prodData.success) {
        setCandidateProducts(prodData.products || []);
      }
    } catch (err) {
      console.error('Failed to load combos:', err);
      setNotification({ type: 'error', message: 'Failed to load combo packs.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setNotification({ type: 'error', message: 'Image size must be under 15MB.' });
      return;
    }

    setIsUploading(true);
    setNotification(null);

    try {
      // 1. Try Cloudinary first
      const cloudRes = await uploadToCloudinary(file);
      if (cloudRes && cloudRes.success && cloudRes.url) {
        setFormData(prev => ({ ...prev, image: cloudRes.url }));
        setNotification({ type: 'success', message: 'Combo banner image uploaded successfully!' });
        return;
      }

      // 2. Fallback to /api/upload
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ images: [{ dataUrl, filename: file.name }] })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const url = data.url || (data.urls && data.urls[0]);
        setFormData(prev => ({ ...prev, image: url }));
        setNotification({ type: 'success', message: 'Combo banner image uploaded successfully!' });
      } else {
        throw new Error(data.error || 'Failed to upload image.');
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [adminToken]);

  const handleOpenNewModal = () => {
    setEditingCombo(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      regularPrice: '',
      comboPrice: '',
      badgeText: 'SUPER COMBO DEAL',
      isActive: true,
      isFeatured: true,
      items: [
        { productId: candidateProducts[0]?.id || '', customItemName: '', quantity: 1 },
        { productId: '', customItemName: '25W Fast Charger', quantity: 1 }
      ]
    });
    setShowModal(true);
  };

  const handleEditCombo = (combo) => {
    setEditingCombo(combo);
    setFormData({
      id: combo.id,
      name: combo.name,
      description: combo.description || '',
      image: combo.image || '',
      regularPrice: combo.regularPrice || '',
      comboPrice: combo.comboPrice || '',
      badgeText: combo.badgeText || 'COMBO SAVINGS',
      isActive: Boolean(combo.isActive),
      isFeatured: Boolean(combo.isFeatured),
      items: combo.items.map(it => ({
        productId: it.productId || '',
        customItemName: it.customItemName || '',
        quantity: it.quantity || 1
      }))
    });
    setShowModal(true);
  };

  const handleAddItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', customItemName: '', quantity: 1 }]
    }));
  };

  const handleRemoveItemRow = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      
      // Auto calculate regular price if picking product from gallery
      if (field === 'productId' && value) {
        const prod = candidateProducts.find(p => String(p.id) === String(value));
        if (prod) {
          updated[index].customItemName = '';
        }
      }
      return { ...prev, items: updated };
    });
  };

  const handleSaveCombo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    try {
      const res = await fetch('/api/combos/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', message: data.message || 'Combo pack saved!' });
        setShowModal(false);
        fetchData();
      } else {
        throw new Error(data.error || 'Failed to save combo.');
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCombo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this combo pack?')) return;
    try {
      const res = await fetch(`/api/combos/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', message: 'Combo pack deleted.' });
        fetchData();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to delete combo pack.' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#e51b23]">
            Bundles & Package Deals
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#ffd000]" />
            <span>Product Combo Packs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create custom combo bundles (e.g., Phone + Earbuds + Fast Charger) for sales and the main storefront.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-5 py-3 rounded-xl bg-[#ffd000] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-transform hover:scale-102"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>CREATE NEW COMBO PACK</span>
        </button>
      </div>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xs ${
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* COMBOS GRID */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-[#ffd000] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading combo packages...</p>
        </div>
      ) : combos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-display font-black text-lg text-slate-900">No Combo Packs Created Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first combo package to offer bundled discounts on the website and active sales!
            </p>
          </div>
          <button
            onClick={handleOpenNewModal}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#ffd000]" />
            <span>Create Combo Pack</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map(combo => (
            <div
              key={combo.id}
              className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#e51b23] text-white font-black text-[10px] uppercase tracking-wider shadow-xs">
                    {combo.badgeText || 'COMBO SAVINGS'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditCombo(combo)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Edit Combo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCombo(combo.id)}
                      className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete Combo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center p-2">
                    <img src={combo.image || '/images/placeholder.jpg'} alt={combo.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-slate-900 line-clamp-2 leading-snug">
                      {combo.name}
                    </h3>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-xl font-black font-display text-[#e51b23]">
                        {formatCurrency(combo.comboPrice)}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-medium">
                        {formatCurrency(combo.regularPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BUNDLED ITEMS BREAKDOWN */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Bundled Products ({combo.items.length}):
                  </span>
                  <ul className="space-y-1 text-slate-700 font-medium">
                    {combo.items.map((it, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffd000]" />
                        <span className="line-clamp-1">{it.name} {it.quantity > 1 ? `(x${it.quantity})` : ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Status: {combo.isActive ? <strong className="text-emerald-600">Active</strong> : <strong className="text-slate-400">Hidden</strong>}</span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-black">
                  Save {formatCurrency(combo.regularPrice - combo.comboPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: CREATE / EDIT COMBO PACK */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 animate-scale-in my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-display font-black text-xl text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ffd000]" />
                <span>{editingCombo ? 'Edit Combo Package' : 'Create New Combo Pack'}</span>
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCombo} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Combo Package Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ultimate 5G Starter Bundle (Phone + TWS + 25W Charger)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Total Regular Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g., 2999"
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:bg-white focus:outline-none focus:border-[#050505]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Discounted Combo Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g., 1999"
                    value={formData.comboPrice}
                    onChange={(e) => setFormData({ ...formData, comboPrice: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#e51b23] text-sm font-black focus:bg-white focus:outline-none focus:border-[#050505]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Badge Text / Offer Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., SUPER BUNDLE DEALS"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:bg-white focus:outline-none focus:border-[#050505]"
                  />
                </div>
              </div>

              {/* DEVICE FILE UPLOAD & COMBO BANNER IMAGE PREVIEW */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Combo Banner Image (Upload from device or enter URL)
                  </label>
                  {isUploading && <span className="text-amber-600 font-bold text-[10px] animate-pulse">Uploading Image...</span>}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleDeviceUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#ffd000]" />
                    ) : (
                      <Upload className="w-4 h-4 text-[#ffd000]" />
                    )}
                    <span>Upload Image from Device</span>
                  </button>

                  <input
                    type="text"
                    placeholder="Or paste Image URL (e.g. /images/boAt-rockerz.jpg)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                {formData.image && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={formData.image}
                      alt="Combo banner preview"
                      className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1"
                    />
                    <span className="text-[11px] text-slate-500 font-mono truncate max-w-md">
                      {formData.image}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* BUNDLED ITEMS SELECTION & PRODUCT SEARCH FILTER */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Bundled Products In This Combo ({formData.items.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-[#e51b23] hover:underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Bundled Item</span>
                  </button>
                </div>

                {/* Search Filter Box for candidate products */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search all website products by name, brand, or category..."
                    value={bundleSearchQuery}
                    onChange={(e) => setBundleSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none"
                  />
                  {bundleSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setBundleSearchQuery('')}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {bundleSearchQuery.trim() && (
                  <span className="text-[11px] font-bold text-slate-500 block">
                    Filtering dropdown options by "<strong className="text-slate-700">{bundleSearchQuery}</strong>" ({candidateProducts.filter(p => p.name?.toLowerCase().includes(bundleSearchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(bundleSearchQuery.toLowerCase())).length} matches)
                  </span>
                )}

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-2 text-xs">
                      {/* Product Selector Filtered by Search */}
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none max-w-full truncate"
                      >
                        <option value="">-- Custom Item Name --</option>
                        {candidateProducts
                          .filter(p => {
                            if (String(p.id) === String(item.productId)) return true;
                            if (!bundleSearchQuery.trim()) return true;
                            const q = bundleSearchQuery.toLowerCase();
                            return p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
                          })
                          .map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({formatCurrency(p.regularPrice)})
                            </option>
                          ))}
                      </select>

                      {/* Custom Item Name if not from gallery */}
                      {!item.productId && (
                        <input
                          type="text"
                          placeholder="Type custom item name..."
                          value={item.customItemName}
                          onChange={(e) => handleItemChange(idx, 'customItemName', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none"
                        />
                      )}

                      {/* Quantity */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-14 px-2 py-2 text-center rounded-xl bg-white border border-slate-200 font-bold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#ffd000] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Combo Pack'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
