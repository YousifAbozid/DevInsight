import { useState } from 'react';
import GithubCompareForm from '../components/battle/GithubCompareForm';
import GithubBattleResults from '../components/battle/GithubBattleResults';
import { useGithubUser, useUserRepositories } from '../services/githubService';
import { useContributionData } from '../services/githubGraphQLService';
import { useGithubToken } from '../hooks/useStorage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import GithubBattleResultsSkeleton from '../components/shared/Skeletons/GithubBattleResultsSkeleton';
import TypeMismatchError from '../components/battle/TypeMismatchError';
import BattleError from '../components/battle/BattleError';

export default function GitHubBattlePage() {
  const [usernames, setUsernames] = useState<{
    user1: string;
    user2: string;
  } | null>(null);

  // Use the secure hook for token management
  const [token, setToken] = useGithubToken();

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

  const handleCompare = async (
    user1: string,
    user2: string,
    accessToken?: string
  ) => {
    setUsernames({ user1, user2 });
    if (accessToken) {
      try {
        await setToken(accessToken);
      } catch (error) {
        console.error('Error saving token:', error);
      }
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

  // Check if entities are mismatched (user vs org)
  const typeMismatch = user1 && user2 && user1.type !== user2.type;

  // Get entity types for error message
  const user1Type = user1?.type === 'Organization' ? 'organization' : 'user';
  const user2Type = user2?.type === 'Organization' ? 'organization' : 'user';

  // Determine which type of error we have
  const getUserErrorType = (error: unknown) => {
    if (!error) return null;

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('not found')) return 'not_found';
    if (errorMessage.includes('rate limit')) return 'rate_limit';
    return 'generic';
  };

  const user1ErrorType = getUserErrorType(user1Error);
  const user2ErrorType = getUserErrorType(user2Error);

  const showResults =
    usernames &&
    user1 &&
    user2 &&
    user1Repos &&
    user2Repos &&
    !isLoading &&
    !hasError &&
    !typeMismatch; // Add type mismatch check here

  // Update the page title based on the entity type
  const isOrgBattle =
    user1?.type === 'Organization' && user2?.type === 'Organization';

  const battleTitle = isOrgBattle ? 'Organization Battle' : 'User Battle';
  const battleDescription = isOrgBattle
    ? 'Compare two GitHub organizations and see which has more impact'
    : 'Compare two GitHub users and see who comes out on top';

  useDocumentTitle(`GitHub ${battleTitle}`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-l-text-1 dark:text-d-text-1 mb-2">
          GitHub {battleTitle} ⚔️
        </h1>
        <p className="text-l-text-2 dark:text-d-text-2 text-base md:text-lg">
          {battleDescription}
        </p>
      </div>

      <GithubCompareForm
        onCompare={handleCompare}
        isLoading={isLoading}
        initialToken={token}
      />

      {/* Enhanced loading state with skeleton */}
      {isLoading && usernames && <GithubBattleResultsSkeleton />}

      {/* Type mismatch error - Now extracted as a component */}
      {!isLoading && typeMismatch && (
        <TypeMismatchError
          usernames={usernames}
          user1Type={user1Type}
          user2Type={user2Type}
          user1Avatar={user1?.avatar_url}
          user2Avatar={user2?.avatar_url}
        />
      )}

      {/* Battle Error - Now extracted as a component */}
      {!hasError && (
        <BattleError
          usernames={usernames}
          user1ErrorType={user1ErrorType}
          user2ErrorType={user2ErrorType}
          user1Error={user1Error}
          user2Error={user2Error}
        />
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
