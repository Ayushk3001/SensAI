"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Square, Loader2, Volume2, UploadCloud, Play } from 'lucide-react';
import pdfToText from 'react-pdftotext'; // NEW: Client-side parser

export default function VoiceInterviewPage() {
  // Setup State
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [isParsingPdf, setIsParsingPdf] = useState(false);

  // Interview State
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // NEW: Handle PDF Parsing directly in the browser!
  const handleStartInterview = async () => {
    if (!jobDescription || !resumeFile) {
      alert("Please provide both a job description and a resume.");
      return;
    }

    setIsParsingPdf(true);
    try {
      // Magically extract text in the browser
      const extractedText = await pdfToText(resumeFile);
      
      setResumeText(extractedText);
      setIsSetupComplete(true);
      
      // Add an initial greeting to the chat
      setMessages([{ role: 'ai', text: "Hello! I have reviewed your resume and the job description. Whenever you are ready, hit 'Start Recording' and introduce yourself to begin the interview." }]);
    } catch (error) {
      console.error("PDF extraction failed", error);
      alert("Failed to read the resume. Please ensure it is a valid text-based PDF.");
    } finally {
      setIsParsingPdf(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = processAudio;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert("Please allow microphone access to use this feature.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processAudio = async () => {
    setIsProcessing(true);
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const audioFile = new File([audioBlob], "recording.webm", { type: 'audio/webm' });

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("jobDescription", jobDescription);
    formData.append("resumeText", resumeText); 
    
    const historyForAPI = messages
      .filter((m, idx) => idx !== 0) 
      .map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));
      
    formData.append("history", JSON.stringify(historyForAPI));

    try {
      const response = await fetch('/api/interview/audio', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setMessages(prev => [
        ...prev, 
        { role: 'user', text: data.userText },
        { role: 'ai', text: data.aiText }
      ]);

      if (data.audioBase64) {
        const audioDataUrl = `data:audio/mp3;base64,${data.audioBase64}`;
        const audio = new Audio(audioDataUrl);
        audio.play();
      }

    } catch (error) {
      console.error("Failed to process:", error);
      alert("Something went wrong with the AI processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  // UI Phase 1: Setup
  if (!isSetupComplete) {
    return (
      <div className="container mx-auto py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Configure Mock Interview</h1>
        <p className="text-muted-foreground mb-8">Provide the job details and your resume so the AI can tailor your interview questions.</p>

        <Card>
          <CardHeader>
            <CardTitle>Interview Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Target Job Description</Label>
              <Textarea 
                placeholder="Paste the requirements and responsibilities of the job you want..." 
                className="min-h-[150px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Upload Resume (PDF)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground bg-slate-50 hover:bg-slate-100 transition-colors">
                <UploadCloud className="h-8 w-8 mb-2" />
                <Input 
                  type="file" 
                  accept=".pdf" 
                  className="max-w-[250px]"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                <p className="text-sm mt-2">Only PDF files are supported</p>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleStartInterview} disabled={isParsingPdf}>
              {isParsingPdf ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Preparing Interview Engine...</>
              ) : (
                <><Play className="mr-2 h-5 w-5" /> Start Interview</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // UI Phase 2: The Interview
  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Live Interview</h1>
      <p className="text-muted-foreground mb-8">Speak clearly. The AI is analyzing your answers against the provided job description.</p>

      <Card className="mb-6 border-primary/20 shadow-md">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" /> Interview Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] overflow-y-auto flex flex-col space-y-4 p-6">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl max-w-[85%] ${
                msg.role === 'ai' 
                  ? 'bg-muted text-foreground self-start rounded-tl-none' 
                  : 'bg-primary text-primary-foreground self-end rounded-tr-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70">
                {msg.role === 'ai' ? <Volume2 className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span className="font-semibold text-xs uppercase tracking-wider">
                  {msg.role === 'ai' ? 'Interviewer' : 'You'}
                </span>
              </div>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-3 text-muted-foreground p-4 bg-muted rounded-xl self-start max-w-[50%]">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> 
              <span className="text-sm">Interviewer is analyzing...</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        {!isRecording ? (
          <Button size="lg" className="rounded-full px-8 h-14" onClick={startRecording} disabled={isProcessing}>
            <Mic className="mr-2 h-5 w-5" /> Tap to Speak
          </Button>
        ) : (
          <Button size="lg" variant="destructive" className="rounded-full px-8 h-14 animate-pulse" onClick={stopRecording}>
            <Square className="mr-2 h-5 w-5" /> Stop & Submit Answer
          </Button>
        )}
      </div>
    </div>
  );
}