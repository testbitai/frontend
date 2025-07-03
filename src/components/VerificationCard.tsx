import { useState } from "react";
import { Mail, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ResendButton from "./ResendButton";
import apiClient from "@/lib/apiClient";

const VerificationCard = () => {
  const [isResent, setIsResent] = useState(false);

  const handleResend = async () => {
    setIsResent(true);
    try {
        const {data} = await apiClient.post('/auth/resend-verification-email', );
        
    } catch (error) {
      console.error("Error resending verification email:", error);
      setIsResent(false);
        
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
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
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              {isResent && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Check your email
            </h1>
            <div className="space-y-2">
              {isResent ? (
                <div className="animate-fade-in">
                  <p className="text-green-600 font-medium flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Verification email sent!
                  </p>
                  <p className="text-sm text-gray-600">
                    Please check your inbox and spam folder
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <p className="text-amber-600 font-medium flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    Verification email already sent
                  </p>
                  <p className="text-sm text-gray-600">
                    Didn't receive it? You can request a new one below
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Resend Button */}
          <ResendButton onClick={handleResend} isLoading={false} />

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Make sure to check your spam folder if you don't see the email
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCard;
