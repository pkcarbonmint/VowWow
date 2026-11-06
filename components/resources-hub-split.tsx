"use client";

import { useState, useEffect } from "react";
import { AiChat } from "./ai-chat";
import { WeddingTimeline } from "./wedding-timeline";
import { GuidesLibrary } from "./guides-library";
import { getPhase } from "@/lib/daily-tips";

type Tab = 'chat' | 'timeline' | 'guides' | 'shop';

interface ResourcesHubProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function ResourcesHubSplit({ userName, userEmail }: ResourcesHubProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [phase, setPhase] = useState<string>("");

  useEffect(() => {
    const draft = localStorage.getItem('ww:draft');
    if (draft) {
      try {
        const data = JSON.parse(draft);
        if (data.weddingMonth) {
          const wedding = new Date(data.weddingMonth);
          const today = new Date();
          const diff = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          setDaysRemaining(diff);
          setPhase(getPhase(diff));
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Left: Main Content (70%) */}
      <div className="flex-[7] flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
        {activeTab === 'chat' && (
          <>
            <div className="border-b border-line px-6 py-4">
              <h2 className="text-lg font-semibold text-ink">AI Chat</h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <AiChat />
            </div>
          </>
        )}
        
        {activeTab === 'timeline' && (
          <div className="h-full overflow-auto p-6">
            <WeddingTimeline />
          </div>
        )}
        
        {activeTab === 'guides' && (
          <div className="h-full overflow-auto p-6">
            <GuidesLibrary />
          </div>
        )}
      </div>

      {/* Right: Quick Info (30%) */}
      <div className="flex-[3] flex flex-col gap-4 overflow-auto">
        {/* Countdown Card */}
        {daysRemaining !== null && (
          <div className="rounded-3xl border border-line bg-gradient-to-br from-sage/10 to-sand/50 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Your Wedding
            </p>
            <p className="mt-2 font-serif text-4xl font-bold text-ink">
              {daysRemaining}
            </p>
            <p className="text-sm text-muted">days to go</p>
            {phase && (
              <div className="mt-4 rounded-full bg-sage/20 px-3 py-1 text-sm font-semibold text-sage capitalize">
                {phase} Phase
              </div>
            )}
          </div>
        )}

        {/* Today's Tip */}
        <div className="rounded-3xl border border-line bg-white p-6">
          <h3 className="text-sm font-semibold text-ink">💡 Today's Tip</h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Start your morning with warm lemon water to flush toxins and boost metabolism.
          </p>
        </div>

        {/* Navigation */}
        <div className="rounded-3xl border border-line bg-white p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Sections
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full rounded-2xl px-4 py-3 text-left transition-all ${
                activeTab === 'chat'
                  ? 'bg-sage text-white'
                  : 'bg-sand/50 text-ink hover:bg-sand'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">💬</span>
                <span className="text-sm font-semibold">AI Chat</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('timeline')}
              className={`w-full rounded-2xl px-4 py-3 text-left transition-all ${
                activeTab === 'timeline'
                  ? 'bg-sage text-white'
                  : 'bg-sand/50 text-ink hover:bg-sand'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📅</span>
                <span className="text-sm font-semibold">Timeline</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('guides')}
              className={`w-full rounded-2xl px-4 py-3 text-left transition-all ${
                activeTab === 'guides'
                  ? 'bg-sage text-white'
                  : 'bg-sand/50 text-ink hover:bg-sand'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📚</span>
                <span className="text-sm font-semibold">Guides</span>
              </div>
            </button>
            
            <button
              disabled
              className="w-full rounded-2xl bg-sand/30 px-4 py-3 text-left opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🛍️</span>
                <span className="text-sm font-semibold">Shop</span>
                <span className="ml-auto rounded-full bg-ink/10 px-2 py-0.5 text-xs">Soon</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
