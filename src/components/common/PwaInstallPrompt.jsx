import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare } from 'lucide-react';

let deferredPromptGlobal = null;
const listeners = new Set();

export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(Boolean(deferredPromptGlobal));
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check standalone state
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    const handler = () => {
      setCanInstall(Boolean(deferredPromptGlobal));
    };

    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const triggerInstall = async () => {
    if (!deferredPromptGlobal) return false;
    try {
      deferredPromptGlobal.prompt();
      const choiceResult = await deferredPromptGlobal.userChoice;
      if (choiceResult.outcome === 'accepted') {
        deferredPromptGlobal = null;
        setCanInstall(false);
        listeners.forEach((fn) => fn());
        return true;
      }
    } catch (e) {
      console.warn('PWA install prompt error:', e);
    }
    return false;
  };

  return { canInstall, isInstalled, triggerInstall };
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;

    const dismissedAt = localStorage.getItem('premmobile_pwa_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 3) return;
    }

    const userAgent = window.navigator.userAgent || '';
    const isIosDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setIsIos(isIosDevice);

    if (isIosDevice) {
      const timer = setTimeout(() => setShowPrompt(true), 3500);
      return () => clearTimeout(timer);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPromptGlobal = e;
      setDeferredPrompt(e);
      listeners.forEach((fn) => fn());

      setTimeout(() => {
        setShowPrompt(true);
      }, 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt && !deferredPromptGlobal) return;
    const activePrompt = deferredPrompt || deferredPromptGlobal;
    try {
      activePrompt.prompt();
      const choiceResult = await activePrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
        deferredPromptGlobal = null;
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error('Failed to trigger PWA install:', err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('premmobile_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Compact Floating Bottom App Install Banner */}
      <div className="fixed bottom-16 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm z-30 animate-slide-up">
        <div className="bg-slate-900 text-white p-3 min-[380px]:p-3.5 rounded-2xl shadow-2xl border border-[#FFD400]/40 flex items-center justify-between gap-2.5 relative overflow-hidden backdrop-blur-md">
          {/* Subtle gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e51b23] via-[#FFD400] to-[#e51b23]" />

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e51b23] to-red-700 p-1.5 flex items-center justify-center flex-shrink-0 shadow-md">
              <Smartphone className="w-5 h-5 text-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-black text-xs min-[380px]:text-sm text-white truncate">Install Prem Mobile</h4>
                <span className="px-1.5 py-0.2 bg-[#FFD400] text-black font-black text-[8.5px] rounded uppercase">FAST</span>
              </div>
              <p className="text-[10px] min-[380px]:text-[11px] text-slate-300 leading-tight truncate mt-0.5">
                Faster shopping & offline deals in Gwalior!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-[#e51b23] hover:bg-red-700 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1 shadow-md active:scale-95 transition-transform"
            >
              <Download className="w-3.5 h-3.5" />
              <span>INSTALL</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-[10000] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#e51b23]" />
                <h3 className="font-black text-base text-slate-900">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Follow these simple steps in Safari to add Prem Mobile to your Home Screen:
            </p>

            <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl text-xs font-medium border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center flex-shrink-0 text-xs">1</span>
                <span className="flex items-center gap-1.5 text-slate-800">
                  Tap the <Share className="w-3.5 h-3.5 text-blue-500 inline" /> <strong>Share button</strong> in Safari.
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center flex-shrink-0 text-xs">2</span>
                <span className="flex items-center gap-1.5 text-slate-800">
                  Tap <PlusSquare className="w-3.5 h-3.5 text-slate-700 inline" /> <strong>Add to Home Screen</strong>.
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center flex-shrink-0 text-xs">3</span>
                <span className="text-slate-800">
                  Tap <strong>Add</strong> in top right corner. Done! 🎉
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIosGuide(false);
                setShowPrompt(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
