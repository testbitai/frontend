
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Quote, MessageSquare, Save } from "lucide-react";

const ContentManagement = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground">Manage about page, quotes, and study materials</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>About Page</span>
              </CardTitle>
              <CardDescription>Update platform mission and team information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mission Statement</Label>
                <Textarea 
                  placeholder="Our mission is to..." 
                  rows={4}
                  defaultValue="Empowering students to achieve their JEE and BITSAT dreams through innovative learning solutions."
                />
              </div>
              <div className="space-y-2">
                <Label>Team Description</Label>
                <Textarea 
                  placeholder="Our team consists of..." 
                  rows={3}
                  defaultValue="Our team consists of experienced educators and technology experts dedicated to student success."
                />
              </div>
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Update About Page
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Quote className="h-5 w-5" />
                <span>Motivational Quotes</span>
              </CardTitle>
              <CardDescription>Add inspiring quotes for students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>New Quote</Label>
                <Textarea 
                  placeholder="Enter an inspiring quote..." 
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input placeholder="Quote author" />
              </div>
              <Button className="w-full">Add Quote</Button>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Existing Quotes</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <div className="p-3 bg-muted rounded text-sm">
                    "Success is the sum of small efforts repeated day in day out." - Robert Collier
                  </div>
                  <div className="p-3 bg-muted rounded text-sm">
                    "The future belongs to those who prepare for it today." - Malcolm X
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Study Buddy Tips</span>
              </CardTitle>
              <CardDescription>Manage chatbot responses and tips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>FAQ Question</Label>
                <Input placeholder="e.g., How do I redeem coins?" />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea 
                  placeholder="Enter the answer..." 
                  rows={3}
                />
              </div>
              <Button className="w-full">Add FAQ</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentManagement;
