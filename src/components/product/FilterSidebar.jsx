import React from 'react';
import { RotateCcw, Filter, Check, Star, Sparkles } from 'lucide-react';
import { categories } from '../../data/categories';

export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  onReset,
  availableBrands = []
}) {
  const priceOptions = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹1,000', value: 'under-1000' },
    { label: '₹1,000 - ₹3,000', value: '1000-3000' },
    { label: '₹3,000 - ₹10,000', value: '3000-10000' },
    { label: '₹10,000 - ₹25,000', value: '10000-25000' },
    { label: 'Above ₹25,000', value: 'above-25000' }
  ];

  const ratingOptions = [
    { label: 'All Ratings', value: 0 },
    { label: '4.5 ★ & above', value: 4.5 },
    { label: '4.0 ★ & above', value: 4.0 }
  ];

  // Calculate total active filters count
  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-6">
      
      {/* HEADER WITH HIGH-LEVEL ACTIVE COUNT BADGE */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#E31B23]" />
          <h3 className="font-display font-black text-[#050505] text-sm uppercase tracking-wider flex items-center gap-1.5">
            <span>FILTERS</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#E31B23] text-white text-[10px] font-black">
                {activeFiltersCount} ACTIVE
              </span>
            )}
          </h3>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-[#E31B23] hover:underline flex items-center gap-1 transition-all"
            title="Clear all active filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* PRIORITY 1: CATEGORY SELECTION */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-[11px] font-black text-[#050505] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#E31B23]" />
            <span>1. PRODUCT CATEGORY</span>
          </h4>
          {selectedCategory !== 'all' && (
            <span className="text-[10px] font-bold text-[#E31B23]">
              {selectedCategory}
            </span>
          )}
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#050505] text-[#FFD400] shadow-sm font-black'
                : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-[#FFD400]" />}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-[#050505] text-[#FFD400] shadow-sm font-black'
                    : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#FFD400] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRIORITY 2: BRAND SELECTION */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-[11px] font-black text-[#050505] uppercase tracking-wider">
            2. BRAND NAME
          </h4>
          {selectedBrand !== 'all' && (
            <span className="text-[10px] font-bold text-[#E31B23]">
              {selectedBrand}
            </span>
          )}
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
              selectedBrand === 'all'
                ? 'bg-[#050505] text-[#FFD400] shadow-sm font-black'
                : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <span>All Brands</span>
            {selectedBrand === 'all' && <Check className="w-3.5 h-3.5 text-[#FFD400]" />}
          </button>

          {availableBrands.map((brand) => {
            const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
            return (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-[#050505] text-[#FFD400] shadow-sm font-black'
                    : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className="truncate">{brand}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#FFD400] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRIORITY 3: PRICE RANGE */}
      <div>
        <h4 className="text-[11px] font-black text-[#050505] uppercase tracking-wider mb-2.5">
          3. PRICE RANGE
        </h4>
        <div className="space-y-1.5">
          {priceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPriceRange(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                priceRange === opt.value
                  ? 'bg-[#050505] text-[#FFD400] shadow-sm font-black'
                  : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <span>{opt.label}</span>
              {priceRange === opt.value && <Check className="w-3.5 h-3.5 text-[#FFD400]" />}
            </button>
          ))}
        </div>
      </div>

      {/* PRIORITY 4: STAR RATING */}
      <div>
        <h4 className="text-[11px] font-black text-[#050505] uppercase tracking-wider mb-2.5">
          4. MINIMUM STAR RATING
        </h4>
        <div className="space-y-1.5">
          {ratingOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMinRating(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                minRating === opt.value
                  ? 'bg-[#050505] text-[#FFD400] shadow-sm font-black'
                  : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{opt.label}</span>
              </div>
              {minRating === opt.value && <Check className="w-3.5 h-3.5 text-[#FFD400]" />}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
