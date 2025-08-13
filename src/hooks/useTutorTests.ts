import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

export interface TutorTest {
  _id: string;
  title: string;
  description: string;
  type: string;
  examType: string;
  numberOfQuestions: number;
  overallDifficulty: string;
  duration: number;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
  createdByRole: string;
  subjectCount: Record<string, number>;
  difficultyCount: Record<string, number>;
  isPublished: boolean;
  allowedStudents: string[];
  sections: Array<{
    subject: string;
    questions: Array<{
      questionText: string;
      options: string[];
      correctAnswer: string;
      explanation?: string;
      difficulty: string;
    }>;
  }>;
}

export interface TutorTestsResponse {
  tests: TutorTest[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    search: string;
    type: string;
    examType: string;
    subject: string;
    difficulty: string;
    sortBy: string;
    sortOrder: string;
  };
}

export interface TutorTestsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  examType?: string;
  subject?: string;
  difficulty?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface TutorTestStats {
  totalTests: number;
  activeTests: number;
  totalAttempts: number;
  averageScore: number;
  recentTests: Array<{
    _id: string;
    title: string;
    attempts: number;
    averageScore: number;
    createdAt: string;
  }>;
}

// Query key factory for better cache management
export const tutorTestsKeys = {
  all: ['tutor-tests'] as const,
  lists: () => [...tutorTestsKeys.all, 'list'] as const,
  list: (params: TutorTestsQueryParams) => [...tutorTestsKeys.lists(), params] as const,
  details: () => [...tutorTestsKeys.all, 'detail'] as const,
  detail: (id: string) => [...tutorTestsKeys.details(), id] as const,
  stats: () => [...tutorTestsKeys.all, 'stats'] as const,
};

// Helper function to clean and normalize query parameters
const normalizeParams = (params: TutorTestsQueryParams): TutorTestsQueryParams => {
  const normalized: TutorTestsQueryParams = {};
  
  // Only include non-default, non-empty values
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      // Special handling for numeric values
      if (key === 'page' || key === 'limit') {
        const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numValue) && numValue > 0) {
          normalized[key as keyof TutorTestsQueryParams] = numValue;
        }
      } else {
        normalized[key as keyof TutorTestsQueryParams] = value;
      }
    }
  });
  
  // Ensure we always have page and limit
  if (!normalized.page) normalized.page = 1;
  if (!normalized.limit) normalized.limit = 12;
  
  return normalized;
};

// Custom hook for fetching tutor tests with caching
export const useTutorTests = (params: TutorTestsQueryParams = {}) => {
  const normalizedParams = normalizeParams(params);
  
  return useQuery({
    queryKey: tutorTestsKeys.list(normalizedParams),
    queryFn: async (): Promise<TutorTestsResponse> => {
      const searchParams = new URLSearchParams();
      
      // Add all parameters to the URL
      Object.entries(normalizedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const { data } = await apiClient.get(`/test?${searchParams.toString()}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: true,
  });
};

// Custom hook for fetching tutor test statistics
export const useTutorTestStats = () => {
  return useQuery({
    queryKey: tutorTestsKeys.stats(),
    queryFn: async (): Promise<TutorTestStats> => {
      const { data } = await apiClient.get('/tutor/dashboard/stats');
      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Custom hook for deleting a tutor test
export const useDeleteTutorTest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (testId: string) => {
      const { data } = await apiClient.delete(`/test/${testId}`);
      return data;
    },
    onSuccess: (_, testId) => {
      // Invalidate and refetch all tutor test queries
      queryClient.invalidateQueries({ queryKey: tutorTestsKeys.all });
      
      toast({
        title: "Test Deleted",
        description: "Test has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete test. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Custom hook for fetching a single tutor test
export const useTutorTest = (testId: string) => {
  return useQuery({
    queryKey: tutorTestsKeys.detail(testId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/test/${testId}`);
      return data.data;
    },
    enabled: !!testId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Custom hook for publishing/unpublishing a test
export const useToggleTestPublication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ testId, isPublished }: { testId: string; isPublished: boolean }) => {
      const { data } = await apiClient.patch(`/test/${testId}/publish`, { isPublished });
      return data;
    },
    onSuccess: (_, { isPublished }) => {
      queryClient.invalidateQueries({ queryKey: tutorTestsKeys.all });
      
      toast({
        title: isPublished ? "Test Published" : "Test Unpublished",
        description: `Test has been ${isPublished ? 'published' : 'unpublished'} successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update test status. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Utility function to prefetch tutor tests (useful for preloading next page)
export const usePrefetchTutorTests = () => {
  const queryClient = useQueryClient();

  return (params: TutorTestsQueryParams) => {
    const normalizedParams = normalizeParams(params);
    
    queryClient.prefetchQuery({
      queryKey: tutorTestsKeys.list(normalizedParams),
      queryFn: async (): Promise<TutorTestsResponse> => {
        const searchParams = new URLSearchParams();
        
        Object.entries(normalizedParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });

        const { data } = await apiClient.get(`/test?${searchParams.toString()}`);
        return data.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
};
