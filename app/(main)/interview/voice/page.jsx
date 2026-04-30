import Link from "next/link";
import { History, Mic, PlusCircle, Target, Trophy } from "lucide-react";
import { getVoiceInterviews } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VoiceHistoryList from "./_components/voice-history-list";

export default async function VoiceInterviewDashboardPage() {
  const sessions = await getVoiceInterviews();
  const averageScore = sessions.length
    ? sessions.reduce((sum, session) => sum + (session.scores?.overall || session.rating || 0), 0) / sessions.length
    : 0;
  const latestScore = sessions[0]?.scores?.overall || sessions[0]?.rating;
  const bestScore = sessions.length
    ? Math.max(...sessions.map((session) => session.scores?.overall || session.rating || 0))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card/80 p-6 shadow-sm   md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Voice Interview Room
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Review speaking sessions and start a live AI mock interview tailored to your role.
          </p>
        </div>
        <Button asChild>
          <Link href="/interview/voice/practice">
            <PlusCircle className="h-4 w-4" />
            Start Voice Interview
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            <Trophy className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{averageScore.toFixed(1)}/10</div>
            <p className="mt-1 text-xs text-muted-foreground">Across all voice sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Completed</CardTitle>
            <Mic className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{sessions.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">Mock interviews saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latest / Best</CardTitle>
            <Target className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              {latestScore ?? "-"}{latestScore ? "/10" : ""}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Best score {bestScore || "N/A"}{bestScore ? "/10" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                <History className="h-6 w-6 text-teal-500" />
                Previous Voice Interviews
              </CardTitle>
              <CardDescription>Review your speaking practice history.</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/interview/voice/practice">Open Voice Practice</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VoiceHistoryList initialSessions={sessions} />
        </CardContent>
      </Card>
    </div>
  );
}
