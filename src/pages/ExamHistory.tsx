import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  BarChart3,
} from "lucide-react";
import { useAllTestAttempts } from "@/hooks/useTestAttempts";
import { formatDistanceToNow } from "date-fns";

const ExamHistory = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { data: attempts, isLoading, error } = useAllTestAttempts(testId || "");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getTrendIcon = (currentScore: number, previousScore?: number) => {
    if (!previousScore) return <Minus className="h-4 w-4 text-gray-400" />;
    if (currentScore > previousScore) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (currentScore < previousScore) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleViewResults = (attemptId: string) => {
    navigate(`/tests/${testId}/results?attemptId=${attemptId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !attempts) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Error Loading History</h2>
              <p className="text-muted-foreground mb-4">
                Unable to load exam history. Please try again.
              </p>
              <Link to="/tests">
                <Button>Back to Tests</Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">No Attempts Yet</h2>
              <p className="text-muted-foreground mb-4">
                You haven't attempted this test yet.
              </p>
              <Link to={`/tests/${testId}`}>
                <Button>Take Test Now</Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const testInfo = attempts[0]?.test;
  const bestScore = Math.max(...attempts.map(a => a.scorePercent));
  const averageScore = attempts.reduce((sum, a) => sum + a.scorePercent, 0) / attempts.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Link
              to={`/tests/${testId}`}
              className="text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Test Details
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Exam History</h1>
                <p className="text-muted-foreground">{testInfo?.title}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Best Score</p>
                  <p className={`text-lg font-semibold ${getScoreColor(bestScore)}`}>
                    {bestScore.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Average</p>
                  <p className={`text-lg font-semibold ${getScoreColor(averageScore)}`}>
                    {averageScore.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Attempts</p>
                  <p className="text-lg font-semibold">{attempts.length}/3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attempts List */}
          <div className="space-y-4">
            {attempts.map((attempt, index) => {
              const previousAttempt = index > 0 ? attempts[index - 1] : undefined;
              const isLatest = index === attempts.length - 1;
              
              return (
                <Card key={attempt._id} className={`${isLatest ? 'ring-2 ring-primary/20' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">
                          Attempt #{index + 1}
                          {isLatest && (
                            <Badge variant="secondary" className="ml-2">Latest</Badge>
                          )}
                        </CardTitle>
                        {getTrendIcon(attempt.scorePercent, previousAttempt?.scorePercent)}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={getScoreBadgeVariant(attempt.scorePercent)}>
                          {attempt.scorePercent.toFixed(1)}%
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResults(attempt._id)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Results
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Date</p>
                          <p className="text-muted-foreground">
                            {formatDistanceToNow(new Date(attempt.attemptedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Time Taken</p>
                          <p className="text-muted-foreground">
                            {formatTime(attempt.totalTimeTaken)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Accuracy</p>
                          <p className="text-muted-foreground">
                            {attempt.correctCount}/{attempt.totalQuestions}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Score</p>
                          <p className={`font-semibold ${getScoreColor(attempt.scorePercent)}`}>
                            {attempt.score} points
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Performance comparison */}
                    {previousAttempt && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">vs Previous:</span>
                          {attempt.scorePercent > previousAttempt.scorePercent ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              +{(attempt.scorePercent - previousAttempt.scorePercent).toFixed(1)}%
                            </span>
                          ) : attempt.scorePercent < previousAttempt.scorePercent ? (
                            <span className="text-red-600 flex items-center gap-1">
                              <TrendingDown className="h-3 w-3" />
                              {(attempt.scorePercent - previousAttempt.scorePercent).toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-gray-500 flex items-center gap-1">
                              <Minus className="h-3 w-3" />
                              No change
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Link to={`/tests/${testId}`}>
              <Button variant="outline">Back to Test</Button>
            </Link>
            {attempts.length < 3 && (
              <Link to={`/tests/${testId}`}>
                <Button>Take Another Attempt</Button>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamHistory;
