import { useState } from 'react';
import GithubCompareForm from '../components/GithubCompareForm';
import GithubBattleResults from '../components/GithubBattleResults';
import { useGithubUser, useUserRepositories } from '../services/githubService';
import { useContributionData } from '../services/githubGraphQLService';
import { Icons } from '../components/shared/Icons';
import { useGithubToken } from '../hooks/useStorage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

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

      {isLoading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-1"></div>
        </div>
      )}

      {/* Type mismatch error */}
      {!isLoading && typeMismatch && (
        <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-6 rounded-lg my-6">
          <div className="flex items-start gap-4">
            <div className="text-accent-danger">
              <Icons.AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-accent-danger mb-2">
                Type Mismatch Error
              </h3>
              <p className="text-accent-danger mb-2">
                Cannot compare a GitHub {user1Type} with a GitHub {user2Type}.
              </p>
              <p className="text-accent-danger mb-4">
                Please select two {user1Type}s or two {user2Type}s to battle.
              </p>

              <div className="mt-3 text-sm text-accent-danger/80">
                <p>Please try one of the following:</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>Compare two user accounts</li>
                  <li>Compare two organization accounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasError && (
        <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-6 rounded-lg my-6">
          <div className="flex items-start gap-4">
            <div className="text-accent-danger">
              <Icons.AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-accent-danger mb-2">
                Battle Error
              </h3>

              {user1ErrorType === 'not_found' && (
                <p className="text-accent-danger mb-2">
                  User <span className="font-bold">{usernames?.user1}</span> was
                  not found. Please check the spelling and try again.
                </p>
              )}

              {user2ErrorType === 'not_found' && (
                <p className="text-accent-danger mb-2">
                  User <span className="font-bold">{usernames?.user2}</span> was
                  not found. Please check the spelling and try again.
                </p>
              )}

              {user1ErrorType === 'rate_limit' ||
                (user2ErrorType === 'rate_limit' && (
                  <p className="text-accent-danger mb-2">
                    GitHub API rate limit exceeded. Please try again later or
                    use a personal access token.
                  </p>
                ))}

              {!user1ErrorType && !user2ErrorType && (
                <p className="text-accent-danger mb-2">
                  {user1Error instanceof Error
                    ? user1Error.message
                    : user2Error instanceof Error
                      ? user2Error.message
                      : 'An error occurred'}
                </p>
              )}

              <div className="mt-3 text-sm text-accent-danger/80">
                <p>Possible solutions:</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  {(user1ErrorType === 'not_found' ||
                    user2ErrorType === 'not_found') && (
                    <li>Double-check the username spelling</li>
                  )}
                  {(user1ErrorType === 'rate_limit' ||
                    user2ErrorType === 'rate_limit') && (
                    <li>
                      Add your GitHub personal access token to increase rate
                      limits
                    </li>
                  )}
                  <li>
                    Try again in a few minutes if GitHub API is experiencing
                    issues
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
