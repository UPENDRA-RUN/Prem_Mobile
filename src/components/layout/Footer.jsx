import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import { openGeneralWhatsApp } from '../../utils/whatsapp';
import LegalModal from '../common/LegalModal';
import SupportModal from '../common/SupportModal';
import {
  Smartphone,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube,
  ArrowUp,
  ShieldCheck,
  Lock,
  FileCheck,
  Sparkles,
  CreditCard,
  CheckCircle2,
  HelpCircle,
  Layers,
  Layout,
  Loader2,
  Edit3,
  Sliders,
  MousePointer,
  Bell,
  Zap
} from 'lucide-react';

const PARTNER_BRANDS = [
  { name: 'boAt', tag: 'Official Partner' },
  { name: 'Xiaomi', tag: 'Authorized Store' },
  { name: 'Realme', tag: 'Genuine Partner' },
  { name: 'Samsung', tag: 'Store Partner' },
  { name: 'Noise', tag: 'Official Dealer' },
  { name: 'Fire-Boltt', tag: 'Official Dealer' },
  { name: 'AGARO', tag: 'Lifestyle Tech' }
];

export default function Footer() {
  const [legalModalType, setLegalModalType] = useState(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="w-full bg-[#050505] text-white pt-14 pb-10 border-t-4 border-[#FFD400] relative font-sans">
        
        {/* BACK TO TOP FLOATING / CORNER BUTTON */}
        <div className="absolute -top-6 right-6 sm:right-12 z-10">
          <button
            onClick={scrollToTop}
            className="p-3.5 rounded-2xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black shadow-xl flex items-center gap-2 transition-transform hover:scale-110"
            title="Scroll back to top of page"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            <span className="text-xs uppercase tracking-wider hidden sm:inline">TOP</span>
          </button>
        </div>

        <div className="max-w-[1500px] mx-auto px-6 space-y-12">
          
          {/* OFFICIAL BRAND PARTNERS STRIP */}
          <div className="pb-8 border-b border-[#222222] space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-[#FFD400]">
                <Sparkles className="w-3.5 h-3.5 fill-[#FFD400]" />
                <span>OFFICIAL BRAND PARTNERS & AUTHORIZED DEALERSHIP IN GWALIOR</span>
              </span>
              <span className="hidden sm:inline text-slate-500">100% Original Warranted Products</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {PARTNER_BRANDS.map((b) => (
                <div
                  key={b.name}
                  className="px-4 py-2 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#FFD400]/50 transition-colors flex items-center gap-2 text-xs"
                >
                  <span className="font-display font-black text-white text-sm">{b.name}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase bg-black/50 px-1.5 py-0.5 rounded">
                    {b.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN 5-COLUMN FOOTER GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#222222]">
            
            {/* Col 1 & 2: Brand Lockup, Tagline & Contact Actions */}
            <div className="lg:col-span-2 space-y-5">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#FFD400] flex items-center justify-center border border-[#FFD400]/40">
                  <Smartphone className="w-5 h-5 text-[#FFD400]" />
                </div>
                <div className="font-display font-black text-2xl sm:text-3xl tracking-tight leading-none">
                  <span className="text-[#E31B23]">PREM</span>{' '}
                  <span className="text-white">MOBILE</span>
                </div>
              </Link>

              <div className="inline-block px-3 py-1 rounded-lg bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
                “{storeConfig.tagline}”
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-4">
                Your trusted local mobile & electronics destination at Pinto Park, Gwalior. Explore original 5G smartphones, TWS earbuds, neckbands, smartwatches, power banks, fast chargers, and egg boilers with live in-store testing.
              </p>

              {/* Direct Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  onClick={() => openGeneralWhatsApp('Footer Contact')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black uppercase tracking-wider shadow-md transition-transform hover:scale-102"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Store Desk</span>
                </button>

                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] text-xs font-black uppercase tracking-wider shadow-md transition-transform hover:scale-102"
                >
                  <HelpCircle className="w-4 h-4 text-[#050505]" />
                  <span>Open Support Desk</span>
                </button>
              </div>
            </div>

            {/* Col 3: Quick Links */}
            <div>
              <h4 className="font-display font-black text-white text-xs uppercase tracking-wider mb-4 text-[#FFD400] border-b border-[#222222] pb-2">
                QUICK NAVIGATION
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-400 font-medium">
                <li>
                  <Link to="/" className="hover:text-[#FFD400] transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-[#FFD400] transition-colors">All Catalog</Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-[#FFD400] transition-colors">Categories</Link>
                </li>
                <li>
                  <Link to="/offers" className="hover:text-[#FFD400] text-[#E31B23] font-bold transition-colors">Sunday Sale 🔥</Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-[#FFD400] text-[#FFD400] font-bold transition-colors">FAQ & Help Center</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#FFD400] transition-colors">About Prem Mobile</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#FFD400] transition-colors">Contact Store</Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Categories & In-Store Services */}
            <div>
              <h4 className="font-display font-black text-white text-xs uppercase tracking-wider mb-4 text-[#FFD400] border-b border-[#222222] pb-2">
                CATEGORIES & SERVICES
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-medium">
                <li>
                  <Link to="/shop?category=Smartphones" className="hover:text-[#FFD400] transition-colors">Smartphones 5G</Link>
                </li>
                <li>
                  <Link to="/shop?category=Earbuds" className="hover:text-[#FFD400] transition-colors">Earbuds TWS</Link>
                </li>
                <li>
                  <Link to="/shop?category=Headphones" className="hover:text-[#FFD400] transition-colors">Wireless Neckbands</Link>
                </li>
                <li>
                  <Link to="/shop?category=Smartwatches" className="hover:text-[#FFD400] transition-colors">Smartwatches</Link>
                </li>
                <li>
                  <Link to="/shop?category=Power%20Banks" className="hover:text-[#FFD400] transition-colors">Power Banks 20000mAh</Link>
                </li>
                <li>
                  <Link to="/shop?category=Gadgets" className="hover:text-[#FFD400] transition-colors">Egg Boilers & Gadgets</Link>
                </li>
                <li className="pt-2 text-emerald-400 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Original Warranty</span>
                </li>
              </ul>
            </div>

            {/* Col 5: Store Hours, Legal Links & Socials */}
            <div className="space-y-5">
              <div>
                <h4 className="font-display font-black text-white text-xs uppercase tracking-wider mb-4 text-[#FFD400] border-b border-[#222222] pb-2">
                  STORE CONTACT & HOURS
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#FFD400]" />
                    <a href={`tel:${storeConfig.phone}`} className="text-white font-bold hover:text-[#FFD400]">
                      {storeConfig.displayPhone}
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#FFD400] flex-shrink-0 mt-0.5" />
                    <span>{storeConfig.address}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#FFD400] flex-shrink-0 mt-0.5" />
                    <span>{storeConfig.timing}</span>
                  </li>
                </ul>
              </div>

              {/* LEGAL AND COMPLIANCE LINKS */}
              <div className="pt-2">
                <h5 className="text-[11px] font-bold text-[#FFD400] uppercase mb-2">
                  Legal & Store Policies
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-400 font-medium">
                  <li>
                    <button onClick={() => setLegalModalType('privacy')} className="hover:text-[#FFD400] hover:underline">
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setLegalModalType('terms')} className="hover:text-[#FFD400] hover:underline">
                      Terms & Conditions
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setLegalModalType('shipping')} className="hover:text-[#FFD400] hover:underline">
                      Shipping & Store Pickup Policy
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setLegalModalType('warranty')} className="hover:text-[#FFD400] hover:underline">
                      100% Brand Warranty Policy
                    </button>
                  </li>
                </ul>
              </div>

              {/* SOCIAL MEDIA LINKS */}
              <div>
                <h5 className="text-[11px] font-bold text-[#FFD400] uppercase mb-2">
                  Connect With Us
                </h5>
                <div className="flex items-center gap-2">
                  <a
                    href={storeConfig.socials?.instagram || 'https://instagram.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-xl bg-[#111111] hover:bg-[#FFD400] text-slate-300 hover:text-black border border-[#222222] flex items-center justify-center transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={storeConfig.socials?.facebook || 'https://facebook.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-xl bg-[#111111] hover:bg-[#FFD400] text-slate-300 hover:text-black border border-[#222222] flex items-center justify-center transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-xl bg-[#111111] hover:bg-[#E31B23] text-slate-300 hover:text-white border border-[#222222] flex items-center justify-center transition-colors"
                    title="YouTube Channel"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* TRUST CERTIFICATIONS & ACCEPTED PAYMENT METHODS */}
          <div className="pt-2 pb-6 border-b border-[#222222] flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Regulatory & Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-bold">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111111] border border-[#222222]">
                <ShieldCheck className="w-4 h-4 text-[#FFD400]" />
                <span>100% Genuine Brand Warranty</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111111] border border-[#222222]">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>GST Verified Invoice</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111111] border border-[#222222]">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Accepted Payment Method Badges */}
            <div className="space-y-1 text-center md:text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Accepted Payment Methods
              </span>
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-xs font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-[#111111] border border-[#333333] text-slate-200">
                  💳 Visa / Mastercard
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#111111] border border-[#333333] text-slate-200">
                  🇮🇳 RuPay
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#111111] border border-[#333333] text-slate-200">
                  ⚡ UPI / GPay / PhonePe
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#111111] border border-[#333333] text-slate-200">
                   Apple Pay
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-900/40 text-amber-300 border border-amber-500/40">
                  🏪 Store Cash / Pickup
                </span>
              </div>
            </div>

          </div>

          {/* BOTTOM COPYRIGHT */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>
              © 2026 <strong className="text-[#FFD400]">Prem Mobile</strong>. All Rights Reserved.
            </p>
            <p className="text-slate-500 text-center sm:text-right">
              Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.) • “{storeConfig.tagline}”
            </p>
          </div>

        </div>
      </footer>

      {/* Global Modals */}
      <LegalModal
        isOpen={!!legalModalType}
        policyType={legalModalType || 'privacy'}
        onClose={() => setLegalModalType(null)}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </>
  );
}
