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
              className="relative w-full rounded-2xl overflow-hidden border-2 border-[#ffd000] shadow-lg group block transition-transform active:scale-[0.99] bg-black"
            >
              <img
                src="/images/sunday-shocking-sale.jpg"
                alt="Sunday Shocking Sale - Prem Mobile Gwalior"
                className="w-full h-auto max-h-[220px] object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DESKTOP LAYOUT (>= 1024px): 6 CARDS + SIDEBAR BANNER */}
        {/* ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-stretch">
          
          {/* 6 Product Cards in 3x2 or 6-col grid */}
          <div className="lg:col-span-9 grid grid-cols-3 gap-4">
            {featuredSix.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Sunday Special Sale Sidebar Banner Card */}
          <div className="lg:col-span-3 flex flex-col">
            <Link
              to="/sunday-sale"
              className="relative w-full h-full min-h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#ffd000]/70 shadow-lg group block transition-transform hover:scale-[1.02] bg-black"
            >
              <img
                src="/images/sunday-shocking-sale.jpg"
                alt="Sunday Shocking Sale - Prem Mobile Gwalior"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
