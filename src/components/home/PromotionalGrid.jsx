import React from 'react';
import { Link } from 'react-router-dom';
import { promotionalBanners } from '../../data/promotions';
import { storeConfig } from '../../config/store';
import { openGeneralWhatsApp } from '../../utils/whatsapp';
import { MessageCircle, ArrowRight, Flame } from 'lucide-react';

export default function PromotionalGrid() {
  // 3-column promo posters
  const promoCards = promotionalBanners.filter((p) => p.id !== 'sunday-sale').slice(0, 6);

  return (
    <section className="py-12 bg-[#0a0a0a] text-white border-y border-[#222222]">
      <div className="max-w-[1500px] mx-auto px-6 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e51b23]/20 text-[#e51b23] text-[11px] font-black uppercase tracking-wider mb-1">
              <Flame className="w-3 h-3 fill-[#e51b23]" />
              <span>OFFICIAL STORE PROMOTIONS</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-[28px] text-white tracking-tight">
              DEALS & OFFERS
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Direct promotional deals from Prem Mobile store in Pinto Park, Gwalior.
            </p>
          </div>

          <Link
            to="/offers"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-black text-[#ffd000] hover:underline"
          >
            <span>VIEW ALL OFFERS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3-Column Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoCards.map((promo) => (
            <div
              key={promo.id}
              className="group bg-[#111111] rounded-2xl border border-[#333333] hover:border-[#ffd000] overflow-hidden shadow-xl hover:shadow-yellow-glow transition-all duration-300 flex flex-col justify-between"
            >
              {/* Full Promotional Image */}
              <div className="relative aspect-[9/13] w-full overflow-hidden bg-black flex items-center justify-center p-2">
                <img
                  src={promo.image}
                  alt={promo.title}
                  loading="lazy"
                  className="w-full h-full object-contain rounded-xl group-hover:scale-103 transition-transform duration-500"
                />

                {/* Badge */}
                <div className="absolute top-4 left-4 bg-[#e51b23] text-white font-black text-[11px] px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                  {promo.badge}
                </div>
              </div>

              {/* Card Meta & Action */}
              <div className="p-4 space-y-3 bg-[#111111] border-t border-[#222222]">
                <div>
                  <h3 className="font-display font-black text-base text-white group-hover:text-[#ffd000] transition-colors leading-snug">
                    {promo.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                    {promo.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#222222]">
                  <Link
                    to={promo.actionLink}
                    className="py-2 px-2 rounded-lg bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center text-center transition-colors"
                  >
                    <span>{promo.actionText}</span>
                  </Link>

                  <button
                    onClick={() => openGeneralWhatsApp(promo.whatsappTopic)}
                    className="py-2 px-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors"
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
    </section>
  );
}
