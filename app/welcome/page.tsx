"use client";

import { useEffect, useState } from "react";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { NotificationPrompt } from "@/components/notification-prompt";
import { isPWAInstalled } from "@/lib/pwa";
import Link from "next/link";

export default function WelcomePage() {
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Get user name from localStorage
    const draft = localStorage.getItem('ww:draft');
    if (draft) {
      try {
        const data = JSON.parse(draft);
        setUserName(data.name || "");
      } catch (e) {
        // ignore
      }
    }

    // Check if PWA is already installed
    setIsInstalled(isPWAInstalled());

    // Show notification prompt after a short delay if PWA is installed
    if (isPWAInstalled()) {
      const timer = setTimeout(() => {
        setShowNotificationPrompt(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePWAInstalled = () => {
    setIsInstalled(true);
    setTimeout(() => {
      setShowNotificationPrompt(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-sand/30 to-cream flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Success Card */}
        <div className="rounded-3xl border border-line bg-white p-8 shadow-xl text-center md:p-12">
          {/* Checkmark */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sage/10">
            <svg
              className="h-10 w-10 text-sage"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Message */}
          <h1 className="mt-6 font-serif text-3xl font-bold text-ink md:text-4xl">
            Welcome{userName ? `, ${userName}` : ""}! 🎉
          </h1>
          <p className="mt-4 text-lg text-muted">
            You're all set! Your personalized wedding wellness journey starts now.
          </p>

          {/* Next Steps */}
          <div className="mt-8 space-y-4 text-left">
            <div className="rounded-2xl border border-line bg-sand/20 p-6">
              <div className="flex gap-4">
                <div className="text-3xl">📱</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">Step 1: Add to Home Screen</h3>
                  <p className="mt-1 text-sm text-muted">
                    {isInstalled
                      ? "✓ Great! VowWow is installed on your device."
                      : "Install VowWow on your home screen for quick access to your wellness hub."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-sand/20 p-6">
              <div className="flex gap-4">
                <div className="text-3xl">🔔</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">Step 2: Enable Daily Tips</h3>
                  <p className="mt-1 text-sm text-muted">
                    Get personalized wellness tips every morning at 7am, tailored to your wedding timeline.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-sand/20 p-6">
              <div className="flex gap-4">
                <div className="text-3xl">✨</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">Step 3: Explore Your Hub</h3>
                  <p className="mt-1 text-sm text-muted">
                    Chat with AI, view your timeline, and access guides whenever you need them.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 space-y-3">
            <Link
              href="/resources"
              className="block w-full rounded-full bg-sage px-8 py-4 font-semibold text-white hover:bg-sage-dark transition-colors"
            >
              Go to Your Wellness Hub
            </Link>
            <Link
              href="/"
              className="block text-sm text-muted hover:text-sage transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* What to Expect */}
        <div className="mt-6 rounded-2xl bg-white/50 p-6 backdrop-blur-sm">
          <h3 className="font-semibold text-ink">What to expect:</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="flex gap-2">
              <span>•</span>
              <span>Daily personalized tips based on your wedding timeline</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>AI-powered advice for skincare, fitness, and wellness</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Phase-based guidance (Reset → Build → Refine → Maintain)</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Video guides and expert resources</span>
            </li>
          </ul>
        </div>
      </div>

      {/* PWA Install Prompt */}
      {!isInstalled && <PWAInstallPrompt />}

      {/* Notification Permission Prompt */}
      {showNotificationPrompt && (
        <NotificationPrompt
          onSuccess={() => {
            setShowNotificationPrompt(false);
          }}
          onDismiss={() => {
            setShowNotificationPrompt(false);
          }}
        />
      )}
    </div>
  );
}
