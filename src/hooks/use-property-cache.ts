import { useEffect, useState, useCallback, useRef } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  key: string;
  fallback?: unknown;
}

interface CachedData<T> {
  data: T;
  timestamp: number;
  hash: string; // For detecting when backend data changes
}

/**
 * Custom hook for client-side caching with auto-invalidation.
 * Reduces API calls by storing data locally with TTL (Time To Live).
 * 
 * @param fetchFn - Async function that fetches data
 * @param options - Cache key, TTL, and fallback data
 * @returns { data, loading, error, refetch }
 */
export function usePropertyCache<T>(
  fetchFn: () => Promise<T>,
  options: CacheOptions
) {
  const { ttl = 5 * 60 * 1000, key, fallback } = options;
  
  const [data, setData] = useState<T | null>(fallback as T || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isFetching = useRef(false);

  // Generate simple hash of data for change detection
  const generateHash = useCallback((value: unknown): string => {
    try {
      return btoa(JSON.stringify(value)).substring(0, 20);
    } catch {
      return Date.now().toString();
    }
  }, []);

  // Check if cache is still valid
  const isCacheValid = useCallback((): boolean => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return false;

      const parsed: CachedData<T> = JSON.parse(cached);
      const now = Date.now();
      const age = now - parsed.timestamp;

      return age < ttl;
    } catch {
      return false;
    }
  }, [key, ttl]);

  // Load from cache
  const loadFromCache = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const parsed: CachedData<T> = JSON.parse(cached);
      return parsed.data;
    } catch {
      return null;
    }
  }, [key]);

  // Save to cache
  const saveToCache = useCallback((value: T) => {
    try {
      const cacheData: CachedData<T> = {
        data: value,
        timestamp: Date.now(),
        hash: generateHash(value),
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (err) {
      // Silently fail if localStorage is full or unavailable
      console.warn('Cache storage failed:', err);
    }
  }, [key, generateHash]);

  // Fetch and handle cache logic
  const fetchAndCache = useCallback(async (forceRefresh = false) => {
    // Prevent duplicate requests
    if (isFetching.current) return;

    // Use cache if valid and not forcing refresh
    if (!forceRefresh && isCacheValid()) {
      const cached = loadFromCache();
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }
    }

    isFetching.current = true;
    setLoading(true);
    setError(false);

    try {
      const result = await fetchFn();
      setData(result);
      saveToCache(result);
    } catch (err) {
      console.error('Fetch error:', err);
      // Try to use stale cache on error
      const staleCache = loadFromCache();
      if (staleCache) {
        setData(staleCache);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [fetchFn, isCacheValid, loadFromCache, saveToCache]);

  // Initial fetch
  useEffect(() => {
    fetchAndCache();
  }, [fetchFn, key]);

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    fetchAndCache(true); // Force refresh
  }, [fetchAndCache]);

  return { data, loading, error, refetch };
}

/**
 * Clears specific cache entry
 */
export function clearPropertyCache(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn('Failed to clear cache:', key);
  }
}

/**
 * Clears all property-related caches
 */
export function clearAllPropertyCaches() {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('property_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch {
    console.warn('Failed to clear all property caches');
  }
}
