import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { parseResponseJson } from '../../utils/apiHelper';
import { storeConfig as defaultStoreConfig } from '../../config/store';
import {
  Settings,
  Store,
  Clock,
  MapPin,
  Phone,
  Mail,
  Tag,
  Save,
  CheckCircle2,
  AlertCircle,
  Calendar,
  X,
  RefreshCw
} from 'lucide-react';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AdminSettings() {
  const { adminToken } = useAdminAuth();

  const [formData, setFormData] = useState({
    store_name: defaultStoreConfig.name,
    store_tagline: defaultStoreConfig.tagline,
    store_phone: defaultStoreConfig.phone,
    store_whatsapp: defaultStoreConfig.whatsapp,
    store_address: defaultStoreConfig.address,
    store_city: defaultStoreConfig.city,
    store_state: defaultStoreConfig.state,
    store_landmark: defaultStoreConfig.landmark,
    store_email: defaultStoreConfig.email,
    store_timing: defaultStoreConfig.timing,
    store_closed_day: defaultStoreConfig.closedDay || 'Tuesday'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchSettings = async () => {
    if (!adminToken) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await parseResponseJson(res);
      if (data.success && data.storeConfig) {
        setFormData({
          store_name: data.storeConfig.name || defaultStoreConfig.name,
          store_tagline: data.storeConfig.tagline || defaultStoreConfig.tagline,
          store_phone: data.storeConfig.phone || defaultStoreConfig.phone,
          store_whatsapp: data.storeConfig.whatsapp || defaultStoreConfig.whatsapp,
          store_address: data.storeConfig.address || defaultStoreConfig.address,
          store_city: data.storeConfig.city || defaultStoreConfig.city,
          store_state: data.storeConfig.state || defaultStoreConfig.state,
          store_landmark: data.storeConfig.landmark || defaultStoreConfig.landmark,
          store_email: data.storeConfig.email || defaultStoreConfig.email,
          store_timing: data.storeConfig.timing || defaultStoreConfig.timing,
          store_closed_day: data.storeConfig.closedDay || 'Tuesday'
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [adminToken]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await parseResponseJson(res);
      if (data.success) {
        setFeedback({ type: 'success', text: 'Store settings updated successfully!' });
      } else {
        throw new Error(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-16">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#e51b23]">
            Configuration
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Store Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage store details, contact info, and operating hours.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors self-start"
          title="Refresh Settings"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* FEEDBACK TOAST */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-fade-in ${
          feedback.type === 'error'
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">

        {/* STORE IDENTITY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#e51b23]/10 text-[#e51b23] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-slate-900">Store Identity</h2>
              <p className="text-xs text-slate-500">Name, tagline, and branding details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Store Name
              </label>
              <input
                type="text"
                value={formData.store_name}
                onChange={(e) => handleChange('store_name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tagline
              </label>
              <input
                type="text"
                value={formData.store_tagline}
                onChange={(e) => handleChange('store_tagline', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* CONTACT INFORMATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-slate-900">Contact Information</h2>
              <p className="text-xs text-slate-500">Phone, WhatsApp, and email for customer contact</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.store_phone}
                onChange={(e) => handleChange('store_phone', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                WhatsApp Number (with Country Code)
              </label>
              <input
                type="tel"
                value={formData.store_whatsapp}
                onChange={(e) => handleChange('store_whatsapp', e.target.value)}
                placeholder="e.g. 918770559251"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={formData.store_email}
                onChange={(e) => handleChange('store_email', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* LOCATION & ADDRESS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-slate-900">Store Location</h2>
              <p className="text-xs text-slate-500">Physical store address and landmark details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Address
              </label>
              <input
                type="text"
                value={formData.store_address}
                onChange={(e) => handleChange('store_address', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  value={formData.store_city}
                  onChange={(e) => handleChange('store_city', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  State
                </label>
                <input
                  type="text"
                  value={formData.store_state}
                  onChange={(e) => handleChange('store_state', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Landmark
              </label>
              <input
                type="text"
                value={formData.store_landmark}
                onChange={(e) => handleChange('store_landmark', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* OPERATING HOURS & CLOSED DAY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-slate-900">Operating Hours</h2>
              <p className="text-xs text-slate-500">Store timing and weekly closed day</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Store Timing
              </label>
              <input
                type="text"
                value={formData.store_timing}
                onChange={(e) => handleChange('store_timing', e.target.value)}
                placeholder="e.g. 10:00 AM – 9:30 PM"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Closed On (Weekly)</span>
              </label>
              <select
                value={formData.store_closed_day}
                onChange={(e) => handleChange('store_closed_day', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#050505] transition-colors cursor-pointer"
              >
                <option value="">No weekly closed day</option>
                {DAYS_OF_WEEK.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Preview</span>
            <p className="font-medium text-slate-800">
              <strong>{formData.store_name}</strong> — {formData.store_timing}
            </p>
            <p className="text-slate-600">
              {formData.store_closed_day
                ? `Closed every ${formData.store_closed_day}`
                : 'Open all 7 days'}
            </p>
            <p className="text-slate-500">
              📍 {formData.store_address}, {formData.store_city}, {formData.store_state}
            </p>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={fetchSettings}
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Reset Changes
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-xl bg-[#ffd000] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'SAVE SETTINGS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
