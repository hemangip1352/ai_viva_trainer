import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'AI Viva Trainer',
  description: 'Prepare for your technical viva exams with AI-powered practice',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
            AI Viva Trainer
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance">
            Master your engineering viva exams with an AI examiner that asks realistic questions, evaluates your answers, and provides detailed feedback
          </p>
        </div>

        <div className="pt-6">
          <Link href="/setup">
            <Button size="lg" className="px-8 py-6 text-base">
              Start Viva
            </Button>
          </Link>
        </div>

        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-semibold mb-1">Multiple Subjects</h3>
            <p className="text-xs text-muted-foreground">DBMS, OOP, OS, Networks, Java</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1">Three Difficulty Levels</h3>
            <p className="text-xs text-muted-foreground">Easy, Medium, Hard</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-semibold mb-1">Real-time Feedback</h3>
            <p className="text-xs text-muted-foreground">Scores, clarity, missing concepts</p>
          </div>
        </div>
      </div>
    </main>
  );
}
