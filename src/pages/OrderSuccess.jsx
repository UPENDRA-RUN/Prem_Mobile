import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, MessageCircle, MapPin, Phone } from 'lucide-react';
import { storeConfig } from '../config/store';
import { openGeneralWhatsApp } from '../utils/whatsapp';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderNo = searchParams.get('orderNo') || 'PM-' + Math.floor(100000 + Math.random() * 900000);

  const handleWhatsAppConfirm = () => {
    openGeneralWhatsApp(`Hi Prem Mobile! I have placed order #${orderNo}. Please confirm my order.`);
  };

  return (
    <div className="bg-[#f8fafc] min-h-[80vh] py-16 sm:py-24 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-6 text-center space-y-6">
        
        <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <CheckCircle2 className="w-14 h-14 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            ORDER CONFIRMED
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#050505] tracking-tight">
            Thank You For Your Order!
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Your order has been received and is being processed by the Prem Mobile team.
          </p>
        </div>

        {/* ORDER DETAILS BOX */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-left space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Order Reference:</span>
            <span className="font-display font-black text-base text-[#050505] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              {orderNo}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-600">
            <span>Store Location:</span>
            <span className="font-bold text-[#050505]">Pinto Park, Gwalior (M.P.)</span>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-600">
            <span>Customer Care:</span>
            <span className="font-bold text-[#050505]">{storeConfig.phone}</span>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 leading-relaxed">
            Our store executive will call you shortly to confirm pickup / delivery timing.
          </div>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleWhatsAppConfirm}
            className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>CONFIRM ON WHATSAPP ({storeConfig.phone})</span>
          </button>

          <Link
            to="/products"
            className="w-full py-3.5 px-6 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>CONTINUE SHOPPING</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
