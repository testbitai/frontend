
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MoreHorizontal, UserCheck, UserX, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";

const TutorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const mockUsers = [
    {
      id: 1,
      name: "Arjun Sharma",
      email: "arjun@example.com",
      examGoal: "JEE Main",
      status: "Active",
      testsCompleted: 15,
      avgScore: 78,
      streak: 5,
      joinDate: "2024-01-10",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Priya Mehta",
      email: "priya@example.com",
      examGoal: "BITSAT",
      status: "Active",
      testsCompleted: 23,
      avgScore: 85,
      streak: 12,
      joinDate: "2023-12-15",
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "Rahul Kumar",
      email: "rahul@example.com",
      examGoal: "JEE Advanced",
      status: "Inactive",
      testsCompleted: 8,
      avgScore: 65,
      streak: 0,
      joinDate: "2024-01-05",
      lastActive: "1 week ago",
    },
  ];

  const handleUserAction = (action: string, userName: string) => {
    let message = "";
    switch (action) {
      case "activate":
        message = `${userName} has been activated successfully.`;
        break;
      case "deactivate":
        message = `${userName} has been deactivated.`;
        break;
      case "reset":
        message = `Password reset email sent to ${userName}.`;
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
      case "Inactive": return "bg-red-100 text-red-800";
      case "Suspended": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || user.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tutor Management</h1>
            <p className="text-muted-foreground">Manage tutor accounts and monitor activity</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Export Data</Button>
            <Button>Send Notification</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-green-600">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,156</div>
              <p className="text-xs text-green-600">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Tests/User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.5</div>
              <p className="text-xs text-blue-600">+2.3 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">74%</div>
              <p className="text-xs text-green-600">+3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tutor List</CardTitle>
            <CardDescription>
              Showing {filteredUsers.length} of {mockUsers.length} users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Exam Goal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Streak</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.examGoal}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.testsCompleted}</TableCell>
                    <TableCell>{user.avgScore}%</TableCell>
                    <TableCell>{user.streak} days</TableCell>
                    <TableCell className="text-sm text-gray-500">{user.lastActive}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>User Actions - {user.name}</DialogTitle>
                            <DialogDescription>
                              Choose an action to perform on this user account.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handleUserAction("activate", user.name)}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate Account
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handleUserAction("deactivate", user.name)}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate Account
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handleUserAction("reset", user.name)}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Reset Password
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TutorManagement;
