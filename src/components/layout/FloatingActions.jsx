import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { storeConfig } from '../../config/store';
import { openGeneralWhatsApp } from '../../utils/whatsapp';

export default function FloatingActions() {
  return (
    <>
      {/* Bottom Left: Call Now */}
      <div className="fixed bottom-6 left-4 z-40 sm:bottom-8 sm:left-6">
        <a
          href={`tel:${storeConfig.phone}`}
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E31B23] hover:bg-[#cc141c] text-white shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white"
          aria-label="Call Store"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          <span className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-black text-[#FFD400] text-xs font-black uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-[#FFD400]/40 hidden sm:block">
            Call: {storeConfig.displayPhone}
          </span>
        </a>
      </div>

      {/* Bottom Right: WhatsApp Order */}
      <div className="fixed bottom-6 right-4 z-40 sm:bottom-8 sm:right-6">
        <button
          onClick={() => openGeneralWhatsApp('Floating WhatsApp Chat')}
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white animate-pulse"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white" />
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-black text-[#FFD400] text-xs font-black uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-[#FFD400]/40 hidden sm:block">
            Order on WhatsApp
          </span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FFD400] rounded-full border-2 border-black" />
        </button>
      </div>
    </>
  );
}
