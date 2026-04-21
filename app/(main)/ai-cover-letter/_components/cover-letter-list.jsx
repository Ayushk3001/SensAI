"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit2, Eye, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { deleteCoverLetter } from "@/actions/cover-letter";

const s = {
  root: { minHeight: "100vh", background: "#080808", color: "#e5e5e5", fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" },
  card: { background: "#111", border: "1px solid #1a1a1a", borderRadius: 14, padding: "24px", transition: "all 0.2s", cursor: "pointer" },
  cardHover: { transform: "translateY(-2px)", boxShadow: "0 20px 25px -5px rgb(124 58 237 / 0.1)" },
  title: { fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#a78bfa", marginBottom: 12 },
  meta: { fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 },
  snippet: { fontSize: 14, color: "#9ca3af", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" },
  actionBtn: { background: "#1f1f1f", border: "1px solid #2a2a2a", borderRadius: 8, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "#e5e5e5", transition: "all 0.15s" },
};

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this cover letter permanently?")) return;
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted");
      router.refresh();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (!coverLetters?.length) {
    return (
      <div style={s.root}>
        <div style={{ maxWidth: 720, margin: "120px auto", textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>📄</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>No cover letters yet</h2>
          <p style={{ color: "#6b7280", fontSize: 16, maxWidth: 320, margin: "0 auto 32px" }}>
            Your AI-generated cover letters will appear here
          </p>
          <button
            onClick={() => router.push("/ai-cover-letter/new")}
            style={{ background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 600 }}
          >
            Create Your First Letter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        {coverLetters.map((letter) => (
          <div
            key={letter.id}
            style={s.card}
            onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div style={s.title}>
              {letter.jobTitle}
            </div>
            <div style={s.subtitle}>at {letter.companyName}</div>

            <div style={s.meta}>
              <Calendar size={14} />
              {format(new Date(letter.createdAt), "MMM d, yyyy")}
            </div>

            <p style={s.snippet}>{letter.jobDescription}</p>

            <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                style={s.actionBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/ai-cover-letter/${letter.id}`);
                }}
              >
                <Eye size={18} />
              </button>
              <button
                style={{ ...s.actionBtn, color: "#ef4444" }}
                onClick={(e) => handleDelete(letter.id, e)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}