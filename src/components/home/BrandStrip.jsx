import React from 'react';
import { Link } from 'react-router-dom';
import { demoBrands } from '../../data/offers';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function BrandStrip() {
  return (
    <section className="py-6 bg-slate-100/70 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-500">
              Popular Tech Brands Available in Store
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            *Demo brand filters for catalogue browsing
          </span>
        </div>

        {/* Brand Pills Carousel/Scroll */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar pb-2 pt-1">
          {demoBrands.map((brand, idx) => (
            <Link
              key={idx}
              to={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="flex-shrink-0 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-brand-500 hover:shadow-md hover:bg-brand-50 transition-all duration-200 flex items-center gap-2 group"
            >
              <span className="font-display font-black text-xs sm:text-sm text-navy-900 tracking-wider group-hover:text-brand-600 transition-colors">
                {brand.logoText}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 group-hover:bg-brand-100 group-hover:text-brand-700">
                {brand.count}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
