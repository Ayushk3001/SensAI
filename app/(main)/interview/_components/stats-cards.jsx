import { Brain, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards({ assessments }) {
  const averageScore = assessments?.length
    ? (assessments.reduce((sum, a) => sum + a.quizScore, 0) / assessments.length).toFixed(1)
    : 0;
  const latestAssessment = assessments?.[0];
  const totalQuestions = assessments?.length
    ? assessments.reduce((sum, a) => sum + (a.questions?.length || 0), 0)
    : 0;

  const cards = [
    { title: "Average Score", value: `${averageScore}%`, helper: "Across all assessments", icon: Trophy, color: "text-amber-500" },
    { title: "Questions Practiced", value: totalQuestions, helper: "Total questions answered", icon: Brain, color: "text-emerald-500" },
    { title: "Latest Score", value: `${latestAssessment?.quizScore.toFixed(1) || "-"}%`, helper: "Most recent quiz", icon: Target, color: "text-teal-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight text-foreground">{card.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{card.helper}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
