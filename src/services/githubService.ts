import { useQuery } from '@tanstack/react-query';

export const fetchGithubUser = async (
  username: string
): Promise<GithubUser> => {
  if (!username.trim()) {
    throw new Error('Username cannot be empty');
  }

  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    if (response.status === 403) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    throw new Error('Failed to fetch user data');
  }

  return await response.json();
};

export const useGithubUser = (username: string) => {
  return useQuery({
    queryKey: ['githubUser', username],
    queryFn: () => fetchGithubUser(username),
    enabled: !!username.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
