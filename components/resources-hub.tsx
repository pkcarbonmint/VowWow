"use client";

import { useState } from "react";
import { AiChat } from "./ai-chat";
import { WeddingTimeline } from "./wedding-timeline";
import { GuidesLibrary } from "./guides-library";

type Tab = 'chat' | 'timeline' | 'guides' | 'shop';

interface ResourcesHubProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function ResourcesHub({ userName, userEmail }: ResourcesHubProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-ink md:text-4xl">
          {userName ? `${userName}'s` : 'Your'} Wedding Wellness Hub
        </h1>
        <p className="mt-2 text-muted">
          Your personalized journey to wedding day confidence
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 flex gap-2 overflow-x-auto border-b border-line pb-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 font-semibold transition-all ${
            activeTab === 'chat'
              ? 'bg-sage text-white'
              : 'text-muted hover:bg-sand hover:text-ink'
          }`}
        >
          <span>💬</span>
          <span>AI Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 font-semibold transition-all ${
            activeTab === 'timeline'
              ? 'bg-sage text-white'
              : 'text-muted hover:bg-sand hover:text-ink'
          }`}
        >
          <span>📅</span>
          <span>Timeline</span>
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 font-semibold transition-all ${
            activeTab === 'guides'
              ? 'bg-sage text-white'
              : 'text-muted hover:bg-sand hover:text-ink'
          }`}
        >
          <span>📚</span>
          <span>Guides</span>
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 font-semibold transition-all ${
            activeTab === 'shop'
              ? 'bg-sage text-white'
              : 'text-muted hover:bg-sand hover:text-ink'
          }`}
          disabled
        >
          <span>🛍️</span>
          <span>Shop</span>
          <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs">Soon</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'chat' && <AiChat />}
        {activeTab === 'timeline' && <WeddingTimeline />}
        {activeTab === 'guides' && <GuidesLibrary />}
        {activeTab === 'shop' && (
          <div className="flex h-96 items-center justify-center rounded-3xl border border-line bg-white">
            <div className="text-center">
              <p className="text-4xl">🛍️</p>
              <p className="mt-4 font-semibold text-ink">Product Shop Coming Soon</p>
              <p className="mt-2 text-sm text-muted">
                Curated wellness products for your wedding journey
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
