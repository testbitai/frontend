import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests 3 times
      retry: 3,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus for most queries
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// Query Keys - Centralized key management
export const queryKeys = {
  // User related
  user: ['user'] as const,
  userProfile: (userId: string) => ['user', 'profile', userId] as const,
  
  // Test related
  tests: ['tests'] as const,
  testsList: (filters?: any) => ['tests', 'list', filters] as const,
  testDetail: (testId: string) => ['tests', 'detail', testId] as const,
  testResults: (testId: string, attemptId?: string) => 
    ['tests', 'results', testId, attemptId] as const,
  
  // Test attempts
  testAttempts: ['test-attempts'] as const,
  testAttemptCount: (testId: string) => ['test-attempts', 'count', testId] as const,
  allTestAttempts: (testId: string) => ['test-attempts', 'all', testId] as const,
  testHistory: (userId: string) => ['test-attempts', 'history', userId] as const,
  
  // AI Analysis
  aiAnalysis: (attemptId: string) => ['ai-analysis', attemptId] as const,
  
  // Tutor related
  tutorTests: (tutorId: string, filters?: any) => 
    ['tutor', tutorId, 'tests', filters] as const,
  tutorStudents: (tutorId: string) => ['tutor', tutorId, 'students'] as const,
  tutorAnalytics: (tutorId: string) => ['tutor', tutorId, 'analytics'] as const,
  
  // Student management
  studentInvitations: (tutorId: string) => 
    ['student-invitations', tutorId] as const,
  
  // Rewards
  rewards: ['rewards'] as const,
  userRewards: (userId: string) => ['rewards', 'user', userId] as const,
  
  // Admin related
  adminTests: (filters?: any) => ['admin', 'tests', filters] as const,
  adminUsers: (filters?: any) => ['admin', 'users', filters] as const,
  adminAnalytics: ['admin', 'analytics'] as const,
} as const;
