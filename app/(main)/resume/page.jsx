import Link from "next/link";
import { FileText, History, PlusCircle, Target, Trophy } from "lucide-react";
import { getResumeVersions } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ResumeHistoryList from "./_components/resume-history-list";

export default async function ResumePage() {
  const versions = await getResumeVersions();
  const scored = versions.filter((version) => typeof version.atsScore === "number");
  const averageScore = scored.length
    ? scored.reduce((sum, version) => sum + version.atsScore, 0) / scored.length
    : 0;
  const bestScore = scored.length ? Math.max(...scored.map((version) => version.atsScore)) : 0;
  const latestScore = versions[0]?.atsScore;

  return (
    <div className="space-y-6">
      <div className="glass-panel flex flex-col justify-between gap-4 p-6 fade-up md:flex-row md:items-end">
        <div>
          <Badge variant="outline" className="mb-3 border-primary/25 bg-primary/10 text-primary">
            Resume intelligence
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Resume Studio
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Review ATS interactions, compare saved versions, and tailor a resume for the next role.
          </p>
        </div>
        <Button asChild>
          <Link href="/resume/build">
            <PlusCircle className="h-4 w-4" />
            Tailor Resume
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="soft-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average ATS Score</CardTitle>
            <Target className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{averageScore.toFixed(1)}%</div>
            <Progress value={averageScore} className="mt-4" />
            <p className="mt-1 text-xs text-muted-foreground">Across saved interactions</p>
          </CardContent>
        </Card>

        <Card className="soft-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resume Versions</CardTitle>
            <FileText className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{versions.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">Tailored resumes saved</p>
          </CardContent>
        </Card>

        <Card className="soft-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latest / Best</CardTitle>
            <Trophy className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              {latestScore ?? "-"}{latestScore ? "%" : ""}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Best score {bestScore || "N/A"}{bestScore ? "%" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="soft-card-hover">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                <History className="h-6 w-6 text-teal-500" />
                Previous Interactions
              </CardTitle>
              <CardDescription>
                Open the builder to generate another version.
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/resume/build">Open Resume Builder</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResumeHistoryList initialVersions={versions} />
        </CardContent>
      </Card>
    </div>
  );
}
