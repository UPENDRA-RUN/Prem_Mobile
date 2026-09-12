import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { ArrowRight, Flame, Layers } from 'lucide-react';
import { storeConfig } from '../config/store';

export default function Categories() {
  return (
    <div className="py-8 sm:py-12 bg-[#f5f5f5] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-3.5 sm:px-6 space-y-8 sm:space-y-10">
        
        {/* Banner Header */}
        <div className="rounded-3xl bg-[#050505] text-white p-4 sm:p-10 shadow-xl border-2 border-[#ffd000]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e51b23] text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>EXPLORE BY CATEGORY</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
              ALL PRODUCT CATEGORIES
            </h1>
            <p className="text-xs sm:text-sm text-[#ffd000] font-bold">
              “{storeConfig.tagline}”
            </p>
          </div>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 text-center"
          >
            <span>VIEW ENTIRE STORE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 12 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
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

        {/* SEO RICH CONTENT & CATEGORY BUYING GUIDE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 mt-12">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-black text-[#e51b23] uppercase tracking-wider block mb-1">
              PREM MOBILE GWALIOR — PRODUCT CATEGORIES & SHOPPING GUIDE
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#050505]">
              Explore Original Electronics & Accessories in Gwalior
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-4xl">
              Welcome to the official category index of Prem Mobile located at Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.). We offer a comprehensive selection of 100% genuine smartphones, wireless earbuds, fast chargers, power banks, smartwatch bands, and daily household electronics backed by authentic manufacturer warranty and store-level customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-display font-black text-base text-[#050505] flex items-center gap-2">
                <span>📱 Smartphones & Mobiles</span>
              </h3>
              <p>
                Browse top mobile brands including Samsung, Xiaomi, Realme, OnePlus, Vivo, Oppo, and Apple iPhone. Whether you are looking for high-performance 5G smartphones, gaming devices, or budget-friendly keypad phones, Prem Mobile delivers unbeatable offline pricing and live store demonstrations.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-display font-black text-base text-[#050505] flex items-center gap-2">
                <span>🎧 Audio & Wireless Earbuds</span>
              </h3>
              <p>
                Experience crystal clear sound with boAt Bassheads, Airdopes, Noise, Realme Buds, and JBL bluetooth neckbands. We provide live sound testing at our store so you can verify bass output, mic quality, noise cancellation, and battery performance before making your purchase.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-display font-black text-base text-[#050505] flex items-center gap-2">
                <span>⚡ Fast Chargers & Power Banks</span>
              </h3>
              <p>
                Keep your devices powered all day with 25W Type-C fast chargers, 65W GaN adapter bricks, heavy-duty braided cables, and 10,000mAh to 20,000mAh power banks. All charging equipment meets safety certifications to protect phone battery health.
              </p>
            </div>
          </div>

          <div className="bg-[#050505] text-white rounded-2xl p-6 border-2 border-[#ffd000]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-black text-base text-white">Need Personal Advice or Instant Stock Check?</h4>
              <p className="text-xs text-slate-300 mt-1">Visit our Pinto Park store in Gwalior or send a quick message on WhatsApp for instant price quotes.</p>
            </div>
            <a
              href="https://wa.me/919893947477?text=Hi%20Prem%20Mobile%2C%20I%20want%20to%20inquire%20about%20product%20categories"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shrink-0 transition-transform hover:scale-105"
            >
              WhatsApp Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
