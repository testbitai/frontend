import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { toast } from "sonner";

export interface TutorTest {
  _id: string;
  title: string;
  description?: string;
  examType: string;
  type: string;
  duration: number;
  isPublished: boolean;
  allowedStudents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  coins: number;
  joinedAt: string;
  lastActive: string;
  testsCompleted: number;
  averageScore: number;
}

export interface StudentInvitation {
  _id: string;
  email: string;
  status: "pending" | "accepted" | "expired";
  inviteCode: string;
  createdAt: string;
  expiresAt: string;
}

// Get tutor's tests
export const useTutorTests = (tutorId: string, filters?: any) => {
  return useQuery<TutorTest[]>({
    queryKey: queryKeys.tutorTests(tutorId, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.published !== undefined) params.append('published', filters.published);

      const response = await apiClient.get(`/tutor/tests?${params.toString()}`);
      return response.data.data;
    },
    enabled: !!tutorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get tutor's students
export const useTutorStudents = (tutorId: string) => {
  return useQuery<Student[]>({
    queryKey: queryKeys.tutorStudents(tutorId),
    queryFn: async () => {
      const response = await apiClient.get("/tutor/students");
      return response.data.data;
    },
    enabled: !!tutorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get tutor analytics
export const useTutorAnalytics = (tutorId: string) => {
  return useQuery({
    queryKey: queryKeys.tutorAnalytics(tutorId),
    queryFn: async () => {
      const response = await apiClient.get("/tutor/analytics");
      return response.data.data;
    },
    enabled: !!tutorId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get student invitations
export const useStudentInvitations = (tutorId: string) => {
  return useQuery<StudentInvitation[]>({
    queryKey: queryKeys.studentInvitations(tutorId),
    queryFn: async () => {
      const response = await apiClient.get("/student-management/invitations");
      return response.data.data;
    },
    enabled: !!tutorId,
    staleTime: 1 * 60 * 1000, // 1 minute - invitations change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create test mutation
export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testData: any) => {
      const response = await apiClient.post("/test", testData);
      return response.data.data;
    },
    onSuccess: (newTest, variables) => {
      // Invalidate tutor tests list
      queryClient.invalidateQueries({ 
        queryKey: ['tutor', 'tests'] 
      });
      
      toast.success("Test created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create test");
    },
  });
};

// Update test mutation
export const useUpdateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ testId, testData }: { testId: string; testData: any }) => {
      const response = await apiClient.put(`/test/${testId}`, testData);
      return response.data.data;
    },
    onSuccess: (updatedTest) => {
      // Update specific test in cache
      queryClient.setQueryData(
        queryKeys.testDetail(updatedTest._id),
        updatedTest
      );
      
      // Invalidate tutor tests list
      queryClient.invalidateQueries({ 
        queryKey: ['tutor', 'tests'] 
      });
      
      toast.success("Test updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update test");
    },
  });
};

// Delete test mutation
export const useDeleteTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testId: string) => {
      const response = await apiClient.delete(`/test/${testId}`);
      return response.data;
    },
    onSuccess: (_, testId) => {
      // Remove test from cache
      queryClient.removeQueries({ 
        queryKey: queryKeys.testDetail(testId) 
      });
      
      // Invalidate tutor tests list
      queryClient.invalidateQueries({ 
        queryKey: ['tutor', 'tests'] 
      });
      
      toast.success("Test deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete test");
    },
  });
};

// Publish/unpublish test mutation
export const useToggleTestPublication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testId: string) => {
      const response = await apiClient.patch(`/test/${testId}/publish`);
      return response.data.data;
    },
    onSuccess: (updatedTest) => {
      // Update specific test in cache
      queryClient.setQueryData(
        queryKeys.testDetail(updatedTest._id),
        updatedTest
      );
      
      // Invalidate tutor tests list
      queryClient.invalidateQueries({ 
        queryKey: ['tutor', 'tests'] 
      });
      
      const action = updatedTest.isPublished ? "published" : "unpublished";
      toast.success(`Test ${action} successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update test");
    },
  });
};

// Invite student mutation
export const useInviteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post("/student-management/invite", { email });
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate invitations list
      queryClient.invalidateQueries({ 
        queryKey: ['student-invitations'] 
      });
      
      toast.success("Student invitation sent!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send invitation");
    },
  });
};

// Remove student mutation
export const useRemoveStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: string) => {
      const response = await apiClient.delete(`/student-management/students/${studentId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate students list
      queryClient.invalidateQueries({ 
        queryKey: ['tutor', 'students'] 
      });
      
      toast.success("Student removed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove student");
    },
  });
};
