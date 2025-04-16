import { Link } from 'react-router-dom';

interface GithubProfileCardProps {
  user: GithubUser;
  publicProfileUrl?: string;
}

export default function GithubProfileCard({
  user,
  publicProfileUrl,
}: GithubProfileCardProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="relative">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="w-24 h-24 rounded-full border-4 border-accent-1"
          />
          {user.hireable && (
            <span className="absolute bottom-0 right-0 bg-accent-success text-white text-xs px-1 py-0.5 rounded-md">
              Hireable
            </span>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
            <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
              {user.name || user.login}
            </h2>

            {/* Public profile link */}
            {publicProfileUrl && (
              <Link
                to={publicProfileUrl}
                className="mt-2 sm:mt-0 text-sm flex items-center gap-1 text-accent-1 hover:text-accent-2 transition-colors"
                title="View Public Profile"
              >
                <span>View Public Profile</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </Link>
            )}
          </div>
          <div className="text-l-text-3 dark:text-d-text-3 text-sm">
            Joined {formatDate(user.created_at)}
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
