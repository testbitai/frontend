import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

const StudentGuard = () => {
  const { user, loading } = useAuthStore((state) => state);

  if (user.role !== 'student') {
    return <Navigate to="/" replace={true} />;
  }
  return <Outlet />;
};

export default StudentGuard;
