import React, { useEffect } from "react";
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
import {
  UserCheck,
  Calendar,
  School,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/stores/authStore";
import { useJoinInvitationData, useJoinTutor } from "@/hooks/useStudentManagement";
import { useToast } from "@/hooks/use-toast";

const JoinTutor = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuthStore();

  const { data: invitationData, isLoading, error } = useJoinInvitationData(inviteCode!);
  const joinTutorMutation = useJoinTutor();

  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/join/${inviteCode}`);
    }
  }, [user, authLoading, navigate, inviteCode]);

  const handleJoinTutor = async () => {
    if (!user) {
      navigate(`/login?redirect=/join/${inviteCode}`);
      return;
    }

    if (user.role !== 'student') {
      toast({
        title: "Access Denied",
        description: "Only students can join tutors using invite codes.",
        variant: "destructive",
      });
      return;
    }

    try {
      await joinTutorMutation.mutateAsync(inviteCode!);
      navigate('/dashboard');
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !invitationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <XCircle className="mx-auto h-16 w-16 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Invalid Invite Code</h2>
                  <p className="text-gray-600 mb-6">
                    This invite code is invalid, expired, or has already been used.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button onClick={() => navigate('/')} className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go to Homepage
                  </Button>
                  {user && (
                    <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
                      Go to Dashboard
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isExpired = new Date(invitationData.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Join Tutor's Class</CardTitle>
              <CardDescription className="text-lg">
                You've been invited to join a tutor's class
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Tutor Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  Tutor Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tutor Name:</span>
                    <span className="font-medium">{invitationData.tutorName}</span>
                  </div>
                  
                  {invitationData.instituteName && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Institution:</span>
                      <span className="font-medium flex items-center">
                        <School className="mr-1 h-4 w-4" />
                        {invitationData.instituteName}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Invite Expires:</span>
                    <span className={`font-medium flex items-center ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                      <Clock className="mr-1 h-4 w-4" />
                      {new Date(invitationData.expiresAt).toLocaleDateString()}
                      {isExpired && (
                        <Badge variant="destructive" className="ml-2">
                          Expired
                        </Badge>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              {invitationData.message && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Welcome Message:</h4>
                  <p className="text-blue-800 italic">"{invitationData.message}"</p>
                </div>
              )}

              <Separator />

              {/* Benefits */}
              <div>
                <h3 className="font-semibold text-lg mb-4">What you'll get:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Access to Tests</p>
                      <p className="text-sm text-gray-600">Take tests created by your tutor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Performance Tracking</p>
                      <p className="text-sm text-gray-600">Monitor your progress and scores</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Personalized Feedback</p>
                      <p className="text-sm text-gray-600">Get insights from your tutor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Study Materials</p>
                      <p className="text-sm text-gray-600">Access exclusive content</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-4">
                {!user ? (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">You need to be logged in to join this tutor's class.</p>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => navigate(`/login?redirect=/join/${inviteCode}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Login to Join
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/signup?redirect=/join/${inviteCode}`)}
                        className="w-full"
                      >
                        Create Account & Join
                      </Button>
                    </div>
                  </div>
                ) : user.role !== 'student' ? (
                  <div className="text-center space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800">
                        Only students can join tutors using invite codes. 
                        You are currently logged in as a {user.role}.
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
                      Go to Dashboard
                    </Button>
                  </div>
                ) : isExpired ? (
                  <div className="text-center space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">
                        This invitation has expired. Please contact your tutor for a new invite code.
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
                      Go to Dashboard
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={handleJoinTutor}
                      disabled={joinTutorMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                    >
                      {joinTutorMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Joining...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Join {invitationData.tutorName}'s Class
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                      className="w-full"
                    >
                      Maybe Later
                    </Button>
                  </div>
                )}
              </div>

              {/* Help Text */}
              <div className="text-center text-sm text-gray-500">
                <p>
                  Need help? <Link to="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JoinTutor;
