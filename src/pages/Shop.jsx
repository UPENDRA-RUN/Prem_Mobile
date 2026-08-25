import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/product/FilterSidebar';
import { Search, SlidersHorizontal, X, Flame } from 'lucide-react';
import { storeConfig } from '../config/store';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state sync
  const initialCategory = searchParams.get('category') || 'all';
  const initialBrand = searchParams.get('brand') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'popular';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState(initialSort);
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category'));
    if (searchParams.get('brand')) setSelectedBrand(searchParams.get('brand'));
    if (searchParams.get('q') !== null) setSearchQuery(searchParams.get('q') || '');
    if (searchParams.get('sort')) setSortBy(searchParams.get('sort'));
  }, [searchParams]);

  const availableBrands = useMemo(() => {
    const brandsSet = new Set(products.map((p) => p.brand));
    return Array.from(brandsSet).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (
          selectedCategory !== 'all' &&
          p.category.toLowerCase() !== selectedCategory.toLowerCase() &&
          p.categorySlug !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        if (
          selectedBrand !== 'all' &&
          p.brand.toLowerCase() !== selectedBrand.toLowerCase()
        ) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q));
          if (!matches) return false;
        }

        if (priceRange === 'under-1000' && p.price >= 1000) return false;
        if (priceRange === '1000-3000' && (p.price < 1000 || p.price > 3000)) return false;
        if (priceRange === '3000-10000' && (p.price < 3000 || p.price > 10000)) return false;
        if (priceRange === '10000-25000' && (p.price < 10000 || p.price > 25000)) return false;
        if (priceRange === 'above-25000' && p.price <= 25000) return false;

        if (minRating > 0 && p.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.id - a.id;
        return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
      });
  }, [selectedCategory, selectedBrand, searchQuery, priceRange, minRating, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchQuery('');
    setPriceRange('all');
    setMinRating(0);
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="py-6 sm:py-10 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner */}
        <div className="rounded-3xl bg-[#050505] text-white p-6 sm:p-8 mb-8 shadow-xl border-2 border-[#FFD400]/40 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>PREM MOBILE CATALOG</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
              ALL ELECTRONICS & MOBILES
            </h1>
            <p className="text-xs sm:text-sm text-[#FFD400] font-bold">
              “{storeConfig.tagline}” • Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.)
            </p>
          </div>
        </div>

        {/* Search & Top Action Bar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phones, earbuds, egg boilers, chargers..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm border border-slate-200 focus:border-[#FFD400] bg-slate-50 text-[#050505]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Mobile Filter Trigger */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-[#050505] bg-slate-50 focus:border-[#FFD400] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(selectedCategory !== 'all' || selectedBrand !== 'all' || priceRange !== 'all' || minRating > 0 || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 px-1">
            <span className="text-xs font-bold text-slate-400">Filters:</span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505] text-[#FFD400] text-xs font-bold">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505] text-[#FFD400] text-xs font-bold">
                <span>Brand: {selectedBrand}</span>
                <button onClick={() => setSelectedBrand('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505] text-[#FFD400] text-xs font-bold">
                <span>Price Filter</span>
                <button onClick={() => setPriceRange('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#E31B23] hover:underline ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minRating={minRating}
              setMinRating={setMinRating}
              onReset={handleResetFilters}
              availableBrands={availableBrands}
            />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-9 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Showing {filteredProducts.length} Products</span>
              <span className="text-[#E31B23] font-bold">Pinto Park Gwalior Stock</span>
            </div>

            <ProductGrid
              products={filteredProducts}
              columns="grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
              emptyMessage="No products found matching your selected filters. Try searching for other electronics."
            />
          </div>

        </div>

      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-5 z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-display font-black text-navy-900 text-lg">FILTERS</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minRating={minRating}
              setMinRating={setMinRating}
              onReset={handleResetFilters}
              availableBrands={availableBrands}
            />

            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-[#FFD400] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md"
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
