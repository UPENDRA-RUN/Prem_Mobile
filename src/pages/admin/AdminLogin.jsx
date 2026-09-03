import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Smartphone, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('admin@premmobile.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      login(data.token, data.admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-slate-100 font-sans">
      <div className="max-w-md w-full space-y-6">
        
        {/* LOGO */}
        <div className="text-center space-y-2">
          <div className="w-14 h-16 border-2 border-white rounded-2xl flex items-center justify-center p-1 mx-auto bg-black shadow-[0_0_25px_rgba(255,208,0,0.3)]">
            <Smartphone className="w-8 h-8 text-[#ffd000]" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            <span className="text-[#e51b23]">PREM</span> MOBILE
          </h1>
          <p className="text-xs font-bold text-[#ffd000] uppercase tracking-wider">
            Admin Management Portal
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-[#0f172a] rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-black text-white">Sign In to Dashboard</h2>
            <p className="text-xs text-slate-400 mt-0.5">Authorized store administrators only.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-900/30 border border-red-500 text-red-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@premmobile.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd000] focus:ring-2 focus:ring-[#ffd000]/30 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd000] focus:ring-2 focus:ring-[#ffd000]/30 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] disabled:bg-slate-700 disabled:text-slate-500 text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-102 mt-2"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#050505]" />
                  <span>LOGIN TO ADMIN PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* DEMO NOTICE */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-[#ffd000] block">Default Admin Credentials:</span>
            <div>Email: <code className="text-slate-200">admin@premmobile.com</code></div>
            <div>Password: <code className="text-slate-200">admin123</code></div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Customer Website
          </Link>
        </div>

      </div>
    </div>
  );
}
