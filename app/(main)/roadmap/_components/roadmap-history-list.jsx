"use client";

import Link from "next/link";
import { Map, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteRoadmap } from "@/actions/roadmap";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function RoadmapHistoryList({ initialRoadmaps }) {
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps || []);

  const handleDelete = async (id) => {
    const previous = roadmaps;
    setRoadmaps((items) => items.filter((item) => item.id !== id));

    try {
      await deleteRoadmap(id);
      toast.success("Roadmap deleted");
    } catch {
      setRoadmaps(previous);
      toast.error("Could not delete roadmap");
    }
  };

  if (!roadmaps.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Map className="mx-auto mb-3 h-8 w-8 text-primary" />
          <p className="font-semibold text-foreground">No roadmaps yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Generate your first career path.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {roadmaps.map((roadmap) => {
        const total = roadmap.nodes?.length || 0;
        const done = roadmap.completedNodeIds?.length || 0;
        const progress = total ? Math.round((done / total) * 100) : 0;

        return (
          <div
            key={roadmap.id}
            className="group relative rounded-lg border border-border/70 bg-card/60 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/10"
          >
            <Link href={`/roadmap/new?roadmap=${roadmap.id}`} className="block">
              <div className="flex items-center justify-between gap-3 pr-9">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{roadmap.targetRole}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(roadmap.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">{progress}%</Badge>
              </div>
              <Progress value={progress} className="mt-4" />
              <p className="mt-3 text-xs text-muted-foreground">{done}/{total} nodes complete</p>
            </Link>

            <DeleteConfirmButton
              title="Are you sure you want to delete this roadmap?"
              description="This roadmap and its progress will be permanently removed."
              onConfirm={() => handleDelete(roadmap.id)}
              buttonProps={{
                variant: "ghost",
                size: "icon",
                className: "absolute right-2 top-2 opacity-70 hover:opacity-100",
              }}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-400" />
            </DeleteConfirmButton>
          </div>
        );
      })}
    </div>
  );
}
