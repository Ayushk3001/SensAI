"use client";

import { BarChart3, BriefcaseBusiness, Brain, Keyboard, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { deleteVoiceInterview } from "@/actions/interview";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const INTERVIEW_SECTIONS = [
  { value: "technical", label: "Technical", title: "Technical Interviews", icon: Keyboard },
  { value: "hr", label: "HR & Behavioral", title: "HR & Behavioral Interviews", icon: Users },
  { value: "aptitude", label: "Aptitude", title: "Aptitude Interviews", icon: Brain },
  { value: "managerial", label: "Managerial", title: "Managerial Interviews", icon: BriefcaseBusiness },
];

function getScore(session, key) {
  return session.scores?.[key] ?? (key === "overall" ? session.rating : null) ?? 0;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function SessionCard({ session, index, total, onOpen, onDelete }) {
  return (
    <Card
      className="cursor-pointer border border-border/70 bg-card/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/70"
      onClick={() => onOpen(session)}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl">Session #{total - index}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {formatDate(session.createdAt)}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/25 bg-primary/10 text-lg font-bold text-primary">
            {getScore(session, "overall")}/10
          </Badge>
          <DeleteConfirmButton
            title="Are you sure you want to delete this voice interview?"
            description="This voice interview result and transcript will be permanently removed."
            onConfirm={() => onDelete(session.id)}
            buttonProps={{
              variant: "ghost",
              size: "icon",
            }}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-400" />
          </DeleteConfirmButton>
        </div>
      </div>
      {session.feedback && (
        <p className="mt-4 line-clamp-2 text-xs text-muted-foreground">{session.feedback}</p>
      )}
    </Card>
  );
}

export default function VoiceHistoryList({ initialSessions }) {
  const [sessions, setSessions] = useState(initialSessions || []);
  const [selectedSession, setSelectedSession] = useState(null);

  const groupedSessions = useMemo(() => {
    return INTERVIEW_SECTIONS.map((section) => ({
      ...section,
      sessions: sessions.filter((session) => session.interviewType === section.value),
    }));
  }, [sessions]);

  const handleDelete = async (id) => {
    const previous = sessions;
    setSessions((items) => items.filter((item) => item.id !== id));
    if (selectedSession?.id === id) setSelectedSession(null);

    try {
      await deleteVoiceInterview(id);
      toast.success("Voice interview deleted");
    } catch {
      setSessions(previous);
      toast.error("Could not delete voice interview");
    }
  };

  if (!sessions.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <MicEmptyIcon />
          <p className="mt-4 font-semibold text-foreground">No voice interviews yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start your first speaking practice session.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Tabs defaultValue="technical" className="space-y-5">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-muted/40 p-2 sm:grid-cols-2 xl:grid-cols-4">
          {groupedSessions.map((section) => {
            const Icon = section.icon;
            return (
              <TabsTrigger
                key={section.value}
                value={section.value}
                className="h-auto justify-start gap-3 rounded-lg px-4 py-3 text-left data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{section.label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {section.sessions.length} saved
                  </span>
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {groupedSessions.map((section) => {
          const Icon = section.icon;
          return (
            <TabsContent key={section.value} value={section.value} className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <div className="rounded-lg border border-border/70 bg-card/45 p-5 backdrop-blur-xl">
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {section.sessions.length} saved session{section.sessions.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit border-primary/25 bg-primary/10 text-primary">
                    <BarChart3 className="mr-1 h-3.5 w-3.5" />
                    Focused view
                  </Badge>
                </div>

                {section.sessions.length ? (
                  <div className="space-y-3">
                    {section.sessions.map((session, index) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        index={index}
                        total={section.sessions.length}
                        onOpen={setSelectedSession}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border p-10 text-center">
                    <p className="font-semibold text-foreground">No {section.label.toLowerCase()} sessions yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start a new voice practice and choose this interview type.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-border bg-card [&>button]:hidden">
          <DialogHeader className="sticky top-0 z-10 border-b border-border bg-card/95 pb-4 backdrop-blur">
            <div className="flex items-start justify-between gap-4 pr-1">
              <div>
                <DialogTitle className="text-2xl capitalize">
                  {selectedSession?.interviewType} Interview Result
                </DialogTitle>
                <DialogDescription>
                  {selectedSession ? formatDate(selectedSession.createdAt) : ""}
                </DialogDescription>
              </div>
              <DialogClose asChild>
                <Button variant="outline" size="sm" className="shrink-0">
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["Overall", getScore(selectedSession, "overall")],
                  ["Competency", getScore(selectedSession, "competency")],
                  ["Communication", getScore(selectedSession, "communication")],
                ].map(([label, score]) => (
                  <div key={label} className="rounded-xl border border-border bg-muted p-4">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-2 text-3xl font-bold text-primary">{score}/10</p>
                  </div>
                ))}
              </div>

              {selectedSession.keyMetrics?.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Key Metrics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.keyMetrics.map((metric) => (
                      <span
                        key={metric}
                        className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSession.feedback && (
                <div className="rounded-xl border border-border bg-muted p-5">
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Feedback
                  </h4>
                  <p className="leading-7 text-foreground">{selectedSession.feedback}</p>
                </div>
              )}

              {selectedSession.transcript?.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Transcript
                  </h4>
                  <div className="space-y-3">
                    {selectedSession.transcript.map((message, index) => (
                      <div key={`${message.role}-${index}`} className="rounded-lg border border-border bg-muted p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                          {message.role}
                        </p>
                        <p className="text-sm leading-6 text-foreground">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function MicEmptyIcon() {
  return (
    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Brain className="h-6 w-6" />
    </span>
  );
}
