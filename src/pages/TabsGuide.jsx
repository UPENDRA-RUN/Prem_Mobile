import React, { useState } from 'react';
import Tabs from '../components/common/Tabs';
import {
  Smartphone,
  Headphones,
  Watch,
  ShieldCheck,
  Star,
  FileText,
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function TabsGuide() {
  const checklist = [
    { title: "1. Concise Labels", desc: "Short, logical 1-word or 2-word labels (Smartphones, Audio, Specs, Reviews) predicting content." },
    { title: "2. Dedicated Content Area", desc: "Distinct container where active tab content is displayed underneath or beside tabs." },
    { title: "3. Style Differentiation", desc: "High-contrast active tab pill/underline (#FFD400 / #050505) vs soft inactive tabs." },
    { title: "4. Familiar Item Order", desc: "Tabs arranged logically by user familiarity or popularity (e.g. All -> Smartphones -> Audio)." },
    { title: "5. Interactive States", desc: "Clean transitions across default, hover highlight, and active states." }
  ];

  const sampleTabs = [
    {
      id: "smartphones",
      label: "Smartphones",
      icon: Smartphone,
      content: (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 animate-fade-in">
          <h4 className="font-bold text-base text-[#050505]">Original 5G Smartphones Catalog</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Explore authentic Samsung Galaxy, Realme, Xiaomi, and Nokia 5G devices with official brand warranty and free store setup at Pinto Park, Gwalior.
          </p>
        </div>
      )
    },
    {
      id: "audio",
      label: "Audio",
      icon: Headphones,
      content: (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 animate-fade-in">
          <h4 className="font-bold text-base text-[#050505]">TWS Earbuds & Neckbands</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            boAt Airdopes, Noise, and Fire-Boltt audio gear with live in-store audio testing before purchase.
          </p>
        </div>
      )
    },
    {
      id: "smartwatches",
      label: "Smartwatches",
      icon: Watch,
      content: (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 animate-fade-in">
          <h4 className="font-bold text-base text-[#050505]">Fitness & Calling Watches</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            AMOLED display Bluetooth calling smartwatches with heart rate monitoring and IP68 water resistance.
          </p>
        </div>
      )
    },
    {
      id: "warranty",
      label: "Warranty",
      icon: ShieldCheck,
      content: (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 animate-fade-in">
          <h4 className="font-bold text-base text-[#050505]">100% Brand Warranty Policy</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            All items come with official GST store invoices valid across authorized service centers nationwide.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#FFD400]/40 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
            <Layers className="w-4 h-4 text-[#050505]" />
            <span>CONTENT SEGMENTATION ENGINE</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            TABS DESIGN SYSTEM
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Navigation components organizing content into logical sections, switching views seamlessly while maintaining user context.
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

        {/* DEMO 1: HORIZONTAL PILLS LAYOUT */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-black text-[#E31B23] uppercase tracking-wider block">SHOWCASE 01</span>
            <h3 className="font-display font-black text-xl text-[#050505]">
              HORIZONTAL PILL TABS LAYOUT
            </h3>
          </div>

          <Tabs tabs={sampleTabs} variant="pills" />
        </div>

        {/* DEMO 2: UNDERLINE TABS LAYOUT */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-black text-[#FFD400] uppercase tracking-wider block">SHOWCASE 02</span>
            <h3 className="font-display font-black text-xl text-[#050505]">
              BORDER UNDERLINE TABS LAYOUT
            </h3>
          </div>

          <Tabs tabs={sampleTabs} variant="underline" />
        </div>

      </div>
    </div>
  );
}
