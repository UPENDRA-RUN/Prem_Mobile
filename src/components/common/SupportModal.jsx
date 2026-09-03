import React from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  MessageCircle,
  Phone,
  HelpCircle,
  MapPin,
  Send,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { storeConfig } from '../../config/store';
import { openGeneralWhatsApp } from '../../utils/whatsapp';

export default function SupportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const supportChannels = [
    {
      id: 'whatsapp',
      title: 'WhatsApp Direct Support',
      benefit: 'Best for complicated technical issues, photo/screenshot sharing & instant product stock check',
      responseTime: '< 2 Mins (Instant)',
      whatToProvide: 'Product model name, issue description, or screenshot',
      icon: MessageCircle,
      iconBg: 'bg-[#25D366] text-white',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      actionText: 'Open WhatsApp Chat',
      action: () => {
        onClose();
        openGeneralWhatsApp('Support Modal');
      }
    },
    {
      id: 'phone',
      title: 'Direct Store Phone Call',
      benefit: 'Best for urgent Pinto Park store pickup coordination or immediate stock reservation',
      responseTime: 'Immediate Call Answer',
      whatToProvide: 'Your name & item you wish to reserve/inquire',
      icon: Phone,
      iconBg: 'bg-[#E31B23] text-white',
      badgeBg: 'bg-red-100 text-red-900 border-red-300',
      actionText: `Call ${storeConfig.displayPhone}`,
      action: () => {
        window.location.href = `tel:${storeConfig.phone}`;
      }
    },
    {
      id: 'faq',
      title: 'Interactive FAQ & Help Hub',
      benefit: 'Best for standard self-service questions on screen guard fitting, warranty terms & return policies',
      responseTime: '0 Mins (Instant Self-Service)',
      whatToProvide: 'Search by keyword (e.g., screen guard, warranty, payment)',
      icon: HelpCircle,
      iconBg: 'bg-[#050505] text-[#FFD400]',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      actionText: 'Browse FAQ Center',
      linkTo: '/faq'
    },
    {
      id: 'walkin',
      title: 'Pinto Park Store Walk-In',
      benefit: 'Best for live audio testing, free bubble-free screen guard fitting & physical product inspection',
      responseTime: 'Open Daily 9:30 AM – 9:30 PM',
      whatToProvide: 'Your device & GST store invoice for warranty services',
      icon: MapPin,
      iconBg: 'bg-indigo-600 text-white',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      actionText: 'Open Google Maps Directions',
      action: () => {
        window.open(storeConfig.mapsUrl, '_blank');
      }
    },
    {
      id: 'ticket',
      title: 'Inquiry Form & Email Support',
      benefit: 'Best for non-urgent bulk corporate inquiries or detailed warranty claim requests',
      responseTime: 'Within 2–4 Hours',
      whatToProvide: 'Name, contact number, and detailed requirement',
      icon: Send,
      iconBg: 'bg-[#FFD400] text-[#050505]',
      badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      actionText: 'Go to Contact Form',
      linkTo: '/contact'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-slate-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#050505] text-[#FFD400] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#FFD400]" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-[#050505] uppercase tracking-wider">
                PREM MOBILE SUPPORT DESK
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pinto Park, Gwalior • Choose the best support channel for your issue
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-black hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Support Channels List (Ordered by Convenience) */}
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {supportChannels.map((channel) => {
            const IconComp = channel.icon;
            return (
              <div
                key={channel.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#FFD400] transition-all space-y-3 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${channel.iconBg} flex items-center justify-center flex-shrink-0 shadow-xs`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-sm text-[#050505]">
                        {channel.title}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium leading-snug">
                        {channel.benefit}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 self-start sm:self-auto ${channel.badgeBg}`}>
                    <Clock className="w-3 h-3" />
                    <span>{channel.responseTime}</span>
                  </span>
                </div>

                {/* What to provide guidance */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-0.5">
                  <span className="font-bold text-[#050505] text-[10.5px] uppercase tracking-wider block">
                    What to provide for this channel:
                  </span>
                  <p className="text-slate-700 font-medium">
                    👉 {channel.whatToProvide}
                  </p>
                </div>

                {/* Action CTA */}
                <div className="pt-1 flex justify-end">
                  {channel.linkTo ? (
                    <Link
                      to={channel.linkTo}
                      onClick={onClose}
                      className="py-2 px-4 rounded-xl bg-[#050505] hover:bg-[#1a1a1a] text-[#FFD400] font-black text-xs uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{channel.actionText}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={channel.action}
                      className="py-2 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{channel.actionText}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Customer Satisfaction Guarantee</span>
          </span>

          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:underline"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
