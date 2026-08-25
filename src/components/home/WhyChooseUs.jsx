import React from 'react';
import { storeConfig } from '../../config/store';
import { Layers, MessageSquareText, MapPin, Sparkles, CheckCircle2, Flame, Award, Users } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    {
      icon: Layers,
      title: "Wide Product Range",
      desc: "Mobiles, accessories, smart gadgets, power solutions and everyday electronics all available in store."
    },
    {
      icon: MessageSquareText,
      title: "Easy Enquiry",
      desc: `Quick product enquiries and instant deal confirmations directly through WhatsApp (${storeConfig.displayPhone}).`
    },
    {
      icon: MapPin,
      title: "Local Store",
      desc: `Conveniently located in Gwalior at ${storeConfig.address} with live demo testing.`
    },
    {
      icon: Users,
      title: "Personal Assistance",
      desc: "Get dedicated in-store assistance choosing the exact products that fit your budget and lifestyle."
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#0a0a0a] text-white border-t border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD400]/15 border border-[#FFD400]/40 text-[#FFD400] text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-[#FFD400]" />
            <span>THE PREM MOBILE ADVANTAGE</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
            WHY PREM MOBILE?
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            “<strong className="text-[#FFD400]">{storeConfig.tagline}</strong>” • Gwalior's trusted destination for electronics.
          </p>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="bg-[#111111] rounded-3xl p-6 border-2 border-[#222222] hover:border-[#FFD400] hover:shadow-yellow-glow transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#050505] text-[#FFD400] flex items-center justify-center border border-[#FFD400]/40 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-base sm:text-lg text-white group-hover:text-[#FFD400] transition-colors">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
