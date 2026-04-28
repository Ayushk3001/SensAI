import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card/80 p-6 shadow-sm  ">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          Interview Preparation
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Track quiz performance, review past answers, and start focused practice rounds.
        </p>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}
