import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Smartphone,
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Crown,
  Sparkles,
  Truck,
  Headphones,
  Award,
  BadgePercent,
  Flame,
  ArrowLeft,
  Store,
  Check,
  ShoppingBag,
  Clock
} from 'lucide-react';

export default function WelcomeLogin({ defaultMode = 'welcome' }) {
  // modes: 'welcome' | 'customer_login' | 'customer_signup' | 'admin_login'
  const [mode, setMode] = useState(defaultMode);
  const navigate = useNavigate();
  const location = useLocation();

  const { login: customerLogin, isAuthenticated: isCustomerAuthenticated } = useCustomerAuth();
  const { login: adminLogin, isAuthenticated: isAdminAuthenticated } = useAdminAuth();

  // If already logged in, redirect appropriately
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    } else if (isCustomerAuthenticated && mode === 'welcome') {
      navigate('/', { replace: true });
    }
  }, [isCustomerAuthenticated, isAdminAuthenticated, mode, navigate]);

  // Customer Form State
  const [customerIdentifier, setCustomerIdentifier] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Customer Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('admin@premmobile.com');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(location.state?.message || '');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. HANDLE CUSTOMER LOGIN
  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Requirement 4: Empty validation
    if (!customerIdentifier.trim() || !customerPassword.trim()) {
      setErrorMessage('Please enter your login details.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: customerIdentifier.trim(),
          password: customerPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Incorrect email/mobile number or password.');
      }

      customerLogin(data.token, data.user);
      setSuccessMessage(`Welcome back, ${data.user.name}!`);
      setTimeout(() => {
        const destination = location.state?.from || '/';
        navigate(destination, { replace: true });
      }, 600);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. HANDLE CUSTOMER REGISTRATION
  const handleCustomerRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signupName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signupMobile.trim()) {
      setErrorMessage('Please enter your mobile number.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          mobile: signupMobile.trim(),
          email: signupEmail.trim(),
          password: signupPassword,
          confirmPassword: signupConfirmPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      customerLogin(data.token, data.user);
      setSuccessMessage(`Account created! Welcome to Prem Mobile, ${data.user.name}!`);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 700);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. HANDLE ADMIN LOGIN
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setErrorMessage('Please enter your administrator email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail.trim(),
          password: adminPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      adminLogin(data.token, data.admin);
      setSuccessMessage('Administrator verified! Opening Dashboard...');
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 600);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#ffd000] selection:text-black">
      
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ffd000]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-[#e51b23]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* TOP HEADER BAR */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
        {/* BRAND LOGO LOCKUP */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-10 border-2 border-white rounded-lg flex items-center justify-center p-0.5 relative flex-shrink-0 bg-black shadow-[0_0_15px_rgba(255,208,0,0.3)]">
            <div className="w-1.5 h-0.5 bg-white rounded-full absolute top-1" />
            <Smartphone className="w-4 h-4 text-[#ffd000]" />
          </div>
          <div className="flex flex-col">
            <div className="font-display font-black text-2xl tracking-tight leading-none">
              <span className="text-[#e51b23]">PREM</span> <span className="text-white">MOBILE</span>
            </div>
            <span className="text-[10px] font-bold text-[#ffd000] tracking-tight mt-1 leading-tight flex items-center gap-1">
              Deal Aise Jo Deewana Bana De 🔥
            </span>
          </div>
        </Link>

        {/* TOP RIGHT TAGLINE */}
        <div className="hidden md:flex items-center gap-2 text-right">
          <Crown className="w-5 h-5 text-[#ffd000] fill-[#ffd000]" />
          <span className="font-display font-black text-sm italic tracking-wide text-white">
            Deal Aise Jo <span className="text-[#ffd000]">Deewana Bana De</span> 🔥
          </span>
        </div>
      </header>

      {/* MAIN CONTAINER (SPLIT HERO + CARD LAYOUT MATCHING LoginPage.png) */}
      <main className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 lg:py-8 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: BRAND PROPS, HERO VISUAL & HIGHLIGHTS        */}
          {/* ========================================================= */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 select-none">
            
            {/* 4 HIGHLIGHT PILLARS ON THE LEFT */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[#ffd000]/15 text-[#ffd000] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">100% ORIGINAL</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Genuine Products</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[#ffd000]/15 text-[#ffd000] flex items-center justify-center flex-shrink-0">
                  <BadgePercent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">BEST DEALS</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Everyday Low Prices</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[#ffd000]/15 text-[#ffd000] flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">CUSTOMER SUPPORT</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Always Here for You</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[#ffd000]/15 text-[#ffd000] flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">FAST SERVICE</h4>
                  <p className="text-[11px] text-slate-400 font-medium">In Gwalior & Beyond</p>
                </div>
              </div>
            </div>

            {/* FOUNDER & GRAPHIC SHOWCASE */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-gradient-to-b from-[#111622] to-[#0a0d14] p-6 shadow-2xl flex flex-col items-center text-center">
              
              {/* CIRCULAR SEAL */}
              <div className="w-24 h-24 rounded-full border-4 border-[#ffd000] bg-black/90 p-2 shadow-[0_0_30px_rgba(255,208,0,0.3)] flex flex-col items-center justify-center mb-3">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">FOLLOW</span>
                <span className="text-xs font-black text-[#ffd000] leading-none my-0.5">PREM</span>
                <span className="text-xs font-black text-white leading-none">MOBILE</span>
                <span className="text-[8px] font-bold text-slate-400 mt-0.5 leading-none">GWALIOR</span>
              </div>

              {/* WELCOME BACK BANNER */}
              <div className="relative my-2 w-full max-w-md">
                <div className="bg-[#ffd000] text-[#050505] font-display font-black text-2xl px-6 py-2 rounded-xl rotate-[-1deg] shadow-lg inline-block">
                  Welcome to Prem Mobile!
                </div>
                <p className="text-xs text-slate-300 font-medium mt-3">
                  Shop premium earbuds, chargers, smartwatches, covers & grab exclusive Sunday Sale discounts.
                </p>
              </div>

              {/* 4 FEATURE QUICK ICONS */}
              <div className="grid grid-cols-4 gap-2 w-full mt-5 pt-4 border-t border-slate-800">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 text-[#ffd000] flex items-center justify-center mb-1">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">Shop Faster</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 text-[#ffd000] flex items-center justify-center mb-1">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">Favorites</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 text-[#ffd000] flex items-center justify-center mb-1">
                    <BadgePercent className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">Sunday Deals</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 text-[#ffd000] flex items-center justify-center mb-1">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">Easy Orders</span>
                </div>
              </div>

              {/* STORE LOCATION PIN */}
              <div className="mt-4 pt-3 text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5 border-t border-slate-800/60 w-full">
                <span className="text-amber-400">📍</span>
                <span>Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.)</span>
              </div>
            </div>

            {/* TRUST BADGES ROW */}
            <div className="flex items-center justify-around text-xs font-bold text-slate-400 pt-1">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Safe & Secure</span>
              <span className="flex items-center gap-1.5"><Headphones className="w-4 h-4 text-[#ffd000]" /> Quick Support</span>
              <span className="flex items-center gap-1.5"><Store className="w-4 h-4 text-amber-400" /> Trusted Local Store</span>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: CENTERED GLASS CARD (WELCOME & AUTH FORMS)  */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 w-full max-w-xl mx-auto">
            <div className="bg-[#0b0e14]/90 backdrop-blur-xl rounded-[32px] p-6 sm:p-10 border-2 border-amber-400/50 shadow-[0_0_60px_rgba(255,208,0,0.16)] relative transition-all duration-300">
              
              {/* CARD LOGO HEADER */}
              <div className="text-center space-y-1.5 mb-6">
                <div className="w-12 h-14 border-2 border-white rounded-xl flex items-center justify-center p-0.5 mx-auto bg-black shadow-[0_0_20px_rgba(255,208,0,0.3)]">
                  <Smartphone className="w-7 h-7 text-[#ffd000]" />
                </div>
                <h2 className="font-display font-black text-xl text-white tracking-tight leading-tight">
                  <span className="text-[#e51b23]">PREM</span> MOBILE
                </h2>
                <p className="text-[11px] font-bold text-[#ffd000] uppercase tracking-wider flex items-center justify-center gap-1">
                  <span>Deal Aise Jo Deewana Bana De</span> 🔥
                </p>
              </div>

              {/* ERROR / SUCCESS ALERTS */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/60 text-red-200 text-xs font-bold flex items-center gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/60 text-emerald-200 text-xs font-bold flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* VIEW 1: FIRST VISIT WELCOME / ROLE SELECTION SCREEN                */}
              {/* (Requirement 1, 14, 15, 23, 25)                                    */}
              {/* ------------------------------------------------------------------ */}
              {mode === 'welcome' && (
                <div className="space-y-6">
                  <div className="text-center space-y-1 border-b border-slate-800 pb-4">
                    <h3 className="text-2xl font-black text-white">Welcome to Prem Mobile</h3>
                    <p className="text-sm text-slate-400 italic">
                      "Your one-stop shop for mobile accessories."
                    </p>
                    <p className="text-xs text-slate-500 pt-1 font-medium">
                      Choose how you want to continue:
                    </p>
                  </div>

                  {/* 1. CUSTOMER OPTION (PRIMARY HIGHLIGHTED CTA - Requirement 25) */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-[#ffd000]/60 hover:border-[#ffd000] transition-all space-y-3 group shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#ffd000] text-[#050505] flex items-center justify-center font-black flex-shrink-0 shadow-md">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-black text-base text-white tracking-wide uppercase">
                            👤 CUSTOMER
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#ffd000] text-black text-[9px] font-black uppercase">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Browse products, explore Sunday Sale deals & place orders easily.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setErrorMessage('');
                        setMode('customer_login');
                      }}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-[#050505] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg cursor-pointer"
                    >
                      <span>Continue as Customer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 2. ADMIN OPTION (SECONDARY SEPARATE OPTION - Requirement 1, 25) */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 border border-slate-700">
                        <Lock className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <span className="font-display font-black text-sm text-slate-200 tracking-wide uppercase">
                          🔐 ADMIN
                        </span>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Manage store inventory, Sunday Sales, product catalog & orders.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setErrorMessage('');
                        setMode('admin_login');
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Admin Login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* DIRECT GUEST STORE BROWSING */}
                  <div className="text-center pt-1 border-t border-slate-800/60">
                    <Link
                      to="/"
                      className="text-xs text-slate-400 hover:text-[#ffd000] font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Or browse catalog directly as guest</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* VIEW 2: CUSTOMER LOGIN (Requirement 2, 4)                          */}
              {/* ------------------------------------------------------------------ */}
              {mode === 'customer_login' && (
                <div className="space-y-5">
                  
                  {/* HEADER & BACK BUTTON */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-xl font-black text-white">Customer Login</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Access your account to explore products, offers and more.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setMode('welcome');
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back</span>
                    </button>
                  </div>

                  <form onSubmit={handleCustomerLogin} className="space-y-4">
                    {/* MOBILE NUMBER / EMAIL */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Mobile Number / Email
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={customerIdentifier}
                          onChange={(e) => setCustomerIdentifier(e.target.value)}
                          placeholder="Enter your email or mobile number"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd000] focus:ring-2 focus:ring-[#ffd000]/30 font-medium transition-all"
                        />
                      </div>
                    </div>

                    {/* PASSWORD */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={customerPassword}
                          onChange={(e) => setCustomerPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd000] focus:ring-2 focus:ring-[#ffd000]/30 font-medium transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* REMEMBER ME & FORGOT PASSWORD */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded bg-slate-900 border-slate-700 text-[#ffd000] focus:ring-0 w-4 h-4"
                        />
                        <span>Remember me</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => alert('For password reset support, please contact Prem Mobile support at +91 9893947477.')}
                        className="text-xs text-slate-400 hover:text-[#ffd000] font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-[#050505] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg disabled:opacity-50 cursor-pointer mt-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>LOGIN</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* BOTTOM: SIGN UP CTA */}
                  <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 space-y-2">
                    <p>Don't have an account?</p>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setMode('customer_signup');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#ffd000] border border-slate-700 font-black text-xs uppercase tracking-wider transition-colors"
                    >
                      CREATE ACCOUNT
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* VIEW 3: CUSTOMER SIGN UP (Requirement 3)                           */}
              {/* ------------------------------------------------------------------ */}
              {mode === 'customer_signup' && (
                <div className="space-y-5">
                  
                  {/* HEADER & BACK BUTTON */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-xl font-black text-white">Create Account</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Join Prem Mobile for special deals and fast checkout.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setMode('customer_login');
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back</span>
                    </button>
                  </div>

                  <form onSubmit={handleCustomerRegister} className="space-y-3.5">
                    {/* FULL NAME */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd000] font-medium"
                        />
                      </div>
                    </div>

                    {/* MOBILE NUMBER */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          value={signupMobile}
                          onChange={(e) => setSignupMobile(e.target.value)}
                          placeholder="10-digit mobile number"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd000] font-medium"
                        />
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="name@example.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd000] font-medium"
                        />
                      </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd000] font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd000] font-medium"
                        />
                      </div>
                    </div>

                    {/* REGISTER BUTTON */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-[#050505] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg disabled:opacity-50 cursor-pointer mt-3"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>CREATE ACCOUNT</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* BOTTOM: SWITCH TO LOGIN */}
                  <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setMode('customer_login');
                      }}
                      className="text-[#ffd000] font-black hover:underline ml-1"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* VIEW 4: ADMIN LOGIN (Requirement 6, 7)                             */}
              {/* ------------------------------------------------------------------ */}
              {mode === 'admin_login' && (
                <div className="space-y-5">
                  
                  {/* HEADER & BACK BUTTON */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ffd000]/15 text-[#ffd000] text-[10px] font-black uppercase mb-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Authorized Personnel Only</span>
                      </div>
                      <h3 className="text-xl font-black text-white">Admin Login</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Access store management, sales, and catalog dashboard.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setMode('welcome');
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back</span>
                    </button>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    {/* ADMIN EMAIL */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Admin Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="admin@premmobile.com"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd000] font-medium"
                        />
                      </div>
                    </div>

                    {/* PASSWORD */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Enter admin password"
                          required
                          className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd000] font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* ADMIN LOGIN BUTTON */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-[#050505] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg disabled:opacity-50 cursor-pointer mt-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Verifying Admin...</span>
                        </>
                      ) : (
                        <>
                          <span>LOGIN TO DASHBOARD</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* SECURITY NOTICE - Requirement 6 */}
                  <div className="pt-3 border-t border-slate-800 text-center text-[11px] text-slate-500">
                    <p>Admin accounts are managed securely by Prem Mobile store management.</p>
                  </div>
                </div>
              )}

              {/* CARD FOOTER: SECURITY BADGE */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Your data is safe with us</span>
                </span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-20 py-4 border-t border-slate-900 bg-black/40 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Prem Mobile Gwalior. All rights reserved. Deal Aise Jo Deewana Bana De 🔥</p>
      </footer>

    </div>
  );
}
