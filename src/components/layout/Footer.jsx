import React from 'react';
import { Link } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import {
  Smartphone,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ExternalLink,
  Instagram,
  Facebook
} from 'lucide-react';
import { openGeneralWhatsApp } from '../../utils/whatsapp';

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-white pt-14 pb-10 border-t-2 border-[#ffd000]">
      <div className="max-w-[1500px] mx-auto px-6">
        
        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#222222]">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#111111] text-[#ffd000] flex items-center justify-center border border-[#ffd000]/40">
                <Smartphone className="w-5 h-5 text-[#ffd000]" />
              </div>
              <div className="font-display font-black text-2xl tracking-tight leading-none">
                <span className="text-[#e51b23]">PREM</span>{' '}
                <span className="text-white">MOBILE</span>
              </div>
            </Link>

            <div className="inline-block px-3 py-1 rounded-md bg-[#ffd000] text-[#050505] text-xs font-black uppercase tracking-wider">
              {storeConfig.tagline}
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-4">
              Your trusted local mobile and electronics store in Gwalior. Explore genuine smartphones, true wireless earbuds, power banks, fast chargers, egg boilers, and daily tech accessories at Pinto Park.
            </p>

            <div className="pt-1 flex flex-wrap gap-2.5">
              <button
                onClick={() => openGeneralWhatsApp('Footer WhatsApp Link')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp: {storeConfig.displayPhone}</span>
              </button>

              <a
                href={storeConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] text-[#ffd000] text-xs font-bold border border-[#ffd000]/40 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-black text-white text-xs uppercase tracking-wider mb-3 text-[#ffd000] border-b border-[#222222] pb-1.5">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400 font-medium">
              <li>
                <Link to="/" className="hover:text-[#ffd000] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#ffd000] transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#ffd000] transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#ffd000] text-[#e51b23] font-bold transition-colors">Offers</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#ffd000] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#ffd000] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-black text-white text-xs uppercase tracking-wider mb-3 text-[#ffd000] border-b border-[#222222] pb-1.5">
              CATEGORIES
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400 font-medium">
              <li>
                <Link to="/shop?category=Smartphones" className="hover:text-[#ffd000] transition-colors">Smartphones</Link>
              </li>
              <li>
                <Link to="/shop?category=Earbuds" className="hover:text-[#ffd000] transition-colors">Earbuds</Link>
              </li>
              <li>
                <Link to="/shop?category=Headphones" className="hover:text-[#ffd000] transition-colors">Headphones</Link>
              </li>
              <li>
                <Link to="/shop?category=Smartwatches" className="hover:text-[#ffd000] transition-colors">Smartwatches</Link>
              </li>
              <li>
                <Link to="/shop?category=Accessories" className="hover:text-[#ffd000] transition-colors">Accessories</Link>
              </li>
              <li>
                <Link to="/shop?category=Gadgets" className="hover:text-[#ffd000] transition-colors">Gadgets</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <div>
              <h4 className="font-display font-black text-white text-xs uppercase tracking-wider mb-3 text-[#ffd000] border-b border-[#222222] pb-1.5">
                CONTACT
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#ffd000]" />
                  <a href={`tel:${storeConfig.phone}`} className="text-white font-bold hover:text-[#ffd000]">
                    {storeConfig.displayPhone}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#ffd000] flex-shrink-0 mt-0.5" />
                  <span>{storeConfig.address}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#ffd000] flex-shrink-0 mt-0.5" />
                  <span>{storeConfig.timing}</span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-[11px] font-bold text-[#ffd000] uppercase mb-1.5">
                Follow Us
              </h5>
              <div className="flex items-center gap-2">
                <a
                  href={storeConfig.socials?.instagram || 'https://instagram.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-[#111111] hover:bg-[#ffd000] text-slate-300 hover:text-black border border-[#222222] flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href={storeConfig.socials?.facebook || 'https://facebook.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-[#111111] hover:bg-[#ffd000] text-slate-300 hover:text-black border border-[#222222] flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>
            © 2026 <strong className="text-[#ffd000]">Prem Mobile</strong>. All Rights Reserved.
          </p>
          <p className="text-slate-500 text-center sm:text-right">
            Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.) • “{storeConfig.tagline}”
          </p>
        </div>

      </div>
    </footer>
  );
}
