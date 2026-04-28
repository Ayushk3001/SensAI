"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Mic, Square, Loader2, UploadCloud, CheckCircle2, ChevronRight, Zap, Brain, MessageSquare, BarChart3, X, ArrowRight } from "lucide-react";
import pdfToText from "react-pdftotext";
import { evaluateVoiceInterview } from "@/actions/interview";

const INTERVIEW_TYPES = [
  { value: "technical", label: "Technical", icon: "⌨", desc: "DSA, system design & coding" },
  { value: "hr", label: "HR & Behavioral", icon: "◈", desc: "Culture fit & soft skills" },
  { value: "aptitude", label: "Aptitude", icon: "◉", desc: "Logical & analytical thinking" },
  { value: "managerial", label: "Managerial", icon: "◆", desc: "Leadership & situational" },
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

export default function VoiceInterviewPage() {
  const [step, setStep] = useState("setup"); // setup | interview | results
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [interviewType, setInterviewType] = useState("technical");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const resetInterview = () => {
    setResults(null); setMessages([]); setStep("setup");
    setJobDescription(""); setResumeFile(null); setResumeText("");
    setInterviewType("technical");
  };

  const handleStartInterview = async () => {
    if (!jobDescription || !resumeFile) return;
    setIsParsingPdf(true);
    try {
      const text = await pdfToText(resumeFile);
      setResumeText(text);
      setMessages([{
        role: "ai",
        text: `Welcome! I'll be conducting your ${INTERVIEW_TYPES.find(t => t.value === interviewType)?.label} interview today. I've reviewed your resume. Feel free to introduce yourself whenever you're ready.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
      setStep("interview");
    } finally {
      setIsParsingPdf(false);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
    recorder.onstop = processAudio;
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
  };

  const processAudio = async () => {
    setIsProcessing(true);
    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", new File([blob], "recording.webm"));
    formData.append("jobDescription", jobDescription);
    formData.append("resumeText", resumeText);
    formData.append("interviewType", interviewType);
    formData.append("history", JSON.stringify(messages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }))));
    try {
      const res = await fetch("/api/interview/audio", { method: "POST", body: formData });
      const data = await res.json();
      const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev,
        { role: "user", text: data.userText, time: t },
        { role: "ai", text: data.aiText, time: t }
      ]);
      if (data.audioBase64) new Audio(`data:audio/mp3;base64,${data.audioBase64}`).play();
      setTimeout(scrollToBottom, 100);
    } catch { alert("Error processing audio"); }
    finally { setIsProcessing(false); }
  };

  const handleEndInterview = async () => {
    setIsEvaluating(true);
    try {
      const data = await evaluateVoiceInterview(
        messages.map(m => ({ role: m.role === "ai" ? "Interviewer" : "Candidate", content: m.text })),
        jobDescription, interviewType
      );
      setResults(data);
      setStep("results");
    } catch { alert("Evaluation failed"); }
    finally { setIsEvaluating(false); }
  };

  const selectedType = INTERVIEW_TYPES.find(t => t.value === interviewType);
  // ─── SETUP ────────────────────────────────────────────────────────────────────
  if (step === "setup") return (
    <div style={s.root}>
      <div style={s.setupGrid}>

        {/* Left panel */}
        <div style={s.leftPanel}>
          <div style={s.brand}>
            <div style={s.brandDot} />
            <span style={s.brandText}>InterviewAI</span>
          </div>
          <h1 style={s.heroTitle}>Ace your next<br /><span style={s.heroAccent}>interview</span></h1>
          <p style={s.heroSub}>AI-powered mock interviews tailored to your resume and role. Get real-time feedback and improve faster.</p>
          <div style={s.featureList}>
            {[
              { icon: "◈", text: "Adaptive follow-up questions" },
              { icon: "◉", text: "Voice-to-voice natural flow" },
              { icon: "◆", text: "Detailed scoring & feedback" },
            ].map((f, i) => (
              <div key={i} style={s.featureItem}>
                <span style={s.featureIcon}>{f.icon}</span>
                <span style={s.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div style={s.formCard}>
          <p style={s.formLabel}>Select interview type</p>
          <div style={s.typeGrid}>
            {INTERVIEW_TYPES.map(t => (
              <button key={t.value} onClick={() => setInterviewType(t.value)} style={{ ...s.typeBtn, ...(interviewType === t.value ? s.typeBtnActive : {}) }}>
                <span style={s.typeIcon}>{t.icon}</span>
                <span style={s.typeName}>{t.label}</span>
                <span style={s.typeDesc}>{t.desc}</span>
                {interviewType === t.value && <div style={s.typeTick}>✓</div>}
              </button>
            ))}
          </div>

          <p style={{ ...s.formLabel, marginTop: 28 }}>Job description</p>
          <textarea
            style={s.textarea}
            placeholder="Paste the job description here — role requirements, responsibilities, tech stack…"
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            rows={5}
          />

          <p style={{ ...s.formLabel, marginTop: 24 }}>Resume (PDF)</p>
          <div
            style={{ ...s.dropzone, ...(dragOver ? s.dropzoneActive : {}), ...(resumeFile ? s.dropzoneDone : {}) }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") setResumeFile(f); }}
          >
            {resumeFile ? (
              <div style={s.dropzoneDoneInner}>
                <CheckCircle2 size={18} color="hsl(var(--primary))" />
                <span style={s.fileNameText}>{resumeFile.name}</span>
                <button onClick={() => setResumeFile(null)} style={s.removeBtn}><X size={14} /></button>
              </div>
            ) : (
              <>
                <UploadCloud size={20} color="hsl(var(--muted-foreground))" />
                <span style={s.dropzoneText}>Drop PDF here or <label style={s.browseLink}>browse<input type="file" accept=".pdf" style={{ display: "none" }} onChange={e => setResumeFile(e.target.files[0])} /></label></span>
              </>
            )}
          </div>

          <button
            onClick={handleStartInterview}
            disabled={!jobDescription || !resumeFile || isParsingPdf}
            style={{ ...s.startBtn, ...((!jobDescription || !resumeFile) ? s.startBtnDisabled : {}) }}
          >
            {isParsingPdf ? (
              <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Preparing your interview…</>
            ) : (
              <><span>Begin Interview</span><ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.2);opacity:0} }
        * { box-sizing: border-box; }
        textarea:focus, input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 4px; }
      `}</style>
    </div>
  );

  // ─── RESULTS ──────────────────────────────────────────────────────────────────
  if (step === "results") {
    const competencyLabel = interviewType === "hr" ? "Behavioral" : interviewType === "aptitude" ? "Logical" : interviewType === "managerial" ? "Managerial" : "Technical";
    const competencyScore = results?.scores?.competency ?? results?.scores?.technical ?? 0;
    const ringColors = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(160 84% 39%)"];
    const scores = [
      { label: "Overall", value: results?.scores?.overall ?? 0, color: ringColors[0] },
      { label: competencyLabel, value: competencyScore, color: ringColors[1] },
      { label: "Communication", value: results?.scores?.communication ?? 0, color: ringColors[2] },
    ];
    return (
      <div style={s.root}>
        <div style={s.resultsWrap}>
          <div style={s.resultsHeader}>
            <div style={s.resultsBadge}><CheckCircle2 size={14} color="hsl(var(--primary))" /> Session complete</div>
            <h1 style={s.resultsTitle}>Interview Results</h1>
            <p style={s.resultsSub}>{selectedType?.label} interview · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          </div>

          <div style={s.scoreRow}>
            {scores.map((sc, i) => (
              <div key={i} style={s.scoreCard}>
                <div style={s.scoreRingWrap}>
                  <ScoreRing score={sc.value} size={84} stroke={5} color={sc.color} />
                  <div style={{ ...s.scoreCenter, color: sc.color }}>{sc.value}<span style={s.scoreDen}>/10</span></div>
                </div>
                <p style={s.scoreLabel}>{sc.label}</p>
              </div>
            ))}
          </div>

          {results?.keyMetrics?.length > 0 && (
            <div style={s.metricsRow}>
              {results.keyMetrics.map((m, i) => (
                <div key={i} style={s.metricChip}><span style={s.metricDot} />"{m}"</div>
              ))}
            </div>
          )}

          <div style={s.feedbackCard}>
            <div style={s.feedbackHeader}>
              <Brain size={16} color="hsl(var(--primary))" />
              <span style={s.feedbackTitle}>Detailed Feedback</span>
            </div>
            <p style={s.feedbackBody}>{results?.feedback}</p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={resetInterview} style={s.newBtn}>Start New Interview</button>
              <Link href="/interview/voice" style={s.dashboardBtn}>Back to Dashboard</Link>
            </div>
          </div>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 4px; }`}</style>
      </div>
    );
  }

  // ─── INTERVIEW ────────────────────────────────────────────────────────────────
  const canEnd = messages.length >= 8;
  return (
    <div style={s.root}>
      <div style={{ padding: "24px 48px 0" }}>
        <Link href="/interview/voice" style={s.backLink}>
          Back to Voice Dashboard
        </Link>
      </div>
      <div style={s.interviewLayout}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={s.brand}>
            <div style={s.brandDot} />
            <span style={s.brandText}>InterviewAI</span>
          </div>
          <div style={s.sideSection}>
            <p style={s.sideLabel}>Interview Type</p>
            <div style={s.sideBadge}><span style={s.sideIcon}>{selectedType?.icon}</span>{selectedType?.label}</div>
          </div>
          <div style={s.sideSection}>
            <p style={s.sideLabel}>Progress</p>
            <div style={s.progressTrack}>
              <div style={{ ...s.progressFill, width: `${Math.min(100, (messages.filter(m => m.role === "user").length / 4) * 100)}%` }} />
            </div>
            <p style={s.progressText}>{messages.filter(m => m.role === "user").length} of ~4 questions answered</p>
          </div>
          <div style={s.sideSection}>
            <p style={s.sideLabel}>Tips</p>
            {["Speak clearly and confidently", "Use specific examples (STAR)", "Take a moment before answering"].map((tip, i) => (
              <p key={i} style={s.tip}>· {tip}</p>
            ))}
          </div>
          <div style={{ flexGrow: 1 }} />
          <button
            onClick={handleEndInterview}
            disabled={!canEnd || isEvaluating}
            style={{ ...s.endBtn, ...(!canEnd || isEvaluating ? s.endBtnDisabled : {}) }}
          >
            {isEvaluating ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Evaluating…</> : "End & Evaluate"}
          </button>
          {!canEnd && <p style={s.endHint}>Answer a few more questions to end</p>}
        </div>

        {/* Main chat */}
        <div style={s.chatArea}>
          <div style={s.chatFeed}>
            {messages.map((msg, i) => (
              <div key={i} style={{ ...s.bubble, ...(msg.role === "user" ? s.bubbleUser : s.bubbleAI) }}>
                {msg.role === "ai" && <div style={s.aiAvatar}>AI</div>}
                <div style={{ ...s.bubbleInner, ...(msg.role === "user" ? s.bubbleInnerUser : s.bubbleInnerAI) }}>
                  <p style={s.bubbleText}>{msg.text}</p>
                  {msg.time && <p style={s.bubbleTime}>{msg.time}</p>}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div style={s.bubble}>
                <div style={s.aiAvatar}>AI</div>
                <div style={s.bubbleInnerAI}>
                  <div style={s.typingDots}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div key={i} style={{ ...s.dot, animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Mic */}
          <div style={s.micBar}>
            <div style={s.micBarInner}>
              {isRecording && (
                <div style={s.recordingIndicator}>
                  <div style={s.recDot} />
                  <span style={s.recText}>Recording…</span>
                </div>
              )}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                style={{ ...s.micBtn, ...(isRecording ? s.micBtnActive : {}), ...(isProcessing ? s.micBtnDisabled : {}) }}
              >
                {isProcessing ? (
                  <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
                ) : isRecording ? (
                  <Square size={20} fill="currentColor" />
                ) : (
                  <Mic size={22} />
                )}
                {isRecording && <div style={s.ripple} />}
              </button>
              <p style={s.micHint}>{isProcessing ? "Processing your response…" : isRecording ? "Tap to stop recording" : "Tap to speak"}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes ripple { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.5);opacity:0} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 4px; }
      `}</style>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = {
  root: { minHeight: "100vh", background: "hsl(var(--background))", color: "hsl(var(--foreground))", fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" },
  dashboardWrap: { maxWidth: 1476, margin: "0 auto", padding: "48px 24px 12px" },
  pageHeader: { marginBottom: 28 },
  pageTitle: { fontSize: 64, fontWeight: 800, lineHeight: 1, color: "hsl(var(--foreground))", margin: 0, letterSpacing: "-0.02em" },
  pageSub: { marginTop: 12, color: "hsl(var(--muted-foreground))", fontSize: 16 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 36, marginBottom: 36 },
  statCard: { minHeight: 186, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 14, padding: "38px 36px" },
  statLabel: { color: "hsl(var(--muted-foreground))", fontSize: 20, fontWeight: 600, margin: 0 },
  statValue: { color: "hsl(var(--foreground))", fontSize: 56, fontWeight: 800, margin: "24px 0 6px", lineHeight: 1 },
  statUnit: { fontSize: 28, color: "hsl(var(--foreground))", marginLeft: 2 },
  statHelp: { color: "hsl(var(--muted-foreground))", fontSize: 18, margin: 0 },
  analyticsGrid: { display: "grid", gridTemplateColumns: "minmax(0, 2fr) 420px", gap: 32 },
  chartCard: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 14, padding: 36 },
  chartHeader: { display: "flex", alignItems: "center", gap: 20, marginBottom: 28 },
  chartIcon: { width: 56, height: 56, borderRadius: "50%", background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", display: "flex", alignItems: "center", justifyContent: "center" },
  sectionTitle: { color: "hsl(var(--foreground))", fontSize: 34, fontWeight: 800, margin: 0 },
  sectionSub: { color: "hsl(var(--muted-foreground))", fontSize: 18, margin: "4px 0 0" },
  chartBox: { height: 320 },
  recentCard: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 14, padding: 24 },
  recentHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  emptyMini: { color: "hsl(var(--muted-foreground))", border: "1px dashed hsl(var(--border))", borderRadius: 12, padding: 20, textAlign: "center" },

  // SETUP
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

  formCard: { flex: 1, padding: "60px 48px", overflowY: "auto" },
  formLabel: { fontSize: 12, fontWeight: 600, color: "hsl(var(--muted-foreground))", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 },
  typeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  typeBtn: { position: "relative", background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, padding: "14px 16px", textAlign: "left", cursor: "pointer", transition: "all 0.15s", display: "flex", flexDirection: "column", gap: 4 },
  typeBtnActive: { background: "hsl(var(--primary) / 0.12)", border: "1px solid hsl(var(--primary))", boxShadow: "0 0 0 1px hsl(var(--primary) / 0.18)" },
  typeIcon: { fontSize: 18, marginBottom: 4 },
  typeName: { fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" },
  typeDesc: { fontSize: 11, color: "hsl(var(--muted-foreground))" },
  typeTick: { position: "absolute", top: 10, right: 12, fontSize: 11, color: "hsl(var(--primary))", fontWeight: 700 },

  textarea: { width: "100%", background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "hsl(var(--foreground))", lineHeight: 1.6, resize: "vertical", fontFamily: "inherit", transition: "border 0.15s" },
  dropzone: { border: "1px dashed hsl(var(--border))", borderRadius: 10, padding: "24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", transition: "all 0.15s", background: "hsl(var(--muted))" },
  dropzoneActive: { border: "1px dashed hsl(var(--primary))", background: "hsl(var(--primary) / 0.12)" },
  dropzoneDone: { border: "1px solid hsl(var(--primary))", background: "hsl(var(--primary) / 0.10)" },
  dropzoneDoneInner: { display: "flex", alignItems: "center", gap: 10 },
  dropzoneText: { fontSize: 13, color: "hsl(var(--muted-foreground))" },
  browseLink: { color: "hsl(var(--primary))", cursor: "pointer", fontWeight: 500 },
  fileNameText: { fontSize: 13, color: "hsl(var(--primary))", fontWeight: 500 },
  removeBtn: { background: "none", border: "none", color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" },
  startBtn: { marginTop: 28, width: "100%", background: "hsl(var(--primary))", border: "none", borderRadius: 10, padding: "14px 24px", color: "hsl(var(--primary-foreground))", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s", letterSpacing: "0.01em" },
  startBtnDisabled: { opacity: 0.4, cursor: "not-allowed" },

  // INTERVIEW
  interviewLayout: { display: "flex", height: "100vh" },
  sidebar: { width: 260, background: "hsl(var(--muted))", borderRight: "1px solid hsl(var(--border))", padding: "28px 24px", display: "flex", flexDirection: "column", flexShrink: 0 },
  sideSection: { marginTop: 28 },
  sideLabel: { fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 },
  sideBadge: { display: "inline-flex", alignItems: "center", gap: 6, background: "hsl(var(--primary) / 0.12)", border: "1px solid hsl(var(--primary) / 0.35)", borderRadius: 6, padding: "5px 10px", fontSize: 13, color: "hsl(var(--primary))", fontWeight: 500 },
  sideIcon: { fontSize: 14 },
  progressTrack: { height: 3, background: "hsl(var(--border))", borderRadius: 99, overflow: "hidden", marginBottom: 6 },
  progressFill: { height: "100%", background: "hsl(var(--primary))", borderRadius: 99, transition: "width 0.5s" },
  progressText: { fontSize: 12, color: "hsl(var(--muted-foreground))" },
  tip: { fontSize: 12, color: "hsl(var(--muted-foreground))", lineHeight: 1.8 },
  endBtn: { background: "hsl(var(--primary))", border: "none", borderRadius: 8, padding: "10px 16px", color: "hsl(var(--primary-foreground))", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 },
  endBtnDisabled: { opacity: 0.3, cursor: "not-allowed" },
  endHint: { fontSize: 11, color: "hsl(var(--muted-foreground))", textAlign: "center", marginTop: 6 },

  chatArea: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  chatFeed: { flex: 1, overflowY: "auto", padding: "32px 40px", display: "flex", flexDirection: "column", gap: 20 },
  bubble: { display: "flex", alignItems: "flex-start", gap: 12 },
  bubbleUser: { flexDirection: "row-reverse" },
  bubbleAI: { flexDirection: "row" },
  aiAvatar: { width: 32, height: 32, borderRadius: "50%", background: "hsl(var(--primary) / 0.12)", border: "1px solid hsl(var(--primary) / 0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "hsl(var(--primary))", flexShrink: 0 },
  bubbleInner: { maxWidth: "68%", borderRadius: 14, padding: "12px 16px" },
  bubbleInnerAI: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderTopLeftRadius: 4 },
  bubbleInnerUser: { background: "hsl(var(--primary) / 0.14)", border: "1px solid hsl(var(--primary) / 0.35)", borderTopRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 1.7, color: "hsl(var(--foreground))", margin: 0 },
  bubbleTime: { fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 4, textAlign: "right" },
  typingDots: { display: "flex", gap: 5, alignItems: "center", padding: "2px 0" },
  dot: { width: 7, height: 7, borderRadius: "50%", background: "hsl(var(--muted-foreground))", animation: "pulse 1.2s ease-in-out infinite" },

  micBar: { borderTop: "1px solid hsl(var(--border))", background: "hsl(var(--muted))", padding: "20px 40px" },
  micBarInner: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  recordingIndicator: { display: "flex", alignItems: "center", gap: 8 },
  recDot: { width: 8, height: 8, borderRadius: "50%", background: "hsl(var(--destructive))", animation: "pulse 1s ease-in-out infinite" },
  recText: { fontSize: 12, color: "hsl(var(--destructive))", fontWeight: 500 },
  micBtn: { position: "relative", width: 64, height: 64, borderRadius: "50%", background: "hsl(var(--border))", border: "1px solid hsl(var(--border))", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "hsl(var(--foreground))", transition: "all 0.15s" },
  micBtnActive: { background: "hsl(var(--primary))", border: "1px solid hsl(var(--primary))", color: "hsl(var(--primary-foreground))" },
  micBtnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  ripple: { position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid hsl(var(--primary))", animation: "ripple 1.2s ease-out infinite" },
  micHint: { fontSize: 12, color: "hsl(var(--muted-foreground))" },

  // RESULTS
  resultsWrap: { maxWidth: 720, margin: "0 auto", padding: "60px 24px" },
  resultsHeader: { textAlign: "center", marginBottom: 40 },
  resultsBadge: { display: "inline-flex", alignItems: "center", gap: 6, background: "hsl(var(--primary) / 0.10)", border: "1px solid hsl(var(--primary) / 0.30)", borderRadius: 99, padding: "4px 12px", fontSize: 12, color: "hsl(var(--primary))", fontWeight: 500, marginBottom: 16 },
  resultsTitle: { fontSize: 36, fontWeight: 700, color: "hsl(var(--foreground))", marginBottom: 6 },
  resultsSub: { fontSize: 14, color: "hsl(var(--muted-foreground))" },
  scoreRow: { display: "flex", gap: 16, marginBottom: 24 },
  scoreCard: { flex: 1, background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", borderRadius: 14, padding: "24px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  scoreRingWrap: { position: "relative", width: 84, height: 84, display: "flex", alignItems: "center", justifyContent: "center" },
  scoreCenter: { position: "absolute", fontSize: 22, fontWeight: 700 },
  scoreDen: { fontSize: 12, opacity: 0.5 },
  scoreLabel: { fontSize: 13, color: "hsl(var(--muted-foreground))", textAlign: "center", fontWeight: 500 },
  metricsRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  metricChip: { display: "flex", alignItems: "center", gap: 6, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6, padding: "5px 10px", fontSize: 12, color: "hsl(var(--muted-foreground))" },
  metricDot: { width: 5, height: 5, borderRadius: "50%", background: "hsl(var(--primary))", flexShrink: 0 },
  feedbackCard: { background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", borderRadius: 14, padding: "24px 28px" },
  feedbackHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 },
  feedbackTitle: { fontSize: 13, fontWeight: 600, color: "hsl(var(--muted-foreground))", letterSpacing: "0.06em", textTransform: "uppercase" },
  feedbackBody: { fontSize: 15, color: "hsl(var(--foreground))", lineHeight: 1.8, whiteSpace: "pre-wrap" },
  newBtn: { background: "hsl(var(--border))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "11px 28px", color: "hsl(var(--foreground))", fontSize: 14, fontWeight: 500, cursor: "pointer" },
  dashboardBtn: { background: "hsl(var(--primary))", border: "1px solid hsl(var(--primary))", borderRadius: 8, padding: "11px 28px", color: "hsl(var(--primary-foreground))", fontSize: 14, fontWeight: 600, textDecoration: "none" },
  backLink: { color: "hsl(var(--muted-foreground))", fontSize: 14, textDecoration: "none", fontWeight: 500 },
  voiceDashboard: { background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", borderRadius: 14, padding: 18, marginBottom: 28 },
  voiceDashHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  voiceDashTitle: { color: "hsl(var(--foreground))", fontSize: 20, fontWeight: 700, margin: 0 },
  voiceStats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 },
  voiceStat: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 4 },
  voiceStatValue: { color: "hsl(var(--foreground))", fontSize: 22, fontWeight: 700 },
  voiceStatLabel: { color: "hsl(var(--muted-foreground))", fontSize: 11 },
  historyList: { display: "grid", gap: 8 },
  historyItem: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, padding: "10px 12px" },
  historyType: { color: "hsl(var(--foreground))", fontSize: 13, fontWeight: 600, textTransform: "capitalize", margin: 0 },
  historyDate: { color: "hsl(var(--muted-foreground))", fontSize: 11, margin: 0 },
  historyScore: { color: "hsl(var(--primary))", fontSize: 13, fontWeight: 700 },
};
