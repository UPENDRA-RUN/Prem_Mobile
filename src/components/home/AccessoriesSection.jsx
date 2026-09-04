import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchLaravelProducts } from '../../api/laravel';
import ProductGrid from '../product/ProductGrid';
import { Shield, Zap, Cable, BatteryCharging, ArrowRight } from 'lucide-react';

export default function AccessoriesSection() {
  const accessoryCategories = [
    { label: 'All Accessories', filter: 'all' },
    { label: 'Chargers', filter: 'Chargers' },
    { label: 'Power Banks', filter: 'Power Banks' },
    { label: 'Covers & Cases', filter: 'Mobile Covers' },
    { label: 'Data Cables', filter: 'Data Cables' },
    { label: 'Holders & Mounts', filter: 'Mobile Holders' }
  ];

  const [activeFilter, setActiveFilter] = useState('all');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchLaravelProducts().then(res => {
      if (res.success) setProducts(res.data || []);
    });
  }, []);

  const accessoryProducts = products.filter((p) =>
    ['Chargers', 'Power Banks', 'Mobile Covers', 'Data Cables', 'Mobile Accessories', 'Mobile Holders'].includes(p.category)
  );

  const filteredProducts = activeFilter === 'all'
    ? accessoryProducts.slice(0, 8)
    : accessoryProducts.filter(p => p.category === activeFilter).slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-blue-50/60 border-y border-blue-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-brand-600" />
              <span>Premium Protection & Power</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-navy-900 tracking-tight">
              Mobile Accessories & Power
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top quality fast chargers, 20000mAh power banks, shockproof cases and unbreakable cables.
            </p>
          </div>

          <Link
            to="/shop?category=Mobile%20Accessories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-800 hover:underline transition-all"
          >
            <span>View All Accessories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4">
          {accessoryCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFilter(cat.filter)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === cat.filter
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25 scale-102'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:bg-brand-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="mt-4">
          <ProductGrid products={filteredProducts} />
        </div>

      </div>
    </section>
  );
}
