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

export function ResourcesHubSidebar({ userName, userEmail }: ResourcesHubProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar Navigation */}
      <div className="w-20 border-r border-line bg-sand/30 flex flex-col items-center py-8 gap-6">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl transition-all ${
            activeTab === 'chat'
              ? 'bg-sage text-white shadow-md'
              : 'text-muted hover:bg-sand hover:text-ink'
          }`}
          title="AI Chat"
        >
          <span className="text-2xl">💬</span>
          <span className="text-xs font-medium">Chat</span>
        </button>
        
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl transition-all ${
            activeTab === 'timeline'
              ? 'bg-sage text-white shadow-md'
              : 'text-muted hover:bg-sand hover:text-ink'
          }`}
          title="Timeline"
        >
          <span className="text-2xl">📅</span>
          <span className="text-xs font-medium">Time</span>
        </button>
        
        <button
          onClick={() => setActiveTab('guides')}
          className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl transition-all ${
            activeTab === 'guides'
              ? 'bg-sage text-white shadow-md'
              : 'text-muted hover:bg-sand hover:text-ink'
          }`}
          title="Guides"
        >
          <span className="text-2xl">📚</span>
          <span className="text-xs font-medium">Guide</span>
        </button>
        
        <button
          onClick={() => setActiveTab('shop')}
          disabled
          className="flex flex-col items-center gap-2 px-3 py-4 rounded-2xl text-muted opacity-50 cursor-not-allowed"
          title="Shop (Coming Soon)"
        >
          <span className="text-2xl">🛍️</span>
          <span className="text-xs font-medium">Shop</span>
        </button>
      </div>

      {/* Main Content Area - Full Height */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            <div className="border-b border-line bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-ink">Chat with AI</h2>
              <p className="text-sm text-muted">Ask about skincare, fitness, and wellness</p>
            </div>
            <div className="flex-1 overflow-auto px-6 py-4">
              <AiChat />
            </div>
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <div className="h-full overflow-auto px-6 py-6">
            <WeddingTimeline />
          </div>
        )}
        
        {activeTab === 'guides' && (
          <div className="h-full overflow-auto px-6 py-6">
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
    </div>
  );
}
