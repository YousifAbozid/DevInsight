import { Link } from 'react-router-dom';
import { useState } from 'react';

interface GithubProfileCardProps {
  user: GithubUser;
  publicProfileUrl?: string;
  onSaveUserData?: () => void;
  onSaveReposData?: () => void;
  hasRepositories?: boolean;
}

export default function GithubProfileCard({
  user,
  publicProfileUrl,
  onSaveUserData,
  onSaveReposData,
  hasRepositories = false,
}: GithubProfileCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d relative">
      {/* Save Options Dropdown */}
      {(onSaveUserData || onSaveReposData) && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-full hover:bg-l-bg-1 dark:hover:bg-d-bg-1 transition-colors cursor-pointer"
            title="Save options"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-l-text-2 dark:text-d-text-2"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-l-bg-1 dark:bg-d-bg-1 rounded-lg shadow-lg border border-border-l dark:border-border-d z-10">
              <div className="py-1">
                {onSaveUserData && (
                  <button
                    onClick={() => {
                      onSaveUserData();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2 cursor-pointer"
                  >
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Save user data
                  </button>
                )}

                {onSaveReposData && hasRepositories && (
                  <button
                    onClick={() => {
                      onSaveReposData();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2 cursor-pointer"
                  >
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Save repos data
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

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

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
              {user.name || user.login}
            </h2>
            {user.type && user.type !== 'User' && (
              <span className="bg-accent-2/20 text-accent-2 text-xs px-2 py-0.5 rounded-full">
                {user.type}
              </span>
            )}
            {user.site_admin && (
              <span className="bg-accent-warning/20 text-accent-warning text-xs px-2 py-0.5 rounded-full">
                Staff
              </span>
            )}
          </div>

          <div className="text-l-text-2 dark:text-d-text-2 mt-1">
            @{user.login}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-1 hover:underline flex items-center cursor-pointer"
            >
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
                className="mr-1"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              GitHub Profile
            </a>

            {publicProfileUrl && (
              <Link
                to={publicProfileUrl}
                className="text-accent-1 hover:underline flex items-center cursor-pointer"
              >
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

          {user.company && (
            <div className="mt-1 flex items-center text-l-text-2 dark:text-d-text-2">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21"
                />
              </svg>
              {user.company}
            </div>
          )}

          {user.blog && (
            <div className="mt-1 flex items-center text-l-text-2 dark:text-d-text-2">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
              <a
                href={
                  user.blog.startsWith('http')
                    ? user.blog
                    : `https://${user.blog}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-1 hover:underline cursor-pointer"
              >
                {
                  new URL(
                    user.blog.startsWith('http')
                      ? user.blog
                      : `https://${user.blog}`
                  ).hostname
                }
              </a>
            </div>
          )}

          {user.twitter_username && (
            <div className="mt-1 flex items-center text-l-text-2 dark:text-d-text-2">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195c-.897-.957-2.178-1.555-3.594-1.555-2.719 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
              </svg>
              <a
                href={`https://twitter.com/${user.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-1 hover:underline cursor-pointer"
              >
                @{user.twitter_username}
              </a>
            </div>
          )}

          {user.email && (
            <div className="mt-1 flex items-center text-l-text-2 dark:text-d-text-2">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <a
                href={`mailto:${user.email}`}
                className="text-accent-1 hover:underline cursor-pointer"
              >
                {user.email}
              </a>
            </div>
          )}

          <div className="mt-2 text-l-text-3 dark:text-d-text-3 text-sm">
            Last updated: {formatDate(user.updated_at)}
          </div>
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
