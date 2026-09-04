import { useAdminAuth } from '../../context/AdminAuthContext';
import { parseResponseJson } from '../../utils/apiHelper';
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
      const data = await parseResponseJson(res);
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

      const data = await parseResponseJson(res);
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
          Manage store details and administrator settings.
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
