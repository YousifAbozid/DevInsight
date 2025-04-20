import { useState } from 'react';

interface MostStarredReposProps {
  repositories: Repository[] | undefined;
  loading: boolean;
}

// Icons organized in a single object for better maintenance
const Icons = {
  Star: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Clock: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Fork: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Repo: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Filter: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

// Skeleton component for loading state
function MostStarredReposSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-1/3 bg-l-bg-3 dark:bg-d-bg-3 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-lg p-4 animate-pulse"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="h-5 w-2/3 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              <div className="h-5 w-10 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
            </div>
            <div className="h-4 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-4"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
              <div className="h-6 w-20 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
              <div className="h-6 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MostStarredRepos({
  repositories,
  loading,
}: MostStarredReposProps) {
  const [filter, setFilter] = useState<string | null>(null);

  if (loading) {
    return <MostStarredReposSkeleton />;
  }

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
            Most Starred Repositories
          </h2>
        </div>
        <div className="bg-l-bg-1 dark:bg-d-bg-1 rounded-lg p-4 text-center">
          <Icons.Star className="w-12 h-12 mx-auto text-l-text-3 dark:text-d-text-3 mb-2" />
          <p className="text-l-text-2 dark:text-d-text-2">
            No repository data available. Start exploring!
          </p>
        </div>
      </div>
    );
  }

  // Get unique languages for filter
  const languages = Array.from(
    new Set(repositories.map(repo => repo.language).filter(Boolean))
  );

  // Filter repos by language if filter is active
  const filteredRepos = filter
    ? repositories.filter(repo => repo.language === filter)
    : repositories;

  // Sort repos by stars (most to least)
  const sortedRepos = [...filteredRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  // Calculate how long ago the repository was updated
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  // Get color for programming languages
  const getLanguageColor = (language: string): string => {
    const languageColors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Python: '#3572A5',
      Java: '#b07219',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Go: '#00ADD8',
      C: '#555555',
      'C++': '#f34b7d',
      'C#': '#178600',
      Swift: '#ffac45',
      Kotlin: '#A97BFF',
      Rust: '#dea584',
      Dart: '#00B4AB',
      Shell: '#89e051',
      Scala: '#c22d40',
      'Objective-C': '#438eff',
      R: '#198ce7',
    };

    return languageColors[language] || '#8b949e'; // Default color
  };

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
          Most Starred Repositories
        </h2>

        {languages.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-l-text-2 dark:text-d-text-2">
              <Icons.Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter(null)}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  filter === null
                    ? 'bg-accent-1 text-white'
                    : 'bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
                }`}
              >
                All
              </button>
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setFilter(lang)}
                  className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                    filter === lang
                      ? 'bg-accent-1 text-white'
                      : 'bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedRepos.map(repo => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:no-underline group"
          >
            <div className="bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-lg p-4 h-full transition-all duration-200 group-hover:border-accent-1 group-hover:shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-l-text-1 dark:text-d-text-1 group-hover:text-accent-1 line-clamp-1">
                  {repo.name}
                </h3>
                <div className="flex items-center text-accent-2">
                  <Icons.Star className="w-4 h-4 mr-1" />
                  <span className="font-medium text-sm">
                    {repo.stargazers_count.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-l-text-2 dark:text-d-text-2 text-sm mb-3 line-clamp-2">
                {repo.description || 'No description available'}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {repo.language && (
                  <div className="bg-l-bg-2 dark:bg-d-bg-2 px-2.5 py-1 rounded-full text-xs font-medium text-l-text-1 dark:text-d-text-1 flex items-center">
                    <span
                      className="w-2 h-2 rounded-full mr-1.5"
                      style={{
                        backgroundColor: getLanguageColor(repo.language),
                      }}
                    ></span>
                    {repo.language}
                  </div>
                )}

                {repo.forks_count > 0 && (
                  <div className="bg-l-bg-2 dark:bg-d-bg-2 px-2.5 py-1 rounded-full text-xs font-medium text-l-text-2 dark:text-d-text-2 flex items-center">
                    <Icons.Fork className="w-3 h-3 mr-1" />
                    {repo.forks_count}
                  </div>
                )}

                <div className="bg-l-bg-2 dark:bg-d-bg-2 px-2.5 py-1 rounded-full text-xs font-medium text-l-text-2 dark:text-d-text-2 flex items-center ml-auto">
                  <Icons.Clock className="w-3 h-3 mr-1" />
                  {getTimeAgo(repo.updated_at)}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
