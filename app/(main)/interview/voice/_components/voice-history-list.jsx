"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { deleteVoiceInterview } from "@/actions/interview";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const INTERVIEW_SECTIONS = [
  { value: "technical", label: "Technical Interviews" },
  { value: "hr", label: "HR & Behavioral Interviews" },
  { value: "aptitude", label: "Aptitude Interviews" },
  { value: "managerial", label: "Managerial Interviews" },
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
      className="cursor-pointer border border-transparent bg-card p-4 transition-all hover:border-primary/30 hover:bg-muted"
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
          <div className="text-2xl font-bold text-primary">
            {getScore(session, "overall")}/10
          </div>
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
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
        No voice interviews yet. Start your first speaking practice session.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-2">
        {groupedSessions.map((section) => (
          <div key={section.value} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{section.label}</h3>
                <p className="text-xs text-muted-foreground">
                  {section.sessions.length} saved session{section.sessions.length === 1 ? "" : "s"}
                </p>
              </div>
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
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No sessions yet.
              </div>
            )}
          </div>
        ))}
      </div>

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
