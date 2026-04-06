'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { isToolUIPart } from 'ai';
import { useRef, useEffect, useState } from 'react';
import { FinEasyAvatar } from '@/components/ui/logo';
import { ChatMessage } from './message';

const SUGGESTED_PROMPTS = [
  "What's my checking account balance and recent transactions?",
  "Analyze my spending this month",
  "What bills do I have coming up?",
  "Show me my investment portfolio",
  "Pay my Netflix bill",
];

interface ChatInterfaceProps {
  onToolCall?: (toolName: string, success: boolean) => void;
  userName?: string;
}

export function ChatInterface({ onToolCall, userName }: ChatInterfaceProps) {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const [input, setInput] = useState('');
  const [connectedCount, setConnectedCount] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    fetch('/api/connections')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.services) {
          setConnectedCount(data.services.filter((s: { connected: boolean }) => s.connected).length);
        }
      })
      .catch(() => {/* silently ignore */});
  }, []);

  // Track tool call completions for audit log
  const reportedToolParts = useRef(new Set<string>());
  useEffect(() => {
    for (const msg of messages) {
      if (msg.role !== 'assistant') continue;
      for (const part of msg.parts) {
        if (!isToolUIPart(part) || part.state !== 'output-available') continue;
        const key = `${msg.id}-${part.type}`;
        if (reportedToolParts.current.has(key)) continue;
        reportedToolParts.current.add(key);
        const toolName = part.type.replace(/^tool-/, '');
        const output = (part as { output: unknown }).output;
        const success = (output as Record<string, unknown>)?.error !== 'NOT_AUTHORIZED';
        onToolCall?.(toolName, success);
      }
    }
  }, [messages, onToolCall]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  }

  function handleSuggestion(prompt: string) {
    sendMessage({ text: prompt });
  }

  const isEmpty = messages.length === 0;
  const firstName = userName?.split(' ')[0] ?? 'there';

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className="text-center">
              <div
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', boxShadow: '0 4px 20px rgba(109,40,217,0.35)' }}
              >
                <svg width="36" height="36" viewBox="0 0 20 20" fill="none">
                  <rect x="1"  y="13" width="4" height="7"  rx="1" fill="white" fillOpacity="0.65" />
                  <rect x="8"  y="8"  width="4" height="12" rx="1" fill="white" fillOpacity="0.85" />
                  <rect x="15" y="2"  width="4" height="18" rx="1" fill="white" />
                  <path d="M3 13 L10 8 L17 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.45" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Hi {firstName}, I&apos;m FinEasy</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your AI finance agent. I can monitor accounts, analyze spending, pay bills, and more.
              </p>
            </div>

            {connectedCount === 0 && (
              <div className="w-full max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      🔌 Get started — connect your financial services
                    </p>
                    <p className="mt-1 text-xs text-amber-700">
                      FinEasy needs access to your services before it can help you. Connect at
                      least one service to begin.
                    </p>
                  </div>
                  <a
                    href="/dashboard/connections"
                    className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-600"
                  >
                    Connect →
                  </a>
                </div>
              </div>
            )}

            {connectedCount > 0 && (
              <p className="text-xs text-green-600 text-center">
                ✓ {connectedCount} service{connectedCount > 1 ? 's' : ''} connected — ready to help
              </p>
            )}

            <div className="w-full max-w-md space-y-2">
              <p className="text-center text-xs font-medium uppercase tracking-wide text-gray-400">
                Try asking
              </p>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestion(prompt)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-left text-sm text-gray-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
                  <div className="flex items-center gap-2">
                    <FinEasyAvatar size={24} />
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {error && (() => {
              const msg = error.message ?? '';
              const isUnauthorized = msg.includes('401') || msg.toLowerCase().includes('unauthorized');
              const isUnavailable = msg.includes('503') || msg.toLowerCase().includes('unavailable');
              const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');

              if (isUnauthorized) {
                return (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    Session expired —{' '}
                    <a href="/auth/login" className="font-medium underline hover:text-red-800">
                      please log in again
                    </a>
                  </div>
                );
              }

              if (isUnavailable) {
                return (
                  <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                    <span>AI service is temporarily unavailable — please try again in a moment</span>
                    {lastUserMessage && (
                      <button
                        onClick={() => {
                          const textPart = lastUserMessage.parts?.find(
                            (p: { type: string }) => p.type === 'text'
                          ) as { type: 'text'; text: string } | undefined;
                          const text = textPart?.text ?? '';
                          if (text) sendMessage({ text });
                        }}
                        className="shrink-0 rounded-md bg-amber-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-amber-700"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  Error: {msg}
                </div>
              );
            })()}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your accounts, bills, spending..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
