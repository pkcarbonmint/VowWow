"use client";

import { useState } from "react";
import { AiChatFullscreen } from "./ai-chat-fullscreen";
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
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
      {/* Mobile Bottom Navigation */}
      <div className="order-2 md:hidden border-t border-line bg-white">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'chat'
                ? 'bg-sage/10 text-sage'
                : 'text-muted'
            }`}
          >
            <span className="text-xl">💬</span>
            <span className="text-xs font-medium">Chat</span>
          </button>
          
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'timeline'
                ? 'bg-sage/10 text-sage'
                : 'text-muted'
            }`}
          >
            <span className="text-xl">📅</span>
            <span className="text-xs font-medium">Timeline</span>
          </button>
          
          <button
            onClick={() => setActiveTab('guides')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'guides'
                ? 'bg-sage/10 text-sage'
                : 'text-muted'
            }`}
          >
            <span className="text-xl">📚</span>
            <span className="text-xs font-medium">Guides</span>
          </button>
          
          <button
            disabled
            className="flex flex-col items-center gap-1 px-4 py-2 text-muted opacity-50"
          >
            <span className="text-xl">🛍️</span>
            <span className="text-xs font-medium">Shop</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex w-20 border-r border-line bg-sand/30 flex-col items-center py-8 gap-6">
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
      <div className="order-1 flex-1 overflow-hidden bg-white">
        {activeTab === 'chat' && (
          <div className="h-full">
            <AiChatFullscreen />
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <div className="h-full overflow-auto px-4 md:px-6 py-4 md:py-6">
            <WeddingTimeline />
          </div>
        )}
        
        {activeTab === 'guides' && (
          <div className="h-full overflow-auto px-4 md:px-6 py-4 md:py-6">
            <GuidesLibrary />
          </div>
        )}
        
        {activeTab === 'shop' && (
          <div className="flex h-full items-center justify-center px-4">
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
