import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UrlStateOptions<T = any> {
  defaultValue?: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

/**
 * Custom hook to manage state in URL search parameters
 * Provides a similar API to useState but syncs with URL
 */
export const useUrlState = <T = string>(
  key: string,
  options: UrlStateOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { defaultValue = '', serialize = String, deserialize = (v: string) => v } = options;

  // Get current value from URL or use default
  const value = useMemo(() => {
    const urlValue = searchParams.get(key);
    if (urlValue === null) {
      return defaultValue as T;
    }
    try {
      return deserialize(urlValue) as T;
    } catch {
      return defaultValue as T;
    }
  }, [searchParams, key, defaultValue, deserialize]);

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
 * Hook specifically for managing multiple URL states for filters
 */
export const useUrlFilters = () => {
  const [searchTerm, setSearchTerm] = useUrlState('search', { defaultValue: '' });
  const [filterType, setFilterType] = useUrlState('type', { defaultValue: 'all' });
  const [filterExamType, setFilterExamType] = useUrlState('examType', { defaultValue: 'all' });
  const [filterSubject, setFilterSubject] = useUrlState('subject', { defaultValue: 'all' });
  const [filterDifficulty, setFilterDifficulty] = useUrlState('difficulty', { defaultValue: 'all' });
  const [filterCreatedBy, setFilterCreatedBy] = useUrlState('createdBy', { defaultValue: 'all' });
  const [sortBy, setSortBy] = useUrlState('sortBy', { defaultValue: 'createdAt' });
  const [sortOrder, setSortOrder] = useUrlState('sortOrder', { defaultValue: 'desc' });
  
  const [currentPage, setCurrentPage] = useUrlState('page', {
    defaultValue: 1,
    serialize: (value: number) => value.toString(),
    deserialize: (value: string) => {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }
  });
  
  const [limit, setLimit] = useUrlState('limit', {
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
    setFilterType('all');
    setFilterExamType('all');
    setFilterSubject('all');
    setFilterDifficulty('all');
    setFilterCreatedBy('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
    setLimit(12);
  }, [
    setSearchTerm,
    setFilterType,
    setFilterExamType,
    setFilterSubject,
    setFilterDifficulty,
    setFilterCreatedBy,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    setLimit
  ]);

  // Reset page when filters change (except page and limit)
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, [setCurrentPage]);

  return {
    // State values
    searchTerm,
    filterType,
    filterExamType,
    filterSubject,
    filterDifficulty,
    filterCreatedBy,
    sortBy,
    sortOrder,
    currentPage,
    limit,
    
    // Setters
    setSearchTerm,
    setFilterType,
    setFilterExamType,
    setFilterSubject,
    setFilterDifficulty,
    setFilterCreatedBy,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    setLimit,
    
    // Utility functions
    clearAllFilters,
    resetPage,
  };
};
