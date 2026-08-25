import React from 'react';
import { Link } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import { openGeneralWhatsApp } from '../../utils/whatsapp';
import { ArrowRight, Flame, MessageCircle, Sparkles } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="py-8 sm:py-12 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container */}
        <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden border-2 border-[#FFD400]/40 shadow-2xl bg-black group">
          
          <div className="relative aspect-[16/8] sm:aspect-[21/9] md:aspect-[24/9] w-full flex items-center justify-center overflow-hidden">
            <img
              src="/images/sunday-sale.jpg"
              alt="Sunday Special Sale - Prem Mobile Gwalior"
              className="w-full h-full object-cover sm:object-contain group-hover:scale-102 transition-transform duration-700"
            />
            
            {/* Subtle Gradient & Hover Buttons Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white font-black text-xs uppercase tracking-wider mb-1 shadow-sm">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>SUNDAY DHAMAKA</span>
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white tracking-tight">
                    Sunday Special Sale at Pinto Park
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FFD400] font-bold">
                    “{storeConfig.tagline}”
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/shop"
                    className="px-6 py-3 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <span>SHOP NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => openGeneralWhatsApp('Sunday Special Sale Inquiry')}
                    className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span className="hidden sm:inline">ORDER ON WHATSAPP</span>
                    <span className="sm:hidden">WHATSAPP</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
