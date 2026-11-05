"use client";

import { useEffect, useRef, useState } from "react";
import { tierIds } from "@/lib/config";

type Stage = 'check' | 'email' | 'otp' | 'context' | 'chat';
type SessionStatus = {
  authenticated: boolean;
  user?: {
    email: string;
    name?: string;
    weddingMonth?: string;
    tier?: string;
    questionsToday: number;
    questionsRemaining: number;
    dailyLimit: number;
  };
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

const MAX_CHARS = 300;
const MAX_LINES = 3;

export function AiChat() {
  const [stage, setStage] = useState<Stage>('check');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [context, setContext] = useState<{
    name?: string;
    weddingMonth?: string;
    tier?: string;
  }>({});
  const [session, setSession] = useState<SessionStatus | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check for existing session on mount
  useEffect(() => {
    // Bypass auth for now - go straight to context collection or chat
    const savedContext = localStorage.getItem('ww_ai_context');
    if (savedContext) {
      try {
        const parsed = JSON.parse(savedContext);
        setContext(parsed);
        if (parsed.name && parsed.weddingMonth) {
          setStage('chat');
          addMessage('assistant', `Hi ${parsed.name?.split(' ')[0]}! 👋 ${getWelcomeMessageSimple(parsed)}`);
        } else {
          setStage('context');
        }
      } catch {
        setStage('context');
      }
    } else {
      setStage('context');
    }
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function checkSession() {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      
      if (data.authenticated) {
        setSession(data);
        setStage('chat');
        
        // Add welcome message
        if (data.user.name) {
          addMessage('assistant', `Hi ${data.user.name?.split(' ')[0]}! 👋 ${getWelcomeMessage(data.user)}`);
        } else {
          addMessage('assistant', 'Hi there! 👋 Ask me anything about health, skincare, or wellness for your wedding!');
        }
      } else {
        setStage('email');
      }
    } catch {
      setStage('email');
    }
  }

  function getWelcomeMessage(user: SessionStatus['user']) {
    if (!user) return '';
    
    const parts = [];
    
    if (user.weddingMonth) {
      const days = calculateDaysUntil(user.weddingMonth);
      if (days > 0) {
        parts.push(`${days} days until ${formatMonth(user.weddingMonth)}!`);
      }
    }
    
    if (user.questionsToday > 0) {
      parts.push(`${user.questionsRemaining}/${user.dailyLimit} questions remaining today.`);
    }
    
    if (parts.length) {
      return parts.join(' ') + '\n\nWhat would you like to know about health or skincare?';
    }
    
    return 'What would you like to know about health or skincare?';
  }

  function getWelcomeMessageSimple(ctx: typeof context) {
    const parts = [];
    
    if (ctx.weddingMonth) {
      const days = calculateDaysUntil(ctx.weddingMonth);
      if (days > 0) {
        parts.push(`${days} days until ${formatMonth(ctx.weddingMonth)}!`);
      }
    }
    
    if (parts.length) {
      return parts.join(' ') + '\n\nWhat would you like to know about health or skincare?';
    }
    
    return 'What would you like to know about health or skincare?';
  }

  function calculateDaysUntil(weddingMonth: string): number {
    const [year, month] = weddingMonth.split('-').map(Number);
    const weddingDate = new Date(year, month - 1, 15);
    const now = new Date();
    return Math.ceil((weddingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  function formatMonth(month: string): string {
    const [year, m] = month.split('-');
    const date = new Date(parseInt(year), parseInt(m) - 1);
    return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(date);
  }

  async function sendOTP() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send code');
        return;
      }

      setStage('otp');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP() {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, context }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid code');
        return;
      }

      // Check if we have context, if not collect it
      if (!context.name || !context.weddingMonth) {
        setStage('context');
      } else {
        await checkSession();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function submitContext() {
    if (!context.name?.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!context.weddingMonth) {
      setError('Please select your wedding month');
      return;
    }

    // Save to localStorage
    localStorage.setItem('ww_ai_context', JSON.stringify(context));
    
    setStage('chat');
    addMessage('assistant', `Hi ${context.name?.split(' ')[0]}! 👋 ${getWelcomeMessageSimple(context)}`);
  }

  async function sendMessage() {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    // Validate length
    if (trimmedInput.length > MAX_CHARS) {
      setError(`Please keep questions under ${MAX_CHARS} characters`);
      return;
    }

    const lines = trimmedInput.split('\n').filter(l => l.trim());
    if (lines.length > MAX_LINES) {
      setError(`Please keep questions to ${MAX_LINES} lines or less`);
      return;
    }

    setError('');
    setLoading(true);
    
    // Add user message
    addMessage('user', trimmedInput);
    setInput('');

    try {
      // Send with context from localStorage (no auth required)
      const res = await fetch('/api/chat-public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          conversationHistory: messages,
          context: context, // Send context directly
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to get response');
        return;
      }

      // Add AI response
      addMessage('assistant', data.response);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function addMessage(role: 'user' | 'assistant', content: string) {
    setMessages(prev => [...prev, { role, content, timestamp: Date.now() }]);
  }

  const fieldClass = "block w-full min-h-12 rounded-2xl border border-line bg-white px-4 text-base text-ink placeholder:text-muted/70 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25";

  // Skip email/OTP stages - go straight to context collection
  // Email input stage (disabled)
  if (false && stage === 'email') {
    return (
      <div className="rounded-3xl bg-paper border border-line p-6 md:p-8">
        <h3 className="font-serif text-2xl font-medium">Chat with AI Planner</h3>
        <p className="mt-2 text-sm text-muted">
          Get personalized health and skincare advice for your wedding
        </p>
        
        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="email" className="text-sm font-semibold">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && sendOTP()}
            placeholder="you@example.com"
            className={`mt-1.5 ${fieldClass}`}
            autoFocus
          />
        </div>

        <button
          onClick={sendOTP}
          disabled={loading}
          className="mt-6 w-full min-h-12 rounded-full bg-sage px-6 font-semibold text-white hover:bg-sage-dark disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send verification code'}
        </button>

        <p className="mt-4 text-center text-xs text-muted">
          10 free questions per day • Health & skincare only
        </p>
      </div>
    );
  }

  // OTP verification stage (disabled)
  if (false && stage === 'otp') {
    return (
      <div className="rounded-3xl bg-paper border border-line p-6 md:p-8">
        <h3 className="font-serif text-2xl font-medium">Enter verification code</h3>
        <p className="mt-2 text-sm text-muted">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ''));
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && verifyOTP()}
          placeholder="000000"
          className="mt-6 w-full min-h-14 rounded-2xl border border-line bg-white px-4 text-center text-2xl tracking-[0.5em] focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25"
          autoFocus
        />

        <button
          onClick={verifyOTP}
          disabled={loading || otp.length !== 6}
          className="mt-6 w-full min-h-12 rounded-full bg-sage px-6 font-semibold text-white hover:bg-sage-dark disabled:opacity-60"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <button
          onClick={() => setStage('email')}
          className="mt-3 w-full text-sm text-muted underline"
        >
          Change email
        </button>
      </div>
    );
  }

  // Context collection stage
  if (stage === 'context') {
    return (
      <div className="rounded-3xl bg-paper border border-line p-6 md:p-8">
        <h3 className="font-serif text-2xl font-medium">Tell us a bit about yourself</h3>
        <p className="mt-2 text-sm text-muted">
          This helps us give you personalized wedding advice
        </p>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-semibold">Your name</label>
            <input
              id="name"
              type="text"
              value={context.name || ''}
              onChange={(e) => {
                setContext({ ...context, name: e.target.value });
                setError('');
              }}
              placeholder="Priya"
              className={`mt-1.5 ${fieldClass}`}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="wedding" className="text-sm font-semibold">Wedding month</label>
            <input
              id="wedding"
              type="month"
              value={context.weddingMonth || ''}
              onChange={(e) => {
                setContext({ ...context, weddingMonth: e.target.value });
                setError('');
              }}
              className={`mt-1.5 ${fieldClass}`}
            />
          </div>

          <div>
            <label htmlFor="tier" className="text-sm font-semibold">Which tier interests you? <span className="font-normal text-muted">(optional)</span></label>
            <select
              id="tier"
              value={context.tier || ''}
              onChange={(e) => setContext({ ...context, tier: e.target.value })}
              className={`mt-1.5 ${fieldClass}`}
            >
              <option value="">Not sure yet</option>
              <option value="silver">Silver (₹18k)</option>
              <option value="gold">Gold (₹45k)</option>
              <option value="platinum">Platinum (₹90k)</option>
            </select>
          </div>
        </div>

        <button
          onClick={submitContext}
          disabled={loading}
          className="mt-6 w-full min-h-12 rounded-full bg-sage px-6 font-semibold text-white hover:bg-sage-dark disabled:opacity-60"
        >
          Start chatting
        </button>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="flex flex-col rounded-3xl bg-paper border border-line overflow-hidden" style={{ height: 'min(600px, 80svh)' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line p-4 bg-sage-soft">
        <div>
          <h3 className="font-serif text-lg font-semibold">AI Glow Planner</h3>
          <p className="text-xs text-muted">Free advice for your wedding</p>
        </div>
        <div className="text-xs text-muted text-right">
          {context?.name && <div>{context.name.split(' ')[0]}</div>}
          {context?.weddingMonth && (
            <div className="text-sage-dark font-semibold">
              {calculateDaysUntil(context.weddingMonth)} days to go
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-sage text-white'
                  : 'bg-white border border-line text-ink'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl border border-line bg-white px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-sage/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-sage/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-sage/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-line p-4 bg-white">
        {error && (
          <div className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-800">
            {error}
          </div>
        )}
        
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask about skincare, health, diet..."
            className="flex-1 min-h-12 max-h-24 rounded-2xl border border-line bg-white px-4 py-3 text-sm resize-none focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="shrink-0 w-12 h-12 rounded-full bg-sage text-white hover:bg-sage-dark disabled:opacity-40 flex items-center justify-center"
            aria-label="Send message"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <p className="mt-2 text-xs text-muted">
          {input.length}/{MAX_CHARS} characters • {MAX_LINES} lines max • Press Enter to send
        </p>
      </div>
    </div>
  );
}
