'use client';

import React from 'react';
import { Message } from '@/lib/viva-context';
import { ScoreDisplay } from './ScoreDisplay';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-muted-foreground">
            Ready to start? Your viva will begin shortly...
          </p>
        </div>
      ) : (
        <>
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] md:max-w-[60%] rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-card border border-border text-foreground rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'assistant' && msg.evaluation && (
                <div className="hidden md:block ml-2">
                  <ScoreDisplay
                    correctness={msg.evaluation.correctness}
                    clarity={msg.evaluation.clarity}
                    missingConcepts={msg.evaluation.missingConcepts}
                  />
                </div>
              )}
            </div>
          ))}
          {messages.some(m => m.role === 'assistant' && m.evaluation) && (
            <div className="md:hidden mt-4 space-y-4">
              {messages
                .filter(m => m.role === 'assistant' && m.evaluation)
                .map(msg => (
                  <div key={msg.id}>
                    <ScoreDisplay
                      correctness={msg.evaluation!.correctness}
                      clarity={msg.evaluation!.clarity}
                      missingConcepts={msg.evaluation!.missingConcepts}
                    />
                  </div>
                ))}
            </div>
          )}
          {isLoading && <TypingIndicator />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
