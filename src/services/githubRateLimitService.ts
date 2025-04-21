import { useQuery } from '@tanstack/react-query';

interface RateLimitData {
  resources: {
    core: {
      limit: number;
      used: number;
      remaining: number;
      reset: number;
    };
    search: {
      limit: number;
      used: number;
      remaining: number;
      reset: number;
    };
    graphql: {
      limit: number;
      used: number;
      remaining: number;
      reset: number;
    };
  };
  rate: {
    limit: number;
    used: number;
    remaining: number;
    reset: number;
  };
}

/**
 * Fetches current GitHub API rate limit status
 */
export const fetchRateLimitStatus = async (
  token?: string
): Promise<RateLimitData> => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const response = await fetch('https://api.github.com/rate_limit', {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rate limit information');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rate limits:', error);
    throw error;
  }
};

/**
 * React Query hook for fetching GitHub rate limit status
 */
export const useRateLimitStatus = (token?: string) => {
  return useQuery({
    queryKey: ['rateLimitStatus', !!token],
    queryFn: () => fetchRateLimitStatus(token),
    staleTime: 60 * 1000, // 1 minute - rate limits change rapidly, so refresh more frequently
    refetchInterval: 2 * 60 * 1000, // 2 minutes - periodically check rate limit status
    enabled: true, // Always enabled to keep checking rate limit status
    retry: false, // Don't retry if this fails
  });
};

/**
 * Checks if we're getting close to rate limits
 * @returns Warning message if near limit, or null if we're safe
 */
export const checkRateLimitWarning = (
  rateLimitData?: RateLimitData
): string | null => {
  if (!rateLimitData) return null;

  // Check core API rate limit (remaining < 20% of total)
  if (
    rateLimitData.resources.core.remaining <
    rateLimitData.resources.core.limit * 0.2
  ) {
    const resetTime = new Date(
      rateLimitData.resources.core.reset * 1000
    ).toLocaleTimeString();
    return `Approaching GitHub API core rate limit: ${rateLimitData.resources.core.remaining}/${rateLimitData.resources.core.limit} requests remaining. Resets at ${resetTime}`;
  }

  // Check search API rate limit (remaining < 30% of total as it's more restrictive)
  if (
    rateLimitData.resources.search.remaining <
    rateLimitData.resources.search.limit * 0.3
  ) {
    const resetTime = new Date(
      rateLimitData.resources.search.reset * 1000
    ).toLocaleTimeString();
    return `Approaching GitHub search API rate limit: ${rateLimitData.resources.search.remaining}/${rateLimitData.resources.search.limit} requests remaining. Resets at ${resetTime}`;
  }

  // Check GraphQL API rate limit
  if (
    rateLimitData.resources.graphql.remaining <
    rateLimitData.resources.graphql.limit * 0.2
  ) {
    const resetTime = new Date(
      rateLimitData.resources.graphql.reset * 1000
    ).toLocaleTimeString();
    return `Approaching GitHub GraphQL API rate limit: ${rateLimitData.resources.graphql.remaining}/${rateLimitData.resources.graphql.limit} requests remaining. Resets at ${resetTime}`;
  }

  return null;
};

/**
 * Formats time remaining until rate limit reset
 */
export const formatRateLimitReset = (resetTimestamp: number): string => {
  const resetDate = new Date(resetTimestamp * 1000);
  const now = new Date();
  const diffMs = resetDate.getTime() - now.getTime();
  const diffMins = Math.ceil(diffMs / 60000);

  if (diffMins <= 1) return 'less than a minute';
  return `${diffMins} minutes`;
};
