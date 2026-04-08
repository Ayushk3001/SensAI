"use client";

import React, { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Mic,
  Square,
  Loader2,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";

import pdfToText from "react-pdftotext";
import { evaluateVoiceInterview } from "@/actions/interview";

export default function VoiceInterviewPage() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [isParsingPdf, setIsParsingPdf] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ================= RESET =================
  const resetInterview = () => {
    setResults(null);
    setMessages([]);
    setIsSetupComplete(false);
    setJobDescription("");
    setResumeFile(null);
    setResumeText("");
  };

  // ================= SETUP =================
  const handleStartInterview = async () => {
    if (!jobDescription || !resumeFile) {
      alert("Provide job description & resume");
      return;
    }

    setIsParsingPdf(true);
    try {
      const text = await pdfToText(resumeFile);
      setResumeText(text);
      setIsSetupComplete(true);

      setMessages([
        {
          role: "ai",
          text: "I've had a look at your resume. Feel free to introduce yourself whenever you're ready",
        },
      ]);
    } finally {
      setIsParsingPdf(false);
    }
  };

  // ================= RECORD =================
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = processAudio;
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
  };

  // ================= PROCESS =================
  const processAudio = async () => {
    setIsProcessing(true);

    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const file = new File([blob], "recording.webm");

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("jobDescription", jobDescription);
    formData.append("resumeText", resumeText);

    const history = messages.map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.text,
    }));

    formData.append("history", JSON.stringify(history));

    try {
      const res = await fetch("/api/interview/audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "user", text: data.userText },
        { role: "ai", text: data.aiText },
      ]);

      if (data.audioBase64) {
        new Audio(`data:audio/mp3;base64,${data.audioBase64}`).play();
      }
    } catch (err) {
      alert("Error processing audio");
    } finally {
      setIsProcessing(false);
    }
  };

  // ================= EVALUATE =================
  const handleEndInterview = async () => {
    setIsEvaluating(true);

    const history = messages.map((m) => ({
      role: m.role === "ai" ? "Interviewer" : "Candidate",
      content: m.text,
    }));

    try {
      const data = await evaluateVoiceInterview(history, jobDescription);
      setResults(data);
    } catch {
      alert("Evaluation failed");
    } finally {
      setIsEvaluating(false);
    }
  };

  // ================= SETUP UI =================
  if (!isSetupComplete) {
    return (
      <div className="container mx-auto py-10 max-w-2xl">
        <Card className="border border-white/10">
          <CardHeader>
            <CardTitle>Interview Context</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <Label>Job Description</Label>
              <Textarea
                className="min-h-[150px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div>
              <Label>Resume</Label>
              <div className="border-2 border-dashed p-6 rounded-lg text-center">
                <UploadCloud className="mx-auto mb-2" />
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </div>
            </div>

            <Button onClick={handleStartInterview}>
              {isParsingPdf ? "Preparing..." : "Start Interview"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ================= RESULTS =================
  if (results) {
    return (
      <div className="container mx-auto py-10 max-w-3xl">

        <div className="text-center mb-8">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Interview Complete</h1>
        </div>

        {/* SCORES + METRICS INSIDE */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          {/* OVERALL */}
          <Card className="p-4 text-center border border-white/10">
            <p className="text-sm text-muted-foreground">Overall</p>
            <p className="text-3xl font-bold mb-2">
              {results.scores.overall}/10
            </p>
          </Card>

          {/* TECHNICAL */}
          <Card className="p-4 border border-white/10">
            <p className="text-sm text-muted-foreground text-center">Technical</p>
            <p className="text-3xl font-bold text-center mb-2">
              {results.scores.technical}/10
            </p>

            <ul className="text-xs space-y-1 text-muted-foreground">
              {results.keyMetrics?.slice(0, 2).map((m, i) => (
                <li key={i}>• {m}</li>
              ))}
            </ul>
          </Card>

          {/* COMMUNICATION */}
          <Card className="p-4 border border-white/10">
            <p className="text-sm text-muted-foreground text-center">Communication</p>
            <p className="text-3xl font-bold text-center mb-2">
              {results.scores.communication}/10
            </p>

            <ul className="text-xs space-y-1 text-muted-foreground">
              {results.keyMetrics?.slice(2, 4).map((m, i) => (
                <li key={i}>• {m}</li>
              ))}
            </ul>
          </Card>

        </div>

        {/* FEEDBACK */}
        <Card className="mb-6 border border-white/10">
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed whitespace-pre-wrap break-words">
              {results.feedback}
            </p>
          </CardContent>
        </Card>

        {/* RESET BUTTON */}
        <div className="mt-8 flex justify-center">
          <Button onClick={resetInterview}>
            Start New Interview
          </Button>
        </div>

      </div>
    );
  }

  const canEndInterview = messages.length >= 8;

  // ================= INTERVIEW =================
  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Live Interview</h1>

        <Button
          onClick={handleEndInterview}
          disabled={!canEndInterview || isEvaluating}
        >
          {isEvaluating ? "Evaluating..." : "End Interview"}
        </Button>
      </div>

      <Card className="border border-white/10">
        <CardContent className="h-[400px] overflow-y-auto flex flex-col gap-4 p-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl max-w-[85%] ${
                msg.role === "ai"
                  ? "bg-muted self-start"
                  : "bg-primary text-primary-foreground self-end"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap break-words">
                {msg.text}
              </p>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin h-4 w-4" />
              Processing...
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center mt-6">
        {!isRecording ? (
          <Button onClick={startRecording}>
            <Mic className="mr-2" /> Speak
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopRecording}>
            <Square className="mr-2 animate-pulse" /> Recording...
          </Button>
        )}
      </div>
    </div>
  );
}