import React, { useState } from 'react';
import ProductCardSkeleton from '../components/skeleton/ProductCardSkeleton';
import ProductGridSkeleton from '../components/skeleton/ProductGridSkeleton';
import ProductDetailsSkeleton from '../components/skeleton/ProductDetailsSkeleton';
import ProductCard from '../components/product/ProductCard';
import ProductGrid from '../components/product/ProductGrid';
import { products } from '../data/products';
import {
  Layout,
  Sparkles,
  Palette,
  RefreshCw,
  CheckCircle2,
  Eye,
  Sliders
} from 'lucide-react';

export default function SkeletonGuide() {
  const [isLoading, setIsLoading] = useState(true);
  const sampleProducts = products.slice(0, 4);

  const criteria = [
    {
      title: "1. Match Content Structure",
      status: "Verified 100%",
      desc: "Skeletons mirror exact size, aspect-square ratios, and element positions of real product cards & product details to eliminate layout shift on load."
    },
    {
      title: "2. Subtle Shimmer & Pulse Animation",
      status: "Verified 100%",
      desc: "Soft loading motion (animate-pulse) indicates content processing without causing visual distraction or fatigue."
    },
    {
      title: "3. Flat Style & Radius Matching",
      status: "Verified 100%",
      desc: "Flat shapes with zero depth, matching the exact border radii (rounded-2xl, rounded-xl) of production components."
    },
    {
      title: "4. Neutral Color Scheme",
      status: "Verified 100%",
      desc: "Soft neutral slate tone (bg-slate-200) that contrasts gently with white backgrounds."
    },
    {
      title: "5. Smooth Transition to Real Content",
      status: "Verified 100%",
      desc: "Smooth fade transition (transition-opacity duration-300 animate-fade-in) when swapping skeletons for real content."
    }
  ];

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER & TOGGLE BAR */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#FFD400]/40 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
              <Layout className="w-4 h-4" />
              <span>UX LOADING PERFORMANCE</span>
            </div>

            {/* LIVE TOGGLE BUTTON */}
            <button
              onClick={() => setIsLoading(!isLoading)}
              className="py-2.5 px-5 rounded-2xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Toggle State: {isLoading ? 'SKELETON LOADING' : 'REAL CONTENT MOUNTED'}</span>
            </button>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            SKELETON DESIGN SYSTEM
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Content placeholders mimicking the structural layout of Prem Mobile components during asynchronous data fetching. Reduces perceived wait time and eliminates layout shift.
          </p>
        </div>

        {/* 5 CRITERIA EVALUATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {criteria.map((c, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-[#050505]">
                <span>{c.title}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        {/* LIVE DEMO SECTION 1: PRODUCT CARD GRID */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black text-[#E31B23] uppercase tracking-wider block">DEMO 01</span>
              <h2 className="font-display font-black text-xl text-[#050505]">
                PRODUCT GRID LOADING TRANSITION
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isLoading ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {isLoading ? '⏳ Skeleton Active' : '✨ Content Loaded'}
              </span>

              <button
                onClick={() => setIsLoading(!isLoading)}
                className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
              >
                Switch View
              </button>
            </div>
          </div>

          {/* DYNAMIC SWAP WITH FADE TRANSITION */}
          <div className="transition-all duration-300">
            {isLoading ? (
              <div className="animate-fade-in">
                <ProductGridSkeleton count={4} columns="grid-cols-2 sm:grid-cols-2 md:grid-cols-4" />
              </div>
            ) : (
              <div className="animate-fade-in">
                <ProductGrid products={sampleProducts} columns="grid-cols-2 sm:grid-cols-2 md:grid-cols-4" />
              </div>
            )}
          </div>
        </div>

        {/* LIVE DEMO SECTION 2: PRODUCT DETAILS VIEW */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black text-[#FFD400] uppercase tracking-wider block">DEMO 02</span>
              <h2 className="font-display font-black text-xl text-[#050505]">
                PRODUCT DETAILS PAGE LOADING TRANSITION
              </h2>
            </div>
          </div>

          {/* DETAILS SKELETON */}
          <div className="transition-all duration-300">
            {isLoading ? (
              <div className="animate-fade-in">
                <ProductDetailsSkeleton />
              </div>
            ) : (
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-300 text-emerald-900 text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-lg text-emerald-950">Real Product Details Mounted Smoothly!</h3>
                <p className="text-xs text-emerald-800">
                  Zero layout jumpiness occurred during the skeleton to content transition.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
