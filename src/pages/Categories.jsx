import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { ArrowRight, Flame, Layers } from 'lucide-react';
import { storeConfig } from '../config/store';

export default function Categories() {
  return (
    <div className="py-8 sm:py-12 bg-[#f5f5f5] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-6 space-y-10">
        
        {/* Banner Header */}
        <div className="rounded-3xl bg-[#050505] text-white p-6 sm:p-10 shadow-xl border-2 border-[#ffd000]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e51b23] text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>EXPLORE BY CATEGORY</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
              ALL PRODUCT CATEGORIES
            </h1>
            <p className="text-xs sm:text-sm text-[#ffd000] font-bold">
              “{storeConfig.tagline}”
            </p>
          </div>
          <Link
            to="/shop"
            className="px-6 py-3 rounded-lg bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
          >
            <span>VIEW ENTIRE STORE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 12 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.slug === 'view-all' ? '/shop' : `/categories/${encodeURIComponent(cat.name.toLowerCase().replace(/\s+/g, '-'))}`}
              className="group bg-white rounded-2xl p-4 border border-[#dedede] hover:border-[#ffd000] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center justify-between hover:-translate-y-1"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-[#f4f4f4] border-2 border-slate-200 group-hover:border-[#ffd000] overflow-hidden flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full mix-blend-multiply"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-black text-xs sm:text-sm text-[#050505] group-hover:text-[#e51b23] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-bold text-slate-400 block">
                  {cat.itemCount}
                </span>
              </div>

              <div className="mt-3 w-full py-1.5 rounded-lg bg-slate-100 group-hover:bg-[#ffd000] text-[#050505] font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1">
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
