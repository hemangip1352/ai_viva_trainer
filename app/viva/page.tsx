'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/viva/ChatInterface';
import { useViva, Message } from '@/lib/viva-context';

export default function VivaPage() {
  const router = useRouter();
  const { session, addMessage, setLoading } = useViva();

  // Fetch initial question on mount
  useEffect(() => {
    if (!session) {
      router.push('/setup');
      return;
    }

    if (session.messages.length === 0) {
      fetchInitialQuestion();
    }
  }, [session, router]);

  const fetchInitialQuestion = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const response = await fetch('/api/viva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [],
          subject: session.subject,
          difficulty: session.difficulty,
          isFirstMessage: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch initial question');

      const data = await response.json();

      const initialMessage: Message = {
        id: `initial-${Date.now()}`,
        role: 'assistant',
        content: data.question,
        timestamp: Date.now(),
        evaluation: data.evaluation,
      };

      addMessage(initialMessage);
    } catch (error) {
      console.error('Error fetching initial question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = () => {
    router.push('/results');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <ChatInterface onEndInterview={handleEndInterview} />;
}
