import { useState } from 'react';
import { Icons } from '../shared/Icons';
import {
  useUserPullRequests,
  useUserIssues,
} from '../../services/githubService';
import { useGithubToken } from '../../hooks/useStorage';
import { Badge } from '../DevCardGenerator';

interface DefaultThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function DefaultTheme({
  user,
  repositories,
  languageData,
  badges,
}: DefaultThemeProps) {
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

  // Helper function for badge background class
  const getBadgeBgClass = (tier: string): string => {
    switch (tier) {
      case 'bronze':
        return 'bg-[#CD7F32]/10 text-[#CD7F32] dark:bg-[#CD7F32]/30 dark:text-[#CD7F32]';
      case 'silver':
        return 'bg-[#8E8E93]/10 text-[#8E8E93] dark:bg-[#8E8E93]/30 dark:text-[#C8C8C8]';
      case 'gold':
        return 'bg-[#FFD700]/10 text-[#FFD700] dark:bg-[#FFD700]/30 dark:text-[#FFD700]';
      case 'platinum':
        return 'bg-[#8A9BA8]/10 text-[#8A9BA8] dark:bg-[#8A9BA8]/30 dark:text-[#B8C5D0]';
      default:
        return 'bg-l-bg-3 dark:bg-d-bg-3';
    }
  };

  return (
    <div
      className="p-6 bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border border-border-l dark:border-border-d w-full max-w-md shadow-sm hover:shadow transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with avatar and user info */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent-1/10 blur-sm transform scale-110"></div>
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className={`w-20 h-20 rounded-full border-2 border-accent-1 relative z-10 transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
            {user.name || user.login}
          </h2>
          <a
            href={`https://github.com/${user.login}`}
            className="text-accent-1 hover:underline flex items-center justify-center sm:justify-start gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icons.GitHub className="w-3.5 h-3.5" />@{user.login}
          </a>
          {user.bio && (
            <p className="mt-2 text-sm text-l-text-2 dark:text-d-text-2 bg-l-bg-1/50 dark:bg-d-bg-1/50 p-2 rounded-lg line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-lg text-center hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors">
          <div className="flex justify-center mb-2 text-accent-1">
            <Icons.Folder className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-l-text-1 dark:text-d-text-1">
            {repoCount}
          </div>
          <div className="text-xs text-l-text-3 dark:text-d-text-3">Repos</div>
        </div>
        <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-lg text-center hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors">
          <div className="flex justify-center mb-2 text-yellow-500 dark:text-yellow-400">
            <Icons.Star className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-l-text-1 dark:text-d-text-1">
            {starCount}
          </div>
          <div className="text-xs text-l-text-3 dark:text-d-text-3">Stars</div>
        </div>
        <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-lg text-center hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors">
          <div className="flex justify-center mb-2 text-green-500 dark:text-green-400">
            <Icons.Network className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-l-text-1 dark:text-d-text-1">
            {forkCount}
          </div>
          <div className="text-xs text-l-text-3 dark:text-d-text-3">Forks</div>
        </div>
        <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-lg text-center hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors">
          <div className="flex justify-center mb-2 text-blue-500 dark:text-blue-400">
            <Icons.Users className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-l-text-1 dark:text-d-text-1">
            {user.followers}
          </div>
          <div className="text-xs text-l-text-3 dark:text-d-text-3">
            Followers
          </div>
        </div>
      </div>

      {/* Activity Stats - PRs and Issues */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-lg flex items-center gap-3 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors">
          <div className="p-2 bg-accent-1/10 rounded-lg">
            <Icons.GitPullRequest className="w-5 h-5 text-accent-1" />
          </div>
          <div>
            <div className="text-sm font-medium text-l-text-1 dark:text-d-text-1">
              Pull Requests
            </div>
            <div className="text-lg font-bold text-accent-1">
              {isPRsLoading ? '...' : pullRequests}
            </div>
          </div>
        </div>
        <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-lg flex items-center gap-3 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors">
          <div className="p-2 bg-accent-2/10 rounded-lg">
            <Icons.AlertCircle className="w-5 h-5 text-accent-2" />
          </div>
          <div>
            <div className="text-sm font-medium text-l-text-1 dark:text-d-text-1">
              Issues
            </div>
            <div className="text-lg font-bold text-accent-2">
              {isIssuesLoading ? '...' : issues}
            </div>
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="mt-5">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-l-text-1 dark:text-d-text-1 flex items-center gap-1.5">
            <Icons.Code className="w-4 h-4 text-l-text-2 dark:text-d-text-2" />
            Top Languages
          </div>
          <div className="text-xs text-l-text-3 dark:text-d-text-3">
            {languageData.length} total
          </div>
        </div>

        <div className="h-2.5 flex rounded-full overflow-hidden mb-3">
          {topLanguages.map((lang, index) => (
            <div
              key={lang.name}
              className={`h-full ${index === 0 ? 'rounded-l-full' : ''} ${
                index === topLanguages.length - 1 ? 'rounded-r-full' : ''
              } transition-all duration-300 hover:brightness-110`}
              style={{
                backgroundColor: lang.color,
                width: `${lang.percentage}%`,
              }}
              title={`${lang.name}: ${lang.percentage}%`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {topLanguages.map(lang => (
            <div
              key={lang.name}
              className="flex items-center justify-between p-2 bg-l-bg-1 dark:bg-d-bg-1 rounded-md hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <div className="text-sm text-l-text-2 dark:text-d-text-2">
                  {lang.name}
                </div>
              </div>
              <div className="font-medium text-l-text-1 dark:text-d-text-1">
                {lang.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Section with improved display */}
      {hasBadges && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-l-text-1 dark:text-d-text-1 flex items-center gap-1.5">
              <Icons.Medal className="w-4 h-4 text-accent-1" />
              Developer Achievements
            </div>
            <span className="text-xs px-1.5 py-0.5 bg-accent-1/10 text-accent-1 rounded-full">
              {earnedBadges.length} earned
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayBadges.map(badge => (
              <div
                key={badge.id}
                className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 ${getBadgeBgClass(badge.tier)} hover:scale-105 transition-transform duration-200`}
                title={badge.name}
              >
                <badge.icon className="w-4 h-4" />
                <span className="text-xs font-medium">{badge.name}</span>
              </div>
            ))}
            {hasMoreBadges && (
              <div className="px-2.5 py-1.5 rounded-md flex items-center gap-1.5 bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors">
                <Icons.Plus className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {earnedBadges.length - 3} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 pt-3 border-t border-border-l dark:border-border-d text-center">
        <div className="text-xs text-l-text-3 dark:text-d-text-3">
          Generated with
          <a
            href="https://github.com/YousifAbozid/DevInsight"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-accent-1 hover:underline"
          >
            DevInsight
          </a>
        </div>
      </div>
    </div>
  );
}
