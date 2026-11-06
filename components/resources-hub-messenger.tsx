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

export function ResourcesHubMessenger({ userName, userEmail }: ResourcesHubProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [showMenu, setShowMenu] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'chat': return 'AI Chat';
      case 'timeline': return 'Timeline';
      case 'guides': return 'Guides';
      case 'shop': return 'Shop';
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-white">
      {/* Thin Header - Messenger Style */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3 bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-ink">{getTitle()}</h1>
        </div>
        
        {/* Tab Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`rounded-full p-2 transition-all ${
              activeTab === 'chat'
                ? 'bg-sage/20 text-sage'
                : 'text-muted hover:bg-sand'
            }`}
            title="Chat"
          >
            <span className="text-xl">💬</span>
          </button>
          
          <button
            onClick={() => setActiveTab('timeline')}
            className={`rounded-full p-2 transition-all ${
              activeTab === 'timeline'
                ? 'bg-sage/20 text-sage'
                : 'text-muted hover:bg-sand'
            }`}
            title="Timeline"
          >
            <span className="text-xl">📅</span>
          </button>
          
          <button
            onClick={() => setActiveTab('guides')}
            className={`rounded-full p-2 transition-all ${
              activeTab === 'guides'
                ? 'bg-sage/20 text-sage'
                : 'text-muted hover:bg-sand'
            }`}
            title="Guides"
          >
            <span className="text-xl">📚</span>
          </button>
          
          <button
            disabled
            className="rounded-full p-2 text-muted opacity-50 cursor-not-allowed"
            title="Shop (Soon)"
          >
            <span className="text-xl">🛍️</span>
          </button>
          
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full p-2 text-muted hover:bg-sand ml-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Full-Height Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'chat' && (
          <div className="h-full px-4 py-2">
            <AiChat />
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <div className="h-full px-4 py-4">
            <WeddingTimeline />
          </div>
        )}
        
        {activeTab === 'guides' && (
          <div className="h-full px-4 py-4">
            <GuidesLibrary />
          </div>
        )}
        
        {activeTab === 'shop' && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-4xl">🛍️</p>
              <p className="mt-4 font-semibold text-ink">Coming Soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
