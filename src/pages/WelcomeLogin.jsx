import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { parseResponseJson } from '../utils/apiHelper';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Crown,
  Truck,
  Headphones,
  BadgePercent,
  Flame,
  ArrowLeft,
  ShoppingBag,
  Heart,
  User,
  Star,
  MapPin,
  Check
} from 'lucide-react';

export default function WelcomeLogin({ defaultMode = 'customer_login' }) {
  // view: 'login' | 'signup'
  const [view, setView] = useState(defaultMode === 'customer_signup' ? 'signup' : 'login');
  
  const navigate = useNavigate();
  const location = useLocation();

  const { login: customerLogin, isAuthenticated: isCustomerAuthenticated } = useCustomerAuth();
  const { login: adminLogin, isAuthenticated: isAdminAuthenticated } = useAdminAuth();

  // If already logged in, redirect to destination
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    } else if (isCustomerAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isCustomerAuthenticated, isAdminAuthenticated, navigate]);

  // Synchronize route changes if loaded via /signup
  useEffect(() => {
    if (location.pathname === '/signup') {
      setView('signup');
    } else {
      setView('login');
    }
  }, [location.pathname]);

  // Unified Login Form State
  const [customerIdentifier, setCustomerIdentifier] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Customer Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(location.state?.message || '');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. UNIFIED LOGIN HANDLER (CUSTOMER & ADMIN)
  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!customerIdentifier.trim() || !customerPassword.trim()) {
      setErrorMessage('Please enter your email or mobile number and password.');
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

      const data = await parseResponseJson(res);
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Incorrect email/mobile number or password.');
      }

      if (data.role === 'ADMIN' || data.user?.role === 'ADMIN' || data.admin) {
        const adminData = data.admin || data.user;
        adminLogin(data.token, adminData);
        customerLogin(data.token, data.user || adminData);
        setSuccessMessage(`Welcome Administrator, ${adminData.name || 'Admin'}! Opening Dashboard...`);
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 600);
      } else {
        customerLogin(data.token, data.user);
        setSuccessMessage(`Welcome back, ${data.user.name}!`);
        setTimeout(() => {
          const destination = location.state?.from || '/';
          navigate(destination, { replace: true });
        }, 600);
      }
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

      const data = await parseResponseJson(res);
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

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-between font-sans relative overflow-x-hidden selection:bg-[#FFD400] selection:text-black">
      
      {/* BACKGROUND DECORATIVE GLOW EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#FFD400]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#F00000]/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
      </div>

      {/* TOP COMPACT HEADER NAV */}
      <header className="relative z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#FFD400] flex items-center justify-center font-black text-black text-sm shadow-md group-hover:scale-105 transition-transform">
            PM
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-base tracking-tight leading-none text-white">
              PREM <span className="text-[#FFD400]">MOBILE</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              Pinto Park, Gwalior
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-300 hover:text-[#FFD400] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#FFD400]/40 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 py-6 sm:py-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT COLUMN: BRAND PROMO & FEATURES (Hidden on small screens) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-6 pr-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD400]/10 border border-[#FFD400]/30 text-[#FFD400] text-xs font-bold mb-3">
                <Crown className="w-3.5 h-3.5" />
                <span>Gwalior's #1 Smartphone Store</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight leading-tight text-white">
                One Login for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-yellow-200 to-white">
                  All Your Needs.
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-normal">
                Access your orders, saved addresses, exclusive offers, or manage store configuration with seamless unified authentication.
              </p>
            </div>

            {/* FEATURES LIST */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center text-[#FFD400] flex-shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Fast & Secure Checkout</h4>
                  <p className="text-[11px] text-slate-400">Save delivery details & track live orders easily.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <BadgePercent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Exclusive Store Discounts</h4>
                  <p className="text-[11px] text-slate-400">Get instant access to Sunday Sale & special combo deals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Encrypted Data & Privacy</h4>
                  <p className="text-[11px] text-slate-400">Your profile and credentials are saved safely.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-[#07090e] flex items-center justify-center text-[10px] font-black text-black">A</div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-300 border-2 border-[#07090e] flex items-center justify-center text-[10px] font-black text-white">R</div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 border-2 border-[#07090e] flex items-center justify-center text-[10px] font-black text-white">S</div>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Joined by <strong className="text-white">10,000+</strong> happy shoppers in Gwalior
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: UNIFIED LOGIN / SIGNUP CARD */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md bg-[#0d1017] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl relative">
              
              {/* TOP LOGO IN CARD */}
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFD400] to-yellow-200 flex items-center justify-center text-black mx-auto shadow-lg shadow-[#FFD400]/20 mb-3">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {view === 'signup' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {view === 'signup'
                    ? 'Join Prem Mobile for special deals, fast checkout and rewards.'
                    : 'Sign in to access your Prem Mobile account.'}
                </p>
              </div>

              {/* ERROR / SUCCESS ALERTS */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/80 text-red-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/80 text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* UNIFIED LOGIN FORM */}
              {view === 'login' && (
                <form onSubmit={handleCustomerLogin} className="space-y-4">
                  {/* EMAIL / MOBILE INPUT */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Email or Mobile Number
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={customerIdentifier}
                        onChange={(e) => setCustomerIdentifier(e.target.value)}
                        placeholder="Enter email or 10-digit mobile"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#151821] border border-[#272b38] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FFD400] focus:ring-1 focus:ring-[#FFD400] font-medium transition-colors"
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={customerPassword}
                        onChange={(e) => setCustomerPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#151821] border border-[#272b38] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FFD400] focus:ring-1 focus:ring-[#FFD400] font-medium transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* REMEMBER ME + FORGOT PASSWORD */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-white select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#FFD400] bg-[#151821] border-slate-700 cursor-pointer"
                      />
                      <span className="font-medium">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        alert('To reset your password, contact Prem Mobile support at +91 9893947477.')
                      }
                      className="text-xs text-[#FFD400] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#FFD400] hover:bg-[#ffe033] text-[#050505] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-150 transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_4px_20px_rgba(255,212,0,0.3)] disabled:opacity-50 cursor-pointer mt-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Login →</span>
                    )}
                  </button>

                  {/* SOCIAL LOGIN */}
                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-800 w-full" />
                    <span className="bg-[#0d1017] px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      OR
                    </span>
                    <div className="border-t border-slate-800 w-full" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          'Google Authentication will be connected in live production. For now, please sign in with your email/mobile or create an account.'
                        )
                      }
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-[#050505] font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span className="truncate">Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          'Apple Authentication will be connected in live production. For now, please sign in with your email/mobile or create an account.'
                        )
                      }
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-[#050505] font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.88c.67-.83 1.13-1.98 1-3.13-.98.04-2.16.66-2.86 1.48-.61.72-1.15 1.88-1.01 3 .01 0 .03 0 .04 0 1.08 0 2.16-.52 2.83-1.35z" />
                      </svg>
                      <span className="truncate">Apple</span>
                    </button>
                  </div>

                  {/* SIGN UP LINK */}
                  <div className="pt-2 text-center text-xs text-slate-400">
                    <span>Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setView('signup');
                      }}
                      className="text-[#FFD400] font-bold hover:underline cursor-pointer ml-1"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              )}

              {/* REGISTRATION VIEW */}
              {view === 'signup' && (
                <form onSubmit={handleCustomerRegister} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151821] border border-[#272b38] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FFD400] font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={signupMobile}
                        onChange={(e) => setSignupMobile(e.target.value)}
                        placeholder="10-digit mobile number"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151821] border border-[#272b38] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FFD400] font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151821] border border-[#272b38] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FFD400] font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[#151821] border border-[#272b38] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FFD400] font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[#151821] border border-[#272b38] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FFD400] font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#FFD400] hover:bg-[#ffe033] text-[#050505] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg disabled:opacity-50 cursor-pointer mt-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>CREATE ACCOUNT →</span>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-slate-400">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setView('login');
                      }}
                      className="text-[#FFD400] font-bold hover:underline cursor-pointer ml-1"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* SUBTLE BOTTOM FOOTER */}
      <footer className="relative z-20 py-2.5 text-center text-[11px] text-slate-500 select-none">
        <p>© {new Date().getFullYear()} Prem Mobile. Deal Aise Jo Deewana Bana De 🔥</p>
      </footer>

    </div>
  );
}
