import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Plus, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";
import TutorLayout from "@/components/layouts/TutorLayout";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import tutorApi, { TutorDashboardData } from "@/services/tutorApi";

const TutorDashboard = () => {
  const { user } = useAuthStore((state) => state);
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<TutorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await tutorApi.getDashboard();
      setDashboardData(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = () => {
    if (!user?.tutorDetails) return { status: 'pending', color: 'yellow', icon: Clock };
    
    if (user.tutorDetails.isVerified) {
      return { status: 'verified', color: 'green', icon: CheckCircle };
    } else {
      return { status: 'pending', color: 'yellow', icon: Clock };
    }
  };

  const getSubscriptionStatus = () => {
    if (!user?.tutorDetails) return { status: 'pending', color: 'yellow' };
    
    const status = user.tutorDetails.subscriptionStatus;
    switch (status) {
      case 'active':
        return { status: 'Active', color: 'green' };
      case 'inactive':
        return { status: 'Inactive', color: 'red' };
      case 'cancelled':
        return { status: 'Cancelled', color: 'red' };
      default:
        return { status: 'Pending', color: 'yellow' };
    }
  };

  const verification = getVerificationStatus();
  const subscription = getSubscriptionStatus();

  const stats = [
    {
      title: "Total Students",
      value: user?.tutorDetails?.totalStudents?.toString() || "0",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Tests Created",
      value: user?.tutorDetails?.totalTests?.toString() || "0",
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      title: "Rating",
      value: user?.tutorDetails?.rating?.toFixed(1) || "0.0",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      title: "Plan Type",
      value: user?.tutorDetails?.planType?.toUpperCase() || "STARTER",
      icon: CreditCard,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <TutorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </TutorLayout>
    );
  }

  return (
    <TutorLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground">
              {user?.tutorDetails?.instituteName || "Your Teaching Dashboard"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={verification.color === 'green' ? 'default' : 'secondary'}
              className={`${
                verification.color === 'green' ? 'bg-green-100 text-green-800' : 
                verification.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}
            >
              <verification.icon className="h-3 w-3 mr-1" />
              {verification.status === 'verified' ? 'Verified' : 'Pending Verification'}
            </Badge>
            <Badge 
              variant={subscription.color === 'green' ? 'default' : 'secondary'}
              className={`${
                subscription.color === 'green' ? 'bg-green-100 text-green-800' : 
                subscription.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}
            >
              {subscription.status}
            </Badge>
          </div>
        </div>

        {/* Verification Alert */}
        {/* {!user?.tutorDetails?.isVerified && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Account Under Review</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Your tutor account is currently being reviewed by our admin team. 
              You'll receive an email notification once your account is verified. 
              This process typically takes 1-2 business days.
            </AlertDescription>
          </Alert>
        )} */}

        {/* Subscription Alert */}
        {user?.tutorDetails?.subscriptionStatus === 'pending' && (
          <Alert className="border-blue-200 bg-blue-50">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Complete Payment</AlertTitle>
            <AlertDescription className="text-blue-700">
              Your {user.tutorDetails.planType?.toUpperCase()} plan subscription is pending payment. 
              Please complete the payment to activate all features.
              <Button variant="link" className="p-0 h-auto ml-2 text-blue-600">
                Complete Payment
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user?.email}</span>
                {user?.isEmailVerified && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              
              {user?.tutorDetails?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.tutorDetails.phone}</span>
                </div>
              )}
              
              {user?.tutorDetails?.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {user.tutorDetails.address.city}, {user.tutorDetails.address.state}
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Joined {new Date(user?.createdAt || '').toLocaleDateString()}
                </span>
              </div>

              <div className="pt-2">
                <h4 className="font-medium mb-2">Teaching Subjects:</h4>
                <div className="flex flex-wrap gap-1">
                  {user?.tutorDetails?.subjects?.map((subject) => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Exam Focus:</h4>
                <div className="flex flex-wrap gap-1">
                  {user?.tutorDetails?.examFocus?.map((exam) => (
                    <Badge key={exam} variant="outline" className="text-xs">
                      {exam}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with your teaching journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link to="/tutor/tests/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Test
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/tutor/students">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Students
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/tutor/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/tutor/tests">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Test Management
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Details */}
        {user?.tutorDetails?.subscriptionStatus === 'active' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan Type</p>
                  <p className="font-medium">{user.tutorDetails.planType?.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expires On</p>
                  <p className="font-medium">
                    {user.tutorDetails.subscriptionEndDate 
                      ? new Date(user.tutorDetails.subscriptionEndDate).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bio Section */}
        {user?.tutorDetails?.bio && (
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {user.tutorDetails.bio}
              </p>
              <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Experience: {user.tutorDetails.experience} years</span>
                <span>•</span>
                <span>Qualifications: {user.tutorDetails.qualifications}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TutorLayout>
  );
};

export default TutorDashboard;
