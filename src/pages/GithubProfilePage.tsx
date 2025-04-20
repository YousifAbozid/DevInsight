import { useState } from 'react';
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d text-center">
          <p className="text-l-text-2 dark:text-d-text-2">
            Search for a GitHub user above to see their profile details
          </p>
        </div>
      )}
    </div>
  );
}
