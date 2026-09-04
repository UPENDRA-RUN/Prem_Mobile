import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { formatCurrency } from '../../utils/formatters';
import { uploadToCloudinary } from '../../utils/cloudinary';
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
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Loader2,
  Layers
} from 'lucide-react';

export default function AdminSale() {
  const { adminToken } = useAdminAuth();
  const customProdFileRef = useRef(null);
  const customComboFileRef = useRef(null);

  const [sale, setSale] = useState(null);
  const [candidateProducts, setCandidateProducts] = useState([]);
  const [status, setStatus] = useState('OFFLINE'); // 'DRAFT', 'READY', 'LIVE', 'ENDED', 'OFFLINE'
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form Fields
  const [name, setName] = useState('Sunday Shocking Sale');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedItems, setSelectedItems] = useState({}); // { [productId]: salePrice }
  const [customSaleProducts, setCustomSaleProducts] = useState([]); // [{ customTitle, customCategory, customBrand, customImage, regularPrice, salePrice }]
  const [candidateCombos, setCandidateCombos] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState({}); // { [comboId]: salePrice }
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'custom' | 'combos'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Image Upload Loading States
  const [isUploadingProdImg, setIsUploadingProdImg] = useState(false);
  const [isUploadingComboImg, setIsUploadingComboImg] = useState(false);

  // New Custom Product Form state
  const [newCustomProd, setNewCustomProd] = useState({
    customTitle: '',
    customCategory: 'Special Deals',
    customBrand: 'Prem Mobile',
    customImage: '',
    regularPrice: '',
    salePrice: ''
  });

  // New Custom Combo Pack Form state
  const [newSaleCombo, setNewSaleCombo] = useState({
    name: '',
    description: 'Special Sale Bundle',
    image: '',
    regularPrice: '',
    comboPrice: '',
    items: [
      { productId: '', customItemName: '', quantity: 1 },
      { productId: '', customItemName: '25W Fast Adapter', quantity: 1 }
    ]
  });

  // Modals
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [conflictModal, setConflictModal] = useState(null); // { message, liveSaleId }

  // Upload file helper
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
    } catch (e) {
      // fallback to backend upload
    }

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
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to upload image.');
    }
    return data.url || (data.urls && data.urls[0]);
  };

  const fetchAdminSale = async () => {
    if (!adminToken) return;
    setIsLoading(true);
    try {
      const [res, combosRes] = await Promise.all([
        fetch('/api/sale/admin', { headers: { Authorization: `Bearer ${adminToken}` } }),
        fetch('/api/combos/admin', { headers: { Authorization: `Bearer ${adminToken}` } })
      ]);

      const data = await res.json();
      const combosData = await combosRes.json();

      if (combosData.success) {
        setCandidateCombos(combosData.combos || []);
      }

      if (data.success) {
        setSale(data.sale);
        setStatus(data.status || 'OFFLINE');
        setCandidateProducts(data.candidateProducts || []);
        setCustomSaleProducts(data.configuredCustomItems || []);

        if (data.sale) {
          setName(data.sale.name || 'Sunday Shocking Sale');
          setStartDate(data.sale.startDate || new Date().toISOString().split('T')[0]);
          setEndDate(data.sale.endDate || new Date().toISOString().split('T')[0]);
          setStartTime(data.sale.startTime || '');
          setEndTime(data.sale.endTime || '');
        }

        // Initialize selected gallery items map
        const initialMap = {};
        for (const p of data.candidateProducts || []) {
          if (p.isSelected && p.salePrice) {
            initialMap[p.id] = p.salePrice;
          }
        }
        setSelectedItems(initialMap);

        // Initialize selected combos map
        const comboMap = {};
        for (const cb of data.configuredComboItems || []) {
          comboMap[cb.comboId] = cb.salePrice;
        }
        setSelectedCombos(comboMap);
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

  const handleCustomProdDeviceUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProdImg(true);
    setNotification(null);
    try {
      const url = await uploadImageFile(file);
      if (url) {
        setNewCustomProd(prev => ({ ...prev, customImage: url }));
        setNotification({ type: 'success', message: 'Image uploaded successfully!' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setIsUploadingProdImg(false);
    }
  };

  const handleCustomComboDeviceUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingComboImg(true);
    setNotification(null);
    try {
      const url = await uploadImageFile(file);
      if (url) {
        setNewSaleCombo(prev => ({ ...prev, image: url }));
        setNotification({ type: 'success', message: 'Combo image uploaded successfully!' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setIsUploadingComboImg(false);
    }
  };

  const handleAddComboItemRow = () => {
    setNewSaleCombo(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', customItemName: '', quantity: 1 }]
    }));
  };

  const handleRemoveComboItemRow = (index) => {
    setNewSaleCombo(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleComboItemChange = (index, field, value) => {
    setNewSaleCombo(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      
      let sumRegPrice = 0;
      for (const item of updated) {
        if (item.productId) {
          const prod = candidateProducts.find(p => String(p.id) === String(item.productId));
          if (prod) {
            sumRegPrice += Number(prod.regularPrice || 0) * Number(item.quantity || 1);
          }
        }
      }

      return {
        ...prev,
        items: updated,
        regularPrice: sumRegPrice > 0 ? sumRegPrice : prev.regularPrice
      };
    });
  };

  const handleCreateSaleCombo = async (e) => {
    e.preventDefault();
    if (!newSaleCombo.name || !newSaleCombo.comboPrice) {
      setNotification({ type: 'error', message: 'Combo title and sale price are required.' });
      return;
    }

    setIsSaving(true);
    setNotification(null);
    try {
      const regPrice = Number(newSaleCombo.regularPrice) || Number(newSaleCombo.comboPrice);
      const res = await fetch('/api/combos/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: newSaleCombo.name,
          description: newSaleCombo.description || 'Special Sale Combo Bundle',
          image: newSaleCombo.image || '/images/placeholder.jpg',
          regularPrice: regPrice,
          comboPrice: Number(newSaleCombo.comboPrice),
          badgeText: 'SALE COMBO',
          isActive: true,
          isFeatured: true,
          items: newSaleCombo.items
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create sale combo.');
      }

      // Mark newly created combo as selected for this sale event
      setSelectedCombos(prev => ({
        ...prev,
        [data.comboId]: Number(newSaleCombo.comboPrice)
      }));

      // Refresh candidateCombos list
      const combosRes = await fetch('/api/combos/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const combosData = await combosRes.json();
      if (combosData.success) {
        setCandidateCombos(combosData.combos || []);
      }

      setNewSaleCombo({
        name: '',
        description: 'Special Sale Bundle',
        image: '',
        regularPrice: '',
        comboPrice: '',
        items: [
          { productId: '', customItemName: '', quantity: 1 },
          { productId: '', customItemName: '25W Fast Adapter', quantity: 1 }
        ]
      });

      setNotification({
        type: 'success',
        message: '🔥 Custom sale combo pack created and added to current sale!'
      });
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCustomSaleProduct = (e) => {
    e.preventDefault();
    if (!newCustomProd.customTitle || !newCustomProd.salePrice) {
      setNotification({ type: 'error', message: 'Title and Sale Price are required for direct custom items.' });
      return;
    }
    setCustomSaleProducts(prev => [...prev, { ...newCustomProd }]);
    setNewCustomProd({
      customTitle: '',
      customCategory: 'Special Deals',
      customBrand: 'Prem Mobile',
      customImage: '',
      regularPrice: '',
      salePrice: ''
    });
    setNotification({ type: 'success', message: 'Added direct custom product for this sale.' });
  };

  const handleRemoveCustomSaleProduct = (index) => {
    setCustomSaleProducts(prev => prev.filter((_, i) => i !== index));
  };

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

  // 1. SAVE SALE (Sets status to READY, does NOT activate)
  const handleSaveSale = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    const catalogItemsPayload = Object.entries(selectedItems).map(([pId, price]) => ({
      productId: Number(pId),
      salePrice: Number(price)
    }));

    const customItemsPayload = customSaleProducts.map(cp => ({
      isCustom: true,
      customTitle: cp.customTitle,
      customCategory: cp.customCategory,
      customBrand: cp.customBrand,
      customImage: cp.customImage,
      regularPrice: Number(cp.regularPrice) || Number(cp.salePrice),
      salePrice: Number(cp.salePrice)
    }));

    const comboItemsPayload = Object.entries(selectedCombos).map(([cId, price]) => ({
      comboId: Number(cId),
      salePrice: Number(price)
    }));

    const itemsPayload = [...catalogItemsPayload, ...customItemsPayload, ...comboItemsPayload];

    try {
      const res = await fetch('/api/sale/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          saleId: sale?.id,
          name: name.trim() || 'Sunday Shocking Sale',
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
      const catalogItemsPayload = Object.entries(selectedItems).map(([pId, price]) => ({
        productId: Number(pId),
        salePrice: Number(price)
      }));

      const customItemsPayload = customSaleProducts.map(cp => ({
        isCustom: true,
        customTitle: cp.customTitle,
        customCategory: cp.customCategory,
        customBrand: cp.customBrand,
        customImage: cp.customImage,
        regularPrice: Number(cp.regularPrice) || Number(cp.salePrice),
        salePrice: Number(cp.salePrice)
      }));

      const comboItemsPayload = Object.entries(selectedCombos).map(([cId, price]) => ({
        comboId: Number(cId),
        salePrice: Number(price)
      }));

      const itemsPayload = [...catalogItemsPayload, ...customItemsPayload, ...comboItemsPayload];

      const saveRes = await fetch('/api/sale/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          saleId: sale?.id,
          name: name.trim() || 'Sunday Shocking Sale',
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

  const selectedCount = Object.keys(selectedItems).length + customSaleProducts.length + Object.keys(selectedCombos).length;

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {status === 'LIVE' ? (
              <button
                onClick={() => setShowEndModal(true)}
                disabled={actionLoading}
                className="px-6 py-3.5 rounded-xl bg-[#e51b23] hover:bg-[#c91219] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>🔴 END SALE NOW</span>
              </button>
            ) : (
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setShowGoLiveModal(true)}
                  disabled={selectedCount === 0 || actionLoading}
                  className="px-6 py-3.5 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-[#050505] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                  title={selectedCount === 0 ? 'Select at least 1 product below to Go Live' : 'Make Sale Live to Customers'}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>🔴 GO LIVE NOW</span>
                </button>
                {selectedCount === 0 && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>Select at least 1 product below to enable</span>
                  </span>
                )}
              </div>
            )}

            <button
              onClick={handleSaveSale}
              disabled={isSaving}
              className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
            >
              <Save className="w-4 h-4 text-[#ffd000]" />
              <span>{isSaving ? 'SAVING...' : 'SAVE SALE'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. SALE SCHEDULING */}
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
              placeholder="e.g. Sunday Shocking Sale / Big Mobile Sale"
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

      {/* 3. PRODUCT SELECTION (3 TABS: GALLERY IMPORT, DIRECT CUSTOM, COMBOS) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900">
              Sale Products & Bundles ({selectedCount} Total Selected)
            </h3>
            <p className="text-xs text-slate-500">
              Import existing catalog products, create standalone custom sale items, or add combo packs.
            </p>
          </div>

          {/* 3 TABS SELECTOR */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Catalog Import ({Object.keys(selectedItems).length})
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'custom'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Direct Custom ({customSaleProducts.length})
            </button>

            <button
              onClick={() => setActiveTab('combos')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'combos'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Combo Packs ({Object.keys(selectedCombos).length})
            </button>
          </div>
        </div>

        {/* TAB 1: CATALOG GALLERY IMPORT */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            {/* Quick Presets & Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by title or brand..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-[#050505]"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
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
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleProduct(p)}
                            className="w-4 h-4 rounded text-[#ffd000] focus:ring-[#ffd000] bg-white border-slate-300 cursor-pointer accent-[#ffd000]"
                          />
                        </td>
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
                        <td className="p-3 text-slate-600">{p.category}</td>
                        <td className="p-3 font-bold text-slate-800">{formatCurrency(p.regularPrice)}</td>
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
          </div>
        )}

        {/* TAB 2: DIRECT CUSTOM SALE PRODUCTS */}
        {activeTab === 'custom' && (
          <div className="space-y-6">
            <form onSubmit={handleAddCustomSaleProduct} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffd000]" />
                <span>Create Direct Custom Product for this Sale</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wireless Charger Pad Special"
                    value={newCustomProd.customTitle}
                    onChange={(e) => setNewCustomProd({ ...newCustomProd, customTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Special Deals"
                    value={newCustomProd.customCategory}
                    onChange={(e) => setNewCustomProd({ ...newCustomProd, customCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Prem Mobile"
                    value={newCustomProd.customBrand}
                    onChange={(e) => setNewCustomProd({ ...newCustomProd, customBrand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                {/* DEVICE FILE UPLOAD & IMAGE URL INPUT */}
                <div className="sm:col-span-2 lg:col-span-3 p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                    <span>Product Image (Upload from Computer or enter URL)</span>
                    {isUploadingProdImg && <span className="text-amber-600 font-bold text-[10px] animate-pulse">Uploading Image...</span>}
                  </label>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* File Upload Button */}
                    <input
                      type="file"
                      ref={customProdFileRef}
                      onChange={handleCustomProdDeviceUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => customProdFileRef.current?.click()}
                      disabled={isUploadingProdImg}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0 disabled:opacity-50"
                    >
                      {isUploadingProdImg ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#ffd000]" />
                      ) : (
                        <Upload className="w-4 h-4 text-[#ffd000]" />
                      )}
                      <span>Upload Image from Device</span>
                    </button>

                    {/* Manual URL Input */}
                    <input
                      type="text"
                      placeholder="Or paste Image URL (e.g. /images/charger.jpg)"
                      value={newCustomProd.customImage}
                      onChange={(e) => setNewCustomProd({ ...newCustomProd, customImage: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />

                    {newCustomProd.customImage && (
                      <button
                        type="button"
                        onClick={() => setNewCustomProd({ ...newCustomProd, customImage: '' })}
                        className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                      >
                        Clear Image
                      </button>
                    )}
                  </div>

                  {/* Thumbnail Preview */}
                  {newCustomProd.customImage && (
                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src={newCustomProd.customImage}
                        alt="Custom product preview"
                        className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1"
                      />
                      <span className="text-[11px] text-slate-500 font-mono truncate max-w-md">
                        {newCustomProd.customImage}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1999"
                    value={newCustomProd.regularPrice}
                    onChange={(e) => setNewCustomProd({ ...newCustomProd, regularPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Sale Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 999"
                    value={newCustomProd.salePrice}
                    onChange={(e) => setNewCustomProd({ ...newCustomProd, salePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#050505] text-[#ffd000] font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-sm"
              >
                + Add Custom Sale Item
              </button>
            </form>

            {/* List of Custom Items */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                Custom Items in this Sale ({customSaleProducts.length})
              </h5>

              {customSaleProducts.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No direct custom products added yet. Use the form above to add standalone items specifically for this sale.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {customSaleProducts.map((cp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={cp.customImage || '/images/placeholder.jpg'}
                          alt={cp.customTitle}
                          className="w-10 h-10 rounded-lg object-contain bg-slate-50 border p-0.5"
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{cp.customTitle}</span>
                          <span className="text-[10px] text-slate-400">{cp.customCategory || 'Custom'} • ₹{cp.salePrice}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveCustomSaleProduct(idx)}
                        className="text-red-500 hover:text-red-700 p-1 font-bold text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: COMBO PACKAGES & INLINE SALE COMBO CREATOR */}
        {activeTab === 'combos' && (
          <div className="space-y-6">
            
            {/* CREATE CUSTOM SALE COMBO FORM */}
            <form onSubmit={handleCreateSaleCombo} className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-[#ffd000] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ffd000]" />
                  <span>Create Custom Sale Combo Pack (For Sale Only)</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 px-2.5 py-1 rounded-full">
                  Direct Combo Builder
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-900">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase">Combo Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Phone + Fast Charger + Case Bundle"
                    value={newSaleCombo.name}
                    onChange={(e) => setNewSaleCombo({ ...newSaleCombo, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase">Original Combined Value (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 24999"
                    value={newSaleCombo.regularPrice}
                    onChange={(e) => setNewSaleCombo({ ...newSaleCombo, regularPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#ffd000] uppercase">Sale Combo Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 18999"
                    value={newSaleCombo.comboPrice}
                    onChange={(e) => setNewSaleCombo({ ...newSaleCombo, comboPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-amber-400 text-xs font-black text-slate-900 focus:outline-none"
                  />
                </div>

                {/* DEVICE FILE UPLOAD & IMAGE URL INPUT FOR COMBO */}
                <div className="sm:col-span-2 lg:col-span-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-white">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase flex items-center justify-between">
                    <span>Combo Pack Image (Upload or Image URL)</span>
                    {isUploadingComboImg && <span className="text-[#ffd000] font-bold text-[10px] animate-pulse">Uploading Image...</span>}
                  </label>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="file"
                      ref={customComboFileRef}
                      onChange={handleCustomComboDeviceUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => customComboFileRef.current?.click()}
                      disabled={isUploadingComboImg}
                      className="px-4 py-2 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-colors shrink-0 disabled:opacity-50"
                    >
                      {isUploadingComboImg ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      ) : (
                        <Upload className="w-4 h-4 text-slate-950" />
                      )}
                      <span>Upload Combo Image</span>
                    </button>

                    <input
                      type="text"
                      placeholder="Or paste Combo Image URL"
                      value={newSaleCombo.image}
                      onChange={(e) => setNewSaleCombo({ ...newSaleCombo, image: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {newSaleCombo.image && (
                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src={newSaleCombo.image}
                        alt="Combo preview"
                        className="w-12 h-12 rounded-xl object-contain bg-slate-950 border border-slate-700 p-1"
                      />
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-md">
                        {newSaleCombo.image}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* BUNDLE ITEMS LIST BUILDER */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-slate-900">
                <div className="flex items-center justify-between text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Included Products in this Combo ({newSaleCombo.items.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddComboItemRow}
                    className="text-xs text-[#ffd000] hover:underline font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Product Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {newSaleCombo.items.map((it, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                      {/* Select Product from Gallery */}
                      <select
                        value={it.productId}
                        onChange={(e) => handleComboItemChange(idx, 'productId', e.target.value)}
                        className="flex-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none"
                      >
                        <option value="">-- Custom Custom Product Title --</option>
                        {candidateProducts.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({formatCurrency(p.regularPrice)})
                          </option>
                        ))}
                      </select>

                      {/* Custom Item Title Fallback */}
                      {!it.productId && (
                        <input
                          type="text"
                          placeholder="Custom item name (e.g. 25W Fast Adapter)"
                          value={it.customItemName}
                          onChange={(e) => handleComboItemChange(idx, 'customItemName', e.target.value)}
                          className="flex-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none"
                        />
                      )}

                      {/* Quantity */}
                      <div className="flex items-center gap-2 shrink-0 text-white">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={it.quantity}
                          onChange={(e) => handleComboItemChange(idx, 'quantity', e.target.value)}
                          className="w-16 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-center"
                        />
                      </div>

                      {/* Remove Row */}
                      {newSaleCombo.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveComboItemRow(idx)}
                          className="text-red-400 hover:text-red-300 p-1 font-bold shrink-0"
                          title="Remove product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>Create & Add Combo to Current Sale</span>
              </button>
            </form>

            {/* STORED COMBOS GALLERY SELECTION TABLE */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                  Available Combo Gallery Packs ({candidateCombos.length})
                </h5>
                <Link
                  to="/admin/combos"
                  className="text-xs font-bold text-[#e51b23] hover:underline flex items-center gap-1"
                >
                  <span>Manage Gallery Combos →</span>
                </Link>
              </div>

              {candidateCombos.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No stored combo packages yet. Use the form above to build custom combos directly for this sale!
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                        <th className="p-3 w-12 text-center">Include</th>
                        <th className="p-3">Combo Name</th>
                        <th className="p-3">Included Products</th>
                        <th className="p-3">Regular Value</th>
                        <th className="p-3">Combo Sale Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {candidateCombos.map(combo => {
                        const isSelected = selectedCombos[combo.id] !== undefined;
                        const currentSalePrice = isSelected ? selectedCombos[combo.id] : combo.comboPrice;

                        return (
                          <tr key={combo.id} className={isSelected ? 'bg-amber-50/40' : 'hover:bg-slate-50'}>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleCombo(combo)}
                                className="w-4 h-4 rounded text-[#ffd000] bg-white border-slate-300 cursor-pointer accent-[#ffd000]"
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={combo.image || '/images/placeholder.jpg'}
                                  alt={combo.title}
                                  className="w-10 h-10 rounded-lg object-contain bg-white border p-0.5 shrink-0"
                                />
                                <div>
                                  <span className="font-bold text-slate-900 block text-sm">{combo.title}</span>
                                  <span className="text-[10px] text-emerald-600 font-bold">Save {formatCurrency(combo.savings)}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-slate-500 max-w-xs truncate">
                              {combo.itemNames || 'Multiple products'}
                            </td>
                            <td className="p-3 font-bold text-slate-800">
                              {formatCurrency(combo.regularPrice)}
                            </td>
                            <td className="p-3">
                              {isSelected ? (
                                <div className="flex items-center gap-1.5 max-w-[140px]">
                                  <span className="text-slate-400 font-bold">₹</span>
                                  <input
                                    type="number"
                                    value={currentSalePrice}
                                    onChange={(e) => setSelectedCombos(prev => ({ ...prev, [combo.id]: Number(e.target.value) || 0 }))}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border-2 border-amber-400 text-slate-900 font-black text-sm focus:outline-none"
                                  />
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

          </div>
        )}

        {/* Bottom Save & Go Live Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            {selectedCount} item{selectedCount !== 1 ? 's' : ''} total selected for this sale event.
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
