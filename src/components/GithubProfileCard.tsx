interface GithubProfileCardProps {
  user: GithubUser;
}

export default function GithubProfileCard({ user }: GithubProfileCardProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Profile Header */}
        <div className="flex-shrink-0">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s profile`}
            className="w-24 h-24 rounded-full border-2 border-accent-1"
          />
        </div>

        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-l-text-1 dark:text-d-text-1">
                {user.name || user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-1 hover:underline"
              >
                @{user.login}
              </a>
            </div>
            <div className="text-l-text-3 dark:text-d-text-3 text-sm">
              Joined {formatDate(user.created_at)}
            </div>
          </div>

          {user.bio && (
            <p className="mt-3 text-l-text-2 dark:text-d-text-2">{user.bio}</p>
          )}

          {user.location && (
            <div className="mt-2 flex items-center text-l-text-2 dark:text-d-text-2">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {user.location}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard title="Repositories" value={user.public_repos} />
        <StatCard title="Followers" value={user.followers} />
        <StatCard title="Following" value={user.following} />
        <StatCard title="Gists" value={user.public_gists} />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l dark:border-border-d hover:shadow-sm transition-shadow">
      <div className="text-l-text-3 dark:text-d-text-3 text-sm font-medium">
        {title}
      </div>
      <div className="text-l-text-1 dark:text-d-text-1 text-xl font-bold mt-1">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
