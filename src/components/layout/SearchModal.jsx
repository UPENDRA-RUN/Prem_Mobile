import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Tag, Smartphone } from 'lucide-react';
import { products } from '../../data/products';
import { categories } from '../../data/categories';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const query = searchTerm.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    ).slice(0, 6);

    setResults(filtered);
  }, [searchTerm]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && searchTerm.trim()) {
      onClose();
      navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-2xl transform rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden transition-all">
        {/* Input Bar */}
        <div className="relative flex items-center p-4 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-brand-600 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search phones, earbuds, chargers, covers, brands..."
            className="w-full bg-transparent border-0 py-2.5 pl-3 pr-10 text-navy-900 placeholder-slate-400 focus:outline-none text-base"
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-slate-400 hover:text-navy-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-navy-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4">
          {searchTerm.trim() ? (
            results.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                  <span>Found {results.length} Products</span>
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
                    }}
                    className="text-brand-600 hover:underline flex items-center gap-1 normal-case font-semibold"
                  >
                    <span>View all results</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid gap-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-brand-50/60 transition-all border border-transparent hover:border-brand-200"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover bg-white p-1 border border-slate-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-brand-600 uppercase">
                            {product.brand}
                          </span>
                          <span className="text-[10px] text-slate-400">• {product.category}</span>
                        </div>
                        <p className="text-sm font-semibold text-navy-900 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-bold text-brand-700">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.2 rounded">
                            {product.discount}% OFF
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-base font-semibold text-navy-900">No products found for "{searchTerm}"</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for "earbuds", "realme", "charger", or "boAt"
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4 py-2">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                  Popular Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onClose();
                        navigate(`/shop?category=${cat.name}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Tag className="w-3 h-3 text-brand-500" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['5G Smartphones', 'boAt Earbuds', '65W Fast Charger', 'Smartwatches', 'Back Covers', 'JBL Speakers'].map(
                    (term, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onClose();
                          navigate(`/shop?q=${encodeURIComponent(term)}`);
                        }}
                        className="px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600 hover:border-brand-500 hover:text-brand-600 transition-colors"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 px-4">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">ESC</kbd> to close</span>
          <span>Prem Mobile Gwalior</span>
        </div>
      </div>
    </div>
  );
}
