import { useState } from "react";
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
import { Plus, Upload, Save, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/apiClient";

// Enums matching your backend model
export enum TestType {
  FULL_MOCK = "fullMock",
  CHAPTER_WISE = "chapterWise",
  DAILY_QUIZ = "dailyQuiz",
  THEMED_EVENT = "themedEvent",
}

export enum ExamType {
  JEE = "JEE",
  BITSAT = "BITSAT",
}

export enum Subject {
  PHYSICS = "Physics",
  CHEMISTRY = "Chemistry",
  MATH = "Math",
}

// Question Interface
export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

// Section Interface
export interface Section {
  subject: Subject;
  questions: Question[];
}

const CreateTest = () => {
  const [testDetails, setTestDetails] = useState({
    title: "",
    description: "",
    examType: "",
    type: "",
    duration: "",
  });
  const [sections, setSections] = useState<Section[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveTest = async () => {
    if (!testDetails.title || !testDetails.examType) {
      toast({
        title: "Missing Information",
        description: "Please fill in the test title and exam type.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        ...testDetails,
        duration: Number(testDetails.duration) || 0,
        sections,
      };

      const { data } = await apiClient.post("/test", payload);

      toast({
        title: "Test Created Successfully",
        description: `"${testDetails.title}" has been created and saved.`,
      });
      // navigate("/admin/tests");
    } catch (error) {
      console.error(error);

      toast({
        title: "Error Creating Test",
        description: error?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const addSection = (subject: Subject) => {
    const newSection: Section = {
      subject,
      questions: [],
    };
    setSections([...sections, newSection]);
  };

  const addQuestionToSection = (sectionIndex: number) => {
    const newQuestion: Question = {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      difficulty: "Medium",
      explanation: "",
    };

    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions.push(newQuestion);
    setSections(updatedSections);
  };

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
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Test
              </h1>
              <p className="text-gray-600">
                Add a new test to your question bank
              </p>
            </div>
          </div>
          <Button
            onClick={handleSaveTest}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Test
          </Button>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Test Details</TabsTrigger>
            <TabsTrigger value="sections">Sections & Questions</TabsTrigger>
            <TabsTrigger value="upload">PDF Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Test Information</CardTitle>
                <CardDescription>Basic details about your test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Test Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., JEE Main Physics Mock Test 1"
                      value={testDetails.title}
                      onChange={(e) =>
                        setTestDetails({
                          ...testDetails,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examType">Exam Type *</Label>
                    <Select
                      value={testDetails.examType}
                      onValueChange={(value) =>
                        setTestDetails({ ...testDetails, examType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ExamType.JEE}>JEE</SelectItem>
                        <SelectItem value={ExamType.BITSAT}>BITSAT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Test Type</Label>
                    <Select
                      value={testDetails.type}
                      onValueChange={(value) =>
                        setTestDetails({ ...testDetails, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TestType.FULL_MOCK}>
                          Full Mock
                        </SelectItem>
                        <SelectItem value={TestType.CHAPTER_WISE}>
                          Chapter Wise
                        </SelectItem>
                        <SelectItem value={TestType.DAILY_QUIZ}>
                          Daily Quiz
                        </SelectItem>
                        <SelectItem value={TestType.THEMED_EVENT}>
                          Themed Event
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="e.g., 180"
                      value={testDetails.duration}
                      onChange={(e) =>
                        setTestDetails({
                          ...testDetails,
                          duration: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the test content and objectives..."
                    value={testDetails.description}
                    onChange={(e) =>
                      setTestDetails({
                        ...testDetails,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Test Sections</CardTitle>
                    <CardDescription>
                      Organize questions by subject
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => addSection(Subject.PHYSICS)}
                      variant="outline"
                      size="sm"
                    >
                      Add Physics Section
                    </Button>
                    <Button
                      onClick={() => addSection(Subject.CHEMISTRY)}
                      variant="outline"
                      size="sm"
                    >
                      Add Chemistry Section
                    </Button>
                    <Button
                      onClick={() => addSection(Subject.MATH)}
                      variant="outline"
                      size="sm"
                    >
                      Add Math Section
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {sections.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No sections added yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start building your test by adding subject sections
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sections.map((section, sectionIndex) => (
                      <Card key={sectionIndex} className="border-2">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {section.subject} Section
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {section.questions.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              No questions in this section
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {section.questions.map(
                                (question, questionIndex) => (
                                  <Card key={questionIndex} className="border">
                                    <CardHeader>
                                      <CardTitle className="text-base">
                                        Question {questionIndex + 1}
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="space-y-2">
                                        <Label>Question Text</Label>
                                        <Textarea
                                          placeholder="Enter your question here..."
                                          rows={3}
                                          value={question.questionText}
                                          onChange={e => {
                                            const updatedSections = [...sections];
                                            updatedSections[sectionIndex].questions[questionIndex].questionText = e.target.value;
                                            setSections(updatedSections);
                                          }}
                                        />
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>Option A</Label>
                                          <Input
                                            placeholder="Option A"
                                            value={question.options[0]}
                                            onChange={e => {
                                              const updatedSections = [...sections];
                                              updatedSections[sectionIndex].questions[questionIndex].options[0] = e.target.value;
                                              setSections(updatedSections);
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Option B</Label>
                                          <Input
                                            placeholder="Option B"
                                            value={question.options[1]}
                                            onChange={e => {
                                              const updatedSections = [...sections];
                                              updatedSections[sectionIndex].questions[questionIndex].options[1] = e.target.value;
                                              setSections(updatedSections);
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Option C</Label>
                                          <Input
                                            placeholder="Option C"
                                            value={question.options[2]}
                                            onChange={e => {
                                              const updatedSections = [...sections];
                                              updatedSections[sectionIndex].questions[questionIndex].options[2] = e.target.value;
                                              setSections(updatedSections);
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Option D</Label>
                                          <Input
                                            placeholder="Option D"
                                            value={question.options[3]}
                                            onChange={e => {
                                              const updatedSections = [...sections];
                                              updatedSections[sectionIndex].questions[questionIndex].options[3] = e.target.value;
                                              setSections(updatedSections);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>Correct Answer</Label>
                                          <Select
                                            value={question.correctAnswer}
                                            onValueChange={value => {
                                              const updatedSections = [...sections];
                                              updatedSections[sectionIndex].questions[questionIndex].correctAnswer = value;
                                              setSections(updatedSections);
                                            }}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select correct option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="A">Option A</SelectItem>
                                              <SelectItem value="B">Option B</SelectItem>
                                              <SelectItem value="C">Option C</SelectItem>
                                              <SelectItem value="D">Option D</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="space-y-2">
                                          <Label>Difficulty</Label>
                                          <Select
                                            value={question.difficulty}
                                            onValueChange={value => {
                                              const updatedSections = [...sections];
                                              updatedSections[sectionIndex].questions[questionIndex].difficulty = value as "Easy" | "Medium" | "Hard";
                                              setSections(updatedSections);
                                            }}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select difficulty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Easy">Easy</SelectItem>
                                              <SelectItem value="Medium">Medium</SelectItem>
                                              <SelectItem value="Hard">Hard</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label>Explanation (Optional)</Label>
                                        <Textarea
                                          placeholder="Explain why this is the correct answer..."
                                          rows={2}
                                          value={question.explanation}
                                          onChange={e => {
                                            const updatedSections = [...sections];
                                            updatedSections[sectionIndex].questions[questionIndex].explanation = e.target.value;
                                            setSections(updatedSections);
                                          }}
                                        />
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              )}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button
                            onClick={() => addQuestionToSection(sectionIndex)}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="mr-1 h-4 w-4" />
                            Add Question
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>PDF Upload</CardTitle>
                <CardDescription>
                  Upload a PDF file containing test questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Upload Test PDF
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your PDF file here, or click to browse
                  </p>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Supported formats: PDF (max 10MB)
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Upload Guidelines
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Ensure questions are clearly numbered and formatted
                    </li>
                    <li>• Include multiple choice options (A, B, C, D)</li>
                    <li>• Mark correct answers clearly</li>
                    <li>• PDF will be reviewed before publishing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default CreateTest;
