import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import LegalModal from '../common/LegalModal';
import SupportModal from '../common/SupportModal';
import {
  Smartphone,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  ArrowUp,
  ShieldCheck,
  Lock,
  FileCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const PARTNER_BRANDS = [
  { name: 'boAt', tag: 'Partner' },
  { name: 'Xiaomi', tag: 'Store' },
  { name: 'Realme', tag: 'Partner' },
  { name: 'Samsung', tag: 'Partner' },
  { name: 'Noise', tag: 'Dealer' },
  { name: 'Fire-Boltt', tag: 'Dealer' },
  { name: 'AGARO', tag: 'Lifestyle' }
];

export default function Footer() {
  const [legalModalType, setLegalModalType] = useState(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="w-full bg-[#050505] text-white pt-10 pb-8 border-t-4 border-[#FFD400] relative font-sans">
        
        {/* BACK TO TOP BUTTON */}
        <div className="absolute -top-5 right-4 sm:right-10 z-10">
          <button
            onClick={scrollToTop}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            title="Scroll back to top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="max-w-[1500px] mx-auto px-3.5 sm:px-6 space-y-8">
          
          {/* BRAND PARTNERS STRIP */}
          <div className="pb-6 border-b border-[#222222]">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2.5">
              <span className="flex items-center gap-1.5 text-[#FFD400]">
                <Sparkles className="w-3.5 h-3.5 fill-[#FFD400]" />
                <span>OFFICIAL BRAND PARTNERS IN GWALIOR</span>
              </span>
              <span className="hidden sm:inline text-slate-500">100% Genuine Warranty</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {PARTNER_BRANDS.map((b) => (
                <div
                  key={b.name}
                  className="px-2.5 py-1 rounded-xl bg-[#111111] border border-[#222222] text-xs flex items-center gap-1.5"
                >
                  <span className="font-display font-black text-white text-xs">{b.name}</span>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase bg-black/60 px-1 py-0.2 rounded">
                    {b.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN FOOTER GRID (Clean 2-column on mobile, 4-column on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-[#222222]">
            
            {/* Col 1: Brand Info */}
            <div className="space-y-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#111111] text-[#FFD400] flex items-center justify-center border border-[#FFD400]/40">
                  <Smartphone className="w-4 h-4 text-[#FFD400]" />
                </div>
                <div className="font-display font-black text-xl tracking-tight leading-none">
                  <span className="text-[#E31B23]">PREM</span>{' '}
                  <span className="text-white">MOBILE</span>
                </div>
              </Link>

              <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#FFD400] text-[#050505] text-[10.5px] font-black uppercase tracking-wider">
                “{storeConfig.tagline}”
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Your trusted local mobile & electronics destination at Pinto Park, Gwalior. Genuine tech with store warranty and unbeatable prices.
              </p>

              {/* Social Media Links */}
              <div className="pt-1 flex items-center gap-2">
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
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="font-display font-black text-xs uppercase tracking-wider mb-3 text-[#FFD400]">
                QUICK LINKS
              </h4>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                <li>
                  <Link to="/" className="hover:text-[#FFD400] transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-[#FFD400] transition-colors">All Products</Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-[#FFD400] transition-colors">Categories</Link>
                </li>
                <li>
                  <Link to="/sunday-sale" className="hover:text-[#FFD400] text-[#E31B23] font-bold transition-colors">Sunday Sale 🔥</Link>
                </li>
                <li>
                  <Link to="/combos" className="hover:text-[#FFD400] transition-colors">Combos & Deals</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#FFD400] transition-colors">About Store</Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal & Policies */}
            <div>
              <h4 className="font-display font-black text-xs uppercase tracking-wider mb-3 text-[#FFD400]">
                POLICIES & HELP
              </h4>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                <li>
                  <button onClick={() => setLegalModalType('privacy')} className="hover:text-[#FFD400] transition-colors cursor-pointer text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModalType('terms')} className="hover:text-[#FFD400] transition-colors cursor-pointer text-left">
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModalType('shipping')} className="hover:text-[#FFD400] transition-colors cursor-pointer text-left">
                    Store Pickup & Shipping
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModalType('warranty')} className="hover:text-[#FFD400] transition-colors cursor-pointer text-left">
                    100% Brand Warranty
                  </button>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-[#FFD400] transition-colors">
                    FAQ & Help Desk
                  </Link>
                </li>
                <li>
                  <button onClick={() => setIsSupportModalOpen(true)} className="hover:text-[#FFD400] transition-colors cursor-pointer text-left">
                    Customer Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Store Contact & Hours */}
            <div>
              <h4 className="font-display font-black text-xs uppercase tracking-wider mb-3 text-[#FFD400]">
                STORE LOCATION & TIMING
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#FFD400] shrink-0" />
                  <a href={`tel:${storeConfig.phone}`} className="text-white font-bold hover:text-[#FFD400]">
                    {storeConfig.displayPhone}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FFD400] shrink-0 mt-0.5" />
                  <span>{storeConfig.address}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#FFD400] shrink-0 mt-0.5" />
                  <span>{storeConfig.timing}</span>
                </li>
                {storeConfig.closedDay && (
                  <li className="text-[#E31B23] font-bold text-[11px] pl-5">
                    Closed on {storeConfig.closedDay}
                  </li>
                )}
              </ul>
            </div>

          </div>

          {/* TRUST BADGES & ACCEPTED PAYMENTS (Compact Horizontal Strip) */}
          <div className="pt-1 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#222222]">
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-slate-300 font-bold">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111111] border border-[#222222]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFD400]" />
                <span>100% Genuine Warranty</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111111] border border-[#222222]">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>GST Invoice</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111111] border border-[#222222]">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>SSL Encrypted</span>
              </span>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10.5px] font-bold text-slate-300">
              <span className="px-2 py-0.5 rounded bg-[#111111] border border-[#333333]">
                💳 Cards
              </span>
              <span className="px-2 py-0.5 rounded bg-[#111111] border border-[#333333]">
                ⚡ UPI / GPay
              </span>
              <span className="px-2 py-0.5 rounded bg-[#111111] border border-[#333333]">
                🇮🇳 RuPay
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/40">
                🏪 Store Cash
              </span>
            </div>

          </div>

          {/* COPYRIGHT */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 text-center sm:text-left">
            <p>
              © 2026 <strong className="text-[#FFD400]">Prem Mobile</strong>. All Rights Reserved. •{' '}
              <Link to="/admin/login" className="hover:text-[#FFD400] transition-colors">
                Admin
              </Link>
            </p>
            <p className="text-slate-500">
              Pinto Park, Gwalior (M.P.) • “{storeConfig.tagline}”
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
