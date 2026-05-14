'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageList } from './MessageList';
import { Message, useViva } from '@/lib/viva-context';

interface ChatInterfaceProps {
  onEndInterview: () => void;
}

export function ChatInterface({ onEndInterview }: ChatInterfaceProps) {
  const { session, addMessage, addScore, setLoading, setError } = useViva();
  const [input, setInput] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!input.trim() || !session) return;

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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.question,
        timestamp: Date.now(),
        evaluation: data.evaluation,
      };

      addMessage(assistantMessage);
      addScore(data.evaluation.correctness);
      setMessageCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      setError(String(error));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

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

      {/* Messages */}
      <MessageList messages={session.messages} isLoading={session.isLoading} />

      {/* Input Area */}
      <div className="border-t border-border px-4 py-4 bg-card">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Type your answer..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && !session.isLoading && handleSendMessage()}
            disabled={session.isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || session.isLoading}
            className="px-6"
          >
            {session.isLoading ? 'Loading...' : 'Send'}
          </Button>
        </div>
        {session.error && <p className="text-xs text-destructive mt-2">{session.error}</p>}
      </div>
    </div>
  );
}
