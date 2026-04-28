import Link from "next/link";
import { History, Map, PlusCircle, Route, Target } from "lucide-react";
import { getRoadmaps } from "@/actions/roadmap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import RoadmapHistoryList from "./_components/roadmap-history-list";

export default async function RoadmapDashboardPage() {
  const roadmaps = await getRoadmaps();
  const totalNodes = roadmaps.reduce((sum, roadmap) => sum + (roadmap.nodes?.length || 0), 0);
  const completedNodes = roadmaps.reduce((sum, roadmap) => sum + (roadmap.completedNodeIds?.length || 0), 0);
  const averageProgress = totalNodes ? Math.round((completedNodes / totalNodes) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card/80 p-6 shadow-sm   md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Career Roadmaps
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Generate learning maps, mark milestones complete, and keep resources close.
          </p>
        </div>
        <Button asChild>
          <Link href="/roadmap/new">
            <PlusCircle className="h-4 w-4" />
            Generate Roadmap
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Roadmaps Created</CardTitle>
            <Map className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{roadmaps.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">Saved career paths</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Progress</CardTitle>
            <Target className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{averageProgress}%</div>
            <Progress value={averageProgress} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nodes Completed</CardTitle>
            <Route className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{completedNodes}</div>
            <p className="mt-1 text-xs text-muted-foreground">Of {totalNodes} learning nodes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                <History className="h-6 w-6 text-teal-500" />
                Past Roadmaps
              </CardTitle>
              <CardDescription>Open a saved roadmap or generate a fresh one.</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/roadmap/new">Open Roadmap Builder</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <RoadmapHistoryList initialRoadmaps={roadmaps} />
        </CardContent>
      </Card>
    </div>
  );
}
