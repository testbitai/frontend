import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Save,
  ArrowLeft,
  Trash2,
  Edit,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { useTest } from "@/hooks/useTests";
import apiClient from "@/lib/apiClient";

// Types and Enums
export enum TestType {
  FULL_MOCK = "fullMock",
  CHAPTER_WISE = "chapterWise",
  DAILY_QUIZ = "dailyQuiz",
  THEMED_EVENT = "themedEvent",
}

export enum ExamType {
  JEE = "JEE",
  BITSAT = "BITSAT",
  NEET = "NEET",
}

export enum Subject {
  PHYSICS = "Physics",
  CHEMISTRY = "Chemistry",
  MATHEMATICS = "Mathematics",
  BIOLOGY = "Biology",
}

export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: Difficulty;
}

export interface Section {
  subject: Subject;
  questions: Question[];
}

export interface TestFormData {
  title: string;
  description: string;
  type: TestType;
  examType: ExamType;
  duration: number;
  sections: Section[];
}
const EditTest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch existing test data
  const { data: existingTest, isLoading, error } = useTest(id || "");
  
  // Form state
  const [formData, setFormData] = useState<TestFormData>({
    title: "",
    description: "",
    type: TestType.FULL_MOCK,
    examType: ExamType.JEE,
    duration: 180,
    sections: [],
  });
  
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Helper function to safely transform question data
  const transformQuestion = (q: any): Question => {
    return {
      questionText: q.questionText || q.question || "",
      options: Array.isArray(q.options) && q.options.length >= 4 
        ? q.options.slice(0, 4)
        : Array.isArray(q.options) 
          ? [...q.options, ...Array(4 - q.options.length).fill("")]
          : ["", "", "", ""],
      correctAnswer: q.correctAnswer || q.answer || "A",
      explanation: q.explanation || q.solution || "",
      difficulty: q.difficulty || Difficulty.MEDIUM,
    };
  };

  // Helper function to safely transform section data
  const transformSection = (section: any): Section => {
    return {
      subject: section.subject || section.name || Subject.PHYSICS,
      questions: Array.isArray(section.questions) 
        ? section.questions.map(transformQuestion)
        : [],
    };
  };

  // Load existing test data when available
  useEffect(() => {
    if (existingTest) {
      console.log('Loading existing test data:', existingTest);
      
      // Transform and pre-fill all data with better error handling
      const loadedData: TestFormData = {
        title: existingTest.title || "",
        description: existingTest.description || "",
        type: existingTest.type || TestType.FULL_MOCK,
        examType: existingTest.examType || ExamType.JEE,
        duration: typeof existingTest.duration === 'number' ? existingTest.duration : 180,
        sections: Array.isArray(existingTest.sections) 
          ? existingTest.sections.map(transformSection)
          : [],
      };
      
      console.log('Transformed data for form:', loadedData);
      setFormData(loadedData);
      setHasUnsavedChanges(false); // Reset unsaved changes flag after loading
    }
  }, [existingTest]);

  // Track unsaved changes (but not on initial load)
  useEffect(() => {
    // Only mark as unsaved if we have loaded data and this isn't the initial load
    if (existingTest && formData.title) {
      setHasUnsavedChanges(true);
    }
  }, [formData, existingTest]);

  // Prevent navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Helper functions
  const updateFormData = (updates: Partial<TestFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addSection = () => {
    const newSection: Section = {
      subject: Subject.PHYSICS,
      questions: [],
    };
    updateFormData({
      sections: [...formData.sections, newSection],
    });
    setSelectedSection(formData.sections.length);
  };

  const updateSection = (index: number, updates: Partial<Section>) => {
    const updatedSections = formData.sections.map((section, i) =>
      i === index ? { ...section, ...updates } : section
    );
    updateFormData({ sections: updatedSections });
  };

  const deleteSection = (index: number) => {
    const updatedSections = formData.sections.filter((_, i) => i !== index);
    updateFormData({ sections: updatedSections });
    if (selectedSection >= updatedSections.length) {
      setSelectedSection(Math.max(0, updatedSections.length - 1));
    }
  };

  const addQuestion = (sectionIndex: number) => {
    const newQuestion: Question = {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "A",
      explanation: "",
      difficulty: Difficulty.MEDIUM,
    };
    
    const updatedSections = formData.sections.map((section, i) =>
      i === sectionIndex
        ? { ...section, questions: [...section.questions, newQuestion] }
        : section
    );
    updateFormData({ sections: updatedSections });
    setSelectedQuestion(formData.sections[sectionIndex].questions.length);
  };

  const updateQuestion = (sectionIndex: number, questionIndex: number, updates: Partial<Question>) => {
    const updatedSections = formData.sections.map((section, i) =>
      i === sectionIndex
        ? {
            ...section,
            questions: section.questions.map((question, j) =>
              j === questionIndex ? { ...question, ...updates } : question
            ),
          }
        : section
    );
    updateFormData({ sections: updatedSections });
  };

  const deleteQuestion = (sectionIndex: number, questionIndex: number) => {
    const updatedSections = formData.sections.map((section, i) =>
      i === sectionIndex
        ? {
            ...section,
            questions: section.questions.filter((_, j) => j !== questionIndex),
          }
        : section
    );
    updateFormData({ sections: updatedSections });
    
    const remainingQuestions = updatedSections[sectionIndex].questions.length;
    if (selectedQuestion >= remainingQuestions) {
      setSelectedQuestion(Math.max(0, remainingQuestions - 1));
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await apiClient.put(`/test/${id}`, formData);
      setHasUnsavedChanges(false);
      toast({
        title: "Test Updated",
        description: "Test has been updated successfully.",
      });
      navigate("/admin/tests");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update test.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Test title is required";
    if (!formData.description.trim()) return "Test description is required";
    if (formData.sections.length === 0) return "At least one section is required";
    
    for (let i = 0; i < formData.sections.length; i++) {
      const section = formData.sections[i];
      if (section.questions.length === 0) {
        return `Section ${i + 1} must have at least one question`;
      }
      
      for (let j = 0; j < section.questions.length; j++) {
        const question = section.questions[j];
        if (!question.questionText.trim()) {
          return `Question ${j + 1} in section ${i + 1} is missing question text`;
        }
        if (question.options.some(opt => !opt.trim())) {
          return `Question ${j + 1} in section ${i + 1} has empty options`;
        }
      }
    }
    
    return null;
  };

  const validationError = validateForm();
  const totalQuestions = formData.sections.reduce((sum, section) => sum + section.questions.length, 0);
  // Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium">Loading Test Data</h3>
            <p className="text-muted-foreground">Please wait while we load the test details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
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

  // Not found state
  if (!isLoading && !existingTest) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-orange-600">Test Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The test you're trying to edit could not be found or you don't have permission to edit it.
            </p>
            <Link to="/admin/tests">
              <Button variant="default">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tests
              </Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin/tests">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tests
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Test</h1>
              <p className="text-gray-600">
                Modify test details and questions
                {hasUnsavedChanges && (
                  <Badge variant="secondary" className="ml-2">
                    Unsaved Changes
                  </Badge>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link to={`/admin/tests/preview/${id}`}>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </Link>
            {hasUnsavedChanges && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Discard Changes
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Discard Changes</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have unsaved changes. Are you sure you want to discard them and return to the test list?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Editing</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setHasUnsavedChanges(false);
                        navigate("/admin/tests");
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Discard Changes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={!!validationError || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Save Test Changes</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to save these changes? This will update the test for all users.
                    {totalQuestions > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <p className="text-sm text-blue-800">
                          Test Summary: {totalQuestions} questions across {formData.sections.length} sections
                        </p>
                      </div>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>
                    Save Changes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Debug Panel - Remove in production */}
        {process.env.NODE_ENV === 'development' && existingTest && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-sm text-blue-800">Debug: Loaded Test Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-blue-700 space-y-2">
                <p><strong>Title:</strong> {existingTest.title}</p>
                <p><strong>Description:</strong> {existingTest.description}</p>
                <p><strong>Type:</strong> {existingTest.type}</p>
                <p><strong>Exam Type:</strong> {existingTest.examType}</p>
                <p><strong>Duration:</strong> {existingTest.duration} minutes</p>
                <p><strong>Sections:</strong> {existingTest.sections?.length || 0}</p>
                <p><strong>Total Questions:</strong> {existingTest.numberOfQuestions}</p>
                {existingTest.sections?.map((section: any, index: number) => (
                  <div key={index} className="ml-4">
                    <p><strong>Section {index + 1}:</strong> {section.subject} ({section.questions?.length || 0} questions)</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Data Debug - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-sm text-green-800">Debug: Form Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-green-700 space-y-2">
                <p><strong>Form Title:</strong> "{formData.title}"</p>
                <p><strong>Form Description:</strong> "{formData.description}"</p>
                <p><strong>Form Type:</strong> {formData.type}</p>
                <p><strong>Form Exam Type:</strong> {formData.examType}</p>
                <p><strong>Form Duration:</strong> {formData.duration}</p>
                <p><strong>Form Sections:</strong> {formData.sections.length}</p>
                <p><strong>Has Unsaved Changes:</strong> {hasUnsavedChanges ? 'Yes' : 'No'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validation Error */}
        {validationError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{validationError}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="sections">
              Sections & Questions ({totalQuestions})
            </TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading test data...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Test Details</CardTitle>
                  <CardDescription>
                    Configure the basic information for your test
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Test Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateFormData({ title: e.target.value })}
                      placeholder="Enter test title"
                      className={!formData.title.trim() ? "border-red-300" : ""}
                    />
                    {!formData.title.trim() && (
                      <p className="text-xs text-red-600">Title is required</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration.toString()}
                      onChange={(e) => updateFormData({ duration: parseInt(e.target.value) || 0 })}
                      placeholder="180"
                      min="1"
                      max="600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Enter test description"
                    rows={3}
                    className={!formData.description.trim() ? "border-red-300" : ""}
                  />
                  {!formData.description.trim() && (
                    <p className="text-xs text-red-600">Description is required</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Test Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => updateFormData({ type: value as TestType })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TestType.FULL_MOCK}>Full Mock Test</SelectItem>
                        <SelectItem value={TestType.CHAPTER_WISE}>Chapter-wise Test</SelectItem>
                        <SelectItem value={TestType.DAILY_QUIZ}>Daily Quiz</SelectItem>
                        <SelectItem value={TestType.THEMED_EVENT}>Themed Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examType">Exam Type *</Label>
                    <Select
                      value={formData.examType}
                      onValueChange={(value) => updateFormData({ examType: value as ExamType })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ExamType.JEE}>JEE</SelectItem>
                        <SelectItem value={ExamType.BITSAT}>BITSAT</SelectItem>
                        <SelectItem value={ExamType.NEET}>NEET</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}
          </TabsContent>

          {/* Sections & Questions Tab */}
          <TabsContent value="sections" className="space-y-6">
            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading sections and questions...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sections List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Sections</CardTitle>
                      <Button size="sm" onClick={addSection}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {formData.sections.map((section, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedSection === index
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedSection(index)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{section.subject}</p>
                                <p className="text-xs text-gray-500">
                                  {section.questions.length} questions
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSection(index);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Section Editor */}
              <div className="lg:col-span-3">
                {formData.sections.length > 0 && selectedSection < formData.sections.length ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>
                          Section {selectedSection + 1}: {formData.sections[selectedSection].subject}
                        </CardTitle>
                        <Button
                          size="sm"
                          onClick={() => addQuestion(selectedSection)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Question
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Section Subject */}
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select
                          value={formData.sections[selectedSection].subject}
                          onValueChange={(value) =>
                            updateSection(selectedSection, { subject: value as Subject })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Subject.PHYSICS}>Physics</SelectItem>
                            <SelectItem value={Subject.CHEMISTRY}>Chemistry</SelectItem>
                            <SelectItem value={Subject.MATHEMATICS}>Mathematics</SelectItem>
                            <SelectItem value={Subject.BIOLOGY}>Biology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      {/* Questions */}
                      {formData.sections[selectedSection].questions.length > 0 ? (
                        <div className="space-y-4">
                          <h4 className="font-medium">Questions</h4>
                          {formData.sections[selectedSection].questions.map((question, qIndex) => (
                            <Card key={qIndex} className="border-l-4 border-l-blue-500">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">
                                    Question {qIndex + 1}
                                  </CardTitle>
                                  <div className="flex items-center space-x-2">
                                    <Select
                                      value={question.difficulty}
                                      onValueChange={(value) =>
                                        updateQuestion(selectedSection, qIndex, {
                                          difficulty: value as Difficulty,
                                        })
                                      }
                                    >
                                      <SelectTrigger className="w-24">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value={Difficulty.EASY}>Easy</SelectItem>
                                        <SelectItem value={Difficulty.MEDIUM}>Medium</SelectItem>
                                        <SelectItem value={Difficulty.HARD}>Hard</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteQuestion(selectedSection, qIndex)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Question Text */}
                                <div className="space-y-2">
                                  <Label>Question Text *</Label>
                                  <Textarea
                                    value={question.questionText}
                                    onChange={(e) =>
                                      updateQuestion(selectedSection, qIndex, {
                                        questionText: e.target.value,
                                      })
                                    }
                                    placeholder="Enter question text"
                                    rows={3}
                                  />
                                </div>

                                {/* Options */}
                                <div className="space-y-2">
                                  <Label>Options *</Label>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {question.options.map((option, optIndex) => (
                                      <div key={optIndex} className="flex items-center space-x-2">
                                        <Label className="w-6 text-center">
                                          {String.fromCharCode(65 + optIndex)}
                                        </Label>
                                        <Input
                                          value={option}
                                          onChange={(e) => {
                                            const newOptions = [...question.options];
                                            newOptions[optIndex] = e.target.value;
                                            updateQuestion(selectedSection, qIndex, {
                                              options: newOptions,
                                            });
                                          }}
                                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Correct Answer */}
                                <div className="space-y-2">
                                  <Label>Correct Answer *</Label>
                                  <Select
                                    value={question.correctAnswer}
                                    onValueChange={(value) =>
                                      updateQuestion(selectedSection, qIndex, {
                                        correctAnswer: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="A">A</SelectItem>
                                      <SelectItem value="B">B</SelectItem>
                                      <SelectItem value="C">C</SelectItem>
                                      <SelectItem value="D">D</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Explanation */}
                                <div className="space-y-2">
                                  <Label>Explanation (Optional)</Label>
                                  <Textarea
                                    value={question.explanation}
                                    onChange={(e) =>
                                      updateQuestion(selectedSection, qIndex, {
                                        explanation: e.target.value,
                                      })
                                    }
                                    placeholder="Enter explanation for the correct answer"
                                    rows={2}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No questions in this section yet.</p>
                          <Button
                            className="mt-2"
                            onClick={() => addQuestion(selectedSection)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Question
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-gray-500 mb-4">No sections created yet.</p>
                      <Button onClick={addSection}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Section
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              </div>
            )}
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Preview</CardTitle>
                <CardDescription>
                  Preview how your test will appear to students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
                      <p className="text-sm text-gray-600">Questions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{formData.sections.length}</p>
                      <p className="text-sm text-gray-600">Sections</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{formData.duration}</p>
                      <p className="text-sm text-gray-600">Minutes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {totalQuestions > 0 ? Math.round(formData.duration / totalQuestions * 10) / 10 : 0}
                      </p>
                      <p className="text-sm text-gray-600">Min/Question</p>
                    </div>
                  </div>

                  {formData.sections.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        Section {index + 1}: {section.subject} ({section.questions.length} questions)
                      </h4>
                      {section.questions.length > 0 ? (
                        <div className="space-y-2">
                          {section.questions.slice(0, 3).map((question, qIndex) => (
                            <div key={qIndex} className="text-sm text-gray-600 pl-4">
                              <p>
                                Q{qIndex + 1}: {question.questionText.substring(0, 100)}
                                {question.questionText.length > 100 ? "..." : ""}
                              </p>
                            </div>
                          ))}
                          {section.questions.length > 3 && (
                            <p className="text-sm text-gray-500 pl-4">
                              ... and {section.questions.length - 3} more questions
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 pl-4">No questions added yet</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default EditTest;
