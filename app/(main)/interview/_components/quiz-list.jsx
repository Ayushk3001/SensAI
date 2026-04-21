"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";

export default function QuizList({ assessments }) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <>
      <Card className="border border-border/50 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                Recent Quizzes
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Review your past performance
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/interview/mock")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
            >
              Start New Quiz
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {assessments?.map((assessment, i) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:bg-zinc-900/70 border border-transparent hover:border-purple-500/30 transition-all p-4"
                onClick={() => setSelectedQuiz(assessment)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Quiz #{i + 1}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {format(new Date(assessment.createdAt), "MMMM dd, yyyy • HH:mm")}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                      {assessment.quizScore.toFixed(1)}%
                    </div>
                  </div>
                </div>
                {assessment.improvementTip && (
                  <p className="text-xs text-zinc-400 mt-4 line-clamp-2">
                    {assessment.improvementTip}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-zinc-950 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="sr-only">Quiz Result</DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz}
            hideStartNew
            onStartNew={() => router.push("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}