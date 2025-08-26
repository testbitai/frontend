import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { toast } from "sonner";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  isEmailVerified: boolean;
  coins: number;
  createdAt: string;
  lastActive?: string;
  testsCompleted?: number;
  averageScore?: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalTests: number;
  totalAttempts: number;
  averageScore: number;
  userGrowth: Array<{ date: string; count: number }>;
  testActivity: Array<{ date: string; attempts: number }>;
  topPerformers: Array<{ user: AdminUser; score: number }>;
  popularTests: Array<{ test: any; attempts: number }>;
}

// Get admin analytics
export const useAdminAnalytics = () => {
  return useQuery<AdminAnalytics>({
    queryKey: queryKeys.adminAnalytics,
    queryFn: async () => {
      const response = await apiClient.get("/admin/analytics");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get all tests for admin
export const useAdminTests = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.adminTests(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.createdBy) params.append('createdBy', filters.createdBy);
      if (filters?.published !== undefined) params.append('published', filters.published);

      const response = await apiClient.get(`/admin/tests?${params.toString()}`);
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get all users for admin
export const useAdminUsers = (filters?: any) => {
  return useQuery<AdminUser[]>({
    queryKey: queryKeys.adminUsers(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.role) params.append('role', filters.role);
      if (filters?.verified !== undefined) params.append('verified', filters.verified);

      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get specific user details for admin
export const useAdminUserDetails = (userId: string) => {
  return useQuery({
    queryKey: ['admin', 'user-details', userId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Create user mutation (admin)
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiClient.post("/admin/users", userData);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ 
        queryKey: ['admin', 'users'] 
      });
      
      // Invalidate analytics
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.adminAnalytics 
      });
      
      toast.success("User created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    },
  });
};

// Update user mutation (admin)
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: any }) => {
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      // Update specific user in cache
      queryClient.setQueryData(
        ['admin', 'user-details', updatedUser._id],
        updatedUser
      );
      
      // Invalidate users list
      queryClient.invalidateQueries({ 
        queryKey: ['admin', 'users'] 
      });
      
      toast.success("User updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

// Delete user mutation (admin)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    },
    onSuccess: (_, userId) => {
      // Remove user from cache
      queryClient.removeQueries({ 
        queryKey: ['admin', 'user-details', userId] 
      });
      
      // Invalidate users list
      queryClient.invalidateQueries({ 
        queryKey: ['admin', 'users'] 
      });
      
      // Invalidate analytics
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.adminAnalytics 
      });
      
      toast.success("User deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

// Toggle user status mutation (admin)
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch(`/admin/users/${userId}/toggle-status`);
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      // Update specific user in cache
      queryClient.setQueryData(
        ['admin', 'user-details', updatedUser._id],
        updatedUser
      );
      
      // Invalidate users list
      queryClient.invalidateQueries({ 
        queryKey: ['admin', 'users'] 
      });
      
      const status = updatedUser.isActive ? "activated" : "deactivated";
      toast.success(`User ${status} successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user status");
    },
  });
};

// Bulk operations
export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await apiClient.delete("/admin/users/bulk", {
        data: { userIds }
      });
      return response.data;
    },
    onSuccess: (_, userIds) => {
      // Remove users from cache
      userIds.forEach(userId => {
        queryClient.removeQueries({ 
          queryKey: ['admin', 'user-details', userId] 
        });
      });
      
      // Invalidate users list
      queryClient.invalidateQueries({ 
        queryKey: ['admin', 'users'] 
      });
      
      // Invalidate analytics
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.adminAnalytics 
      });
      
      toast.success(`${userIds.length} users deleted successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete users");
    },
  });
};
