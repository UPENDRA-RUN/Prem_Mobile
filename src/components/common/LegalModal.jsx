import React from 'react';
import { X, ShieldCheck, FileText, Truck, RefreshCw, Lock } from 'lucide-react';
import { storeConfig } from '../../config/store';

export default function LegalModal({ isOpen, onClose, policyType = 'privacy' }) {
  if (!isOpen) return null;

  const policies = {
    privacy: {
      title: 'Privacy Policy',
      icon: Lock,
      content: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            At <strong>Prem Mobile (Gwalior)</strong>, protecting your personal privacy and customer data is our highest priority. This policy details how we handle your personal information when you browse our website, place store pickup orders, or contact us.
          </p>

          <h4 className="font-bold text-sm text-[#050505]">1. Information We Collect</h4>
          <p>
            We collect basic contact details provided voluntarily by you when placing an order or inquiry: your name, phone number, delivery address (if applicable), and selected payment method. We do not store financial card credentials on our servers.
          </p>

          <h4 className="font-bold text-sm text-[#050505]">2. How We Use Your Information</h4>
          <p>
            Your information is strictly used to fulfill your product reservation, process order invoices, provide WhatsApp order updates, and offer store support at Pinto Park, Gwalior. We never sell or share your data with third-party advertisers.
          </p>

          <h4 className="font-bold text-sm text-[#050505]">3. Data Security & Encryption</h4>
          <p>
            Our website uses 256-bit SSL encryption to ensure that all data transmitted between your browser and our servers remains confidential and secure.
          </p>
        </div>
      )
    },

    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      content: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Welcome to <strong>Prem Mobile</strong>. By accessing our website, browsing our product catalog, or placing store pickup orders, you agree to comply with these Terms & Conditions.
          </p>

          <h4 className="font-bold text-sm text-[#050505]">1. Store Offer Rates & Pricing</h4>
          <p>
            All listed prices on Prem Mobile reflect our store offer rates in Gwalior ("Deal Aise Jo Deewana Bana De"). Prices and product availability are subject to store stock levels and may be updated without prior notice.
          </p>

          <h4 className="font-bold text-sm text-[#050505]">2. Product Availability & Reservations</h4>
          <p>
            Online product reservations via WhatsApp or checkout are held at our Pinto Park store for up to 24 hours. After 24 hours, uncollected reserved items may be returned to general store inventory.
          </p>

          <h4 className="font-bold text-sm text-[#050505]">3. Free In-Store Services</h4>
          <p>
            Live audio testing and product inspection are complimentary in-store services provided upon store pickup at Pinto Park, Gwalior.
          </p>
        </div>
      )
    },

    shipping: {
      title: 'Shipping & Pickup Policy',
      icon: Truck,
      content: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            We offer two convenient ways to receive your products from <strong>Prem Mobile</strong>:
          </p>

          <h4 className="font-bold text-sm text-[#050505]">1. Free Store Pickup (Pinto Park, Gwalior)</h4>
          <p>
            Select 'Store Pickup' during checkout to reserve your item free of charge. Pick up your product anytime between 9:30 AM and 9:30 PM at:
            <br />
            <strong className="text-slate-900">{storeConfig.address}</strong>
          </p>

          <h4 className="font-bold text-sm text-[#050505]">2. Gwalior Local Express Delivery</h4>
          <p>
            For local customers within Gwalior city limits, orders placed before 4:00 PM are eligible for same-day express doorstep delivery.
          </p>
        </div>
      )
    },

    warranty: {
      title: 'Warranty & Return Policy',
      icon: RefreshCw,
      content: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Prem Mobile</strong> is committed to selling only 100% authentic products backed by official manufacturer warranties.
          </p>

          <h4 className="font-bold text-sm text-[#050505]">1. 100% Brand Warranty Assurance</h4>
          <p>
            All smartphones and accessories (boAt, Xiaomi, Realme, Samsung, Noise, Fire-Boltt, AGARO) include an official GST invoice and full brand warranty valid at authorized service centers across India.
          </p>

          <h4 className="font-bold text-sm text-[#050505]">2. 7-Day Technical Defect Guarantee</h4>
          <p>
            If a product develops a technical manufacturing defect within 7 days of purchase, bring it to our Pinto Park store with your original receipt for a brand-new replacement unit.
          </p>
        </div>
      )
    }
  };

  const currentPolicy = policies[policyType] || policies.privacy;
  const IconComp = currentPolicy.icon;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto p-4 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-4 sm:p-8 shadow-2xl z-10 space-y-5 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#050505] text-[#FFD400] flex items-center justify-center flex-shrink-0">
              <IconComp className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD400]" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-[#050505] uppercase tracking-wider">
                {currentPolicy.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Prem Mobile • Pinto Park, Gwalior</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-black hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
          {currentPolicy.content}
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full min-[400px]:w-auto px-6 py-2.5 rounded-xl bg-[#FFD400] text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm hover:bg-[#e6be00] text-center"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
