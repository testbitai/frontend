import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Filter,
  Eye,
  BarChart3,
  Award,
} from "lucide-react";
import { useTestHistory } from "@/hooks/useTestAttempts";
import { useAuthStore } from "@/stores/authStore";
import { formatDistanceToNow } from "date-fns";

const TestHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: history, isLoading, error } = useTestHistory(user?._id);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleViewResults = (testId: string, attemptId: string) => {
    navigate(`/tests/${testId}/results?attemptId=${attemptId}`);
  };

  const handleViewTestHistory = (testId: string) => {
    navigate(`/exam-history/${testId}`);
  };

  // Filter and sort history
  const filteredHistory = React.useMemo(() => {
    if (!history) return [];

    let filtered = history.filter((attempt) => {
      const matchesSearch = attempt.test.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || attempt.test.type === filterType;
      return matchesSearch && matchesType;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime();
        case "oldest":
          return new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime();
        case "score-high":
          return b.scorePercent - a.scorePercent;
        case "score-low":
          return a.scorePercent - b.scorePercent;
        default:
          return 0;
      }
    });

    return filtered;
  }, [history, searchTerm, filterType, sortBy]);

  // Group attempts by test
  const groupedHistory = React.useMemo(() => {
    const groups: { [testId: string]: typeof filteredHistory } = {};
    filteredHistory.forEach((attempt) => {
      const testId = attempt.test._id;
      if (!groups[testId]) {
        groups[testId] = [];
      }
      groups[testId].push(attempt);
    });
    return groups;
  }, [filteredHistory]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!history) return { totalTests: 0, totalAttempts: 0, averageScore: 0, bestScore: 0 };
    
    const uniqueTests = new Set(history.map(h => h.test._id)).size;
    const totalAttempts = history.length;
    const averageScore = history.reduce((sum, h) => sum + h.scorePercent, 0) / totalAttempts;
    const bestScore = Math.max(...history.map(h => h.scorePercent));
    
    return {
      totalTests: uniqueTests,
      totalAttempts,
      averageScore: averageScore || 0,
      bestScore: bestScore || 0,
    };
  }, [history]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !history) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Error Loading History</h2>
              <p className="text-muted-foreground mb-4">
                Unable to load test history. Please try again.
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

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <Card className="p-8 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-4">No Test History</h2>
              <p className="text-muted-foreground mb-4">
                You haven't attempted any tests yet. Start your learning journey!
              </p>
              <Link to="/tests">
                <Button>Browse Tests</Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Test History</h1>
            <p className="text-muted-foreground">
              Track your progress and review your performance across all tests
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tests Taken</p>
                    <p className="text-2xl font-bold">{stats.totalTests}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Attempts</p>
                    <p className="text-2xl font-bold">{stats.totalAttempts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                      {stats.averageScore.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Best Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(stats.bestScore)}`}>
                      {stats.bestScore.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="fullMock">Full Mock</SelectItem>
                    <SelectItem value="chapterWise">Chapter Wise</SelectItem>
                    <SelectItem value="dailyQuiz">Daily Quiz</SelectItem>
                    <SelectItem value="themedEvent">Themed Event</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="score-high">Highest Score</SelectItem>
                    <SelectItem value="score-low">Lowest Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* History List */}
          <div className="space-y-6">
            {Object.entries(groupedHistory).map(([testId, attempts]) => {
              const testInfo = attempts[0].test;
              const bestAttempt = attempts.reduce((best, current) => 
                current.scorePercent > best.scorePercent ? current : best
              );
              
              return (
                <Card key={testId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{testInfo.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">{testInfo.type}</Badge>
                          <Badge variant="outline">{testInfo.examType}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                          <p className="text-sm text-muted-foreground">Best Score</p>
                          <p className={`text-lg font-semibold ${getScoreColor(bestAttempt.scorePercent)}`}>
                            {bestAttempt.scorePercent.toFixed(1)}%
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTestHistory(testId)}
                        >
                          View All Attempts
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {attempts.slice(0, 3).map((attempt, index) => (
                        <div key={attempt._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <Badge variant={getScoreBadgeVariant(attempt.scorePercent)}>
                              {attempt.scorePercent.toFixed(1)}%
                            </Badge>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDistanceToNow(new Date(attempt.attemptedAt), { addSuffix: true })}
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatTime(attempt.totalTimeTaken)}
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                {attempt.correctCount}/{attempt.totalQuestions}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewResults(testId, attempt._id)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </div>
                      ))}
                      
                      {attempts.length > 3 && (
                        <div className="text-center pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTestHistory(testId)}
                          >
                            View {attempts.length - 3} more attempt{attempts.length - 3 !== 1 ? 's' : ''}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredHistory.length === 0 && (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestHistory;
