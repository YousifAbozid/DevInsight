import { Badge } from './DevCardGenerator';
import { useState } from 'react';
import { Icons } from './shared/Icons';
import { useUserPullRequests, useUserIssues } from '../services/githubService';
import { useGithubToken } from '../hooks/useStorage';

interface DevCardProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
  theme: 'default' | 'minimal' | 'gradient' | 'github';
}

export default function DevCard({
  user,
  repositories,
  languageData,
  badges,
  theme,
}: DevCardProps) {
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

  // Ensure badges array isn't empty to fix badge display
  const hasBadges = badges && badges.length > 0;

  // Generate component based on theme
  switch (theme) {
    case 'minimal':
      return (
        <div
          className="p-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-md shadow-sm hover:shadow-md transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 transition-transform duration-300"
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user.name || user.login}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <Icons.GitHub className="w-3.5 h-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                @{user.login}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
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
                  <Icons.Users className="w-4 h-4" />
                </span>
                {user.followers}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Followers
              </div>
            </div>
          </div>

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

          {hasBadges && (
            <div className="mt-4 flex justify-center space-x-2">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${getBadgeColor(badge.tier)} transition-transform hover:scale-110 duration-200 shadow-sm`}
                  title={badge.name}
                >
                  <badge.icon className="w-5 h-5 text-white" />
                </div>
              ))}
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

    case 'gradient':
      return (
        <div
          className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 p-6 rounded-lg w-full max-w-md text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                className={`w-24 h-24 rounded-full border-4 border-white/40 shadow-lg transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}
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

            <div className="mt-6 grid grid-cols-4 gap-3 w-full">
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

            {/* Add PRs and Issues Section */}
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
                    <div className="text-xs text-blue-100/80">
                      Pull Requests
                    </div>
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
                        index === topLanguages.length - 1
                          ? 'rounded-r-full'
                          : ''
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

              <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
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

            {hasBadges && (
              <div className="mt-5 flex justify-center gap-2">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`p-2 rounded-lg ${getBadgeGradient(badge.tier)} flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200`}
                    title={badge.name}
                  >
                    <badge.icon className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-xs text-blue-100/60 flex items-center justify-center gap-1">
              <Icons.GitHub className="w-3 h-3" />
              Generated with DevInsight
            </div>
          </div>
        </div>
      );

    case 'github':
      return (
        <div
          className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md w-full max-w-md shadow-sm hover:shadow-md transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex gap-4">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className={`w-16 h-16 rounded-full transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {user.name || user.login}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
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

          <div className="mt-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-4 gap-3">
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

              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                  <Icons.Users className="w-4 h-4 text-purple-500" />
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

          {hasBadges && (
            <div className="mt-4 flex flex-wrap gap-2">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className="px-2.5 py-1.5 text-xs rounded-full flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title={badge.name}
                >
                  <badge.icon className="w-3.5 h-3.5" />
                  <span>{badge.name}</span>
                </div>
              ))}
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

    // Default theme
    default:
      return (
        <div
          className="p-6 bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border border-border-l dark:border-border-d w-full max-w-md shadow-sm hover:shadow transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex flex-col items-center">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className={`w-24 h-24 rounded-full border-4 border-accent-1 transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
            />
            <h2 className="mt-2 text-xl font-bold text-l-text-1 dark:text-d-text-1">
              {user.name || user.login}
            </h2>
            <a
              href={`https://github.com/${user.login}`}
              className="text-accent-1 hover:underline flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.GitHub className="w-3.5 h-3.5" />@{user.login}
            </a>
            {user.bio && (
              <p className="mt-2 text-center text-sm text-l-text-2 dark:text-d-text-2 bg-l-bg-1/50 dark:bg-d-bg-1/50 p-2 rounded-lg">
                {user.bio.length > 100
                  ? `${user.bio.substring(0, 100)}...`
                  : user.bio}
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-4 gap-3">
            <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-lg text-center hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors">
              <div className="flex justify-center mb-2 text-accent-1">
                <Icons.Folder className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
                {repoCount}
              </div>
              <div className="text-xs text-l-text-3 dark:text-d-text-3">
                Repos
              </div>
            </div>
            <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-lg text-center hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors">
              <div className="flex justify-center mb-2 text-yellow-500 dark:text-yellow-400">
                <Icons.Star className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
                {starCount}
              </div>
              <div className="text-xs text-l-text-3 dark:text-d-text-3">
                Stars
              </div>
            </div>
            <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-lg text-center hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors">
              <div className="flex justify-center mb-2 text-green-500 dark:text-green-400">
                <Icons.Network className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
                {forkCount}
              </div>
              <div className="text-xs text-l-text-3 dark:text-d-text-3">
                Forks
              </div>
            </div>
            <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-lg text-center hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors">
              <div className="flex justify-center mb-2 text-blue-500 dark:text-blue-400">
                <Icons.Users className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
                {user.followers}
              </div>
              <div className="text-xs text-l-text-3 dark:text-d-text-3">
                Followers
              </div>
            </div>
          </div>

          {/* Activity Stats - PRs and Issues */}
          <div className="mt-5 grid grid-cols-2 gap-4">
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

          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-l-text-1 dark:text-d-text-1 flex items-center gap-1.5">
                <Icons.Folder className="w-4 h-4 text-l-text-2 dark:text-d-text-2" />
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

          {hasBadges && badges.length > 0 && (
            <div className="mt-5">
              <div className="text-sm font-medium text-l-text-1 dark:text-d-text-1 mb-2 flex items-center gap-1.5">
                <Icons.Medal className="w-4 h-4 text-l-text-2 dark:text-d-text-2" />
                Developer Badges
              </div>
              <div className="flex flex-wrap gap-2">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`p-2 rounded-lg ${getBadgeBgClass(badge.tier)} flex flex-col items-center gap-1 hover:scale-105 transition-transform duration-200`}
                    title={badge.name}
                  >
                    <badge.icon className="w-6 h-6 text-l-text-1 dark:text-d-text-1" />
                    <span className="text-xs text-l-text-2 dark:text-d-text-2">
                      {badge.name}
                    </span>
                  </div>
                ))}
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
}

// Helper functions for badge styling
function getBadgeBgClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'bg-[#CD7F32]/10';
    case 'silver':
      return 'bg-[#C0C0C0]/10';
    case 'gold':
      return 'bg-[#FFD700]/10';
    case 'platinum':
      return 'bg-[#E5E4E2]/10';
    default:
      return 'bg-l-bg-3 dark:bg-d-bg-3';
  }
}

function getBadgeColor(tier: string): string {
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
}

function getBadgeGradient(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'bg-gradient-to-br from-amber-600 to-amber-700';
    case 'silver':
      return 'bg-gradient-to-br from-gray-400 to-gray-500';
    case 'gold':
      return 'bg-gradient-to-br from-yellow-400 to-yellow-500';
    case 'platinum':
      return 'bg-gradient-to-br from-gray-300 to-gray-400';
    default:
      return 'bg-gradient-to-br from-gray-500 to-gray-600';
  }
}
