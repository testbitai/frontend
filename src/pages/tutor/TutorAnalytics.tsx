
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Target } from "lucide-react";
import TutorLayout from "@/components/layouts/TutorLayout";

const TutorAnalytics = () => {
  const classMetrics = [
    { title: "Class Average", value: "76%", change: "+4%", icon: Target },
    { title: "Active Students", value: "47/50", change: "+2", icon: Users },
    { title: "Tests This Week", value: "8", change: "+3", icon: BarChart3 },
    { title: "Improvement Rate", value: "12%", change: "+2%", icon: TrendingUp },
  ];

  const topPerformers = [
    { name: "Priya Sharma", score: 94, improvement: "+8%" },
    { name: "Rahul Kumar", score: 89, improvement: "+12%" },
    { name: "Arjun Mehta", score: 87, improvement: "+6%" },
  ];

  const weakAreas = [
    { topic: "Organic Chemistry", avgScore: 58, studentsStruggling: 12 },
    { topic: "Calculus", avgScore: 62, studentsStruggling: 8 },
    { topic: "Mechanics", avgScore: 68, studentsStruggling: 6 },
  ];

  return (
    <TutorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Class Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your students' performance</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                <metric.icon className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-green-600">{metric.change} from last week</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Mathematics</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '82%'}}></div>
                    </div>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Physics</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chemistry</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '68%'}}></div>
                    </div>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers This Week</CardTitle>
              <CardDescription>Students showing excellent progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((student, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{student.score}%</div>
                      <div className="text-xs text-green-600">{student.improvement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weak Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Areas Needing Attention</CardTitle>
              <CardDescription>Topics where students are struggling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weakAreas.map((area, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{area.topic}</span>
                      <span className="text-sm text-red-600">{area.avgScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{area.studentsStruggling} students need help</span>
                      <span>Class avg: {area.avgScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-red-400 h-1 rounded-full" 
                        style={{width: `${area.avgScore}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress Trend</CardTitle>
              <CardDescription>Class performance over the last 4 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Weekly progress chart would be implemented here
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Individual Student Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Student Insights</CardTitle>
            <CardDescription>Quick overview of individual student performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-muted rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-300">Priya Sharma</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">Strong in Math & Physics</p>
                <p className="text-sm text-blue-600 dark:text-blue-500">Needs help with Organic Chemistry</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-muted rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-300">Rahul Kumar</h4>
                <p className="text-sm text-green-700 dark:text-green-400">Consistent improvement</p>
                <p className="text-sm text-green-600 dark:text-green-500" >Focus on advanced problems</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-muted rounded-lg">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-300">Arjun Mehta</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Good theoretical knowledge</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-500">Needs more practice tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TutorLayout>
  );
};

export default TutorAnalytics;
