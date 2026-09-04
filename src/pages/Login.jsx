import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { storeConfig } from '../config/store';
import { useCart } from '../context/CartContext';
import {
  Smartphone,
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Quote,
  Flame,
  ShieldCheck,
  Zap,
  Globe,
  KeyRound,
  Check,
  AlertCircle
} from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account';

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [resetStep, setResetStep] = useState(1); // 1: Request Email/Phone -> 2: Enter Code -> 3: Set New Password -> 4: Reset Success
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [name, setName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { showToast } = useCart();
  const navigate = useNavigate();

  // Password Strength Guidelines
  const isMinLength = newPassword.length >= 6;
  const hasLetterAndNumber = /[a-zA-Z]/.test(newPassword) && /\d/.test(newPassword);

  const saveUserProfile = (userObj) => {
    try {
      localStorage.setItem('premmobile_user_profile', JSON.stringify(userObj));
      localStorage.setItem('premmobile_customer_token', 'cust_' + Date.now().toString(36));
    } catch (e) {}
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authMode === 'login') {
      if (!identifier.trim()) {
        setErrorMsg('Please enter your email, mobile number, or username.');
        return;
      }
      if (!password.trim()) {
        setErrorMsg('Please enter your password.');
        return;
      }

      const isMobile = /^\d{10}$/.test(identifier.replace(/\D/g, ''));
      const userProfile = {
        fullName: identifier.split('@')[0] || 'Prem Mobile Customer',
        phone: isMobile ? identifier.replace(/\D/g, '') : '9876543210',
        email: identifier.includes('@') ? identifier : 'customer@premmobile.com',
        address: 'Pinto Park, Gwalior',
        city: 'Gwalior',
        state: 'Madhya Pradesh',
        pincode: '474005'
      };
      saveUserProfile(userProfile);

      setSuccessMsg(`Welcome back! Successfully signed in.`);
      showToast(`Welcome back, ${userProfile.fullName}!`);
      setTimeout(() => navigate(redirectTarget), 800);

    } else if (authMode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!identifier.trim() || !password.trim()) {
        setErrorMsg('Please complete all required sign-up fields.');
        return;
      }

      const isMobile = /^\d{10}$/.test(identifier.replace(/\D/g, ''));
      const userProfile = {
        fullName: name.trim(),
        phone: isMobile ? identifier.replace(/\D/g, '') : '9876543210',
        email: identifier.includes('@') ? identifier : 'customer@premmobile.com',
        address: 'Pinto Park, Gwalior',
        city: 'Gwalior',
        state: 'Madhya Pradesh',
        pincode: '474005'
      };
      saveUserProfile(userProfile);

      setSuccessMsg(`Account created successfully for ${name}! You are now logged in.`);
      showToast('Account created successfully!');
      setTimeout(() => navigate(redirectTarget), 800);

    } else if (authMode === 'forgot') {
      handleForgotStepSubmit();
    }
  };

  const handleForgotStepSubmit = () => {
    // STEP 2: Ask for account details & verify
    if (resetStep === 1) {
      if (!identifier.trim()) {
        setErrorMsg('Please enter your registered email address or mobile number.');
        return;
      }

      // STEP 3: Show information sent & explain next steps
      setErrorMsg('');
      setResetStep(2);
      setSuccessMsg(`Verification PIN sent to ${identifier}! Enter the 4-digit PIN below.`);
      showToast('Verification PIN sent!');
    }

    // STEP 4: Verify PIN
    else if (resetStep === 2) {
      if (!verificationCode.trim() || verificationCode.length < 4) {
        setErrorMsg('Please enter the 4-digit verification PIN.');
        return;
      }

      setErrorMsg('');
      setSuccessMsg('');
      setResetStep(3); // Move to Set New Password
    }

    // STEP 5: Reset the password
    else if (resetStep === 3) {
      if (!isMinLength || !hasLetterAndNumber) {
        setErrorMsg('New password must be at least 6 characters and contain letters & numbers.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New password and confirm password do not match.');
        return;
      }

      // STEP 6: Password successfully reset & momentum push
      setErrorMsg('');
      setResetStep(4);
      setSuccessMsg('Your password has been reset successfully!');
      showToast('Password Reset Successfully!');
    }
  };

  const handleSocialLogin = (provider) => {
    setSuccessMsg(`Connecting via ${provider}... Logged in successfully!`);
    showToast(`Signed in with ${provider}`);
    setTimeout(() => navigate('/shop'), 1500);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-[90vh] flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* MAIN AUTHENTICATION CONTAINER */}
        <div className="rounded-3xl sm:rounded-4xl bg-white border-2 border-slate-200 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT COLUMN: BRAND PROMISE & TESTIMONIALS */}
          <div className="lg:col-span-5 bg-[#050505] p-4 sm:p-10 text-white flex flex-col justify-between space-y-6 relative overflow-hidden">
            
            {/* BRAND HEADER & TAGLINE */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#FFD400] flex items-center justify-center border border-[#FFD400]/40">
                  <Smartphone className="w-5 h-5 text-[#FFD400]" />
                </div>
                <div className="font-display font-black text-2xl tracking-tight leading-none">
                  <span className="text-[#E31B23]">PREM</span>{' '}
                  <span className="text-white">MOBILE</span>
                </div>
              </div>

              <div className="inline-block px-3 py-1 rounded-lg bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
                “{storeConfig.tagline}”
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.) • Genuine tech, live audio tests, and store warranty.
              </p>
            </div>

            {/* VALUE PROPOSITION PERKS LIST */}
            <div className="space-y-3 relative z-10 py-2 border-y border-white/10">
              <span className="text-[11px] font-black text-[#FFD400] uppercase tracking-wider block">
                Exclusive Customer Privileges:
              </span>

              <div className="space-y-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD400] flex-shrink-0" />
                  <span>1-Click Pinto Park Store Pickup Reservations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD400] flex-shrink-0" />
                  <span>Exclusive Sunday Sale VIP Early Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD400] flex-shrink-0" />
                  <span>Live Audio Testing & 100% Brand Warranty</span>
                </div>
              </div>
            </div>

            {/* FEATURE HIGHLIGHT: VIP SUNDAY ACCESS */}
            <div className="p-4 rounded-2xl bg-[#111111] border border-[#FFD400]/40 space-y-2 relative z-10">
              <div className="flex items-center gap-1.5 text-[#FFD400] font-black text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 fill-[#FFD400]" />
                <span>NEW FEATURE SHOWCASE</span>
              </div>
              <h3 className="font-display font-black text-sm text-white">
                VIP Sunday Sale Early Access & 1-Click WhatsApp Reservations Now Active!
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Log in to get priority stock reservations, exclusive promo discounts, and VIP store passes.
              </p>
            </div>

            {/* Background Accent Glow */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#FFD400]/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* RIGHT COLUMN: LOGIN / SIGN UP / RESET PASSWORD FLOW */}
          <div className="lg:col-span-7 p-4 sm:p-10 space-y-6 flex flex-col justify-center">
            
            {/* TITLE & SUBTITLE */}
            <div className="space-y-1">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#050505] tracking-tight">
                {authMode === 'login' && 'SIGN IN TO YOUR ACCOUNT'}
                {authMode === 'signup' && 'CREATE YOUR FREE ACCOUNT'}
                {authMode === 'forgot' && 'RESET YOUR PASSWORD'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {authMode === 'login' && 'Sign in to manage cart items, access coupons & Sunday deals.'}
                {authMode === 'signup' && 'Join Prem Mobile to track orders, save wishlists, and get store perks.'}
                {authMode === 'forgot' && resetStep === 1 && 'Enter your registered email or phone to receive a reset code.'}
                {authMode === 'forgot' && resetStep === 2 && 'Enter the 4-digit verification PIN sent to your account.'}
                {authMode === 'forgot' && resetStep === 3 && 'Choose a new password adhering to strength requirements.'}
                {authMode === 'forgot' && resetStep === 4 && 'Your password has been updated! Proceed to log in.'}
              </p>
            </div>

            {/* Success & Error Banners */}
            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 text-red-800 border border-red-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* AUTH / PASSWORD RESET FORM */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* SIGN UP NAME FIELD */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#FFD400] bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* ACCOUNT IDENTIFIER (LOGIN / SIGNUP / FORGOT STEP 1) */}
              {(authMode !== 'forgot' || resetStep === 1) && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Account Identifier (Email, Mobile, or Username)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Enter email address, mobile number, or username"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#FFD400] bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* LOGIN PASSWORD & RESET LINK PLACED CLOSE TO PASSWORD FIELD */}
              {authMode === 'login' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>

                    {/* STEP 1: RESET LINK PLACED CLOSE TO PASSWORD FIELD */}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setResetStep(1);
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-xs font-bold text-[#E31B23] hover:underline flex items-center gap-1"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Forgot Password?</span>
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#FFD400] bg-slate-50 focus:bg-white"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-black transition-colors"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* FORGOT STEP 2: VERIFICATION PIN ENTRY */}
              {authMode === 'forgot' && resetStep === 2 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Enter 4-Digit Verification PIN Sent To {identifier}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Enter 4-digit code (e.g. 4829)"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold tracking-widest focus:outline-none focus:border-[#FFD400] bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* FORGOT STEP 3: RESET THE PASSWORD (NEW PASSWORD & STRENGTH CHECKLIST) */}
              {authMode === 'forgot' && resetStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#FFD400] bg-slate-50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-black transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#FFD400] bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* PASSWORD STRENGTH GUIDELINES */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <span className="font-bold text-slate-700 block uppercase text-[10px]">
                      Password Strength Guidelines:
                    </span>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                        isMinLength ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
                      }`}>
                        ✓
                      </span>
                      <span className={isMinLength ? 'text-emerald-700 font-bold' : ''}>
                        At least 6 characters long
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                        hasLetterAndNumber ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
                      }`}>
                        ✓
                      </span>
                      <span className={hasLetterAndNumber ? 'text-emerald-700 font-bold' : ''}>
                        Contains letters & numbers
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* FORGOT STEP 4: PASSWORD SUCCESSFULLY RESET & MOMENTUM PUSH */}
              {authMode === 'forgot' && resetStep === 4 && (
                <div className="py-4 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-black text-lg text-[#050505]">
                    Password Updated Successfully!
                  </h3>
                  <p className="text-xs text-slate-500">
                    You can now sign in to Prem Mobile using your new password.
                  </p>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setResetStep(1);
                      setErrorMsg('');
                      setSuccessMsg('Please sign in with your new password.');
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>PROCEED TO SIGN IN NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* SUBMIT BUTTON FOR NON-COMPLETED RESET STEPS */}
              {(authMode !== 'forgot' || resetStep < 4) && (
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102 mt-2"
                >
                  <span>
                    {authMode === 'login' && 'SIGN IN TO ACCOUNT'}
                    {authMode === 'signup' && 'CREATE MY ACCOUNT'}
                    {authMode === 'forgot' && resetStep === 1 && 'SEND VERIFICATION PIN'}
                    {authMode === 'forgot' && resetStep === 2 && 'VERIFY CODE'}
                    {authMode === 'forgot' && resetStep === 3 && 'UPDATE PASSWORD NOW'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

            </form>

            {/* THIRD PARTY LOGIN OPTIONS */}
            {authMode !== 'forgot' && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center">
                  Or Connect With One-Click Social Login
                </span>

                <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSocialLogin('Google')}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>🌐 Google</span>
                  </button>

                  <button
                    onClick={() => handleSocialLogin('Apple')}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span> Apple</span>
                  </button>

                  <button
                    onClick={() => handleSocialLogin('Facebook')}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>📘 Facebook</span>
                  </button>
                </div>
              </div>
            )}

            {/* NAVIGATION TOGGLE LINKS */}
            <div className="pt-3 border-t border-slate-100 text-center text-xs font-semibold text-slate-600">
              {authMode === 'login' && (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="font-black text-[#E31B23] hover:underline"
                  >
                    Sign Up Free
                  </button>
                </p>
              )}

              {authMode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="font-black text-[#050505] hover:underline"
                  >
                    Sign In Here
                  </button>
                </p>
              )}

              {authMode === 'forgot' && (
                <p>
                  Remembered your password?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setResetStep(1);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="font-black text-[#050505] hover:underline"
                  >
                    Back to Sign In
                  </button>
                </p>
              )}
            </div>

            {/* SWITCH TO ADMIN PORTAL */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Are you a store administrator?{' '}
                <Link
                  to="/admin/login"
                  className="font-bold text-[#e51b23] hover:underline inline-flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Switch to Admin Login</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </p>
            </div>


          </div>

        </div>

      </div>
    </div>
  );
}
