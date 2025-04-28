import { useState } from 'react';
import GithubCompareForm from '../components/battle/GithubCompareForm';
import GithubBattleResults from '../components/battle/GithubBattleResults';
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

      {/* Type mismatch error - Enhanced UI */}
      {!isLoading && typeMismatch && (
        <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-6 rounded-lg my-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="text-accent-danger">
              <Icons.AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-accent-danger mb-2 flex items-center gap-2">
                <Icons.SwitchHorizontal className="w-5 h-5" />
                Type Mismatch Error
              </h3>

              <div className="p-4 bg-accent-danger/5 rounded-lg mb-4 border border-accent-danger/20">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-accent-danger mb-2">
                  <div className="flex items-center gap-1.5">
                    <Icons.User className="w-5 h-5" />
                    <span className="font-semibold">{usernames?.user1}</span>
                    <span className="bg-accent-danger/20 text-accent-danger text-xs rounded-full px-2 py-0.5">
                      {user1Type}
                    </span>
                  </div>

                  <Icons.Close className="hidden sm:block w-5 h-5 mx-2" />

                  <div className="flex items-center gap-1.5">
                    <Icons.Building className="w-5 h-5" />
                    <span className="font-semibold">{usernames?.user2}</span>
                    <span className="bg-accent-danger/20 text-accent-danger text-xs rounded-full px-2 py-0.5">
                      {user2Type}
                    </span>
                  </div>
                </div>

                <p className="text-accent-danger/90 text-sm">
                  Cannot compare a GitHub {user1Type} with a GitHub {user2Type}.
                  These entity types have different metrics and scoring systems.
                </p>
              </div>

              <p className="text-accent-danger font-medium mb-3 flex items-center">
                <Icons.Info className="w-4 h-4 mr-2 flex-shrink-0" />
                Please select two entities of the same type to battle.
              </p>

              <div className="mt-3 text-sm bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/40 dark:border-border-d/40">
                <p className="font-medium mb-3 text-l-text-1 dark:text-d-text-1 flex items-center">
                  <Icons.Check className="w-4 h-4 mr-2 text-accent-success" />
                  Valid combinations:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* User vs User option */}
                  <div className="flex items-center gap-2 bg-l-bg-2 dark:bg-d-bg-2 p-3 rounded-lg border border-border-l/40 dark:border-border-d/40 hover:border-accent-success hover:shadow-sm transition-all">
                    <div className="flex items-center gap-1.5 bg-accent-success/10 p-1.5 rounded-md">
                      <Icons.User className="w-4 h-4 text-accent-1" />
                      <span className="font-medium">User</span>
                    </div>
                    <Icons.ArrowRight className="w-4 h-4 text-l-text-3 dark:text-d-text-3" />
                    <div className="flex items-center gap-1.5 bg-accent-success/10 p-1.5 rounded-md">
                      <Icons.User className="w-4 h-4 text-accent-1" />
                      <span className="font-medium">User</span>
                    </div>
                  </div>

                  {/* Org vs Org option */}
                  <div className="flex items-center gap-2 bg-l-bg-2 dark:bg-d-bg-2 p-3 rounded-lg border border-border-l/40 dark:border-border-d/40 hover:border-accent-success hover:shadow-sm transition-all">
                    <div className="flex items-center gap-1.5 bg-accent-success/10 p-1.5 rounded-md">
                      <Icons.Building className="w-4 h-4 text-accent-1" />
                      <span className="font-medium">Organization</span>
                    </div>
                    <Icons.ArrowRight className="w-4 h-4 text-l-text-3 dark:text-d-text-3" />
                    <div className="flex items-center gap-1.5 bg-accent-success/10 p-1.5 rounded-md">
                      <Icons.Building className="w-4 h-4 text-accent-1" />
                      <span className="font-medium">Organization</span>
                    </div>
                  </div>
                </div>

                {/* Current invalid match */}
                <div className="mt-4 border-t border-border-l/30 dark:border-border-d/30 pt-4">
                  <p className="font-medium mb-3 text-l-text-1 dark:text-d-text-1 flex items-center">
                    <Icons.Close className="w-4 h-4 mr-2 text-accent-danger" />
                    Your invalid selection:
                  </p>

                  <div className="flex items-center justify-center gap-3 bg-accent-danger/5 p-3 rounded-lg border border-accent-danger/20">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mb-1 border-2 border-accent-danger/30">
                        <img
                          src={user1?.avatar_url}
                          alt={usernames?.user1}
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${usernames?.user1}&background=random`;
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {user1Type === 'organization' ? (
                          <Icons.Building className="w-3.5 h-3.5 text-accent-danger" />
                        ) : (
                          <Icons.User className="w-3.5 h-3.5 text-accent-danger" />
                        )}
                        <span className="font-medium text-xs">
                          {usernames?.user1}
                        </span>
                      </div>
                      <span className="text-xs bg-accent-danger/20 text-accent-danger px-2 py-0.5 mt-1 rounded-full">
                        {user1Type}
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <Icons.Close className="w-6 h-6 text-accent-danger" />
                      <span className="text-xs text-accent-danger mt-1">
                        Incompatible
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mb-1 border-2 border-accent-danger/30">
                        <img
                          src={user2?.avatar_url}
                          alt={usernames?.user2}
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${usernames?.user2}&background=random`;
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {user2Type === 'organization' ? (
                          <Icons.Building className="w-3.5 h-3.5 text-accent-danger" />
                        ) : (
                          <Icons.User className="w-3.5 h-3.5 text-accent-danger" />
                        )}
                        <span className="font-medium text-xs">
                          {usernames?.user2}
                        </span>
                      </div>
                      <span className="text-xs bg-accent-danger/20 text-accent-danger px-2 py-0.5 mt-1 rounded-full">
                        {user2Type}
                      </span>
                    </div>
                  </div>
                </div>
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
