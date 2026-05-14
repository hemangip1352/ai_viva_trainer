'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  evaluation?: {
    correctness: number;
    clarity: string;
    missingConcepts: string[];
  };
}

export interface VivaSession {
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  messages: Message[];
  scores: number[];
  isLoading: boolean;
  error: string | null;
}

interface VivaContextType {
  session: VivaSession | null;
  initSession: (subject: string, difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  addMessage: (message: Message) => void;
  addScore: (score: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetSession: () => void;
  getSessionSummary: () => {
    strengths: string[];
    weakAreas: string[];
    overallScore: number;
    suggestions: string[];
  };
}

const VivaContext = createContext<VivaContextType | undefined>(undefined);

export function VivaProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<VivaSession | null>(null);

  const initSession = useCallback((subject: string, difficulty: 'Easy' | 'Medium' | 'Hard') => {
    setSession({
      subject,
      difficulty,
      messages: [],
      scores: [],
      isLoading: false,
      error: null,
    });
  }, []);

  const addMessage = useCallback((message: Message) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, message],
      };
    });
  }, []);

  const addScore = useCallback((score: number) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        scores: [...prev.scores, score],
      };
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isLoading: loading,
      };
    });
  }, []);

  const setError = useCallback((error: string | null) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        error,
      };
    });
  }, []);

  const resetSession = useCallback(() => {
    setSession(null);
  }, []);

  const getSessionSummary = useCallback(() => {
    if (!session) {
      return { strengths: [], weakAreas: [], overallScore: 0, suggestions: [] };
    }

    const scores = session.scores;
    const messages = session.messages;

    const overallScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    const strengths: string[] = [];
    const weakAreas: string[] = [];
    const suggestions: string[] = [];

    // Walk through messages: assistant messages carry the evaluation of the previous user answer
    messages.forEach((msg, idx) => {
      if (msg.role !== 'assistant' || !msg.evaluation) return;

      const { correctness, clarity, missingConcepts } = msg.evaluation;

      // The question asked by the PREVIOUS assistant message (what was being tested)
      const prevAssistant = messages
        .slice(0, idx)
        .reverse()
        .find((m) => m.role === 'assistant');
      const questionTopic = prevAssistant?.content
        ? prevAssistant.content.substring(0, 60).replace(/\?$/, '').trim()
        : 'this topic';

      if (correctness >= 7) {
        strengths.push(
          clarity && clarity.length > 10
            ? clarity
            : `Good understanding of: "${questionTopic}..."`
        );
      } else if (correctness <= 4) {
        if (missingConcepts && missingConcepts.length > 0) {
          weakAreas.push(`Needs improvement: ${missingConcepts.slice(0, 2).join(', ')}`);
          suggestions.push(`Review: ${missingConcepts[0]}`);
        } else {
          weakAreas.push(
            clarity && clarity.length > 10
              ? clarity
              : `Weak area: "${questionTopic}..."`
          );
        }
      } else {
        // Mid-range (5-6) — add as suggestion
        if (missingConcepts && missingConcepts.length > 0) {
          suggestions.push(`Strengthen: ${missingConcepts[0]}`);
        }
      }
    });

    return {
      strengths: [...new Set(strengths)].slice(0, 4),
      weakAreas: [...new Set(weakAreas)].slice(0, 4),
      overallScore,
      suggestions: [...new Set(suggestions)].slice(0, 4),
    };
  }, [session]);

  return (
    <VivaContext.Provider
      value={{
        session,
        initSession,
        addMessage,
        addScore,
        setLoading,
        setError,
        resetSession,
        getSessionSummary,
      }}
    >
      {children}
    </VivaContext.Provider>
  );
}

export function useViva() {
  const context = useContext(VivaContext);
  if (!context) {
    throw new Error('useViva must be used within VivaProvider');
  }
  return context;
}
