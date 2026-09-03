import React from 'react';
import { Smartphone, Sparkles, Loader2 } from 'lucide-react';
import { storeConfig } from '../../config/store';

export default function LoadingOverlay({
  isOpen,
  message = "Fetching latest products & deals from Prem Mobile Pinto Park...",
  variant = "dark" // "dark" | "light"
}) {
  if (!isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center animate-fade-in"
    >
      {/* Backdrop */}
      <div className={`fixed inset-0 transition-opacity ${
        variant === 'dark' ? 'bg-[#050505]/85 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
      }`} />

      {/* Dialog Card */}
      <div className={`relative rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl z-10 text-center space-y-5 border ${
        variant === 'dark'
          ? 'bg-[#0a0a0a] text-white border-[#FFD400]/40'
          : 'bg-white text-[#050505] border-slate-200'
      }`}>
        
        {/* ENTERTAINING BRAND ILLUSTRATION */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          {/* Pulsing Outer Rings */}
          <div className="absolute inset-0 rounded-3xl bg-[#FFD400]/20 animate-ping" />
          <div className="absolute -inset-2 rounded-3xl border-2 border-[#FFD400]/30 animate-pulse" />
          
          <div className="w-16 h-16 rounded-2xl bg-[#050505] text-[#FFD400] border-2 border-[#FFD400] flex items-center justify-center shadow-xl relative z-10">
            <Smartphone className="w-8 h-8 text-[#FFD400] animate-bounce" />
          </div>
        </div>

        {/* SPINNER & CONTEXTUAL SPECIFIC MESSAGE */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD400] text-[#050505] text-[11px] font-black uppercase tracking-wider">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#050505]" />
            <span>PROCESSING</span>
          </div>

          <h3 className="font-display font-black text-base leading-snug">
            {message}
          </h3>

          <p className="text-[11px] text-slate-400 font-medium">
            “{storeConfig.tagline}” • Pinto Park, Gwalior
          </p>
        </div>

      </div>
    </div>
  );
}
