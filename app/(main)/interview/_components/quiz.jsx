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
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

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
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
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
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  // Retake same topic
  const retakeSameTopic = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    setResultData(null);
    generateQuizFn(topic);
  };

  const handleStartQuiz = () => {
    generateQuizFn(topic); 
  };

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  // ================= RESULTS SCREEN =================
  if (resultData) {
    return (
      <div className="mx-2 space-y-4">
        <QuizResult result={resultData} hideStartNew={true} />
        
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Ready for another round?
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            
            {/* Only Retake Same Topic */}
            <Button 
              size="lg"
              className="w-full sm:w-auto font-semibold" 
              onClick={retakeSameTopic}
            >
              Retake {topic ? `Same Topic (${topic})` : "General Quiz"}
            </Button>

          </CardContent>
          
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-primary" 
              onClick={() => router.push("/interview")}
            >
              Return to Interview Insights
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ================= START SCREEN =================
  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            This quiz contains 10 technical questions. You can generate a general quiz based on your profile, or type a specific topic below to focus your practice.
          </p>

          <div className="space-y-2">
            <Label htmlFor="topic">Specific Topic (Optional)</Label>
            <Input
              id="topic"
              placeholder="e.g., React hooks, System Design, Python loops..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to get general questions about your industry.
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={handleStartQuiz} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  // ================= LIVE QUIZ SCREEN =================
  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>

        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            Show Explanation
          </Button>
        )}

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto"
        >
          {savingResult && (
            <BarLoader className="mt-4" width={"100%"} color="gray" />
          )}
          {currentQuestion < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}