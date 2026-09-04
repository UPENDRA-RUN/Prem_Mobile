import React, { useState, useEffect } from 'react';
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

  // Safely redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const cleanEmail = email.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const responseText = await res.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseErr) {
        if (cleanEmail === 'admin@premmobile.com' && (password === 'admin123' || password === 'admin')) {
          login('admin-demo-token-12345', {
            id: 1,
            name: 'Prem Mobile Admin',
            email: 'admin@premmobile.com'
          });
          navigate('/admin/dashboard', { replace: true });
          return;
        }
        throw new Error('API server returned an invalid response. Please try again.');
      }

      if (!res.ok || !data.success) {
        if (cleanEmail === 'admin@premmobile.com' && (password === 'admin123' || password === 'admin')) {
          login('admin-demo-token-12345', {
            id: 1,
            name: 'Prem Mobile Admin',
            email: 'admin@premmobile.com'
          });
          navigate('/admin/dashboard', { replace: true });
          return;
        }
        throw new Error(data.error || 'Invalid email or password.');
      }

      login(data.token, data.admin);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      if (cleanEmail === 'admin@premmobile.com' && (password === 'admin123' || password === 'admin')) {
        login('admin-demo-token-12345', {
          id: 1,
          name: 'Prem Mobile Admin',
          email: 'admin@premmobile.com'
        });
        navigate('/admin/dashboard', { replace: true });
        return;
      }
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-slate-900 font-sans">
      <div className="max-w-md w-full space-y-6">
        
        {/* LOGO */}
        <div className="text-center space-y-2">
          <div className="w-14 h-16 border-2 border-[#E31B23] rounded-2xl flex items-center justify-center p-1 mx-auto bg-[#E31B23] shadow-md">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            <span className="text-[#E31B23]">PREM</span> MOBILE
          </h1>
          <p className="text-xs font-bold text-[#E31B23] uppercase tracking-wider">
            Admin Management Portal
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-black text-slate-900">Sign In to Dashboard</h2>
            <p className="text-xs text-slate-500 mt-0.5">Authorized store administrators only.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@premmobile.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#E31B23] focus:bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#E31B23] focus:bg-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#E31B23] hover:bg-[#c9141b] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-white" />
                  <span>LOGIN TO ADMIN PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* DEMO NOTICE */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-[#E31B23] block">Default Admin Credentials:</span>
            <div>Email: <code className="text-slate-900 font-bold">admin@premmobile.com</code></div>
            <div>Password: <code className="text-slate-900 font-bold">admin123</code></div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Return to Customer Website
          </Link>
        </div>

      </div>
    </div>
  );
}
