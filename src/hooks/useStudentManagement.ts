import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

export interface StudentInvitation {
  _id: string;
  tutorId: string;
  studentId?: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  inviteCode: string;
  inviteLink: string;
  studentEmail?: string;
  studentName?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  message?: string;
  expiresAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDetails {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  isActive: boolean;
  joinedAt: string;
  testsCompleted: number;
  averageScore: number;
  bestScore: number;
  currentStreak: number;
  coins: number;
  lastTestDate?: string;
  performance: {
    Physics?: number;
    Chemistry?: number;
    Mathematics?: number;
  };
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  pendingInvitations: number;
  totalTestAttempts: number;
  averageScore: number;
}

export interface StudentsResponse {
  students: StudentDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface InvitationsResponse {
  invitations: StudentInvitation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface StudentsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface InvitationsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface JoinInvitationData {
  tutorId: string;
  tutorName: string;
  instituteName?: string;
  message?: string;
  expiresAt: string;
}

// Query key factory
export const studentManagementKeys = {
  all: ['student-management'] as const,
  students: () => [...studentManagementKeys.all, 'students'] as const,
  studentsList: (params: StudentsQueryParams) => [...studentManagementKeys.students(), params] as const,
  invitations: () => [...studentManagementKeys.all, 'invitations'] as const,
  invitationsList: (params: InvitationsQueryParams) => [...studentManagementKeys.invitations(), params] as const,
  stats: () => [...studentManagementKeys.all, 'stats'] as const,
  joinData: (code: string) => [...studentManagementKeys.all, 'join', code] as const,
};

// Helper function to normalize query parameters for students
const normalizeStudentParams = (params: StudentsQueryParams) => {
  const normalized: any = {};
  const validSortBy = ['name', 'email', 'joinedAt', 'testsCompleted', 'averageScore'];
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      if (key === 'page' || key === 'limit') {
        const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numValue) && numValue > 0) {
          normalized[key] = numValue;
        }
      } else if (key === 'sortBy') {
        // Validate sortBy for students
        if (validSortBy.includes(value as string)) {
          normalized[key] = value;
        } else {
          normalized[key] = 'joinedAt'; // Default for students
        }
      } else {
        normalized[key] = value;
      }
    }
  });
  
  if (!normalized.page) normalized.page = 1;
  if (!normalized.limit) normalized.limit = 10;
  if (!normalized.sortBy) normalized.sortBy = 'joinedAt';
  if (!normalized.sortOrder) normalized.sortOrder = 'desc';
  
  return normalized;
};

// Helper function to normalize query parameters for invitations
const normalizeInvitationParams = (params: InvitationsQueryParams) => {
  const normalized: any = {};
  const validSortBy = ['createdAt', 'expiresAt', 'status'];
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      if (key === 'page' || key === 'limit') {
        const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numValue) && numValue > 0) {
          normalized[key] = numValue;
        }
      } else if (key === 'sortBy') {
        // Validate sortBy for invitations
        if (validSortBy.includes(value as string)) {
          normalized[key] = value;
        } else {
          normalized[key] = 'createdAt'; // Default for invitations
        }
      } else {
        normalized[key] = value;
      }
    }
  });
  
  if (!normalized.page) normalized.page = 1;
  if (!normalized.limit) normalized.limit = 10;
  if (!normalized.sortBy) normalized.sortBy = 'createdAt';
  if (!normalized.sortOrder) normalized.sortOrder = 'desc';
  
  return normalized;
};

// Get student management statistics
export const useStudentStats = () => {
  return useQuery({
    queryKey: studentManagementKeys.stats(),
    queryFn: async (): Promise<StudentStats> => {
      const { data } = await apiClient.get('/tutor/students/stats');
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Get tutor's students
export const useStudents = (params: StudentsQueryParams = {}) => {
  const normalizedParams = normalizeStudentParams(params);
  
  return useQuery({
    queryKey: studentManagementKeys.studentsList(normalizedParams),
    queryFn: async (): Promise<StudentsResponse> => {
      const searchParams = new URLSearchParams();
      
      Object.entries(normalizedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const { data } = await apiClient.get(`/tutor/students?${searchParams.toString()}`);
      return data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Get tutor's invitations
export const useInvitations = (params: InvitationsQueryParams = {}) => {
  const normalizedParams = normalizeInvitationParams(params);
  
  return useQuery({
    queryKey: studentManagementKeys.invitationsList(normalizedParams),
    queryFn: async (): Promise<InvitationsResponse> => {
      const searchParams = new URLSearchParams();
      
      Object.entries(normalizedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const { data } = await apiClient.get(`/tutor/students/invitations?${searchParams.toString()}`);
      return data.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: false,
  });
};

// Generate invite code
export const useGenerateInvite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { message?: string; expiresIn?: number }) => {
      const { data: response } = await apiClient.post('/tutor/students/invite', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentManagementKeys.invitations() });
      queryClient.invalidateQueries({ queryKey: studentManagementKeys.stats() });
      
      toast({
        title: "Invite Code Generated",
        description: "New invite code has been generated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to generate invite code.",
        variant: "destructive",
      });
    },
  });
};

// Update invitation status (approve/reject)
export const useUpdateInvitationStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      invitationId, 
      status, 
      reason 
    }: { 
      invitationId: string; 
      status: 'accepted' | 'rejected'; 
      reason?: string;
    }) => {
      const { data } = await apiClient.patch(
        `/tutor/students/invitations/${invitationId}/status`,
        { status, reason }
      );
      return data.data;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: studentManagementKeys.invitations() });
      queryClient.invalidateQueries({ queryKey: studentManagementKeys.students() });
      queryClient.invalidateQueries({ queryKey: studentManagementKeys.stats() });
      
      toast({
        title: `Invitation ${status === 'accepted' ? 'Approved' : 'Rejected'}`,
        description: `Student invitation has been ${status === 'accepted' ? 'approved' : 'rejected'} successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update invitation status.",
        variant: "destructive",
      });
    },
  });
};

// Remove student
export const useRemoveStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (studentId: string) => {
      const { data } = await apiClient.delete(`/tutor/students/${studentId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentManagementKeys.students() });
      queryClient.invalidateQueries({ queryKey: studentManagementKeys.stats() });
      
      toast({
        title: "Student Removed",
        description: "Student has been removed from your class successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to remove student.",
        variant: "destructive",
      });
    },
  });
};

// Resend invitation
export const useResendInvitation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const { data } = await apiClient.post(`/tutor/students/invitations/${invitationId}/resend`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentManagementKeys.invitations() });
      
      toast({
        title: "Invitation Resent",
        description: "Invitation has been resent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to resend invitation.",
        variant: "destructive",
      });
    },
  });
};

// Get join invitation data (for students)
export const useJoinInvitationData = (inviteCode: string) => {
  return useQuery({
    queryKey: studentManagementKeys.joinData(inviteCode),
    queryFn: async (): Promise<JoinInvitationData> => {
      const { data } = await apiClient.get(`/join/${inviteCode}`);
      return {
        tutorId: data.data.tutorId._id,
        tutorName: data.data.tutorId.name,
        instituteName: data.data.tutorId.tutorDetails?.instituteName,
        message: data.data.message,
        expiresAt: data.data.expiresAt,
      };
    },
    enabled: !!inviteCode,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
};

// Join tutor by invite code (for students)
export const useJoinTutor = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      const { data } = await apiClient.post(`/join/${inviteCode}`);
      return data.data;
    },
    onSuccess: () => {
      toast({
        title: "Successfully Joined!",
        description: "You have successfully joined the tutor's class.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to join tutor.",
        variant: "destructive",
      });
    },
  });
};
