import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const GuestGuard = () => {
  const { user, loading } = useAuthStore((state) => state);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (user) {
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");
    return <Navigate to={redirect ? redirect : "/"} replace={true} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default GuestGuard;
