import { useState } from 'react';
import { Icons } from '../shared/Icons';
import {
  useUserPullRequests,
  useUserIssues,
} from '../../services/githubService';
import { useGithubToken } from '../../hooks/useStorage';
import { Badge } from '../DevCardGenerator';

interface GithubThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function GithubTheme({
  user,
  repositories,
  languageData,
  badges,
}: GithubThemeProps) {
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

  // Filter to show only earned badges and sort by tier
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

  // Helper function for badge accent style
  const getGitHubBadgeAccent = (tier: string): string => {
    switch (tier) {
      case 'bronze':
        return 'border border-[#CD7F32]/30';
      case 'silver':
        return 'border border-[#C0C0C0]/30';
      case 'gold':
        return 'border border-[#FFD700]/30';
      case 'platinum':
        return 'border border-[#E5E4E2]/30';
      default:
        return '';
    }
  };

  return (
    <div
      className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md w-full max-w-md shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with avatar and user info */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className={`w-16 h-16 rounded-full mx-auto sm:mx-0 transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
        />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {user.name || user.login}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-1">
            <Icons.GitHub className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            @{user.login}
          </p>
          {user.bio && (
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {user.bio.length > 100
                ? `${user.bio.substring(0, 100)}...`
                : user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
              <Icons.Folder className="w-4 h-4" />
              <span className="text-xs font-medium">Repos</span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {repoCount}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
              <Icons.Star className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium">Stars</span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {starCount}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
              <Icons.Network className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium">Forks</span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {forkCount}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 py-3 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
              <Icons.Users className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span className="text-xs font-medium">Followers</span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {user.followers}
            </div>
          </div>
        </div>

        {/* GitHub Stats Section with PRs and Issues */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
              <Icons.GitPullRequest className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Pull Requests
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {isPRsLoading ? '...' : pullRequests}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md">
              <Icons.AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Issues
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {isIssuesLoading ? '...' : issues}
              </div>
            </div>
          </div>
        </div>

        {/* Languages Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <Icons.Folder className="w-4 h-4" />
              <span className="text-sm font-semibold">Languages</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {languageData.length} total
            </span>
          </div>

          <div className="h-2 flex rounded-full overflow-hidden shadow-sm">
            {topLanguages.map((lang, index) => (
              <div
                key={lang.name}
                className={`h-full ${index === 0 ? 'rounded-l-full' : ''} ${
                  index === topLanguages.length - 1 ? 'rounded-r-full' : ''
                } hover:brightness-110 transition-all duration-200`}
                style={{
                  backgroundColor: lang.color,
                  width: `${lang.percentage}%`,
                }}
                title={`${lang.name}: ${lang.percentage}%`}
              />
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {topLanguages.map(lang => (
              <div
                key={lang.name}
                className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                {lang.name}{' '}
                <span className="text-gray-500 dark:text-gray-400">
                  {lang.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Section with improved display */}
      {hasBadges && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Icons.Medal className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" />
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
                className={`px-2.5 py-1.5 text-xs rounded-full flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${getGitHubBadgeAccent(badge.tier)}`}
                title={badge.name}
              >
                <badge.icon className="w-3.5 h-3.5" />
                <span>{badge.name}</span>
              </div>
            ))}
            {hasMoreBadges && (
              <div className="px-2.5 py-1.5 text-xs rounded-full flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Icons.Plus className="w-3.5 h-3.5" />
                <span>{earnedBadges.length - 3} more</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
        <a
          href="https://github.com/YousifAbozid/DevInsight"
          className="hover:text-blue-500 transition-colors"
        >
          Generated with DevInsight
        </a>
      </div>
    </div>
  );
}
