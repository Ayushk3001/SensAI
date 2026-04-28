import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export const dynamic = "force-dynamic";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card/80 p-6 shadow-sm   md:flex-row md:items-end">
        <div>
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
