import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  if (!coverLetter) {
    return <div style={{ padding: 60, textAlign: "center", color: "#ef4444" }}>Cover letter not found</div>;
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
  root: { minHeight: "100vh", background: "#080808", color: "#e5e5e5", fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" },
  header: { padding: "40px 48px", borderBottom: "1px solid #1a1a1a" },
  backBtn: { background: "transparent", border: "1px solid #2a2a2a", color: "#e5e5e5", borderRadius: 8, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  title: { fontSize: 36, fontWeight: 700, color: "#fff", marginTop: 20, marginBottom: 4 },
  at: { color: "#7c3aed", fontWeight: 400 },
  date: { fontSize: 15, color: "#6b7280" },
};