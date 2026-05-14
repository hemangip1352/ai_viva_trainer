'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useViva } from '@/lib/viva-context';

export default function ResultsPage() {
  const router = useRouter();
  const { session, getSessionSummary, resetSession } = useViva();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Button onClick={() => router.push('/')}>Back to Home</Button>
      </div>
    );
  }

  const summary = getSessionSummary();

  const handleRestartViva = () => {
    resetSession();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-foreground">Viva Summary</h1>
          <p className="text-muted-foreground">
            {session.subject} • Difficulty: {session.difficulty}
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-lg p-8 mb-8 text-center">
          <p className="text-muted-foreground mb-2">Overall Score</p>
          <div className="text-6xl font-bold text-primary mb-4">{summary.overallScore}</div>
          <div className="text-sm text-muted-foreground">
            Based on {session.scores.length} question{session.scores.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-2xl">💪</span> Strengths
            </h2>
            {summary.strengths.length > 0 ? (
              <ul className="space-y-3">
                {summary.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-foreground flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No strong areas identified yet</p>
            )}
          </div>

          {/* Weak Areas */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-2xl">📍</span> Areas to Improve
            </h2>
            {summary.weakAreas.length > 0 ? (
              <ul className="space-y-3">
                {summary.weakAreas.map((area, idx) => (
                  <li key={idx} className="text-sm text-foreground flex gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">Great work! No weak areas found</p>
            )}
          </div>
        </div>

        {/* Improvement Suggestions */}
        {summary.suggestions.length > 0 && (
          <div className="bg-secondary/20 border border-secondary/40 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">💡 Improvement Suggestions</h2>
            <ul className="space-y-2">
              {summary.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-foreground">
                  <span className="text-primary font-semibold">→</span> {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">📊 Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{session.messages.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Interactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {session.scores.length > 0
                  ? (session.scores.reduce((a, b) => a + b, 0) / session.scores.length).toFixed(1)
                  : '0'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {Math.max(...session.scores, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Highest</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {Math.min(...session.scores, 10)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Lowest</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <Button onClick={handleRestartViva} size="lg" className="flex-1">
            Start Another Viva
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            size="lg"
            className="flex-1"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
