import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

export interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  isActive: boolean;
  examGoal?: 'JEE' | 'BITSAT';
  studyBuddyLevel?: string;
  coins: number;
  badges: any[];
  streak: {
    count: number;
    lastActive: Date;
  };
  joinDate: string;
  lastActive: string;
  
  // Calculated stats
  testsCompleted: number;
  testsAttempted: number;
  averageScore: number;
  currentStreak: number;
  progress: number;
  lastTest?: {
    title: string;
    score: number;
    completedAt: string;
  };
  
  // Performance metrics
  performance: {
    totalTests: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    improvementTrend: number;
  };
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  studentsWithAttempts: number;
  studentsWithoutAttempts: number;
  averageScore: number;
  monthlyGrowth: number;
  examGoalDistribution: Array<{
    _id: string;
    count: number;
  }>;
  newStudentsThisMonth: number;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface StudentsResponse {
  students: Student[];
  pagination: PaginationData;
  filters: {
    search: string;
    status: string;
    examGoal: string;
    sortBy: string;
    sortOrder: string;
    minScore?: string;
    maxScore?: string;
    hasAttempts: string;
  };
}

export interface StudentsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  examGoal?: string;
  sortBy?: string;
  sortOrder?: string;
  minScore?: number;
  maxScore?: number;
  hasAttempts?: string;
}

export interface StudentDetailResponse {
  student: Student;
  analytics: {
    totalAttempts: number;
    completedAttempts: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    subjectWisePerformance: Array<{
      subject: string;
      averageScore: number;
      totalAttempts: number;
    }>;
    monthlyProgress: Array<{
      month: string;
      averageScore: number;
      testsCompleted: number;
    }>;
    recentActivity: any[];
  };
  attempts: any[];
}

// Query key factory for better cache management
export const studentsKeys = {
  all: ['students'] as const,
  lists: () => [...studentsKeys.all, 'list'] as const,
  list: (params: StudentsQueryParams) => [...studentsKeys.lists(), params] as const,
  details: () => [...studentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentsKeys.details(), id] as const,
  stats: () => [...studentsKeys.all, 'stats'] as const,
  export: () => [...studentsKeys.all, 'export'] as const,
};

// Helper function to clean and normalize query parameters
const normalizeParams = (params: StudentsQueryParams): StudentsQueryParams => {
  const normalized: StudentsQueryParams = {};
  
  // Only include non-default, non-empty values
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      // Special handling for numeric values
      if (key === 'page' || key === 'limit' || key === 'minScore' || key === 'maxScore') {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!isNaN(numValue) && numValue >= 0) {
          normalized[key as keyof StudentsQueryParams] = numValue;
        }
      } else {
        normalized[key as keyof StudentsQueryParams] = value;
      }
    }
  });
  
  // Ensure we always have page and limit
  if (!normalized.page) normalized.page = 1;
  if (!normalized.limit) normalized.limit = 12;
  
  return normalized;
};

// Custom hook for fetching students with caching
export const useStudents = (params: StudentsQueryParams = {}) => {
  const normalizedParams = normalizeParams(params);
  
  return useQuery({
    queryKey: studentsKeys.list(normalizedParams),
    queryFn: async (): Promise<StudentsResponse> => {
      const searchParams = new URLSearchParams();
      
      // Add all parameters to the URL
      Object.entries(normalizedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const { data } = await apiClient.get(`/admin/students?${searchParams.toString()}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: true,
  });
};

// Custom hook for student statistics
export const useStudentStats = () => {
  return useQuery({
    queryKey: studentsKeys.stats(),
    queryFn: async (): Promise<StudentStats> => {
      const { data } = await apiClient.get('/admin/students/stats');
      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

// Custom hook for fetching a single student
export const useStudent = (studentId: string) => {
  return useQuery({
    queryKey: studentsKeys.detail(studentId),
    queryFn: async (): Promise<StudentDetailResponse> => {
      const { data } = await apiClient.get(`/admin/students/${studentId}`);
      return data.data;
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Custom hook for updating student status
export const useUpdateStudentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ studentId, isActive }: { studentId: string; isActive: boolean }) => {
      const { data } = await apiClient.patch(`/admin/students/${studentId}/status`, { isActive });
      return data;
    },
    onSuccess: (_, { studentId, isActive }) => {
      // Invalidate and refetch all student queries
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      
      toast({
        title: "Status Updated",
        description: `Student has been ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update student status.",
        variant: "destructive",
      });
    },
  });
};

// Custom hook for deleting student
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (studentId: string) => {
      const { data } = await apiClient.delete(`/admin/students/${studentId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      
      toast({
        title: "Student Deleted",
        description: "Student account has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete student.",
        variant: "destructive",
      });
    },
  });
};

// Custom hook for sending notification to students
export const useSendStudentNotification = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ studentIds, message, subject }: { 
      studentIds: string[]; 
      message: string; 
      subject: string; 
    }) => {
      const { data } = await apiClient.post('/admin/students/notify', {
        studentIds,
        message,
        subject,
      });
      return data;
    },
    onSuccess: (_, { studentIds }) => {
      toast({
        title: "Notification Sent",
        description: `Notification sent to ${studentIds.length} student(s) successfully.`,
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

// Custom hook for exporting students data
export const useExportStudents = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.get('/admin/students/export');
      return data.data;
    },
    onSuccess: (data) => {
      // Convert data to CSV and download
      const csvContent = convertToCSV(data);
      downloadCSV(csvContent, 'students-data.csv');
      
      toast({
        title: "Export Successful",
        description: "Students data has been exported successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Export Failed",
        description: error?.response?.data?.message || "Failed to export students data.",
        variant: "destructive",
      });
    },
  });
};

// Utility function to prefetch students
export const usePrefetchStudents = () => {
  const queryClient = useQueryClient();

  return (params: StudentsQueryParams) => {
    const normalizedParams = normalizeParams(params);
    
    queryClient.prefetchQuery({
      queryKey: studentsKeys.list(normalizedParams),
      queryFn: async (): Promise<StudentsResponse> => {
        const searchParams = new URLSearchParams();
        
        Object.entries(normalizedParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });

        const { data } = await apiClient.get(`/admin/students?${searchParams.toString()}`);
        return data.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
};

// Helper functions for CSV export
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
}

function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
