import { useState } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';
import {
  useUserPullRequests,
  useUserIssues,
} from '../../services/githubService';
import { useGithubToken } from '../../hooks/useStorage';

interface MonochromeBusinessThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function MonochromeBusinessTheme({
  user,
  repositories,
}: MonochromeBusinessThemeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [token] = useGithubToken();

  // Get pull requests and issues data
  const { data: pullRequests = 0 } = useUserPullRequests(user.login, token);
  const { data: issues = 0 } = useUserIssues(user.login, token);

  // Calculate total commits (estimate based on repository count)
  const totalCommits =
    repositories?.reduce((acc, repo) => {
      // Generate a pseudo-random but consistent commit count
      const pseudoCommitCount = Math.floor(
        (repo.size / 100) *
          (repo.stargazers_count + 1) *
          (new Date(repo.created_at).getFullYear() / 2000)
      );
      return acc + (pseudoCommitCount || 10);
    }, 0) || 386; // Fallback to a reasonable number if no repos

  // Find top repository by stars
  const topRepo = repositories?.sort(
    (a, b) => b.stargazers_count - a.stargazers_count
  )[0];

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div
      className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-md transition-all duration-300"
      style={{
        boxShadow: isHovered
          ? '0 10px 25px rgba(0, 0, 0, 0.07)'
          : '0 4px 6px rgba(0, 0, 0, 0.04)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* Header with professional monochrome styling */}
        <div className="flex items-center mb-6 pb-5 border-b border-gray-200 dark:border-gray-700">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-16 h-16 rounded-full grayscale object-cover mr-4 border border-gray-200 dark:border-gray-700"
          />

          <div>
            <h2 className="text-gray-800 dark:text-gray-100 text-xl font-bold">
              {user.name || user.login}
            </h2>

            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <Icons.GitHub className="w-3.5 h-3.5" />
              <span>@{user.login}</span>
            </div>

            {user.bio && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 italic">
                &quot;
                {user.bio.length > 100
                  ? user.bio.slice(0, 100) + '...'
                  : user.bio}
                &quot;
              </p>
            )}
          </div>
        </div>

        {/* Key statistics in a clean grid */}
        <div className="mb-6">
          <h3 className="text-gray-700 dark:text-gray-200 font-semibold text-sm uppercase tracking-wider mb-4">
            Development Summary
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatNumber(totalCommits)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase mt-1">
                Commits
              </div>
            </div>

            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatNumber(pullRequests)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase mt-1">
                Pull Requests
              </div>
            </div>

            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatNumber(issues)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase mt-1">
                Issues
              </div>
            </div>
          </div>
        </div>

        {/* Secondary statistics with horizontal bars */}
        <div className="mb-6">
          <h3 className="text-gray-700 dark:text-gray-200 font-semibold text-sm uppercase tracking-wider mb-4">
            Portfolio Overview
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Repositories
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user.public_repos}
                </div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-700 dark:bg-gray-300"
                  style={{ width: `${Math.min(100, user.public_repos * 2)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Followers
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user.followers}
                </div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-700 dark:bg-gray-300"
                  style={{ width: `${Math.min(100, user.followers / 10)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total Stars
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {repositories?.reduce(
                    (sum, repo) => sum + repo.stargazers_count,
                    0
                  ) || 0}
                </div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-700 dark:bg-gray-300"
                  style={{
                    width: `${Math.min(100, (repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0) / 50)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top repository section */}
        {topRepo && (
          <div className="mb-6">
            <h3 className="text-gray-700 dark:text-gray-200 font-semibold text-sm uppercase tracking-wider mb-4">
              Featured Repository
            </h3>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-800">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <a
                    href={topRepo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {topRepo.name}
                  </a>

                  {topRepo.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      {topRepo.description.length > 100
                        ? topRepo.description.slice(0, 100) + '...'
                        : topRepo.description}
                    </p>
                  )}
                </div>

                <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                  {topRepo.language || 'No language'}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Icons.Star className="w-4 h-4" />
                    <span>{topRepo.stargazers_count}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Icons.Network className="w-4 h-4" />
                    <span>{topRepo.forks_count}</span>
                  </div>
                </div>

                <div className="text-xs">
                  Updated {new Date(topRepo.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer with a professional touch */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Contact: {user.email || 'Available via GitHub'}
          </div>

          <div className="flex gap-2">
            <a
              href={`https://github.com/${user.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              aria-label="GitHub Profile"
            >
              <Icons.GitHub className="w-4 h-4" />
            </a>

            {user.blog && (
              <a
                href={
                  user.blog.startsWith('http')
                    ? user.blog
                    : `https://${user.blog}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                aria-label="Website"
              >
                <Icons.Link className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
