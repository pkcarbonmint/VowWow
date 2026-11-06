"use client";

import { useEffect, useState, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
const FORM_CONTEXT_KEY = 'ww:draft';

export function AiChatFullscreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<Context>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load context from localStorage
    const savedContext = localStorage.getItem(CONTEXT_KEY);
    if (savedContext) {
      setContext(JSON.parse(savedContext));
    }

    // Try to load from form draft
    const formDraft = localStorage.getItem(FORM_CONTEXT_KEY);
    if (formDraft && !savedContext) {
      try {
        const draft = JSON.parse(formDraft);
        const initialContext = {
          name: draft.name || undefined,
          weddingMonth: draft.weddingMonth || undefined,
          tier: draft.tier || undefined,
        };
        setContext(initialContext);
        localStorage.setItem(CONTEXT_KEY, JSON.stringify(initialContext));
      } catch (e) {
        // ignore
      }
    }

    // Load saved messages
    const savedMessages = localStorage.getItem(MESSAGES_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat-public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          context,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = { role: 'assistant', content: data.response };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area - ChatGPT Style */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-3 md:px-4 py-4 md:py-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-4xl">👋</p>
                <p className="mt-4 text-xl font-semibold text-ink">
                  Hi{context.name ? ` ${context.name}` : ''}!
                </p>
                <p className="mt-2 text-muted">
                  Ask me anything about skincare, health, fitness, or wellness for your wedding!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className="group">
                  <div className="flex gap-3 md:gap-4">
                    {/* Avatar */}
                    <div className="shrink-0">
                      <div className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-sage/20 text-sage' 
                          : 'bg-ink/5 text-ink'
                      }`}>
                        <span className="text-xs md:text-sm font-semibold">
                          {msg.role === 'user' ? (context.name?.[0] || 'Y') : 'AI'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 space-y-1 md:space-y-2 min-w-0">
                      <div className="text-xs md:text-sm font-semibold text-ink">
                        {msg.role === 'user' ? (context.name || 'You') : 'VowWow AI'}
                      </div>
                      <div className="text-sm text-ink">
                        {msg.role === 'user' ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-ink prose-headings:mb-3 prose-headings:mt-2 prose-p:my-3 prose-ul:my-3 prose-li:my-1 prose-strong:font-semibold prose-strong:text-ink prose-table:border-collapse prose-table:w-full prose-table:my-4 prose-th:border prose-th:border-ink/20 prose-th:bg-sage/10 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-td:border prose-td:border-ink/20 prose-td:px-3 prose-td:py-2">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="group">
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink/5 text-ink">
                        <span className="text-sm font-semibold">AI</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="text-sm font-semibold text-ink">VowWow AI</div>
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-sage [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-sage [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-sage"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Sticky Input - ChatGPT Style */}
      <div className="border-t border-line bg-white">
        <div className="mx-auto max-w-3xl px-3 md:px-4 py-3 md:py-4">
          <div className="flex gap-2 md:gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about skincare, health, fitness..."
              maxLength={300}
              rows={1}
              className="flex-1 resize-none rounded-2xl border border-line bg-white px-3 md:px-4 py-2.5 md:py-3 text-sm focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25"
              style={{ minHeight: '44px', maxHeight: '200px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="shrink-0 rounded-xl bg-sage px-3 md:px-4 py-2.5 md:py-3 text-white hover:bg-sage-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Send message"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Max 300 characters, 3 lines
          </p>
        </div>
      </div>
    </div>
  );
}
