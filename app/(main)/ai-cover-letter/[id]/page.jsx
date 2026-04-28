import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  if (!coverLetter) {
    return <div style={{ padding: 60, textAlign: "center", color: "hsl(var(--destructive))" }}>Cover letter not found</div>;
  }

  return (
    <div style={s.root}>
      <div style={s.header}>
        <Link href="/ai-cover-letter" style={{ textDecoration: "none" }}>
          <button style={s.backBtn}>
            <ArrowLeft size={18} />
            Back to All Letters
          </button>
        </Link>

        <div>
          <h1 style={s.title}>
            {coverLetter.jobTitle} <span style={s.at}>at</span> {coverLetter.companyName}
          </h1>
          <p style={s.date}>
            Generated on {new Date(coverLetter.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <CoverLetterPreview content={coverLetter.content} />
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "hsl(var(--background))", color: "hsl(var(--foreground))", fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" },
  header: { padding: "40px 48px", borderBottom: "1px solid hsl(var(--border))" },
  backBtn: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", borderRadius: 8, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  title: { fontSize: 36, fontWeight: 700, color: "hsl(var(--foreground))", marginTop: 20, marginBottom: 4 },
  at: { color: "hsl(var(--primary))", fontWeight: 400 },
  date: { fontSize: 15, color: "hsl(var(--muted-foreground))" },
};
