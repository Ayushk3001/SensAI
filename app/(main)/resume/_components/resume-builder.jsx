"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, FileText, TrendingUp, AlertCircle, CheckCircle2, Copy, Check, Sparkles, History } from "lucide-react";
import pdfToText from "react-pdftotext";
import ReactMarkdown from "react-markdown";
import { analyzeAndSaveResume } from "@/actions/resume";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ScoreRing = ({ score, max = 100, size = 110, stroke = 8, color = "hsl(var(--primary))" }) => {
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

export default function ResumeBuilder({ initialData, initialVersions = [], showDashboard = false }) {
  const [resumeText, setResumeText] = useState(initialData?.content || "");
  const [fileName, setFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis");
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [versions, setVersions] = useState(initialVersions);

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
      setVersions((prev) => [
        {
          id: result.versionId,
          title: "Latest tailored resume",
          content: result.tailoredResume,
          atsScore: result.score,
          missingKeywords: result.missingKeywords || [],
          recommendations: result.recommendations || [],
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
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

  const scoredVersions = versions.filter((version) => typeof version.atsScore === "number");
  const averageScore = scoredVersions.length
    ? scoredVersions.reduce((sum, version) => sum + version.atsScore, 0) / scoredVersions.length
    : 0;
  const latestScore = versions[0]?.atsScore;
  const bestScore = scoredVersions.length
    ? Math.max(...scoredVersions.map((version) => version.atsScore))
    : 0;
  const scoreTrend = [...versions]
    .reverse()
    .filter((version) => typeof version.atsScore === "number")
    .map((version) => ({
      date: new Date(version.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: version.atsScore,
    }));

  return (
    <div style={s.root}>
      {showDashboard && <div style={s.dashboardWrap}>
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Resume Dashboard</h1>
          <p style={s.pageSub}>See previous ATS interactions, compare saved versions, and tailor a new resume.</p>
        </div>

        <div style={s.statGrid}>
          <div style={s.statCard}>
            <p style={s.statLabel}>Average ATS Score</p>
            <p style={s.statValue}>{averageScore.toFixed(1)}<span style={s.statUnit}>%</span></p>
            <p style={s.statHelp}>Across saved interactions</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Resume Versions</p>
            <p style={s.statValue}>{versions.length}</p>
            <p style={s.statHelp}>Tailored resumes saved</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Latest / Best Score</p>
            <p style={s.statValue}>{latestScore ?? "—"}<span style={s.statUnit}>{latestScore ? "%" : ""}</span></p>
            <p style={s.statHelp}>Best score {bestScore || "N/A"}{bestScore ? "%" : ""}</p>
          </div>
        </div>

        <div style={s.analyticsGrid}>
          <div style={s.chartCard}>
            <div style={s.chartHeader}>
              <div style={s.chartIcon}><TrendingUp size={24} /></div>
              <div>
                <h2 style={s.sectionTitle}>ATS Score Trend</h2>
                <p style={s.sectionSub}>Your resume match score over time</p>
              </div>
            </div>
            <div style={s.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--popover-foreground))" }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={s.recentCard}>
            <div style={s.recentHeader}>
              <h2 style={s.sectionTitle}>Previous Interactions</h2>
              <History size={18} color="hsl(var(--primary))" />
            </div>
            <div style={s.historyListCompact}>
              {versions.length ? versions.slice(0, 6).map((version) => (
                <button
                  key={version.id}
                  style={s.compactHistoryItem}
                  onClick={() => {
                    setAnalysis({
                      score: version.atsScore,
                      missingKeywords: version.missingKeywords || [],
                      recommendations: version.recommendations || [],
                      tailoredResume: version.content,
                    });
                    setResumeText(version.content);
                    setActiveTab("preview");
                  }}
                >
                  <span>
                    <span style={s.compactTitle}>{version.title}</span>
                    <span style={s.compactDate}>
                      {new Date(version.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </span>
                  <span style={s.compactScore}>{version.atsScore ?? "N/A"}%</span>
                </button>
              )) : (
                <div style={s.emptyMini}>No resume interactions yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>}

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
                  <CheckCircle2 size={20} color="hsl(var(--primary))" />
                  <span style={s.fileNameText}>{fileName}</span>
                </div>
              ) : (
                <>
                  <FileText size={28} color="hsl(var(--muted-foreground))" />
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
              <Sparkles size={72} color="hsl(var(--primary))" />
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
                          <CheckCircle2 size={18} color="hsl(var(--primary))" />
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
                      {copied ? <Check size={18} color="hsl(var(--primary))" /> : <Copy size={18} />}
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

      {versions.length > 0 && (
        <div style={s.historyPanel}>
          <div style={s.historyHeader}>
            <div>
              <p style={s.formLabel}>Resume version history</p>
              <h2 style={s.historyTitle}>Saved tailored resumes</h2>
            </div>
            <History size={20} color="hsl(var(--primary))" />
          </div>
          <div style={s.historyGrid}>
            {versions.map((version) => (
              <button
                key={version.id}
                style={s.versionCard}
                onClick={() => {
                  setAnalysis({
                    score: version.atsScore,
                    missingKeywords: version.missingKeywords || [],
                    recommendations: version.recommendations || [],
                    tailoredResume: version.content,
                  });
                  setResumeText(version.content);
                  setActiveTab("preview");
                }}
              >
                <span style={s.versionScore}>{version.atsScore ?? "N/A"} ATS</span>
                <span style={s.versionTitle}>{version.title}</span>
                <span style={s.versionMeta}>
                  {new Date(version.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

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
  root: { minHeight: "100vh", background: "hsl(var(--background))", color: "hsl(var(--foreground))", fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif", padding: "40px 48px" },
  dashboardWrap: { marginBottom: 40 },
  pageHeader: { marginBottom: 28 },
  pageTitle: { fontSize: 64, fontWeight: 800, lineHeight: 1, color: "hsl(var(--foreground))", margin: 0, letterSpacing: "-0.02em" },
  pageSub: { marginTop: 12, color: "hsl(var(--muted-foreground))", fontSize: 16 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 36, marginBottom: 36 },
  statCard: { minHeight: 186, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "38px 36px", boxShadow: "0 18px 45px -28px hsl(var(--foreground) / 0.35)" },
  statLabel: { color: "hsl(var(--muted-foreground))", fontSize: 20, fontWeight: 600, margin: 0 },
  statValue: { color: "hsl(var(--foreground))", fontSize: 56, fontWeight: 800, margin: "24px 0 6px", lineHeight: 1 },
  statUnit: { fontSize: 28, color: "hsl(var(--muted-foreground))", marginLeft: 2 },
  statHelp: { color: "hsl(var(--muted-foreground))", fontSize: 18, margin: 0 },
  analyticsGrid: { display: "grid", gridTemplateColumns: "minmax(0, 2fr) 420px", gap: 32 },
  chartCard: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: 36 },
  chartHeader: { display: "flex", alignItems: "center", gap: 20, marginBottom: 28 },
  chartIcon: { width: 56, height: 56, borderRadius: "50%", background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", display: "flex", alignItems: "center", justifyContent: "center" },
  sectionTitle: { color: "hsl(var(--foreground))", fontSize: 34, fontWeight: 800, margin: 0 },
  sectionSub: { color: "hsl(var(--muted-foreground))", fontSize: 18, margin: "4px 0 0" },
  chartBox: { height: 320 },
  recentCard: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: 24 },
  recentHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  historyListCompact: { display: "grid", gap: 10 },
  compactHistoryItem: { width: "100%", background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, textAlign: "left" },
  compactTitle: { display: "block", color: "hsl(var(--foreground))", fontSize: 14, fontWeight: 700 },
  compactDate: { display: "block", color: "hsl(var(--muted-foreground))", fontSize: 12, marginTop: 4 },
  compactScore: { color: "hsl(var(--primary))", fontSize: 14, fontWeight: 800 },
  emptyMini: { color: "hsl(var(--muted-foreground))", border: "1px dashed hsl(var(--border))", borderRadius: 8, padding: 20, textAlign: "center" },
  mainGrid: { display: "grid", gridTemplateColumns: "420px 1fr", gap: 40, minHeight: "calc(100vh - 80px)" },
  leftPanel: { background: "linear-gradient(160deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)", borderRadius: 8, padding: "48px", display: "flex", flexDirection: "column", border: "1px solid hsl(var(--border))" },
  brand: { display: "flex", alignItems: "center", gap: 8, marginBottom: 40 },
  brandDot: { width: 8, height: 8, borderRadius: "50%", background: "hsl(var(--primary))" },
  brandText: { fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "0.04em" },
  heroTitle: { fontSize: 42, fontWeight: 700, lineHeight: 1.1, color: "hsl(var(--foreground))", marginBottom: 12 },
  heroAccent: { color: "hsl(var(--primary))" },
  heroSub: { fontSize: 15, color: "hsl(var(--muted-foreground))", lineHeight: 1.7, marginBottom: 40 },
  formCard: { flex: 1, display: "flex", flexDirection: "column" },
  formLabel: { fontSize: 12, fontWeight: 600, color: "hsl(var(--muted-foreground))", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 },
  dropzone: { border: "1px dashed hsl(var(--border))", borderRadius: 8, padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", transition: "all 0.15s", background: "hsl(var(--muted))" },
  dropzoneActive: { borderColor: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.10)" },
  dropzoneDone: { borderColor: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.10)" },
  dropzoneDoneInner: { display: "flex", alignItems: "center", gap: 12 },
  dropzoneText: { fontSize: 14, color: "hsl(var(--muted-foreground))", textAlign: "center" },
  browseLink: { color: "hsl(var(--primary))", cursor: "pointer", fontWeight: 600 },
  fileNameText: { fontSize: 15, color: "hsl(var(--primary))", fontWeight: 500 },
  textarea: { width: "100%", background: "hsl(var(--card))", border: "1px solid hsl(var(--input))", borderRadius: 8, padding: "18px", fontSize: 15, color: "hsl(var(--foreground))", lineHeight: 1.6, resize: "vertical", minHeight: 220, fontFamily: "inherit" },
  startBtn: { background: "hsl(var(--primary))", border: "none", borderRadius: 8, padding: "18px 28px", color: "hsl(var(--primary-foreground))", fontSize: 17, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "all 0.2s" },

  resultsPanel: { background: "hsl(var(--card))", borderRadius: 8, border: "1px solid hsl(var(--border))", padding: "32px", display: "flex", flexDirection: "column" },
  emptyState: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: 0.6 },
  emptyTitle: { fontSize: 24, fontWeight: 700, marginTop: 24, marginBottom: 12 },
  emptyDesc: { fontSize: 15, color: "hsl(var(--muted-foreground))", maxWidth: 320 },

  tabBar: { display: "flex", background: "hsl(var(--muted))", borderRadius: 8, padding: 4, marginBottom: 24 },
  tabBtn: { flex: 1, padding: "14px", borderRadius: 8, fontSize: 14, fontWeight: 600, background: "transparent", border: "none", color: "hsl(var(--muted-foreground))", transition: "all 0.2s" },
  tabBtnActive: { background: "hsl(var(--card))", color: "hsl(var(--foreground))", boxShadow: "0 4px 12px -8px hsl(var(--foreground) / 0.35)" },

  analysisCard: { flex: 1, background: "hsl(var(--muted))", borderRadius: 8, padding: 32 },
  scoreSection: { position: "relative", width: 130, height: 130, margin: "0 auto 16px" },
  scoreCenter: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", fontWeight: 700 },
  scoreBig: { fontSize: 42, lineHeight: 1, color: "hsl(var(--foreground))" },
  scorePercent: { fontSize: 18, color: "hsl(var(--primary))" },
  scoreLabel: { textAlign: "center", fontSize: 13, color: "hsl(var(--muted-foreground))", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },

  metricSection: { marginTop: 32 },
  metricTitle: { fontSize: 13, fontWeight: 600, color: "hsl(var(--destructive))", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 },
  keywordChips: { display: "flex", flexWrap: "wrap", gap: 8 },
  keywordChip: { background: "hsl(var(--accent) / 0.12)", color: "hsl(var(--accent))", fontSize: 13, padding: "6px 14px", borderRadius: 999, border: "1px solid hsl(var(--accent) / 0.28)" },

  recommendations: { marginTop: 40 },
  recList: { listStyle: "none", padding: 0, margin: 0 },
  recItem: { display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", borderTop: "1px solid hsl(var(--border))", fontSize: 14, color: "hsl(var(--foreground))" },

  previewCard: { flex: 1, background: "hsl(var(--muted))", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column" },
  previewHeader: { padding: "16px 24px", background: "hsl(var(--card))", borderBottom: "1px solid hsl(var(--border))", display: "flex", alignItems: "center", justifyContent: "space-between" },
  previewBadge: { background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))", padding: "4px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600 },
  copyBtn: { background: "hsl(var(--secondary) / 0.12)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", padding: "8px 20px", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  markdownContent: { padding: "40px", overflowY: "auto", flex: 1, lineHeight: 1.7, fontSize: 15, color: "hsl(var(--foreground))" },
  historyPanel: { marginTop: 28, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: 24 },
  historyHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  historyTitle: { color: "hsl(var(--foreground))", fontSize: 22, fontWeight: 700, margin: 0 },
  historyGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 },
  versionCard: { background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: 16, textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 },
  versionScore: { color: "hsl(var(--primary))", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" },
  versionTitle: { color: "hsl(var(--foreground))", fontSize: 15, fontWeight: 600 },
  versionMeta: { color: "hsl(var(--muted-foreground))", fontSize: 12 },
};
