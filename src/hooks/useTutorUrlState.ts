import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UrlStateOptions<T = any> {
  defaultValue?: T;
  serialize?: (value: T) => string;
  deserialize?: (value: T) => T;
}

/**
 * Custom hook to manage state in URL search parameters for tutors
 */
export const useTutorUrlState = <T = string>(
  key: string,
  options: UrlStateOptions = {}
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
 * Hook specifically for managing multiple URL states for tutor filters
 */
export const useTutorUrlFilters = () => {
  const [searchTerm, setSearchTerm] = useTutorUrlState('search', { defaultValue: '' });
  const [filterStatus, setFilterStatus] = useTutorUrlState('status', { defaultValue: 'all' });
  const [filterSpecialization, setFilterSpecialization] = useTutorUrlState('specialization', { defaultValue: 'all' });
  const [filterExperience, setFilterExperience] = useTutorUrlState('experience', { defaultValue: 'all' });
  const [filterRating, setFilterRating] = useTutorUrlState('rating', { defaultValue: 'all' });
  const [filterVerified, setFilterVerified] = useTutorUrlState('verified', { defaultValue: 'all' });
  const [sortBy, setSortBy] = useTutorUrlState('sortBy', { defaultValue: 'joinDate' });
  const [sortOrder, setSortOrder] = useTutorUrlState('sortOrder', { defaultValue: 'desc' });
  
  const [currentPage, setCurrentPage] = useTutorUrlState('page', {
    defaultValue: 1,
    serialize: (value: number) => value.toString(),
    deserialize: (value: string) => {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }
  });
  
  const [limit, setLimit] = useTutorUrlState('limit', {
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
    setFilterSpecialization('all');
    setFilterExperience('all');
    setFilterRating('all');
    setFilterVerified('all');
    setSortBy('joinDate');
    setSortOrder('desc');
    setCurrentPage(1);
    setLimit(12);
  }, [
    setSearchTerm,
    setFilterStatus,
    setFilterSpecialization,
    setFilterExperience,
    setFilterRating,
    setFilterVerified,
    setSortBy,
    setSortOrder,
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
    filterSpecialization,
    filterExperience,
    filterRating,
    filterVerified,
    sortBy,
    sortOrder,
    currentPage,
    limit,
    
    // Setters
    setSearchTerm,
    setFilterStatus,
    setFilterSpecialization,
    setFilterExperience,
    setFilterRating,
    setFilterVerified,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    setLimit,
    
    // Utility functions
    clearAllFilters,
    resetPage,
  };
};
