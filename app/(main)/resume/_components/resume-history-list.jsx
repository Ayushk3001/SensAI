"use client";

import Link from "next/link";
import { FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteResumeVersion } from "@/actions/resume";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-primary" />
          <p className="font-semibold text-foreground">No resume interactions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Tailor your first resume.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {versions.map((version) => (
        <Link
          key={version.id}
          href="/resume/build"
          className="group relative rounded-lg border border-border/70 bg-card/60 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/10"
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
            <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">
              {version.atsScore ?? "N/A"}%
            </Badge>
          </div>
          <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
            {(version.recommendations || []).slice(0, 2).join(" • ") || "Tailored resume version"}
          </p>
        </Link>
      ))}
    </div>
  );
}
