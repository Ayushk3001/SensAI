"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Eye, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCoverLetter } from "@/actions/cover-letter";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (!coverLetters?.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold">No cover letters yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Your AI-generated cover letters will appear here.
          </p>
          <Button className="mt-6" onClick={() => router.push("/ai-cover-letter/new")}>
            Create Your First Letter
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {coverLetters.map((letter) => (
        <Card
          key={letter.id}
          className="soft-card-hover cursor-pointer"
          onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-foreground">{letter.jobTitle}</h3>
                <p className="text-sm font-medium text-primary">at {letter.companyName}</p>
              </div>
              <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">
                AI
              </Badge>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(letter.createdAt), "MMM d, yyyy")}
            </div>

            <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {letter.jobDescription}
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={(event) => {
                  event.stopPropagation();
                  router.push(`/ai-cover-letter/${letter.id}`);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <DeleteConfirmButton
                title="Are you sure you want to delete this cover letter?"
                description="This cover letter will be permanently removed."
                onConfirm={() => handleDelete(letter.id)}
                buttonProps={{
                  variant: "ghost",
                  size: "icon",
                  className: "text-destructive hover:text-destructive",
                }}
              >
                <Trash2 className="h-4 w-4" />
              </DeleteConfirmButton>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
