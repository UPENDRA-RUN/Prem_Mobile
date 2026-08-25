import React from 'react';
import { RotateCcw, Filter, Check } from 'lucide-react';
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

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    priceRange !== 'all' ||
    minRating > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#E31B23]" />
          <h3 className="font-display font-black text-[#050505] text-sm uppercase tracking-wider">FILTERS</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-[#E31B23] hover:underline flex items-center gap-1 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          CATEGORY
        </h4>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#050505] text-[#FFD400]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-[#FFD400]" />}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-[#050505] text-[#FFD400]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {selectedCategory.toLowerCase() === cat.name.toLowerCase() && (
                <Check className="w-3.5 h-3.5 text-[#FFD400] flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          BRAND
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
              selectedBrand === 'all'
                ? 'bg-[#050505] text-[#FFD400]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>All Brands</span>
            {selectedBrand === 'all' && <Check className="w-3.5 h-3.5 text-[#FFD400]" />}
          </button>

          {availableBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                selectedBrand === brand
                  ? 'bg-[#050505] text-[#FFD400]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{brand}</span>
              {selectedBrand === brand && (
                <Check className="w-3.5 h-3.5 text-[#FFD400] flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          PRICE RANGE
        </h4>
        <div className="space-y-1.5">
          {priceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPriceRange(opt.value)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                priceRange === opt.value
                  ? 'bg-[#050505] text-[#FFD400]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{opt.label}</span>
              {priceRange === opt.value && <Check className="w-3.5 h-3.5 text-[#FFD400]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          RATING
        </h4>
        <div className="space-y-1.5">
          {ratingOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMinRating(opt.value)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                minRating === opt.value
                  ? 'bg-[#050505] text-[#FFD400]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{opt.label}</span>
              {minRating === opt.value && <Check className="w-3.5 h-3.5 text-[#FFD400]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
