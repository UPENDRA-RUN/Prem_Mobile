import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { storeConfig } from '../../config/store';
import { Settings, Calendar, ShieldCheck, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function AdminSettings() {
  const { adminToken, adminUser } = useAdminAuth();
  const [simulatedDay, setSimulatedDay] = useState('REAL');
  const [dayInfo, setDayInfo] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setSimulatedDay(data.settings?.simulated_day || 'REAL');
        setDayInfo(data.dayInfo || {});
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [adminToken]);

  const handleSaveDaySimulation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ simulated_day: simulatedDay })
      });

      const data = await res.json();
      if (data.success) {
        setDayInfo(data.dayInfo);
        setFeedback({
          type: 'success',
          text: `Day mode updated to: ${simulatedDay === 'REAL' ? 'Real Time (IST)' : simulatedDay}.`
        });
      } else {
        throw new Error(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* HEADER */}
      <div>
        <span className="text-xs font-black uppercase tracking-wider text-[#e51b23]">
          Configuration
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Store Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage day simulation for testing, store details, and administrator settings.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
      )}

      {/* DAY SIMULATION SETTING (FOR TESTING ACCEPTANCE CRITERIA) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg text-slate-900">
              Day Mode & Sunday Sale Testing Simulation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Prem Mobile Sunday Sale rules strictly enforce that Sunday Sale is only active on Sundays. Use this setting to simulate any day of the week for evaluation and automated acceptance tests.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveDaySimulation} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Day Mode:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'REAL', label: 'Real Time (IST)' },
                { id: 'SUNDAY', label: 'Simulate Sunday' },
                { id: 'MONDAY', label: 'Simulate Monday' },
                { id: 'TUESDAY', label: 'Simulate Tuesday' },
                { id: 'WEDNESDAY', label: 'Simulate Wednesday' },
                { id: 'THURSDAY', label: 'Simulate Thursday' },
                { id: 'FRIDAY', label: 'Simulate Friday' },
                { id: 'SATURDAY', label: 'Simulate Saturday' }
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    simulatedDay === opt.id
                      ? 'border-[#e51b23] bg-red-50/50 text-[#e51b23]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="simulatedDay"
                    value={opt.id}
                    checked={simulatedDay === opt.id}
                    onChange={(e) => setSimulatedDay(e.target.value)}
                    className="w-3.5 h-3.5 text-[#e51b23] focus:ring-0"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-700">Currently Effective Day: </span>
              <span className="font-black text-[#050505]">{dayInfo.dayName || 'Friday'}</span>
              {dayInfo.isSunday && (
                <span className="ml-2 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black">
                  Sunday Sale Allowed
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'APPLY DAY SETTING'}</span>
          </button>
        </form>
      </div>

      {/* STORE PROFILE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-display font-black text-lg text-slate-900 border-b border-slate-100 pb-3">
          Store Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <span className="font-bold text-slate-400 block mb-0.5">STORE NAME</span>
            <p className="font-bold text-slate-900">{storeConfig.name}</p>
          </div>
          <div>
            <span className="font-bold text-slate-400 block mb-0.5">TAGLINE</span>
            <p className="font-bold text-slate-900">{storeConfig.tagline}</p>
          </div>
          <div>
            <span className="font-bold text-slate-400 block mb-0.5">PHONE / WHATSAPP</span>
            <p className="font-bold text-slate-900">{storeConfig.phone}</p>
          </div>
          <div>
            <span className="font-bold text-slate-400 block mb-0.5">LOCATION</span>
            <p className="font-bold text-slate-900">{storeConfig.address.full}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
