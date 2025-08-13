import { useEffect, useMemo } from "react";
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
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  BookOpen,
  TrendingUp,
  Users,
  Clock,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import TutorLayout from "@/components/layouts/TutorLayout";
import { TestGridSkeleton } from "@/components/ui/test-card-skeleton";
import { UrlStateIndicator } from "@/components/ui/url-state-indicator";
import { TutorTestCardActions } from "@/components/tutor/TutorTestCardActions";
import { 
  useTutorTests, 
  useDeleteTutorTest, 
  usePrefetchTutorTests, 
  useTutorTestStats,
  useToggleTestPublication,
  type TutorTestsQueryParams 
} from "@/hooks/useTutorTests";
import { useUrlFilters } from "@/hooks/useUrlState";

const TutorTestManagement = () => {
  // URL state management for all filters and pagination
  const {
    searchTerm,
    filterType,
    filterExamType,
    filterSubject,
    filterDifficulty,
    sortBy,
    sortOrder,
    currentPage,
    limit,
    setSearchTerm,
    setFilterType,
    setFilterExamType,
    setFilterSubject,
    setFilterDifficulty,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    setLimit,
    clearAllFilters,
    resetPage,
  } = useUrlFilters();

  // Memoized query parameters for React Query
  const queryParams: TutorTestsQueryParams = useMemo(() => ({
    page: currentPage,
    limit,
    search: searchTerm,
    type: filterType !== "all" ? filterType : undefined,
    examType: filterExamType !== "all" ? filterExamType : undefined,
    subject: filterSubject !== "all" ? filterSubject : undefined,
    difficulty: filterDifficulty !== "all" ? filterDifficulty : undefined,
    sortBy,
    sortOrder,
  }), [
    currentPage,
    limit,
    searchTerm,
    filterType,
    filterExamType,
    filterSubject,
    filterDifficulty,
    sortBy,
    sortOrder,
  ]);

  // React Query hooks
  const { data: testsData, isLoading, error, isFetching } = useTutorTests(queryParams);
  const { data: statsData, isLoading: isStatsLoading } = useTutorTestStats();
  const deleteTestMutation = useDeleteTutorTest();
  const togglePublicationMutation = useToggleTestPublication();
  const prefetchTests = usePrefetchTutorTests();

  // Reset page when filters change (not search, as it's handled by URL state)
  useEffect(() => {
    // Only reset page if we're not on page 1 and filters have changed
    if (currentPage !== 1) {
      resetPage();
    }
  }, [filterType, filterExamType, filterSubject, filterDifficulty, sortBy, sortOrder]);

  // Prefetch next page when user is on current page
  useEffect(() => {
    if (testsData?.pagination?.hasNextPage) {
      const nextPageParams = { ...queryParams, page: currentPage + 1 };
      prefetchTests(nextPageParams);
    }
  }, [testsData, currentPage, queryParams, prefetchTests]);

  // Handler functions
  const handleDeleteTest = async (testId: string, testTitle: string) => {
    deleteTestMutation.mutate(testId);
  };

  const handleTogglePublication = async (testId: string, isPublished: boolean) => {
    togglePublicationMutation.mutate({ testId, isPublished });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getType = (type: string) => {
    switch (type) {
      case "fullMock":
        return "Full Mock";
      case "chapterWise":
        return "Chapter Test";
      case "dailyQuiz":
        return "Daily Quiz";
      case "themedEvent":
        return "Themed Event";
      default:
        return type;
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Extract data from React Query response
  const tests = testsData?.tests || [];
  const pagination = testsData?.pagination;
  const isDeleting = deleteTestMutation.isPending;
  const isUpdating = togglePublicationMutation.isPending;

  return (
    <TutorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Test Management
            </h1>
            <p className="text-muted-foreground">
              Create, edit, and manage tests for your students
              {pagination && (
                <span className="ml-2">
                  ({pagination.totalCount} total tests)
                </span>
              )}
            </p>
          </div>
          <Link to="/tutor/tests/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New Test
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Total Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsLoading ? "..." : statsData?.totalTests || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Target className="mr-2 h-4 w-4" />
                Active Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsLoading ? "..." : statsData?.activeTests || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Total Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsLoading ? "..." : statsData?.totalAttempts || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Avg Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsLoading ? "..." : `${statsData?.averageScore || 0}%`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">Filters & Search</CardTitle>
                <UrlStateIndicator />
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
                  placeholder="Search tests by title, description, or exam type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Test Type Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fullMock">Full Mock</SelectItem>
                  <SelectItem value="chapterWise">Chapter Test</SelectItem>
                  <SelectItem value="dailyQuiz">Daily Quiz</SelectItem>
                  <SelectItem value="themedEvent">Themed Event</SelectItem>
                </SelectContent>
              </Select>

              {/* Exam Type Filter */}
              <Select value={filterExamType} onValueChange={setFilterExamType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  <SelectItem value="JEE">JEE</SelectItem>
                  <SelectItem value="BITSAT">BITSAT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Subject Filter */}
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
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

              {/* Placeholder for future filters */}
              <div></div>
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={sortBy === "createdAt" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("createdAt")}
                className="flex items-center gap-1"
              >
                Date Created
                {sortBy === "createdAt" && (
                  sortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortBy === "title" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("title")}
                className="flex items-center gap-1"
              >
                Title
                {sortBy === "title" && (
                  sortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortBy === "numberOfQuestions" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("numberOfQuestions")}
                className="flex items-center gap-1"
              >
                Questions
                {sortBy === "numberOfQuestions" && (
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
        {isLoading && <TestGridSkeleton count={limit} />}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-red-500 mb-4">
                <BookOpen className="mx-auto h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium mb-2">Error Loading Tests</h3>
                <p className="text-sm">
                  {error instanceof Error ? error.message : "Failed to load tests. Please try again."}
                </p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tests Grid */}
        {!isLoading && !error && tests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <Card key={test._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{test.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {test.examType} • {test.numberOfQuestions} questions • {test.duration}min
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {getType(test.type)}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(test.overallDifficulty)}`}>
                          {test.overallDifficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {new Date(test.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {test.duration} minutes
                      </span>
                    </div>

                    {/* Subject Distribution */}
                    {test.subjectCount && Object.keys(test.subjectCount).length > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-600">Subjects:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(test.subjectCount).map(([subject, count]) => (
                            <Badge key={subject} variant="secondary" className="text-xs">
                              {subject}: {count}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <TutorTestCardActions
                      test={test}
                      onDelete={handleDeleteTest}
                      onTogglePublication={handleTogglePublication}
                      isDeleting={isDeleting}
                      isUpdating={isUpdating}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tests found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== "all" || filterExamType !== "all" || 
                 filterSubject !== "all" || filterDifficulty !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first test for your students."}
              </p>
              {!searchTerm && filterType === "all" && filterExamType === "all" && 
               filterSubject === "all" && filterDifficulty === "all" && (
                <Link to="/tutor/tests/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Test
                  </Button>
                </Link>
              )}
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
                  {pagination.totalCount} tests
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
                      let pageNum;
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
    </TutorLayout>
  );
};

export default TutorTestManagement;
