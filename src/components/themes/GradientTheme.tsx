import { useState } from 'react';
import { Icons } from '../shared/Icons';
import {
  useUserPullRequests,
  useUserIssues,
} from '../../services/githubService';
import { useGithubToken } from '../../hooks/useStorage';
import { Badge } from '../DevCardGenerator';

interface GradientThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function GradientTheme({
  user,
  repositories,
  languageData,
  badges,
}: GradientThemeProps) {
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

  // Helper function for badge gradient highlight
  const getBadgeGradientHighlight = (tier: string): string => {
    switch (tier) {
      case 'bronze':
        return 'border-l-2 border-[#CD7F32]';
      case 'silver':
        return 'border-l-2 border-[#C0C0C0]';
      case 'gold':
        return 'border-l-2 border-[#FFD700]';
      case 'platinum':
        return 'border-l-2 border-[#E5E4E2]';
      default:
        return '';
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 p-6 rounded-lg w-full max-w-md text-white shadow-lg hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-white/10 rounded-full blur-md transform scale-110"></div>
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className={`w-24 h-24 rounded-full border-4 border-white/40 shadow-lg transition-all duration-300 relative z-10 ${isHovered ? 'scale-105' : ''}`}
          />
        </div>

        <h2 className="mt-4 text-xl font-bold text-white">
          {user.name || user.login}
        </h2>
        <p className="text-blue-100 flex items-center justify-center">
          <Icons.GitHub className="w-4 h-4 mr-1 text-blue-200/80" />@
          {user.login}
        </p>

        {user.bio && (
          <p className="mt-3 text-sm text-blue-50/90 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            {user.bio.length > 120
              ? `${user.bio.substring(0, 120)}...`
              : user.bio}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full">
          <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
            <div className="flex justify-center mb-1.5">
              <Icons.Folder className="w-4 h-4 text-blue-200" />
            </div>
            <div className="text-xl font-bold">{repoCount}</div>
            <div className="text-xs text-blue-100/80">Repos</div>
          </div>
          <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
            <div className="flex justify-center mb-1.5">
              <Icons.Star className="w-4 h-4 text-yellow-300" />
            </div>
            <div className="text-xl font-bold">{starCount}</div>
            <div className="text-xs text-blue-100/80">Stars</div>
          </div>
          <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
            <div className="flex justify-center mb-1.5">
              <Icons.Network className="w-4 h-4 text-green-300" />
            </div>
            <div className="text-xl font-bold">{forkCount}</div>
            <div className="text-xs text-blue-100/80">Forks</div>
          </div>
          <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
            <div className="flex justify-center mb-1.5">
              <Icons.Users className="w-4 h-4 text-purple-300" />
            </div>
            <div className="text-xl font-bold">{user.followers}</div>
            <div className="text-xs text-blue-100/80">Followers</div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="w-full mt-5 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-blue-50">
              Contribution Activity
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-blue-500/20 p-2 rounded-lg">
              <Icons.GitPullRequest className="w-5 h-5 text-blue-200" />
              <div>
                <div className="text-lg font-bold">
                  {isPRsLoading ? '...' : pullRequests}
                </div>
                <div className="text-xs text-blue-100/80">Pull Requests</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-purple-500/20 p-2 rounded-lg">
              <Icons.AlertCircle className="w-5 h-5 text-purple-200" />
              <div>
                <div className="text-lg font-bold">
                  {isIssuesLoading ? '...' : issues}
                </div>
                <div className="text-xs text-blue-100/80">Issues</div>
              </div>
            </div>
          </div>
        </div>

        {/* Languages Section */}
        <div className="mt-5 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-50">
              Top Languages
            </span>
            <span className="text-xs text-blue-200/80">
              {languageData.length} total
            </span>
          </div>

          <div className="bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <div className="flex h-full">
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
          </div>

          <div className="mt-2 flex flex-wrap justify-center gap-x-2 gap-y-1.5">
            {topLanguages.map(lang => (
              <div
                key={lang.name}
                className="flex items-center gap-1.5 text-xs bg-white/10 px-2 py-1 rounded-full"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                {lang.name}{' '}
                <span className="text-blue-200/70">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Section with improved display */}
        {hasBadges && (
          <div className="w-full mt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-blue-100 flex items-center">
                <Icons.Medal className="w-4 h-4 mr-1.5 text-blue-200" />
                Developer Achievements
              </span>
              <span className="text-xs text-blue-200">
                {earnedBadges.length} earned
              </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {displayBadges.map(badge => (
                <div
                  key={badge.id}
                  className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all ${getBadgeGradientHighlight(badge.tier)}`}
                  title={badge.name}
                >
                  <badge.icon className="w-4 h-4 text-white" />
                  <span className="text-xs text-white">{badge.name}</span>
                </div>
              ))}
              {hasMoreBadges && (
                <div className="px-2.5 py-1.5 rounded-md flex items-center gap-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <Icons.Plus className="w-4 h-4 text-blue-200" />
                  <span className="text-xs text-white">
                    {earnedBadges.length - 3} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-blue-100/60 flex items-center justify-center gap-1">
          <Icons.GitHub className="w-3 h-3" />
          Generated with DevInsight
        </div>
      </div>
    </div>
  );
}
