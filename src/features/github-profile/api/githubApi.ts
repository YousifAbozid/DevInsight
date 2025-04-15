import { GithubUser } from '../types/github.types';

export async function fetchGithubUser(username: string): Promise<GithubUser> {
  if (!username.trim()) {
    throw new Error('Username cannot be empty');
  }

  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    throw new Error('Failed to fetch user data');
  }

  return await response.json();
}
