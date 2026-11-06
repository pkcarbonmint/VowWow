"use client";

import { useEffect, useState, useRef } from "react";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Context = {
  name?: string;
  weddingMonth?: string;
  tier?: string;
};

const CONTEXT_KEY = 'ww_ai_context';
const MESSAGES_KEY = 'ww_ai_messages';

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<Context>({});
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load context and messages from localStorage
  useEffect(() => {
    try {
      const savedContext = localStorage.getItem(CONTEXT_KEY);
      if (savedContext) {
        setContext(JSON.parse(savedContext));
      } else {
        setShowContext(true);
      }

      const savedMessages = localStorage.getItem(MESSAGES_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error loading context:', error);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving messages:', error);
      }
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveContext = () => {
    try {
      localStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
      setShowContext(false);
    } catch (error) {
      console.error('Error saving context:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // Add user message
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat-public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context,
          history: newMessages.slice(-10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add assistant message
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      // Remove the user message if failed
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (showContext) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-8 shadow-sm">
        <h3 className="font-serif text-2xl font-medium">Tell me about yourself</h3>
        <p className="mt-2 text-sm text-muted">
          This helps me give you personalized advice (optional, stored locally)
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold">
              Your name
            </label>
            <input
              id="name"
              type="text"
              value={context.name || ''}
              onChange={(e) => setContext({ ...context, name: e.target.value })}
              placeholder="Priya"
              className="mt-1.5 block w-full rounded-2xl border border-line bg-white px-4 py-3 text-base focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25"
            />
          </div>

          <div>
            <label htmlFor="weddingMonth" className="block text-sm font-semibold">
              Wedding month (optional)
            </label>
            <input
              id="weddingMonth"
              type="month"
              value={context.weddingMonth || ''}
              onChange={(e) => setContext({ ...context, weddingMonth: e.target.value })}
              className="mt-1.5 block w-full rounded-2xl border border-line bg-white px-4 py-3 text-base focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25"
            />
          </div>

          <div>
            <label htmlFor="tier" className="block text-sm font-semibold">
              Interested in (optional)
            </label>
            <select
              id="tier"
              value={context.tier || ''}
              onChange={(e) => setContext({ ...context, tier: e.target.value })}
              className="mt-1.5 block w-full rounded-2xl border border-line bg-white px-4 py-3 text-base focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25"
            >
              <option value="">Choose...</option>
              <option value="silver">Silver (₹18k)</option>
              <option value="gold">Gold (₹45k)</option>
              <option value="platinum">Platinum (₹90k)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={saveContext}
            className="flex-1 rounded-full bg-sage px-6 py-3 font-semibold text-white hover:bg-sage-dark"
          >
            Start chatting
          </button>
          <button
            onClick={() => setShowContext(false)}
            className="rounded-full border border-sage px-6 py-3 font-semibold text-sage hover:bg-sage/5"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-line bg-white shadow-sm">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="text-lg font-semibold">👋 Hi{context.name ? ` ${context.name}` : ''}!</p>
                <p className="mt-2 text-sm text-muted">
                  Ask me anything about skincare, health, fitness, or wellness for your wedding!
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-sage text-white'
                      : 'bg-sand text-ink'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl bg-sand px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-sage [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-sage [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-sage"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="border-t border-line px-6 py-3 bg-red-50">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-line p-4">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about skincare, health, fitness..."
              maxLength={300}
              rows={2}
              className="flex-1 resize-none rounded-2xl border border-line bg-white px-4 py-3 text-sm focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="shrink-0 rounded-full bg-sage px-6 py-3 font-semibold text-white hover:bg-sage-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted">
            <span>Max 300 characters, 3 lines</span>
            <button
              onClick={() => setShowContext(true)}
              className="underline hover:text-sage"
            >
              Update info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
