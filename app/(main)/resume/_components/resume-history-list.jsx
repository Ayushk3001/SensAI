"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteResumeVersion } from "@/actions/resume";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";

export default function ResumeHistoryList({ initialVersions }) {
  const [versions, setVersions] = useState(initialVersions || []);

  const handleDelete = async (id) => {
    const previous = versions;
    setVersions((items) => items.filter((item) => item.id !== id));

    try {
      await deleteResumeVersion(id);
      toast.success("Resume version deleted");
    } catch {
      setVersions(previous);
      toast.error("Could not delete resume version");
    }
  };

  if (!versions.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
        No resume interactions yet. Tailor your first resume.
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {versions.map((version) => (
        <Link
          key={version.id}
          href="/resume/build"
          className="group relative rounded-xl border border-transparent bg-card p-4 transition-all hover:border-primary/30 hover:bg-muted"
        >
          <DeleteConfirmButton
            title="Are you sure you want to delete this resume?"
            description="This resume version will be permanently removed from your history."
            onConfirm={() => handleDelete(version.id)}
            buttonProps={{
              variant: "ghost",
              size: "icon",
              className: "absolute right-2 top-2 opacity-70 hover:opacity-100",
            }}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-400" />
          </DeleteConfirmButton>

          <div className="flex items-center justify-between gap-3 pr-9">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{version.title}</h3>
              <p className="text-xs text-muted-foreground">
                {new Date(version.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="text-xl font-bold text-primary">{version.atsScore ?? "N/A"}%</div>
          </div>
          <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
            {(version.recommendations || []).slice(0, 2).join(" • ") || "Tailored resume version"}
          </p>
        </Link>
      ))}
    </div>
  );
}
