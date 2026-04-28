"use client";

import React from "react";
import {
  BarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  FileText,
  Map,
  Mic,
  Target,
  Sparkles,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const chartStroke = "hsl(var(--primary))";
const blue = "hsl(var(--secondary))";
const amber = "hsl(var(--accent))";

const kpiTone = {
  teal: "bg-primary/10 text-primary  ",
  blue: "bg-secondary/10 text-secondary  ",
  amber: "bg-accent/10 text-accent  ",
  emerald: "bg-primary/10 text-primary  ",
};

function KpiCard({ title, value, helper, icon: Icon, tone = "teal", children }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
              {value}
            </div>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpiTone[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {children}
        <p className="mt-3 text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}

const DashboardView = ({ insights, careerData = {} }) => {
  const assessments = careerData.assessments || [];
  const voiceInterviews = careerData.voiceInterviews || [];
  const roadmaps = careerData.roadmaps || [];
  const resumeVersions = careerData.resumeVersions || [];
  const jobApplications = careerData.jobApplications || [];

  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-primary/100";
      case "medium":
        return "bg-accent/100";
      case "low":
        return "bg-rose-500";
      default:
        return "bg-slate-400";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-emerald-500" };
      case "neutral":
        return { icon: LineChart, color: "text-amber-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-rose-500" };
      default:
        return { icon: LineChart, color: "text-muted-foreground" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;
  const averageQuizScore = assessments.length
    ? assessments.reduce((sum, item) => sum + item.quizScore, 0) / assessments.length
    : 0;
  const averageVoiceScore = voiceInterviews.length
    ? voiceInterviews.reduce((sum, item) => sum + (item.scores?.overall || 0), 0) /
      voiceInterviews.length
    : 0;
  const activeJobs = jobApplications.filter((job) =>
    ["saved", "applied", "interviewing", "offer"].includes(job.status)
  ).length;
  const roadmapProgress = roadmaps.length
    ? Math.round(
        roadmaps.reduce((sum, roadmap) => {
          const total = roadmap.nodes?.length || 0;
          const done = roadmap.completedNodeIds?.length || 0;
          return sum + (total ? (done / total) * 100 : 0);
        }, 0) / roadmaps.length
      )
    : 0;
  const voiceTrend = [...voiceInterviews].reverse().map((item) => ({
    date: format(new Date(item.createdAt), "MMM dd"),
    score: item.scores?.overall || 0,
  }));
  const statusCounts = jobApplications.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "MMM d, yyyy");
  const nextUpdateDistance = formatDistanceToNow(new Date(insights.nextUpdate), {
    addSuffix: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card/80 p-6 shadow-sm   lg:flex-row lg:items-end">
        <div>
          <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary   ">
            <Sparkles className="mr-1 h-3 w-3" />
            Career intelligence command center
          </Badge>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Industry Insights
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Your documents, interviews, roadmap, job pipeline, and market signals in one operating view.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          Last updated: {lastUpdatedDate}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard title="Resume Score" value={resumeVersions[0]?.atsScore ? `${resumeVersions[0].atsScore}%` : "N/A"} helper={`${resumeVersions.length} saved versions`} icon={FileText} tone="teal" />
        <KpiCard title="Readiness" value={`${averageVoiceScore.toFixed(1)}/10`} helper={`${voiceInterviews.length} voice sessions`} icon={Mic} tone="blue" />
        <KpiCard title="Roadmap" value={`${roadmapProgress}%`} helper={`${roadmaps.length} active paths`} icon={Map} tone="amber">
          <Progress value={roadmapProgress} className="mt-4" />
        </KpiCard>
        <KpiCard title="Active Jobs" value={activeJobs} helper={`Quiz avg ${averageQuizScore.toFixed(1)}%`} icon={Target} tone="emerald" />
        <KpiCard title="Market" value={insights.marketOutlook} helper={`Next update ${nextUpdateDistance}`} icon={OutlookIcon} tone="blue" />
        <KpiCard title="Growth" value={`${insights.growthRate.toFixed(1)}%`} helper={`${insights.demandLevel} demand`} icon={TrendingUp} tone="teal">
          <Progress value={insights.growthRate} className="mt-4" />
        </KpiCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Voice Interview Trend</CardTitle>
            <CardDescription>Overall score from recent voice interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={voiceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis domain={[0, 10]} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }} />
                  <Line type="monotone" dataKey="score" stroke={chartStroke} strokeWidth={3} dot={{ r: 4, fill: chartStroke }} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Pipeline</CardTitle>
            <CardDescription>Applications grouped by status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["saved", "applied", "interviewing", "offer", "rejected"].map((status) => (
              <div key={status} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 ">
                <span className="capitalize text-sm text-muted-foreground">{status}</span>
                <Badge variant="secondary">{statusCounts[status] || 0}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>Minimum, median, and maximum salaries in thousands</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[410px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-border bg-card p-3 text-sm shadow-md  ">
                          <p className="font-semibold">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-muted-foreground">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="hsl(var(--primary) / 0.45)" name="Min Salary (K)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="median" fill={blue} name="Median Salary (K)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="max" fill={amber} name="Max Salary (K)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Demand Level</CardTitle>
              <CardDescription>Current market heat</CardDescription>
            </div>
            <BriefcaseIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{insights.demandLevel}</div>
            <div className={`mt-4 h-2 w-full rounded-full ${getDemandLevelColor(insights.demandLevel)}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Top Skills
            </CardTitle>
            <CardDescription>What the market is rewarding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>Prioritize these next</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="bg-card ">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Industry Trends</CardTitle>
          <CardDescription>Signals shaping your next move</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {insights.keyTrends.map((trend, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg bg-muted p-4 ">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary/100" />
                <span className="text-sm leading-6 text-muted-foreground">{trend}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;
