import React, { useState } from 'react';
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
  Send,
  MessageSquare,
  Mail,
  Navigation
} from 'lucide-react';
import { openGeneralWhatsApp } from '../utils/whatsapp';
import SEO from '../components/common/SEO';

export default function About() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitted(true);
    setTimeout(() => {
      openGeneralWhatsApp(`Hello Prem Mobile! My name is ${formData.name} (${formData.phone}). ${formData.message}`);
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', message: '' });
    }, 800);
  };

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
      <SEO
        title="About Prem Mobile Gwalior | Trusted Electronics Retailer"
        description="Learn about Prem Mobile located at Pinto Park, Gwalior. 100% genuine products, official warranty, and best offline deals."
        path="/about"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Section */}
        <div className="rounded-3xl sm:rounded-4xl bg-[#111111] border-2 border-[#FFD400]/40 text-white p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>ABOUT & CONTACT PREM MOBILE</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
              Prem Mobile — Pinto Park, Gwalior
            </h1>

            <p className="text-xl font-black text-[#FFD400]">
              “{storeConfig.tagline}”
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Prem Mobile is your trusted local mobile and electronics store in Gwalior. Located at Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.), we bring you authentic smartphones, earbuds, chargers, and tech gadgets with genuine brand warranty and store support.
            </p>

            <div className="pt-2 flex flex-col min-[460px]:flex-row flex-wrap gap-3">
              <button
                onClick={() => openGeneralWhatsApp('About & Contact Page Inquiry')}
                className="w-full min-[460px]:w-auto px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-lg text-center flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>CHAT ON WHATSAPP</span>
              </button>
              <a
                href={`tel:${storeConfig.phone}`}
                className="w-full min-[460px]:w-auto px-6 py-3 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>CALL STORE DIRECTLY</span>
              </a>
            </div>
          </div>
          <div className="absolute right-0 -bottom-10 w-96 h-96 bg-[#FFD400]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Store Representative Photo & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-full">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#FFD400] to-[#E31B23] rounded-full blur-md opacity-75" />
              <div className="relative w-52 h-52 min-[380px]:w-64 min-[380px]:h-64 sm:w-80 sm:h-80 rounded-full border-4 border-[#FFD400] overflow-hidden shadow-2xl bg-black flex items-center justify-center flex-shrink-0">
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
              You can explore our entire collection online, message us on WhatsApp for fast stock verification and price quotes, or walk in to our store at Pinto Park, Gwalior for instant pickup.
            </p>
          </div>

        </div>

        {/* COMPREHENSIVE STORE CONTACT & LOCATION SECTION */}
        <div id="contact" className="rounded-3xl bg-[#111111] border-2 border-[#FFD400]/40 p-6 sm:p-10 space-y-8 shadow-2xl scroll-mt-24">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5" />
              <span>STORE CONTACT & LOCATION</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              Get in Touch or Visit Our Store
            </h2>
            <p className="text-sm text-slate-400">
              Have questions about product availability, prices, or store directions? Contact us directly below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Details Cards */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-[#050505] border border-slate-800 flex items-start gap-4 hover:border-[#FFD400] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#E31B23] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-[#FFD400] tracking-wider">Store Address</h3>
                  <p className="text-sm text-slate-200 mt-1 font-medium leading-relaxed">
                    {storeConfig.address}
                  </p>
                  <a
                    href="https://maps.google.com/?q=Pinto+Park+Jaderua+Gate+Gwalior"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFD400] hover:underline mt-2"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open in Google Maps →</span>
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#050505] border border-slate-800 flex items-start gap-4 hover:border-[#FFD400] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase text-[#FFD400] tracking-wider">Phone & Call Support</h3>
                  <p className="text-sm font-bold text-white">
                    <a href={`tel:${storeConfig.phone}`} className="hover:text-[#FFD400] transition-colors">
                      {storeConfig.displayPhone}
                    </a>
                  </p>
                  <p className="text-xs text-slate-400">Available during store opening hours</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#050505] border border-slate-800 flex items-start gap-4 hover:border-[#FFD400] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <MessageSquare className="w-5 h-5 fill-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase text-[#FFD400] tracking-wider">Instant WhatsApp Chat</h3>
                  <p className="text-xs text-slate-300">
                    Get instant price quotes, product availability & live photos on WhatsApp.
                  </p>
                  <button
                    onClick={() => openGeneralWhatsApp('WhatsApp Store Inquiry')}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Start Chat Now
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#050505] border border-slate-800 flex items-start gap-4 hover:border-[#FFD400] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-[#050505] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-[#FFD400] tracking-wider">Store Timings</h3>
                  <p className="text-sm font-bold text-white mt-0.5">{storeConfig.timing}</p>
                  {storeConfig.closedDay && (
                    <p className="text-xs text-rose-400 font-bold mt-1">🚫 Closed on: {storeConfig.closedDay}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#050505] border border-slate-800 space-y-4">
              <h3 className="font-display font-black text-xl text-white">Send Us a Quick Message</h3>
              <p className="text-xs text-slate-400">
                Fill out your query below and we'll connect with you on WhatsApp immediately!
              </p>

              {isSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold text-center space-y-1 animate-fade-in">
                  <p className="text-sm font-black">✓ Message Prepared!</p>
                  <p>Opening WhatsApp to send your message to Prem Mobile...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111111] border border-slate-700 text-white text-xs focus:border-[#FFD400] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111111] border border-slate-700 text-white text-xs focus:border-[#FFD400] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Message / Query</label>
                    <textarea
                      rows={3}
                      placeholder="Ask about product stock, pricing, or store location..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111111] border border-slate-700 text-white text-xs focus:border-[#FFD400] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#E31B23] hover:bg-[#c9141b] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE TO STORE</span>
                  </button>
                </form>
              )}
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
