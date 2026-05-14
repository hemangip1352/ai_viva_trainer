'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageList } from './MessageList';
import { Message, useViva } from '@/lib/viva-context';

interface ChatInterfaceProps {
  onEndInterview: () => void;
}

function RateLimitBanner({ message }: { message: string }) {
  return (
    <div className="mx-4 my-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 flex gap-3 items-start">
      <span className="text-2xl shrink-0">⏳</span>
      <div>
        <p className="font-semibold text-amber-400 text-sm">API Limit Reached</p>
        <p className="text-amber-300/80 text-sm mt-0.5">{message}</p>
      </div>
    </div>
  );
}

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="mx-4 my-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 flex gap-3 items-start">
      <span className="text-xl shrink-0">⚠️</span>
      <div className="flex-1">
        <p className="text-destructive text-sm">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground text-xs shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

export function ChatInterface({ onEndInterview }: ChatInterfaceProps) {
  const { session, addMessage, addScore, setLoading, setError } = useViva();
  const [input, setInput] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!input.trim() || !session) return;
    if (rateLimitMsg) return; // block sending while rate-limited

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/viva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: session.messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          subject: session.subject,
          difficulty: session.difficulty,
          isFirstMessage: session.messages.length === 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 || data.error === 'rate_limit') {
          setRateLimitMsg(
            data.message ||
            "You've reached the daily API limit. Groq's free tier resets every 24 hours. Please try again tomorrow! 🌙"
          );
          return;
        }
        setError(data.message || data.details || data.error || 'Failed to get a response from the AI.');
        return;
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.question,
        timestamp: Date.now(),
        evaluation: data.evaluation,
      };

      addMessage(assistantMessage);
      if (data.evaluation?.correctness != null) {
        addScore(data.evaluation.correctness);
      }
      setMessageCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      setError('Network error — please check your connection and try again.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  const isBlocked = !!rateLimitMsg;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">{session.subject}</h2>
          <p className="text-xs text-muted-foreground">Difficulty: {session.difficulty}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onEndInterview}>
          End Interview
        </Button>
      </div>

      {/* Rate limit banner (sticky below header) */}
      {rateLimitMsg && <RateLimitBanner message={rateLimitMsg} />}

      {/* Messages */}
      <MessageList messages={session.messages} isLoading={session.isLoading} />

      {/* Input Area */}
      <div className="border-t border-border px-4 py-4 bg-card">
        {session.error && (
          <ErrorBanner
            message={session.error}
            onDismiss={() => setError(null)}
          />
        )}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder={isBlocked ? 'API limit reached — try again tomorrow' : 'Type your answer...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !session.isLoading && !isBlocked && handleSendMessage()}
            disabled={session.isLoading || isBlocked}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || session.isLoading || isBlocked}
            className="px-6"
          >
            {session.isLoading ? 'Thinking...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}
