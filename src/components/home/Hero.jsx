import React from 'react';
import { Link } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import {
  ArrowRight,
  MapPin,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function Hero() {
  return (
    <section className="relative pt-3 pb-8 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Rounded Hero Container */}
        <div className="relative rounded-3xl sm:rounded-4xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 text-white overflow-hidden shadow-2xl p-6 sm:p-10 lg:p-14 border border-brand-500/30">
          
          {/* Subtle Decorative Circles & Grid Background */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-brand-900/60 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left z-10">
              
              {/* Brand Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-brand-100 text-xs font-bold tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>PREM MOBILE • PINTO PARK, GWALIOR</span>
              </div>

              {/* Main Heading - Official Store Tagline */}
              <div className="space-y-2">
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                  “Deal Aise Jo <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-sky-200">
                    Deewana Bana De
                  </span>”
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-brand-100/90 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Explore smartphones, electronics, high-fidelity earbuds, smartwatches, fast chargers, and premium mobile accessories at Prem Mobile.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white text-brand-700 font-bold text-sm sm:text-base hover:bg-brand-50 shadow-xl shadow-black/10 hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#store-location"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm sm:text-base border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-brand-300" />
                  <span>Visit Store in Gwalior</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 border-t border-white/15 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">100% Genuine</p>
                    <p className="text-[10px] text-brand-200">Brand Sealed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">Best Deals</p>
                    <p className="text-[10px] text-brand-200">Local Gwalior Rates</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-sky-300" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">Fast Service</p>
                    <p className="text-[10px] text-brand-200">Instant Enquiry</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Product Showcase & Floating Cards */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Product Visual Centerpiece */}
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-square rounded-3xl bg-white/10 backdrop-blur-md p-4 border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80"
                  alt="Prem Mobile Electronics Collection"
                  className="w-full h-full object-cover rounded-2xl animate-float shadow-inner"
                />

                {/* Floating Tag 1 - Top Left */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-navy-900 px-3 py-1.5 rounded-xl shadow-lg border border-white/50 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold">5G Ready Smartphones</span>
                </div>

                {/* Floating Tag 2 - Bottom Right */}
                <div className="absolute bottom-4 right-4 bg-brand-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-xl border border-brand-700/60 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-200 uppercase font-bold tracking-wider">Prem Mobile Special</p>
                    <p className="text-xs font-extrabold text-white">Up to 60% OFF Deals</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
