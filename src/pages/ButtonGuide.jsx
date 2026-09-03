import React, { useState } from 'react';
import Button from '../components/common/Button';
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Share2,
  CheckCircle2,
  Sparkles,
  MousePointer
} from 'lucide-react';

export default function ButtonGuide() {
  const [loadingTest, setLoadingTest] = useState(false);

  const checklist = [
    { title: "1. Base Style", desc: "Default fills, outlines, underlines, ghosts, and danger variants." },
    { title: "2. Shape Properties", desc: "Standardized padding, borders, border radii (rounded-xl, 2xl, full), and shadows." },
    { title: "3. Variants", desc: "Primary (#FFD400), Secondary (#050505), Outline, Danger (#E31B23), Ghost, Underline." },
    { title: "4. Instructional Copy", desc: "Clear action-oriented copy explaining what will happen when clicked." },
    { title: "5. Interactive States", desc: "Smooth visual feedback across default, hover (scale-102), focus ring, active (scale-98), loading, disabled." }
  ];

  const handleTestLoading = () => {
    setLoadingTest(true);
    setTimeout(() => setLoadingTest(false), 2000);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#FFD400]/40 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
            <MousePointer className="w-4 h-4 text-[#050505]" />
            <span>PRIMARY ACTION ENGINE</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            BUTTON DESIGN SYSTEM
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Interactive buttons communicating clickability through visual hierarchy, shapes, action-oriented copy, and rich interaction states.
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

        {/* VARIANTS SHOWCASE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black text-[#E31B23] uppercase tracking-wider block">SHOWCASE 01</span>
            <h3 className="font-display font-black text-xl text-[#050505]">
              BUTTON VARIANTS & INSTRUCTIONAL COPY
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Primary */}
            <Button variant="primary" icon={ShoppingBag}>
              ADD TO CART & PICKUP IN GWALIOR
            </Button>

            {/* Secondary */}
            <Button variant="secondary" icon={Sparkles}>
              OPEN WHATSAPP STORE DESK
            </Button>

            {/* Outline */}
            <Button variant="outline" icon={Share2}>
              SHARE PRODUCT DEAL
            </Button>

            {/* Danger */}
            <Button variant="danger" icon={Trash2}>
              DELETE ACCOUNT & DATA
            </Button>

            {/* Ghost */}
            <Button variant="ghost">
              Cancel Action
            </Button>

            {/* Underline */}
            <Button variant="underline">
              View All Product Categories →
            </Button>
          </div>
        </div>

        {/* INTERACTIVE STATES DEMO */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#FFD400] uppercase tracking-wider block">SHOWCASE 02</span>
              <h3 className="font-display font-black text-xl text-[#050505]">
                INTERACTIVE STATES & LOADING SPINNER
              </h3>
            </div>

            <Button variant="primary" size="sm" onClick={handleTestLoading}>
              Trigger 2s Loading State
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#050505] text-xs uppercase block">1. Default State</span>
              <Button variant="primary" fullWidth>
                DEFAULT STATE
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#050505] text-xs uppercase block">2. Hover & Focus State</span>
              <Button variant="secondary" fullWidth className="scale-102 ring-4 ring-[#FFD400]/40">
                HOVER / FOCUS RING
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#050505] text-xs uppercase block">3. Loading State</span>
              <Button variant="primary" fullWidth isLoading={loadingTest || true} loadingText="SAVING CHANGES...">
                SUBMIT
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#050505] text-xs uppercase block">4. Disabled State</span>
              <Button variant="outline" fullWidth disabled>
                ACTION UNAVAILABLE
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
