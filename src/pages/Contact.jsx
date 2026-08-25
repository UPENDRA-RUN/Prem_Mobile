import React, { useState } from 'react';
import { storeConfig } from '../config/store';
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
  Flame
} from 'lucide-react';
import { openGeneralWhatsApp } from '../utils/whatsapp';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
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
    const text = `Hello Prem Mobile,
Name: ${formData.name || 'Customer'}
Phone: ${formData.phone || 'N/A'}
Product / Requirement: ${formData.requirement || 'General Store Enquiry'}
Message: ${formData.message || 'I would like to enquire about electronics / store visit.'}

Tagline: “${storeConfig.tagline}”`;

    openGeneralWhatsApp(text);
  };

  const faqs = [
    {
      q: "Where is Prem Mobile store located in Gwalior?",
      a: `Prem Mobile is located at ${storeConfig.address} near Pinto Park Chauraha. You can easily find us on Google Maps.`
    },
    {
      q: "What are your store opening timings?",
      a: `We are open all 7 days a week from ${storeConfig.timing}. You can walk in anytime for product demos and instant purchase.`
    },
    {
      q: "How can I order on WhatsApp?",
      a: `Simply click on any WhatsApp button or message us directly on ${storeConfig.displayPhone}. We will confirm availability and prices instantly.`
    },
    {
      q: "Do you offer free screen guard installation?",
      a: "Yes! Whenever you purchase any 9D tempered glass or back cover at Prem Mobile, our technicians fit it with zero bubbles for free."
    }
  ];

  return (
    <div className="py-8 sm:py-12 bg-[#050505] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>CONTACT & ENQUIRY</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            CONTACT PREM MOBILE
          </h1>

          <p className="text-sm sm:text-base text-[#FFD400] font-bold">
            “{storeConfig.tagline}”
          </p>

          <p className="text-xs sm:text-sm text-slate-400">
            {storeConfig.address} • Call or WhatsApp on {storeConfig.displayPhone}
          </p>
        </div>

        {/* Contact Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#111111] rounded-3xl p-6 border-2 border-[#222222] shadow-xl space-y-5">
              <h2 className="font-display font-black text-lg text-white border-b border-[#222222] pb-3 text-[#FFD400]">
                STORE CONTACT DETAILS
              </h2>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#050505] text-[#FFD400] border border-[#FFD400]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Store Address</strong>
                    <p className="text-xs text-slate-300 mt-0.5">{storeConfig.address}</p>
                    <p className="text-[11px] text-[#FFD400] font-semibold mt-0.5">{storeConfig.landmark}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#050505] text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Phone Number</strong>
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
                    <strong className="text-white block font-bold">WhatsApp Direct</strong>
                    <button
                      onClick={() => openGeneralWhatsApp('Contact Page Direct')}
                      className="text-xs text-emerald-400 font-bold hover:underline block mt-0.5"
                    >
                      💬 Order & Enquire on WhatsApp →
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#050505] text-[#FFD400] border border-[#FFD400]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Opening Hours</strong>
                    <p className="text-xs text-slate-300 mt-0.5">{storeConfig.timing}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <a
                  href={storeConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5 fill-black" />
                  <span>DIRECTIONS</span>
                </a>

                <a
                  href={`tel:${storeConfig.phone}`}
                  className="py-3 px-3 rounded-xl bg-[#E31B23] hover:bg-[#cc141c] text-white font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>CALL NOW</span>
                </a>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="rounded-3xl overflow-hidden border-2 border-[#222222] h-60 bg-black">
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

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-[#111111] rounded-3xl p-6 sm:p-8 border-2 border-[#222222] shadow-xl">
            <div className="mb-6">
              <h2 className="font-display font-black text-xl sm:text-2xl text-white">
                SEND ENQUIRY
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Fill the form below and the Prem Mobile team in Pinto Park, Gwalior will assist you.
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
                      setFormData({ name: '', phone: '', requirement: '', message: '' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#222222] text-white font-bold text-xs hover:bg-[#333333]"
                  >
                    Send Another Enquiry
                  </button>

                  <button
                    onClick={handleWhatsAppForm}
                    className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-black text-xs uppercase tracking-wider hover:bg-[#20ba5a] flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
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
                        placeholder="10-digit number"
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#333333] focus:border-[#FFD400] bg-[#050505] text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Requirement */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Product / Requirement
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      placeholder="e.g. boAt Basshead 90C, Egg Boiler, Realme 5G Phone, Smartwatch"
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#333333] focus:border-[#FFD400] bg-[#050505] text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Message / Special Instructions
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us any specific model requirements, color preferences, or questions..."
                    className="w-full p-3 text-sm rounded-xl border border-[#333333] focus:border-[#FFD400] bg-[#050505] text-white placeholder-slate-500 resize-none"
                  />
                </div>

                {/* Submit & WhatsApp buttons */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND ENQUIRY</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppForm}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>ORDER ON WHATSAPP</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="max-w-4xl mx-auto space-y-6 pt-6">
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
