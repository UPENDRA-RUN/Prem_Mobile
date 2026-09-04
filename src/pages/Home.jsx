import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/home/HeroSlider';
import CategoryBar from '../components/home/CategoryBar';
import FeaturedSection from '../components/home/FeaturedSection';
import PromoBanner from '../components/home/PromoBanner';
import PromotionalGrid from '../components/home/PromotionalGrid';
import SundaySpecialSection from '../components/home/SundaySpecialSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import StoreLocationSection from '../components/home/StoreLocationSection';
import ProductGrid from '../components/product/ProductGrid';
import { fetchLaravelProducts } from '../api/laravel';
import { useRealtimeSync } from '../hooks/useRealtimeSync';
import { storeConfig } from '../config/store';
import { openGeneralWhatsApp } from '../utils/whatsapp';
import { Flame, ArrowRight, Sparkles, Smartphone, ShieldCheck, Headphones, Watch, BatteryCharging } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(() => {
    fetchLaravelProducts().then(res => {
      if (res.success) {
        setProducts(res.data || []);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useRealtimeSync(loadProducts, ['PRODUCTS_UPDATED'], 3000);

  // 1. On Sale & Hot Deals Products
  const onSaleProducts = products.filter((p) => p.isOnSale || p.discount > 0 || p.isSundaySale).slice(0, 8);

  // 2. Best Sellers
  const bestSellers = products.filter((p) => p.isBestSeller || p.rating >= 4.7).slice(0, 8);

  // 3. New Arrivals
  const newArrivals = products.filter((p) => p.isNew || (p.isNew === undefined && p.id <= 8)).slice(0, 8);

  // 4. Mobile Accessories (Earbuds, Chargers, Power Banks, Cables, Covers)
  const mobileAccessories = products.filter(
    (p) => ['Earbuds', 'Chargers', 'Power Banks', 'Cables', 'Mobile Covers', 'Headphones'].includes(p.category)
  ).slice(0, 8);

  // 5. Popular Gadgets (Smartwatches, Speakers, Gadgets)
  const popularGadgets = products.filter(
    (p) => ['Smartwatches', 'Speakers', 'Gadgets'].includes(p.category) || p.rating >= 4.6
  ).slice(0, 8);

  return (
    <div className="bg-[#f5f5f5] text-[#050505] min-h-screen">
      
      {/* 1. BLACK / GOLD HERO SECTION */}
      <HeroSlider />

      {/* 2. WHITE CATEGORY BAR (12 ITEMS) */}
      <CategoryBar />

      {/* 3. FEATURED PRODUCTS + SUNDAY SALE SIDEBAR */}
      <FeaturedSection products={products} />

      {/* 4. ON SALE & HOT DEALS (If products are marked on sale) */}
      {onSaleProducts.length > 0 && (
        <section className="py-10 bg-gradient-to-r from-red-50 via-amber-50 to-red-50 border-y border-red-200">
          <div className="max-w-[1500px] mx-auto px-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-[11px] font-black uppercase tracking-wider mb-1 shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>SPECIAL OFFER DEALS</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-[26px] text-slate-900 tracking-tight">
                  🔥 ON SALE & HOT DEALS
                </h2>
              </div>

              <Link
                to="/shop?sort=discount"
                className="px-4 py-2 rounded-lg bg-[#E31B23] hover:bg-[#c9141b] text-white font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                View All Deals
              </Link>
            </div>

            <ProductGrid products={onSaleProducts} columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4" />
          </div>
        </section>
      )}

      {/* 5. BEST SELLING PRODUCTS */}
      {bestSellers.length > 0 && (
        <section className="py-10 bg-white border-b border-[#dedede]">
          <div className="max-w-[1500px] mx-auto px-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFD400]/20 text-[#050505] text-[11px] font-black uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>CUSTOMER FAVORITES</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-[26px] text-[#050505] tracking-tight">
                  🏆 BEST SELLING PRODUCTS
                </h2>
              </div>

              <Link
                to="/shop?sort=bestsellers"
                className="px-4 py-2 rounded-lg bg-[#050505] hover:bg-[#1a1a1a] text-[#FFD400] font-black text-xs uppercase tracking-wider transition-colors"
              >
                Explore Best Sellers
              </Link>
            </div>

            <ProductGrid products={bestSellers} columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4" />
          </div>
        </section>
      )}

      {/* 4. NEW ARRIVALS */}
      <section className="py-10 bg-white border-y border-[#dedede]">
        <div className="max-w-[1500px] mx-auto px-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffd000]/20 text-[#050505] text-[11px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>FRESH STORE ARRIVALS</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-[26px] text-[#050505] tracking-tight">
                NEW ARRIVALS
              </h2>
            </div>

            <Link
              to="/shop?sort=newest"
              className="px-4 py-2 rounded-lg bg-[#050505] hover:bg-[#1a1a1a] text-[#ffd000] font-black text-xs uppercase tracking-wider transition-colors"
            >
              View All
            </Link>
          </div>

          <ProductGrid products={newArrivals} columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4" />
        </div>
      </section>

      {/* 5. MOBILE ACCESSORIES SECTION */}
      <section className="py-10 bg-[#f5f5f5]">
        <div className="max-w-[1500px] mx-auto px-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e51b23]/10 text-[#e51b23] text-[11px] font-black uppercase tracking-wider mb-1">
                <Headphones className="w-3 h-3 text-[#e51b23]" />
                <span>BEST ACCESSORIES</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-[26px] text-[#050505] tracking-tight">
                MOBILE ACCESSORIES
              </h2>
            </div>

            <Link
              to="/shop?category=Accessories"
              className="px-4 py-2 rounded-lg bg-[#050505] hover:bg-[#1a1a1a] text-[#ffd000] font-black text-xs uppercase tracking-wider transition-colors"
            >
              Explore Accessories
            </Link>
          </div>

          <ProductGrid products={mobileAccessories} columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4" />
        </div>
      </section>

      {/* 6. DEALS & OFFERS (PROMOTIONAL CARD GRID - 3 COLUMNS) */}
      <PromotionalGrid />

      {/* 7. POPULAR GADGETS */}
      <section className="py-10 bg-white border-y border-[#dedede]">
        <div className="max-w-[1500px] mx-auto px-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffd000]/20 text-[#050505] text-[11px] font-black uppercase tracking-wider mb-1">
                <Watch className="w-3 h-3 text-amber-500" />
                <span>TRENDING SMART TECH</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-[26px] text-[#050505] tracking-tight">
                POPULAR GADGETS
              </h2>
            </div>

            <Link
              to="/shop?category=Gadgets"
              className="px-4 py-2 rounded-lg bg-[#050505] hover:bg-[#1a1a1a] text-[#ffd000] font-black text-xs uppercase tracking-wider transition-colors"
            >
              View Gadgets
            </Link>
          </div>

          <ProductGrid products={popularGadgets} columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4" />
        </div>
      </section>

      {/* 8. SUNDAY SPECIAL SALE SECTION */}
      <SundaySpecialSection />

      {/* 9. ABOUT PREM MOBILE SECTION */}
      <section className="py-12 bg-[#050505] text-white border-t border-[#222222]">
        <div className="max-w-[1500px] mx-auto px-6">
          <div className="rounded-3xl bg-[#0a0a0a] border-2 border-[#ffd000]/40 p-6 sm:p-10 lg:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Photo */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full border-4 border-[#ffd000] overflow-hidden shadow-[0_0_35px_rgba(255,208,0,0.35)] bg-black group flex items-center justify-center">
                  <img
                    src="/images/prem-main.jpg"
                    alt="About Prem Mobile Gwalior"
                    className="w-full h-full object-cover scale-[1.28] group-hover:scale-[1.34] transition-transform duration-500"
                  />
                  {/* Subtle inner gold border overlay */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#ffd000]/30 pointer-events-none" />
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e51b23] text-white text-xs font-black uppercase tracking-wider">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>LOCAL ELECTRONICS DESTINATION</span>
                </div>

                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
                  ABOUT PREM MOBILE
                </h2>

                <p className="text-lg font-black text-[#ffd000]">
                  “{storeConfig.tagline}”
                </p>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Prem Mobile is a local mobile and electronics store in Gwalior, offering mobiles, accessories, gadgets and everyday electronics. Located at Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.), we bring you genuine tech products at unbeatable store prices.
                </p>

                <div className="pt-2 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link
                    to="/about"
                    className="px-6 py-3 rounded-lg bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                  >
                    <span>KNOW MORE</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => openGeneralWhatsApp('About Prem Mobile Enquiry')}
                    className="px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                  >
                    <span>CONNECT ON WHATSAPP</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 10. WHY PREM MOBILE */}
      <WhyChooseUs />

      {/* 11. STORE LOCATION SECTION */}
      <StoreLocationSection />

    </div>
  );
}
