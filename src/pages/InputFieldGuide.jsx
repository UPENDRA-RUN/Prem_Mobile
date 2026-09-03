import React, { useState } from 'react';
import InputField from '../components/common/InputField';
import {
  Phone,
  Mail,
  MapPin,
  User,
  KeyRound,
  Search,
  Tag,
  CheckCircle2,
  Edit3
} from 'lucide-react';

export default function InputFieldGuide() {
  const [formData, setFormData] = useState({
    name: 'Rahul Sharma',
    phone: '',
    email: '',
    address: '',
    coupon: ''
  });

  const [errors, setErrors] = useState({});

  const checklist = [
    { title: "1. Readable Input Size", desc: "Font size set to minimum 16px (text-base / text-sm) preventing mobile browser auto-zoom issues." },
    { title: "2. Sentence Case Labels", desc: "Uses clear Sentence/Title Case labels instead of harsh ALL CAPS to improve scanning readability." },
    { title: "3. Lighter Placeholder Text", desc: "Placeholder color (text-slate-400) is notably lighter than default input text (text-slate-900)." },
    { title: "4. Strict Data Format", desc: "Input types (type='tel', type='email', inputMode='numeric') enforcing correct virtual keyboards." },
    { title: "5. Icons & Visual Cues", desc: "Prefix icon support (Phone, Mail, MapPin, User, KeyRound) visually breaking up long form lists." },
    { title: "6. Elaborate Hints", desc: "Sub-label hint text explaining expected inputs when users need extra guidance." }
  ];

  const handleValidationTest = () => {
    const newErrors = {};
    if (!formData.phone) newErrors.phone = "WhatsApp number is required for store pickup updates";
    if (!formData.email.includes('@')) newErrors.email = "Please enter a valid email address (e.g., name@domain.com)";
    setErrors(newErrors);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#FFD400]/40 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
            <Edit3 className="w-4 h-4 text-[#050505]" />
            <span>FORM INTERACTION ENGINE</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            INPUT FIELD DESIGN SYSTEM
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Standardized text input containers for user data entry with accessible labels, clear format placeholders, icons, and contextual hints.
          </p>
        </div>

        {/* 6 CHECKLIST CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {checklist.map((c, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-black text-[#050505]">
                <span>{c.title}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* INTERACTIVE FORM SHOWCASE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#E31B23] uppercase tracking-wider block">INTERACTIVE SHOWCASE</span>
              <h3 className="font-display font-black text-xl text-[#050505]">
                CUSTOMER CHECKOUT & PROFILE FORM
              </h3>
            </div>

            <button
              onClick={handleValidationTest}
              className="py-2 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm"
            >
              Trigger Validation Test
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            
            {/* Full Name */}
            <InputField
              label="Full Name"
              icon={User}
              placeholder="e.g., Rahul Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              hint="Enter your legal name for store pickup verification"
              required
            />

            {/* WhatsApp Phone Number */}
            <InputField
              label="WhatsApp Phone Number"
              icon={Phone}
              type="tel"
              inputMode="numeric"
              placeholder="e.g., 9893947477"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              hint="We will send free screen guard fitting status updates here"
              required
            />

            {/* Email Address */}
            <InputField
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="e.g., rahul.gwalior@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              hint="GST store invoice will be emailed to this address"
              required
            />

            {/* Delivery Address */}
            <InputField
              label="Delivery & Store Address Landmark"
              icon={MapPin}
              placeholder="e.g., Near Jaderua Gate, Pinto Park, Gwalior"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              hint="Specify nearby Gwalior landmark for local delivery"
            />

            {/* Promo Code */}
            <InputField
              label="Store Promo Coupon Code"
              icon={Tag}
              placeholder="e.g., PREM10 or GWALIOR100"
              value={formData.coupon}
              onChange={(e) => setFormData({ ...formData, coupon: e.target.value })}
              hint="Enter active coupon code for instant store discount"
            />

          </div>
        </div>

      </div>
    </div>
  );
}
