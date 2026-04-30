"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Sparkles, ArrowRight, RotateCcw, Lock } from "lucide-react";

export default function Quiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [topic, setTopic] = useState("");

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
      setCurrentQuestion(0);
      setShowExplanation(false);
    }
  }, [quizData]);

  // Prevent changing answer once explanation is shown
  const handleAnswer = (answer) => {
    if (showExplanation) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) correct++;
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to save result");
    }
  };

  const retakeSameTopic = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    setResultData(null);
    generateQuizFn(topic);
  };

  const handleStartQuiz = () => {
    generateQuizFn(topic || undefined);
  };

  // Loading Screen
  if (generatingQuiz) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center">
        <BarLoader width={280} color="hsl(var(--primary))" />
        <p className="text-muted-foreground mt-6 text-sm">Generating smart questions...</p>
        </CardContent>
      </Card>
    );
  }

  // Results Screen
  if (resultData) {
    return (
      <div className="space-y-8">
        <QuizResult result={resultData} hideStartNew={true} />

        <Card className="border-primary/20 bg-card/70 backdrop-blur-xl soft-card-hover">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Ready for another round?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button
              size="lg"
              onClick={retakeSameTopic}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary text-primary-foreground px-8"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake {topic ? `"${topic}"` : "General Quiz"}
            </Button>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/interview")}
            >
              ← Return to Interview Insights
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Start Screen
  if (!quizData) {
    return (
      <Card className="max-w-2xl mx-auto border border-border/70 shadow-2xl shadow-primary/10 soft-card-hover">
        <CardHeader className="text-center pt-10 pb-8">
          <Badge variant="outline" className="mx-auto mb-4 border-primary/25 bg-primary/10 text-primary">
            AI question set
          </Badge>
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-4xl font-bold tracking-tighter">Test Your Knowledge</CardTitle>
          <p className="text-muted-foreground mt-3 max-w-xs mx-auto">
            10 targeted technical questions. Choose a topic or go general.
          </p>
        </CardHeader>

        <CardContent className="px-10 pb-10 space-y-8">
          <div className="space-y-3">
            <Label className="text-foreground">Specific Topic (optional)</Label>
            <Input
              placeholder="e.g. React Server Components, System Design, Python OOP..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-12 text-base"
            />
          </div>
        </CardContent>

        <CardFooter className="px-10 pb-10">
          <Button
            onClick={handleStartQuiz}
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary"
          >
            Start Quiz
            <ArrowRight className="ml-3" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Live Quiz Screen
  const question = quizData[currentQuestion];

  return (
      <Card className="max-w-3xl mx-auto border border-border/70 shadow-2xl shadow-primary/10">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            Question <span className="text-primary">{currentQuestion + 1}</span> / {quizData.length}
          </CardTitle>
          <Badge variant="secondary">
            {Math.round(((currentQuestion + 1) / quizData.length) * 100)}% complete
          </Badge>
        </div>
        <Progress value={((currentQuestion + 1) / quizData.length) * 100} className="mt-4" />
      </CardHeader>

      <CardContent className="pt-8 pb-6">
        <p className="text-xl font-medium leading-relaxed text-foreground mb-8">
          {question.question}
        </p>

        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-3"
          disabled={showExplanation}
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-4 bg-muted/70 border transition-all rounded-lg px-6 py-4 ${
                showExplanation
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:bg-muted hover:border-primary/30"
              }`}
            >
              <RadioGroupItem value={option} id={`opt-${index}`} disabled={showExplanation} />
              <Label
                htmlFor={`opt-${index}`}
                className={`flex-1 cursor-pointer text-base ${
                  showExplanation ? "cursor-not-allowed" : ""
                }`}
              >
                {option}
              </Label>
              {showExplanation && answers[currentQuestion] === option && (
                <Lock className="h-4 w-4 text-primary" />
              )}
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 text-primary mb-3">
              <Lock className="h-4 w-4" />
              <p className="uppercase text-xs tracking-widest font-medium">Explanation</p>
            </div>
            <p className="text-foreground leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between px-8 pb-8">
        {!showExplanation && (
          <Button
            variant="outline"
            onClick={() => setShowExplanation(true)}
            disabled={!answers[currentQuestion]}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            Show Explanation
          </Button>
        )}

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary px-10"
        >
          {currentQuestion < quizData.length - 1 ? "Next Question →" : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}
