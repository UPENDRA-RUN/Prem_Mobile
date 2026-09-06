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
  const isFullBundle = selectedCount === 3;
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
    <div className="bg-white rounded-3xl sm:rounded-4xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      
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

        {isFullBundle && (
          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs flex items-center gap-1.5 shadow-xs w-fit">
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            <span>INSTANT BUNDLE SAVINGS: SAVE ₹{totalSavings}</span>
          </span>
        )}
      </div>

      {/* Visual Thumbnails Connector Grid */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 py-2">
        
        {/* Main Product Thumbnail */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 border-2 border-[#FFD400] rounded-2xl p-2 flex items-center justify-center shadow-xs">
          <img
            src={product.image || (product.images && product.images[0]) || '/images/prem-main.jpg'}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => { e.target.src = '/images/prem-main.jpg'; }}
          />
          <span className="absolute -top-2 -left-2 bg-[#050505] text-[#FFD400] text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
            MAIN ITEM
          </span>
        </div>

        {/* Plus Connector 1 */}
        {bundleData.addons[0] && (
          <>
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-black text-sm">
              <Plus className="w-4 h-4 text-slate-600" />
            </div>

            {/* Addon 1 Thumbnail */}
            <div className={`relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 border rounded-2xl p-2 flex items-center justify-center transition ${
              selectedIds.includes(bundleData.addons[0].id) ? 'border-emerald-500 shadow-xs' : 'border-slate-200 opacity-40'
            }`}>
              <img
                src={bundleData.addons[0].image}
                alt={bundleData.addons[0].name}
                className="w-full h-full object-contain"
              />
            </div>
          </>
        )}

        {/* Plus Connector 2 */}
        {bundleData.addons[1] && (
          <>
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-black text-sm">
              <Plus className="w-4 h-4 text-slate-600" />
            </div>

            {/* Addon 2 Thumbnail */}
            <div className={`relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 border rounded-2xl p-2 flex items-center justify-center transition ${
              selectedIds.includes(bundleData.addons[1].id) ? 'border-emerald-500 shadow-xs' : 'border-slate-200 opacity-40'
            }`}>
              <img
                src={bundleData.addons[1].image}
                alt={bundleData.addons[1].name}
                className="w-full h-full object-contain"
              />
            </div>
          </>
        )}
      </div>

      {/* Checkboxes List */}
      <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
        
        {/* Main Product */}
        <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
          <input
            type="checkbox"
            checked
            disabled
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-[#050505]"
          />
          <span className="flex-1 truncate">
            <strong className="text-[#050505]">This Item:</strong> {product.name}
          </span>
          <span className="font-extrabold text-[#E31B23]">
            {formatCurrency(product.price || product.currentPrice || product.regularPrice)}
          </span>
        </div>

        {/* Addon 1 */}
        {bundleData.addons[0] && (
          <div className="flex items-center gap-3 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer" onClick={() => toggleItem(bundleData.addons[0].id)}>
            <input
              type="checkbox"
              checked={selectedIds.includes(bundleData.addons[0].id)}
              onChange={() => toggleItem(bundleData.addons[0].id)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
            />
            <span className="flex-1 truncate">
              <strong>Add-on 1:</strong> {bundleData.addons[0].name}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-emerald-700">{formatCurrency(bundleData.addons[0].price)}</span>
              <span className="text-[10px] text-slate-400 line-through">{formatCurrency(bundleData.addons[0].regularPrice)}</span>
            </div>
          </div>
        )}

        {/* Addon 2 */}
        {bundleData.addons[1] && (
          <div className="flex items-center gap-3 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer" onClick={() => toggleItem(bundleData.addons[1].id)}>
            <input
              type="checkbox"
              checked={selectedIds.includes(bundleData.addons[1].id)}
              onChange={() => toggleItem(bundleData.addons[1].id)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
            />
            <span className="flex-1 truncate">
              <strong>Add-on 2:</strong> {bundleData.addons[1].name}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-emerald-700">{formatCurrency(bundleData.addons[1].price)}</span>
              <span className="text-[10px] text-slate-400 line-through">{formatCurrency(bundleData.addons[1].regularPrice)}</span>
            </div>
          </div>
        )}

      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Bundle Price:</span>
            <span className="text-2xl font-black text-[#050505]">{formatCurrency(finalPayable)}</span>
            {totalRegularSum > finalPayable && (
              <span className="text-xs text-slate-400 line-through font-semibold">{formatCurrency(totalRegularSum)}</span>
            )}
          </div>
          <p className="text-xs font-bold text-emerald-700">
            ✨ You save {formatCurrency(totalSavings)} with this smart accessory bundle!
          </p>
        </div>

        <button
          onClick={handleAddBundleToCart}
          className="py-4 px-6 rounded-2xl bg-[#050505] hover:bg-slate-800 text-[#FFD400] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition hover:scale-102 ring-2 ring-[#FFD400]/40"
        >
          <ShoppingBag className="w-4 h-4 text-[#FFD400] stroke-[2.5]" />
          <span>
            {isAdded ? 'BUNDLE ADDED TO CART!' : `ADD ALL ${selectedCount} ITEMS TO CART & SAVE ₹${totalSavings}`}
          </span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
}
