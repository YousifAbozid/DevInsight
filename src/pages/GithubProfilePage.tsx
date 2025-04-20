import { useState, useRef } from 'react';
import {
  useGithubUser,
  useUserRepositories,
  aggregateLanguageData,
  // saveAllGithubData,
  saveUserData,
  saveRepositoriesData,
} from '../services/githubService';
import GithubProfileCard from '../components/GithubProfileCard';
import GithubProfileSearch from '../components/GithubProfileSearch';
import ProfileSkeleton from '../components/ProfileSkeleton';
import LanguagePieChart from '../components/LanguagePieChart';
import LanguageChartSkeleton from '../components/LanguageChartSkeleton';
import ContributionHeatmap from '../components/ContributionHeatmap';
import MostStarredRepos from '../components/MostStarredRepos';
import DeveloperBadges from '../components/DeveloperBadges';
import PersonalizedSummary from '../components/PersonalizedSummary';
import { useContributionData } from '../services/githubGraphQLService';
import DevCardGenerator from '../components/DevCardGenerator';
import CoderPersona from '../components/CoderPersona';
import DevJourneyTimeline from '../components/DevJourneyTimeline';
import RepoRecommender from '../components/RepoRecommender';

export default function GithubProfilePage() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState<string | undefined>();
  const searchRef = useRef<{
    setRecentUsers: (users: string[]) => void;
  } | null>(null);

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
    isError: isUserError,
  } = useGithubUser(username);

  const { data: repositories, isLoading: isReposLoading } =
    useUserRepositories(username);

  const { data: contributionData, isLoading: isContributionLoading } =
    useContributionData(username, token);

  const handleSearch = (searchUsername: string, accessToken?: string) => {
    setUsername(searchUsername);
    setToken(accessToken);
  };

  // New function to handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    // Update username for component state
    setUsername(suggestion);

    // Save to localStorage and recent searches
    localStorage.setItem('github_username', suggestion);

    // Update the recent users list in localStorage
    const savedRecentUsers = localStorage.getItem('recent_github_users');
    let recentUsers: string[] = [];

    if (savedRecentUsers) {
      try {
        recentUsers = JSON.parse(savedRecentUsers);
      } catch (e) {
        console.error('Failed to parse recent users', e);
      }
    }

    // Add the suggestion to recent users if not already there
    const updatedRecentUsers = [...new Set([suggestion, ...recentUsers])].slice(
      0,
      5
    ); // Keep only 5 most recent

    // Save updated recent users
    localStorage.setItem(
      'recent_github_users',
      JSON.stringify(updatedRecentUsers)
    );

    // Use existing search handler to perform the search
    handleSearch(suggestion, token);

    // If searchRef exists, manually update its internal state
    if (searchRef.current?.setRecentUsers) {
      searchRef.current.setRecentUsers(updatedRecentUsers);
    }
  };

  const errorMessage = isUserError
    ? userError instanceof Error
      ? userError.message
      : 'An error occurred'
    : null;

  const languageData = repositories ? aggregateLanguageData(repositories) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-l-text-1 dark:text-d-text-1 mb-2">
          GitHub Profile Explorer
        </h1>
        <p className="text-l-text-2 dark:text-d-text-2">
          Enter a GitHub username to view their profile information
        </p>
      </div>

      <GithubProfileSearch
        onSearch={handleSearch}
        isLoading={isUserLoading}
        ref={searchRef}
      />

      {isUserLoading ? (
        <ProfileSkeleton />
      ) : errorMessage ? (
        <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-4 rounded">
          <p className="text-accent-danger">{errorMessage}</p>
        </div>
      ) : user ? (
        <div className="space-y-8">
          <GithubProfileCard
            user={user}
            publicProfileUrl={`/${user.login}`}
            onSaveUserData={() => saveUserData(user)}
            onSaveReposData={() =>
              repositories && saveRepositoriesData(user.login, repositories)
            }
            hasRepositories={!!repositories && repositories.length > 0}
          />

          {/* Personalized Summary */}
          <PersonalizedSummary
            user={user}
            repositories={repositories}
            contributionData={contributionData}
            loading={isReposLoading || isContributionLoading}
          />

          {/* Dev Journey Timeline - NEW COMPONENT */}
          <DevJourneyTimeline
            user={user}
            repositories={repositories}
            contributionData={contributionData}
            loading={isReposLoading || isContributionLoading}
          />

          {/* Coder Persona */}
          <CoderPersona
            user={user}
            repositories={repositories}
            contributionData={contributionData}
            loading={isReposLoading || isContributionLoading}
          />

          {/* Dev Card Generator */}
          <DevCardGenerator
            user={user}
            repositories={repositories}
            languageData={languageData}
            badges={[]}
          />

          {/* Developer badges */}
          <DeveloperBadges
            user={user}
            repositories={repositories}
            contributionData={contributionData}
            loading={isReposLoading || isContributionLoading}
          />

          {/* Most starred repositories */}
          <MostStarredRepos
            repositories={repositories}
            loading={isReposLoading}
          />

          {/* Recommended repositories */}
          <RepoRecommender
            repositories={repositories}
            loading={isReposLoading}
            token={token}
          />

          {/* Language pie chart */}
          {isReposLoading ? (
            <LanguageChartSkeleton />
          ) : (
            <LanguagePieChart data={languageData} loading={isReposLoading} />
          )}

          {/* Contribution heatmap */}
          {username && (
            <ContributionHeatmap
              username={username}
              token={token}
              userCreatedAt={user?.created_at}
            />
          )}
        </div>
      ) : (
        <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-8 border border-border-l dark:border-border-d">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="p-4 bg-accent-1/10 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-accent-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </div>

            <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
              Discover Developer Insights
            </h2>

            <p className="text-l-text-2 dark:text-d-text-2 max-w-md">
              Enter a GitHub username above to explore their profile,
              repositories, contribution history, and generate personalized
              insights.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
              <div className="bg-l-bg-3 dark:bg-d-bg-3 p-4 rounded-lg">
                <h3 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2">
                  What You&apos;ll See
                </h3>
                <ul className="text-sm text-l-text-2 dark:text-d-text-2 space-y-1">
                  <li>• Language distribution</li>
                  <li>• Contribution patterns</li>
                  <li>• Developer badges</li>
                  <li>• Developer persona</li>
                  <li>• Personalized stats</li>
                </ul>
              </div>

              <div className="bg-l-bg-3 dark:bg-d-bg-3 p-4 rounded-lg">
                <h3 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2">
                  Try These Profiles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'torvalds',
                    'gaearon',
                    'yyx990803',
                    'sindresorhus',
                    'ThePrimeagen',
                  ].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-2 py-1 text-xs bg-accent-1/10 hover:bg-accent-1/20 text-accent-1 rounded-md transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-sm text-l-text-3 dark:text-d-text-3 mt-2 bg-l-bg-3/50 dark:bg-d-bg-3/50 p-2 rounded-md inline-block">
              💡 Add a GitHub token for access to more detailed contribution
              data
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
