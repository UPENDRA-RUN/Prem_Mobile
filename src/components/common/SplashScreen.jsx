import React, { useState, useEffect } from 'react';
import { Smartphone, Sparkles } from 'lucide-react';
import { storeConfig } from '../../config/store';

export default function SplashScreen({
  duration = 1400, // 3. LAUNCH DURATION: 1.4s genuine initialization
  onComplete,
  forceShow = false
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, duration / 10);

    // 4. TRANSITION TO FIRST SCREEN: Smooth fade out after duration
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 500);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  if (!isVisible && !forceShow) return null;

  return (
    /* 
      2. BRAND BACKGROUND: Deep black #050505 with yellow top border accent
      5. NO INTERACTIVE ELEMENTS: pointer-events-none, purely visual transition
    */
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] bg-[#050505] text-white flex flex-col items-center justify-between py-12 px-6 border-t-4 border-[#FFD400] transition-all duration-500 pointer-events-none select-none ${
        isFadingOut && !forceShow ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div />

      {/* CENTERED LOGO & BRAND WORDMARK */}
      <div className="text-center space-y-6 animate-scale-in">
        
        {/* 1. LOGO & WORDMARK */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {/* Pulsing Outer Rings */}
          <div className="absolute inset-0 rounded-3xl bg-[#FFD400]/20 animate-ping" />
          <div className="absolute -inset-3 rounded-3xl border-2 border-[#FFD400]/40 animate-pulse" />

          <div className="w-20 h-20 rounded-2xl bg-[#111111] text-[#FFD400] border-2 border-[#FFD400] flex items-center justify-center shadow-2xl relative z-10">
            <Smartphone className="w-10 h-10 text-[#FFD400] animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-none">
            <span className="text-[#E31B23]">PREM</span>{' '}
            <span className="text-white">MOBILE</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5 fill-[#050505]" />
            <span>“{storeConfig.tagline}”</span>
          </div>
        </div>

      </div>

      {/* 6. LOADING INDICATOR: Subtle progress bar */}
      <div className="w-full max-w-xs space-y-2 text-center">
        <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden border border-[#333333]">
          <div
            className="h-full bg-[#FFD400] transition-all duration-150 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 font-medium">
          Initializing Pinto Park Gwalior Store...
        </p>
      </div>
    </div>
  );
}
