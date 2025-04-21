import { useQuery } from '@tanstack/react-query';

// GraphQL query to fetch contribution data
const CONTRIBUTION_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

// Function to fetch contribution data for a specific year
export const fetchContributionData = async (
  username: string,
  token?: string,
  year: number = new Date().getFullYear()
): Promise<ContributionData> => {
  if (!username.trim()) {
    throw new Error('Username cannot be empty');
  }

  // Calculate dates for the specific year
  const from = new Date(year, 0, 1); // January 1st of the specified year
  const to = new Date(year, 11, 31); // December 31st of the specified year

  // Ensure we don't exceed current date
  const now = new Date();
  if (to > now) {
    to.setTime(now.getTime());
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: CONTRIBUTION_QUERY,
      variables: {
        username,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please check your GitHub token.');
    }
    if (response.status === 403) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    throw new Error('Failed to fetch contribution data');
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message || 'GraphQL error occurred');
  }

  return result.data.user.contributionsCollection.contributionCalendar;
};

// Updated hook to fetch data for the selected year
export const useContributionData = (
  username: string,
  token?: string,
  year?: number
) => {
  const selectedYear = year || new Date().getFullYear();

  return useQuery({
    queryKey: ['contributionData', username, selectedYear],
    queryFn: () => fetchContributionData(username, token, selectedYear),
    enabled: !!username.trim() && !!token,
    staleTime: 24 * 60 * 60 * 1000, // Increased from 1 hour to 24 hours
    retry: 1,
  });
};

// Types
export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}
