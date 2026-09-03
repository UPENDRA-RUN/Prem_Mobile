import React, { useState } from 'react';
import LoadingOverlay from '../components/loading/LoadingOverlay';
import ButtonSpinner from '../components/loading/ButtonSpinner';
import ProgressBar from '../components/loading/ProgressBar';
import {
  Loader2,
  Clock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Play
} from 'lucide-react';

export default function LoadingGuide() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("Fetching original 5G smartphone catalog from Pinto Park store...");
  const [btnLoading, setBtnLoading] = useState(false);
  const [progressVal, setProgressVal] = useState(45);

  const checklist = [
    { title: "1. Visual Indicator", desc: "Clear glowing spinners, progress bars, and animated brand store illustrations." },
    { title: "2. Contextual Specific Text", desc: "Replaces generic 'Loading...' with specific action copy (e.g., 'Applying discount code PREM10...')." },
    { title: "3. Time Threshold Rules", desc: "<300ms (Instant, no loader), 300ms-2s (Button spinner), >2s (Brand Overlay)." },
    { title: "4. Accessibility Containers", desc: "High contrast dark/light backdrops with role='status' and aria-live='polite'." },
    { title: "5. Entertaining Brand Visuals", desc: "Animated Prem Mobile store graphic ('Deal Aise Jo Deewana Bana De 🔥')." }
  ];

  const handleTestBtn = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 2000);
  };

  const handleTestOverlay = (msg) => {
    setOverlayMessage(msg);
    setIsOverlayOpen(true);
    setTimeout(() => setIsOverlayOpen(false), 2500);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#FFD400]/40 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
            <Loader2 className="w-4 h-4 animate-spin text-[#050505]" />
            <span>UX FEEDBACK ENGINE</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            LOADING DESIGN SYSTEM
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Visual feedback components communicating progress to users, maintaining engagement, and reducing perceived wait time.
          </p>
        </div>

        {/* 5 CHECKLIST CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {checklist.map((c, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-black text-[#050505]">
                <span>{c.title}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* INTERACTIVE DEMOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Demo 1: Contextual Button Spinners */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black text-[#E31B23] uppercase tracking-wider block">DEMO 01</span>
              <h3 className="font-display font-black text-lg text-[#050505]">
                CONTEXTUAL BUTTON SPINNERS
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Inline loading states for actions lasting between 300ms and 2 seconds.
            </p>

            <div className="flex flex-wrap gap-3">
              <ButtonSpinner
                isLoading={btnLoading}
                loadingText="SAVING CHANGES..."
                onClick={handleTestBtn}
                className="py-3 px-6 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md"
              >
                <span>Trigger Button Loader</span>
              </ButtonSpinner>
            </div>
          </div>

          {/* Demo 2: Full-Screen Brand Overlay Loader */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black text-[#FFD400] uppercase tracking-wider block">DEMO 02</span>
              <h3 className="font-display font-black text-lg text-[#050505]">
                BRAND OVERLAY LOADER (&gt;2 SECONDS)
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Full-screen brand illustration modal for longer processing tasks.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTestOverlay("Fetching original 5G smartphones from Pinto Park store...")}
                className="py-2.5 px-4 rounded-xl bg-[#050505] text-[#FFD400] font-black text-xs uppercase tracking-wider shadow-sm"
              >
                Catalog Fetch Message
              </button>

              <button
                onClick={() => handleTestOverlay("Applying promo discount code PREM10...")}
                className="py-2.5 px-4 rounded-xl bg-[#E31B23] text-white font-black text-xs uppercase tracking-wider shadow-sm"
              >
                Promo Code Message
              </button>
            </div>
          </div>

          {/* Demo 3: Progress Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 lg:col-span-2">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">DEMO 03</span>
                <h3 className="font-display font-black text-lg text-[#050505]">
                  PROGRESS BAR STATES
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">{progressVal}% Completed</span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Determinate Progress Bar</span>
                <ProgressBar progress={progressVal} />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Indeterminate Pulse Bar</span>
                <ProgressBar progress={null} />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setProgressVal((p) => (p >= 100 ? 0 : p + 25))}
                  className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  Step Progress (+25%)
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      <LoadingOverlay
        isOpen={isOverlayOpen}
        message={overlayMessage}
      />
    </div>
  );
}
