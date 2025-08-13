import ProfileSetup from "@/components/ProfileSetup";
import { useAuthStore } from "@/stores/authStore";
import { Link, Navigate, Outlet } from "react-router-dom";

const StudentGuard = () => {
  const { user, loading } = useAuthStore((state) => state);

  if (user.role !== 'student') {
    return <Navigate to="/" replace={true} />;
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
  return <Outlet />;
};

export default StudentGuard;
