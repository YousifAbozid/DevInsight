import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGithubUser,
  useUserRepositories,
  aggregateLanguageData,
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

export default function GithubProfilePage() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState<string | undefined>();

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

  const errorMessage = isUserError
    ? userError instanceof Error
      ? userError.message
      : 'An error occurred'
    : null;

  const languageData = repositories ? aggregateLanguageData(repositories) : [];

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

      <GithubProfileSearch onSearch={handleSearch} isLoading={isUserLoading} />

      {isUserLoading ? (
        <ProfileSkeleton />
      ) : errorMessage ? (
        <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-4 rounded">
          <p className="text-accent-danger">{errorMessage}</p>
        </div>
      ) : user ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <GithubProfileCard user={user} />
            <Link
              to={`/${user.login}`}
              className="px-4 py-2 bg-accent-1 hover:bg-accent-2 text-l-text-inv dark:text-d-text-inv rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              View Public Profile
            </Link>
          </div>

          {/* Personalized Summary */}
          <PersonalizedSummary
            user={user}
            repositories={repositories}
            contributionData={contributionData}
            loading={isReposLoading || isContributionLoading}
          />

          {/* Dev Card Generator - NEW */}
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

          {/* Language pie chart */}
          {isReposLoading ? (
            <LanguageChartSkeleton />
          ) : (
            <LanguagePieChart data={languageData} loading={isReposLoading} />
          )}

          {/* Contribution heatmap */}
          {username && (
            <ContributionHeatmap username={username} token={token} />
          )}
        </div>
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
