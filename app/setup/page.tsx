'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useViva } from '@/lib/viva-context';

const SUBJECTS = ['DBMS', 'OOP', 'Operating Systems', 'Computer Networks', 'Java'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export default function SetupPage() {
  const router = useRouter();
  const { initSession } = useViva();
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const handleStart = async () => {
    if (!subject || !difficulty) return;

    initSession(subject, difficulty as 'Easy' | 'Medium' | 'Hard');
    router.push('/viva');
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="space-y-8 max-w-md w-full">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Configure Your Viva
          </h1>
          <p className="text-muted-foreground">
            Select your subject and difficulty level to begin
          </p>
        </div>

        <div className="space-y-6">
          {/* Subject Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">
              Select Subject
            </label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a subject..." />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map(s => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">
              Select Difficulty
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                    difficulty === d
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:border-primary'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStart}
            disabled={!subject || !difficulty}
            size="lg"
            className="w-full py-6"
          >
            Start Viva
          </Button>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full"
          >
            Back
          </Button>
        </div>
      </div>
    </main>
  );
}
