import React from 'react';
import { Link } from 'react-router-dom';
import { storeConfig } from '../config/store';
import {
  Smartphone,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  Phone,
  Flame,
  Award,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';
import { openGeneralWhatsApp } from '../utils/whatsapp';

export default function About() {
  const highlights = [
    {
      icon: Award,
      title: "100% Genuine Brand Assurance",
      desc: "Every smartphone, pair of earbuds, charger, and gadget in our store is sourced with authentic brand warranty."
    },
    {
      icon: HeartHandshake,
      title: "“Deal Aise Jo Deewana Bana De 🔥”",
      desc: "Our motto represents our everyday commitment to giving customers in Gwalior the best possible store deals."
    },
    {
      icon: Users,
      title: "Friendly Local Store Experience",
      desc: "Walk in to touch and test live devices. Our experienced team assists you in picking the perfect gadget."
    },
    {
      icon: ShieldCheck,
      title: "100% Genuine Brand Warranty",
      desc: "Every product at Prem Mobile comes with authentic brand warranty, original tax invoice, and live store verification."
    }
  ];

  return (
    <div className="py-8 sm:py-12 bg-[#050505] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Section */}
        <div className="rounded-3xl sm:rounded-4xl bg-[#111111] border-2 border-[#FFD400]/40 text-white p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>ABOUT PREM MOBILE</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
              Prem Mobile — Pinto Park, Gwalior
            </h1>

            <p className="text-xl font-black text-[#FFD400]">
              “{storeConfig.tagline}”
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Prem Mobile is a local mobile and electronics store in Gwalior, offering a wide range of mobiles, accessories, gadgets and everyday electronics. Located at Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.), we bring you genuine tech products at unbeatable store prices.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => openGeneralWhatsApp('About Page Inquiry')}
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-lg"
              >
                ORDER ON WHATSAPP: {storeConfig.displayPhone}
              </button>
              <Link
                to="/shop"
                className="px-6 py-3 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg"
              >
                EXPLORE SHOP
              </Link>
            </div>
          </div>
          <div className="absolute right-0 -bottom-10 w-96 h-96 bg-[#FFD400]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Store Representative Photo & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#FFD400] to-[#E31B23] rounded-full blur-md opacity-75" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-[#FFD400] overflow-hidden shadow-2xl bg-black flex items-center justify-center">
                <img
                  src="/images/prem-main.jpg"
                  alt="Prem Mobile Store Representative"
                  className="w-full h-full object-cover scale-[1.28] group-hover:scale-[1.34] transition-transform duration-500"
                />
                <div className="absolute inset-0 rounded-full border-2 border-[#FFD400]/30 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-black text-[#FFD400] uppercase tracking-wider">
              YOUR LOCAL GWALIOR ELECTRONICS HUB
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight">
              Genuine Products, Live Demos & Local Trust
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              At <strong>Prem Mobile</strong>, we believe that buying a new smartphone, wireless earbuds, or daily accessories should be a fun and reliable experience. We stock all major brands, verified chargers, high-capacity power banks, egg boilers, moto vlogging chest mounts, and stylish cases under one roof.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              You can explore our entire collection online, message us on WhatsApp for fast stock verification and price quotes, and walk in to our store at Pinto Park, Gwalior for instant pickup.
            </p>

            <div className="p-4 rounded-2xl bg-[#111111] border border-[#FFD400]/40 text-xs text-slate-300 space-y-1">
              <p>📍 <strong>Address:</strong> {storeConfig.address}</p>
              <p>📞 <strong>Phone:</strong> {storeConfig.displayPhone}</p>
              <p>⏰ <strong>Hours:</strong> {storeConfig.timing}</p>
            </div>
          </div>

        </div>

        {/* 4 Key Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#111111] rounded-3xl p-6 border-2 border-[#222222] hover:border-[#FFD400] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#050505] text-[#FFD400] flex items-center justify-center border border-[#FFD400]/40">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-base text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
