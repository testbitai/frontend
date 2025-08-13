import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  User,
  Calendar,
  FileText,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Loader2,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useTest } from "@/hooks/useTests";

const TestPreview = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);
  
  const { data: testData, isLoading, error } = useTest(testId || "");

  useEffect(() => {
    if (!testId) {
      navigate("/admin/tests");
    }
  }, [testId, navigate]);

  // Keyboard navigation for questions
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (questions.length === 0) return;
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          setSelectedQuestion(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          setSelectedQuestion(prev => Math.min(questions.length - 1, prev + 1));
          break;
        case 'Home':
          event.preventDefault();
          setSelectedQuestion(0);
          break;
        case 'End':
          event.preventDefault();
          setSelectedQuestion(questions.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [questions.length]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium">Loading Test Preview</h3>
            <p className="text-muted-foreground">Please wait while we load the test details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !testData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-600">Error Loading Test</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "Failed to load test details."}
            </p>
            <div className="space-x-2">
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
              <Link to="/admin/tests">
                <Button variant="default">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tests
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getType = (type: string) => {
    switch (type) {
      case "fullMock":
        return "Full Mock";
      case "chapterWise":
        return "Chapter Test";
      case "dailyQuiz":
        return "Daily Quiz";
      case "themedEvent":
        return "Themed Event";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const questions = testData.questions || [];
  const currentQuestion = questions[selectedQuestion];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/tests">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tests
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{testData.title}</h1>
              <p className="text-muted-foreground">Test Preview & Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/admin/tests/edit/${testId}`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Test
              </Button>
            </Link>
          </div>
        </div>

        {/* Test Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">{testData.title}</CardTitle>
                <CardDescription className="mt-2">{testData.description}</CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline">{getType(testData.type)}</Badge>
                  <Badge variant="outline">{testData.examType}</Badge>
                  <Badge className={getStatusColor(testData.overallDifficulty)}>
                    {testData.overallDifficulty}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{testData.numberOfQuestions}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{formatDuration(testData.duration)}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{testData.createdBy?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">Created by</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{formatDate(testData.createdAt)}</p>
                  <p className="text-xs text-muted-foreground">Created</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="questions">Questions ({questions.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            {questions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Question Navigation */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Questions</CardTitle>
                      <CardDescription>Click to preview each question</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[600px]">
                        <div className="space-y-2">
                          {questions.map((question: any, index: number) => (
                            <Button
                              key={index}
                              variant={selectedQuestion === index ? "default" : "outline"}
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => setSelectedQuestion(index)}
                            >
                              <span className="mr-2">Q{index + 1}</span>
                              <Badge 
                                variant="secondary" 
                                className={`ml-auto text-xs ${getStatusColor(question.difficulty)}`}
                              >
                                {question.difficulty}
                              </Badge>
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Question Display */}
                <div className="lg:col-span-3">
                  {currentQuestion && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            Question {selectedQuestion + 1} of {questions.length}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{currentQuestion.section}</Badge>
                            <Badge className={getStatusColor(currentQuestion.difficulty)}>
                              {currentQuestion.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Question Text */}
                        <div>
                          <h3 className="font-medium mb-3">Question:</h3>
                          <p className="text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                            {currentQuestion.questionText}
                          </p>
                        </div>

                        {/* Options */}
                        <div>
                          <h3 className="font-medium mb-3">Options:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentQuestion.options?.map((option: string, optIndex: number) => {
                              const optionLetter = String.fromCharCode(65 + optIndex);
                              const isCorrect = currentQuestion.correctAnswer === optionLetter;
                              
                              return (
                                <div
                                  key={optIndex}
                                  className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                                    isCorrect 
                                      ? 'border-green-200 bg-green-50' 
                                      : 'border-gray-200 bg-gray-50'
                                  }`}
                                >
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                    isCorrect 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-gray-300 text-gray-700'
                                  }`}>
                                    {optionLetter}
                                  </div>
                                  <span className="text-sm flex-1">{option}</span>
                                  {isCorrect && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Correct Answer */}
                        <div>
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Correct Answer:
                          </h3>
                          <p className="text-sm text-green-700 font-medium">
                            Option {currentQuestion.correctAnswer}
                          </p>
                        </div>

                        {/* Explanation */}
                        {currentQuestion.explanation && (
                          <div>
                            <h3 className="font-medium mb-3 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              Explanation:
                            </h3>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-sm leading-relaxed text-blue-900">
                                {currentQuestion.explanation}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedQuestion(Math.max(0, selectedQuestion - 1))}
                            disabled={selectedQuestion === 0}
                          >
                            Previous Question
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {selectedQuestion + 1} of {questions.length}
                          </span>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedQuestion(Math.min(questions.length - 1, selectedQuestion + 1))}
                            disabled={selectedQuestion === questions.length - 1}
                          >
                            Next Question
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Questions Available
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    This test doesn't have any questions to preview.
                  </p>
                  <Link to={`/admin/tests/edit/${testId}`}>
                    <Button>
                      <Edit className="mr-2 h-4 w-4" />
                      Add Questions
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">{testData.numberOfQuestions}</p>
                      <p className="text-xs text-muted-foreground">Total Questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">{formatDuration(testData.duration)}</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">
                        {Math.round(testData.duration / testData.numberOfQuestions * 10) / 10}m
                      </p>
                      <p className="text-xs text-muted-foreground">Avg per Question</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">
                        {Object.keys(testData.subjectCount || {}).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Subjects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject Distribution */}
            {testData.subjectCount && Object.keys(testData.subjectCount).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Subject Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(testData.subjectCount).map(([subject, count]) => (
                      <div key={subject} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-primary">{count}</div>
                        <div className="text-sm text-muted-foreground mt-1">{subject}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Difficulty Distribution */}
            {testData.difficultyCount && Object.keys(testData.difficultyCount).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Difficulty Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(testData.difficultyCount).map(([difficulty, count]) => (
                      <div key={difficulty} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-primary">{count}</div>
                        <Badge className={`mt-2 ${getStatusColor(difficulty)}`}>
                          {difficulty}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{testData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{getType(testData.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exam:</span>
                    <span className="font-medium">{testData.examType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <Badge className={getStatusColor(testData.overallDifficulty)}>
                      {testData.overallDifficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{formatDuration(testData.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions:</span>
                    <span className="font-medium">{testData.numberOfQuestions}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Creation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created by:</span>
                    <span className="font-medium">{testData.createdBy?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-medium capitalize">{testData.createdByRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{formatDate(testData.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Published
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {testData.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {testData.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TestPreview;
