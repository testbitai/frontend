import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

const TutorGuard = () => {
  const { user, loading } = useAuthStore((state) => state);

  if (user.role !== 'tutor') {
    return <Navigate to="/" replace={true} />;
  }
  return <Outlet />;
};

export default TutorGuard;
