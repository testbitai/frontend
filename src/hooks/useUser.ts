import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  isEmailVerified: boolean;
  coins: number;
  createdAt: string;
  updatedAt: string;
}

// Get current user profile
export const useCurrentUser = () => {
  const { user: authUser } = useAuthStore();
  
  return useQuery<User>({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const response = await apiClient.get("/user/me");
      return response.data.data;
    },
    enabled: !!authUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Get user profile by ID
export const useUserProfile = (userId: string) => {
  return useQuery<User>({
    queryKey: queryKeys.userProfile(userId),
    queryFn: async () => {
      const response = await apiClient.get(`/user/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Update user profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const response = await apiClient.put("/user/profile", userData);
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      // Update the user in auth store
      setUser(updatedUser);
      
      // Update cached user data
      queryClient.setQueryData(queryKeys.user, updatedUser);
      queryClient.setQueryData(
        queryKeys.userProfile(updatedUser._id), 
        updatedUser
      );
      
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (passwordData: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const response = await apiClient.put("/user/change-password", passwordData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });
};

// Verify email mutation
export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      const response = await apiClient.post("/auth/verify-email", { token });
      return response.data.data;
    },
    onSuccess: (user) => {
      // Update cached user data
      queryClient.setQueryData(queryKeys.user, user);
      toast.success("Email verified successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to verify email");
    },
  });
};

// Resend verification email mutation
export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/auth/resend-verification");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Verification email sent!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send verification email");
    },
  });
};
