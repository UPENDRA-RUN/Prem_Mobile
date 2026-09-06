import React from 'react';
import { storeConfig } from '../../config/store';
import { Layers, MessageSquareText, MapPin, Users, Flame } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    {
      icon: Layers,
      title: "Wide Tech Range",
      desc: "Mobiles, accessories, smart gadgets, power banks and everyday electronics."
    },
    {
      icon: MessageSquareText,
      title: "Instant Enquiry",
      desc: `Quick product enquiries and deal bookings via WhatsApp (${storeConfig.displayPhone}).`
    },
    {
      icon: MapPin,
      title: "Gwalior Store",
      desc: `Located at Pinto Park with live demo testing before you buy.`
    },
    {
      icon: Users,
      title: "Best In-Store Deal",
      desc: "Personal guidance to pick genuine electronics that fit your budget."
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-[#0a0a0a] text-white border-t border-[#222222]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 space-y-6 sm:space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFD400]/15 border border-[#FFD400]/40 text-[#FFD400] text-[10.5px] sm:text-xs font-black uppercase tracking-wider">
            <Flame className="w-3 h-3 fill-[#FFD400]" />
            <span>THE PREM MOBILE ADVANTAGE</span>
          </div>

          <h2 className="font-display font-black text-xl sm:text-3xl md:text-4xl text-white tracking-tight">
            WHY PREM MOBILE?
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            “<strong className="text-[#FFD400]">{storeConfig.tagline}</strong>”
          </p>
        </div>

        {/* Clean 2-column grid on mobile, 4-column on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="bg-[#111111] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-[#222222] hover:border-[#FFD400]/60 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#050505] text-[#FFD400] flex items-center justify-center border border-[#FFD400]/30 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-display font-black text-xs sm:text-base text-white group-hover:text-[#FFD400] transition-colors leading-snug">
                    {pt.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {pt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
