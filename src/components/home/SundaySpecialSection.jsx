import React from 'react';
import { Link } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import { openGeneralWhatsApp } from '../../utils/whatsapp';
import { Flame, MessageCircle, ArrowRight, Sparkles, Clock } from 'lucide-react';

export default function SundaySpecialSection() {
  return (
    <section className="py-12 sm:py-16 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl sm:rounded-4xl bg-gradient-to-br from-[#111111] via-[#050505] to-[#1a1100] border-2 border-[#FFD400]/60 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Flame Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD400]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E31B23]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E31B23] text-white font-black text-xs uppercase tracking-wider shadow-md">
                <Flame className="w-4 h-4 fill-white" />
                <span>LIMITED TIME OFFERS</span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
                SUNDAY SPECIAL <br />
                <span className="text-[#FFD400]">SALE DHAMAKA</span>
              </h2>

              <p className="text-base sm:text-lg font-black text-[#FFD400]">
                “{storeConfig.tagline}”
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Get unbelievable discounts on smartphones, high-bass boAt earbuds, heavy-duty 20000mAh power banks, GaN fast chargers, and tempered glass accessories every Sunday at Prem Mobile Pinto Park, Gwalior!
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => openGeneralWhatsApp('Sunday Special Sale Inquiry')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>ORDER ON WHATSAPP: {storeConfig.displayPhone}</span>
                </button>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#FFD400] shadow-2xl bg-black group">
                <img
                  src="/images/sunday-sale.jpg"
                  alt="Sunday Special Sale - Prem Mobile"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
