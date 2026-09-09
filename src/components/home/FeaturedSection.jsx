import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard';

export default function FeaturedSection({ products = [] }) {
  // Take the first 6 products
  const featuredSix = products.slice(0, 6);

  return (
    <section className="pt-6 sm:pt-8 pb-8 sm:pb-10 bg-[#f5f5f5]">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-6 space-y-4 sm:space-y-6">
        
        {/* SECTION HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-xl sm:text-[26px] text-[#050505] tracking-tight flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span>FEATURED PRODUCTS</span>
          </h2>

          <Link
            to="/shop"
            className="px-3.5 py-1.5 rounded-full bg-[#050505] hover:bg-[#1a1a1a] text-[#ffd000] font-black text-xs uppercase tracking-wider transition-colors shadow-xs shrink-0"
          >
            View All
          </Link>
        </div>

        {/* ========================================================= */}
        {/* 1. MOBILE LAYOUT (< 1024px): 2-COLUMN GRID + FULL WIDTH BANNER */}
        {/* ========================================================= */}
        <div className="lg:hidden space-y-4">
          {/* 6 Products in Clean 2-Column Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            {featuredSix.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Full-Width Mobile Sunday Sale Banner */}
          <div className="pt-2">
            <Link
              to="/sunday-sale"
              className="relative w-full rounded-2xl overflow-hidden border-2 border-[#ffd000] shadow-lg group block bg-black p-2"
            >
              <img
                src="/images/sunday-shocking-sale.jpg"
                alt="Sunday Shocking Sale - Prem Mobile Gwalior"
                className="w-full h-auto max-h-[280px] object-contain object-center transform-gpu backface-hidden [image-rendering:-webkit-optimize-contrast] mx-auto"
              />
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DESKTOP LAYOUT (>= 1024px): 6 CARDS + SIDEBAR BANNER */}
        {/* ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-start">
          
          {/* 6 Product Cards in 3x2 or 6-col grid */}
          <div className="lg:col-span-9 grid grid-cols-3 gap-4">
            {featuredSix.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Sunday Special Sale Sidebar Banner Card */}
          <div className="lg:col-span-3 sticky top-24">
            <Link
              to="/sunday-sale"
              className="relative w-full rounded-3xl overflow-hidden border-2 border-[#ffd000] shadow-xl group flex flex-col p-4 bg-gradient-to-b from-black via-[#0d0d0d] to-black hover:border-[#ffd000] transition-all space-y-3"
            >
              <div className="space-y-1 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white font-black text-[11px] uppercase tracking-wider shadow-sm">
                  🔥 SUNDAY DHAMAKA
                </span>
                <h4 className="font-display font-black text-base lg:text-lg text-white tracking-tight">
                  Sunday Special Sale
                </h4>
              </div>

              <div className="relative w-full aspect-[1024/895] overflow-hidden rounded-2xl bg-black/60 border border-white/10 p-1">
                <img
                  src="/images/sunday-shocking-sale.jpg"
                  alt="Sunday Shocking Sale - Prem Mobile Gwalior"
                  className="w-full h-full object-contain transform-gpu backface-hidden [image-rendering:-webkit-optimize-contrast]"
                />
              </div>

              <div className="w-full">
                <div className="w-full py-2.5 px-3 rounded-xl bg-[#ffd000] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md group-hover:bg-[#ffcb05] transition-colors">
                  <span>EXPLORE ALL DEALS</span>
                  <span className="text-sm font-bold">→</span>
                </div>
              </div>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
