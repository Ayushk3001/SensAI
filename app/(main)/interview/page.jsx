import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Sparkles } from "lucide-react";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div className="space-y-6">
      <div className="glass-panel flex flex-col justify-between gap-4 p-6 fade-up md:flex-row md:items-end">
        <div>
        <Badge variant="outline" className="mb-3 border-primary/25 bg-primary/10 text-primary">
          <Sparkles className="mr-1 h-3 w-3" />
          Interview coach
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          Interview Preparation
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Track quiz performance, review past answers, and start focused practice rounds.
        </p>
        </div>
        <Button asChild>
          <Link href="/interview/mock">
            <Brain className="h-4 w-4" />
            Start quiz practice
          </Link>
        </Button>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}
