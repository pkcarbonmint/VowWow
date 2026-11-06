"use client";

import { useEffect, useState } from "react";
import { isPWAInstalled } from "@/lib/pwa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(isPWAInstalled());

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="rounded-3xl border border-line bg-white p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="shrink-0 text-4xl">📱</div>
          <div className="flex-1">
            <h3 className="font-semibold text-ink">Add VowWow to Home Screen</h3>
            <p className="mt-1 text-sm text-muted">
              Get daily wellness tips and track your wedding glow journey right from your home screen.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleInstall}
                className="flex-1 rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white hover:bg-sage-dark transition-colors"
              >
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-sand/50 transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
