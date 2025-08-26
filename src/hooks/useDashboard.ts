import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export interface DashboardStats {
  totalTests: number;
  testsCompleted: number;
  averageScore: number;
  bestScore: number;
  totalTimeTaken: number;
  streak: number;
  coins: number;
  rank: number;
  totalStudents: number;
}

export interface RecentActivity {
  _id: string;
  type: "test_completed" | "reward_earned" | "badge_unlocked" | "streak_milestone";
  title: string;
  description: string;
  score?: number;
  coins?: number;
  createdAt: string;
  testId?: string;
  rewardId?: string;
}

export interface SubjectProgress {
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  improvement: number; // percentage change from last week
}

export interface UpcomingTest {
  _id: string;
  title: string;
  description: string;
  examType: string;
  duration: number;
  scheduledFor?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questionsCount: number;
  isRecommended: boolean;
}

export interface Achievement {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: "test" | "streak" | "score" | "time" | "special";
  unlockedAt: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakHistory: Array<{
    date: string;
    testsCompleted: number;
    timeSpent: number;
  }>;
}

// Get dashboard statistics
export const useDashboardStats = () => {
  const { user } = useAuthStore();
  
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats', user?._id],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/stats");
      return response.data.data;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when user comes back
  });
};

// Get recent activities
export const useRecentActivities = (limit: number = 10) => {
  const { user } = useAuthStore();
  
  return useQuery<RecentActivity[]>({
    queryKey: ['dashboard', 'activities', user?._id, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/dashboard/activities?limit=${limit}`);
      return response.data.data;
    },
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 minute - activities change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get subject-wise progress
export const useSubjectProgress = () => {
  const { user } = useAuthStore();
  
  return useQuery<SubjectProgress[]>({
    queryKey: ['dashboard', 'subject-progress', user?._id],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/subject-progress");
      return response.data.data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get recommended/upcoming tests
export const useUpcomingTests = (limit: number = 5) => {
  const { user } = useAuthStore();
  
  return useQuery<UpcomingTest[]>({
    queryKey: ['dashboard', 'upcoming-tests', user?._id, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/dashboard/upcoming-tests?limit=${limit}`);
      return response.data.data;
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get user achievements
export const useAchievements = () => {
  const { user } = useAuthStore();
  
  return useQuery<Achievement[]>({
    queryKey: ['dashboard', 'achievements', user?._id],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/achievements");
      return response.data.data;
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get study streak information
export const useStudyStreak = () => {
  const { user } = useAuthStore();
  
  return useQuery<StudyStreak>({
    queryKey: ['dashboard', 'streak', user?._id],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/streak");
      return response.data.data;
    },
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds - streak changes daily
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });
};

// Get performance analytics for charts
export const usePerformanceAnalytics = (period: '7d' | '30d' | '90d' = '30d') => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['dashboard', 'performance', user?._id, period],
    queryFn: async () => {
      const response = await apiClient.get(`/dashboard/performance?period=${period}`);
      return response.data.data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Update study goal mutation
export const useUpdateStudyGoal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (goal: { testsPerWeek?: number; hoursPerDay?: number; targetScore?: number }) => {
      const response = await apiClient.put("/dashboard/study-goal", goal);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ 
        queryKey: ['dashboard', 'stats', user?._id] 
      });
      
      toast.success("Study goal updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update study goal");
    },
  });
};

// Mark activity as read mutation
export const useMarkActivityAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (activityId: string) => {
      const response = await apiClient.patch(`/dashboard/activities/${activityId}/read`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate activities
      queryClient.invalidateQueries({ 
        queryKey: ['dashboard', 'activities', user?._id] 
      });
    },
    onError: (error: any) => {
      console.error("Failed to mark activity as read:", error);
    },
  });
};

// Prefetch dashboard data for better UX
export const usePrefetchDashboardData = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return () => {
    if (!user) return;

    // Prefetch all dashboard data
    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'stats', user._id],
      queryFn: async () => {
        const response = await apiClient.get("/dashboard/stats");
        return response.data.data;
      },
      staleTime: 2 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'activities', user._id, 10],
      queryFn: async () => {
        const response = await apiClient.get("/dashboard/activities?limit=10");
        return response.data.data;
      },
      staleTime: 1 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'subject-progress', user._id],
      queryFn: async () => {
        const response = await apiClient.get("/dashboard/subject-progress");
        return response.data.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
};
