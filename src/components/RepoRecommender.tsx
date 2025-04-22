import { useRecommendedRepos } from '../services/githubService';
import SectionHeader from './shared/SectionHeader';
import { Icons } from './shared/Icons';

interface RepoRecommenderProps {
  repositories?: Repository[];
  loading?: boolean;
  token?: string;
}

// Skeleton component for loading state
const RepoRecommenderSkeleton = () => {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-6 w-1/3 bg-l-bg-3 dark:bg-d-bg-3 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
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
};

export default function RepoRecommender({
  repositories,
  loading,
  token,
}: RepoRecommenderProps) {
  const {
    data: recommendedRepos,
    isLoading: isRecommendationsLoading,
    error: recommendationsError,
  } = useRecommendedRepos(repositories, token);

  if (loading || isRecommendationsLoading) {
    return <RepoRecommenderSkeleton />;
  }

  if (recommendationsError) {
    return (
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
            Recommended Repositories
          </h2>
        </div>
        <div className="bg-accent-danger/10 border border-accent-danger/30 rounded-lg p-4 text-accent-danger">
          <p className="text-sm">
            Error loading recommendations:{' '}
            {recommendationsError instanceof Error
              ? recommendationsError.message
              : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  if (!recommendedRepos || recommendedRepos.length === 0) {
    return (
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
        <SectionHeader
          title="Recommended Repositories"
          icon={Icons.Lightbulb}
          subtitle="Repositories you might find interesting based on your activity"
          infoTooltip="These recommendations are based on your current repositories, starred projects, and common interests within the developer community."
        />
        <div className="bg-l-bg-1 dark:bg-d-bg-1 rounded-lg p-4 text-center">
          <Icons.Repo className="w-12 h-12 mx-auto text-l-text-3 dark:text-d-text-3 mb-2" />
          <p className="text-l-text-2 dark:text-d-text-2">
            No recommendations available yet. Try exploring more repositories!
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <SectionHeader
        title="Recommended Repositories"
        icon={Icons.Lightbulb}
        subtitle="Repositories you might find interesting based on your activity"
        infoTooltip="These recommendations are based on your current repositories, starred projects, and common interests within the developer community."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedRepos.map(repo => (
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
                    <span className="w-2 h-2 rounded-full bg-accent-1 mr-1.5"></span>
                    {repo.language}
                  </div>
                )}

                {repo.forks_count > 0 && (
                  <div className="bg-l-bg-2 dark:bg-d-bg-2 px-2.5 py-1 rounded-full text-xs font-medium text-l-text-2 dark:text-d-text-2 flex items-center">
                    <Icons.Network className="w-3 h-3 mr-1" />
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
