import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

export default function CompareDrawer() {
  const { compareItems, removeFromCompare, clearCompare, compareCount, compareToast } = useCompare();
  const location = useLocation();

  // Hide compare drawer if user is already on /compare page or if list is empty
  if (compareCount === 0 || location.pathname === '/compare') {
    return (
      <>
        {compareToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#050505] text-[#FFD400] font-bold text-xs shadow-2xl border border-[#FFD400]/30 animate-bounce flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#FFD400]" />
            <span>{compareToast}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Toast popup */}
      {compareToast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#050505] text-[#FFD400] font-bold text-xs shadow-2xl border border-[#FFD400]/30 animate-bounce flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#FFD400]" />
          <span>{compareToast}</span>
        </div>
      )}

      {/* Sticky Bottom Compare Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-700/80 animate-slide-up flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-700 min-w-max">
            <div className="w-8 h-8 rounded-xl bg-[#E31B23] text-white flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs block leading-none">Compare Items</span>
              <span className="text-[10px] text-slate-400 font-medium">{compareCount} of 2 selected</span>
            </div>
          </div>

          {/* Item Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {compareItems.map((item) => (
              <div
                key={item.id}
                className="relative group bg-slate-800 p-1.5 rounded-xl border border-slate-700 flex items-center gap-2 min-w-[120px] max-w-[160px] flex-shrink-0"
              >
                <img
                  src={item.image || (item.images && item.images[0]) || '/images/prem-main.jpg'}
                  alt={item.name}
                  className="w-8 h-8 object-cover rounded-lg bg-white p-0.5"
                  onError={(e) => { e.target.src = '/images/prem-main.jpg'; }}
                />
                <span className="text-[11px] font-semibold text-slate-200 truncate flex-1">{item.name}</span>
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="w-5 h-5 rounded-full bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center text-xs transition"
                  title="Remove from compare"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <Link
            to="/compare"
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition hover:scale-102"
          >
            <span>COMPARE NOW ({compareCount}/2)</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </>
  );
}
