import React, { useState } from 'react';
import { storeConfig } from '../config/store';
import { openGeneralWhatsApp } from '../utils/whatsapp';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Navigation,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  User,
  Smartphone,
  Flame,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  Wrench,
  ShoppingBag,
  Sparkles,
  Mail,
  Lock,
  UserCheck
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: 'sales', // 'sales' | 'fitting' | 'warranty'
    requirement: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');
    setIsSubmitted(true);
  };

  const handleWhatsAppForm = () => {
    const deptTitle =
      formData.department === 'fitting'
        ? 'Store Pickup & Live Testing'
        : formData.department === 'warranty'
        ? 'After-Sales & Warranty Support'
        : 'Sales & Product Enquiry';

    const text = `Hello Prem Mobile (Gwalior),
*New Website Enquiry*

• Name: ${formData.name || 'Customer'}
• Phone: ${formData.phone || 'N/A'}
• Department: ${deptTitle}
• Product / Requirement: ${formData.requirement || 'General Inquiry'}
• Message: ${formData.message || 'I would like to connect with your Pinto Park store.'}

Store Tagline: “${storeConfig.tagline}”`;

    openGeneralWhatsApp(text);
  };

  const faqs = [
    {
      q: "Do I need to create an account to browse products or place orders?",
      a: "No! 100% Guest Access is guaranteed. You can freely browse products, select variants, compare prices, apply discount coupons, and place orders or WhatsApp enquiries without ever creating an account or signing in."
    },
    {
      q: "Where is Prem Mobile store located in Gwalior?",
      a: `Prem Mobile is located at ${storeConfig.address}. Landmark: ${storeConfig.landmark}. Click the 'GPS Directions' button on this page to navigate via Google Maps.`
    },
    {
      q: "What are your store opening timings?",
      a: `We are open all 7 days a week from ${storeConfig.timing}. You can walk in anytime for live headphone audio testing and instant purchase.`
    },
    {
      q: "Can I test products in-store before purchasing?",
      a: "Yes! At Prem Mobile, you can try live audio testing for earbuds/neckbands and inspect physical products in person before purchasing."
    }
  ];

  return (
    <div className="py-8 sm:py-12 bg-[#050505] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER WITH COLLOQUIAL BRANDING & GUEST ACCESS ASSURANCE */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>PINTO PARK GWALIOR KI APNI SHOP</span>
            </span>

            {/* GUEST BROWSING ASSURANCE BADGE */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
              <UserCheck className="w-3.5 h-3.5" />
              <span>100% Guest Access — No Account Required!</span>
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            TALK TO PREM MOBILE
          </h1>

          <p className="text-base sm:text-lg text-[#FFD400] font-black">
            “{storeConfig.tagline}”
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Have a question about smartphones, boAt bassheads, store pickup, or Sunday Sale offers? We're right here at Pinto Park, Gwalior to help you!
          </p>
        </div>

        {/* SEGMENTED CONTACT DEPARTMENTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#222222] pb-3">
            <h2 className="font-display font-black text-lg text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD400]" />
              <span>Segmented Support Departments</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">
              Get targeted assistance for your specific issue
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* DEPARTMENT 1: SALES & PRODUCT ENQUIRIES */}
            <div className="p-5 rounded-3xl bg-[#111111] border-2 border-[#222222] hover:border-[#FFD400] transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#050505] text-[#FFD400] border border-[#FFD400]/40 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#FFD400] uppercase tracking-wider block">
                  DEPARTMENT 01
                </span>
                <h3 className="font-display font-black text-base text-white">
                  Sales & Product Enquiries
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Questions about smartphone prices, boAt earbuds, Sunday Sale deals, or custom product orders.
                </p>
              </div>
              <button
                onClick={() => openGeneralWhatsApp('Sales & Product Enquiry')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#222222] hover:bg-[#FFD400] text-slate-200 hover:text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Contact Sales Desk</span>
              </button>
            </div>

            {/* DEPARTMENT 2: STORE PICKUP & LIVE DEMO */}
            <div className="p-5 rounded-3xl bg-[#111111] border-2 border-[#222222] hover:border-emerald-500 transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#050505] text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                  DEPARTMENT 02
                </span>
                <h3 className="font-display font-black text-base text-white">
                  Store Pickup & Live Demo
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Coordinate Pinto Park store pickup, live audio testing, or physical product inspection.
                </p>
              </div>
              <button
                onClick={() => openGeneralWhatsApp('Store Pickup & Demo Assistance')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#222222] hover:bg-emerald-500 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Contact Pickup Desk</span>
              </button>
            </div>

            {/* DEPARTMENT 3: AFTER-SALES & BRAND WARRANTY */}
            <div className="p-5 rounded-3xl bg-[#111111] border-2 border-[#222222] hover:border-blue-500 transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#050505] text-blue-400 border border-blue-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">
                  DEPARTMENT 03
                </span>
                <h3 className="font-display font-black text-base text-white">
                  After-Sales & Warranty Support
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Need a GST receipt duplicate, warranty claim guidance, or 7-day technical defect replacement assistance?
                </p>
              </div>
              <button
                onClick={() => openGeneralWhatsApp('After-Sales & Warranty Support')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#222222] hover:bg-blue-600 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Contact Warranty Desk</span>
              </button>
            </div>

          </div>
        </div>

        {/* MAIN CONTACT GRID: DETAILS & FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#111111] rounded-3xl p-6 border-2 border-[#222222] shadow-xl space-y-5">
              <h2 className="font-display font-black text-lg text-white border-b border-[#222222] pb-3 text-[#FFD400] flex items-center justify-between">
                <span>STORE LOCATION & CONTACT</span>
                <span className="text-[10px] text-slate-400 font-semibold normal-case">Pinto Park, Gwalior</span>
              </h2>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#050505] text-[#FFD400] border border-[#FFD400]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Physical Address</strong>
                    <p className="text-xs text-slate-300 mt-0.5">{storeConfig.address}</p>
                    <p className="text-[11px] text-[#FFD400] font-bold mt-0.5">📍 Landmark: {storeConfig.landmark}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#050505] text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Direct Call Number</strong>
                    <a href={`tel:${storeConfig.phone}`} className="text-sm text-white font-black hover:text-[#FFD400] block mt-0.5">
                      📞 {storeConfig.displayPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#050505] text-[#25D366] border border-[#25D366]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-5 h-5 fill-[#25D366]" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">WhatsApp Instant Desk</strong>
                    <button
                      onClick={() => openGeneralWhatsApp('Contact Page Direct')}
                      className="text-xs text-emerald-400 font-bold hover:underline block mt-0.5"
                    >
                      💬 Click to Chat on WhatsApp →
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#050505] text-[#FFD400] border border-[#FFD400]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Daily Store Timing</strong>
                    <p className="text-xs text-slate-300 mt-0.5">{storeConfig.timing}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Open All 7 Days A Week</p>
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <a
                  href={storeConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md transition-transform hover:scale-102"
                >
                  <Navigation className="w-3.5 h-3.5 fill-black" />
                  <span>GPS DIRECTIONS</span>
                </a>

                <a
                  href={`tel:${storeConfig.phone}`}
                  className="py-3 px-3 rounded-xl bg-[#E31B23] hover:bg-[#cc141c] text-white font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md transition-transform hover:scale-102"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>CALL STORE NOW</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-3xl overflow-hidden border-2 border-[#222222] h-64 bg-black shadow-lg relative">
              <iframe
                title="Prem Mobile Location Map"
                src={storeConfig.embedMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#111111] rounded-3xl p-6 sm:p-8 border-2 border-[#222222] shadow-xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFD400] uppercase mb-1">
                <span>Direct Message Form</span>
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-white">
                SEND AN INQUIRY TO PREM MOBILE
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Fill the form below and our staff in Pinto Park, Gwalior will assist you immediately.
              </p>
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Enquiry Received, {formData.name}!
                  </h3>
                  <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                    Thank you for contacting Prem Mobile. We will connect with you on {formData.phone} shortly.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#050505] border border-[#FFD400]/40 text-xs text-left max-w-md mx-auto space-y-1 text-slate-300">
                  <p><strong>Requirement:</strong> {formData.requirement || 'General Products'}</p>
                  <p><strong>Store Address:</strong> {storeConfig.address}</p>
                  <p><strong>Direct Call:</strong> {storeConfig.displayPhone}</p>
                </div>

                <div className="flex justify-center gap-3 pt-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', phone: '', department: 'sales', requirement: '', message: '' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#222222] text-white font-bold text-xs hover:bg-[#333333]"
                  >
                    Send Another Inquiry
                  </button>

                  <button
                    onClick={handleWhatsAppForm}
                    className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-black text-xs uppercase tracking-wider hover:bg-[#20ba5a] flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>Send on WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500 text-red-300 text-xs font-bold">
                    {error}
                  </div>
                )}

                {/* Department Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Select Target Support Department
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sales', label: 'Sales & Products' },
                      { id: 'fitting', label: 'Pickup & Demo' },
                      { id: 'warranty', label: 'Warranty & Claims' }
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, department: d.id })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                          formData.department === d.id
                            ? 'bg-[#FFD400] text-[#050505] border-[#FFD400]'
                            : 'bg-[#050505] text-slate-300 border-[#333333] hover:border-slate-500'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Full Name <span className="text-[#E31B23]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#333333] focus:border-[#FFD400] bg-[#050505] text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Phone Number (WhatsApp) <span className="text-[#E31B23]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#333333] focus:border-[#FFD400] bg-[#050505] text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Requirement */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Product Model / Requirement
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      placeholder="e.g. boAt Airdopes 161, Realme 12 Pro 5G, 25W Fast Charger"
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#333333] focus:border-[#FFD400] bg-[#050505] text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Message / Inquiry Details
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us any specific requirements, color options, or questions..."
                    className="w-full p-3 text-sm rounded-xl border border-[#333333] focus:border-[#FFD400] bg-[#050505] text-white placeholder-slate-500 resize-none"
                  />
                </div>

                {/* Submit & WhatsApp buttons */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND INQUIRY</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppForm}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WHATSAPP DIRECT</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* SOCIAL MEDIA PLATFORMS (FOR USERS PREFERRING SOCIAL OUTREACH) */}
        <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 border-2 border-[#222222] space-y-4 text-center">
          <div className="space-y-1">
            <span className="text-xs font-black text-[#FFD400] uppercase tracking-wider">
              PREFERRED SOCIAL PLATFORMS
            </span>
            <h3 className="font-display font-black text-xl text-white">
              Connect With Prem Mobile On Social Media
            </h3>
            <p className="text-xs text-slate-400">
              Prefer reaching out on Instagram, Facebook, or YouTube? Connect with our store channels below!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <a
              href={storeConfig.socials?.instagram || 'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#050505] border border-[#222222] hover:border-pink-500 transition-colors flex flex-col items-center justify-center gap-2 group"
            >
              <Instagram className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Instagram</span>
              <span className="text-[10px] text-slate-500">DM Us Anytime</span>
            </a>

            <a
              href={storeConfig.socials?.facebook || 'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#050505] border border-[#222222] hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-2 group"
            >
              <Facebook className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Facebook Page</span>
              <span className="text-[10px] text-slate-500">Store Updates</span>
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#050505] border border-[#222222] hover:border-red-500 transition-colors flex flex-col items-center justify-center gap-2 group"
            >
              <Youtube className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">YouTube</span>
              <span className="text-[10px] text-slate-500">Product Demos</span>
            </a>

            <button
              onClick={() => openGeneralWhatsApp('Social Outreach')}
              className="p-4 rounded-2xl bg-[#050505] border border-[#222222] hover:border-[#25D366] transition-colors flex flex-col items-center justify-center gap-2 group"
            >
              <MessageCircle className="w-6 h-6 text-[#25D366] fill-[#25D366] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">WhatsApp</span>
              <span className="text-[10px] text-slate-500">Instant Chat</span>
            </button>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-4xl mx-auto space-y-6 pt-2">
          <div className="text-center space-y-1">
            <h2 className="font-display font-black text-2xl text-white">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#111111] rounded-2xl border border-[#222222] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:bg-[#1a1a1a] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#FFD400]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-[#222222] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
