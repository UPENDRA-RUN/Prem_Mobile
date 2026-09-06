import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { generateBundleAddons } from '../../utils/bundleRecommendation';
import { formatCurrency } from '../../utils/formatters';
import {
  ShoppingBag,
  Sparkles,
  Plus,
  Check,
  CheckCircle2,
  Tag,
  ArrowRight
} from 'lucide-react';

export default function FrequentlyBoughtTogether({ product, catalogProducts = [] }) {
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const bundleData = generateBundleAddons(product, catalogProducts);

  // Checked state for items (main product is index 0 and mandatory)
  const [selectedIds, setSelectedIds] = useState(() => [
    product.id,
    ...bundleData.addons.map(a => a.id)
  ]);
  const [isAdded, setIsAdded] = useState(false);

  const toggleItem = (id) => {
    if (id === product.id) return; // Main product is required
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Calculate dynamic sum for selected items
  let totalSum = Number(product.price || product.currentPrice || product.regularPrice || 0);
  let totalRegularSum = Number(product.originalPrice || product.regularPrice || totalSum);
  let selectedCount = 1;

  bundleData.addons.forEach(addon => {
    if (selectedIds.includes(addon.id)) {
      totalSum += addon.price;
      totalRegularSum += addon.regularPrice;
      selectedCount++;
    }
  });

  // Apply extra ₹300 bundle savings if all items are selected
  const isFullBundle = selectedCount === (1 + bundleData.addons.length);
  const extraSavings = isFullBundle ? bundleData.bundleDiscount : 0;
  const finalPayable = Math.max(0, totalSum - extraSavings);
  const totalSavings = (totalRegularSum - totalSum) + extraSavings;

  const handleAddBundleToCart = () => {
    // 1. Add main product
    addToCart(product, 1);

    // 2. Add selected addons
    bundleData.addons.forEach(addon => {
      if (selectedIds.includes(addon.id)) {
        addToCart(
          {
            ...addon,
            price: addon.price,
            originalPrice: addon.regularPrice,
            image: addon.image
          },
          1
        );
      }
    });

    setIsAdded(true);
    setIsCartDrawerOpen(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-black text-[#E31B23] uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            FREQUENTLY BOUGHT TOGETHER
          </span>
          <h3 className="font-display font-black text-xl text-[#050505]">
            Recommended Smart Accessories Bundle
          </h3>
        </div>

        {totalSavings > 0 && (
          <span className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-extrabold text-xs flex items-center gap-1.5 shadow-xs w-fit">
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            <span>INSTANT BUNDLE SAVINGS: SAVE {formatCurrency(totalSavings)}</span>
          </span>
        )}
      </div>

      {/* 2-Column Responsive Layout: Thumbnails + Checkboxes on Left, Summary Box on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Visual Thumbnails Connector Row & Interactive Checkboxes */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          
          {/* Thumbnails Row */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1">
            {/* Main Product Thumbnail */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 border-2 border-[#FFD400] rounded-2xl p-2 flex-shrink-0 flex items-center justify-center shadow-xs">
              <img
                src={product.image || (product.images && product.images[0]) || '/images/prem-main.jpg'}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/prem-main.jpg'; }}
              />
              <span className="absolute -top-2 -left-1 bg-[#050505] text-[#FFD400] text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                MAIN ITEM
              </span>
            </div>

            {/* Plus Connector 1 */}
            {bundleData.addons[0] && (
              <>
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xs flex-shrink-0">
                  <Plus className="w-3.5 h-3.5 text-slate-600" />
                </div>

                {/* Addon 1 Thumbnail */}
                <button
                  type="button"
                  onClick={() => toggleItem(bundleData.addons[0].id)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 border-2 rounded-2xl p-2 flex-shrink-0 flex items-center justify-center transition cursor-pointer ${
                    selectedIds.includes(bundleData.addons[0].id) ? 'border-emerald-500 ring-2 ring-emerald-400/30 shadow-xs' : 'border-slate-200 opacity-40 grayscale'
                  }`}
                >
                  <img
                    src={bundleData.addons[0].image}
                    alt={bundleData.addons[0].name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {selectedIds.includes(bundleData.addons[0].id) && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Plus Connector 2 */}
            {bundleData.addons[1] && (
              <>
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xs flex-shrink-0">
                  <Plus className="w-3.5 h-3.5 text-slate-600" />
                </div>

                {/* Addon 2 Thumbnail */}
                <button
                  type="button"
                  onClick={() => toggleItem(bundleData.addons[1].id)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 border-2 rounded-2xl p-2 flex-shrink-0 flex items-center justify-center transition cursor-pointer ${
                    selectedIds.includes(bundleData.addons[1].id) ? 'border-emerald-500 ring-2 ring-emerald-400/30 shadow-xs' : 'border-slate-200 opacity-40 grayscale'
                  }`}
                >
                  <img
                    src={bundleData.addons[1].image}
                    alt={bundleData.addons[1].name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {selectedIds.includes(bundleData.addons[1].id) && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Interactive Checkboxes List */}
          <div className="space-y-2 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
            
            {/* Main Product */}
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked
                disabled
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-[#050505]"
              />
              <span className="flex-1 truncate">
                <strong className="text-[#050505]">This Item:</strong> {product.name}
              </span>
              <span className="font-black text-[#E31B23]">
                {formatCurrency(product.price || product.currentPrice || product.regularPrice)}
              </span>
            </div>

            {/* Addon 1 */}
            {bundleData.addons[0] && (
              <div
                className="flex items-center gap-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                onClick={() => toggleItem(bundleData.addons[0].id)}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(bundleData.addons[0].id)}
                  onChange={() => toggleItem(bundleData.addons[0].id)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <span className="flex-1 truncate">
                  <strong className="text-slate-900">Add-on 1:</strong> {bundleData.addons[0].name}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-extrabold text-emerald-700">{formatCurrency(bundleData.addons[0].price)}</span>
                  <span className="text-[10px] text-slate-400 line-through">{formatCurrency(bundleData.addons[0].regularPrice)}</span>
                </div>
              </div>
            )}

            {/* Addon 2 */}
            {bundleData.addons[1] && (
              <div
                className="flex items-center gap-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                onClick={() => toggleItem(bundleData.addons[1].id)}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(bundleData.addons[1].id)}
                  onChange={() => toggleItem(bundleData.addons[1].id)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <span className="flex-1 truncate">
                  <strong className="text-slate-900">Add-on 2:</strong> {bundleData.addons[1].name}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-extrabold text-emerald-700">{formatCurrency(bundleData.addons[1].price)}</span>
                  <span className="text-[10px] text-slate-400 line-through">{formatCurrency(bundleData.addons[1].regularPrice)}</span>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: High-Contrast Bundle Summary Card */}
        <div className="lg:col-span-5 bg-[#050505] text-white rounded-2xl p-4 sm:p-5 border-2 border-[#FFD400]/60 flex flex-col justify-between space-y-4 shadow-md">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="font-bold text-slate-300">Selected Bundle Items:</span>
              <span className="font-black text-[#FFD400] bg-[#FFD400]/10 px-2 py-0.5 rounded border border-[#FFD400]/30">
                {selectedCount} of {1 + bundleData.addons.length} Selected
              </span>
            </div>

            <div className="pt-1">
              <span className="text-xs text-slate-400 font-bold block mb-0.5 uppercase tracking-wider">Total Bundle Price:</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black font-display text-[#FFD400]">
                  {formatCurrency(finalPayable)}
                </span>
                {totalRegularSum > finalPayable && (
                  <span className="text-sm text-slate-400 line-through font-semibold">
                    {formatCurrency(totalRegularSum)}
                  </span>
                )}
              </div>
            </div>

            {totalSavings > 0 && (
              <p className="text-xs font-bold text-emerald-400 bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/30">
                ✨ You save {formatCurrency(totalSavings)} with this smart accessory bundle!
              </p>
            )}
          </div>

          <button
            onClick={handleAddBundleToCart}
            className="w-full py-3.5 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#050505] stroke-[2.5]" />
            <span>
              {isAdded ? 'BUNDLE ADDED TO CART!' : `ADD ALL ${selectedCount} ITEMS & SAVE ${formatCurrency(totalSavings)}`}
            </span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

        </div>

      </div>

    </div>
  );
}
