import { useEffect, useMemo, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
  ShieldOff,
  Mail,
  Phone,
  Star,
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  Award,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import { TutorGridSkeleton, TutorStatsSkeleton } from "@/components/ui/tutor-card-skeleton";
import { UrlStateIndicator } from "@/components/ui/url-state-indicator";
import {
  useTutors,
  useTutorStats,
  useUpdateTutorStatus,
  useVerifyTutor,
  useDeleteTutor,
  useSendTutorNotification,
  usePrefetchTutors,
  type TutorsQueryParams,
  type Tutor,
} from "@/hooks/useTutors";
import { useTutorUrlFilters } from "@/hooks/useTutorUrlState";

const TutorManagement: React.FC = () => {
  // URL state management for all filters and pagination
  const {
    searchTerm,
    filterStatus,
    filterSpecialization,
    filterExperience,
    filterRating,
    filterVerified,
    sortBy,
    sortOrder,
    currentPage,
    limit,
    setSearchTerm,
    setFilterStatus,
    setFilterSpecialization,
    setFilterExperience,
    setFilterRating,
    setFilterVerified,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    setLimit,
    clearAllFilters,
    resetPage,
  } = useTutorUrlFilters();

  // Local state for UI
  const [selectedTutors, setSelectedTutors] = useState<string[]>([]);
  const [notificationDialog, setNotificationDialog] = useState<boolean>(false);
  const [notificationSubject, setNotificationSubject] = useState<string>("");
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Memoized query parameters for React Query
  const queryParams: TutorsQueryParams = useMemo(() => ({
    page: currentPage,
    limit,
    search: searchTerm,
    status: filterStatus !== "all" ? filterStatus : undefined,
    specialization: filterSpecialization !== "all" ? filterSpecialization : undefined,
    experience: filterExperience !== "all" ? filterExperience : undefined,
    rating: filterRating !== "all" ? filterRating : undefined,
    isVerified: filterVerified !== "all" ? filterVerified : undefined,
    sortBy,
    sortOrder,
  }), [
    currentPage,
    limit,
    searchTerm,
    filterStatus,
    filterSpecialization,
    filterExperience,
    filterRating,
    filterVerified,
    sortBy,
    sortOrder,
  ]);

  // React Query hooks
  const { data: tutorsData, isLoading, error, isFetching } = useTutors(queryParams);
  const { data: statsData, isLoading: statsLoading } = useTutorStats();
  const updateStatusMutation = useUpdateTutorStatus();
  const verifyTutorMutation = useVerifyTutor();
  const deleteTutorMutation = useDeleteTutor();
  const sendNotificationMutation = useSendTutorNotification();
  const prefetchTutors = usePrefetchTutors();

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      resetPage();
    }
  }, [filterStatus, filterSpecialization, filterExperience, filterRating, filterVerified, sortBy, sortOrder]);

  // Prefetch next page when user is on current page
  useEffect(() => {
    if (pagination?.hasNextPage) {
      const nextPageParams = { ...queryParams, page: currentPage + 1 };
      prefetchTutors(nextPageParams);
    }
  }, [tutorsData, currentPage, queryParams, prefetchTutors]);

  // Helper functions
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />;
      case "inactive":
        return <XCircle className="h-3 w-3" />;
      case "suspended":
        return <AlertCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getRatingStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
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

  const handleStatusUpdate = (tutorId: string, status: string): void => {
    updateStatusMutation.mutate({ tutorId, status });
  };

  const handleVerifyTutor = (tutorId: string, isVerified: boolean): void => {
    verifyTutorMutation.mutate({ tutorId, isVerified });
  };

  const handleDeleteTutor = (tutorId: string, tutorName: string): void => {
    if (window.confirm(`Are you sure you want to delete ${tutorName}? This action cannot be undone.`)) {
      deleteTutorMutation.mutate(tutorId);
    }
  };

  const handleSelectTutor = (tutorId: string): void => {
    setSelectedTutors(prev => 
      prev.includes(tutorId) 
        ? prev.filter(id => id !== tutorId)
        : [...prev, tutorId]
    );
  };

  const handleSelectAll = (): void => {
    if (selectedTutors.length === tutors.length) {
      setSelectedTutors([]);
    } else {
      setSelectedTutors(tutors.map(tutor => tutor._id));
    }
  };

  const handleSendNotification = (): void => {
    if (selectedTutors.length === 0) {
      window.alert("Please select at least one tutor to send notification.");
      return;
    }

    sendNotificationMutation.mutate({
      tutorIds: selectedTutors,
      subject: notificationSubject,
      message: notificationMessage,
    });

    setNotificationDialog(false);
    setNotificationSubject("");
    setNotificationMessage("");
    setSelectedTutors([]);
  };

  // Extract data from React Query response
  const tutors: Tutor[] = tutorsData?.results || [];
  const pagination = {
    page: tutorsData?.page || 1,
    limit: tutorsData?.limit || 12,
    totalPages: tutorsData?.totalPages || 1,
    totalResults: tutorsData?.totalResults || 0,
    hasNextPage: (tutorsData?.page || 1) < (tutorsData?.totalPages || 1),
    hasPrevPage: (tutorsData?.page || 1) > 1,
  };
  const stats = statsData || {
    totalTutors: 0,
    activeTutors: 0,
    pendingApprovals: 0,
    suspendedTutors: 0,
    verifiedTutors: 0,
    unverifiedTutors: 0,
    inactiveTutors: 0,
    averageRating: 0,
    totalStudentsEnrolled: 0,
    totalTestsCreated: 0,
    monthlyGrowth: 0,
  };

  const isOperationPending: boolean = updateStatusMutation.isPending || 
                                     verifyTutorMutation.isPending || 
                                     deleteTutorMutation.isPending;
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Tutor Management
            </h1>
            <p className="text-muted-foreground">
              Manage tutor accounts, verify credentials, and monitor performance
              {pagination && (
                <span className="ml-2">
                  ({pagination.totalCount} total tutors)
                </span>
              )}
            </p>
          </div>
        
        </div>

        {/* Statistics Cards */}
        {statsLoading ? (
          <TutorStatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Total Tutors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats.totalTutors || 0).toLocaleString()}</div>
                <p className="text-xs text-green-600">
                  +{stats.monthlyGrowth || 0}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Active Tutors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats.activeTutors || 0).toLocaleString()}</div>
                <p className="text-xs text-blue-600">
                  {(((stats.activeTutors || 0) / (stats.totalTutors || 1)) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingApprovals || 0}</div>
                <p className="text-xs text-orange-600">
                  Requires review
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Star className="mr-2 h-4 w-4" />
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats.averageRating || 0).toFixed(1)}</div>
                <div className="flex items-center">
                  {getRatingStars(stats.averageRating || 0)}
                </div>
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tutors by name, email, or specialization..."
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
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              {/* Verification Filter */}
              <Select value={filterVerified} onValueChange={setFilterVerified}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tutors</SelectItem>
                  <SelectItem value="true">Verified Only</SelectItem>
                  <SelectItem value="false">Unverified Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Specialization Filter */}
              <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>

              {/* Experience Filter */}
              <Select value={filterExperience} onValueChange={setFilterExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience</SelectItem>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>

              {/* Rating Filter */}
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                  <SelectItem value="4.0+">4.0+ Stars</SelectItem>
                  <SelectItem value="3.5+">3.5+ Stars</SelectItem>
                  <SelectItem value="3.0+">3.0+ Stars</SelectItem>
                </SelectContent>
              </Select>

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
                variant={sortBy === "joinDate" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("joinDate")}
                className="flex items-center gap-1"
              >
                Join Date
                {sortBy === "joinDate" && (
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
                variant={sortBy === "rating" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("rating")}
                className="flex items-center gap-1"
              >
                Rating
                {sortBy === "rating" && (
                  sortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortBy === "totalStudents" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("totalStudents")}
                className="flex items-center gap-1"
              >
                Students
                {sortBy === "totalStudents" && (
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
        {isLoading && <TutorGridSkeleton count={limit} />}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Users className="mx-auto h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium mb-2">Error Loading Tutors</h3>
                <p className="text-sm">
                  {error instanceof Error ? error.message : "Failed to load tutors. Please try again."}
                </p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tutors Grid */}
        {!isLoading && !error && tutors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <Card key={tutor._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={tutor.avatar} alt={tutor.name} />
                        <AvatarFallback>
                          {tutor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {tutor.tutorDetails?.isVerified && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                  
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{tutor.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{tutor.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(tutor.tutorDetails?.subscriptionStatus || 'pending')}>
                          {getStatusIcon(tutor.tutorDetails?.subscriptionStatus || 'pending')}
                          <span className="ml-1 capitalize">{tutor.tutorDetails?.subscriptionStatus || 'pending'}</span>
                        </Badge>
                        <div className="flex items-center">
                          {getRatingStars(tutor.tutorDetails?.rating || 0)}
                          <span className="ml-1 text-xs text-gray-600">
                            ({(tutor.tutorDetails?.rating || 0).toFixed(1)})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{tutor.tutorDetails?.experience || 0} years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium">{tutor.tutorDetails?.totalStudents || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tests Created:</span>
                      <span className="font-medium">{tutor.tutorDetails?.totalTests || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Joined:</span>
                      <span className="font-medium">{formatDate(tutor.createdAt)}</span>
                    </div>

                    {/* Specializations */}
                    {tutor.tutorDetails?.subjects && tutor.tutorDetails.subjects.length > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-600">Subjects:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tutor.tutorDetails.subjects.slice(0, 3).map((subject, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                          {tutor.tutorDetails.subjects.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{tutor.tutorDetails.subjects.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Exam Focus */}
                    {tutor.examGoals && tutor.examGoals.length > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-600">Exam Focus:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tutor.examGoals.map((exam, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {exam}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {tutor.tutorDetails?.rating?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {tutor.tutorDetails?.isProfileComplete ? 'Yes' : 'No'}
                        </div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-3">
                      <Link to={`/admin/tutors/view/${tutor._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                      </Link>
                      {/* <Link to={`/admin/tutors/edit/${tutor._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </Link> */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="px-2">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {tutor.tutorDetails?.subscriptionStatus === 'active' ? (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(tutor._id, 'inactive')}
                              disabled={isOperationPending}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(tutor._id, 'active')}
                              disabled={isOperationPending}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          
                          {tutor.tutorDetails?.isVerified ? (
                            <DropdownMenuItem 
                              onClick={() => handleVerifyTutor(tutor._id, false)}
                              disabled={isOperationPending}
                            >
                              <ShieldOff className="mr-2 h-4 w-4" />
                              Remove Verification
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleVerifyTutor(tutor._id, true)}
                              disabled={isOperationPending}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Verify Tutor
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(tutor._id, 'suspended')}
                            disabled={isOperationPending}
                          >
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTutor(tutor._id, tutor.name)}
                            className="text-red-600 focus:text-red-600"
                            disabled={isOperationPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Tutor
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
        {!isLoading && !error && tutors.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tutors found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== "all" || filterSpecialization !== "all" || 
                 filterExperience !== "all" || filterRating !== "all" || filterVerified !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No tutors have been registered yet."}
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
                  {pagination.totalCount} tutors
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

export default TutorManagement;
