import React, { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Check,
  X,
  Award,
  ChevronLeft,
  Star,
  Clock,
  BarChart,
  AlertCircle,
  Share,
  RotateCcw,
  Calendar,
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";
import { useAllTestAttempts } from "@/hooks/useTestAttempts";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReviewAnswers from "@/components/ReviewAnswersPage";
import DetailedAnalysis from "@/components/DetailedAnalysis";
import AIDetailedAnalysis from "@/components/AIDetailedAnalysis";

// Mock results data for the test

const COLORS = ["#10B981", "#F97316", "#6366F1", "#9b87f5"];

// Motivational quotes for different score ranges
const getMotivationalMessage = (score: number) => {
  if (score >= 80) {
    return "Outstanding achievement! You're on your way to success!";
  } else if (score >= 60) {
    return "Great work! Keep building on this solid foundation.";
  } else if (score >= 40) {
    return "Good effort! With consistent practice, you'll see improvement.";
  } else {
    return "Every challenge is an opportunity to learn. Keep going!";
  }
};

const TestResults = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [testResult, setTestResult] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttemptId, setSelectedAttemptId] = useState<string>("");
  const { user } = useAuthStore();

  // Get all attempts for this test
  const { data: allAttempts, isLoading: attemptsLoading } = useAllTestAttempts(id || "");

  // Get specific attempt ID from URL params
  const attemptIdFromUrl = searchParams.get("attemptId");

  useEffect(() => {
    if (allAttempts && allAttempts.length > 0) {
      // Use attempt ID from URL if provided, otherwise use the latest attempt
      const targetAttemptId = attemptIdFromUrl || allAttempts[allAttempts.length - 1]._id;
      setSelectedAttemptId(targetAttemptId);
    }
  }, [allAttempts, attemptIdFromUrl]);

  const getTrendIcon = (currentScore: number, previousScore?: number) => {
    if (!previousScore) return <Minus className="h-4 w-4 text-gray-400" />;
    if (currentScore > previousScore) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (currentScore < previousScore) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const handleAttemptChange = (attemptId: string) => {
    setSelectedAttemptId(attemptId);
    setSearchParams({ attemptId });
  };

  // Calculate percentages for pie chart

  useEffect(() => {
    const fetchTestHistory = async () => {
      if (!selectedAttemptId) return;
      
      try {
        setLoading(true);
        setError(null);

        // If we have a specific attempt ID, fetch that attempt's results
        // Otherwise, fetch the default test results (latest attempt)
        const endpoint = selectedAttemptId && selectedAttemptId !== allAttempts?.[allAttempts.length - 1]?._id
          ? `/test/test-history/${id}?attemptId=${selectedAttemptId}`
          : `/test/test-history/${id}`;

        const { data } = await apiClient.get(endpoint);

        const apiData = data.data;

        console.log(apiData._id);

        const transformedResult = {
          _id: apiData._id,
          score: apiData.score,
          testName: apiData.test.title || "Test Name",
          totalQuestions: apiData.totalQuestions,
          previousAttempts: apiData.previousAttempts,
          questionsData: apiData.questionsData || [],
          changedAnswers: apiData.changedAnswers,
          scorePercent: apiData.scorePercent,
          correctAnswers: apiData.correctCount,
          wrongAnswers: apiData.incorrectCount,
          skipped: apiData.skippedCount,
          timeTaken: apiData.totalTimeTaken,
          attemptedAt: apiData.attemptedAt,
          percentile: 100 - apiData.scorePercent,
          badge:
            apiData.scorePercent >= 80
              ? "High Achiever"
              : apiData.scorePercent >= 50
              ? "Achiever"
              : "Keep Going!",
          coinsEarned: Math.round(apiData.scorePercent * 2),
          subjectPerformance: apiData.subjectAnalytics?.map((item) => ({
            name: item.subject,
            correct: item.correct,
            wrong: item.total - item.correct,
            unattempted: apiData.totalQuestions - item.total,
            total: item.total,
          })),
          weakAreas:
            apiData.subjectAnalytics
              ?.filter((s) => s.accuracy < 50)
              .map((s) => s.subject) || [],
          strongAreas:
            apiData.subjectAnalytics
              ?.filter((s) => s.accuracy >= 50)
              .map((s) => s.subject) || [],
          questionAnalysis: {
            timeDistribution: apiData.questionAnalysis?.timeDistribution || [],
          },
        };

        setTestResult(transformedResult);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id && selectedAttemptId) {
      fetchTestHistory();
    }
  }, [id, selectedAttemptId, allAttempts]);

  const result = testResult;

  console.log(result);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading test result...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        No result found.
      </div>
    );
  }

  const correctPercentage =
    result.totalQuestions > 0
      ? (result.correctAnswers / result.totalQuestions) * 100
      : 0;

  const wrongPercentage =
    result.totalQuestions > 0
      ? (result.wrongAnswers / result.totalQuestions) * 100
      : 0;

  const skippedPercentage =
    result.totalQuestions > 0
      ? (result.skipped / result.totalQuestions) * 100
      : 0;

  const pieData = [
    { name: "Correct", value: correctPercentage },
    { name: "Wrong", value: wrongPercentage },
    { name: "Skipped", value: skippedPercentage },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Link
            to={`/tests/${id}`}
            className="text-gray-500 hover:text-brandPurple mb-6 inline-flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Test Details
          </Link>
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-brandIndigo to-brandPurple bg-clip-text text-transparent mb-2">
                  Your Test Results
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {result?.testName}
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                {/* Attempt Selector */}
                {allAttempts && allAttempts.length > 1 && (
                  <div className="flex items-center gap-3">
                    <Select value={selectedAttemptId} onValueChange={handleAttemptChange}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select attempt" />
                      </SelectTrigger>
                      <SelectContent>
                        {allAttempts.map((attempt, index) => {
                          const attemptNumber = index + 1;
                          const previousAttempt = index > 0 ? allAttempts[index - 1] : undefined;
                          
                          return (
                            <SelectItem key={attempt._id} value={attempt._id}>
                              <div className="flex items-center justify-between w-full">
                                <span>Attempt #{attemptNumber}</span>
                                <div className="flex items-center gap-2 ml-4">
                                  <span className="text-sm font-medium">
                                    {attempt.scorePercent.toFixed(1)}%
                                  </span>
                                  {getTrendIcon(attempt.scorePercent, previousAttempt?.scorePercent)}
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    
                    {/* Show comparison with previous attempt */}
                    {(() => {
                      const currentIndex = allAttempts.findIndex(a => a._id === selectedAttemptId);
                      const currentAttempt = allAttempts[currentIndex];
                      const previousAttempt = currentIndex > 0 ? allAttempts[currentIndex - 1] : undefined;
                      
                      if (previousAttempt && currentAttempt) {
                        const improvement = currentAttempt.scorePercent - previousAttempt.scorePercent;
                        return (
                          <Badge 
                            variant={improvement > 0 ? "default" : improvement < 0 ? "destructive" : "secondary"}
                            className="flex items-center gap-1"
                          >
                            {improvement > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : improvement < 0 ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : (
                              <Minus className="h-3 w-3" />
                            )}
                            {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                          </Badge>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
                
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {result?.attemptedAt && formatDistanceToNow(new Date(result.attemptedAt), { addSuffix: true })}
                  </span>
                </Badge>
              </div>
            </div>
            
            {/* Attempt Summary for multiple attempts */}
            {allAttempts && allAttempts.length > 1 && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="text-sm font-medium mb-3">All Attempts Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Attempts</p>
                    <p className="font-semibold">{allAttempts.length}/3</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Best Score</p>
                    <p className="font-semibold text-green-600">
                      {Math.max(...allAttempts.map(a => a.scorePercent)).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average Score</p>
                    <p className="font-semibold">
                      {(allAttempts.reduce((sum, a) => sum + a.scorePercent, 0) / allAttempts.length).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Improvement</p>
                    <p className="font-semibold">
                      {allAttempts.length > 1 ? (
                        <>
                          {(allAttempts[allAttempts.length - 1].scorePercent - allAttempts[0].scorePercent).toFixed(1)}%
                        </>
                      ) : (
                        'N/A'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 overflow-hidden">
              <div className="bg-gradient-to-r from-brandIndigo to-brandPurple text-white p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Performance Summary
                    </h2>
                    <p className="opacity-90">Completed on May 14, 2025</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center">
                    <Button
                      variant="outline"
                      className="border-white bg-transparent text-white hover:bg-white/20 mr-3"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button className="bg-white text-brandPurple hover:bg-white/90">
                      Review Answers
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 mb-6 md:mb-0 md:mr-8">
                    <div className="mb-6">
                      <h3 className="text-gray-500 mb-1">Your Score</h3>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold mr-2">
                          {result.score}
                        </span>
                        <span className="text-gray-500">
                          ({result?.correctAnswers}/{result?.totalQuestions})
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-gray-500 mb-1">Time Taken</h3>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="font-semibold">
                          {Math.floor(result.timeTaken / 3600)}h{" "}
                          {Math.floor((result.timeTaken % 3600) / 60)}m{" "}
                          {result.timeTaken % 60}s
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-gray-500 mb-2">Percentile Rank</h3>
                      <div className="flex items-center">
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-sm py-1">
                          Top {100 - result?.scorePercent}%
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-6">
                      <blockquote className="italic text-gray-600 border-l-4 border-brandPurple pl-4 py-1">
                        {getMotivationalMessage(result.score)}
                      </blockquote>
                    </div>
                  </div>

                  <div className="w-full md:max-w-[50%] aspect-square">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={65}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          <Cell key="cell-0" fill="#10B981" />
                          <Cell key="cell-1" fill="#EF4444" />
                          <Cell key="cell-2" fill="#9CA3AF" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between mt-8 pt-6 border-t border-gray-100">
                  <div className="text-center px-4 mb-4 md:mb-0">
                    <div className="text-3xl font-bold text-green-500">
                      {result?.correctAnswers}
                    </div>
                    <div className="text-gray-500 text-sm">Correct</div>
                  </div>
                  <div className="text-center px-4 mb-4 md:mb-0">
                    <div className="text-3xl font-bold text-red-500">
                      {result.wrongAnswers}
                    </div>
                    <div className="text-gray-500 text-sm">Incorrect</div>
                  </div>
                  <div className="text-center px-4 mb-4 md:mb-0">
                    <div className="text-3xl font-bold text-gray-500">
                      {result.skipped}
                    </div>
                    <div className="text-gray-500 text-sm">Skipped</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-brandPurple">
                      {result.coinsEarned}
                    </div>
                    <div className="text-gray-500 text-sm">Coins Earned</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Rewards Earned</CardTitle>
                <CardDescription>
                  For your performance in this test
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-brandPurple to-blue-500 flex items-center justify-center">
                      <Award className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                      <Star
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1 text-brandPurple">
                    {result.badge}
                  </h3>
                  <p className="text-gray-600">Badge Unlocked!</p>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star
                        className="h-5 w-5 mr-2 text-yellow-500"
                        fill="currentColor"
                      />
                      <span className="font-medium">Coins Earned</span>
                    </div>
                    <span className="text-lg font-bold text-brandPurple">
                      +{result.coinsEarned}
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-brandIndigo to-brandPurple hover:opacity-90">
                  View All Rewards
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Previous Attempts History */}
       

          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6 p-1 h-auto bg-gray-100 rounded-lg  flex flex-wrap w-full md:w-auto">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brandPurple"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="subjects"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brandPurple"
              >
                Subject Analysis
              </TabsTrigger>
              <TabsTrigger
                value="questions"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brandPurple"
              >
                Question Analysis
              </TabsTrigger>

              <TabsTrigger
                value="review"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-brandPurple"
              >
                Review Answers
              </TabsTrigger>
              <TabsTrigger
                value="detailed"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-brandPurple"
              >
                Detailed Analysis
              </TabsTrigger>
              <TabsTrigger
                value="ai-analysis"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-brandPurple flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                AI Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                      Areas Needing Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.weakAreas?.map((area, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <X className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <strong className="font-medium">{area}</strong>
                            <p className="text-gray-500 text-sm">
                              Focus on practicing more questions in this area
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <Button variant="outline" className="w-full mt-4">
                      Get Targeted Practice
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      Strong Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.strongAreas?.map((area, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <strong className="font-medium">{area}</strong>
                            <p className="text-gray-500 text-sm">
                              Keep maintaining your excellent performance
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <Button variant="outline" className="w-full mt-4">
                      Advanced Practice
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subjects" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-brandIndigo" />
                    Subject-wise Performance
                  </CardTitle>
                  <CardDescription>
                    Comparison of your performance across different subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={result.subjectPerformance}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          name="Correct"
                          dataKey="correct"
                          stackId="a"
                          fill="#10B981"
                        />
                        <Bar
                          name="Wrong"
                          dataKey="wrong"
                          stackId="a"
                          fill="#EF4444"
                        />
                        <Bar
                          name="Unattempted"
                          dataKey="unattempted"
                          stackId="a"
                          fill="#9CA3AF"
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {result.subjectPerformance?.map((subject, index) => {
                      const percentage = Math.round(
                        (subject.correct / subject.total) * 100
                      );

                      return (
                        <Card
                          key={index}
                          className="p-4 border-t-4"
                          style={{
                            borderTopColor: COLORS[index % COLORS.length],
                          }}
                        >
                          <h4 className="font-medium mb-2">{subject.name}</h4>
                          <div className="text-2xl font-bold mb-1">
                            {percentage}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {subject.correct}/{subject.total} correct
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Time Distribution</CardTitle>
                    <CardDescription>
                      How much time you spent on questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={result.questionAnalysis?.timeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {result.questionAnalysis?.timeDistribution?.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Question Insights</CardTitle>
                    <CardDescription>
                      Analysis of your answer patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between">
                      <div>
                        <div className="text-sm text-gray-500">
                          Fastest Answered
                        </div>
                        <div className="font-medium">Question 17</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Time</div>
                        <div className="font-medium">14 seconds</div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between">
                      <div>
                        <div className="text-sm text-gray-500">
                          Slowest Answered
                        </div>
                        <div className="font-medium">Question 52</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Time</div>
                        <div className="font-medium">3:42 minutes</div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between">
                      <div>
                        <div className="text-sm text-gray-500">
                          Changed Answers
                        </div>
                        <div className="font-medium">
                          {result.changedAnswers.totalChanged} question
                          {result.changedAnswers.totalChanged <= 1 ? "" : "s"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Of which correct
                        </div>
                        <div className="font-medium">
                          {result.changedAnswers.correctAfterChange} (
                          {result.changedAnswers.totalChanged > 0
                            ? Math.round(
                                (result.changedAnswers.correctAfterChange /
                                  result.changedAnswers.totalChanged) *
                                  100
                              )
                            : 0}
                          %)
                        </div>
                      </div>
                    </div>

                    {/* <Button className="w-full">View Detailed Analysis</Button> */}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

              <TabsContent value="review" className="mt-0">
              <ReviewAnswers data={result.questionsData} />
            </TabsContent>
            
            <TabsContent value="detailed" className="mt-0">
              <DetailedAnalysis />
            </TabsContent>
            
            <TabsContent value="ai-analysis" className="mt-0">
              <AIDetailedAnalysis testAttemptId={result._id || ''} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="border-brandPurple text-brandPurple hover:bg-purple-50"
              >
                Take Similar Test
              </Button>
              <Link to="/tests">
                <Button className="bg-gradient-to-r from-brandIndigo to-brandPurple">
                  Back to Test Series
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestResults;
