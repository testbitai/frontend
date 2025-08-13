import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  BarChart3,
  PieChart,
} from "lucide-react";
import TutorLayout from "@/components/layouts/TutorLayout";
import { useTutorTest } from "@/hooks/useTutorTests";

const TutorTestAnalytics = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  
  const { data: test, isLoading, error } = useTutorTest(testId!);

  // Mock analytics data - in real implementation, this would come from an API
  const analyticsData = {
    totalAttempts: 45,
    completedAttempts: 42,
    averageScore: 78,
    averageTime: 85, // minutes
    passRate: 85, // percentage
    subjectPerformance: [
      { subject: "Physics", averageScore: 82, attempts: 42 },
      { subject: "Chemistry", averageScore: 75, attempts: 42 },
      { subject: "Mathematics", averageScore: 77, attempts: 42 },
    ],
    difficultyPerformance: [
      { difficulty: "Easy", averageScore: 88, totalQuestions: 15 },
      { difficulty: "Medium", averageScore: 75, totalQuestions: 20 },
      { difficulty: "Hard", averageScore: 65, totalQuestions: 10 },
    ],
    recentAttempts: [
      { studentName: "John Doe", score: 85, completedAt: "2024-01-15", timeSpent: 90 },
      { studentName: "Jane Smith", score: 92, completedAt: "2024-01-14", timeSpent: 78 },
      { studentName: "Mike Johnson", score: 73, completedAt: "2024-01-14", timeSpent: 95 },
      { studentName: "Sarah Wilson", score: 88, completedAt: "2024-01-13", timeSpent: 82 },
      { studentName: "David Brown", score: 79, completedAt: "2024-01-13", timeSpent: 88 },
    ],
  };

  if (isLoading) {
    return (
      <TutorLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </TutorLayout>
    );
  }

  if (error || !test) {
    return (
      <TutorLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-red-500 mb-4">
                <BarChart3 className="mx-auto h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium mb-2">Analytics Not Available</h3>
                <p className="text-sm">
                  Unable to load analytics for this test. Please try again later.
                </p>
              </div>
              <Button onClick={() => navigate("/tutor/tests")} variant="outline">
                Back to Tests
              </Button>
            </CardContent>
          </Card>
        </div>
      </TutorLayout>
    );
  }

  return (
    <TutorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Test Analytics</h1>
              <p className="text-muted-foreground">{test.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to={`/tutor/tests/preview/${test._id}`}>
                <BookOpen className="mr-2 h-4 w-4" />
                View Test
              </Link>
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Total Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalAttempts}</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.completedAttempts} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Target className="mr-2 h-4 w-4" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.passRate}% pass rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Average Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.averageTime}m</div>
              <p className="text-xs text-muted-foreground">
                of {test.duration}m allocated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((analyticsData.completedAttempts / analyticsData.totalAttempts) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.completedAttempts} of {analyticsData.totalAttempts}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Subject-wise Performance
            </CardTitle>
            <CardDescription>
              Average scores by subject area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.subjectPerformance.map((subject) => (
                <div key={subject.subject} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{subject.subject}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {subject.attempts} attempts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${subject.averageScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {subject.averageScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Difficulty-wise Performance
            </CardTitle>
            <CardDescription>
              Performance breakdown by question difficulty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.difficultyPerformance.map((difficulty) => (
                <div key={difficulty.difficulty} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={
                        difficulty.difficulty === "Easy" 
                          ? "bg-green-100 text-green-800"
                          : difficulty.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {difficulty.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {difficulty.totalQuestions} questions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          difficulty.difficulty === "Easy" 
                            ? "bg-green-600"
                            : difficulty.difficulty === "Medium"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${difficulty.averageScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {difficulty.averageScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attempts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Attempts
            </CardTitle>
            <CardDescription>
              Latest student submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.recentAttempts.map((attempt, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {attempt.studentName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{attempt.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(attempt.completedAt).toLocaleDateString()} • {attempt.timeSpent}m
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className={
                      attempt.score >= 80 
                        ? "bg-green-100 text-green-800"
                        : attempt.score >= 60
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {attempt.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TutorLayout>
  );
};

export default TutorTestAnalytics;
