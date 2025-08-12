import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Star,
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Eye,
  Trash2,
  Download,
  Send,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Filter,
  Target,
  Trophy,
  Zap,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import { StudentGridSkeleton, StudentStatsSkeleton } from "@/components/ui/student-card-skeleton";
import {
  useStudents,
  useStudentStats,
  useUpdateStudentStatus,
  useDeleteStudent,
  useSendStudentNotification,
  useExportStudents,
  usePrefetchStudents,
  type StudentsQueryParams,
  type Student,
} from "@/hooks/useStudents";
import { useStudentUrlFilters } from "@/hooks/useStudentUrlState";

const AdminStudentManagement: React.FC = () => {
  // URL state management for all filters and pagination
  const {
    searchTerm,
    filterStatus,
    filterExamGoal,
    filterHasAttempts,
    sortBy,
    sortOrder,
    minScore,
    maxScore,
    currentPage,
    limit,
    setSearchTerm,
    setFilterStatus,
    setFilterExamGoal,
    setFilterHasAttempts,
    setSortBy,
    setSortOrder,
    setMinScore,
    setMaxScore,
    setCurrentPage,
    setLimit,
    clearAllFilters,
    resetPage,
  } = useStudentUrlFilters();

  // Local state for UI
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [notificationDialog, setNotificationDialog] = useState<boolean>(false);
  const [notificationSubject, setNotificationSubject] = useState<string>("");
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  // Memoized query parameters for React Query
  const queryParams: StudentsQueryParams = useMemo(() => ({
    page: currentPage,
    limit,
    search: searchTerm,
    status: filterStatus !== "all" ? filterStatus : undefined,
    examGoal: filterExamGoal !== "all" ? filterExamGoal : undefined,
    hasAttempts: filterHasAttempts !== "all" ? filterHasAttempts : undefined,
    sortBy,
    sortOrder,
    minScore,
    maxScore,
  }), [
    currentPage,
    limit,
    searchTerm,
    filterStatus,
    filterExamGoal,
    filterHasAttempts,
    sortBy,
    sortOrder,
    minScore,
    maxScore,
  ]);

  // React Query hooks
  const { data: studentsData, isLoading, error, isFetching } = useStudents(queryParams);
  const { data: statsData, isLoading: statsLoading } = useStudentStats();
  const updateStatusMutation = useUpdateStudentStatus();
  const deleteStudentMutation = useDeleteStudent();
  const sendNotificationMutation = useSendStudentNotification();
  const exportStudentsMutation = useExportStudents();
  const prefetchStudents = usePrefetchStudents();

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      resetPage();
    }
  }, [filterStatus, filterExamGoal, filterHasAttempts, sortBy, sortOrder, minScore, maxScore]);

  // Prefetch next page when user is on current page
  useEffect(() => {
    if (studentsData?.pagination?.hasNextPage) {
      const nextPageParams = { ...queryParams, page: currentPage + 1 };
      prefetchStudents(nextPageParams);
    }
  }, [studentsData, currentPage, queryParams, prefetchStudents]);

  // Helper functions
  const getStatusColor = (isActive: boolean): string => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusIcon = (isActive: boolean): JSX.Element => {
    return isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />;
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const handleSort = (field: string): void => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleStatusUpdate = (studentId: string, isActive: boolean): void => {
    updateStatusMutation.mutate({ studentId, isActive });
  };

  const handleDeleteStudent = (studentId: string, studentName: string): void => {
    if (window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      deleteStudentMutation.mutate(studentId);
    }
  };

  const handleSelectStudent = (studentId: string): void => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = (): void => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(student => student._id));
    }
  };

  const handleSendNotification = (): void => {
    if (selectedStudents.length === 0) {
      window.alert("Please select at least one student to send notification.");
      return;
    }

    sendNotificationMutation.mutate({
      studentIds: selectedStudents,
      subject: notificationSubject,
      message: notificationMessage,
    });

    setNotificationDialog(false);
    setNotificationSubject("");
    setNotificationMessage("");
    setSelectedStudents([]);
  };

  const handleExportData = (): void => {
    exportStudentsMutation.mutate();
  };

  // Extract data from React Query response
  const students: Student[] = studentsData?.students || [];
  const pagination = studentsData?.pagination;
  const stats = statsData || {
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    studentsWithAttempts: 0,
    studentsWithoutAttempts: 0,
    averageScore: 0,
    monthlyGrowth: 0,
    examGoalDistribution: [],
    newStudentsThisMonth: 0,
  };

  const isOperationPending: boolean = updateStatusMutation.isPending || 
                                     deleteStudentMutation.isPending ||
                                     sendNotificationMutation.isPending ||
                                     exportStudentsMutation.isPending;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Student Management
            </h1>
            <p className="text-muted-foreground">
              Manage student accounts, monitor performance, and track progress
              {pagination && (
                <span className="ml-2">
                  ({pagination.totalCount} total students)
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportData}
              disabled={isOperationPending}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            {selectedStudents.length > 0 && (
              <Dialog open={notificationDialog} onOpenChange={setNotificationDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    Send Notification ({selectedStudents.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Notification</DialogTitle>
                    <DialogDescription>
                      Send a notification to {selectedStudents.length} selected student(s).
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={notificationSubject}
                        onChange={(e) => setNotificationSubject(e.target.value)}
                        placeholder="Enter notification subject..."
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
                        disabled={!notificationSubject || !notificationMessage || sendNotificationMutation.isPending}
                      >
                        {sendNotificationMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Send Notification
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        {statsLoading ? (
          <StudentStatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-green-600">
                  +{stats.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Active Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeStudents.toLocaleString()}</div>
                <p className="text-xs text-blue-600">
                  {stats.totalStudents > 0 ? ((stats.activeStudents / stats.totalStudents) * 100).toFixed(1) : 0}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  With Test Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.studentsWithAttempts}</div>
                <p className="text-xs text-purple-600">
                  {stats.totalStudents > 0 ? ((stats.studentsWithAttempts / stats.totalStudents) * 100).toFixed(1) : 0}% engaged
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
                <p className="text-xs text-orange-600">
                  Platform average
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">Filters & Search</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
                {selectedStudents.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Exam Goal Filter */}
              <Select value={filterExamGoal} onValueChange={setFilterExamGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by exam goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exam Goals</SelectItem>
                  <SelectItem value="JEE">JEE</SelectItem>
                  <SelectItem value="BITSAT">BITSAT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Test Attempts Filter */}
              <Select value={filterHasAttempts} onValueChange={setFilterHasAttempts}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by test attempts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="true">With Test Attempts</SelectItem>
                  <SelectItem value="false">No Test Attempts</SelectItem>
                </SelectContent>
              </Select>

              {/* Min Score Filter */}
              <div>
                <Input
                  type="number"
                  placeholder="Min Score (%)"
                  value={minScore?.toString() || ''}
                  onChange={(e) => setMinScore(e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  max="100"
                />
              </div>

              {/* Max Score Filter */}
              <div>
                <Input
                  type="number"
                  placeholder="Max Score (%)"
                  value={maxScore?.toString() || ''}
                  onChange={(e) => setMaxScore(e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  max="100"
                />
              </div>

              {/* Items per page */}
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 per page</SelectItem>
                  <SelectItem value="12">12 per page</SelectItem>
                  <SelectItem value="24">24 per page</SelectItem>
                  <SelectItem value="48">48 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={sortBy === "createdAt" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("createdAt")}
                className="flex items-center gap-1"
              >
                Join Date
                {sortBy === "createdAt" && (
                  sortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("name")}
                className="flex items-center gap-1"
              >
                Name
                {sortBy === "name" && (
                  sortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortBy === "averageScore" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("averageScore")}
                className="flex items-center gap-1"
              >
                Average Score
                {sortBy === "averageScore" && (
                  sortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortBy === "testsCompleted" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("testsCompleted")}
                className="flex items-center gap-1"
              >
                Tests Completed
                {sortBy === "testsCompleted" && (
                  sortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                )}
              </Button>
            </div>

            {/* Loading indicator for background fetching */}
            {isFetching && !isLoading && (
              <div className="flex items-center justify-center mt-4">
                <div className="text-sm text-gray-500">Updating...</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading Skeleton */}
        {isLoading && <StudentGridSkeleton count={limit} />}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Users className="mx-auto h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium mb-2">Error Loading Students</h3>
                <p className="text-sm">
                  {error instanceof Error ? error.message : "Failed to load students. Please try again."}
                </p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Students Grid */}
        {!isLoading && !error && students.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card key={student._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={student.profilePicture} alt={student.name} />
                        <AvatarFallback>
                          {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* <div className="absolute -top-1 -right-1">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student._id)}
                          onChange={() => handleSelectStudent(student._id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div> */}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{student.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{student.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(student.isActive)}>
                          {getStatusIcon(student.isActive)}
                          <span className="ml-1">{student.isActive ? 'Active' : 'Inactive'}</span>
                        </Badge>
                        {student.examGoal && (
                          <Badge className={getExamGoalColor(student.examGoal)}>
                            <Target className="mr-1 h-3 w-3" />
                            {student.examGoal}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tests Completed:</span>
                      <span className="font-medium">{student.testsCompleted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Average Score:</span>
                      <span className={`font-medium ${getScoreColor(student.averageScore)}`}>
                        {student.averageScore.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Streak:</span>
                      <span className="font-medium flex items-center">
                        <Zap className="mr-1 h-3 w-3 text-yellow-500" />
                        {student.currentStreak} days
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Coins:</span>
                      <span className="font-medium flex items-center">
                        <Trophy className="mr-1 h-3 w-3 text-yellow-500" />
                        {student.coins}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Joined:</span>
                      <span className="font-medium">{formatDate(student.joinDate)}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-medium">{student.progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(student.progress)}`}
                          style={{ width: `${Math.min(student.progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Last Test */}
                    {/* {student.lastTest && (
                      <div className="text-sm">
                        <span className="text-gray-600">Last Test:</span>
                        <div className="mt-1 p-2 bg-gray-50 rounded">
                          <div className="font-medium truncate">{student.lastTest.title}</div>
                          <div className="text-xs text-gray-500 flex justify-between">
                            <span>Score: {student.lastTest.score.toFixed(1)}%</span>
                            <span>{formatDate(student.lastTest.completedAt)}</span>
                          </div>
                        </div>
                      </div>
                    )} */}

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {student.performance.bestScore.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Best Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {student.performance.improvementTrend > 0 ? '+' : ''}{student.performance.improvementTrend.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Improvement</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-3">
                      <Link to={`/admin/students/view/${student._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="px-2">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {student.isActive ? (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(student._id, false)}
                              disabled={isOperationPending}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(student._id, true)}
                              disabled={isOperationPending}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem 
                            onClick={() => handleSelectStudent(student._id)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            {selectedStudents.includes(student._id) ? 'Remove from Selection' : 'Add to Selection'}
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            onClick={() => handleDeleteStudent(student._id, student.name)}
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && students.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No students found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== "all" || filterExamGoal !== "all" || 
                 filterHasAttempts !== "all" || minScore || maxScore
                  ? "Try adjusting your search or filter criteria."
                  : "No students have been registered yet."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {!isLoading && !error && pagination && pagination.totalPages > 1 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                  {pagination.totalCount} students
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage || isFetching}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === pagination.currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                          disabled={isFetching}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage || isFetching}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStudentManagement;
