import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="space-y-6">
      <div className="glass-panel flex flex-col justify-between gap-4 p-6 fade-up md:flex-row md:items-end">
        <div>
          <Badge variant="outline" className="mb-3 border-primary/25 bg-primary/10 text-primary">
            Letter studio
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Cover Letter Studio</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Generate, review, and reuse tailored letters for each opportunity.
          </p>
        </div>
        <Button asChild>
          <Link href="/ai-cover-letter/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Link>
        </Button>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}
