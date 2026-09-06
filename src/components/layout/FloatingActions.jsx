import React, { useState, useEffect, useRef } from 'react';
import { Phone, MessageCircle, Instagram, X, MessageSquare, Sparkles } from 'lucide-react';
import { storeConfig } from '../../config/store';
import { openGeneralWhatsApp } from '../../utils/whatsapp';

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when tapping/clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleWhatsAppClick = () => {
    setIsOpen(false);
    openGeneralWhatsApp('Floating Contact Enquiry');
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end select-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* ==================================================== */}
      {/* POPUP CONTACT MENU (Appears Vertically Above Button) */}
      {/* ==================================================== */}
      {isOpen && (
        <div className="mb-2.5 sm:mb-3 w-[190px] min-[380px]:w-[210px] bg-[#050505] text-white rounded-2xl border-2 border-[#ffd000]/70 p-2 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(255,208,0,0.2)] space-y-1.5 animate-scale-up backdrop-blur-md">
          
          {/* Header Label */}
          <div className="px-2 py-1 flex items-center justify-between border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-[#ffd000]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#ffd000]" />
              <span>Connect With Us</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* 1. Instagram Option */}
          <a
            href={storeConfig.socials?.instagram || 'https://instagram.com'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-[#833ab4]/20 hover:via-[#fd1d1d]/20 hover:to-[#fcb045]/20 border border-white/5 hover:border-pink-500/50 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Instagram className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 text-left">
              <span className="block font-black text-xs text-white leading-tight">Instagram</span>
              <span className="text-[10px] text-slate-400 font-medium truncate">Reels & Deals</span>
            </div>
          </a>

          {/* 2. WhatsApp Option */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/60 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <MessageCircle className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="min-w-0">
              <span className="block font-black text-xs text-white leading-tight">WhatsApp</span>
              <span className="text-[10px] text-emerald-400 font-medium truncate">Chat & Orders</span>
            </div>
          </button>

          {/* 3. Call Store Option */}
          <a
            href={`tel:${storeConfig.phone}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-red-950/40 border border-white/5 hover:border-red-500/60 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E31B23] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Phone className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="min-w-0 text-left">
              <span className="block font-black text-xs text-white leading-tight">Call Store</span>
              <span className="text-[10px] text-slate-300 font-medium truncate">{storeConfig.displayPhone}</span>
            </div>
          </a>

        </div>
      )}

      {/* ==================================================== */}
      {/* COMPACT CIRCULAR FLOATING CONTACT BUTTON (ICON ONLY) */}
      {/* ==================================================== */}
      <button
        type="button"
        onClick={toggleMenu}
        className={`group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 transition-all duration-300 shadow-2xl active:scale-95 cursor-pointer ${
          isOpen
            ? 'bg-[#050505] text-[#ffd000] border-[#ffd000] shadow-[0_0_25px_rgba(255,208,0,0.5)]'
            : 'bg-[#050505] text-[#ffd000] border-[#ffd000]/80 hover:border-[#ffd000] shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(255,208,0,0.25)] hover:scale-105'
        }`}
        aria-label={isOpen ? 'Close Contact Menu' : 'Open Contact Menu'}
        title="Contact Prem Mobile"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#ffd000] stroke-[2.5]" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-[#ffd000] fill-[#ffd000]" />
            {/* Live Green Online Dot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#25D366] rounded-full border-2 border-black animate-pulse" />
          </div>
        )}
      </button>

    </div>
  );
}
