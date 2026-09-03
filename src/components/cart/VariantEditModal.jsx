import React, { useState, useEffect } from 'react';
import { X, Check, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function VariantEditModal({ item, isOpen, onClose }) {
  const { updateItemVariant } = useCart();
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    if (item && item.selectedVariants) {
      setSelectedVariants({ ...item.selectedVariants });
    } else if (item && item.variants) {
      const defaults = {};
      Object.keys(item.variants).forEach((key) => {
        defaults[key] = item.variants[key][0];
      });
      setSelectedVariants(defaults);
    }
  }, [item]);

  if (!isOpen || !item || !item.variants) return null;

  const handleSelectOption = (categoryKey, optionValue) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [categoryKey]: optionValue
    }));
  };

  const handleSave = () => {
    updateItemVariant(item.cartItemId || item.id, selectedVariants);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-5 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#050505] text-[#FFD400] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-[#FFD400]" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-[#050505] uppercase tracking-wide">
                Change Variation
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">{item.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Variant Groups */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {Object.entries(item.variants).map(([category, options]) => (
            <div key={category} className="space-y-2">
              <span className="text-xs font-bold text-slate-700 capitalize flex items-center gap-1.5">
                Select {category}:
              </span>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => {
                  const isSelected = selectedVariants[category] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(category, opt)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-[#050505] text-[#FFD400] border-[#050505] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FFD400]" />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md transition-transform hover:scale-102"
          >
            Update Item
          </button>
        </div>
      </div>
    </div>
  );
}
