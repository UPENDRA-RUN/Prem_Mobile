import React, { useState } from 'react';
import Toast from '../components/common/Toast';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Play
} from 'lucide-react';

export default function ToastGuide() {
  const [activeToast, setActiveToast] = useState(null); // { type, message }

  const checklist = [
    { title: "1. Concise Copy", desc: "Clear status/action focused feedback (e.g., 'Item Added to Cart', 'Coupon PREM10 Applied')." },
    { title: "2. Corner Placement", desc: "Positioned at bottom-right corner of viewport (bottom-6 right-6), keeping central content clear." },
    { title: "3. Action-Triggered Usage", desc: "Fires immediately upon completion of user action or system event." },
    { title: "4. Color & Icon Variants", desc: "Success (Green + Check), Error (Red + Alert), Info (Dark + Yellow Sparkles), Warning (Amber + Triangle)." },
    { title: "5. Calibrated Appearance Length", desc: "Auto-dismiss timer set to 3.5s — long enough to read but short enough not to obstruct." },
    { title: "6. Manual Dismissal", desc: "Manual close X button alongside automatic smooth fade-out animation." }
  ];

  const triggerToast = (type, message) => {
    setActiveToast({ type, message });
    setTimeout(() => setActiveToast(null), 3500);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#FFD400]/40 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
            <Bell className="w-4 h-4 text-[#050505]" />
            <span>TRANSIENT FEEDBACK ENGINE</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            TOAST DESIGN SYSTEM
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Brief, non-disruptive feedback messages appearing temporarily at the corner of the screen following user actions.
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

        {/* INTERACTIVE TOAST TRIGGER DEMOS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black text-[#E31B23] uppercase tracking-wider block">SHOWCASE 01</span>
            <h3 className="font-display font-black text-xl text-[#050505]">
              TOAST VARIANTS & CORNER POSITIONING DEMO
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Success */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Success Variant</span>
              </div>
              <button
                onClick={() => triggerToast('success', 'Samsung Galaxy 5G added to Cart!')}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#20ba5a]"
              >
                Trigger Success Toast
              </button>
            </div>

            {/* Error */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-[#E31B23] font-bold text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>Error Variant</span>
              </div>
              <button
                onClick={() => triggerToast('error', 'Invalid Coupon Code PREM99')}
                className="w-full py-3 px-4 rounded-xl bg-[#E31B23] text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#cc141c]"
              >
                Trigger Error Toast
              </button>
            </div>

            {/* Info */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-[#FFD400] font-bold text-xs">
                <Sparkles className="w-4 h-4 fill-[#FFD400]" />
                <span>Info / Status Variant</span>
              </div>
              <button
                onClick={() => triggerToast('info', 'Promo PREM10 Applied: 10% Discount Saved')}
                className="w-full py-3 px-4 rounded-xl bg-[#050505] text-[#FFD400] font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#1a1a1a]"
              >
                Trigger Info Toast
              </button>
            </div>

            {/* Warning */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Warning Variant</span>
              </div>
              <button
                onClick={() => triggerToast('warning', 'Only 2 items left in Pinto Park store stock!')}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-amber-600"
              >
                Trigger Warning Toast
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ACTIVE DEMO TOAST */}
      {activeToast && (
        <Toast
          type={activeToast.type}
          message={activeToast.message}
          onClose={() => setActiveToast(null)}
        />
      )}
    </div>
  );
}
