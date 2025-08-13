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
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Users,
  Edit,
  Share,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
} from "lucide-react";
import TutorLayout from "@/components/layouts/TutorLayout";
import { useTutorTest, useToggleTestPublication } from "@/hooks/useTutorTests";
import { useToast } from "@/hooks/use-toast";

const TutorTestPreview = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: test, isLoading, error } = useTutorTest(testId!);
  const togglePublicationMutation = useToggleTestPublication();

  const handleTogglePublication = () => {
    if (test) {
      togglePublicationMutation.mutate({ 
        testId: test._id, 
        isPublished: !test.isPublished 
      });
    }
  };

  const handleShareTest = () => {
    const shareUrl = `${window.location.origin}/test/${testId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Test Link Copied",
      description: "Test link has been copied to clipboard.",
    });
  };

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case "fullMock":
        return "Full Mock Test";
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  if (isLoading) {
    return (
      <TutorLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
                <BookOpen className="mx-auto h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium mb-2">Test Not Found</h3>
                <p className="text-sm">
                  The test you're looking for doesn't exist or you don't have permission to view it.
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
              <h1 className="text-2xl font-bold text-foreground">Test Preview</h1>
              <p className="text-muted-foreground">Review your test before sharing with students</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleTogglePublication}
              disabled={togglePublicationMutation.isPending}
              className={test.isPublished ? "text-orange-600" : "text-green-600"}
            >
              {test.isPublished ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleShareTest}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button asChild>
              <Link to={`/tutor/tests/edit/${test._id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Test
              </Link>
            </Button>
          </div>
        </div>

        {/* Test Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">{test.title}</CardTitle>
                {test.description && (
                  <CardDescription className="mt-2 text-base">
                    {test.description}
                  </CardDescription>
                )}
              </div>
              <Badge
                variant={test.isPublished ? "default" : "secondary"}
                className={`ml-4 ${
                  test.isPublished
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {test.isPublished ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Published
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Draft
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Test Type</p>
                  <p className="font-medium">{getTypeDisplay(test.type)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{test.duration} minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-medium">{test.numberOfQuestions}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-medium">{test.allowedStudents?.length || 0}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{test.examType}</Badge>
              <Badge className={getDifficultyColor(test.overallDifficulty)}>
                {test.overallDifficulty}
              </Badge>
              {test.subjectCount && Object.entries(test.subjectCount).map(([subject, count]) => (
                <Badge key={subject} variant="secondary">
                  {subject}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Sections */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Sections</h2>
          {test.sections?.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {section.subject}
                  <Badge variant="outline" className="ml-auto">
                    {section.questions.length} questions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-sm text-muted-foreground">
                          Question {questionIndex + 1}
                        </h4>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="mb-4 text-foreground">{question.questionText}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              option === question.correctAnswer
                                ? "bg-green-50 border-green-200 text-green-800"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            {option}
                            {option === question.correctAnswer && (
                              <CheckCircle className="inline ml-2 h-4 w-4" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {question.explanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                          <p className="text-sm text-blue-700">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to={`/tutor/tests/analytics/${test._id}`}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={`/tutor/tests/edit/${test._id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Test
                </Link>
              </Button>
              <Button onClick={handleShareTest} variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share with Students
              </Button>
              <Button
                onClick={handleTogglePublication}
                disabled={togglePublicationMutation.isPending}
                className={test.isPublished ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
              >
                {test.isPublished ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Unpublish Test
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Publish Test
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TutorLayout>
  );
};

export default TutorTestPreview;
