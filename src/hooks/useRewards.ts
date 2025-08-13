import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/apiClient';

// Types
export interface RewardCriteria {
  type: 'score' | 'tests_completed' | 'streak' | 'login_days' | 'custom';
  operator: 'gte' | 'lte' | 'eq' | 'between';
  value: number | number[];
  description: string;
}

export interface Reward {
  _id: string;
  name: string;
  description: string;
  type: 'badge' | 'coin' | 'achievement' | 'streak' | 'level';
  category: 'performance' | 'engagement' | 'milestone' | 'special' | 'seasonal';
  status: 'active' | 'inactive' | 'draft' | 'archived';
  icon: string;
  image?: string;
  color: string;
  coinValue: number;
  criteria: RewardCriteria[];
  isAutoAwarded: boolean;
  maxAwards?: number;
  validFrom?: string;
  validUntil?: string;
  totalAwarded: number;
  isVisible: boolean;
  sortOrder: number;
  metadata?: {
    difficulty?: 'easy' | 'medium' | 'hard' | 'legendary';
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
    tags?: string[];
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  awardCount?: number;
  recentAwards?: UserReward[];
  canBeAwarded?: boolean;
}

export interface UserReward {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  reward: Reward;
  awardedAt: string;
  awardedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  reason?: string;
  metadata?: {
    scoreAchieved?: number;
    testId?: string;
    streakCount?: number;
  };
}

export interface RewardStats {
  totalRewards: number;
  activeRewards: number;
  draftRewards: number;
  archivedRewards: number;
  totalAwardsGiven: number;
  uniqueRewardedUsers: number;
  recentAwards: number;
  typeDistribution: Array<{ _id: string; count: number }>;
  categoryDistribution: Array<{ _id: string; count: number }>;
  mostAwardedRewards: Array<{ _id: string; name: string; type: string; count: number }>;
  monthlyTrends: Array<{ _id: { year: number; month: number }; count: number }>;
  averageAwardsPerReward: number;
}

export interface RewardFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isAutoAwarded?: string;
  isVisible?: string;
}

export interface CreateRewardData {
  name: string;
  description: string;
  type: Reward['type'];
  category: Reward['category'];
  status?: Reward['status'];
  icon: string;
  image?: string;
  color?: string;
  coinValue?: number;
  criteria?: RewardCriteria[];
  isAutoAwarded?: boolean;
  maxAwards?: number;
  validFrom?: string;
  validUntil?: string;
  isVisible?: boolean;
  sortOrder?: number;
  metadata?: Reward['metadata'];
}

export interface UpdateRewardData extends Partial<CreateRewardData> {}

export interface AwardRewardData {
  userIds: string[];
  reason?: string;
}

export interface BulkUpdateRewardsData {
  rewardIds: string[];
  updates: {
    status?: Reward['status'];
    isVisible?: boolean;
    isAutoAwarded?: boolean;
    sortOrder?: number;
    category?: Reward['category'];
    validFrom?: string;
    validUntil?: string;
  };
}

// Query Keys
export const rewardKeys = {
  all: ['rewards'] as const,
  lists: () => [...rewardKeys.all, 'list'] as const,
  list: (filters: RewardFilters) => [...rewardKeys.lists(), filters] as const,
  details: () => [...rewardKeys.all, 'detail'] as const,
  detail: (id: string) => [...rewardKeys.details(), id] as const,
  stats: () => [...rewardKeys.all, 'stats'] as const,
  userRewards: (userId: string) => [...rewardKeys.all, 'user', userId] as const,
};

// Hooks
export const useRewards = (filters: RewardFilters = {}) => {
  return useQuery({
    queryKey: rewardKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      const response = await apiClient.get(`/admin/rewards?${params.toString()}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRewardStats = () => {
  return useQuery({
    queryKey: rewardKeys.stats(),
    queryFn: async () => {
      const response = await apiClient.get('/admin/rewards/stats');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useReward = (rewardId: string) => {
  return useQuery({
    queryKey: rewardKeys.detail(rewardId),
    queryFn: async () => {
      const response = await apiClient.get(`/admin/rewards/${rewardId}`);
      return response.data;
    },
    enabled: !!rewardId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserRewards = (userId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: rewardKeys.userRewards(userId),
    queryFn: async () => {
      const response = await apiClient.get(`/admin/rewards/users/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateReward = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateRewardData) => {
      const response = await apiClient.post('/admin/rewards', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: rewardKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rewardKeys.stats() });
      toast({
        title: 'Success',
        description: 'Reward created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create reward',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateReward = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ rewardId, data }: { rewardId: string; data: UpdateRewardData }) => {
      const response = await apiClient.patch(`/admin/rewards/${rewardId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: rewardKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rewardKeys.detail(variables.rewardId) });
      queryClient.invalidateQueries({ queryKey: rewardKeys.stats() });
      toast({
        title: 'Success',
        description: 'Reward updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update reward',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteReward = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rewardId: string) => {
      const response = await apiClient.delete(`/admin/rewards/${rewardId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rewardKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rewardKeys.stats() });
      toast({
        title: 'Success',
        description: 'Reward deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete reward',
        variant: 'destructive',
      });
    },
  });
};

export const useAwardReward = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ rewardId, data }: { rewardId: string; data: AwardRewardData }) => {
      const response = await apiClient.post(`/admin/rewards/${rewardId}/award`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: rewardKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rewardKeys.detail(variables.rewardId) });
      queryClient.invalidateQueries({ queryKey: rewardKeys.stats() });
      toast({
        title: 'Success',
        description: `Reward awarded to ${data.data.awarded} user(s)`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to award reward',
        variant: 'destructive',
      });
    },
  });
};

export const useRevokeReward = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ rewardId, userId }: { rewardId: string; userId: string }) => {
      const response = await apiClient.delete(`/admin/rewards/${rewardId}/revoke/${userId}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: rewardKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rewardKeys.detail(variables.rewardId) });
      queryClient.invalidateQueries({ queryKey: rewardKeys.userRewards(variables.userId) });
      queryClient.invalidateQueries({ queryKey: rewardKeys.stats() });
      toast({
        title: 'Success',
        description: 'Reward revoked successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to revoke reward',
        variant: 'destructive',
      });
    },
  });
};

export const useBulkUpdateRewards = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: BulkUpdateRewardsData) => {
      const response = await apiClient.patch('/admin/rewards/bulk', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: rewardKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rewardKeys.stats() });
      toast({
        title: 'Success',
        description: `${data.data.modified} reward(s) updated successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update rewards',
        variant: 'destructive',
      });
    },
  });
};
