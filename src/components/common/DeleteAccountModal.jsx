import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShieldAlert, CheckCircle2, Heart, ArrowRight, UserCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const LOCAL_STORAGE_KEY = 'premmobile_user_profile';

export default function DeleteAccountModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Terms & Feedback -> 2: Confirmation Screen
  const [feedbackReason, setFeedbackReason] = useState('');
  const [customFeedback, setCustomFeedback] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const feedbackOptions = [
    "I don't use this account anymore",
    "I prefer shopping directly at the Pinto Park physical store",
    "Privacy or data management preference",
    "Created a duplicate account"
  ];

  const handleConfirmDelete = () => {
    setIsDeleting(true);

    setTimeout(() => {
      // Delete user data from localStorage
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (e) {}

      setIsDeleting(false);
      setStep(2); // Move to respectful confirmation screen
      showToast('Account deleted successfully');
    }, 1000);
  };

  const handleFinishAndReturn = () => {
    onClose();
    setStep(1);
    navigate('/shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={step === 1 ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 border border-slate-200 space-y-6">
        
        {/* Step 1: Explanation & Polite Feedback */}
        {step === 1 ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-[#E31B23]" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-[#050505] uppercase tracking-wider">
                    DELETE ACCOUNT & DATA
                  </h3>
                  <p className="text-xs text-slate-500">Prem Mobile • Pinto Park Gwalior</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-black hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* EXPLAIN WHAT IT MEANS TO DELETE ACCOUNT BEFORE CONFIRMING */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <h4 className="font-bold text-[#050505] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>What happens when you close your account?</span>
              </h4>
              <ul className="space-y-1.5 pl-5 list-disc text-slate-600 leading-relaxed">
                <li>Your saved delivery address, name, and store preferences will be permanently removed.</li>
                <li>Your saved wishlist items and active cart items will be cleared.</li>
                <li>Physical store receipts and GST invoices for past purchases remain valid at Pinto Park, Gwalior for warranty claims.</li>
                <li><strong>100% Guest Access:</strong> You can continue browsing and ordering products anytime as a guest without an account.</li>
              </ul>
            </div>

            {/* POLITELY ASK FOR FEEDBACK (OPTIONAL) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Optional: Help us improve by sharing why you're leaving
              </label>

              <div className="space-y-1.5">
                {feedbackOptions.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      feedbackReason === opt
                        ? 'bg-slate-100 border-[#050505] font-bold text-[#050505]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delete_reason"
                      value={opt}
                      checked={feedbackReason === opt}
                      onChange={() => setFeedbackReason(opt)}
                      className="accent-[#050505]"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider"
              >
                Keep My Account
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E31B23] hover:bg-[#cc141c] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Deleting Account...' : 'Confirm Account Deletion'}</span>
              </button>
            </div>
          </>
        ) : (
          /* Step 2: Respectful Deletion Confirmation Screen */
          <div className="py-4 text-center space-y-5 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-2xl text-[#050505]">
                YOUR ACCOUNT HAS BEEN DELETED
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for being part of <strong>Prem Mobile</strong>! Your personal account details have been removed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 text-left">
              <UserCheck className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <span>You are always welcome back to browse products, check Sunday Sale deals, or order items as a guest anytime!</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-center">
              <button
                onClick={handleFinishAndReturn}
                className="w-full py-3.5 px-6 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
              >
                <span>RETURN TO SHOP AS GUEST</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
