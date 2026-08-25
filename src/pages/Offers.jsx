import React from 'react';
import { Link } from 'react-router-dom';
import { promotionalBanners } from '../data/promotions';
import { products } from '../data/products';
import { storeConfig } from '../config/store';
import ProductGrid from '../components/product/ProductGrid';
import { openGeneralWhatsApp } from '../utils/whatsapp';
import { Flame, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function Offers() {
  const hotDeals = products.filter((p) => p.discount >= 40);

  return (
    <div className="py-8 sm:py-12 bg-[#050505] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Banner */}
        <div className="rounded-3xl sm:rounded-4xl bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#111111] border-2 border-[#FFD400]/60 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>OFFICIAL STORE DEALS</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
              🔥 DEAL AISE JO <br />
              <span className="text-[#FFD400]">DEEWANA BANA DE</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300">
              Special deals and exciting products from Prem Mobile in Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.).
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => openGeneralWhatsApp('Claim Store Offer Campaign')}
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>ORDER ON WHATSAPP: {storeConfig.displayPhone}</span>
              </button>
              <Link
                to="/shop"
                className="px-5 py-3 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <span>BROWSE ALL PRODUCTS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Promotional Posters Grid */}
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              Featured Promotional Deals
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Direct official posters from Prem Mobile store
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionalBanners.map((promo) => (
              <div
                key={promo.id}
                className="group bg-[#111111] rounded-3xl border-2 border-[#222222] hover:border-[#FFD400] overflow-hidden shadow-xl hover:shadow-yellow-glow transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[9/13] w-full overflow-hidden bg-black flex items-center justify-center p-2">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-contain rounded-2xl group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#E31B23] text-white font-black text-[11px] px-3 py-1 rounded-full uppercase">
                    {promo.badge}
                  </div>
                </div>

                <div className="p-5 space-y-3 bg-[#111111] border-t border-[#222222]">
                  <h3 className="font-display font-black text-lg text-white group-hover:text-[#FFD400] transition-colors">
                    {promo.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {promo.subtitle}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#222222]">
                    <Link
                      to={promo.actionLink}
                      className="py-2.5 px-2 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider text-center"
                    >
                      <span>{promo.actionText}</span>
                    </Link>

                    <button
                      onClick={() => openGeneralWhatsApp(promo.whatsappTopic)}
                      className="py-2.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heavy Discount Products Section */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23]/20 border border-[#E31B23]/40 text-[#E31B23] text-xs font-black uppercase tracking-wider mb-1">
                <Flame className="w-3.5 h-3.5 fill-[#E31B23]" />
                <span>UP TO 70% OFF</span>
              </div>
              <h2 className="font-display font-black text-2xl text-white">
                Mega Discount Deals
              </h2>
            </div>
            <Link to="/shop" className="text-xs font-black text-[#FFD400] hover:underline">
              View All Products →
            </Link>
          </div>

          <ProductGrid products={hotDeals} />
        </div>

      </div>
    </div>
  );
}
