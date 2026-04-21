import { Brain, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards({ assessments }) {
  const getAverageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce((sum, a) => sum + a.quizScore, 0);
    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[0];
  };

  const getTotalQuestions = () => {
    if (!assessments?.length) return 0;
    return assessments.reduce((sum, a) => sum + (a.questions?.length || 0), 0);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Average Score */}
      <Card className="border border-border/50 hover:border-purple-500/30 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-zinc-400">Average Score</CardTitle>
          <Trophy className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tracking-tighter text-white">{getAverageScore()}%</div>
          <p className="text-xs text-zinc-400 mt-1">Across all assessments</p>
        </CardContent>
      </Card>

      {/* Questions Practiced */}
      <Card className="border border-border/50 hover:border-purple-500/30 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-zinc-400">Questions Practiced</CardTitle>
          <Brain className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tracking-tighter text-white">{getTotalQuestions()}</div>
          <p className="text-xs text-zinc-400 mt-1">Total questions answered</p>
        </CardContent>
      </Card>

      {/* Latest Score */}
      <Card className="border border-border/50 hover:border-purple-500/30 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-zinc-400">Latest Score</CardTitle>
          <Target className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tracking-tighter text-white">
            {getLatestAssessment()?.quizScore.toFixed(1) || "—"}%
          </div>
          <p className="text-xs text-zinc-400 mt-1">Most recent quiz</p>
        </CardContent>
      </Card>
    </div>
  );
}