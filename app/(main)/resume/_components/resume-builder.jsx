"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, FileText, TrendingUp, AlertCircle, CheckCircle2, Copy, Check, Sparkles } from "lucide-react";
import pdfToText from "react-pdftotext";
import ReactMarkdown from "react-markdown";
import { analyzeAndSaveResume } from "@/actions/resume";

const ScoreRing = ({ score, max = 100, size = 110, stroke = 8, color = "#7c3aed" }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (score / max) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
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

export default function ResumeBuilder({ initialData }) {
  const [resumeText, setResumeText] = useState(initialData?.content || "");
  const [fileName, setFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis");
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const text = await pdfToText(file);
      setResumeText(text);
      toast.success("Resume content extracted!");
    } catch (err) {
      toast.error("Failed to parse PDF");
      setFileName("");
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      try {
        const text = await pdfToText(file);
        setResumeText(text);
        toast.success("Resume content extracted!");
      } catch (err) {
        toast.error("Failed to parse PDF");
      }
    }
  };

  const handleProcess = async () => {
    if (!resumeText || !jobDescription) return toast.error("Please upload a resume and paste a job description");
    setLoading(true);
    try {
      const result = await analyzeAndSaveResume(resumeText, jobDescription);
      setAnalysis(result);
      setActiveTab("analysis");
      toast.success("Analysis complete and resume tailored!");
    } catch (err) {
      toast.error("Diagnostic failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (analysis?.tailoredResume) {
      await navigator.clipboard.writeText(analysis.tailoredResume);
      setCopied(true);
      toast.success("Resume copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={s.root}>
      <div style={s.mainGrid}>
        {/* LEFT PANEL - INPUTS */}
        <div style={s.leftPanel}>
          <div style={s.brand}>
            <div style={s.brandDot} />
            <span style={s.brandText}>ResumeAI</span>
          </div>
          <h1 style={s.heroTitle}>
            Optimize your<br />
            <span style={s.heroAccent}>resume</span>
          </h1>
          <p style={s.heroSub}>
            Get an instant ATS score and a perfectly tailored 1-page resume based on any job description.
          </p>

          <div style={s.formCard}>
            <p style={s.formLabel}>1. Upload Resume (PDF)</p>
            <div
              style={{
                ...s.dropzone,
                ...(dragOver ? s.dropzoneActive : {}),
                ...(fileName ? s.dropzoneDone : {}),
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {fileName ? (
                <div style={s.dropzoneDoneInner}>
                  <CheckCircle2 size={20} color="#22c55e" />
                  <span style={s.fileNameText}>{fileName}</span>
                </div>
              ) : (
                <>
                  <FileText size={28} color="#6b7280" />
                  <span style={s.dropzoneText}>
                    Drop PDF here or{" "}
                    <label style={s.browseLink}>
                      browse
                      <input
                        type="file"
                        accept=".pdf"
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                      />
                    </label>
                  </span>
                </>
              )}
            </div>

            <p style={{ ...s.formLabel, marginTop: 28 }}>2. Target Job Description</p>
            <textarea
              style={s.textarea}
              placeholder="Paste the full job description here..."
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <button
              onClick={handleProcess}
              disabled={loading || !resumeText || !jobDescription}
              style={{
                ...s.startBtn,
                marginTop: "auto",
                opacity: loading || !resumeText || !jobDescription ? 0.45 : 1,
                cursor: loading || !resumeText || !jobDescription ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                  Analyzing &amp; Tailoring…
                </>
              ) : (
                <>
                  <TrendingUp size={20} />
                  <span>Run ATS Diagnostic &amp; Tailor Resume</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - RESULTS */}
        <div style={s.resultsPanel}>
          {!analysis ? (
            <div style={s.emptyState}>
              <Sparkles size={72} color="#7c3aed" />
              <h3 style={s.emptyTitle}>Your results will appear here</h3>
              <p style={s.emptyDesc}>
                Upload your resume and paste a job description.<br />
                Get your ATS score + AI-tailored resume instantly.
              </p>
            </div>
          ) : (
            <>
              {/* Tab Switcher */}
              <div style={s.tabBar}>
                <button
                  onClick={() => setActiveTab("analysis")}
                  style={{
                    ...s.tabBtn,
                    ...(activeTab === "analysis" ? s.tabBtnActive : {}),
                  }}
                >
                  ATS Score &amp; Insights
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  style={{
                    ...s.tabBtn,
                    ...(activeTab === "preview" ? s.tabBtnActive : {}),
                  }}
                >
                  Tailored Resume
                </button>
              </div>

              {activeTab === "analysis" && (
                <div style={s.analysisCard}>
                  <div style={s.scoreSection}>
                    <ScoreRing score={analysis.score} max={100} size={130} stroke={10} />
                    <div style={s.scoreCenter}>
                      <span style={s.scoreBig}>{analysis.score}</span>
                      <span style={s.scorePercent}>%</span>
                    </div>
                  </div>
                  <p style={s.scoreLabel}>ATS Compatibility Score</p>

                  {/* Missing Keywords */}
                  {analysis.missingKeywords?.length > 0 && (
                    <div style={s.metricSection}>
                      <p style={s.metricTitle}>
                        <AlertCircle size={16} /> Missing ATS Keywords
                      </p>
                      <div style={s.keywordChips}>
                        {analysis.missingKeywords.map((kw, i) => (
                          <span key={i} style={s.keywordChip}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div style={s.recommendations}>
                    <p style={s.metricTitle}>Recommended Enhancements</p>
                    <ul style={s.recList}>
                      {analysis.recommendations.map((rec, i) => (
                        <li key={i} style={s.recItem}>
                          <CheckCircle2 size={18} color="#22c55e" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "preview" && (
                <div style={s.previewCard}>
                  <div style={s.previewHeader}>
                    <span style={s.previewBadge}>1-Page Tailored Resume</span>
                    <button onClick={handleCopy} style={s.copyBtn}>
                      {copied ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
                      {copied ? "Copied!" : "Copy Markdown"}
                    </button>
                  </div>
                  <div style={s.markdownContent}>
                    <ReactMarkdown>{analysis.tailoredResume}</ReactMarkdown>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        textarea:focus, input:focus { outline: none; }
      `}</style>
    </div>
  );
}

// ─── STYLES (100% consistent with your app) ───────────────────────────────────
const s = {
  root: { minHeight: "100vh", background: "#080808", color: "#e5e5e5", fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif", padding: "40px 48px" },
  mainGrid: { display: "grid", gridTemplateColumns: "420px 1fr", gap: 40, minHeight: "calc(100vh - 80px)" },
  leftPanel: { background: "linear-gradient(160deg, #0f0f0f 0%, #111 100%)", borderRadius: 20, padding: "48px", display: "flex", flexDirection: "column", border: "1px solid #1a1a1a" },
  brand: { display: "flex", alignItems: "center", gap: 8, marginBottom: 40 },
  brandDot: { width: 8, height: 8, borderRadius: "50%", background: "#7c3aed" },
  brandText: { fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: "0.04em" },
  heroTitle: { fontSize: 42, fontWeight: 700, lineHeight: 1.1, color: "#fff", marginBottom: 12 },
  heroAccent: { color: "#7c3aed" },
  heroSub: { fontSize: 15, color: "#6b7280", lineHeight: 1.7, marginBottom: 40 },
  formCard: { flex: 1, display: "flex", flexDirection: "column" },
  formLabel: { fontSize: 12, fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 },
  dropzone: { border: "1px dashed #2a2a2a", borderRadius: 14, padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", transition: "all 0.15s", background: "#0d0d0d" },
  dropzoneActive: { borderColor: "#7c3aed", background: "#13082a" },
  dropzoneDone: { borderColor: "#166534", background: "#052e16" },
  dropzoneDoneInner: { display: "flex", alignItems: "center", gap: 12 },
  dropzoneText: { fontSize: 14, color: "#6b7280", textAlign: "center" },
  browseLink: { color: "#7c3aed", cursor: "pointer", fontWeight: 600 },
  fileNameText: { fontSize: 15, color: "#22c55e", fontWeight: 500 },
  textarea: { width: "100%", background: "#111", border: "1px solid #1f1f1f", borderRadius: 12, padding: "18px", fontSize: 15, color: "#e5e5e5", lineHeight: 1.6, resize: "vertical", minHeight: 220, fontFamily: "inherit" },
  startBtn: { background: "#7c3aed", border: "none", borderRadius: 12, padding: "18px 28px", color: "#fff", fontSize: 17, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "all 0.2s" },

  resultsPanel: { background: "#111", borderRadius: 20, border: "1px solid #1a1a1a", padding: "32px", display: "flex", flexDirection: "column" },
  emptyState: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: 0.6 },
  emptyTitle: { fontSize: 24, fontWeight: 700, marginTop: 24, marginBottom: 12 },
  emptyDesc: { fontSize: 15, color: "#6b7280", maxWidth: 320 },

  tabBar: { display: "flex", background: "#0d0d0d", borderRadius: 12, padding: 4, marginBottom: 24 },
  tabBtn: { flex: 1, padding: "14px", borderRadius: 10, fontSize: 14, fontWeight: 600, background: "transparent", border: "none", color: "#9ca3af", transition: "all 0.2s" },
  tabBtnActive: { background: "#1a0f35", color: "#fff", boxShadow: "0 4px 12px -2px rgb(124 58 237 / 0.3)" },

  analysisCard: { flex: 1, background: "#0d0d0d", borderRadius: 16, padding: 32 },
  scoreSection: { position: "relative", width: 130, height: 130, margin: "0 auto 16px" },
  scoreCenter: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", fontWeight: 700 },
  scoreBig: { fontSize: 42, lineHeight: 1, color: "#fff" },
  scorePercent: { fontSize: 18, color: "#a78bfa" },
  scoreLabel: { textAlign: "center", fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },

  metricSection: { marginTop: 32 },
  metricTitle: { fontSize: 13, fontWeight: 600, color: "#ef4444", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 },
  keywordChips: { display: "flex", flexWrap: "wrap", gap: 8 },
  keywordChip: { background: "#1f1f1f", color: "#f59e0b", fontSize: 13, padding: "6px 14px", borderRadius: 999, border: "1px solid #3b2a1f" },

  recommendations: { marginTop: 40 },
  recList: { listStyle: "none", padding: 0, margin: 0 },
  recItem: { display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", borderTop: "1px solid #1f1f1f", fontSize: 14, color: "#d1d5db" },

  previewCard: { flex: 1, background: "#0d0d0d", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" },
  previewHeader: { padding: "16px 24px", background: "#111", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" },
  previewBadge: { background: "#13082a", color: "#a78bfa", padding: "4px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600 },
  copyBtn: { background: "#1f1f1f", border: "none", color: "#e5e5e5", padding: "8px 20px", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  markdownContent: { padding: "40px", overflowY: "auto", flex: 1, lineHeight: 1.7, fontSize: 15, color: "#e5e5e5" },
};