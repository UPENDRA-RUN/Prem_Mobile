import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';

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
    // Check if app is already running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;

    // Check dismissal timestamp
    const dismissedAt = localStorage.getItem('premmobile_pwa_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 3) return; // Don't show again within 3 days
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent || '';
    const isIosDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setIsIos(isIosDevice);

    if (isIosDevice) {
      // Delay showing iOS banner slightly for smoother UX
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // Handle Android/Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPromptGlobal = e;
      setDeferredPrompt(e);
      listeners.forEach((fn) => fn());

      // Show banner after 2 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
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
      {/* Floating Bottom App Install Banner */}
      <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-[9999] animate-slide-up">
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-red-500/30 flex items-center justify-between gap-3 relative overflow-hidden">
          {/* Subtle gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e51b23] via-[#FFD400] to-[#e51b23]" />

          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e51b23] to-red-700 p-2 flex items-center justify-center flex-shrink-0 shadow-md">
              <Smartphone className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-black text-sm text-white truncate">Install Prem Mobile App</h4>
                <span className="px-1.5 py-0.2 bg-[#FFD400] text-black font-black text-[9px] rounded-full uppercase">FAST</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight line-clamp-1 mt-0.5">
                Faster shopping, instant order alerts & offline access in Gwalior!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-[#e51b23] hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <Download className="w-3.5 h-3.5" />
              <span>INSTALL</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[10000] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#e51b23]" />
                <h3 className="font-black text-base text-slate-900 dark:text-white">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Follow these simple steps in Safari to add Prem Mobile to your Home Screen:
            </p>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl text-xs font-medium border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">1</span>
                <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  Tap the <Share className="w-4 h-4 text-blue-500 inline" /> <strong>Share button</strong> in Safari toolbar.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">2</span>
                <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  Scroll down and tap <PlusSquare className="w-4 h-4 text-slate-700 dark:text-slate-300 inline" /> <strong>Add to Home Screen</strong>.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">3</span>
                <span className="text-slate-800 dark:text-slate-200">
                  Tap <strong>Add</strong> in the top right corner. Done! 🎉
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
