import React, { useState, useEffect } from 'react';
import { storeConfig } from '../../config/store';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  MessageCircle,
  Share2,
  CheckCircle2,
  Sparkles,
  Car,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { openGeneralWhatsApp } from '../../utils/whatsapp';

export default function StoreLocationSection() {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentMinutes = hours * 60 + minutes;
      // 10:00 AM (600 mins) to 9:30 PM (21:30 = 1290 mins)
      setIsOpen(currentMinutes >= 600 && currentMinutes <= 1290);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleShareLocation = async () => {
    const shareData = {
      title: 'Prem Mobile Gwalior',
      text: 'Visit Prem Mobile at Pinto Park, Jaderua Gate Ke Samne, Gwalior for best mobile & gadget deals!',
      url: storeConfig.mapsUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(storeConfig.mapsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="store-location" className="py-14 bg-[#050505] text-white font-sans relative">
      <div className="max-w-[1500px] mx-auto px-6">
        
        {/* SECTION HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#222222] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd000]/15 text-[#ffd000] text-xs font-black uppercase tracking-wider border border-[#ffd000]/30 mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#ffd000]" />
              <span>PHYSICAL STORE IN GWALIOR</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              VISIT PREM MOBILE STORE
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Pinto Park, Jaderua Gate ke Samne, Gwalior • Experience live product demos & original accessories in person!
            </p>
          </div>

          {/* LIVE OPEN / CLOSED BADGE */}
          <div className="flex-shrink-0">
            <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2.5 text-xs font-black uppercase tracking-wider shadow-lg ${
              isOpen
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-400'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${
                isOpen ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
              }`} />
              <span>{isOpen ? 'STORE OPEN NOW' : 'STORE CLOSED NOW'}</span>
              <span className="text-slate-400 font-normal border-l border-slate-700 pl-2">
                (10:00 AM – 9:30 PM)
              </span>
            </div>
          </div>
        </div>

        {/* MAIN CARD CONTAINER */}
        <div className="rounded-3xl bg-[#0a0a0a] text-white overflow-hidden shadow-2xl border-2 border-[#ffd000]/40">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* LEFT: STORE DETAILS & ACTIONS */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
              
              <div className="space-y-6">
                
                {/* ADDRESS & TIMINGS GRID */}
                <div className="space-y-4 text-sm text-slate-300">
                  
                  {/* Address */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#141414] text-[#ffd000] border border-[#ffd000]/40 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                      <MapPin className="w-5 h-5 text-[#ffd000]" />
                    </div>
                    <div>
                      <strong className="text-white block font-bold text-base">Store Address:</strong>
                      <span className="text-slate-300 leading-relaxed block mt-0.5">
                        {storeConfig.address}
                      </span>
                      <span className="inline-block mt-1 text-xs text-[#ffd000] font-bold bg-[#ffd000]/10 px-2 py-0.5 rounded border border-[#ffd000]/20">
                        Landmark: {storeConfig.landmark}
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#141414] text-[#ffd000] border border-[#ffd000]/40 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Phone className="w-5 h-5 text-[#ffd000]" />
                    </div>
                    <div>
                      <strong className="text-white block font-bold text-base">Helpline / Phone:</strong>
                      <a href={`tel:${storeConfig.phone}`} className="hover:text-[#ffd000] font-black text-white text-lg tracking-wide">
                        +91 {storeConfig.displayPhone}
                      </a>
                    </div>
                  </div>

                  {/* Timings */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#141414] text-[#ffd000] border border-[#ffd000]/40 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Clock className="w-5 h-5 text-[#ffd000]" />
                    </div>
                    <div>
                      <strong className="text-white block font-bold text-base">Store Hours:</strong>
                      <span className="text-slate-300 font-medium">{storeConfig.timing}</span>
                    </div>
                  </div>

                </div>

                {/* IN-STORE PERKS & HIGHLIGHT BADGES */}
                <div className="pt-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2.5">
                    Why Visit Prem Mobile Store?
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-200">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#141414] border border-[#222222]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Free Screen Guard Fitting</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#141414] border border-[#222222]">
                      <Smartphone className="w-4 h-4 text-[#ffd000] flex-shrink-0" />
                      <span>Live Product Demo</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#141414] border border-[#222222]">
                      <Car className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <span>Free Parking Space</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#141414] border border-[#222222]">
                      <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>100% Original Brands</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ACTION BUTTONS STRIP */}
              <div className="pt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* 1. CALL NOW */}
                  <a
                    href={`tel:${storeConfig.phone}`}
                    className="h-12 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102 active:scale-98"
                  >
                    <Phone className="w-4 h-4" />
                    <span>CALL STORE</span>
                  </a>

                  {/* 2. WHATSAPP ENQUIRY */}
                  <button
                    onClick={() => openGeneralWhatsApp('Store Location & Direct Visit')}
                    className="h-12 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102 active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WHATSAPP</span>
                  </button>

                  {/* 3. GET DIRECTIONS */}
                  <a
                    href={storeConfig.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 rounded-xl bg-white hover:bg-slate-100 text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102 active:scale-98"
                  >
                    <Navigation className="w-4 h-4 fill-black text-[#050505]" />
                    <span>DIRECTIONS</span>
                  </a>

                </div>

                {/* SHARE LOCATION BUTTON */}
                <button
                  onClick={handleShareLocation}
                  className="w-full py-2.5 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-slate-300 hover:text-white border border-[#222222] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#ffd000]" />
                  <span>{copied ? 'Location Link Copied!' : 'Share Store Location with Friends'}</span>
                </button>
              </div>

            </div>

            {/* RIGHT: INTERACTIVE GOOGLE MAPS EMBED */}
            <div className="lg:col-span-6 min-h-[400px] relative bg-slate-900 border-t lg:border-t-0 lg:border-l border-[#222222] group">
              <iframe
                title="Prem Mobile Location Gwalior Map"
                src={storeConfig.embedMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
                className="w-full h-full object-cover"
              />

              {/* Map Floating Overlay Tag */}
              <div className="absolute top-4 right-4 bg-[#050505]/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-[#ffd000]/40 shadow-xl flex items-center gap-2 text-xs font-bold">
                <Navigation className="w-4 h-4 text-[#ffd000] fill-[#ffd000]" />
                <span>Pinto Park, Gwalior</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

