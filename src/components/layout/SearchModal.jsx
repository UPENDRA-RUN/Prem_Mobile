import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import { categories } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';
import HighlightText from '../common/HighlightText';
import RatingStars from '../common/RatingStars';
import {
  Search,
  X,
  ArrowRight,
  Tag,
  Loader2,
  Clock,
  Trash2,
  SlidersHorizontal,
  Flame,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const TRENDING_SEARCHES = [
  'boAt Earbuds',
  '5G Smartphones',
  '25W Fast Charger',
  'Sunday Sale',
  'Smartwatches',
  'Mi Power Bank',
  'Tempered Glass'
];

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under-1000' | '1000-5000' | 'above-5000'
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance' | 'price-low' | 'price-high' | 'rating'
  const [currentPage, setCurrentPage] = useState(1);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('premmobile_recent_searches');
      return saved ? JSON.parse(saved) : ['boAt Airdopes', 'Realme 12 Pro', '20000mAh Power Bank'];
    } catch (e) {
      return [];
    }
  });

  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus & lock scroll on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchTerm('');
      setDebouncedQuery('');
      setCurrentPage(1);
    }
  }, [isOpen]);

  // Debounce search query with progress indicator
  useEffect(() => {
    if (searchTerm !== debouncedQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setDebouncedQuery(searchTerm);
        setIsSearching(false);
        setCurrentPage(1);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm]);

  const saveRecentSearch = (queryStr) => {
    if (!queryStr || !queryStr.trim()) return;
    const clean = queryStr.trim();
    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem('premmobile_recent_searches', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('premmobile_recent_searches');
  };

  const handleExecuteSearch = (queryToRun) => {
    const q = queryToRun || searchTerm;
    if (!q.trim()) return;
    saveRecentSearch(q);
    onClose();
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter') {
      handleExecuteSearch();
    }
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery.trim() && selectedCategory === 'all' && priceFilter === 'all') {
      return [];
    }

    const query = debouncedQuery.toLowerCase().trim();

    let list = products.filter((p) => {
      // Search term matching
      if (query) {
        const matchName = p.name.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        const matchCat = p.category.toLowerCase().includes(query);
        const matchDesc = p.description && p.description.toLowerCase().includes(query);
        const matchTag = p.tag && p.tag.toLowerCase().includes(query);

        if (!matchName && !matchBrand && !matchCat && !matchDesc && !matchTag) {
          return false;
        }
      }

      // Category filter matching
      if (
        selectedCategory !== 'all' &&
        p.category.toLowerCase() !== selectedCategory.toLowerCase() &&
        p.categorySlug !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Price filter matching
      if (priceFilter === 'under-1000' && p.price >= 1000) return false;
      if (priceFilter === '1000-5000' && (p.price < 1000 || p.price > 5000)) return false;
      if (priceFilter === 'above-5000' && p.price <= 5000) return false;

      return true;
    });

    // Sorting logic
    return list.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;

      // Relevance sorting: exact name matches first
      if (query) {
        const aNameExact = a.name.toLowerCase().startsWith(query) ? 2 : a.name.toLowerCase().includes(query) ? 1 : 0;
        const bNameExact = b.name.toLowerCase().startsWith(query) ? 2 : b.name.toLowerCase().includes(query) ? 1 : 0;
        if (aNameExact !== bNameExact) return bNameExact - aNameExact;
      }
      return b.rating - a.rating;
    });
  }, [debouncedQuery, selectedCategory, priceFilter, sortBy]);

  // Pagination Math
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 md:p-12 animate-fade-in flex items-start justify-center pt-8 sm:pt-16">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-3xl w-full transform rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden transition-all z-10 flex flex-col max-h-[85vh]">
        
        {/* TOP SEARCH BOX & ACTION BUTTON */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center bg-white rounded-2xl border border-slate-300 shadow-sm focus-within:border-[#FFD400] focus-within:ring-2 focus-within:ring-[#FFD400]/30 transition-all">
              <div className="pl-4 pr-2 text-slate-400">
                {isSearching ? (
                  <Loader2 className="w-5 h-5 text-[#E31B23] animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-slate-500" />
                )}
              </div>

              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search smartphones, boAt bassheads, power banks, 25W chargers..."
                className="w-full bg-transparent border-0 py-3.5 pr-10 text-xs sm:text-sm font-bold text-[#050505] placeholder-slate-400 focus:outline-none"
              />

              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDebouncedQuery('');
                  }}
                  className="pr-3 text-slate-400 hover:text-black transition-colors"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* EXPLICIT SEARCH BUTTON */}
            <button
              onClick={() => handleExecuteSearch()}
              className="py-3.5 px-5 rounded-2xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-transform hover:scale-102 flex-shrink-0"
            >
              <span>SEARCH</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-black hover:bg-slate-200 transition-colors flex-shrink-0"
              title="Close modal (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* INLINE CATEGORY & SORT FILTERS */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-xl font-bold transition-all flex-shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#050505] text-[#FFD400]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Categories
              </button>

              {['Smartphones', 'Earbuds', 'Headphones', 'Smartwatches', 'Power Banks', 'Accessories', 'Gadgets'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl font-bold transition-all flex-shrink-0 ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#050505] text-[#FFD400]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
              <span className="font-bold text-slate-500 text-[11px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1 px-2.5 rounded-lg border border-slate-200 font-bold text-xs bg-white text-[#050505] focus:outline-none focus:border-[#FFD400]"
              >
                <option value="relevance">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* RESULTS & SUGGESTIONS AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Active Search Results State */}
          {debouncedQuery.trim() || selectedCategory !== 'all' || priceFilter !== 'all' ? (
            <div className="space-y-4">
              
              {/* Header & Result Count */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-[#050505]">
                    Found <strong className="text-[#E31B23]">{filteredProducts.length}</strong> matching result(s)
                  </span>
                  {debouncedQuery && (
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md text-[11px]">
                      for "{debouncedQuery}"
                    </span>
                  )}
                </div>

                {filteredProducts.length > 0 && (
                  <button
                    onClick={() => handleExecuteSearch()}
                    className="text-[#E31B23] hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>View all in Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Product Results List */}
              {paginatedProducts.length > 0 ? (
                <div className="space-y-3">
                  {paginatedProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => {
                        saveRecentSearch(product.name);
                        onClose();
                      }}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#FFD400] transition-all shadow-2xs hover:shadow-md"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-[#E31B23] uppercase">
                              <HighlightText text={product.brand} query={debouncedQuery} />
                            </span>
                            <span className="text-[10px] text-slate-400">• {product.category}</span>
                            {product.availability && (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                                In Stock
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-xs sm:text-sm text-[#050505] group-hover:text-[#E31B23] transition-colors line-clamp-1">
                            <HighlightText text={product.name} query={debouncedQuery} />
                          </h4>

                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            <HighlightText text={product.description} query={debouncedQuery} />
                          </p>

                          <div className="pt-0.5">
                            <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                        <div className="text-right">
                          <span className="font-display font-black text-sm sm:text-base text-[#050505] block">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <span className="px-2.5 py-1 rounded-xl bg-[#FFD400] text-[#050505] font-black text-[10px] uppercase tracking-wider group-hover:bg-[#e6be00] transition-colors">
                          View Deal →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* EMPTY SEARCH RESULTS PATHWAY */
                <div className="py-10 text-center space-y-4 bg-slate-50 rounded-3xl border border-slate-200 p-6">
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                    <Search className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-[#050505]">
                      No exact matches for "{debouncedQuery}"
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Check your spelling or try exploring our top product categories below.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setDebouncedQuery('');
                        setSelectedCategory('all');
                      }}
                      className="px-5 py-2 rounded-xl bg-[#050505] text-[#FFD400] font-black text-xs uppercase"
                    >
                      Reset Search
                    </button>
                    <Link
                      to="/shop"
                      onClick={onClose}
                      className="px-5 py-2 rounded-xl bg-[#FFD400] text-[#050505] font-black text-xs uppercase"
                    >
                      Browse Full Catalog
                    </Link>
                  </div>
                </div>
              )}

              {/* PAGINATION CONTROLS (FOR LONG RESULT LISTS) */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-bold">
                  <span className="text-slate-500">
                    Page {currentPage} of {totalPages} ({filteredProducts.length} total)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[#050505]">
                      {currentPage}
                    </span>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* SUGGESTED SEARCH ITEMS & RECENT HISTORY */
            <div className="space-y-6 py-2">
              
              {/* RECENT SEARCHES */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[11px] text-red-500 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchTerm(term);
                          handleExecuteSearch(term);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors flex items-center gap-1.5 border border-slate-200"
                      >
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TRENDING SEARCH QUERIES */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#E31B23]" />
                  <span>Trending & Popular Searches</span>
                </span>

                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((query, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchTerm(query);
                        handleExecuteSearch(query);
                      }}
                      className="px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-[#FFD400] text-xs font-bold text-[#050505] border border-amber-200 hover:border-[#FFD400] transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{query}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* POPULAR CATEGORIES */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Browse by Popular Categories
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {categories.slice(0, 6).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onClose();
                        navigate(`/shop?category=${encodeURIComponent(cat.name)}`);
                      }}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#FFD400] text-left transition-all group flex items-center gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white text-[#050505] flex items-center justify-center border border-slate-200 group-hover:bg-[#FFD400]">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#050505] group-hover:text-[#E31B23] transition-colors block">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-slate-400">View Products →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-5">
          <span className="flex items-center gap-1">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono font-bold text-[#050505]">ESC</kbd> to close
          </span>
          <span className="font-bold text-[#050505]">
            Prem Mobile Gwalior • Direct Store Catalog
          </span>
        </div>

      </div>
    </div>
  );
}
