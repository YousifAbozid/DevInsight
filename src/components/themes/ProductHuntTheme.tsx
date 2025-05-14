import { useState } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface ProductHuntThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function ProductHuntTheme({
  user,
  repositories,
  languageData,
}: ProductHuntThemeProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get the most recently updated repo
  const lastUpdatedRepo = repositories?.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )[0];

  // Get top 3 repositories by stars
  const topRepos =
    repositories
      ?.sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3) || [];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // If it's today
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    }

    // If it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // Otherwise show the date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div
      className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300"
      style={{
        boxShadow: isHovered
          ? '0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 5px rgba(0, 0, 0, 0.03)'
          : '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with user info */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-14 h-14 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />

          <div>
            <h2 className="text-gray-900 dark:text-gray-100 text-lg font-bold flex items-center gap-2">
              {user.name || user.login}
              <a
                href={`https://github.com/${user.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                <Icons.ExternalLink className="w-3.5 h-3.5" />
              </a>
            </h2>

            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <Icons.GitHub className="w-3.5 h-3.5" />
              <span>@{user.login}</span>
            </div>
          </div>

          <div className="ml-auto">
            <button className="bg-[#da552f] hover:bg-[#ea532a] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
              Follow
            </button>
          </div>
        </div>

        {user.bio && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 px-1">
            {user.bio}
          </p>
        )}
      </div>

      {/* Showcase project section */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 dark:text-gray-100 font-bold text-base">
            Featured Projects
          </h3>
          <a
            href={`https://github.com/${user.login}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#da552f] text-sm hover:text-[#ea532a] font-medium"
          >
            View all ({user.public_repos})
          </a>
        </div>

        {/* Top repositories */}
        <div className="space-y-3 mb-5">
          {topRepos.map(repo => (
            <div
              key={repo.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                {repo.language ? (
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        languageData.find(l => l.name === repo.language)
                          ?.color || '#ccc',
                    }}
                  ></span>
                ) : (
                  <Icons.Folder className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-gray-100 font-medium hover:text-[#da552f] transition-colors truncate block"
                >
                  {repo.name}
                </a>
                {repo.description && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                    {repo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                <div className="flex items-center gap-1">
                  <Icons.Star className="w-4 h-4 text-yellow-400" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icons.Network className="w-4 h-4" />
                  <span>{repo.forks_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Last updated section */}
        {lastUpdatedRepo && (
          <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 dark:text-gray-100 font-bold text-base">
                Latest Update
              </h3>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(lastUpdatedRepo.updated_at)}
              </span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <a
                  href={lastUpdatedRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-gray-100 font-medium hover:text-[#da552f] transition-colors flex items-center gap-1"
                >
                  {lastUpdatedRepo.name}
                  <Icons.ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center gap-2">
                  <div
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: lastUpdatedRepo.language
                        ? languageData.find(
                            l => l.name === lastUpdatedRepo.language
                          )?.color + '20' || '#ccc20'
                        : '#ccc20',
                      color: lastUpdatedRepo.language
                        ? languageData.find(
                            l => l.name === lastUpdatedRepo.language
                          )?.color || '#666'
                        : '#666',
                    }}
                  >
                    {lastUpdatedRepo.language || 'No language'}
                  </div>
                </div>
              </div>

              {lastUpdatedRepo.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {lastUpdatedRepo.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Icons.Eye className="w-4 h-4" />
                    <span>{lastUpdatedRepo.watchers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icons.Star className="w-4 h-4" />
                    <span>{lastUpdatedRepo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icons.Network className="w-4 h-4" />
                    <span>{lastUpdatedRepo.forks_count}</span>
                  </div>
                </div>

                <a
                  href={lastUpdatedRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#da552f] hover:text-[#ea532a] font-medium transition-colors"
                >
                  View Project
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="text-gray-500 dark:text-gray-400 text-xs">
          Generated with DevInsight
        </div>

        <div className="flex gap-3">
          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <Icons.Share2 className="w-4 h-4" />
          </button>
          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <Icons.Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
