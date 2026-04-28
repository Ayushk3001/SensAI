"use client";

import { Trophy, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuizResult({ result, hideStartNew = false, onStartNew }) {
  if (!result) return null;

  const score = result.quizScore;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl flex items-center justify-center shadow-xl">
          <Trophy className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter text-foreground">
          Quiz Complete
        </h1>
      </div>

      <CardContent className="space-y-8 bg-card/80 border border-border/50 rounded-3xl p-8">
        {/* Score */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-secondary text-primary-foreground text-5xl font-bold shadow-inner mb-4">
            {score.toFixed(1)}
            <span className="text-2xl font-normal ml-1">%</span>
          </div>
          <Progress value={score} className="h-3 w-80 mx-auto" />
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className="bg-muted border border-border rounded-2xl p-6">
            <p className="font-semibold text-amber-300 mb-2">💡 Improvement Tip</p>
            <p className="text-foreground">{result.improvementTip}</p>
          </div>
        )}

        {/* Question Review */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            Question Review
          </h3>
          <div className="space-y-6">
            {result.questions.map((q, index) => (
              <div key={index} className="border border-border rounded-2xl p-6 bg-muted">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-foreground flex-1">{q.question}</p>
                  {q.isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                  )}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">YOUR ANSWER</p>
                    <p className="font-medium text-foreground">{q.userAnswer}</p>
                  </div>
                  {!q.isCorrect && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">CORRECT ANSWER</p>
                      <p className="font-medium text-emerald-300">{q.answer}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Explanation</p>
                  <p className="text-foreground text-sm leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter className="flex justify-center gap-3 mt-8">
          <Button
            onClick={onStartNew}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary text-primary-foreground px-10"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
