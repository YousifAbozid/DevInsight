import { useState } from 'react';
import { fetchGithubUser } from './api/githubApi';
import { GithubUser } from './types/github.types';
import GithubProfileCard from './components/GithubProfileCard';
import GithubProfileSearch from './components/GithubProfileSearch';
import ProfileSkeleton from './components/ProfileSkeleton';

export default function GithubProfilePage() {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await fetchGithubUser(username);
      setUser(userData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch GitHub user. Please try again.'
      );
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-l-text-1 dark:text-d-text-1 mb-2">
          GitHub Profile Explorer
        </h1>
        <p className="text-l-text-2 dark:text-d-text-2">
          Enter a GitHub username to view their profile information
        </p>
      </div>

      <GithubProfileSearch onSearch={handleSearch} isLoading={isLoading} />

      {isLoading ? (
        <ProfileSkeleton />
      ) : error ? (
        <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-4 rounded">
          <p className="text-accent-danger">{error}</p>
        </div>
      ) : user ? (
        <GithubProfileCard user={user} />
      ) : (
        <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d text-center">
          <p className="text-l-text-2 dark:text-d-text-2">
            Search for a GitHub user above to see their profile details
          </p>
        </div>
      )}
    </div>
  );
}
