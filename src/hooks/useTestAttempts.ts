import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export interface TestAttempt {
  _id: string;
  user: string;
  test: {
    _id: string;
    title: string;
    description?: string;
    examType: string;
    type: string;
    duration: number;
  };
  score: number;
  scorePercent: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  totalTimeTaken: number;
  attemptedAt: string;
  changedAnswersCount: number;
  changedCorrectCount: number;
}

export interface AttemptCount {
  count: number;
  maxAttempts: number;
  remainingAttempts: number;
}

// Hook to get attempt count for a specific test
export const useTestAttemptCount = (testId: string) => {
  return useQuery<AttemptCount>({
    queryKey: ["testAttemptCount", testId],
    queryFn: async () => {
      const response = await apiClient.get(`/test/${testId}/attempt-count`);
      return response.data.data;
    },
    enabled: !!testId,
  });
};

// Hook to get all attempts for a specific test
export const useAllTestAttempts = (testId: string) => {
  return useQuery<TestAttempt[]>({
    queryKey: ["allTestAttempts", testId],
    queryFn: async () => {
      const response = await apiClient.get(`/test/${testId}/all-attempts`);
      return response.data.data;
    },
    enabled: !!testId,
  });
};

// Hook to get complete test history for a user
export const useTestHistory = (userId?: string) => {
  return useQuery<TestAttempt[]>({
    queryKey: ["testHistory", userId],
    queryFn: async () => {
      const response = await apiClient.get(`/test/users/${userId}/test-history`);
      return response.data.data;
    },
    enabled: !!userId,
  });
};
