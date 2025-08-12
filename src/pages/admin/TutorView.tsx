import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Mail,
  Phone,
  Star,
  Users,
  BookOpen,
  Calendar,
  Shield,
  Award,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Loader2,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useTutor } from "@/hooks/useTutors";

const TutorView = () => {
  const { tutorId } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();
  
  const { data: tutor, isLoading, error } = useTutor(tutorId || "");

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium">Loading Tutor Details</h3>
            <p className="text-muted-foreground">Please wait while we load the tutor information...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !tutor) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-600">Error Loading Tutor</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "Failed to load tutor details."}
            </p>
            <div className="space-x-2">
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
              <Link to="/admin/tutors">
                <Button variant="default">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tutors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "inactive":
        return <XCircle className="h-4 w-4" />;
      case "suspended":
        return <AlertCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/tutors">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tutors
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{tutor.name}</h1>
              <p className="text-muted-foreground">Tutor Profile & Performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/admin/tutors/edit/${tutorId}`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Tutor
              </Button>
            </Link>
          </div>
        </div>

        {/* Tutor Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={tutor.profilePicture} alt={tutor.name} />
                  <AvatarFallback className="text-xl">
                    {tutor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {tutor.isVerified && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{tutor.name}</h2>
                  <Badge className={getStatusColor(tutor.status)}>
                    {getStatusIcon(tutor.status)}
                    <span className="ml-1 capitalize">{tutor.status}</span>
                  </Badge>
                  {tutor.isVerified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Shield className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {tutor.email}
                  </div>
                  {tutor.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {tutor.phone}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {getRatingStars(tutor.rating)}
                    <span className="ml-1 font-medium">{tutor.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({tutor.averageRating} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Joined {formatDate(tutor.joinDate)}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{tutor.totalStudents}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{tutor.testsCreated}</div>
                <div className="text-sm text-gray-600">Tests Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{tutor.experience}</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {tutor.performance?.averageStudentScore?.toFixed(1) || 'N/A'}%
                </div>
                <div className="text-sm text-gray-600">Avg Student Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Full Name:</span>
                    <span className="font-medium">{tutor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{tutor.email}</span>
                  </div>
                  {tutor.phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{tutor.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="font-medium">{tutor.experience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Qualification:</span>
                    <span className="font-medium">{tutor.qualification}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(tutor.status)}>
                      {getStatusIcon(tutor.status)}
                      <span className="ml-1 capitalize">{tutor.status}</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Teaching Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-muted-foreground">Specializations:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tutor.specialization?.map((spec, index) => (
                        <Badge key={index} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Subjects:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tutor.subjects?.map((subject, index) => (
                        <Badge key={index} variant="outline">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Exam Types:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tutor.examTypes?.map((exam, index) => (
                        <Badge key={index} variant="outline">
                          {exam}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {tutor.availability && (
                    <div>
                      <span className="text-muted-foreground">Available Days:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tutor.availability.days?.map((day, index) => (
                          <Badge key={index} variant="secondary">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {tutor.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{tutor.bio}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Student Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Students Enrolled:</span>
                      <span className="font-bold text-2xl text-blue-600">
                        {tutor.performance?.studentsEnrolled || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Score:</span>
                      <span className="font-bold text-2xl text-green-600">
                        {tutor.performance?.averageStudentScore?.toFixed(1) || 'N/A'}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completion Rate:</span>
                      <span className="font-bold text-2xl text-purple-600">
                        {tutor.performance?.completionRate?.toFixed(1) || 'N/A'}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Rating & Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-500 mb-2">
                        {tutor.rating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {getRatingStars(tutor.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on {tutor.averageRating} reviews
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Satisfaction:</span>
                      <span className="font-bold text-2xl text-green-600">
                        {tutor.performance?.studentSatisfaction?.toFixed(1) || 'N/A'}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Content Creation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tests Created:</span>
                      <span className="font-bold text-2xl text-blue-600">
                        {tutor.testsCreated}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Tests:</span>
                      <span className="font-bold text-2xl text-purple-600">
                        {tutor.totalTests}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Active:</span>
                      <span className="font-medium">
                        {formatDate(tutor.lastActive)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Total Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(tutor.earnings?.totalEarnings || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Lifetime earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Monthly Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatCurrency(tutor.earnings?.monthlyEarnings || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Current month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {formatCurrency(tutor.earnings?.pendingPayments || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Awaiting payment</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Documents</CardTitle>
                <CardDescription>
                  Documents submitted by the tutor for verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tutor.documents?.resume && (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Resume</p>
                          <p className="text-sm text-muted-foreground">Professional resume</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Document
                      </Button>
                    </div>
                  )}

                  {tutor.documents?.idProof && (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">ID Proof</p>
                          <p className="text-sm text-muted-foreground">Government issued ID</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Document
                      </Button>
                    </div>
                  )}

                  {tutor.documents?.certificates && tutor.documents.certificates.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Certificates</h4>
                      {tutor.documents.certificates.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Award className="h-5 w-5 text-purple-500" />
                            <div>
                              <p className="font-medium">Certificate {index + 1}</p>
                              <p className="text-sm text-muted-foreground">Educational certificate</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Certificate
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {!tutor.documents?.resume && !tutor.documents?.idProof && 
                   (!tutor.documents?.certificates || tutor.documents.certificates.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Award className="mx-auto h-12 w-12 mb-4" />
                      <p>No documents uploaded yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TutorView;
