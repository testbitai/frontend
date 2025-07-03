import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  const [activeTab, setActiveTab] = useState("overview");
  const [testResult, setTestResult] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  // Calculate percentages for pie chart

  useEffect(() => {
    const fetchTestHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await apiClient.get(`/test/test-history/${id}`);

        const apiData = data.data;

        console.log(data);

        const transformedResult = {
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

    if (id) {
      fetchTestHistory();
    }
  }, [id]);

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
                <Badge
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>
                    {/* Attempt {result.attempt} of {result.maxAttempts} */}
                  </span>
                </Badge>

                {/* {result.previousAttempts.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Previous:{" "}
                    {
                      result.previousAttempts[
                        result.previousAttempts.length - 1
                      ].score
                    }
                    %
                  </Badge>
                )} */}
              </div>
            </div>
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

                  <div className="w-full md:w-[240px] h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
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
            <TabsList className="mb-6 p-1 bg-gray-100 rounded-lg w-full md:w-auto">
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
