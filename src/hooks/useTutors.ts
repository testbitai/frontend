import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

export interface Tutor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  role: 'tutor';
  specialization: string[];
  experience: number; // years
  qualification: string;
  bio?: string;
  rating: number;
  totalStudents: number;
  totalTests: number;
  testsCreated: number;
  averageRating: number;
  joinDate: string;
  lastActive: string;
  isVerified: boolean;
  documents?: {
    resume?: string;
    certificates?: string[];
    idProof?: string;
  };
  subjects: string[];
  examTypes: string[];
  availability: {
    days: string[];
    timeSlots: string[];
  };
  performance: {
    studentsEnrolled: number;
    averageStudentScore: number;
    completionRate: number;
    studentSatisfaction: number;
  };
  earnings: {
    totalEarnings: number;
    monthlyEarnings: number;
    pendingPayments: number;
  };
}

export interface TutorStats {
  totalTutors: number;
  activeTutors: number;
  pendingApprovals: number;
  suspendedTutors: number;
  averageRating: number;
  totalStudentsEnrolled: number;
  totalTestsCreated: number;
  monthlyGrowth: number;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TutorsResponse {
  tutors: Tutor[];
  pagination: PaginationData;
  stats: TutorStats;
  filters: {
    search: string;
    status: string;
    specialization: string;
    experience: string;
    rating: string;
    sortBy: string;
    sortOrder: string;
    isVerified: string;
  };
}

export interface TutorsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  specialization?: string;
  experience?: string;
  rating?: string;
  sortBy?: string;
  sortOrder?: string;
  isVerified?: string;
}

// Query key factory for better cache management
export const tutorsKeys = {
  all: ['tutors'] as const,
  lists: () => [...tutorsKeys.all, 'list'] as const,
  list: (params: TutorsQueryParams) => [...tutorsKeys.lists(), params] as const,
  details: () => [...tutorsKeys.all, 'detail'] as const,
  detail: (id: string) => [...tutorsKeys.details(), id] as const,
  stats: () => [...tutorsKeys.all, 'stats'] as const,
};

// Helper function to clean and normalize query parameters
const normalizeParams = (params: TutorsQueryParams): TutorsQueryParams => {
  const normalized: TutorsQueryParams = {};
  
  // Only include non-default, non-empty values
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      // Special handling for numeric values
      if (key === 'page' || key === 'limit') {
        const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numValue) && numValue > 0) {
          normalized[key as keyof TutorsQueryParams] = numValue;
        }
      } else {
        normalized[key as keyof TutorsQueryParams] = value;
      }
    }
  });
  
  // Ensure we always have page and limit
  if (!normalized.page) normalized.page = 1;
  if (!normalized.limit) normalized.limit = 12;
  
  return normalized;
};

// Custom hook for fetching tutors with caching
export const useTutors = (params: TutorsQueryParams = {}) => {
  const normalizedParams = normalizeParams(params);
  
  return useQuery({
    queryKey: tutorsKeys.list(normalizedParams),
    queryFn: async (): Promise<TutorsResponse> => {
      const searchParams = new URLSearchParams();
      
      // Add all parameters to the URL
      Object.entries(normalizedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const { data } = await apiClient.get(`/admin/tutors?${searchParams.toString()}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: true,
  });
};

// Custom hook for tutor statistics
export const useTutorStats = () => {
  return useQuery({
    queryKey: tutorsKeys.stats(),
    queryFn: async (): Promise<TutorStats> => {
      const { data } = await apiClient.get('/admin/tutors/stats');
      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

// Custom hook for fetching a single tutor
export const useTutor = (tutorId: string) => {
  return useQuery({
    queryKey: tutorsKeys.detail(tutorId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/tutors/${tutorId}`);
      return data.data;
    },
    enabled: !!tutorId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Custom hook for updating tutor status
export const useUpdateTutorStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tutorId, status }: { tutorId: string; status: string }) => {
      const { data } = await apiClient.patch(`/admin/tutors/${tutorId}/status`, { status });
      return data;
    },
    onSuccess: (_, { tutorId, status }) => {
      // Invalidate and refetch all tutor queries
      queryClient.invalidateQueries({ queryKey: tutorsKeys.all });
      
      const statusMessages = {
        active: "Tutor has been activated successfully.",
        inactive: "Tutor has been deactivated.",
        suspended: "Tutor has been suspended.",
        pending: "Tutor status set to pending review.",
      };
      
      toast({
        title: "Status Updated",
        description: statusMessages[status as keyof typeof statusMessages] || "Tutor status updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update tutor status.",
        variant: "destructive",
      });
    },
  });
};

// Custom hook for verifying tutor
export const useVerifyTutor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tutorId, isVerified }: { tutorId: string; isVerified: boolean }) => {
      const { data } = await apiClient.patch(`/admin/tutors/${tutorId}/verify`, { isVerified });
      return data;
    },
    onSuccess: (_, { isVerified }) => {
      queryClient.invalidateQueries({ queryKey: tutorsKeys.all });
      
      toast({
        title: isVerified ? "Tutor Verified" : "Verification Removed",
        description: isVerified 
          ? "Tutor has been verified successfully." 
          : "Tutor verification has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update verification status.",
        variant: "destructive",
      });
    },
  });
};

// Custom hook for deleting tutor
export const useDeleteTutor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tutorId: string) => {
      const { data } = await apiClient.delete(`/admin/tutors/${tutorId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tutorsKeys.all });
      
      toast({
        title: "Tutor Deleted",
        description: "Tutor account has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete tutor.",
        variant: "destructive",
      });
    },
  });
};

// Custom hook for sending notification to tutors
export const useSendTutorNotification = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tutorIds, message, subject }: { 
      tutorIds: string[]; 
      message: string; 
      subject: string; 
    }) => {
      const { data } = await apiClient.post('/admin/tutors/notify', {
        tutorIds,
        message,
        subject,
      });
      return data;
    },
    onSuccess: (_, { tutorIds }) => {
      toast({
        title: "Notification Sent",
        description: `Notification sent to ${tutorIds.length} tutor(s) successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to send notification.",
        variant: "destructive",
      });
    },
  });
};

// Utility function to prefetch tutors
export const usePrefetchTutors = () => {
  const queryClient = useQueryClient();

  return (params: TutorsQueryParams) => {
    const normalizedParams = normalizeParams(params);
    
    queryClient.prefetchQuery({
      queryKey: tutorsKeys.list(normalizedParams),
      queryFn: async (): Promise<TutorsResponse> => {
        const searchParams = new URLSearchParams();
        
        Object.entries(normalizedParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });

        const { data } = await apiClient.get(`/admin/tutors?${searchParams.toString()}`);
        return data.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
};
