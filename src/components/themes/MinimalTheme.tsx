import { useState } from 'react';
import { Icons } from '../shared/Icons';
import {
  useUserPullRequests,
  useUserIssues,
} from '../../services/githubService';
import { useGithubToken } from '../../hooks/useStorage';
import { Badge } from '../DevCardGenerator';

interface MinimalThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function MinimalTheme({
  user,
  repositories,
  languageData,
  badges,
}: MinimalThemeProps) {
  // Select only top 5 languages
  const topLanguages = languageData.slice(0, 5);
  const [isHovered, setIsHovered] = useState(false);
  const [token] = useGithubToken();

  // Get PR and issue counts using React Query hooks
  const { data: pullRequests = 0, isLoading: isPRsLoading } =
    useUserPullRequests(user.login, token);
  const { data: issues = 0, isLoading: isIssuesLoading } = useUserIssues(
    user.login,
    token
  );

  // Total repositories count
  const repoCount = repositories?.length || 0;
  const starCount =
    repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0;
  const forkCount =
    repositories?.reduce((sum, repo) => sum + repo.forks_count, 0) || 0;

  // Filter to show only earned badges and sort by tier (platinum > gold > silver > bronze)
  const earnedBadges = badges?.filter(badge => badge.earned) || [];
  const tierValue = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 4;
      case 'gold':
        return 3;
      case 'silver':
        return 2;
      case 'bronze':
        return 1;
      default:
        return 0;
    }
  };

  // Sort badges by tier (highest first)
  const sortedBadges = [...earnedBadges].sort(
    (a, b) => tierValue(b.tier) - tierValue(a.tier)
  );

  // Only show top 3 highest tier badges in card
  const displayBadges = sortedBadges.slice(0, 3);
  const hasBadges = earnedBadges.length > 0;
  const hasMoreBadges = earnedBadges.length > 3;

  // Helper function to get badge color class
  const getBadgeColor = (tier: string): string => {
    switch (tier) {
      case 'bronze':
        return 'bg-[#CD7F32]';
      case 'silver':
        return 'bg-[#C0C0C0]';
      case 'gold':
        return 'bg-[#FFD700]';
      case 'platinum':
        return 'bg-[#E5E4E2]';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div
      className="p-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-md shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* User header section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative mx-auto sm:mx-0">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {user.name || user.login}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start">
            <Icons.GitHub className="w-3.5 h-3.5 mr-1 text-gray-500 dark:text-gray-400" />
            @{user.login}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 mr-1">
              <Icons.Folder className="w-4 h-4" />
            </span>
            {repoCount}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Repos
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">
            <span className="text-yellow-500 dark:text-yellow-400 mr-1">
              <Icons.Star className="w-4 h-4" />
            </span>
            {starCount}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Stars
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">
            <span className="text-blue-500 dark:text-blue-400 mr-1">
              <Icons.Network className="w-4 h-4" />
            </span>
            {forkCount}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Forks
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">
            <span className="text-purple-500 dark:text-purple-400 mr-1">
              <Icons.Users className="w-4 h-4" />
            </span>
            {user.followers}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Followers
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-between">
          <div className="flex items-center">
            <Icons.GitPullRequest className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              PRs
            </span>
          </div>
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {isPRsLoading ? '...' : pullRequests}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-between">
          <div className="flex items-center">
            <Icons.AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Issues
            </span>
          </div>
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {isIssuesLoading ? '...' : issues}
          </span>
        </div>
      </div>

      {/* Languages Section */}
      <div className="mt-5 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-800 dark:text-gray-200 font-medium">
          <span>Languages</span>
          <span className="text-gray-500 dark:text-gray-400">
            {topLanguages.length} used
          </span>
        </div>
        <div className="h-2 flex rounded-full overflow-hidden">
          {topLanguages.map(lang => (
            <div
              key={lang.name}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 hover:translate-y-[-1px]"
              style={{
                backgroundColor: lang.color,
                width: `${lang.percentage}%`,
              }}
              title={`${lang.name}: ${lang.percentage}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
          {topLanguages.map(lang => (
            <div
              key={lang.name}
              className="flex items-center text-xs text-gray-600 dark:text-gray-400"
            >
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: lang.color }}
              />
              {lang.name}{' '}
              <span className="opacity-70 ml-1">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Section with improved display */}
      {hasBadges && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Icons.Medal className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
              Developer Achievements
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {earnedBadges.length} earned
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayBadges.map(badge => (
              <div
                key={badge.id}
                className={`px-2 py-1 rounded-full flex items-center gap-1.5 ${getBadgeColor(badge.tier)} transition-transform hover:scale-105 duration-200 shadow-sm bg-opacity-10 dark:bg-opacity-20`}
                title={badge.name}
              >
                <badge.icon className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  {badge.name}
                </span>
              </div>
            ))}
            {hasMoreBadges && (
              <div className="px-2 py-1 rounded-full flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 transition-transform hover:scale-105 duration-200 shadow-sm">
                <Icons.Plus className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">
                  {earnedBadges.length - 3} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400">
        Generated with{' '}
        <a
          href="https://github.com/YousifAbozid/DevInsight"
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          DevInsight
        </a>
      </div>
    </div>
  );
}
