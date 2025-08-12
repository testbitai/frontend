import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Trophy,
  Zap,
  Target,
  BookOpen,
  Clock,
  TrendingUp,
  TrendingDown,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Send,
  Edit,
  Trash2,
  Download,
  Eye,
  Star,
  Users,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { StudentDetailSkeleton } from "@/components/ui/student-card-skeleton";
import {
  ProgressBar,
  SimpleBarChart,
  SimpleLineChart,
  CircularProgress,
} from "@/components/ui/simple-charts";
import {
  useStudent,
  useUpdateStudentStatus,
  useDeleteStudent,
  useSendStudentNotification,
  type Student,
} from "@/hooks/useStudents";
import { useToast } from "@/hooks/use-toast";

const StudentView: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { toast } = useToast();

  // Local state
  const [notificationDialog, setNotificationDialog] = useState<boolean>(false);
  const [notificationSubject, setNotificationSubject] = useState<string>("");
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  // React Query hooks
  const { data: studentData, isLoading, error } = useStudent(studentId!);
  const updateStatusMutation = useUpdateStudentStatus();
  const deleteStudentMutation = useDeleteStudent();
  const sendNotificationMutation = useSendStudentNotification();

  // Helper functions
  const getStatusColor = (isActive: boolean): string => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusIcon = (isActive: boolean): JSX.Element => {
    return isActive ? (
      <CheckCircle className="h-4 w-4" />
    ) : (
      <XCircle className="h-4 w-4" />
    );
  };

  const getExamGoalColor = (examGoal?: string): string => {
    switch (examGoal) {
      case "JEE":
        return "bg-blue-100 text-blue-800";
      case "BITSAT":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrendIcon = (trend: number): JSX.Element => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const handleStatusUpdate = (isActive: boolean): void => {
    if (!studentId) return;
    updateStatusMutation.mutate({ studentId, isActive });
  };

  const handleDeleteStudent = (): void => {
    if (!studentId || !safeStudent) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${safeStudent.name}? This action cannot be undone.`
      )
    ) {
      deleteStudentMutation.mutate(studentId);
    }
  };

  const handleSendNotification = (): void => {
    if (!studentId) return;

    sendNotificationMutation.mutate({
      studentIds: [studentId],
      subject: notificationSubject,
      message: notificationMessage,
    });

    setNotificationDialog(false);
    setNotificationSubject("");
    setNotificationMessage("");
  };

  // Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <StudentDetailSkeleton />
      </AdminLayout>
    );
  }

  // Error state
  if (error || !studentData) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Student Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "The requested student could not be found."}
          </p>
          <Link to="/admin/students">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  // Extract data from React Query response with safe defaults
  const { student, analytics, attempts } = studentData;

  // Safe accessors with defaults
  const safeStudent = {
    ...student,
    avatar: student.avatar || "",
    averageScore: student.averageScore || 0,
    testsCompleted: student.testsCompleted || 0,
    currentStreak: student.currentStreak || 0,
    coins: student.coins || 0,
    progress: student.progress || 0,
    performance: {
      bestScore: student.performance?.bestScore || 0,
      worstScore: student.performance?.worstScore || 0,
      improvementTrend: student.performance?.improvementTrend || 0,
      ...student.performance,
    },
    lastTest: student.lastTest || null,
  };

  const safeAnalytics = {
    ...analytics,
    subjectWisePerformance: analytics.subjectWisePerformance || [],
    monthlyProgress: analytics.monthlyProgress || [],
    recentActivity: analytics.recentActivity || [],
  };

  const safeAttempts = attempts || [];
  const isOperationPending =
    updateStatusMutation.isPending ||
    deleteStudentMutation.isPending ||
    sendNotificationMutation.isPending;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/students">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Students
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Student Details
              </h1>
              <p className="text-muted-foreground">
                Comprehensive view of student performance and activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog
              open={notificationDialog}
              onOpenChange={setNotificationDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Notification</DialogTitle>
                  <DialogDescription>
                    Send a personal message to {safeStudent.name}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={notificationSubject}
                      onChange={(e) => setNotificationSubject(e.target.value)}
                      placeholder="Enter message subject..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      placeholder="Enter your message..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setNotificationDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendNotification}
                      disabled={
                        !notificationSubject ||
                        !notificationMessage ||
                        sendNotificationMutation.isPending
                      }
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {safeStudent.isActive ? (
                  <DropdownMenuItem
                    onClick={() => handleStatusUpdate(false)}
                    disabled={isOperationPending}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Deactivate Account
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleStatusUpdate(true)}
                    disabled={isOperationPending}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Activate Account
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleDeleteStudent}
                  className="text-red-600 focus:text-red-600"
                  disabled={isOperationPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Student
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Student Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={safeStudent.avatar}
                  alt={safeStudent.name}
                />
                <AvatarFallback className="text-2xl">
                  {safeStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold">{safeStudent.name}</h2>
                  <Badge className={getStatusColor(safeStudent.isActive)}>
                    {getStatusIcon(safeStudent.isActive)}
                    <span className="ml-1">
                      {safeStudent.isActive ? "Active" : "Inactive"}
                    </span>
                  </Badge>
                  {safeStudent.examGoal && (
                    <Badge className={getExamGoalColor(safeStudent.examGoal)}>
                      <Target className="mr-1 h-3 w-3" />
                      {safeStudent.examGoal}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{safeStudent.email}</span>
                  </div>
                  {safeStudent.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{safeStudent.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(safeStudent.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span>
                      Last active {formatDate(safeStudent.lastActive)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tests Completed
                  </p>
                  <p className="text-2xl font-bold">
                    {safeStudent.testsCompleted}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Score
                  </p>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      safeStudent.averageScore
                    )}`}
                  >
                    {safeStudent.averageScore.toFixed(1)}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold">
                    {safeStudent.currentStreak} days
                  </p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Coins Earned
                  </p>
                  <p className="text-2xl font-bold">{safeStudent.coins}</p>
                </div>
                <Trophy className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="tests">Test History</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Best Score</span>
                    <span className="font-semibold text-green-600">
                      {safeStudent.performance.bestScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Worst Score</span>
                    <span className="font-semibold text-red-600">
                      {safeStudent.performance.worstScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Improvement Trend
                    </span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(safeStudent.performance.improvementTrend)}
                      <span className="font-semibold">
                        {safeStudent.performance.improvementTrend > 0
                          ? "+"
                          : ""}
                        {safeStudent.performance.improvementTrend.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="font-semibold">
                      {safeStudent.progress.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Study Buddy & Gamification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Gamification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Study Buddy Level
                    </span>
                    <Badge variant="secondary">
                      {safeStudent.studyBuddyLevel || "Beginner"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Coins</span>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{safeStudent.coins}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Badges Earned</span>
                    <span className="font-semibold">
                      {safeStudent.badges?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Current Streak
                    </span>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">
                        {safeStudent.currentStreak} days
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Last Test Information */}
            {safeStudent.lastTest && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Last Test Attempt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Test Name</p>
                      <p className="font-semibold">
                        {safeStudent.lastTest.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Score</p>
                      <p
                        className={`font-semibold ${getScoreColor(
                          safeStudent.lastTest.score
                        )}`}
                      >
                        {safeStudent.lastTest.score.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="font-semibold">
                        {formatDate(safeStudent.lastTest.completedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject-wise Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Performance</CardTitle>
                  <CardDescription>
                    Average scores across different subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {safeAnalytics.subjectWisePerformance.length > 0 ? (
                    <div className="space-y-6">
                      {safeAnalytics.subjectWisePerformance.map(
                        (subject, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                {subject.subject}
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-semibold ${getScoreColor(
                                    subject.averageScore
                                  )}`}
                                >
                                  {subject.averageScore.toFixed(1)}%
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({subject.totalAttempts} tests)
                                </span>
                              </div>
                            </div>
                            <ProgressBar
                              value={subject.averageScore}
                              color={
                                subject.averageScore >= 80
                                  ? "green"
                                  : subject.averageScore >= 60
                                  ? "yellow"
                                  : "red"
                              }
                            />
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No subject-wise data available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Visual representation of key metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <CircularProgress
                        value={safeStudent.averageScore}
                        color={
                          safeStudent.averageScore >= 80
                            ? "#10b981"
                            : safeStudent.averageScore >= 60
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                        size={100}
                      />
                      <p className="text-sm font-medium mt-2">Average Score</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress
                        value={safeStudent.progress}
                        color="#8b5cf6"
                        size={100}
                      />
                      <p className="text-sm font-medium mt-2">Progress</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Best Score</span>
                      <span className="font-semibold text-green-600">
                        {safeStudent.performance.bestScore.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Improvement Trend</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(safeStudent.performance.improvementTrend)}
                        <span className="font-semibold">
                          {safeStudent.performance.improvementTrend > 0
                            ? "+"
                            : ""}
                          {safeStudent.performance.improvementTrend.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress Trend</CardTitle>
                <CardDescription>
                  Performance trend over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                {safeAnalytics.monthlyProgress.length > 0 ? (
                  <div className="h-64">
                    <SimpleLineChart
                      data={safeAnalytics.monthlyProgress
                        .slice(-6)
                        .map((month) => ({
                          label: new Date(
                            month.month + "-01"
                          ).toLocaleDateString("en-US", {
                            month: "short",
                          }),
                          value: month.averageScore,
                        }))}
                      height={200}
                      color="#3b82f6"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No monthly progress data available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Detailed breakdown of performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {safeStudent.performance.bestScore.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Best Score</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {safeStudent.averageScore.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {safeStudent.performance.worstScore.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Lowest Score</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div
                      className={`text-2xl font-bold mb-1 ${
                        safeStudent.performance.improvementTrend > 0
                          ? "text-green-600"
                          : safeStudent.performance.improvementTrend < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {safeStudent.performance.improvementTrend > 0 ? "+" : ""}
                      {safeStudent.performance.improvementTrend.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test History Tab */}
          <TabsContent value="tests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Test Attempts</CardTitle>
                <CardDescription>
                  Showing {Math.min(safeAttempts.length, 20)} most recent test
                  attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {safeAttempts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Correct/Total</TableHead>
                        <TableHead>Time Taken</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {safeAttempts.slice(0, 20).map((attempt, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {(attempt.test as any)?.title || "Unknown Test"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-semibold ${getScoreColor(
                                attempt.scorePercent || 0
                              )}`}
                            >
                              {(attempt.scorePercent || 0).toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            {attempt.correctCount || 0}/
                            {attempt.totalQuestions || 0}
                          </TableCell>
                          <TableCell>
                            {Math.floor((attempt.totalTimeTaken || 0) / 60)}m{" "}
                            {(attempt.totalTimeTaken || 0) % 60}s
                          </TableCell>
                          <TableCell>
                            {formatDate(attempt.attemptedAt)}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No test attempts found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest student activities and interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {safeAnalytics.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {safeAnalytics.recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 border rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            Completed test:{" "}
                            {(activity.test as any)?.title || "Unknown Test"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Score: {(activity.scorePercent || 0).toFixed(1)}% •{" "}
                            {formatDate(activity.attemptedAt)}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {(activity.scorePercent || 0) >= 80
                            ? "Excellent"
                            : (activity.scorePercent || 0) >= 60
                            ? "Good"
                            : "Needs Improvement"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default StudentView;
