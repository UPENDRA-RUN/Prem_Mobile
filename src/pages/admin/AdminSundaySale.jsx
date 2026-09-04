import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { parseResponseJson } from '../../utils/apiHelper';
import { formatCurrency } from '../../utils/formatters';
import { uploadToCloudinary } from '../../utils/cloudinary';
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  Save,
  Clock,
  Calendar,
  Sparkles,
  RefreshCw,
  Power,
  Search,
  X,
  Upload,
  Plus,
  Trash2,
  Loader2,
  Layers
} from 'lucide-react';

export default function AdminSundaySale() {
  const { adminToken } = useAdminAuth();
  const customProdFileRef = useRef(null);

  const [saleState, setSaleState] = useState({
    dayInfo: { dayName: 'Sunday', isSunday: false },
    isLive: false,
    statusText: 'OFFLINE',
    candidateProducts: []
  });

  const [productsConfig, setProductsConfig] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);
  const [isEndSaleModalOpen, setIsEndSaleModalOpen] = useState(false);

  // Custom Products
  const [customProducts, setCustomProducts] = useState([]);
  const [newCustomProd, setNewCustomProd] = useState({
    customTitle: '',
    customCategory: 'Special Deals',
    customBrand: 'Prem Mobile',
    customImage: '',
    regularPrice: '',
    salePrice: ''
  });
  const [isUploadingProdImg, setIsUploadingProdImg] = useState(false);

  // Combos
  const [candidateCombos, setCandidateCombos] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState({});

  const uploadImageFile = async (file) => {
    if (!file) return null;
    if (file.size > 15 * 1024 * 1024) {
      throw new Error('Image size must be under 15MB.');
    }
    try {
      const cloudRes = await uploadToCloudinary(file);
      if (cloudRes && cloudRes.success && cloudRes.url) {
        return cloudRes.url;
      }
    } catch (e) { /* fallback */ }
    const reader = new FileReader();
    const dataUrl = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ images: [{ dataUrl, filename: file.name }] })
      });
      const text = await res.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch (e) { data = {}; }
      if (res.ok && data.success) {
        return data.url || (data.urls && data.urls[0]) || dataUrl;
      }
    } catch (e) { /* ignore */ }
    return dataUrl;
  };

  const fetchSundaySaleData = async () => {
    setIsLoading(true);
    try {
      const [saleRes, combosRes] = await Promise.all([
        fetch('/api/sunday-sale/admin', { headers: { Authorization: `Bearer ${adminToken}` } }),
        fetch('/api/combos/admin', { headers: { Authorization: `Bearer ${adminToken}` } })
      ]);

      const data = await parseResponseJson(saleRes);
      const combosData = await parseResponseJson(combosRes);

      if (combosData.success) {
        setCandidateCombos(combosData.combos || []);
      }

      if (data.success) {
        setSaleState({
          dayInfo: data.dayInfo || {},
          isLive: data.isLive,
          statusText: data.statusText,
          candidateProducts: data.candidateProducts || []
        });

        const initialConfig = {};
        for (const p of data.candidateProducts || []) {
          initialConfig[p.id] = {
            included: Boolean(p.included),
            salePrice: p.salePrice !== undefined ? p.salePrice : Math.round(p.regularPrice * 0.7)
          };
        }
        setProductsConfig(initialConfig);

        // Load any previously configured custom items from saleItems
        if (data.customSaleItems) {
          setCustomProducts(data.customSaleItems);
        }
        if (data.configuredComboItems) {
          const comboMap = {};
          for (const cb of data.configuredComboItems) {
            comboMap[cb.comboId] = cb.salePrice;
          }
          setSelectedCombos(comboMap);
        }
      }
    } catch (err) {
      console.error('Failed to load Sunday sale configuration:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSundaySaleData();
  }, [adminToken]);

  const handleToggleInclude = (productId) => {
    setProductsConfig(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        included: !prev[productId]?.included
      }
    }));
  };

  const handlePriceChange = (productId, newSalePrice) => {
    setProductsConfig(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        salePrice: Math.max(0, parseFloat(newSalePrice) || 0)
      }
    }));
  };

  // Custom product handlers
  const handleCustomProdDeviceUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingProdImg(true);
    setFeedback(null);
    try {
      const url = await uploadImageFile(file);
      if (url) {
        setNewCustomProd(prev => ({ ...prev, customImage: url }));
        setFeedback({ type: 'success', text: 'Image uploaded successfully!' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setIsUploadingProdImg(false);
    }
  };

  const handleAddCustomProduct = (e) => {
    e.preventDefault();
    if (!newCustomProd.customTitle || !newCustomProd.salePrice) {
      setFeedback({ type: 'error', text: 'Title and Sale Price are required for custom products.' });
      return;
    }
    setCustomProducts(prev => [...prev, { ...newCustomProd }]);
    setNewCustomProd({
      customTitle: '', customCategory: 'Special Deals', customBrand: 'Prem Mobile',
      customImage: '', regularPrice: '', salePrice: ''
    });
    setFeedback({ type: 'success', text: 'Custom product added to Sunday Sale.' });
  };

  const handleRemoveCustomProduct = (index) => {
    setCustomProducts(prev => prev.filter((_, i) => i !== index));
  };

  // Combo handlers
  const handleToggleCombo = (combo) => {
    setSelectedCombos(prev => {
      const updated = { ...prev };
      if (updated[combo.id] !== undefined) {
        delete updated[combo.id];
      } else {
        updated[combo.id] = combo.comboPrice;
      }
      return updated;
    });
  };

  // SAVE SUNDAY SALE
  const handleSaveSale = async () => {
    setIsSaving(true);
    setFeedback(null);

    const catalogItems = [];
    for (const [productId, config] of Object.entries(productsConfig)) {
      if (config.included) {
        catalogItems.push({ productId: Number(productId), salePrice: Number(config.salePrice) });
      }
    }

    const customItems = customProducts.map(cp => ({
      isCustom: true,
      customTitle: cp.customTitle,
      customCategory: cp.customCategory,
      customBrand: cp.customBrand,
      customImage: cp.customImage,
      regularPrice: Number(cp.regularPrice) || Number(cp.salePrice),
      salePrice: Number(cp.salePrice)
    }));

    const comboItems = Object.entries(selectedCombos).map(([cId, price]) => ({
      comboId: Number(cId),
      salePrice: Number(price)
    }));

    const allItems = [...catalogItems, ...customItems, ...comboItems];

    if (allItems.length === 0) {
      setFeedback({ type: 'error', text: 'Please select at least one product for the Sunday Sale.' });
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/sunday-sale/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ items: allItems })
      });

      const data = await parseResponseJson(res);
      if (data.success) {
        setFeedback({ type: 'success', text: 'Sunday Sale saved successfully. Remember to click GO LIVE when ready!' });
        fetchSundaySaleData();
      } else {
        throw new Error(data.error || 'Failed to save Sunday sale.');
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // GO LIVE
  const handleConfirmGoLive = async () => {
    setIsGoLiveModalOpen(false);
    setFeedback(null);
    try {
      const res = await fetch('/api/sunday-sale/admin/go-live', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setFeedback({ type: 'success', text: '🔥 Sunday Shopping Sale is now LIVE!' });
        fetchSundaySaleData();
      } else {
        throw new Error(data.error || 'Could not start sale.');
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  // END SALE
  const handleConfirmEndSale = async () => {
    setIsEndSaleModalOpen(false);
    setFeedback(null);
    try {
      const res = await fetch('/api/sunday-sale/admin/end', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setFeedback({ type: 'success', text: 'Sunday Sale has been ended.' });
        fetchSundaySaleData();
      } else {
        throw new Error(data.error || 'Could not end sale.');
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const isSunday = Boolean(saleState.dayInfo?.isSunday);
  const selectedCatalogCount = Object.values(productsConfig).filter(c => c.included).length;
  const selectedCount = selectedCatalogCount + customProducts.length + Object.keys(selectedCombos).length;

  // Filtered catalog products
  const filteredProducts = saleState.candidateProducts.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#e51b23]">
            Event Pricing Control
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <span>🔥 SUNDAY SHOPPING SALE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure products, set Sunday discount prices, and control the live sale event.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSundaySaleData}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/sunday-sale"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-wider shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Preview Customer Page</span>
          </Link>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-fade-in ${
          feedback.type === 'error'
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STATUS BAR */}
      <div className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-xs transition-all ${
        saleState.isLive
          ? 'border-2 border-emerald-500 ring-4 ring-emerald-50'
          : 'border border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Today's Calendar & Activation Status
            </span>
            <div className="text-lg font-black text-slate-800 mt-0.5">
              Today: <span className="text-slate-900">{saleState.dayInfo?.dayName || 'Day'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Sale Status:</span>
            {saleState.isLive ? (
              <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider flex items-center gap-2 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>🟢 SALE LIVE</span>
              </div>
            ) : (
              <div className="px-4 py-2 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e51b23]" />
                <span>🔴 SALE OFFLINE</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-700">
              Selected Items: <span className="font-black text-[#e51b23]">{selectedCount}</span> total
            </div>
            {!isSunday && (
              <p className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Sunday Sale can only be activated on Sunday. (You can still prepare & save prices today).</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveSale}
              disabled={isSaving}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#ffd000]" />
              <span>{isSaving ? 'Saving...' : 'SAVE SALE'}</span>
            </button>

            {!saleState.isLive ? (
              <button
                onClick={() => setIsGoLiveModalOpen(true)}
                disabled={!isSunday || selectedCount === 0}
                className="px-6 py-3 rounded-xl bg-[#e51b23] hover:bg-[#c91219] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all hover:scale-102"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>🔴 GO LIVE</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEndSaleModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-2"
              >
                <Power className="w-4 h-4 text-red-400" />
                <span>END SALE</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT SELECTION — 3 TABS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900">
              Sale Products ({selectedCount} Selected)
            </h3>
            <p className="text-xs text-slate-500">
              Select catalog products, create custom items, or add combo packs.
            </p>
          </div>

          {/* TAB SELECTOR */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'catalog' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Catalog ({selectedCatalogCount})
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'custom' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom ({customProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('combos')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'combos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Combos ({Object.keys(selectedCombos).length})
            </button>
          </div>
        </div>

        {/* TAB 1: CATALOG PRODUCTS */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or category..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-[#050505]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 font-bold text-xs">✕</button>
              )}
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
                    <th className="p-3 w-44">Sale Price (₹)</th>
                    <th className="p-3">Discount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredProducts.map(product => {
                    const conf = productsConfig[product.id] || { included: false, salePrice: Math.round(product.regularPrice * 0.7) };
                    const regPrice = product.regularPrice;
                    const salePrice = conf.salePrice;
                    const savings = Math.max(0, regPrice - salePrice);
                    const discount = regPrice > 0 ? Math.round((savings / regPrice) * 100) : 0;

                    return (
                      <tr key={product.id} className={`transition-colors ${conf.included ? 'bg-amber-50/40' : 'hover:bg-slate-50'}`}>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={conf.included}
                            onChange={() => handleToggleInclude(product.id)}
                            className="w-4 h-4 rounded text-[#ffd000] focus:ring-[#ffd000] bg-white border-slate-300 cursor-pointer accent-[#ffd000]"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={product.image || '/images/prem-main.jpg'} alt={product.name} className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0" />
                            <span className="font-bold text-slate-900 text-sm">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-600">{product.category}</td>
                        <td className="p-3 font-bold text-slate-800">{formatCurrency(regPrice)}</td>
                        <td className="p-3">
                          {conf.included ? (
                            <div className="flex items-center gap-1.5 max-w-[140px]">
                              <span className="text-slate-400 font-bold">₹</span>
                              <input
                                type="number"
                                min="1"
                                value={conf.salePrice}
                                onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white border-2 border-amber-400 text-slate-900 font-black text-sm focus:outline-none focus:border-[#e51b23]"
                              />
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Not included</span>
                          )}
                        </td>
                        <td className="p-3">
                          {conf.included && discount > 0 ? (
                            <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[11px]">
                              {discount}% OFF (Save ₹{savings})
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
          </div>
        )}

        {/* TAB 2: CUSTOM PRODUCTS */}
        {activeTab === 'custom' && (
          <div className="space-y-6">
            <form onSubmit={handleAddCustomProduct} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffd000]" />
                <span>Create Custom Product for Sunday Sale</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Product Title *</label>
                  <input
                    type="text" required placeholder="e.g. Wireless Charger Pad Special"
                    value={newCustomProd.customTitle}
                    onChange={(e) => setNewCustomProd({ ...newCustomProd, customTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Category</label>
                  <input
                    type="text" placeholder="e.g. Special Deals"
                    value={newCustomProd.customCategory}
                    onChange={(e) => setNewCustomProd({ ...newCustomProd, customCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Brand</label>
                  <input
                    type="text" placeholder="e.g. Prem Mobile"
                    value={newCustomProd.customBrand}
                    onChange={(e) => setNewCustomProd({ ...newCustomProd, customBrand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                {/* IMAGE UPLOAD */}
                <div className="sm:col-span-2 lg:col-span-3 p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                    <span>Product Image (Upload or enter URL)</span>
                    {isUploadingProdImg && <span className="text-amber-600 font-bold text-[10px] animate-pulse">Uploading...</span>}
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input type="file" ref={customProdFileRef} onChange={handleCustomProdDeviceUpload} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => customProdFileRef.current?.click()} disabled={isUploadingProdImg}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0 disabled:opacity-50">
                      {isUploadingProdImg ? <Loader2 className="w-4 h-4 animate-spin text-[#ffd000]" /> : <Upload className="w-4 h-4 text-[#ffd000]" />}
                      <span>Upload Image from Device</span>
                    </button>
                    <input type="text" placeholder="Or paste Image URL" value={newCustomProd.customImage}
                      onChange={(e) => setNewCustomProd({ ...newCustomProd, customImage: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none" />
                    {newCustomProd.customImage && (
                      <button type="button" onClick={() => setNewCustomProd({ ...newCustomProd, customImage: '' })}
                        className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0">Clear</button>
                    )}
                  </div>
                  {newCustomProd.customImage && (
                    <div className="flex items-center gap-3 pt-1">
                      <img src={newCustomProd.customImage} alt="Preview" className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1" />
                      <span className="text-[11px] text-slate-500 font-mono truncate max-w-md">{newCustomProd.customImage}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Original Price (₹)</label>
                  <input type="number" placeholder="e.g. 1999" value={newCustomProd.regularPrice}
                    onChange={(e) => setNewCustomProd({ ...newCustomProd, regularPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Sale Price (₹) *</label>
                  <input type="number" required placeholder="e.g. 999" value={newCustomProd.salePrice}
                    onChange={(e) => setNewCustomProd({ ...newCustomProd, salePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none" />
                </div>
              </div>

              <button type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#050505] text-[#ffd000] font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-sm">
                + Add Custom Product
              </button>
            </form>

            {/* List of Custom Items */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                Custom Products in Sunday Sale ({customProducts.length})
              </h5>
              {customProducts.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No custom products added yet. Use the form above to add standalone items for this sale.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {customProducts.map((cp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={cp.customImage || '/images/placeholder.jpg'} alt={cp.customTitle}
                          className="w-10 h-10 rounded-lg object-contain bg-slate-50 border p-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{cp.customTitle}</span>
                          <span className="text-[10px] text-slate-400">{cp.customCategory || 'Custom'} • ₹{cp.salePrice}</span>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveCustomProduct(idx)} className="text-red-500 hover:text-red-700 p-1 font-bold text-xs">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: COMBO PACKS */}
        {activeTab === 'combos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                Available Combo Packs ({candidateCombos.length})
              </h5>
              <Link to="/admin/combos" className="text-xs font-bold text-[#e51b23] hover:underline flex items-center gap-1">
                <span>Manage Combo Packs →</span>
              </Link>
            </div>

            {candidateCombos.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs space-y-3">
                <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No combo packs available. Create combos in the Combo Packs section first.</p>
                <Link to="/admin/combos" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ffd000] text-[#050505] font-black text-xs uppercase">
                  <Plus className="w-3.5 h-3.5" /> Create Combo Pack
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                      <th className="p-3 w-12 text-center">Include</th>
                      <th className="p-3">Combo Name</th>
                      <th className="p-3">Products</th>
                      <th className="p-3">Regular Value</th>
                      <th className="p-3">Combo Price (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {candidateCombos.map(combo => {
                      const isSelected = selectedCombos[combo.id] !== undefined;
                      const currentPrice = isSelected ? selectedCombos[combo.id] : combo.comboPrice;
                      return (
                        <tr key={combo.id} className={isSelected ? 'bg-amber-50/40' : 'hover:bg-slate-50'}>
                          <td className="p-3 text-center">
                            <input type="checkbox" checked={isSelected} onChange={() => handleToggleCombo(combo)}
                              className="w-4 h-4 rounded text-[#ffd000] bg-white border-slate-300 cursor-pointer accent-[#ffd000]" />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={combo.image || '/images/placeholder.jpg'} alt={combo.name}
                                className="w-10 h-10 rounded-lg object-contain bg-white border p-0.5 shrink-0" />
                              <span className="font-bold text-slate-900 text-sm">{combo.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-500 max-w-xs truncate">{combo.itemNames || 'Multiple products'}</td>
                          <td className="p-3 font-bold text-slate-800">{formatCurrency(combo.regularPrice)}</td>
                          <td className="p-3">
                            {isSelected ? (
                              <div className="flex items-center gap-1.5 max-w-[140px]">
                                <span className="text-slate-400 font-bold">₹</span>
                                <input type="number" value={currentPrice}
                                  onChange={(e) => setSelectedCombos(prev => ({ ...prev, [combo.id]: Number(e.target.value) || 0 }))}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border-2 border-amber-400 text-slate-900 font-black text-sm focus:outline-none" />
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Not included</span>
                            )}
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

        {/* Bottom Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            {selectedCount} item{selectedCount !== 1 ? 's' : ''} total selected for Sunday Sale.
          </span>
          <div className="flex items-center gap-3">
            <button onClick={handleSaveSale} disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-200 transition-colors">
              <Save className="w-4 h-4 text-[#ffd000]" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* GO LIVE MODAL */}
      {isGoLiveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 text-[#e51b23] flex items-center justify-center mx-auto animate-pulse">
              <Flame className="w-8 h-8 fill-[#e51b23]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-slate-900">Start Sunday Shopping Sale?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will immediately broadcast special Sunday sale pricing to all website visitors.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setIsGoLiveModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider">CANCEL</button>
              <button onClick={handleConfirmGoLive}
                className="flex-1 py-3 rounded-xl bg-[#e51b23] hover:bg-[#c91219] text-white font-black text-xs uppercase tracking-wider shadow-md">GO LIVE</button>
            </div>
          </div>
        </div>
      )}

      {/* END SALE MODAL */}
      {isEndSaleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <Power className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-slate-900">End Sunday Sale?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The sale will immediately become offline. Products will return to their regular store prices.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setIsEndSaleModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider">CANCEL</button>
              <button onClick={handleConfirmEndSale}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider shadow-md">END SALE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
