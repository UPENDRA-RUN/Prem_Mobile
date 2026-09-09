import React from 'react';
import { Link } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import { openGeneralWhatsApp } from '../../utils/whatsapp';
import { useSundaySale } from '../../context/SundaySaleContext';
import CountdownTimer from '../common/CountdownTimer';
import { Flame, MessageCircle, ArrowRight } from 'lucide-react';

export default function SundaySpecialSection() {
  const { isLive, sale } = useSundaySale();

  return (
    <section className="py-8 sm:py-14 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="rounded-2xl sm:rounded-4xl bg-gradient-to-br from-[#111111] via-[#050505] to-[#1a1100] border-2 border-[#FFD400]/70 p-4 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Flame Glow */}
          <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#FFD400]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-[#E31B23]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center z-10">
            
            {/* Content Column */}
            <div className="lg:col-span-6 space-y-3.5 sm:space-y-5 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>{isLive ? '🟢 SALE IS LIVE' : 'LIMITED TIME OFFERS'}</span>
                </span>
              </div>

              <h2 className="font-display font-black text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
                {isLive && sale?.name ? (
                  <span>{sale.name.toUpperCase()}</span>
                ) : (
                  <>
                    SUNDAY SPECIAL <br />
                    <span className="text-[#FFD400]">SALE DHAMAKA</span>
                  </>
                )}
              </h2>

              {isLive && sale?.endDate && (
                <div className="pt-1 flex justify-center lg:justify-start">
                  <CountdownTimer endDate={sale.endDate} endTime={sale.endTime} size="normal" dark />
                </div>
              )}

              <p className="text-sm sm:text-base font-black text-[#FFD400]">
                “{storeConfig.tagline}”
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Get unbelievable discounts on smartphones, high-bass boAt earbuds, heavy-duty 20000mAh power banks, GaN fast chargers, and accessories at Prem Mobile Pinto Park, Gwalior!
              </p>

              {/* Action Buttons: Full width on mobile */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 justify-center lg:justify-start">
                <Link
                  to="/sale"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FFD400] active:bg-[#e6be00] hover:bg-[#ffcb05] text-[#050505] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 text-center"
                >
                  <span>{isLive ? 'SHOP LIVE DEALS' : 'EXPLORE SUNDAY SALE'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <button
                  onClick={() => openGeneralWhatsApp('Sunday Special Sale Inquiry')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] active:bg-[#1faa4f] hover:bg-[#20ba5a] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>ORDER ON WHATSAPP</span>
                </button>
              </div>
            </div>

            {/* Visual Image Column */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#FFD400] shadow-2xl bg-black p-2 group">
                <img
                  src="/images/sunday-shocking-sale.jpg"
                  alt="Sunday Shocking Sale - Prem Mobile"
                  className="w-full h-full object-contain max-h-[360px] transform-gpu backface-hidden [image-rendering:-webkit-optimize-contrast] mx-auto"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
