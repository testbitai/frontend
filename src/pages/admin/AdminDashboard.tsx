
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BarChart3, Trophy, Calendar, MessageSquare, Settings, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Users", value: "2,847", icon: Users, color: "text-blue-600" },
    { title: "Tests Created", value: "156", icon: BookOpen, color: "text-green-600" },
    { title: "Active Events", value: "3", icon: Calendar, color: "text-purple-600" },
    { title: "Pending Reviews", value: "12", icon: Bell, color: "text-orange-600" },
  ];

  const quickActions = [
    { title: "Create New Test", description: "Add a new mock test or quiz", link: "/admin/tests/create", icon: BookOpen },
    { title: "Manage Users", description: "View and manage user accounts", link: "/admin/users", icon: Users },
    { title: "View Analytics", description: "Check platform performance", link: "/admin/analytics", icon: BarChart3 },
    { title: "Manage Rewards", description: "Update coins and badges", link: "/admin/rewards", icon: Trophy },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-0 md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome, Admin!</h1>
            <p className="text-muted-foreground">Here's what's happening with your platform today.</p>
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-700 dark:to-purple-700 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">12 pending test uploads to review</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <action.icon className="h-8 w-8 text-blue-500" />
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">New user registered: Arjun Sharma</span>
                <span className="text-xs text-gray-500 ml-auto">2 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Test completed: JEE Mock Test 5</span>
                <span className="text-xs text-gray-500 ml-auto">15 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Physics Fiesta event started</span>
                <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
