import { useState } from 'react';
import { Icons } from './shared/Icons';
import SectionHeader from './shared/SectionHeader';
import FilterTabs, { FilterTab } from './shared/FilterTabs';
import MostStarredReposSkeleton from './shared/Skeletons/MostStarredReposSkeleton';

interface MostStarredReposProps {
  repositories: Repository[] | undefined;
  loading: boolean;
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
        <SectionHeader title="Most Starred Repositories" icon={Icons.Star} />
        <div className="text-center py-12 mt-4 bg-l-bg-3/30 dark:bg-d-bg-3/30 rounded-lg border border-border-l dark:border-border-d">
          <div className="mb-4 inline-block p-4 rounded-full bg-l-bg-1 dark:bg-d-bg-1">
            <Icons.Star className="w-10 h-10 text-l-text-3 dark:text-d-text-3" />
          </div>
          <h3 className="text-lg font-semibold text-l-text-2 dark:text-d-text-2 mb-2">
            No starred repositories found
          </h3>
          <p className="text-l-text-3 dark:text-d-text-3 max-w-md mx-auto">
            Start creating repositories or star other projects to see them here.
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

  // Prepare filter tabs using our FilterTab interface
  const filterTabs: FilterTab[] = [
    {
      id: null,
      label: 'All Languages',
      count: repositories.length,
      icon: Icons.Code,
      active: filter === null,
      onClick: () => setFilter(null),
    },
    ...languages.map(lang => {
      const repoCount = repositories.filter(
        repo => repo.language === lang
      ).length;
      return {
        id: lang,
        label: String(lang), // Ensure label is always a string
        count: repoCount,
        active: filter === lang,
        onClick: () => setFilter(lang),
      };
    }),
  ];

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
      <SectionHeader
        title="Most Starred Repositories"
        icon={Icons.Star}
        subtitle="Your highest-rated GitHub projects by community stars"
        infoTooltip="Repositories are sorted by star count. Stars represent appreciation from other GitHub users and indicate popular or useful projects."
      />

      {languages.length > 0 && (
        <FilterTabs tabs={filterTabs} activeTabId={filter} />
      )}

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
                    <Icons.GitBranch className="w-3 h-3 mr-1" />
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
