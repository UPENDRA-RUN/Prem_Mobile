import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { storeConfig } from '../config/store';
import { ArrowRight, Layers, Flame } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner */}
        <div className="rounded-3xl sm:rounded-4xl bg-[#050505] text-white p-6 sm:p-10 shadow-xl border-2 border-[#FFD400]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>EXPLORE BY CATEGORY</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
              ALL PRODUCT CATEGORIES
            </h1>
            <p className="text-xs sm:text-sm text-[#FFD400] font-bold">
              “{storeConfig.tagline}”
            </p>
          </div>
          <Link
            to="/shop"
            className="px-6 py-3 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
          >
            <span>VIEW ENTIRE STORE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.slug === 'view-all' ? '/shop' : `/shop?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-3xl p-4 border border-slate-200 hover:border-[#FFD400] shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center justify-between hover:-translate-y-1"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-slate-50 border-2 border-slate-200 group-hover:border-[#FFD400] overflow-hidden flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-black text-xs sm:text-sm text-[#050505] group-hover:text-[#E31B23] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-bold text-slate-400 block">
                  {cat.itemCount}
                </span>
              </div>

              <div className="mt-3 w-full py-1.5 rounded-xl bg-slate-100 group-hover:bg-[#FFD400] text-[#050505] font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1">
                <span>Browse</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
