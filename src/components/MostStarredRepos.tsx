interface MostStarredReposProps {
  repositories: Repository[] | undefined;
  loading: boolean;
}

export default function MostStarredRepos({
  repositories,
  loading,
}: MostStarredReposProps) {
  const topRepos = repositories
    ? [...repositories]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
    : [];

  if (loading) {
    return <MostStarredReposSkeleton />;
  }

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-4">
          Most Starred Repositories
        </h2>
        <p className="text-l-text-2 dark:text-d-text-2">
          No repository data available
        </p>
      </div>
    );
  }

  // Calculate how long ago the repository was updated
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const updatedDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - updatedDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return 'just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30)
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12)
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-4">
        Most Starred Repositories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topRepos.map(repo => (
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
              </div>

              {repo.description ? (
                <p className="text-l-text-2 dark:text-d-text-2 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                  {repo.description}
                </p>
              ) : (
                <p className="text-l-text-3 dark:text-d-text-3 text-sm italic mb-4 min-h-[2.5rem]">
                  No description available
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs mt-auto">
                {repo.language && (
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getLanguageColor(repo.language),
                      }}
                    />
                    <span className="text-l-text-2 dark:text-d-text-2 font-medium">
                      {repo.language}
                    </span>
                  </div>
                )}

                <div className="text-l-text-3 dark:text-d-text-3 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
                    <path d="M8 4.75a.75.75 0 01.75.75v2.75h2.75a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75V5.5A.75.75 0 018 4.75z" />
                  </svg>
                  Updated {getTimeAgo(repo.updated_at)}
                </div>

                {repo.fork && (
                  <div className="text-l-text-3 dark:text-d-text-3 flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013 6.25v-.878a2.25 2.25 0 112 0z" />
                    </svg>
                    Forked
                  </div>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// Function to get color for programming languages
function getLanguageColor(language: string): string {
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
}

// Skeleton loader for the component
function MostStarredReposSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d animate-pulse">
      <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-lg p-4"
            >
              <div className="flex justify-between mb-3">
                <div className="h-5 w-1/3 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                <div className="h-5 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
              </div>
              <div className="h-4 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-4"></div>
              <div className="flex gap-3">
                <div className="h-3 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                <div className="h-3 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
