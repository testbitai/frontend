import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import TestSeries from "./pages/TestSeries";
import TestDetail from "./pages/TestDetail";
import TestResults from "./pages/TestResults";
import Rewards from "./pages/Rewards";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import TutorSignup from "./pages/tutor/TutorSignup";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import TutorTestManagement from "./pages/tutor/TutorTestManagement";
import StudentManagement from "./pages/tutor/StudentManagement";
import TutorAnalytics from "./pages/tutor/TutorAnalytics";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TestManagement from "./pages/admin/TestManagement";
import Analytics from "./pages/admin/Analytics";
import RewardManagement from "./pages/admin/RewardManagement";
import EventManagement from "./pages/admin/EventManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import SupportManagement from "./pages/admin/SupportManagement";
import { useAuthStore } from "./stores/authStore";
import apiClient from "./lib/apiClient";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";
import VerifyEmail from "./pages/VerifyEmail";
import TutorSupportManagement from "./pages/tutor/TutorSupportManagement";
import AdminStudentManagement from "./pages/admin/AdminStudentManagement";
import TutorManagement from "./pages/admin/TutorManagement";
import CreateTutorTest from "./pages/tutor/CreateTutorTest";
import CreateTest from "./pages/admin/CreateTest";
import StudentGuard from "./guards/StudentGuard";
import TutorGuard from "./guards/TutorGuard";
import AdminGuard from "./guards/AdminGuard";
import SupportTickets from "./pages/SupportTickets";
import ContactManagement from "./pages/admin/ContactManagement";

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setLoading = useAuthStore((state) => state.setLoading);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/user/me");
      const user = res.data.data;
      useAuthStore.setState({ user });

      return user;
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (refreshToken) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="" element={<GuestGuard />}>
                  <Route path="/login" element={<Login />} />
                </Route>
                <Route path="/signup" element={<SignUp />} />

                <Route path="" element={<AuthGuard />}>
                  <Route path="" element={<StudentGuard />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/support" element={<SupportTickets />} />
                    <Route path="/tests" element={<TestSeries />} />
                    <Route path="/tests/:id" element={<TestDetail />} />
                    <Route
                      path="/tests/:id/results"
                      element={<TestResults />}
                    />
                  </Route>

                  <Route path="" element={<TutorGuard />}>
                    <Route
                      path="/tutor/dashboard"
                      element={<TutorDashboard />}
                    />
                    <Route
                      path="/tutor/tests"
                      element={<TutorTestManagement />}
                    />
                    <Route
                      path="/tutor/tests/create"
                      element={<CreateTutorTest />}
                    />
                    <Route
                      path="/tutor/students"
                      element={<StudentManagement />}
                    />
                    <Route
                      path="/tutor/analytics"
                      element={<TutorAnalytics />}
                    />
                    <Route
                      path="/tutor/support"
                      element={<TutorSupportManagement />}
                    />
                  </Route>

                  <Route path="" element={<AdminGuard />}>
                    <Route
                      path="/admin/dashboard"
                      element={<AdminDashboard />}
                    />
                    <Route path="/admin/tests" element={<TestManagement />} />
                    <Route
                      path="/admin/tests/create"
                      element={<CreateTest />}
                    />
                    <Route path="/admin/tutors" element={<TutorManagement />} />
                    <Route
                      path="/admin/students"
                      element={<AdminStudentManagement />}
                    />
                    <Route path="/admin/analytics" element={<Analytics />} />
                    <Route
                      path="/admin/rewards"
                      element={<RewardManagement />}
                    />
                    <Route path="/admin/events" element={<EventManagement />} />
                    <Route
                      path="/admin/content"
                      element={<ContentManagement />}
                    />
                    <Route
                      path="/admin/contact"
                      element={<ContactManagement />}
                    />
                    <Route
                      path="/admin/support"
                      element={<SupportManagement />}
                    />
                  </Route>
                </Route>

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Tutor */}
                <Route path="/tutor/signup" element={<TutorSignup />} />

                {/* Admin */}
                {/* <Route path="/admin/login" element={<AdminLogin />} /> */}

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
