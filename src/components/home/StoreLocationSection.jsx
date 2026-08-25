import React from 'react';
import { storeConfig } from '../../config/store';
import { MapPin, Phone, Clock, Navigation, MessageCircle, ExternalLink } from 'lucide-react';
import { openGeneralWhatsApp } from '../../utils/whatsapp';

export default function StoreLocationSection() {
  return (
    <section id="store-location" className="py-12 bg-[#050505] text-white">
      <div className="max-w-[1500px] mx-auto px-6">
        
        <div className="rounded-3xl bg-[#0a0a0a] text-white overflow-hidden shadow-2xl border-2 border-[#ffd000]/40">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Info Panel */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd000]/15 text-[#ffd000] text-xs font-black uppercase tracking-wider border border-[#ffd000]/30">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>LOCAL STORE IN GWALIOR</span>
                </div>

                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
                  VISIT PREM MOBILE
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Looking for smartphones, boAt bassheads, power banks, fast chargers, egg boilers, or protective covers? Visit our store at Pinto Park, Gwalior! <strong className="text-[#ffd000]">“{storeConfig.tagline}”</strong>.
                </p>

                {/* Details List */}
                <div className="space-y-3.5 pt-2 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#111111] text-[#ffd000] border border-[#ffd000]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block font-bold">Address:</strong>
                      <span>{storeConfig.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#111111] text-[#ffd000] border border-[#ffd000]/40 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block font-bold">Phone:</strong>
                      <a href={`tel:${storeConfig.phone}`} className="hover:text-[#ffd000] font-black text-white text-base">
                        {storeConfig.displayPhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#111111] text-[#ffd000] border border-[#ffd000]/40 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block font-bold">Timings:</strong>
                      <span>{storeConfig.timing}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Three Yellow Buttons on Black Background */}
              <div className="pt-4 flex flex-wrap gap-3">
                
                {/* 1. CALL NOW */}
                <a
                  href={`tel:${storeConfig.phone}`}
                  className="px-6 py-3.5 rounded-lg bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Phone className="w-4 h-4" />
                  <span>CALL NOW</span>
                </a>

                {/* 2. WHATSAPP */}
                <button
                  onClick={() => openGeneralWhatsApp('Store Location & Enquiry')}
                  className="px-6 py-3.5 rounded-lg bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 fill-black text-[#ffd000]" />
                  <span>WHATSAPP</span>
                </button>

                {/* 3. GET DIRECTIONS */}
                <a
                  href={storeConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-lg bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Navigation className="w-4 h-4 fill-black" />
                  <span>GET DIRECTIONS</span>
                </a>

              </div>

            </div>

            {/* Right Map Embed */}
            <div className="lg:col-span-6 min-h-[360px] relative bg-slate-900 border-t lg:border-t-0 lg:border-l border-[#222222]">
              <iframe
                title="Prem Mobile Location Gwalior Map"
                src={storeConfig.embedMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
