import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

export interface Test {
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
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TestsResponse {
  tests: Test[];
  pagination: PaginationData;
  filters: {
    search: string;
    type: string;
    examType: string;
    subject: string;
    difficulty: string;
    sortBy: string;
    sortOrder: string;
    createdByRole: string;
  };
}

export interface TestsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  examType?: string;
  subject?: string;
  difficulty?: string;
  sortBy?: string;
  sortOrder?: string;
  createdByRole?: string;
}

// Query key factory for better cache management
export const testsKeys = {
  all: ['tests'] as const,
  lists: () => [...testsKeys.all, 'list'] as const,
  list: (params: TestsQueryParams) => [...testsKeys.lists(), params] as const,
  details: () => [...testsKeys.all, 'detail'] as const,
  detail: (id: string) => [...testsKeys.details(), id] as const,
};

// Helper function to clean and normalize query parameters
const normalizeParams = (params: TestsQueryParams): TestsQueryParams => {
  const normalized: TestsQueryParams = {};
  
  // Only include non-default, non-empty values
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      // Special handling for numeric values
      if (key === 'page' || key === 'limit') {
        const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numValue) && numValue > 0) {
          normalized[key as keyof TestsQueryParams] = numValue;
        }
      } else {
        normalized[key as keyof TestsQueryParams] = value;
      }
    }
  });
  
  // Ensure we always have page and limit
  if (!normalized.page) normalized.page = 1;
  if (!normalized.limit) normalized.limit = 12;
  
  return normalized;
};

// Custom hook for fetching tests with caching
export const useTests = (params: TestsQueryParams = {}) => {
  const normalizedParams = normalizeParams(params);
  
  return useQuery({
    queryKey: testsKeys.list(normalizedParams),
    queryFn: async (): Promise<TestsResponse> => {
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
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
    // Enable query when we have valid parameters
    enabled: true,
  });
};

// Custom hook for deleting a test
export const useDeleteTest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (testId: string) => {
      const { data } = await apiClient.delete(`/test/${testId}`);
      return data;
    },
    onSuccess: (_, testId) => {
      // Invalidate and refetch all test queries
      queryClient.invalidateQueries({ queryKey: testsKeys.all });
      
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

// Custom hook for fetching a single test
export const useTest = (testId: string) => {
  return useQuery({
    queryKey: testsKeys.detail(testId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/test/${testId}`);
      return data.data;
    },
    enabled: !!testId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Utility function to prefetch tests (useful for preloading next page)
export const usePrefetchTests = () => {
  const queryClient = useQueryClient();

  return (params: TestsQueryParams) => {
    const normalizedParams = normalizeParams(params);
    
    queryClient.prefetchQuery({
      queryKey: testsKeys.list(normalizedParams),
      queryFn: async (): Promise<TestsResponse> => {
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
