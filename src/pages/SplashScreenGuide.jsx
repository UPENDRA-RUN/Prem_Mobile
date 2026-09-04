import React, { useState } from 'react';
import SplashScreen from '../components/common/SplashScreen';
import {
  Smartphone,
  Sparkles,
  CheckCircle2,
  Play,
  Layers,
  Zap
} from 'lucide-react';

export default function SplashScreenGuide() {
  const [showDemoSplash, setShowDemoSplash] = useState(false);

  const checklist = [
    { title: "1. Logo or Wordmark", desc: "App brand mark (Smartphone icon + PREM MOBILE wordmark + Gwalior tagline) centered on a clean background." },
    { title: "2. Brand Background", desc: "Solid deep black #050505 background with glowing #FFD400 top border accent for distinct mobile transition." },
    { title: "3. Launch Duration", desc: "Calibrated 1.4s launch duration for initial store data load without arbitrary decorative padding." },
    { title: "4. Transition to First Screen", desc: "Smooth fade-out & scale-down transition (opacity-0 scale-95) into main screen without jarring flashes." },
    { title: "5. No Interactive Elements", desc: "Purely visual transition container with pointer-events-none and 0 buttons, inputs, or tappable areas." },
    { title: "6. Loading Indicator", desc: "Animated glowing rings + progress bar informing the user initialization is taking place." }
  ];

  const handleTriggerSplash = () => {
    setShowDemoSplash(true);
    setTimeout(() => {
      setShowDemoSplash(false);
    }, 1900);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#FFD400]/40 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-[#050505]" />
              <span>MOBILE ONBOARDING ENGINE</span>
            </div>

            <button
              onClick={handleTriggerSplash}
              className="py-2.5 px-5 rounded-2xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <Zap className="w-4 h-4 fill-[#050505]" />
              <span>Re-trigger Launch Splash</span>
            </button>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            SPLASH SCREEN MOBILE SYSTEM
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            The initial screen displayed when launching the Prem Mobile web app during asynchronous initialization before transitioning smoothly to the homepage.
          </p>
        </div>

        {/* 6 CHECKLIST CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {checklist.map((c, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-black text-[#050505]">
                <span>{c.title}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* INTERACTIVE DEMO CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#E31B23] uppercase tracking-wider block">LIVE DEMO</span>
              <h3 className="font-display font-black text-xl text-[#050505]">
                MOBILE APP LAUNCH SIMULATOR
              </h3>
            </div>

            <button
              onClick={handleTriggerSplash}
              className="py-2.5 px-5 rounded-2xl bg-[#050505] text-[#FFD400] font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#1a1a1a]"
            >
              Simulate 1.4s Launch Sequence
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#050505] text-[#FFD400] flex items-center justify-center mx-auto shadow-md">
              <Smartphone className="w-8 h-8 text-[#FFD400]" />
            </div>

            <h4 className="font-bold text-base text-[#050505]">Test Mobile Splash Screen</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Clicking the simulation button above triggers the 1.4s mobile splash screen sequence with smooth fade-out and progress animation.
            </p>
          </div>
        </div>

      </div>

      {/* DEMO SPLASH OVERLAY */}
      {showDemoSplash && (
        <SplashScreen
          duration={1400}
          forceShow
          onComplete={() => setShowDemoSplash(false)}
        />
      )}
    </div>
  );
}
