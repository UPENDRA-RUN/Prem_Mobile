import React from 'react';
import { Link } from 'react-router-dom';
import { promotionalBanners } from '../../data/promotions';
import { openGeneralWhatsApp } from '../../utils/whatsapp';
import { MessageCircle, ArrowRight, Flame, Pause, Sparkles } from 'lucide-react';

export default function PromotionalGrid() {
  // 5 active promo posters (excluding sunday-sale)
  const promoCards = promotionalBanners.filter((p) => p.id !== 'sunday-sale');

  // Double the array for seamless infinite marquee loop
  const marqueeItems = [...promoCards, ...promoCards];

  return (
    <section className="py-12 bg-[#0a0a0a] text-white border-y border-[#222222] overflow-hidden relative">
      
      {/* SECTION HEADER */}
      <div className="max-w-[1500px] mx-auto px-3.5 sm:px-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e51b23]/20 text-[#e51b23] text-[11px] font-black uppercase tracking-wider mb-1">
              <Flame className="w-3 h-3 fill-[#e51b23]" />
              <span>OFFICIAL STORE PROMOTIONS</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="font-display font-black text-2xl sm:text-[28px] text-white tracking-tight">
                DEALS & OFFERS
              </h2>
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-[#ffd000] border border-[#ffd000]/30 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd000] animate-ping" />
                <span>Auto-Running • Hover to Pause</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Direct promotional deals from Prem Mobile store in Pinto Park, Gwalior.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/offers"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-black text-[#ffd000] hover:underline"
            >
              <span>VIEW ALL OFFERS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* CONTINUOUS LEFT-TO-RIGHT MARQUEE TRACK */}
      <div className="relative w-full overflow-hidden group">
        
        {/* Subtle Edge Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        {/* Moving Track: translates from -50% to 0% (Left to Right motion) */}
        <div className="animate-marquee-ltr flex gap-4 sm:gap-6 px-4 py-2">
          {marqueeItems.map((promo, index) => (
            <div
              key={`${promo.id}-${index}`}
              className="w-[260px] min-[380px]:w-[300px] sm:w-[330px] md:w-[360px] shrink-0 bg-[#111111] rounded-2xl border border-[#333333] hover:border-[#ffd000] overflow-hidden shadow-xl hover:shadow-yellow-glow transition-all duration-300 flex flex-col justify-between group/card hover:-translate-y-1"
            >
              {/* Full Promotional Image */}
              <div className="relative aspect-[9/13] w-full overflow-hidden bg-black flex items-center justify-center p-2">
                <img
                  src={promo.image}
                  alt={promo.title}
                  loading="lazy"
                  className="w-full h-full object-contain rounded-xl group-hover/card:scale-103 transition-transform duration-500"
                />

                {/* Badge */}
                <div className="absolute top-4 left-4 bg-[#e51b23] text-white font-black text-[11px] px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                  {promo.badge}
                </div>
              </div>

              {/* Card Meta & Action */}
              <div className="p-4 space-y-3 bg-[#111111] border-t border-[#222222]">
                <div>
                  <h3 className="font-display font-black text-base text-white group-hover/card:text-[#ffd000] transition-colors leading-snug line-clamp-1">
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
