import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, BarChart3, Plus, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import TutorLayout from "@/components/layouts/TutorLayout";
import { useAuthStore } from "@/stores/authStore";

const TutorDashboard = () => {
  const { user } = useAuthStore((state) => state);
  const stats = [
    {
      title: "Total Students",
      value: "50",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Tests Created",
      value: "12",
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      title: "Avg Class Score",
      value: "76%",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      title: "Active Students",
      value: "47",
      icon: GraduationCap,
      color: "text-orange-600",
    },
  ];

  const recentActivity = [
    {
      type: "test",
      message: "Rahul completed JEE Math Mock Test",
      time: "5 minutes ago",
      score: "85%",
    },
    {
      type: "join",
      message: "New student Priya joined your class",
      time: "1 hour ago",
      score: null,
    },
    {
      type: "test",
      message: "Class average for Physics Quiz: 72%",
      time: "2 hours ago",
      score: "72%",
    },
  ];

  return (
    <TutorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome, {user.name}!
            </h1>
            <p className="text-muted-foreground">
              You have 50 students and 5 tests created.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link to="/tutor/tests/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Test
              </Button>
            </Link>
            <Link to="/tutor/students">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Students
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/tutor/tests">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-8 w-8 text-blue-500" />
                    <CardTitle className="text-lg">Test Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Create and manage your test library
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link to="/tutor/students">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-green-500" />
                    <CardTitle className="text-lg">
                      Student Management
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Invite and monitor your students
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link to="/tutor/analytics">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                    <CardTitle className="text-lg">Analytics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    View detailed performance analytics
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Student Invite Code */}
        <Card className="bg-muted border-green-200 dark:border-green-600">
          <CardHeader>
            <CardTitle className="text-lg">Student Invite Code</CardTitle>
            <CardDescription>
              Share this code with new students to join your class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:items-center justify-between bg-background p-4 rounded-lg border-2 border-dashed border-green-300">
              <div>
                <div className="text-sm text-muted-foreground">Class ID:</div>
                <div className="text-2xl font-bold text-green-600">
                  MATH2025
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Password:</div>
                <div className="text-2xl font-bold text-blue-600">JEE123</div>
              </div>
              <Button variant="outline">Generate New Code</Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "test"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-sm">{activity.message}</span>
                  </div>
                  <div className="text-right">
                    {activity.score && (
                      <div className="text-sm font-medium text-green-600">
                        {activity.score}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TutorLayout>
  );
};

export default TutorDashboard;
