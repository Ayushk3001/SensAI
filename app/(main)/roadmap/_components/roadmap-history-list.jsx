"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteRoadmap } from "@/actions/roadmap";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { Progress } from "@/components/ui/progress";

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
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
        No roadmaps yet. Generate your first career path.
      </div>
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
            className="group relative rounded-xl border border-transparent bg-card p-4 transition-all hover:border-primary/30 hover:bg-muted"
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
                <div className="text-xl font-bold text-primary">{progress}%</div>
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
