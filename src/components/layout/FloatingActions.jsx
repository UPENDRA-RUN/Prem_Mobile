import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { storeConfig } from '../../config/store';
import { openGeneralWhatsApp } from '../../utils/whatsapp';

export default function FloatingActions() {
  return (
    <>
      {/* Bottom Left: Call Store Quick Action */}
      <div className="fixed bottom-4 left-3 z-30 sm:bottom-6 sm:left-6">
        <a
          href={`tel:${storeConfig.phone}`}
          className="group relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#E31B23] hover:bg-[#cc141c] text-white shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white"
          aria-label="Call Store"
        >
          <Phone className="w-5 h-5 fill-white" />
          <span className="absolute left-full ml-2.5 px-3 py-1.5 rounded-xl bg-black text-[#FFD400] text-xs font-black uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-[#FFD400]/40 hidden sm:block">
            Call: {storeConfig.displayPhone}
          </span>
        </a>
      </div>

      {/* Bottom Right: WhatsApp Order Quick Action */}
      <div className="fixed bottom-4 right-3 z-30 sm:bottom-6 sm:right-6">
        <button
          onClick={() => openGeneralWhatsApp('Floating WhatsApp Chat')}
          className="group relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white" />
          <span className="absolute right-full mr-2.5 px-3 py-1.5 rounded-xl bg-black text-[#FFD400] text-xs font-black uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-[#FFD400]/40 hidden sm:block">
            Order on WhatsApp
          </span>
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#FFD400] rounded-full border-2 border-black" />
        </button>
      </div>
    </>
  );
}
