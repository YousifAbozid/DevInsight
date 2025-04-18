import { useState } from 'react';
import GithubCompareForm from '../components/GithubCompareForm';
import GithubBattleResults from '../components/GithubBattleResults';
import { useGithubUser, useUserRepositories } from '../services/githubService';
import { useContributionData } from '../services/githubGraphQLService';

export default function GitHubBattlePage() {
  const [usernames, setUsernames] = useState<{
    user1: string;
    user2: string;
  } | null>(null);
  const [token, setToken] = useState<string | undefined>(
    localStorage.getItem('github_token') || undefined
  );

  // User 1 data queries
  const {
    data: user1,
    isLoading: isUser1Loading,
    error: user1Error,
  } = useGithubUser(usernames?.user1 || '');

  const { data: user1Repos, isLoading: isUser1ReposLoading } =
    useUserRepositories(usernames?.user1 || '');

  const { data: user1ContributionData, isLoading: isUser1ContributionLoading } =
    useContributionData(usernames?.user1 || '', token);

  // User 2 data queries
  const {
    data: user2,
    isLoading: isUser2Loading,
    error: user2Error,
  } = useGithubUser(usernames?.user2 || '');

  const { data: user2Repos, isLoading: isUser2ReposLoading } =
    useUserRepositories(usernames?.user2 || '');

  const { data: user2ContributionData, isLoading: isUser2ContributionLoading } =
    useContributionData(usernames?.user2 || '', token);

  const handleCompare = (
    user1: string,
    user2: string,
    accessToken?: string
  ) => {
    setUsernames({ user1, user2 });
    if (accessToken) {
      setToken(accessToken);
      localStorage.setItem('github_token', accessToken);
    }
  };

  const isLoading =
    isUser1Loading ||
    isUser1ReposLoading ||
    isUser1ContributionLoading ||
    isUser2Loading ||
    isUser2ReposLoading ||
    isUser2ContributionLoading;

  const hasError = !!user1Error || !!user2Error;
  const errorMessage = user1Error || user2Error;

  const showResults =
    usernames &&
    user1 &&
    user2 &&
    user1Repos &&
    user2Repos &&
    !isLoading &&
    !hasError;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-l-text-1 dark:text-d-text-1 mb-2">
          GitHub Battle ⚔️
        </h1>
        <p className="text-l-text-2 dark:text-d-text-2 text-base md:text-lg">
          Compare two GitHub users and see who comes out on top
        </p>
      </div>

      <GithubCompareForm
        onCompare={handleCompare}
        isLoading={isLoading}
        initialToken={token}
      />

      {isLoading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-1"></div>
        </div>
      )}

      {hasError && (
        <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-4 rounded my-6">
          <p className="text-accent-danger">
            {errorMessage instanceof Error
              ? errorMessage.message
              : 'An error occurred'}
          </p>
        </div>
      )}

      {showResults && (
        <GithubBattleResults
          user1={{
            user: user1,
            repositories: user1Repos,
            contributionData: user1ContributionData,
          }}
          user2={{
            user: user2,
            repositories: user2Repos,
            contributionData: user2ContributionData,
          }}
        />
      )}
    </div>
  );
}
