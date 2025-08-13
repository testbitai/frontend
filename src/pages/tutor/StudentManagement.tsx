import React, { useState, useMemo } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  UserPlus,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Copy,
  Share,
  Users,
  TrendingUp,
  Clock,
  Target,
  Mail,
  Calendar,
  Award,
  Trash2,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
} from "lucide-react";
import TutorLayout from "@/components/layouts/TutorLayout";
import { useToast } from "@/hooks/use-toast";
import {
  useStudents,
  useInvitations,
  useStudentStats,
  useGenerateInvite,
  useUpdateInvitationStatus,
  useRemoveStudent,
  useResendInvitation,
  useSendMailToStudent,
  type StudentsQueryParams,
  type InvitationsQueryParams,
} from "@/hooks/useStudentManagement";
import { useUrlFilters } from "@/hooks/useUrlState";

const StudentManagement = () => {
  const { toast } = useToast();
  
  // State for dialogs and forms
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showInvitationsDialog, setShowInvitationsDialog] = useState(false);
  const [showStudentDetailsDialog, setShowStudentDetailsDialog] = useState(false);
  const [showSendMailDialog, setShowSendMailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteExpiry, setInviteExpiry] = useState("7");
  const [studentToRemove, setStudentToRemove] = useState<string | null>(null);
  const [invitationToUpdate, setInvitationToUpdate] = useState<{
    id: string;
    action: 'accept' | 'reject';
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const [mailMessage, setMailMessage] = useState("");

  // URL state management for students
  const {
    searchTerm: studentSearch,
    filterType: studentStatus,
    sortBy: studentSortBy,
    sortOrder: studentSortOrder,
    currentPage: studentPage,
    limit: studentLimit,
    setSearchTerm: setStudentSearch,
    setFilterType: setStudentStatus,
    setSortBy: setStudentSortBy,
    setSortOrder: setStudentSortOrder,
    setCurrentPage: setStudentPage,
    setLimit: setStudentLimit,
    clearAllFilters: clearStudentFilters,
  } = useUrlFilters('students');

  // URL state management for invitations
  const {
    filterType: invitationStatus,
    sortBy: invitationSortBy,
    sortOrder: invitationSortOrder,
    currentPage: invitationPage,
    limit: invitationLimit,
    setFilterType: setInvitationStatus,
    setSortBy: setInvitationSortBy,
    setSortOrder: setInvitationSortOrder,
    setCurrentPage: setInvitationPage,
    setLimit: setInvitationLimit,
  } = useUrlFilters('invitations');

  // Query parameters
  const studentsParams: StudentsQueryParams = useMemo(() => ({
    page: studentPage,
    limit: studentLimit,
    search: studentSearch,
    status: studentStatus !== "all" ? studentStatus : undefined,
    sortBy: studentSortBy,
    sortOrder: studentSortOrder,
  }), [studentPage, studentLimit, studentSearch, studentStatus, studentSortBy, studentSortOrder]);

  const invitationsParams: InvitationsQueryParams = useMemo(() => ({
    page: invitationPage,
    limit: invitationLimit,
    status: invitationStatus !== "all" ? invitationStatus : undefined,
    sortBy: invitationSortBy,
    sortOrder: invitationSortOrder,
  }), [invitationPage, invitationLimit, invitationStatus, invitationSortBy, invitationSortOrder]);

  // React Query hooks
  const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useStudents(studentsParams);
  const { data: invitationsData, isLoading: invitationsLoading } = useInvitations(invitationsParams);
  const { data: statsData, isLoading: statsLoading } = useStudentStats();
  
  // Mutations
  const generateInviteMutation = useGenerateInvite();
  const updateInvitationMutation = useUpdateInvitationStatus();
  const removeStudentMutation = useRemoveStudent();
  const resendInvitationMutation = useResendInvitation();
  const sendMailMutation = useSendMailToStudent();

  // Handlers
  const handleGenerateInvite = async () => {
    try {
      const result = await generateInviteMutation.mutateAsync({
        message: inviteMessage || undefined,
        expiresIn: parseInt(inviteExpiry),
      });
      
      // Copy invite link to clipboard
      await navigator.clipboard.writeText(result.inviteLink);
      toast({
        title: "Invite Generated & Copied!",
        description: "Invite link has been copied to clipboard.",
      });
      
      setShowInviteDialog(false);
      setInviteMessage("");
      setInviteExpiry("7");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleUpdateInvitation = async () => {
    if (!invitationToUpdate) return;

    try {
      await updateInvitationMutation.mutateAsync({
        invitationId: invitationToUpdate.id,
        status: invitationToUpdate.action === 'accept' ? 'accepted' : 'rejected',
        reason: invitationToUpdate.action === 'reject' ? rejectionReason : undefined,
      });
      
      setInvitationToUpdate(null);
      setRejectionReason("");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;

    try {
      await removeStudentMutation.mutateAsync(studentToRemove);
      setStudentToRemove(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCopyInviteLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link Copied",
        description: "Invite link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleViewStudentDetails = (student: StudentDetails) => {
    setSelectedStudent(student);
    setShowStudentDetailsDialog(true);
  };

  const handleSendMail = (student: StudentDetails) => {
    setSelectedStudent(student);
    setMailSubject("");
    setMailMessage("");
    setShowSendMailDialog(true);
  };

  const handleSendMailSubmit = async () => {
    if (!selectedStudent || !mailSubject.trim() || !mailMessage.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both subject and message.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendMailMutation.mutateAsync({
        studentId: selectedStudent._id,
        subject: mailSubject,
        message: mailMessage
      });
      
      setShowSendMailDialog(false);
      setSelectedStudent(null);
      setMailSubject("");
      setMailMessage("");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleSort = (field: string, type: 'students' | 'invitations') => {
    if (type === 'students') {
      if (studentSortBy === field) {
        setStudentSortOrder(studentSortOrder === "asc" ? "desc" : "asc");
      } else {
        setStudentSortBy(field);
        setStudentSortOrder("desc");
      }
    } else {
      if (invitationSortBy === field) {
        setInvitationSortOrder(invitationSortOrder === "asc" ? "desc" : "asc");
      } else {
        setInvitationSortBy(field);
        setInvitationSortOrder("desc");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const students = studentsData?.students || [];
  const studentsPagination = studentsData?.pagination;
  const invitations = invitationsData?.invitations || [];
  const invitationsPagination = invitationsData?.pagination;

  return (
    <TutorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
            <p className="text-muted-foreground">
              Manage student requests and your enrolled students. Students must request to join your class first.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInvitationsDialog(true)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Requests
            </Button>
            <Button
              onClick={() => setShowInviteDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Generate Invite
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : statsData?.totalStudents || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {statsLoading ? "..." : statsData?.activeStudents || 0} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : statsData?.pendingInvitations || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Target className="mr-2 h-4 w-4" />
                Test Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : statsData?.totalTestAttempts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total attempts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : `${statsData?.averageScore || 0}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                Class average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Generate Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Student Invite</DialogTitle>
              <DialogDescription>
                Create an invite code for students to join your class.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="message">Welcome Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Welcome to my class! I'm excited to help you succeed..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {inviteMessage.length}/500 characters
                </p>
              </div>
              <div>
                <Label htmlFor="expiry">Expires In</Label>
                <Select value={inviteExpiry} onValueChange={setInviteExpiry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="14">2 weeks</SelectItem>
                    <SelectItem value="30">1 month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateInvite}
                disabled={generateInviteMutation.isPending}
              >
                {generateInviteMutation.isPending ? "Generating..." : "Generate & Copy Link"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Invitations Dialog */}
        <Dialog open={showInvitationsDialog} onOpenChange={setShowInvitationsDialog}>
          <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Student Requests</DialogTitle>
              <DialogDescription>
                Review and manage student requests to join your class.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Invitation Filters */}
              <div className="flex items-center gap-4">
                <Select value={invitationStatus} onValueChange={setInvitationStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort("createdAt", "invitations")}
                  className="flex items-center gap-1"
                >
                  Sort by Date
                  {invitationSortBy === "createdAt" && (
                    invitationSortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort("status", "invitations")}
                  className="flex items-center gap-1"
                >
                  Sort by Status
                  {invitationSortBy === "status" && (
                    invitationSortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                  )}
                </Button>
              </div>

              {/* Invitations List */}
              {invitationsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : invitations.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                  <p className="text-gray-600">
                    {invitationStatus !== "all" 
                      ? "No student requests match the selected filter."
                      : "No student requests yet. Share your invite code for students to request access."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {invitations.map((invitation) => (
                    <div key={invitation._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(invitation.status)}>
                              {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                            </Badge>
                            <span className="text-sm font-medium">Code: {invitation.inviteCode}</span>
                          </div>
                          
                          {invitation.studentName && (
                            <p className="text-sm text-gray-600 mb-1">
                              Student: {invitation.studentName} ({invitation.studentEmail})
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Created: {new Date(invitation.createdAt).toLocaleDateString()}</span>
                            <span>Expires: {new Date(invitation.expiresAt).toLocaleDateString()}</span>
                          </div>
                          
                          {invitation.message && (
                            <p className="text-sm text-gray-600 mt-2 italic">"{invitation.message}"</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {invitation.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopyInviteLink(invitation.inviteLink)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => resendInvitationMutation.mutate(invitation._id)}
                                disabled={resendInvitationMutation.isPending}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          
                          {invitation.status === 'pending' && invitation.studentId && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => setInvitationToUpdate({ id: invitation._id, action: 'accept' })}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setInvitationToUpdate({ id: invitation._id, action: 'reject' })}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Invitations Pagination */}
              {invitationsPagination && invitationsPagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Showing {((invitationsPagination.currentPage - 1) * invitationsPagination.limit) + 1} to{' '}
                    {Math.min(invitationsPagination.currentPage * invitationsPagination.limit, invitationsPagination.totalCount)} of{' '}
                    {invitationsPagination.totalCount} requests
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInvitationPage(invitationsPagination.currentPage - 1)}
                      disabled={!invitationsPagination.hasPrevPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="text-sm">
                      {invitationsPagination.currentPage} of {invitationsPagination.totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInvitationPage(invitationsPagination.currentPage + 1)}
                      disabled={!invitationsPagination.hasNextPage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Remove Student Confirmation */}
        <AlertDialog open={!!studentToRemove} onOpenChange={() => setStudentToRemove(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Student</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this student from your class? 
                They will lose access to all your tests and materials.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemoveStudent}
                className="bg-red-600 hover:bg-red-700"
                disabled={removeStudentMutation.isPending}
              >
                {removeStudentMutation.isPending ? "Removing..." : "Remove Student"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Update Invitation Status Dialog */}
        <AlertDialog open={!!invitationToUpdate} onOpenChange={() => setInvitationToUpdate(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {invitationToUpdate?.action === 'accept' ? 'Approve' : 'Reject'} Student Request
              </AlertDialogTitle>
              <AlertDialogDescription>
                {invitationToUpdate?.action === 'accept' 
                  ? 'Are you sure you want to approve this student to join your class?'
                  : 'Are you sure you want to reject this student request?'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            {invitationToUpdate?.action === 'reject' && (
              <div className="py-4">
                <Label htmlFor="reason">Reason for rejection (optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  maxLength={500}
                />
              </div>
            )}
            
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRejectionReason("")}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleUpdateInvitation}
                className={invitationToUpdate?.action === 'accept' 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
                }
                disabled={updateInvitationMutation.isPending}
              >
                {updateInvitationMutation.isPending 
                  ? (invitationToUpdate?.action === 'accept' ? "Approving..." : "Rejecting...")
                  : (invitationToUpdate?.action === 'accept' ? "Approve Student" : "Reject Request")
                }
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Student Details Dialog */}
        <Dialog open={showStudentDetailsDialog} onOpenChange={setShowStudentDetailsDialog}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>
                Detailed information about the student
              </DialogDescription>
            </DialogHeader>
            
            {selectedStudent && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedStudent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=3b82f6&color=fff`}
                    alt={selectedStudent.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                      <Badge className={getStatusColor(selectedStudent.isActive ? 'active' : 'inactive')}>
                        {selectedStudent.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedStudent.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Joined on {new Date(selectedStudent.joinedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      {selectedStudent.lastTestDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Last test: {new Date(selectedStudent.lastTestDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">Tests Completed</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{selectedStudent.testsCompleted}</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Average Score</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">{selectedStudent.averageScore}%</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-600">Best Score</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{selectedStudent.bestScore}%</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-600">🪙</span>
                      <span className="text-sm font-medium text-yellow-600">Coins</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">{selectedStudent.coins}</div>
                  </div>
                </div>

                {/* Subject Performance */}
                {selectedStudent.performance && Object.keys(selectedStudent.performance).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Subject Performance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(selectedStudent.performance).map(([subject, score]) => (
                        <div key={subject} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{subject}</span>
                            <span className="text-sm font-bold">{score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Streak */}
                {selectedStudent.currentStreak > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">🔥</span>
                      <span className="font-medium text-orange-900">
                        Current Streak: {selectedStudent.currentStreak} days
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Send Mail Dialog */}
        <Dialog open={showSendMailDialog} onOpenChange={setShowSendMailDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Message</DialogTitle>
              <DialogDescription>
                Send a message to {selectedStudent?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="mailSubject">Subject</Label>
                <Input
                  id="mailSubject"
                  placeholder="Enter message subject..."
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {mailSubject.length}/200 characters
                </p>
              </div>
              <div>
                <Label htmlFor="mailMessage">Message</Label>
                <Textarea
                  id="mailMessage"
                  placeholder="Type your message here..."
                  value={mailMessage}
                  onChange={(e) => setMailMessage(e.target.value)}
                  maxLength={2000}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {mailMessage.length}/2000 characters
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSendMailDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendMailSubmit}
                disabled={!mailSubject.trim() || !mailMessage.trim() || sendMailMutation.isPending}
              >
                <Mail className="h-4 w-4 mr-2" />
                {sendMailMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  Manage your enrolled students and track their progress
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearStudentFilters}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students by name or email..."
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setStudentPage(1); // Reset to first page when searching
                  }}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={studentStatus} onValueChange={(value) => {
                  setStudentStatus(value);
                  setStudentPage(1);
                }}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={`${studentLimit}`} onValueChange={(value) => {
                  setStudentLimit(parseInt(value));
                  setStudentPage(1);
                }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Students List */}
            {studentsLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse border rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : studentsError ? (
              <div className="text-center py-8">
                <XCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Students</h3>
                <p className="text-gray-600 mb-4">
                  {studentsError?.message || "Failed to load students. Please try again."}
                </p>
                <Button onClick={() => window.location.reload()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-600 mb-4">
                  {studentSearch || studentStatus !== "all" 
                    ? "No students match your current filters."
                    : "Generate an invite code to start adding students to your class."}
                </p>
                {(!studentSearch && studentStatus === "all") && (
                  <Button onClick={() => setShowInviteDialog(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Generate Invite
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Sort Controls */}
                <div className="flex items-center gap-2 pb-2 border-b">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("name", "students")}
                    className="flex items-center gap-1"
                  >
                    Name
                    {studentSortBy === "name" && (
                      studentSortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("email", "students")}
                    className="flex items-center gap-1"
                  >
                    Email
                    {studentSortBy === "email" && (
                      studentSortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("joinedAt", "students")}
                    className="flex items-center gap-1"
                  >
                    Joined Date
                    {studentSortBy === "joinedAt" && (
                      studentSortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("testsCompleted", "students")}
                    className="flex items-center gap-1"
                  >
                    Tests
                    {studentSortBy === "testsCompleted" && (
                      studentSortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("averageScore", "students")}
                    className="flex items-center gap-1"
                  >
                    Avg Score
                    {studentSortBy === "averageScore" && (
                      studentSortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </Button>
                </div>

                {/* Students Cards */}
                {students.map((student) => (
                  <div key={student._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="relative">
                          <img
                            src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=3b82f6&color=fff`}
                            alt={student.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                            student.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">{student.name}</h3>
                            <Badge className={getStatusColor(student.isActive ? 'active' : 'inactive')}>
                              {student.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {new Date(student.joinedAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-blue-500" />
                              <span className="font-medium">{student.testsCompleted}</span>
                              <span className="text-gray-500">tests</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-3 w-3 text-green-500" />
                              <span className="font-medium">{student.averageScore}%</span>
                              <span className="text-gray-500">avg</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-purple-500" />
                              <span className="font-medium">{student.bestScore}%</span>
                              <span className="text-gray-500">best</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">🪙</span>
                              <span className="font-medium">{student.coins}</span>
                              <span className="text-gray-500">coins</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewStudentDetails(student)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendMail(student)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setStudentToRemove(student._id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Students Pagination */}
            {studentsPagination && studentsPagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="text-sm text-gray-600">
                  Showing {((studentsPagination.currentPage - 1) * studentsPagination.limit) + 1} to{' '}
                  {Math.min(studentsPagination.currentPage * studentsPagination.limit, studentsPagination.totalCount)} of{' '}
                  {studentsPagination.totalCount} students
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStudentPage(studentsPagination.currentPage - 1)}
                    disabled={!studentsPagination.hasPrevPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm">
                    {studentsPagination.currentPage} of {studentsPagination.totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStudentPage(studentsPagination.currentPage + 1)}
                    disabled={!studentsPagination.hasNextPage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TutorLayout>
  );
};

export default StudentManagement;
