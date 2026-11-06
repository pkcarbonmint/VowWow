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

export function ResourcesHubFloating({ userName, userEmail }: ResourcesHubProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col">
      {/* Full-Screen Content */}
      <div className="flex-1 overflow-auto pb-20">
        {activeTab === 'chat' && (
          <div className="h-full px-4 py-4">
            <AiChat />
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <div className="h-full px-4 py-6">
            <WeddingTimeline />
          </div>
        )}
        
        {activeTab === 'guides' && (
          <div className="h-full px-4 py-6">
            <GuidesLibrary />
          </div>
        )}
        
        {activeTab === 'shop' && (
          <div className="flex h-full items-center justify-center">
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

      {/* Floating Bottom Tab Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="rounded-full border border-line bg-white/95 backdrop-blur-lg shadow-2xl px-2 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-sage text-white shadow-md'
                  : 'text-muted hover:bg-sand hover:text-ink'
              }`}
            >
              <span className="text-xl">💬</span>
              <span className="text-sm">Chat</span>
            </button>
            
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all ${
                activeTab === 'timeline'
                  ? 'bg-sage text-white shadow-md'
                  : 'text-muted hover:bg-sand hover:text-ink'
              }`}
            >
              <span className="text-xl">📅</span>
              <span className="text-sm">Timeline</span>
            </button>
            
            <button
              onClick={() => setActiveTab('guides')}
              className={`flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all ${
                activeTab === 'guides'
                  ? 'bg-sage text-white shadow-md'
                  : 'text-muted hover:bg-sand hover:text-ink'
              }`}
            >
              <span className="text-xl">📚</span>
              <span className="text-sm">Guides</span>
            </button>
            
            <button
              disabled
              className="flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-muted opacity-50 cursor-not-allowed"
            >
              <span className="text-xl">🛍️</span>
              <span className="text-sm">Shop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
