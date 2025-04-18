import { useRecommendedRepos } from '../services/githubService';

interface RepoRecommenderProps {
  repositories?: Repository[];
  loading?: boolean;
  token?: string;
}

// Skeleton component for loading state
const RepoRecommenderSkeleton = () => {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <div className="h-6 w-1/3 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-lg p-4 animate-pulse"
          >
            <div className="h-5 w-3/4 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-3"></div>
            <div className="h-4 w-1/3 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-3"></div>
            <div className="h-4 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-3"></div>
            <div className="h-4 w-2/3 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
            <div className="flex justify-between mt-4">
              <div className="h-4 w-1/5 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              <div className="h-4 w-1/4 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
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
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-4">
          Recommended Repositories
        </h2>
        <p className="text-accent-danger">
          Error loading recommendations:{' '}
          {recommendationsError instanceof Error
            ? recommendationsError.message
            : 'Unknown error'}
        </p>
      </div>
    );
  }

  if (!recommendedRepos || recommendedRepos.length === 0) {
    return (
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-4">
          Recommended Repositories
        </h2>
        <p className="text-l-text-2 dark:text-d-text-2">
          No recommendations available. Try exploring more repositories!
        </p>
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
      <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-4">
        Recommended Repositories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedRepos.map(repo => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:no-underline group"
          >
            <div className="bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-lg p-4 h-full hover:shadow-md transition-all duration-200 group-hover:border-accent-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-accent-1 group-hover:underline line-clamp-1">
                  {repo.name}
                </h3>
              </div>

              <p className="text-l-text-2 dark:text-d-text-2 text-sm mb-3 line-clamp-2">
                {repo.description || 'No description available'}
              </p>

              <div className="flex flex-wrap gap-2">
                {repo.language && (
                  <div className="text-l-text-1 dark:text-d-text-1 bg-l-bg-2 dark:bg-d-bg-2 px-2 py-1 rounded-full text-xs">
                    {repo.language}
                  </div>
                )}

                <div className="flex items-center text-l-text-1 dark:text-d-text-1 bg-l-bg-2 dark:bg-d-bg-2 px-2 py-1 rounded-full text-sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                  </svg>
                  <span className="font-medium">
                    {repo.stargazers_count.toLocaleString()}
                  </span>
                </div>

                <div className="text-l-text-3 dark:text-d-text-3 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 4.75a.75.75 0 01.75.75v2.75h2.75a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75V5.5A.75.75 0 018 4.75z" />
                  </svg>
                  Updated {getTimeAgo(repo.updated_at)}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
