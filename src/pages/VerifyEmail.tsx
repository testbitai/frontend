import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, ArrowLeft, Home, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const status = searchParams.get("status");
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  async function verifyEmail() {
    setLoading(true);
    try {
      await apiClient.post("/auth/verify-email", { token });
      setIsEmailVerified(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (token) {
      verifyEmail().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in">
            {/* Back to Home Button */}
            <div className="mb-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  isEmailVerified
                    ? "bg-gradient-to-br from-green-500 to-emerald-600"
                    : "bg-gradient-to-br from-red-500 to-rose-600"
                }`}
              >
                {isEmailVerified ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <XCircle className="w-8 h-8 text-white" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              {isEmailVerified ? (
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Email Verified!
                  </h1>
                  <p className="text-green-600 font-medium mb-2">
                    Your email has been successfully verified
                  </p>
                  <p className="text-sm text-gray-600">
                    You can now access all features of your account
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Invalid Link
                  </h1>
                  <p className="text-red-600 font-medium mb-2">
                    This verification link is invalid or has expired
                  </p>
                  <p className="text-sm text-gray-600">
                    Please request a new verification email
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isEmailVerified ? (
                <Link
                  to="/dashboard"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/25 flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500/25 flex items-center justify-center gap-2"
                >
                  Request New Verification
                </Link>
              )}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {isEmailVerified
                  ? "Welcome to our platform!"
                  : "Need help? Contact our support team"}
              </p>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
