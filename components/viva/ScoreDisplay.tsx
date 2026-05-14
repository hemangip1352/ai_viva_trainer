interface ScoreDisplayProps {
  correctness: number;
  clarity: string;
  missingConcepts: string[];
}

export function ScoreDisplay({ correctness, clarity, missingConcepts }: ScoreDisplayProps) {
  return (
    <div className="bg-secondary/20 border border-secondary/40 rounded-lg p-4 my-3 text-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-foreground">Evaluation</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-accent">{correctness}</span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Clarity Feedback</p>
          <p className="text-sm text-foreground">{clarity}</p>
        </div>

        {missingConcepts.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Areas to Review</p>
            <div className="flex flex-wrap gap-1">
              {missingConcepts.map((concept, idx) => (
                <span key={idx} className="bg-destructive/20 text-destructive px-2 py-1 rounded text-xs">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
