import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  aggregateLanguageData,
  saveUserData,
  saveRepositoriesData,
  useBatchUserData, // Added batch data hook
} from '../services/githubService';
import GithubProfileCard from '../components/GithubProfileCard';
import GithubProfileSearch from '../components/GithubProfileSearch';
import GithubProfileCardSkeleton from '../components/shared/Skeletons/GithubProfileCardSkeleton';
import LanguagePieChart from '../components/LanguagePieChart';
import ContributionHeatmap from '../components/ContributionHeatmap';
import MostStarredRepos from '../components/MostStarredRepos';
import DeveloperBadges from '../components/DeveloperBadges';
import PersonalizedSummary from '../components/PersonalizedSummary';
import { useContributionData } from '../services/githubGraphQLService';
import DevCardGenerator from '../components/DevCardGenerator';
import CoderPersona from '../components/CoderPersona';
import DevJourneyTimeline from '../components/DevJourneyTimeline';
import RepoRecommender from '../components/RepoRecommender';
import ProfileErrorState from '../components/ProfileErrorState';
import WelcomeScreen from '../components/WelcomeScreen';

// Import all skeleton components
import PersonalizedSummarySkeleton from '../components/shared/Skeletons/PersonalizedSummarySkeleton';
import DevJourneyTimelineSkeleton from '../components/shared/Skeletons/DevJourneyTimelineSkeleton';
import CoderPersonaSkeleton from '../components/shared/Skeletons/CoderPersonaSkeleton';
import DeveloperBadgesSkeleton from '../components/shared/Skeletons/DeveloperBadgesSkeleton';
import MostStarredReposSkeleton from '../components/shared/Skeletons/MostStarredReposSkeleton';
import RepoRecommenderSkeleton from '../components/shared/Skeletons/RepoRecommenderSkeleton';
import LanguagePieChartSkeleton from '../components/shared/Skeletons/LanguagePieChartSkeleton';
import ContributionHeatmapPageSkeleton from '../components/shared/Skeletons/ContributionHeatmapPageSkeleton';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function GithubProfilePage() {
  useDocumentTitle();
  // Initialize username from localStorage if available
  const [username, setUsername] = useState(() => {
    // If there's no username in localStorage, return empty string
    const storedUsername = localStorage.getItem('github_username') || '';
    return storedUsername;
  });

  const [token, setToken] = useState<string | undefined>(() => {
    return localStorage.getItem('github_token') || undefined;
  });

  const searchRef = useRef<{
    setRecentUsers: (users: string[]) => void;
  } | null>(null);

  const {
    data: batchData,
    isLoading: isBatchLoading,
    error: batchError,
    isError: isBatchError,
  } = useBatchUserData(username, token);

  // For backwards compatibility, keep these variables but derive them from batch data
  const user = batchData?.userData;
  const repositories = batchData?.repositories;

  // Only show loading state when we have a username
  const isUserLoading = isBatchLoading && !!username;
  const isReposLoading = isUserLoading;

  const userError = batchError;
  const isUserError = isBatchError;

  // Fetch contribution data only if we have a username and token
  const { data: contributionData, isLoading: isContributionLoading } =
    useContributionData(username, token);

  // Show welcome screen immediately if there's no username
  const showWelcomeScreen = !username;

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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-accent-1/10 rounded-lg animate-pulse relative">
            <motion.img
              src="/favicon.svg"
              alt="DevInsight Logo"
              className="w-8 h-8 animate-fade-in"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
            {/* Add subtle circle animation behind the logo */}
            <span className="absolute inset-0 bg-accent-1/5 rounded-lg scale-0 animate-[pulse_2s_ease-in-out_infinite]"></span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            <span
              className="text-l-text-1 dark:text-d-text-1 inline-block animate-fade-in-down"
              style={{ animationDelay: '0.1s' }}
            >
              Dev
            </span>
            <span
              className="text-accent-1 inline-block animate-fade-in-down"
              style={{ animationDelay: '0.2s' }}
            >
              Insight
            </span>
            <span
              className="text-l-text-2 dark:text-d-text-2 font-normal text-xl md:text-2xl inline-block animate-fade-in-down"
              style={{ animationDelay: '0.3s' }}
            >
              {' '}
              - GitHub Profile Explorer
            </span>
          </h1>
        </div>
        <p
          className="text-l-text-2 dark:text-d-text-2 pl-1 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          Enter a GitHub username to view their profile information
        </p>
      </div>

      <GithubProfileSearch
        onSearch={handleSearch}
        isLoading={isUserLoading}
        ref={searchRef}
        defaultUsername={username} // Pass the initial username
      />

      {isUserLoading ? (
        // Show all skeleton components during loading
        <div className="space-y-8">
          <GithubProfileCardSkeleton />

          {/* Personalized Summary Skeleton */}
          <PersonalizedSummarySkeleton />

          {/* Dev Journey Timeline Skeleton - Only for regular users */}
          <DevJourneyTimelineSkeleton />

          {/* Coder Persona Skeleton - Only for regular users */}
          <CoderPersonaSkeleton />

          {/* Developer Badges Skeleton - Only for regular users */}
          <DeveloperBadgesSkeleton />

          {/* Most Starred Repos Skeleton */}
          <MostStarredReposSkeleton />

          {/* Repo Recommender Skeleton */}
          <RepoRecommenderSkeleton />

          {/* Language Chart Skeleton */}
          <LanguagePieChartSkeleton />

          {/* Contribution Heatmap Page Skeleton - Only for regular users */}
          <ContributionHeatmapPageSkeleton />
        </div>
      ) : errorMessage ? (
        <ProfileErrorState
          username={username}
          errorType="error"
          errorMessage={errorMessage}
        />
      ) : user ? (
        <div className="space-y-8">
          <GithubProfileCard
            user={user}
            publicProfileUrl={
              user.type === 'Organization'
                ? `/org/${user.login}`
                : `/user/${user.login}`
            }
            onSaveUserData={() => saveUserData(user)}
            onSaveReposData={() =>
              repositories && saveRepositoriesData(user.login, repositories)
            }
            hasRepositories={!!repositories && repositories.length > 0}
            loading={isUserLoading}
          />

          {/* Personalized Summary - For both users and organizations */}
          <PersonalizedSummary
            user={user}
            repositories={repositories}
            contributionData={contributionData}
            loading={isReposLoading || isContributionLoading}
          />

          {/* Dev Journey Timeline - Only for users */}
          {user.type !== 'Organization' && (
            <DevJourneyTimeline
              user={user}
              repositories={repositories}
              contributionData={contributionData}
              loading={isReposLoading || isContributionLoading}
            />
          )}

          {/* Coder Persona - Only for users */}
          {user.type !== 'Organization' && (
            <CoderPersona
              user={user}
              repositories={repositories}
              contributionData={contributionData}
              loading={isReposLoading || isContributionLoading}
            />
          )}

          {/* Dev Card Generator - Only for users */}
          {user.type !== 'Organization' && (
            <DevCardGenerator
              user={user}
              repositories={repositories}
              languageData={languageData}
              badges={[]}
            />
          )}

          {/* Developer badges - Only for users */}
          {user.type !== 'Organization' && (
            <DeveloperBadges
              user={user}
              repositories={repositories}
              contributionData={contributionData}
              loading={isReposLoading || isContributionLoading}
            />
          )}

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

          {/* Language pie chart - For both users and organizations */}
          <LanguagePieChart data={languageData} loading={isReposLoading} />

          {/* Contribution heatmap - Only for user profiles */}
          {user.type !== 'Organization' && (
            <ContributionHeatmap
              username={username}
              token={token}
              userCreatedAt={user?.created_at}
            />
          )}
        </div>
      ) : showWelcomeScreen ? (
        <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
      ) : (
        // Show loading state instead of welcome screen during initial load with stored username
        <div className="space-y-8">
          <GithubProfileCardSkeleton />
          <PersonalizedSummarySkeleton />
          <DevJourneyTimelineSkeleton />
          <CoderPersonaSkeleton />
          <DeveloperBadgesSkeleton />
          <MostStarredReposSkeleton />
          <RepoRecommenderSkeleton />
          <LanguagePieChartSkeleton />
          <ContributionHeatmapPageSkeleton />
        </div>
      )}
    </div>
  );
}
