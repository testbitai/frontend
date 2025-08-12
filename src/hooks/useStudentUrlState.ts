import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UrlStateOptions<T = any> {
  defaultValue?: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

/**
 * Custom hook to manage state in URL search parameters for students
 */
export const useStudentUrlState = <T = string>(
  key: string,
  options: UrlStateOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { defaultValue = '', serialize = String, deserialize = (v: string) => v } = options;

  // Get current value from URL or use default
  const value = (() => {
    const urlValue = searchParams.get(key);
    if (urlValue === null) {
      return defaultValue as T;
    }
    try {
      return deserialize(urlValue) as T;
    } catch {
      return defaultValue as T;
    }
  })();

  // Set value in URL
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const actualValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
      
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        
        if (actualValue === defaultValue || actualValue === '' || actualValue === null || actualValue === undefined) {
          // Remove parameter if it's the default value
          newParams.delete(key);
        } else {
          // Set parameter with serialized value
          newParams.set(key, serialize(actualValue));
        }
        
        return newParams;
      }, { replace: true }); // Use replace to avoid cluttering browser history
    },
    [key, value, defaultValue, serialize, setSearchParams]
  );

  return [value, setValue];
};

/**
 * Hook specifically for managing multiple URL states for student filters
 */
export const useStudentUrlFilters = () => {
  const [searchTerm, setSearchTerm] = useStudentUrlState('search', { defaultValue: '' });
  const [filterStatus, setFilterStatus] = useStudentUrlState('status', { defaultValue: 'all' });
  const [filterExamGoal, setFilterExamGoal] = useStudentUrlState('examGoal', { defaultValue: 'all' });
  const [filterHasAttempts, setFilterHasAttempts] = useStudentUrlState('hasAttempts', { defaultValue: 'all' });
  const [sortBy, setSortBy] = useStudentUrlState('sortBy', { defaultValue: 'createdAt' });
  const [sortOrder, setSortOrder] = useStudentUrlState('sortOrder', { defaultValue: 'desc' });
  
  const [minScore, setMinScore] = useStudentUrlState('minScore', {
    defaultValue: undefined as number | undefined,
    serialize: (value: number | undefined) => value?.toString() || '',
    deserialize: (value: string) => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
  });
  
  const [maxScore, setMaxScore] = useStudentUrlState('maxScore', {
    defaultValue: undefined as number | undefined,
    serialize: (value: number | undefined) => value?.toString() || '',
    deserialize: (value: string) => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
  });
  
  const [currentPage, setCurrentPage] = useStudentUrlState('page', {
    defaultValue: 1,
    serialize: (value: number) => value.toString(),
    deserialize: (value: string) => {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }
  });
  
  const [limit, setLimit] = useStudentUrlState('limit', {
    defaultValue: 12,
    serialize: (value: number) => value.toString(),
    deserialize: (value: string) => {
      const parsed = parseInt(value, 10);
      const validLimits = [6, 12, 24, 48];
      return validLimits.includes(parsed) ? parsed : 12;
    }
  });

  // Clear all filters function
  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterExamGoal('all');
    setFilterHasAttempts('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setMinScore(undefined);
    setMaxScore(undefined);
    setCurrentPage(1);
    setLimit(12);
  }, [
    setSearchTerm,
    setFilterStatus,
    setFilterExamGoal,
    setFilterHasAttempts,
    setSortBy,
    setSortOrder,
    setMinScore,
    setMaxScore,
    setCurrentPage,
    setLimit
  ]);

  // Reset page when filters change
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, [setCurrentPage]);

  return {
    // State values
    searchTerm,
    filterStatus,
    filterExamGoal,
    filterHasAttempts,
    sortBy,
    sortOrder,
    minScore,
    maxScore,
    currentPage,
    limit,
    
    // Setters
    setSearchTerm,
    setFilterStatus,
    setFilterExamGoal,
    setFilterHasAttempts,
    setSortBy,
    setSortOrder,
    setMinScore,
    setMaxScore,
    setCurrentPage,
    setLimit,
    
    // Utility functions
    clearAllFilters,
    resetPage,
  };
};
