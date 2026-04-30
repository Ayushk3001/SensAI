"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, CheckCircle2, X, Sparkles, ArrowRight, Brain, FileText, Zap } from "lucide-react";
import pdfToText from "react-pdftotext";
import { generateCoverLetter } from "@/actions/cover-letter";
import { coverLetterSchema } from "@/app/lib/schema";

const COVER_FEATURES = [
  { icon: "✦", text: "100% tailored to your resume & job" },
  { icon: "◉", text: "ATS-optimized formatting" },
  { icon: "◆", text: "Professional tone & structure" },
];

const ScoreRing = ({ score, max = 10, size = 80, stroke = 6, color = "hsl(var(--primary))" }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (score / max) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
};

export default function CoverLetterGenerator() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const jobDescription = watch("jobDescription");
  const companyName = watch("companyName");
  const jobTitle = watch("jobTitle");

  const onSubmit = async (data) => {
    if (!resumeFile) {
      return toast.error("Please upload a resume first");
    }

    setIsGenerating(true);
    setIsParsingPdf(true);

    try {
      const text = await pdfToText(resumeFile);
      const result = await generateCoverLetter({ ...data, resumeText: text });

      if (result?.id) {
        toast.success("Cover letter generated successfully!");
        router.push(`/ai-cover-letter/${result.id}`);
        reset();
      }
    } catch (error) {
      toast.error("Failed to process resume or generate letter");
    } finally {
      setIsGenerating(false);
      setIsParsingPdf(false);
    }
  };

  // ─── SETUP LAYOUT (exactly like VoiceInterviewPage) ─────────────────────────
  return (
    <div style={s.root}>
      <div style={s.setupGrid}>
        {/* Left panel — Hero */}
        <div style={s.leftPanel}>
          <div style={s.brand}>
            <div style={s.brandDot} />
            <span style={s.brandText}>InterviewAI</span>
          </div>
          <h1 style={s.heroTitle}>
            Craft your<br />
            <span style={s.heroAccent}>perfect cover letter</span>
          </h1>
          <p style={s.heroSub}>
            AI-powered, resume-tailored letters that get you noticed. Professional, concise, and impossible to ignore.
          </p>

          <div style={s.featureList}>
            {COVER_FEATURES.map((f, i) => (
              <div key={i} style={s.featureItem}>
                <span style={s.featureIcon}>{f.icon}</span>
                <span style={s.featureText}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Mini preview hint */}
          <div style={s.miniPreview}>
            <div style={s.miniPreviewInner}>
              <FileText size={18} color="hsl(var(--primary))" />
              <span style={{ fontSize: 13, color: "hsl(var(--primary))" }}>Takes ~8 seconds • 98% ATS pass rate</span>
            </div>
          </div>
        </div>

        {/* Right panel — Form */}
        <div style={s.formCard}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <p style={s.formLabel}>Company &amp; Role</p>
            <div style={s.inputRow}>
              <div style={s.inputGroup}>
                <label style={s.inputLabel}>Company Name</label>
                <input
                  style={s.input}
                  placeholder="e.g., Google"
                  {...register("companyName")}
                />
                {errors.companyName && <p style={s.errorText}>{errors.companyName.message}</p>}
              </div>

              <div style={s.inputGroup}>
                <label style={s.inputLabel}>Job Title</label>
                <input
                  style={s.input}
                  placeholder="e.g., Senior Frontend Engineer"
                  {...register("jobTitle")}
                />
                {errors.jobTitle && <p style={s.errorText}>{errors.jobTitle.message}</p>}
              </div>
            </div>

            <p style={{ ...s.formLabel, marginTop: 28 }}>Job Description</p>
            <textarea
              style={s.textarea}
              placeholder="Paste the full job description here..."
              rows={6}
              {...register("jobDescription")}
            />
            {errors.jobDescription && <p style={s.errorText}>{errors.jobDescription.message}</p>}

            <p style={{ ...s.formLabel, marginTop: 24 }}>Resume (PDF)</p>
            <div
              style={{
                ...s.dropzone,
                ...(dragOver ? s.dropzoneActive : {}),
                ...(resumeFile ? s.dropzoneDone : {}),
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file?.type === "application/pdf") setResumeFile(file);
              }}
            >
              {resumeFile ? (
                <div style={s.dropzoneDoneInner}>
                  <CheckCircle2 size={18} color="hsl(var(--primary))" />
                  <span style={s.fileNameText}>{resumeFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    style={s.removeBtn}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud size={24} color="hsl(var(--muted-foreground))" />
                  <span style={s.dropzoneText}>
                    Drop PDF here or{" "}
                    <label style={s.browseLink}>
                      browse
                      <input
                        type="file"
                        accept=".pdf"
                        style={{ display: "none" }}
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </span>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={!jobDescription || !resumeFile || isGenerating || isParsingPdf}
              style={{
                ...s.startBtn,
                marginTop: "auto",
                ...(isGenerating || isParsingPdf ? s.startBtnDisabled : {}),
              }}
            >
              {isGenerating || isParsingPdf ? (
                <>
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                  {isParsingPdf ? "Reading your resume..." : "Generating your letter..."}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Cover Letter</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
        textarea:focus, input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 4px; }
      `}</style>
    </div>
  );
}

// ─── REUSED STYLES FROM VOICEINTERVIEWPAGE (100% consistent) ───────────────────
const s = {
  root: { minHeight: "100vh", background: "hsl(var(--background))", color: "hsl(var(--foreground))", fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" },
  setupGrid: { display: "flex", minHeight: "100vh", alignItems: "stretch" },
  leftPanel: { width: "420px", flexShrink: 0, background: "linear-gradient(160deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)", padding: "60px 48px", display: "flex", flexDirection: "column", borderRight: "1px solid hsl(var(--border))" },
  brand: { display: "flex", alignItems: "center", gap: 8, marginBottom: 64 },
  brandDot: { width: 8, height: 8, borderRadius: "50%", background: "hsl(var(--primary))" },
  brandText: { fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "0.04em" },
  heroTitle: { fontSize: 44, fontWeight: 700, lineHeight: 1.1, color: "hsl(var(--foreground))", marginBottom: 16 },
  heroAccent: { color: "hsl(var(--primary))" },
  heroSub: { fontSize: 15, color: "hsl(var(--muted-foreground))", lineHeight: 1.7, marginBottom: 48 },
  featureList: { display: "flex", flexDirection: "column", gap: 16 },
  featureItem: { display: "flex", alignItems: "center", gap: 12 },
  featureIcon: { fontSize: 16, color: "hsl(var(--primary))" },
  featureText: { fontSize: 14, color: "hsl(var(--muted-foreground))" },
  miniPreview: { marginTop: "auto", padding: "14px 20px", background: "hsl(var(--card))", borderRadius: 8, border: "1px solid hsl(var(--border))" },
  miniPreviewInner: { display: "flex", alignItems: "center", gap: 10 },
  formCard: { flex: 1, padding: "60px 48px", overflowY: "auto", display: "flex", flexDirection: "column" },
  formLabel: { fontSize: 12, fontWeight: 600, color: "hsl(var(--muted-foreground))", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 },
  inputRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  inputGroup: { display: "flex", flexDirection: "column" },
  inputLabel: { fontSize: 13, color: "hsl(var(--muted-foreground))", marginBottom: 6, fontWeight: 500 },
  input: { background: "hsl(var(--card))", border: "1px solid hsl(var(--input))", borderRadius: 8, padding: "14px 16px", fontSize: 15, color: "hsl(var(--foreground))", fontFamily: "inherit" },
  errorText: { fontSize: 12, color: "hsl(var(--destructive))", marginTop: 4 },
  textarea: { width: "100%", background: "hsl(var(--card))", border: "1px solid hsl(var(--input))", borderRadius: 8, padding: "14px 16px", fontSize: 14, color: "hsl(var(--foreground))", lineHeight: 1.6, resize: "vertical", fontFamily: "inherit", minHeight: 140 },
  dropzone: { border: "1px dashed hsl(var(--border))", borderRadius: 8, padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", transition: "all 0.15s", background: "hsl(var(--muted))", flexDirection: "column" },
  dropzoneActive: { border: "1px dashed hsl(var(--primary))", background: "hsl(var(--primary) / 0.10)" },
  dropzoneDone: { border: "1px solid hsl(var(--primary))", background: "hsl(var(--primary) / 0.10)" },
  dropzoneDoneInner: { display: "flex", alignItems: "center", gap: 12, width: "100%" },
  dropzoneText: { fontSize: 14, color: "hsl(var(--muted-foreground))", textAlign: "center" },
  browseLink: { color: "hsl(var(--primary))", cursor: "pointer", fontWeight: 600 },
  fileNameText: { fontSize: 14, color: "hsl(var(--primary))", fontWeight: 500, flex: 1 },
  removeBtn: { background: "none", border: "none", color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" },
  startBtn: { width: "100%", background: "hsl(var(--primary))", border: "none", borderRadius: 8, padding: "16px 24px", color: "hsl(var(--primary-foreground))", fontSize: 16, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.15s", letterSpacing: "0.01em" },
  startBtnDisabled: { opacity: 0.45, cursor: "not-allowed" },
};
