import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  Clock,
  BookOpen,
  Users,
  Calendar,
  User,
  FileText,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useTest } from "@/hooks/useTests";
import type { Test } from "@/hooks/useTests";

interface TestViewDialogProps {
  test: Test;
  trigger?: React.ReactNode;
}

export const TestViewDialog = ({ test, trigger }: TestViewDialogProps) => {
  const [open, setOpen] = useState(false);
  const { data: fullTestData, isLoading, error } = useTest(test._id);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="mr-1 h-3 w-3" />
            View
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test Details
          </DialogTitle>
          <DialogDescription>
            View comprehensive details about this test
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading test details...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <FileText className="mx-auto h-12 w-12 mb-2" />
              <h3 className="text-lg font-medium mb-2">Error Loading Test</h3>
              <p className="text-sm">
                {error instanceof Error ? error.message : "Failed to load test details."}
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{test.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">{test.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline">{getType(test.type)}</Badge>
                        <Badge variant="outline">{test.examType}</Badge>
                        <Badge className={getStatusColor(test.overallDifficulty)}>
                          {test.overallDifficulty}
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
                        <p className="text-sm font-medium">{test.numberOfQuestions}</p>
                        <p className="text-xs text-muted-foreground">Questions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{formatDuration(test.duration)}</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{test.createdBy?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">Created by ({test.createdByRole})</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{formatDate(test.createdAt)}</p>
                        <p className="text-xs text-muted-foreground">Created</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Information Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  {/* Subject Distribution */}
                  {test.subjectCount && Object.keys(test.subjectCount).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Subject Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(test.subjectCount).map(([subject, count]) => (
                            <div key={subject} className="text-center">
                              <div className="text-2xl font-bold text-primary">{count}</div>
                              <div className="text-sm text-muted-foreground">{subject}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Difficulty Distribution */}
                  {test.difficultyCount && Object.keys(test.difficultyCount).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Difficulty Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          {Object.entries(test.difficultyCount).map(([difficulty, count]) => (
                            <div key={difficulty} className="text-center">
                              <div className="text-2xl font-bold text-primary">{count}</div>
                              <Badge className={`text-xs ${getStatusColor(difficulty)}`}>
                                {difficulty}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="questions" className="space-y-4">
                  {fullTestData?.questions ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Questions Preview</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Showing first 5 questions from this test
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {fullTestData.questions.slice(0, 5).map((question: any, index: number) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium">Question {index + 1}</h4>
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {question.section}
                                  </Badge>
                                  <Badge className={`text-xs ${getStatusColor(question.difficulty)}`}>
                                    {question.difficulty}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm mb-3">{question.questionText}</p>
                              <div className="grid grid-cols-2 gap-2">
                                {question.options?.map((option: string, optIndex: number) => (
                                  <div key={optIndex} className="text-xs p-2 bg-gray-50 rounded">
                                    {String.fromCharCode(65 + optIndex)}) {option}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          {fullTestData.questions.length > 5 && (
                            <div className="text-center text-sm text-muted-foreground">
                              ... and {fullTestData.questions.length - 5} more questions
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Question details are not available in preview mode.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Test Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{test.numberOfQuestions}</div>
                          <div className="text-sm text-muted-foreground">Total Questions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{formatDuration(test.duration)}</div>
                          <div className="text-sm text-muted-foreground">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {Math.round(test.duration / test.numberOfQuestions * 10) / 10}m
                          </div>
                          <div className="text-sm text-muted-foreground">Avg per Question</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {Object.keys(test.subjectCount || {}).length}
                          </div>
                          <div className="text-sm text-muted-foreground">Subjects</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center text-muted-foreground">
                          <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                          <p>Detailed analytics will be available after students take this test.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
