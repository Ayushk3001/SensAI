"use client";

import {
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuizResult({ result, hideStartNew = false, onStartNew }) {
  if (!result) return null;

  const score = result.quizScore;
  const correctCount = result.questions.filter((q) => q.isCorrect).length;
  const totalQuestions = result.questions.length;
  const scoreTone =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
        ? "text-primary"
        : "text-amber-400";
  const scoreLabel =
    score >= 80 ? "Strong performance" : score >= 60 ? "Good progress" : "Needs focused review";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 shadow-sm">
          <Trophy className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter text-foreground">
          Quiz Complete
        </h1>
      </div>

      <CardContent className="space-y-6 rounded-lg border border-border/70 bg-card/70 p-6 shadow-xl shadow-black/10 backdrop-blur-xl">
        <Card className="border-border/70 bg-background/50">
          <CardContent className="p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">
                  Assessment score
                </Badge>
                <div className="mt-3 flex items-end gap-2">
                  <span className={`text-5xl font-extrabold tracking-tight ${scoreTone}`}>
                    {score.toFixed(1)}
                  </span>
                  <span className="pb-1 text-2xl font-semibold text-muted-foreground">%</span>
                </div>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{scoreLabel}</p>
              </div>

              <div className="w-full max-w-md space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Correct answers</span>
                  <span className="font-semibold text-foreground">
                    {correctCount}/{totalQuestions}
                  </span>
                </div>
                <Progress value={score} className="h-2.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {result.improvementTip && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-5">
            <p className="mb-2 flex items-center gap-2 font-semibold text-amber-300">
              <Lightbulb className="h-4 w-4" />
              Improvement Tip
            </p>
            <p className="leading-7 text-foreground">{result.improvementTip}</p>
          </div>
        )}

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            Question Review
          </h3>
          <div className="space-y-4">
            {result.questions.map((q, index) => (
              <div key={index} className="rounded-lg border border-border/70 bg-muted/60 p-5">
                <div className="flex items-start justify-between gap-4">
                  <p className="flex-1 font-medium text-foreground">{q.question}</p>
                  {q.isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="h-6 w-6 flex-shrink-0 text-red-400" />
                  )}
                </div>

                <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs uppercase text-muted-foreground">Your answer</p>
                    <p className="font-medium text-foreground">{q.userAnswer}</p>
                  </div>
                  {!q.isCorrect && (
                    <div>
                      <p className="mb-1 text-xs uppercase text-muted-foreground">Correct answer</p>
                      <p className="font-medium text-emerald-300">{q.answer}</p>
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-border pt-5">
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                    Explanation
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter className="mt-8 flex justify-center gap-3">
          <Button onClick={onStartNew} size="lg" className="px-10">
            <RotateCcw className="mr-2 h-4 w-4" />
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
