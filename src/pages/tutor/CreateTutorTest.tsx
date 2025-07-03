
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TutorLayout from "@/components/layouts/TutorLayout";
import { useToast } from "@/hooks/use-toast";

const CreateTutorTest = () => {
  const [testDetails, setTestDetails] = useState({
    title: "",
    description: "",
    subject: "",
    difficulty: "",
    timeLimit: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveTest = () => {
    if (!testDetails.title || !testDetails.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in the test title and subject.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Test Created Successfully",
      description: `"${testDetails.title}" has been created and is ready for your students.`,
    });
    navigate("/tutor/tests");
  };

  return (
    <TutorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/tutor/tests">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tests
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create New Test</h1>
              <p className="text-muted-foreground">Design a test for your students</p>
            </div>
          </div>
          <Button onClick={handleSaveTest} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" />
            Save Test
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test Details */}
          <div className="lg:col-span-2">
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
                      onChange={(e) => setTestDetails({...testDetails, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={testDetails.subject} onValueChange={(value) => setTestDetails({...testDetails, subject: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={testDetails.difficulty} onValueChange={(value) => setTestDetails({...testDetails, difficulty: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      placeholder="e.g., 60"
                      value={testDetails.timeLimit}
                      onChange={(e) => setTestDetails({...testDetails, timeLimit: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the test content and objectives..."
                    value={testDetails.description}
                    onChange={(e) => setTestDetails({...testDetails, description: e.target.value})}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Options */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Options</CardTitle>
                <CardDescription>Fast ways to create your test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Questions Manually
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  Upload PDF Questions
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  WhatsApp Submission
                </Button>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Template Options</h4>
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      JEE Main Pattern (30Q)
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      BITSAT Pattern (40Q)
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      Chapter Test (15Q)
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      Daily Quiz (10Q)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">WhatsApp Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Send your questions via WhatsApp and we'll format them for you.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Get WhatsApp Number
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TutorLayout>
  );
};

export default CreateTutorTest;
