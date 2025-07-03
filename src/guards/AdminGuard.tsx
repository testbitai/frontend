import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

const AdminGuard = () => {
  const { user } = useAuthStore((state) => state);

  if (user.role !== 'admin') {
    return <Navigate to="/" replace={true} />;
  }
  return <Outlet />;
};

export default AdminGuard;
