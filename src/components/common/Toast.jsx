import React from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { notification } = useCart();
  const { wishlistToast } = useWishlist();

  const activeMsg = notification || wishlistToast;

  if (!activeMsg) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
      <div className="bg-navy-900/95 text-white px-5 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2.5 border border-white/10 text-sm font-medium animate-bounce">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>{activeMsg}</span>
      </div>
    </div>
  );
}
