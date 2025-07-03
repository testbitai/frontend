import Header from "@/components/Header";
import ProfileSetup from "@/components/ProfileSetup";
import { Button } from "@/components/ui/button";
import VerificationCard from "@/components/VerificationCard";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
  const { user, loading } = useAuthStore((state) => state);
  const { toast } = useToast();

  const [resendStatus, setResendStatus] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  async function handleResend() {
    setResendLoading(true);
    try {
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || `Something went wrong`,
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const currentPath = window.location.pathname + window.location.search;
  if (!user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(currentPath)}`}
        replace={true}
      />
    );
  }

  if (!user.isEmailVerified) {
    return <VerificationCard />;
  }

  if (!user.examGoals.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div>
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Home
            </Link>
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Complete Your Profile
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Set up your profile to start your exam journey with TestBit
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <ProfileSetup />
        </div>
      </div>
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthGuard;
