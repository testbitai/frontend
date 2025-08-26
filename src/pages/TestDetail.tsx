import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  FileText,
  Star,
  ArrowLeft,
  ArrowRight,
  History,
  RotateCcw,
} from "lucide-react";
import { formatEquation, cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import { useTestAttemptCount } from "@/hooks/useTestAttempts";
import { toast } from "sonner";

const TestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<"details" | "test">("details");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{
    [key: string]: {
      selectedAnswer: number;
      answerHistory: number[];
    };
  }>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<string>("");

  const currentQuestionId = currentQuestionIndex.toString();

  const [questionTimers, setQuestionTimers] = useState<{
    [key: string]: number;
  }>({});
  const [lastQuestionTimestamp, setLastQuestionTimestamp] = useState<number>(
    Date.now()
  );

  const [test, setTest] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get attempt count for this test
  const { data: attemptData, isLoading: attemptLoading } = useTestAttemptCount(id || "");

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await apiClient.get(`/test/${id}`);

        setTest(data.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id]);

  // console.log(answers)
  const handleSubmitTest = async () => {
    finalizeTimers();
    try {
      // const attemptedQuestions = Object.keys(answers).map(
      //   (questionIndexStr) => {
      //     const questionIndex = parseInt(questionIndexStr);
      //     return {
      //       questionId: questionIndex,
      //       selectedAnswer: ["A", "B", "C", "D"][answers[questionIndexStr]], // index 0-3 to A-D
      //       timeTaken: 60,
      //     };
      //   }
      // );
      const attemptedQuestions = Object.keys(answers).map(
        (questionIndexStr) => {
          const questionIndex = parseInt(questionIndexStr);
          const question = test.questions[questionIndex];

          return {
            sectionIndex: question.sectionIndex,
            questionIndex: question.questionIndex,
            selectedAnswer: ["A", "B", "C", "D"][
              answers[questionIndexStr].selectedAnswer
            ],
            answerHistory: answers[questionIndexStr].answerHistory.map(
              (optIndex) => ["A", "B", "C", "D"][optIndex]
            ),
            timeTaken: questionTimers[questionIndexStr] || 0,
          };
        }
      );
      const payload = {
        attemptedQuestions,
      };

      const { data } = await apiClient.post(
        `/test/${id}/submit`,

        payload
      );

      // You can navigate to results page and pass the result data:
      // e.g. navigate(`/tests/${id}/results`, { state: { result: data.data } });
      console.log("Test submitted successfully!", data);

      // For now → just navigate to results page:
      window.location.href = `/tests/${id}/results`;
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to submit test.");
    }
  };

  // Set up timer when test starts
  useEffect(() => {
    let timer: number | undefined;

    if (currentView === "test" && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentView, timeRemaining]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading test details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card className="p-8 max-w-md mx-auto text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Test Not Found</h2>
            <p className="text-muted-forgroud mb-6">
              The test you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/tests">
              <Button>Back to Test Series</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // const startTest = () => {
  //   setTimeRemaining(test.duration * 60); // Convert minutes to seconds
  //   setCurrentView("test");
  //   setCurrentSection(test.sections[0].id);
  // };

  const startTest = () => {
    // Check if user has reached attempt limit
    if (attemptData && attemptData.remainingAttempts <= 0) {
      toast.error("You have reached the maximum attempt limit (3 attempts) for this test.");
      return;
    }

    setTimeRemaining(test.duration * 60);
    setCurrentView("test");
    setCurrentSection(test.sections[0]?.id);
    setLastQuestionTimestamp(Date.now());
  };

  const handleViewHistory = () => {
    navigate(`/exam-history/${id}`);
  };

  const finalizeTimers = () => {
    const now = Date.now();
    const timeSpent = Math.floor((now - lastQuestionTimestamp) / 1000);
    const lastQid = currentQuestionIndex.toString();

    setQuestionTimers((prev) => ({
      ...prev,
      [lastQid]: (prev[lastQid] || 0) + timeSpent,
    }));
  };

  const handleAnswerSelect = (
    currentQuestionId: string,
    optionIndex: number
  ) => {
    setAnswers((prev) => {
      const existing = prev[currentQuestionId];

      let newHistory;
      if (existing) {
        const prevHistory = existing.answerHistory;
        // only add if changed
        if (prevHistory[prevHistory.length - 1] !== optionIndex) {
          newHistory = [...prevHistory, optionIndex];
        } else {
          newHistory = prevHistory;
        }
      } else {
        newHistory = [optionIndex];
      }

      return {
        ...prev,
        [currentQuestionId]: {
          selectedAnswer: optionIndex,
          answerHistory: newHistory,
        },
      };
    });
  };

  const handleMarkForReview = (index: number) => {
    if (markedForReview.includes(index)) {
      setMarkedForReview((prev) => prev.filter((id) => id !== index));
    } else {
      setMarkedForReview((prev) => [...prev, index]);
    }
  };

  // const navigateQuestion = (index: number) => {
  //   if (index >= 0 && index < test.questions.length) {
  //     setCurrentQuestionIndex(index);
  //   }
  // };

  const navigateQuestion = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= test.questions.length) return;

    const now = Date.now();
    const timeSpent = Math.floor((now - lastQuestionTimestamp) / 1000);

    const prevQuestionId = currentQuestionIndex.toString();

    setQuestionTimers((prev) => ({
      ...prev,
      [prevQuestionId]: (prev[prevQuestionId] || 0) + timeSpent,
    }));

    setLastQuestionTimestamp(now);
    setCurrentQuestionIndex(newIndex);
  };

  const currentQuestion = test.questions[currentQuestionIndex];

  const progress = (Object.keys(answers).length / test.questions.length) * 100;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getQuestionStatus = (index: number) => {
    if (answers[index] !== undefined && markedForReview.includes(index)) {
      return "answered-marked";
    } else if (answers[index] !== undefined) {
      return "answered";
    } else if (markedForReview.includes(index)) {
      return "marked";
    } else {
      return "not-visited";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-green-500 text-white";
      case "marked":
        return "bg-purple-500 text-white";
      case "answered-marked":
        return "bg-gradient-to-r from-green-500 to-purple-500 text-white";
      case "current":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        focusMode ? "bg-background" : "bg-muted"
      }`}
    >
      {/* {!focusMode && <Header />} */}

      <main className="flex-grow py-4">
        <div className="container mx-auto px-4">
          {currentView === "details" ? (
            <Card className="p-6 md:p-8 max-w-4xl mx-auto">
              <Link
                to="/tests"
                className="text-gray-500 hover:text-brandPurple mb-6 inline-flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Tests
              </Link>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{test.title}</h1>
                  <p className="text-muted-forgroud mb-4">{test.description}</p>
                  
                  {/* Attempt Information */}
                  {attemptData && !attemptLoading && (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">
                          Attempts: {attemptData.count}/{attemptData.maxAttempts}
                        </span>
                      </div>
                      {attemptData.count > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleViewHistory}
                          className="flex items-center gap-2"
                        >
                          <History className="h-4 w-4" />
                          View Exam History
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 md:mt-0 flex flex-col gap-2">
                  {!test.isPurchased ? (
                    <>
                      <Button
                        className="bg-gradient-to-r from-brandIndigo to-brandPurple"
                        onClick={startTest}
                        disabled={attemptData?.remainingAttempts === 0}
                      >
                        {attemptData?.remainingAttempts === 0 ? "Max Attempts Reached" : "Start Test"}
                      </Button>
                      {attemptData && attemptData.remainingAttempts > 0 && (
                        <p className="text-xs text-center text-muted-foreground">
                          {attemptData.remainingAttempts} attempt{attemptData.remainingAttempts !== 1 ? 's' : ''} remaining
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="flex items-center justify-center text-lg font-semibold text-brandPurple mb-2">
                        <Star
                          className="h-5 w-5 mr-2 text-yellow-500"
                          fill="currentColor"
                        />
                        <span>{test.price} coins</span>
                      </div>
                      <Link to="/rewards">
                        <Button>Purchase Test</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-brandPurple mr-2" />
                    <h3 className="font-medium">Duration</h3>
                  </div>
                  <p>{test.duration} minutes</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-brandPurple mr-2" />
                    <h3 className="font-medium">Questions</h3>
                  </div>
                  <p>{test.questions?.length} questions</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-brandPurple mr-2" />
                    <h3 className="font-medium">Difficulty</h3>
                  </div>
                  <p className="capitalize">{test.overallDifficulty}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {[
                    `You have ${test.duration} minutes to complete the test.`,
                    "Each question carries 4 marks.",
                    "There is negative marking of 1 mark for each wrong answer.",
                    "You can navigate between questions freely.",
                    "You can mark questions for review and come back to them later.",
                  ].map((instruction, i) => (
                    <li key={i} className="text-muted-foreground">
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              {!test.isPurchased && (
                <div className="flex justify-center">
                  <Button
                    className="bg-gradient-to-r from-brandIndigo to-brandPurple px-8"
                    onClick={startTest}
                  >
                    Start Test Now
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <div className="flex flex-col lg:flex-row">
              {/* Left side: Question display */}
              <div className="lg:w-8/12 pr-0 lg:pr-4 mb-4 lg:mb-0">
                <div
                  className={`sticky top-0 z-10 bg-background shadow-sm rounded-lg mb-2 py-2 px-4 transition-all ${
                    focusMode ? "bg-opacity-95" : ""
                  }`}
                >
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="font-semibold flex items-center">
                      <Badge variant="outline" className="mr-3 bg-muted">
                        {currentQuestion.section === "s1"
                          ? "PHYSICS"
                          : currentQuestion.section === "s2"
                          ? "CHEMISTRY"
                          : "MATHEMATICS"}
                      </Badge>
                      <div className="flex items-center bg-muted px-3 py-1 rounded-full">
                        <Clock className="h-4 w-4 text-muted-forgroud mr-2" />
                        <span className="font-mono">
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                    </div>
                    {/* <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFocusMode(!focusMode)}
                        className={
                          focusMode
                            ? "bg-brandPurple text-white border-brandPurple"
                            : ""
                        }
                      >
                        {focusMode ? "Exit Focus Mode" : "Focus Mode"}
                      </Button>
                    </div> */}
                  </div>
                </div>

                <Card className="mb-4">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium">
                        Q. {currentQuestionIndex + 1} of {test.questions.length}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleMarkForReview(currentQuestionIndex)
                          }
                          className={`flex items-center gap-1 ${
                            markedForReview.includes(currentQuestionIndex)
                              ? "bg-purple-50 text-purple-700 border-purple-300"
                              : ""
                          }`}
                        >
                          <Flag className="h-4 w-4" />
                          {markedForReview.includes(currentQuestionIndex)
                            ? "Marked"
                            : "Mark for Review"}
                        </Button>
                      </div>
                    </div>

                    <div className="mb-8">
                      <p
                        className="text-foreground text-lg mb-4"
                        dangerouslySetInnerHTML={{
                          __html: currentQuestion.questionText,
                        }}
                      ></p>

                      {currentQuestion.image && (
                        <div className="mb-6 flex justify-center">
                          <img
                            src={currentQuestion.image}
                            alt="Question diagram"
                            className="max-w-full max-h-64"
                          />
                        </div>
                      )}

                      <RadioGroup
                        value={answers[
                          currentQuestionId
                        ]?.selectedAnswer?.toString()}
                        onValueChange={(value) =>
                          handleAnswerSelect(currentQuestionId, parseInt(value))
                        }
                        className="space-y-3 mt-6"
                      >
                        {currentQuestion.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              answers[currentQuestionId]?.selectedAnswer ===
                              index
                                ? "bg-muted border-brandPurple"
                                : "hover:bg-muted"
                            } cursor-pointer transition-all`}
                            onClick={() =>
                              handleAnswerSelect(currentQuestionId, index)
                            }
                          >
                            <div className="flex items-start">
                              <div
                                className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                                  answers[currentQuestionId]?.selectedAnswer ===
                                  index
                                    ? "bg-brandPurple text-white"
                                    : "border border-gray-300 text-gray-500"
                                }`}
                              >
                                {String.fromCharCode(97 + index)}
                              </div>
                              <div
                                dangerouslySetInnerHTML={{ __html: option }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="flex justify-between border-t pt-4">
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigateQuestion(currentQuestionIndex - 1)
                        }
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>

                      {currentQuestionIndex === test.questions.length - 1 ? (
                        // <Link to={`/tests/${id}/results`}>
                        <Button
                          onClick={handleSubmitTest}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Submit Test
                        </Button>
                      ) : (
                        // </Link>
                        <Button
                          onClick={() =>
                            navigateQuestion(currentQuestionIndex + 1)
                          }
                          className="flex items-center"
                        >
                          Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-background rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Overall Progress</h4>
                    <span className="text-sm text-gray-500">
                      {Object.keys(answers).length} of {test.questions.length}{" "}
                      answered
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 mb-2" />
                </div>
              </div>

              {/* Right side: Question navigator */}
              <div className="lg:w-4/12">
                <div className="sticky top-0 bg-background rounded-lg shadow-sm p-4">
                  <div className="mb-4 flex justify-between items-center">
                    <h4 className="font-semibold">Question Navigator</h4>
                    {/* <Link to={`/tests/${id}/results`}> */}
                    <Button
                      size="sm"
                      onClick={handleSubmitTest}
                      className="text-sm py-1 px-3 h-8 bg-green-600 hover:bg-green-700"
                    >
                      Submit
                    </Button>
                    {/* </Link> */}
                  </div>

                  <div className="mb-4">
                    <div className="flex gap-2 flex-wrap mb-2">
                      {test.sections?.map((section) => (
                        <Button
                          key={section.id}
                          size="sm"
                          variant={
                            currentSection === section.id
                              ? "default"
                              : "outline"
                          }
                          className={`py-1 px-3 text-xs ${
                            currentSection === section.id
                              ? "bg-brandPurple"
                              : ""
                          }`}
                          onClick={() => setCurrentSection(section.id)}
                        >
                          {section.name}{" "}
                          <span className="ml-1 opacity-70">
                            ({section.questions})
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {Array.from({ length: test.questions.length }, (_, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className={`h-10 w-10 p-0 font-medium ${
                          currentQuestionIndex === i
                            ? "ring-2 ring-offset-1 ring-brandPurple " +
                              getStatusClass("current")
                            : getStatusClass(getQuestionStatus(i))
                        }`}
                        onClick={() => navigateQuestion(i)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <div className="flex items-center text-sm">
                      <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="h-4 w-4 rounded-full bg-purple-500 mr-2"></div>
                      <span>Marked for review</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="h-4 w-4 rounded-full bg-gradient-to-r from-green-500 to-purple-500 mr-2"></div>
                      <span>Answered & marked for review</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="h-4 w-4 rounded-full bg-gray-200 mr-2"></div>
                      <span>Not visited</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* {!focusMode && <Footer />} */}
    </div>
  );
};

export default TestDetail;
