import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storeConfig } from '../config/store';
import { useCart } from '../context/CartContext';
import DeleteAccountModal from '../components/common/DeleteAccountModal';
import SupportModal from '../components/common/SupportModal';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Pencil,
  Save,
  CheckCircle2,
  Loader2,
  Lock,
  Unlock,
  RotateCcw,
  Smartphone,
  ShieldCheck,
  Building,
  Trash2,
  AlertTriangle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'premmobile_user_profile';

export default function AccountSettings() {
  const { showToast } = useCart();

  // Initial default state
  const initialData = {
    fullName: 'Rahul Sharma',
    phone: '9893947477',
    email: 'rahul.gwalior@gmail.com',
    address: 'Flat 302, Pinto Park Chauraha, Jaderua Gate',
    city: 'Gwalior (M.P.)',
    pickupPreference: 'Pinto Park Store Pickup'
  };

  // State management
  const [profile, setProfile] = useState(initialData);
  const [savedProfile, setSavedProfile] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setSavedProfile(parsed);
      }
    } catch (e) {
      console.error('Failed to load profile', e);
    }
  }, []);

  // Determine if form has un-saved changes
  const isDirty = JSON.stringify(profile) !== JSON.stringify(savedProfile);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value
    }));
    setSaveSuccess(false);
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleCancelEdit = () => {
    setProfile(savedProfile);
    setIsEditing(false);
    setSaveSuccess(false);
  };

  const handleSaveFlow = (e) => {
    e.preventDefault();
    if (!isDirty || isSaving) return;

    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
      } catch (err) {}

      setSavedProfile(profile);
      setIsSaving(false);
      setIsEditing(false);

      setSaveSuccess(true);
      showToast('Profile Details Saved Successfully!');
    }, 1200);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Banner Header */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#FFD400]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              <span>CUSTOMER PROFILE SETTINGS</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              MY ACCOUNT DETAILS
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage your personal information, contact numbers, and store pickup preferences at Prem Mobile.
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={handleEnableEdit}
              className="py-3 px-5 rounded-2xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform hover:scale-103 flex-shrink-0"
            >
              <Pencil className="w-4 h-4" />
              <span>EDIT DETAILS</span>
            </button>
          ) : (
            <button
              onClick={handleCancelEdit}
              className="py-3 px-4 rounded-2xl bg-[#222222] hover:bg-[#333333] text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Cancel Editing</span>
            </button>
          )}
        </div>

        {/* SUCCESS BANNER */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 shadow-sm flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-950">Changes Saved Successfully!</h4>
                <p className="text-xs text-emerald-800 font-medium">
                  Your updated profile details are now safely locked in for your future store pickup orders.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSaveSuccess(false)}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* PROFILE FORM CONTAINER */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Unlock className="w-5 h-5 text-amber-500" />
              ) : (
                <Lock className="w-5 h-5 text-slate-400" />
              )}
              <h3 className="font-display font-black text-lg text-[#050505] uppercase tracking-wider">
                {isEditing ? 'EDITING PROFILE DETAILS' : 'READ-ONLY PROFILE VIEW'}
              </h3>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isEditing ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600'
            }`}>
              {isEditing ? '🔓 Edit Mode Active' : '🔒 Locked / Read-Only'}
            </span>
          </div>

          <form onSubmit={handleSaveFlow} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isEditing
                        ? 'border-2 border-slate-300 focus:border-[#FFD400] bg-white text-[#050505] shadow-xs'
                        : 'border border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isEditing
                        ? 'border-2 border-slate-300 focus:border-[#FFD400] bg-white text-[#050505] shadow-xs'
                        : 'border border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isEditing
                        ? 'border-2 border-slate-300 focus:border-[#FFD400] bg-white text-[#050505] shadow-xs'
                        : 'border border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Pickup / Delivery Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Store Pickup Preference
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    disabled={!isEditing}
                    value={profile.pickupPreference}
                    onChange={(e) => handleInputChange('pickupPreference', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isEditing
                        ? 'border-2 border-slate-300 focus:border-[#FFD400] bg-white text-[#050505] shadow-xs cursor-pointer'
                        : 'border border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <option value="Pinto Park Store Pickup">Pinto Park Store Pickup (Free Screen Guard)</option>
                    <option value="Gwalior Local Express Delivery">Gwalior Local Express Delivery</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Default Delivery & Store Address Landmark
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isEditing
                      ? 'border-2 border-slate-300 focus:border-[#FFD400] bg-white text-[#050505] shadow-xs'
                      : 'border border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* STICKY BOTTOM ACTION BAR */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Your profile data is encrypted & secured locally.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!isEditing || !isDirty || isSaving}
                  className={`py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${
                    isSaving
                      ? 'bg-[#050505] text-[#FFD400] shadow-md cursor-wait'
                      : isEditing && isDirty
                      ? 'bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] shadow-xl animate-pulse ring-4 ring-[#FFD400]/40 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 text-[#FFD400] animate-spin" />
                      <span>SAVING CHANGES...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>
                        {!isEditing
                          ? 'NO CHANGES TO SAVE'
                          : isDirty
                          ? 'SAVE CHANGES NOW'
                          : 'NO CHANGES MADE'}
                      </span>
                    </>
                  )}
                </button>

              </div>

            </div>

          </form>

        </div>

        {/* CUSTOMER SUPPORT DESK LINK & CARD */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#FFD400]/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-display font-black text-base text-[#FFD400] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-5 h-5 text-[#FFD400]" />
              <span>NEED SUPPORT OR HELP WITH YOUR ORDER?</span>
            </h4>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Have questions about your order, store pickup, free screen guard fitting, or warranty claims? Open our support desk to choose your preferred contact channel.
            </p>
          </div>

          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="py-3 px-5 rounded-2xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 flex-shrink-0 transition-transform hover:scale-102"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Open Support Desk</span>
          </button>
        </div>

        {/* ACCOUNT CLOSURE & PRIVACY */}
        <div className="bg-red-50/60 rounded-3xl border border-red-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-display font-black text-base text-[#050505] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#E31B23]" />
              <span>ACCOUNT CLOSURE & PRIVACY</span>
            </h4>
            <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
              If you wish to close your account and remove saved data, you can delete your account at any time. You can still shop anytime as a guest without an account.
            </p>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-red-50 text-[#E31B23] border border-red-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-[#E31B23]" />
            <span>Delete Account & Data</span>
          </button>
        </div>

      </div>

      {/* MODALS */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}
