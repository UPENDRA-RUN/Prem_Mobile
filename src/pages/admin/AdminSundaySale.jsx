import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { parseResponseJson } from '../../utils/apiHelper';
import { formatCurrency } from '../../utils/formatters';
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  Save,
  Radio,
  Clock,
  Calendar,
  Sparkles,
  RefreshCw,
  Power
} from 'lucide-react';

export default function AdminSundaySale() {
  const { adminToken } = useAdminAuth();

  const [saleState, setSaleState] = useState({
    dayInfo: { dayName: 'Sunday', isSunday: false, simulatedDay: 'REAL' },
    isLive: false,
    statusText: 'OFFLINE',
    candidateProducts: []
  });

  const [productsConfig, setProductsConfig] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modals for Go Live and End Sale
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);
  const [isEndSaleModalOpen, setIsEndSaleModalOpen] = useState(false);

  const fetchSundaySaleData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sunday-sale/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setSaleState({
          dayInfo: data.dayInfo || {},
          isLive: data.isLive,
          statusText: data.statusText,
          candidateProducts: data.candidateProducts || []
        });

        // Initialize local config from fetched products
        const initialConfig = {};
        for (const p of data.candidateProducts || []) {
          initialConfig[p.id] = {
            included: Boolean(p.included),
            salePrice: p.salePrice !== undefined ? p.salePrice : Math.round(p.regularPrice * 0.7)
          };
        }
        setProductsConfig(initialConfig);
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

  // 21. SAVE SUNDAY SALE
  const handleSaveSale = async () => {
    setIsSaving(true);
    setFeedback(null);

    const selectedItems = [];
    for (const [productId, config] of Object.entries(productsConfig)) {
      if (config.included) {
        selectedItems.push({
          productId: Number(productId),
          salePrice: Number(config.salePrice)
        });
      }
    }

    if (selectedItems.length === 0) {
      alert('Please select at least one product to include in the Sunday Sale.');
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
        body: JSON.stringify({ items: selectedItems })
      });

      const data = await parseResponseJson(res);
      if (data.success) {
        setFeedback({
          type: 'success',
          text: 'Sunday Sale saved successfully. Remember to click GO LIVE when ready!'
        });
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

  // 22. GO LIVE CONFIRMATION & EXECUTION
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

  // 23. END SALE CONFIRMATION & EXECUTION
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
  const selectedCount = Object.values(productsConfig).filter(c => c.included).length;

  return (
    <div className="space-y-6">
      
      {/* 19. HEADER */}
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

        <button
          onClick={fetchSundaySaleData}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
      )}

      {/* CURRENT STATUS BAR PER PROMPT REQUIREMENT 19 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Today's Calendar & Activation Status
            </span>
            <div className="text-lg font-black text-slate-800 mt-0.5">
              Today: <span className="text-slate-900">{saleState.dayInfo?.dayName || 'Day'}</span>
              {saleState.dayInfo?.isSimulated && (
                <span className="ml-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                  Simulated {saleState.dayInfo?.simulatedDay}
                </span>
              )}
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

        {/* 22. GO LIVE / 23. END SALE BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-700">
              Selected Products: <span className="font-black text-[#e51b23]">{selectedCount}</span> items
            </div>
            {!isSunday && (
              <p className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Sunday Sale can only be activated on Sunday. (You can still prepare & save prices today).</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* 21. SAVE SUNDAY SALE */}
            <button
              onClick={handleSaveSale}
              disabled={isSaving}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#ffd000]" />
              <span>{isSaving ? 'Saving...' : 'SAVE SALE'}</span>
            </button>

            {/* 22. GO LIVE BUTTON */}
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
              /* 23. END SALE BUTTON */
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

      {/* 20. SELECT SUNDAY PRODUCTS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900">
              Select Sunday Products & Special Prices
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Check the box to include a product and type its special Sunday Sale price. The discount % updates automatically.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {saleState.candidateProducts.length} Active Products
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 sm:px-6 w-16 text-center">Include</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Regular Price</th>
                <th className="py-3.5 px-4 w-44">Sunday Sale Price (₹)</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Discount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {saleState.candidateProducts.map((product) => {
                const conf = productsConfig[product.id] || { included: false, salePrice: Math.round(product.regularPrice * 0.7) };
                const regPrice = product.regularPrice;
                const salePrice = conf.salePrice;
                const savings = Math.max(0, regPrice - salePrice);
                const discount = regPrice > 0 ? Math.round((savings / regPrice) * 100) : 0;

                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${conf.included ? 'bg-amber-50/30 hover:bg-amber-50/50' : 'hover:bg-slate-50'}`}
                  >
                    
                    {/* Include Checkbox */}
                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <input
                        type="checkbox"
                        checked={conf.included}
                        onChange={() => handleToggleInclude(product.id)}
                        className="w-5 h-5 text-[#e51b23] rounded focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Product Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={product.image || '/images/prem-main.jpg'}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                      {product.category}
                    </td>

                    {/* Regular Price */}
                    <td className="py-3.5 px-4 text-xs font-black text-slate-900">
                      {formatCurrency(regPrice)}
                    </td>

                    {/* Sunday Price Input */}
                    <td className="py-3.5 px-4">
                      <div className="relative w-36">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          disabled={!conf.included}
                          value={conf.salePrice}
                          onChange={(e) => handlePriceChange(product.id, e.target.value)}
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#050505] disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </div>
                    </td>

                    {/* Auto-calculated Discount */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      {conf.included ? (
                        <div className="flex flex-col items-end">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#ffd000] text-[#050505] text-[10px] font-black">
                            {discount}% OFF
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 mt-0.5">
                            Save {formatCurrency(savings)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 22. GO LIVE CONFIRMATION MODAL */}
      {isGoLiveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 text-[#e51b23] flex items-center justify-center mx-auto animate-pulse">
              <Flame className="w-8 h-8 fill-[#e51b23]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-slate-900">
                Are you sure you want to start the Sunday Shopping Sale?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will immediately broadcast special Sunday sale pricing to all website visitors across desktop and mobile.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsGoLiveModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmGoLive}
                className="flex-1 py-3 rounded-xl bg-[#e51b23] hover:bg-[#c91219] text-white font-black text-xs uppercase tracking-wider shadow-md"
              >
                GO LIVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 23. END SALE CONFIRMATION MODAL */}
      {isEndSaleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <Power className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-slate-900">
                Are you sure you want to end today's Sunday Sale?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The sale will immediately become offline. Products will return to their regular store prices.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsEndSaleModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmEndSale}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider shadow-md"
              >
                END SALE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
