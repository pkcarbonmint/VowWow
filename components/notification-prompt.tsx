"use client";

import { useState, useEffect } from "react";
import { requestNotificationPermission, subscribeToPush, savePushSubscription, getNotificationPermission, registerServiceWorker } from "@/lib/pwa";

interface NotificationPromptProps {
  onSuccess?: () => void;
  onDismiss?: () => void;
}

export function NotificationPrompt({ onSuccess, onDismiss }: NotificationPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const permission = getNotificationPermission();
    const dismissed = localStorage.getItem('notification-prompt-dismissed');
    
    if (permission === 'default' && !dismissed) {
      setShowPrompt(true);
    }
  }, []);

  const handleEnable = async () => {
    setIsLoading(true);

    try {
      const permission = await requestNotificationPermission();

      if (permission === 'granted') {
        const registration = await registerServiceWorker();
        
        if (registration) {
          const subscription = await subscribeToPush(registration);
          
          if (subscription) {
            await savePushSubscription(subscription);
            setShowPrompt(false);
            onSuccess?.();
          }
        }
      }
    } catch (error) {
      console.error('Notification setup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('notification-prompt-dismissed', Date.now().toString());
    onDismiss?.();
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-2xl">
        <div className="text-center">
          <div className="mb-4 text-6xl">🔔</div>
          <h2 className="font-serif text-2xl font-semibold text-ink">
            Never miss your daily glow tip
          </h2>
          <p className="mt-3 text-muted">
            Get a personalized wellness tip every morning at 7am, tailored to your wedding timeline.
          </p>

          <div className="mt-6 rounded-2xl border border-line bg-sand/30 p-4">
            <p className="text-sm font-medium text-ink">Example notification:</p>
            <div className="mt-2 flex items-start gap-3 text-left">
              <div className="text-2xl">✨</div>
              <div>
                <p className="text-sm font-semibold text-ink">Day 129: Your Morning Glow Tip</p>
                <p className="text-xs text-muted">Start double cleansing today for clearer skin. Tap to learn how.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleEnable}
              disabled={isLoading}
              className="w-full rounded-full bg-sage px-6 py-4 font-semibold text-white hover:bg-sage-dark disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Setting up...' : 'Enable Notifications'}
            </button>
            <button
              onClick={handleDismiss}
              disabled={isLoading}
              className="w-full rounded-full border border-line px-6 py-4 font-semibold text-muted hover:bg-sand/50 transition-colors"
            >
              Not Now
            </button>
          </div>

          <p className="mt-4 text-xs text-muted">
            You can change this anytime in your browser settings.
          </p>
        </div>
      </div>
    </div>
  );
}
