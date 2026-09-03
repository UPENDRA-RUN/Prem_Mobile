import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/product/FilterSidebar';
import HighlightText from '../components/common/HighlightText';
import {
  Search,
  SlidersHorizontal,
  X,
  Flame,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Star,
  PackageOpen,
  Filter
} from 'lucide-react';
import { storeConfig } from '../config/store';

const PRODUCTS_PER_PAGE = 6;

const TRENDING_TAGS = [
  'boAt Earbuds',
  '5G Smartphones',
  '25W Charger',
  'Sunday Sale',
  'Smartwatches',
  'Power Bank'
];

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
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort);
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category'));
    if (searchParams.get('brand')) setSelectedBrand(searchParams.get('brand'));
    if (searchParams.get('q') !== null) {
      setSearchQuery(searchParams.get('q') || '');
      setDebouncedQuery(searchParams.get('q') || '');
    }
    if (searchParams.get('sort')) setSortBy(searchParams.get('sort'));
  }, [searchParams]);

  // Debounce search query
  useEffect(() => {
    if (searchQuery !== debouncedQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setDebouncedQuery(searchQuery);
        setIsSearching(false);
        setCurrentPage(1);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

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

        if (debouncedQuery.trim()) {
          const q = debouncedQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.tag && p.tag.toLowerCase().includes(q));
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
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
      });
  }, [selectedCategory, selectedBrand, debouncedQuery, priceRange, minRating, sortBy]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    return (
      (selectedCategory !== 'all' ? 1 : 0) +
      (selectedBrand !== 'all' ? 1 : 0) +
      (priceRange !== 'all' ? 1 : 0) +
      (minRating > 0 ? 1 : 0) +
      (debouncedQuery ? 1 : 0)
    );
  }, [selectedCategory, selectedBrand, priceRange, minRating, debouncedQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchQuery('');
    setDebouncedQuery('');
    setPriceRange('all');
    setMinRating(0);
    setSortBy('popular');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
    setCurrentPage(1);
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  return (
    <div className="py-6 sm:py-10 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Banner */}
        <div className="rounded-3xl bg-[#050505] text-white p-6 sm:p-8 shadow-xl border-2 border-[#FFD400]/40 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>PREM MOBILE CATALOG & SEARCH</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
              {debouncedQuery ? `SEARCH RESULTS FOR "${debouncedQuery}"` : 'ALL ELECTRONICS & MOBILES'}
            </h1>
            <p className="text-xs sm:text-sm text-[#FFD400] font-bold">
              “{storeConfig.tagline}” • Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.)
            </p>
          </div>
        </div>

        {/* SEARCH BOX & ACTION BAR DIRECTLY NEAR ITEM COLLECTION */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input Bar with Action Button & Loader */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-auto flex-1 flex items-center gap-2">
              <div className="relative flex-1 flex items-center bg-slate-50 rounded-xl border border-slate-200 focus-within:border-[#FFD400] focus-within:bg-white transition-all">
                <div className="pl-3.5 text-slate-400">
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 text-[#E31B23] animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search phones, earbuds, egg boilers, chargers, brands..."
                  className="w-full pl-3 pr-9 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-transparent text-[#050505] focus:outline-none"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setDebouncedQuery('');
                    }}
                    className="pr-3 text-slate-400 hover:text-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* SEARCH ACTION BUTTON */}
              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs transition-transform hover:scale-102 flex-shrink-0"
              >
                <span>SEARCH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Right Controls: Sort & Mobile Filter Trigger */}
            <div className="flex items-center justify-between w-full md:w-auto gap-3 flex-shrink-0">
              
              {/* MOBILE FILTER TRIGGER BUTTON WITH ACTIVE COUNT BADGE */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm relative"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#E31B23] text-white text-[10px] font-black flex items-center justify-center ml-1">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                  Sort By:
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
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

          </div>

          {/* SUGGESTED TRENDING SEARCH CHIPS */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>Suggested:</span>
            </span>

            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  setDebouncedQuery(tag);
                  setCurrentPage(1);
                  setSearchParams({ q: tag });
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#FFD400] text-slate-700 hover:text-[#050505] font-semibold text-[11px] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE REMOVABLE FILTER CHIPS (SHOW ACTIVE FILTERS CLEARLY & EASY REMOVAL) */}
        {activeFiltersCount > 0 && (
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[11px] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#E31B23]" />
              <span>Active Filters ({activeFiltersCount}):</span>
            </span>

            {debouncedQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505] text-[#FFD400] font-bold">
                <span>Search: "{debouncedQuery}"</span>
                <button
                  onClick={() => { setSearchQuery(''); setDebouncedQuery(''); }}
                  className="hover:text-white"
                  title="Remove query filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505] text-[#FFD400] font-bold">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-white"
                  title="Remove category filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505] text-[#FFD400] font-bold">
                <span>Brand: {selectedBrand}</span>
                <button
                  onClick={() => setSelectedBrand('all')}
                  className="hover:text-white"
                  title="Remove brand filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505] text-[#FFD400] font-bold">
                <span>Price: {priceRange}</span>
                <button
                  onClick={() => setPriceRange('all')}
                  className="hover:text-white"
                  title="Remove price filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505] text-[#FFD400] font-bold">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Rating: {minRating}★ & above</span>
                <button
                  onClick={() => setMinRating(0)}
                  className="hover:text-white"
                  title="Remove rating filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* BULK CLEAR ALL FILTERS BUTTON */}
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#E31B23] hover:underline flex items-center gap-1 ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
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

          {/* Product Grid & Pagination */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* LIVE RESULT COUNT HEADER */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1 border-b border-slate-200 pb-2">
              <span>
                Found <strong className="text-[#050505] text-sm">{filteredProducts.length}</strong> matching products out of {products.length} total
              </span>
              <span className="text-[#E31B23] font-bold">Pinto Park Gwalior Store Stock</span>
            </div>

            {/* EXPLANATORY EMPTY STATE WHEN FILTERING PRODUCES 0 RESULTS */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#050505] flex items-center justify-center mx-auto border border-amber-200">
                  <PackageOpen className="w-8 h-8 text-[#050505]" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-[#050505]">
                    No Products Match Your Filter Combination
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                    Your active filter criteria returned 0 results. Try broadening your price range, selecting a different brand, or clearing specific filters.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="py-2.5 px-5 rounded-xl bg-[#FFD400] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#e6be00]"
                  >
                    Reset All Filters
                  </button>

                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="py-2.5 px-4 rounded-xl bg-[#050505] text-[#FFD400] font-bold text-xs"
                    >
                      Clear Category ({selectedCategory})
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Render Product Cards with Search Highlighting */
              <ProductGrid
                products={paginatedProducts}
                searchQuery={debouncedQuery}
                columns="grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
              />
            )}

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs font-bold shadow-xs">
                <span className="text-slate-500">
                  Showing Page {currentPage} of {totalPages} ({filteredProducts.length} items total)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setCurrentPage(pg)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          currentPage === pg
                            ? 'bg-[#050505] text-[#FFD400]'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-5 z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-display font-black text-[#050505] text-lg uppercase flex items-center gap-2">
                <span>FILTER PRODUCTS</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#E31B23] text-white text-xs font-black">
                    {activeFiltersCount} ACTIVE
                  </span>
                )}
              </h3>
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
