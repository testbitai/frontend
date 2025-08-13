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



  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthGuard;
