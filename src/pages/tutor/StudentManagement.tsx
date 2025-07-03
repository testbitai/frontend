
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import TutorLayout from "@/components/layouts/TutorLayout";
import { useToast } from "@/hooks/use-toast";

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const students = [
    {
      id: 1,
      name: "Rahul Kumar",
      email: "rahul@example.com",
      status: "Active",
      testsCompleted: 12,
      avgScore: 78,
      streak: 5,
      joinDate: "2024-01-10",
      progess: '10%',
      lastTest: "Physics Mock 2",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@example.com",
      status: "Active",
      testsCompleted: 18,
      avgScore: 85,
      streak: 8,
      joinDate: "2024-01-05",
      progess: '25%',
      lastTest: "Chemistry Quiz 3",
    },
    {
      id: 3,
      name: "Arjun Mehta",
      email: "arjun@example.com",
      status: "Pending",
      testsCompleted: 0,
      avgScore: 0,
      streak: 0,
      progess: '77%',
      joinDate: "2024-01-18",
      lastTest: "None",
    },
  ];

  const pendingRequests = [
    { id: 1, name: "Sneha Patel", email: "sneha@example.com", requestDate: "2024-01-20" },
    { id: 2, name: "Vikash Singh", email: "vikash@example.com", requestDate: "2024-01-19" },
  ];

  const handleStudentAction = (action: string, studentName: string) => {
    let message = "";
    switch (action) {
      case "approve":
        message = `${studentName} has been approved and added to your class.`;
        break;
      case "reject":
        message = `${studentName}'s request has been rejected.`;
        break;
      case "remove":
        message = `${studentName} has been removed from your class.`;
        break;
    }
    
    toast({
      title: "Action Completed",
      description: message,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TutorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
            <p className="text-muted-foreground">Manage your students and approve join requests</p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Generate Invite Code
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Class Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Join Requests</CardTitle>
              <CardDescription>Students waiting for approval to join your class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex flex-col md:flex-row gap-3 md:gap-0 md:items-center justify-between p-4 bg-muted rounded-lg border border-yellow-200">
                    <div>
                      <div className="font-medium">{request.name}</div>
                      <div className="text-sm text-muted-foreground">{request.email}</div>
                      <div className="text-xs text-gray-500">Requested on {request.requestDate}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStudentAction("approve", request.name)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStudentAction("reject", request.name)}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>
              Showing {filteredStudents.length} of {students.length} students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tests Completed</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Streak</TableHead>
                  <TableHead>Last Test</TableHead>
                  <TableHead>Progess</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.testsCompleted}</TableCell>
                    <TableCell>{student.avgScore}%</TableCell>
                    <TableCell>{student.streak} days</TableCell>
                    <TableCell className="text-sm">{student.lastTest}</TableCell>
                    <TableCell>{student.progess}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TutorLayout>
  );
};

export default StudentManagement;
