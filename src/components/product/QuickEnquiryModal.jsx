import React, { useState } from 'react';
import { X, Send, MessageCircle, Phone, CheckCircle2, User, FileText } from 'lucide-react';
import { storeConfig } from '../../config/store';
import { formatCurrency } from '../../utils/formatters';
import { openProductWhatsApp } from '../../utils/whatsapp';

export default function QuickEnquiryModal({ product, isOpen, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    const noteText = `Customer Name: ${name}${phone ? ` | Phone: ${phone}` : ''}${notes ? ` | Note: ${notes}` : ''}`;
    openProductWhatsApp(product, noteText);
    onClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden z-10 animate-scale-in">
        {/* Header */}
        <div className="bg-brand-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <MessageCircle className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">Product Enquiry</h3>
              <p className="text-xs text-brand-100 font-medium">
                “{storeConfig.tagline}”
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-navy-900">Enquiry Received!</h4>
                <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                  Thank you, <strong>{name}</strong>! Prem Mobile store team will contact you shortly regarding <strong>{product.name}</strong>.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100 text-xs text-brand-900 text-left space-y-1">
                <p><strong>Store Address:</strong> {storeConfig.address}</p>
                <p><strong>Call directly:</strong> {storeConfig.displayPhone}</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Product Mini Preview */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-white p-1 border border-slate-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-brand-600 uppercase">
                    {product.brand}
                  </span>
                  <h4 className="text-xs font-semibold text-navy-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-brand-700">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded">
                      {product.discount}% OFF
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (WhatsApp Preferred) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number (e.g. 9876543210)"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Questions / Requirement (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ask about color availability, storage, discounts or store visit..."
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white resize-none"
                  />
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Enquire on WhatsApp Instantly</span>
                </button>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Store Callback Request</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                Prem Mobile store team at Pinto Park, Gwalior will respond promptly.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
