import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Home, HelpCircle, ArrowLeft } from 'lucide-react';
import { storeConfig } from '../config/store';
import SupportModal from '../components/common/SupportModal';

export default function NotFound() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <>
      <div className="py-24 bg-slate-50 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-[#050505] text-[#FFD400] border-2 border-[#FFD400]/40 flex items-center justify-center mx-auto shadow-xl">
            <Smartphone className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-5xl font-black font-display text-[#E31B23]">404</span>
            <h1 className="text-2xl font-bold text-[#050505]">Page Not Found</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              The page you are looking for might have been moved or doesn't exist. “{storeConfig.tagline}”.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-[#050505] text-[#FFD400] text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </Link>

            <button
              onClick={() => setIsSupportOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Contact Support Desk</span>
            </button>
          </div>
        </div>
      </div>

      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </>
  );
}
