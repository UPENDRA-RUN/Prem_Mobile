import React from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Sparkles, X } from 'lucide-react';

export default function Toast({
  type = 'success', // 'success' | 'error' | 'info' | 'warning'
  message: customMessage,
  onClose
}) {
  const { notification, hideToast } = useCart();
  const { wishlistToast } = useWishlist();

  const activeMsg = customMessage || notification || wishlistToast;

  if (!activeMsg) return null;

  // 4. VARIANTS: Color and icon combinations
  const variantStyles = {
    success: 'bg-[#050505] text-white border-2 border-[#25D366]/60 shadow-xl',
    error: 'bg-red-950 text-white border-2 border-red-500 shadow-xl',
    info: 'bg-[#050505] text-[#FFD400] border-2 border-[#FFD400]/60 shadow-xl',
    warning: 'bg-amber-950 text-amber-100 border-2 border-amber-500 shadow-xl'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#25D366] flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    info: <Sparkles className="w-5 h-5 text-[#FFD400] flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
  };

  const handleDismiss = () => {
    if (onClose) onClose();
    if (hideToast) hideToast();
  };

  return (
    /* 
      2. PLACEMENT: Bottom-right corner of viewport (bottom-6 right-6 z-50)
    */
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 animate-slide-up">
      <div className={`px-4 py-3 rounded-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs sm:text-sm font-bold ${variantStyles[type]}`}>
        <div className="flex items-center gap-2.5">
          {icons[type]}
          
          {/* 1. COPY: Concise status/action text */}
          <span>{activeMsg}</span>
        </div>

        {/* 6. DISMISSABLE: Manual close X button */}
        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
