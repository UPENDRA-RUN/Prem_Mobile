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
  // role: 'CUSTOMER' | 'ADMIN'
  const [activeRole, setActiveRole] = useState(defaultMode === 'admin_login' ? 'ADMIN' : 'CUSTOMER');
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

  // Synchronize route changes if loaded via /signup or /admin/login
  useEffect(() => {
    if (location.pathname === '/signup') {
      setActiveRole('CUSTOMER');
      setView('signup');
    } else if (location.pathname === '/admin/login') {
      setActiveRole('ADMIN');
      setView('login');
    }
  }, [location.pathname]);

  // Customer Form State
  const [customerIdentifier, setCustomerIdentifier] = useState('rahul.gwalior@gmail.com');
  const [customerPassword, setCustomerPassword] = useState('customer123');
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

      const data = await parseResponseJson(res);
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

      const data = await parseResponseJson(res);
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid administrator credentials.');
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
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col justify-between relative overflow-x-hidden font-sans selection:bg-[#FFD400] selection:text-[#050505]">
      
      {/* ========================================================================= */}
      {/* 1. AMBIENT BACKGROUND WITH SUBTLE STORE ENVIRONMENT & GOLDEN GLOW STREAKS */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep ambient dark backdrop */}
        <div className="absolute inset-0 bg-[#050505]" />
        
        {/* Subtle warm golden streaks & radial glows */}
        <div className="absolute -top-32 -left-20 w-[650px] h-[650px] bg-gradient-to-br from-[#FFD400]/15 via-[#FFC400]/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#FFD400]/8 rounded-full blur-[160px]" />
        <div className="absolute top-1/4 right-10 w-[550px] h-[550px] bg-[#FFD400]/12 rounded-full blur-[150px]" />
        <div className="absolute -bottom-20 right-1/4 w-[450px] h-[450px] bg-[#F00000]/10 rounded-full blur-[140px]" />
        
        {/* Golden diagonal light beams */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-screen"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 15% 15%, rgba(255, 212, 0, 0.25) 0%, transparent 50%),
              radial-gradient(ellipse at 85% 25%, rgba(255, 212, 0, 0.20) 0%, transparent 45%),
              linear-gradient(135deg, rgba(255, 212, 0, 0.08) 0%, transparent 40%, rgba(255, 212, 0, 0.05) 70%, transparent 100%)
            `
          }}
        />

        {/* Ambient bottom-right store green leaf accent */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP HEADER: LOGO ON LEFT & DECORATIVE CROWN SCRIPT ON RIGHT             */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full max-w-[1440px] mx-auto px-5 sm:px-8 pt-4 pb-2 flex items-center justify-between">
        
        {/* TOP LEFT BRAND LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* White smartphone outline icon with notch */}
          <div className="w-8 h-12 border-2 border-white rounded-[10px] p-0.5 flex flex-col items-center justify-between relative bg-black/50 shadow-[0_0_15px_rgba(255,255,255,0.2)] flex-shrink-0">
            <div className="w-2.5 h-0.5 bg-white rounded-full mt-0.5" />
            <div className="w-1.5 h-1.5 rounded-full border border-white/60 mb-0.5" />
          </div>
          <div className="flex flex-col">
            <div className="font-display font-black text-2xl sm:text-3xl tracking-tight leading-none">
              <span className="text-[#F00000]">PREM</span>{' '}
              <span className="text-white">MOBILE</span>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-white tracking-normal mt-1 leading-tight flex items-center gap-1">
              Deal Aise Jo Deewana Bana De 🔥
            </span>
          </div>
        </Link>

        {/* TOP RIGHT PROMOTIONAL TEXT: GOLD CROWN + SCRIPT (Requirement 5) */}
        <div className="flex items-center gap-2.5 text-right select-none">
          <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFD400] fill-[#FFD400] -rotate-12 flex-shrink-0 drop-shadow-[0_0_10px_rgba(255,212,0,0.5)]" />
          <div className="flex flex-col leading-tight">
            <span className="font-['Caveat'] text-2xl sm:text-3xl text-[#FFD400] font-bold tracking-wide -mb-1">
              Deal Aise Jo
            </span>
            <span className="font-['Caveat'] text-2xl sm:text-3xl text-white font-bold tracking-wide flex items-center gap-1 justify-end">
              Deewana Bana De <span className="text-base sm:text-lg">🔥</span>
            </span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE: TWO-COLUMN 4:3 CANVAS (LEFT BENEFITS + RIGHT CARD)     */}
      {/* ========================================================================= */}
      <main className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-10 items-center w-full">
          
          {/* --------------------------------------------------------------------- */}
          {/* LEFT SIDE: PROMOTIONAL VISUAL, 4 BENEFITS & STORE HIGHLIGHTS (~52%)   */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full space-y-4 lg:space-y-6">
            
            {/* TOP/MIDDLE PROMOTIONAL COMPOSITION */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6 relative">
              
              {/* 4 VERTICALLY STACKED BENEFITS (Requirement 6) */}
              <div className="flex md:flex-col justify-around md:justify-center gap-4 lg:gap-5 w-full md:w-auto flex-shrink-0 z-10">
                
                {/* Benefit 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full border-2 border-[#FFD400] flex items-center justify-center text-[#FFD400] bg-black/60 shadow-[0_0_15px_rgba(255,212,0,0.3)] flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-[#FFD400]" />
                  </div>
                  <div>
                    <h4 className="text-xs lg:text-sm font-black uppercase tracking-wider text-white">100% ORIGINAL</h4>
                    <p className="text-[11px] text-slate-300 font-normal">Products</p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full border-2 border-[#FFD400] flex items-center justify-center text-[#FFD400] bg-black/60 shadow-[0_0_15px_rgba(255,212,0,0.3)] flex-shrink-0">
                    <span className="text-lg lg:text-xl font-black text-[#FFD400] leading-none">₹</span>
                  </div>
                  <div>
                    <h4 className="text-xs lg:text-sm font-black uppercase tracking-wider text-white">BEST DEALS</h4>
                    <p className="text-[11px] text-slate-300 font-normal">Everyday</p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full border-2 border-[#FFD400] flex items-center justify-center text-[#FFD400] bg-black/60 shadow-[0_0_15px_rgba(255,212,0,0.3)] flex-shrink-0">
                    <Headphones className="w-5 h-5 lg:w-6 lg:h-6 text-[#FFD400]" />
                  </div>
                  <div>
                    <h4 className="text-xs lg:text-sm font-black uppercase tracking-wider text-white">CUSTOMER SUPPORT</h4>
                    <p className="text-[11px] text-slate-300 font-normal">Always Here for You</p>
                  </div>
                </div>

                {/* Benefit 4 */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full border-2 border-[#FFD400] flex items-center justify-center text-[#FFD400] bg-black/60 shadow-[0_0_15px_rgba(255,212,0,0.3)] flex-shrink-0">
                    <Truck className="w-5 h-5 lg:w-6 lg:h-6 text-[#FFD400]" />
                  </div>
                  <div>
                    <h4 className="text-xs lg:text-sm font-black uppercase tracking-wider text-white">FAST SERVICE</h4>
                    <p className="text-[11px] text-slate-300 font-normal">In Gwalior</p>
                  </div>
                </div>

              </div>

              {/* CENTRAL PROMOTIONAL VISUAL & WELCOME BACK BANNER (Requirements 7 & 8) */}
              <div className="relative flex-1 flex flex-col items-center text-center max-w-[440px] lg:max-w-[490px] select-none">
                <div className="relative w-full overflow-hidden rounded-2xl">
                  {/* The exact photographic composition from LoginPage.png */}
                  <img
                    src="/images/login-promo-perfect.png"
                    alt="Prem Mobile Store Deals & Accessories"
                    className="w-full h-auto object-contain drop-shadow-[0_0_40px_rgba(255,212,0,0.35)]"
                    onError={(e) => {
                      // Fallback to full left promo if perfect crop is unavailable
                      e.currentTarget.src = '/images/login-left-promo-full.png';
                    }}
                  />
                </div>
              </div>

            </div>

            {/* 4 BOTTOM FEATURE ICONS (Requirement 9) */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-2 border-t border-white/10 max-w-xl mx-auto md:mx-0 w-full">
              <div className="flex flex-col items-center text-center">
                <ShoppingBag className="w-6 h-6 text-[#FFD400] mb-1 drop-shadow-[0_0_8px_rgba(255,212,0,0.4)]" />
                <span className="text-[11px] lg:text-xs font-bold text-white leading-tight">Shop</span>
                <span className="text-[11px] lg:text-xs font-bold text-white leading-tight">Faster</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <Heart className="w-6 h-6 text-[#FFD400] mb-1 drop-shadow-[0_0_8px_rgba(255,212,0,0.4)]" />
                <span className="text-[11px] lg:text-xs font-bold text-white leading-tight">Save Your</span>
                <span className="text-[11px] lg:text-xs font-bold text-white leading-tight">Favorites</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <BadgePercent className="w-6 h-6 text-[#FFD400] mb-1 drop-shadow-[0_0_8px_rgba(255,212,0,0.4)]" />
                <span className="text-[11px] lg:text-xs font-bold text-white leading-tight">Get Exclusive</span>
                <span className="text-[11px] lg:text-xs font-bold text-white leading-tight">Offers</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <User className="w-6 h-6 text-[#FFD400] mb-1 drop-shadow-[0_0_8px_rgba(255,212,0,0.4)]" />
                <span className="text-[11px] lg:text-xs font-bold text-white leading-tight">Manage</span>
                <span className="text-[11px] lg:text-xs font-bold text-white leading-tight">Your Orders</span>
              </div>
            </div>

            {/* LOCATION PIN (Requirement 10) */}
            <div className="flex items-center gap-2 pt-1 text-xs lg:text-sm font-bold text-white">
              <MapPin className="w-5 h-5 text-[#FFD400] fill-[#FFD400] flex-shrink-0" />
              <span>Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.)</span>
            </div>

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT SIDE: LARGE PREMIUM LOGIN CARD (~45%) (Requirement 11 to 21)    */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-6 xl:col-span-5 w-full flex justify-center lg:justify-end relative">
            
            {/* LOGIN CARD */}
            <div className="w-full max-w-[500px] bg-[#090c13] rounded-[28px] border-2 border-[#FFD400] p-6 sm:p-8 shadow-[0_0_60px_rgba(255,212,0,0.22),0_0_120px_rgba(255,212,0,0.08)] relative z-10 transition-all duration-300">
              
              {/* CARD LOGO HEADER (Requirement 12) */}
              <div className="text-center space-y-1 mb-5">
                <div className="w-7 h-11 border-2 border-white rounded-[9px] p-0.5 flex flex-col items-center justify-between mx-auto bg-black shadow-[0_0_15px_rgba(255,212,0,0.3)]">
                  <div className="w-2 h-0.5 bg-white rounded-full mt-0.5" />
                  <div className="w-1.5 h-1.5 rounded-full border border-white/60 mb-0.5" />
                </div>
                <h3 className="font-display font-black text-xl text-white tracking-tight leading-none pt-1">
                  <span className="text-[#F00000]">PREM</span> MOBILE
                </h3>
                <p className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide flex items-center justify-center gap-1">
                  Deal Aise Jo Deewana Bana De 🔥
                </p>
              </div>

              {/* CUSTOMER / ADMIN ROLE SELECTOR (Requirement 13) */}
              <div className="grid grid-cols-2 gap-2.5 mb-5 select-none">
                
                {/* Left: Customer Login */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('CUSTOMER');
                    setErrorMessage('');
                  }}
                  className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 border ${
                    activeRole === 'CUSTOMER'
                      ? 'bg-[#FFD400] text-[#050505] border-transparent font-black shadow-[0_0_15px_rgba(255,212,0,0.4)]'
                      : 'bg-[#12151e] text-white border-white/10 hover:border-[#FFD400]/40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activeRole === 'CUSTOMER' ? 'bg-black/10 text-black' : 'bg-white/5 text-[#FFD400]'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-tight leading-tight">
                      Customer Login
                    </span>
                    <span className={`text-[10px] leading-tight ${activeRole === 'CUSTOMER' ? 'text-black/75' : 'text-slate-400'}`}>
                      Shop • Orders • Offers
                    </span>
                  </div>
                </button>

                {/* Right: Admin Login */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('ADMIN');
                    setView('login');
                    setErrorMessage('');
                  }}
                  className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 border ${
                    activeRole === 'ADMIN'
                      ? 'bg-[#FFD400] text-[#050505] border-transparent font-black shadow-[0_0_15px_rgba(255,212,0,0.4)]'
                      : 'bg-[#12151e] text-white border-white/10 hover:border-[#FFD400]/40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activeRole === 'ADMIN' ? 'bg-black/10 text-black' : 'bg-white/5 text-[#FFD400]'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-tight leading-tight">
                      Admin Login
                    </span>
                    <span className={`text-[10px] leading-tight ${activeRole === 'ADMIN' ? 'text-black/75' : 'text-slate-400'}`}>
                      Manage Store • Products
                    </span>
                  </div>
                </button>

              </div>

              {/* HEADING (Requirement 14) */}
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {view === 'signup' ? 'Create Customer Account' : 'Login to Continue'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {view === 'signup'
                    ? 'Join Prem Mobile for special deals, fast checkout and rewards.'
                    : activeRole === 'ADMIN'
                    ? 'Authorized Personnel: Access store management, products & sales.'
                    : 'Access your account to explore products, offers and more.'}
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

              {/* =============================================================== */}
              {/* CUSTOMER / ADMIN LOGIN FORM                                      */}
              {/* =============================================================== */}
              {view === 'login' && (
                <form
                  onSubmit={activeRole === 'ADMIN' ? handleAdminLogin : handleCustomerLogin}
                  className="space-y-3.5"
                >
                  {/* EMAIL / MOBILE INPUT (Requirement 15) */}
                  <div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={activeRole === 'ADMIN' ? 'email' : 'text'}
                        value={activeRole === 'ADMIN' ? adminEmail : customerIdentifier}
                        onChange={(e) =>
                          activeRole === 'ADMIN'
                            ? setAdminEmail(e.target.value)
                            : setCustomerIdentifier(e.target.value)
                        }
                        placeholder={
                          activeRole === 'ADMIN'
                            ? 'Enter admin email (admin@premmobile.com)'
                            : 'Enter your email or mobile number'
                        }
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#151821] border border-[#272b38] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FFD400] focus:ring-1 focus:ring-[#FFD400] font-medium transition-colors"
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT (Requirement 16) */}
                  <div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={activeRole === 'ADMIN' ? adminPassword : customerPassword}
                        onChange={(e) =>
                          activeRole === 'ADMIN'
                            ? setAdminPassword(e.target.value)
                            : setCustomerPassword(e.target.value)
                        }
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

                  {/* REMEMBER ME + FORGOT PASSWORD (Requirement 17) */}
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
                        alert(
                          activeRole === 'ADMIN'
                            ? 'Admin credentials are managed securely in backend. Contact store management.'
                            : 'To reset your password, contact Prem Mobile support at +91 9893947477.'
                        )
                      }
                      className="text-xs text-[#FFD400] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* LOGIN BUTTON (Requirement 18) */}
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
                      <>
                        <span>{activeRole === 'ADMIN' ? 'Admin Login →' : 'Login →'}</span>
                      </>
                    )}
                  </button>

                  {/* SOCIAL LOGIN (Only in Customer mode - Requirement 19 & 25) */}
                  {activeRole === 'CUSTOMER' && (
                    <>
                      <div className="relative flex items-center justify-center my-3">
                        <div className="border-t border-slate-800 w-full" />
                        <span className="bg-[#090c13] px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                          OR
                        </span>
                        <div className="border-t border-slate-800 w-full" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Google Button */}
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
                          <span className="truncate">Continue with Google</span>
                        </button>

                        {/* Apple Button */}
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
                          <span className="truncate">Continue with Apple</span>
                        </button>
                      </div>

                      {/* SIGN UP LINK (Requirement 20) */}
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
                    </>
                  )}

                  {/* ADMIN SECURITY NOTICE (Requirement 20) */}
                  {activeRole === 'ADMIN' && (
                    <div className="pt-2 text-center text-[11px] text-slate-500">
                      <p>Admin accounts are managed securely by store management.</p>
                    </div>
                  )}
                </form>
              )}

              {/* =============================================================== */}
              {/* CUSTOMER REGISTRATION VIEW                                       */}
              {/* =============================================================== */}
              {view === 'signup' && (
                <form onSubmit={handleCustomerRegister} className="space-y-3">
                  {/* FULL NAME */}
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

                  {/* MOBILE NUMBER */}
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

                  {/* EMAIL */}
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

                  {/* PASSWORD & CONFIRM PASSWORD */}
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

                  {/* REGISTER BUTTON */}
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
                      <>
                        <span>CREATE ACCOUNT →</span>
                      </>
                    )}
                  </button>

                  {/* SWITCH BACK TO LOGIN */}
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

            {/* SECURITY MESSAGE BELOW CARD (Requirement 21) */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-1.5 text-xs text-slate-400 select-none">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Your data is safe with us</span>
            </div>

            {/* RIGHT EDGE TRUST BADGES (Requirement 22) */}
            <div className="hidden xl:flex flex-col gap-3.5 absolute -right-20 top-1/2 -translate-y-1/2 z-20 select-none">
              {/* Badge 1: Safe & Secure */}
              <div className="w-16 h-16 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-md flex flex-col items-center justify-center text-center p-1 shadow-lg hover:border-[#FFD400]/50 transition-colors">
                <ShieldCheck className="w-5 h-5 text-white mb-0.5" />
                <span className="text-[9px] font-bold text-white leading-tight">Safe</span>
                <span className="text-[9px] font-bold text-white leading-tight">& Secure</span>
              </div>

              {/* Badge 2: Quick Support */}
              <div className="w-16 h-16 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-md flex flex-col items-center justify-center text-center p-1 shadow-lg hover:border-[#FFD400]/50 transition-colors">
                <Truck className="w-5 h-5 text-white mb-0.5" />
                <span className="text-[9px] font-bold text-white leading-tight">Quick</span>
                <span className="text-[9px] font-bold text-white leading-tight">Support</span>
              </div>

              {/* Badge 3: Trusted Local Store */}
              <div className="w-16 h-16 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-md flex flex-col items-center justify-center text-center p-1 shadow-lg hover:border-[#FFD400]/50 transition-colors">
                <Star className="w-5 h-5 text-white mb-0.5" />
                <span className="text-[9px] font-bold text-white leading-tight">Trusted</span>
                <span className="text-[9px] font-bold text-white leading-tight">Local Store</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. SUBTLE BOTTOM FOOTER                                                   */}
      {/* ========================================================================= */}
      <footer className="relative z-20 py-2.5 text-center text-[11px] text-slate-500 select-none">
        <p>© {new Date().getFullYear()} Prem Mobile. Deal Aise Jo Deewana Bana De 🔥</p>
      </footer>

    </div>
  );
}
