import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useUserPullRequests, useUserIssues } from '../services/githubService';

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  // Get token from localStorage for authenticated requests
  const token = localStorage.getItem('github_token') || undefined;

  // Use the new React Query hooks for PRs and issues
  const { data: pullRequests = 0, isLoading: isPRsLoading } =
    useUserPullRequests(user.login, token);

  const { data: issues = 0, isLoading: isIssuesLoading } = useUserIssues(
    user.login,
    token
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate account age in years and months
  const calculateAccountAge = () => {
    const joinDate = new Date(user.created_at);
    const now = new Date();

    const yearDiff = now.getFullYear() - joinDate.getFullYear();
    const monthDiff = now.getMonth() - joinDate.getMonth();

    if (monthDiff < 0) {
      return {
        years: yearDiff - 1,
        months: monthDiff + 12,
      };
    }

    return {
      years: yearDiff,
      months: monthDiff,
    };
  };

  // Calculate next GitHub anniversary
  const calculateNextAnniversary = () => {
    const now = new Date();

    const nextAnniversary = new Date(user.created_at);
    nextAnniversary.setFullYear(now.getFullYear());

    // If the anniversary has already passed this year, set for next year
    if (nextAnniversary < now) {
      nextAnniversary.setFullYear(now.getFullYear() + 1);
    }

    const daysUntilAnniversary = Math.ceil(
      (nextAnniversary.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      date: nextAnniversary,
      daysUntil: daysUntilAnniversary,
    };
  };

  const accountAge = calculateAccountAge();
  const nextAnniversary = calculateNextAnniversary();
  const isBirthday = nextAnniversary.daysUntil === 0;

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d relative">
      {/* Save Options Dropdown */}
      {(onSaveUserData || onSaveReposData) && (
        <div className="absolute top-4 right-4">
          <button
            ref={dropdownButtonRef}
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
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-1 w-48 bg-l-bg-1 dark:bg-d-bg-1 rounded-lg shadow-lg border border-border-l dark:border-border-d z-10"
            >
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

      {/* Top Section with Avatar and Basic Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
        {/* Avatar Column */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="w-28 h-28 rounded-full border-4 border-accent-1 shadow-md"
            />
            {user.hireable && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3 bg-accent-success text-white text-xs px-2 py-1 rounded-md shadow-sm">
                Hireable
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-1 hover:underline flex items-center cursor-pointer bg-l-bg-1 dark:bg-d-bg-1 px-3 py-1.5 rounded-md hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors"
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
                className="text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center cursor-pointer bg-l-bg-1 dark:bg-d-bg-1 p-1.5 rounded-md transition-colors"
                title="View public profile"
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
        </div>

        {/* User Info Column */}
        <div className="flex-1 w-full md:w-auto text-center md:text-left">
          {/* User Name and Type */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 flex-wrap justify-center md:justify-start">
            <h2 className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              {user.name || user.login}
            </h2>

            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
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
          </div>

          {/* Username */}
          <div className="text-l-text-2 dark:text-d-text-2 mt-1 text-lg">
            @{user.login}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-3 text-l-text-2 dark:text-d-text-2 bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md border border-border-l/50 dark:border-border-d/50 shadow-sm">
              {user.bio}
            </p>
          )}

          {/* GitHub Anniversary Section - Improved Layout */}
          <div className="mt-4 bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md border border-border-l/50 dark:border-border-d/50 relative overflow-hidden">
            {isBirthday && (
              <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full opacity-5 bg-confetti"></div>
              </div>
            )}

            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-accent-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <span className="text-l-text-1 dark:text-d-text-1 font-medium truncate">
                GitHub Membership
              </span>

              {isBirthday && (
                <span className="ml-2 bg-accent-warning/20 text-accent-warning text-xs px-2 py-0.5 rounded-full flex items-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  GitHub Anniversary Today!
                </span>
              )}
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex flex-col">
                <div className="text-l-text-2 dark:text-d-text-2">
                  <span className="font-medium">Joined:</span>{' '}
                  {formatDate(user.created_at)}
                </div>

                <div className="text-l-text-2 dark:text-d-text-2 flex items-center mt-1">
                  <svg
                    className="w-4 h-4 mr-1 text-accent-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate">
                    {accountAge.years > 0
                      ? `${accountAge.years} year${
                          accountAge.years !== 1 ? 's' : ''
                        }`
                      : ''}{' '}
                    {accountAge.months > 0
                      ? ` ${accountAge.months} month${
                          accountAge.months !== 1 ? 's' : ''
                        }`
                      : ''}
                    {accountAge.years === 0 && accountAge.months === 0
                      ? 'Just joined'
                      : ''}{' '}
                    on GitHub
                  </span>
                </div>
              </div>

              {!isBirthday && (
                <div className="flex flex-col">
                  <div className="text-l-text-2 dark:text-d-text-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-accent-success flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Next Anniversary:</span>
                  </div>

                  <div className="text-l-text-2 dark:text-d-text-2 mt-1 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-accent-warning flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="truncate">
                      {formatDate(nextAnniversary.date.toISOString())}{' '}
                      <span className="text-accent-success ml-1">
                        ({nextAnniversary.daysUntil} day
                        {nextAnniversary.daysUntil !== 1 ? 's' : ''} from now)
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {isBirthday && (
              <div className="mt-2 bg-accent-warning/10 p-2 rounded-md border border-accent-warning/30 text-center">
                <span className="text-accent-warning font-medium">
                  🎉 Happy GitHub Anniversary! 🎉
                </span>
                <p className="text-sm text-l-text-2 dark:text-d-text-2 mt-1">
                  Celebrating {accountAge.years} year
                  {accountAge.years !== 1 ? 's' : ''} on GitHub today!
                </p>
              </div>
            )}
          </div>

          {/* Contact and Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4">
            {/* Left column */}
            <div>
              {user.location && (
                <div className="flex items-center text-l-text-2 dark:text-d-text-2">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{user.location}</span>
                </div>
              )}

              {user.company && (
                <div className="flex items-center text-l-text-2 dark:text-d-text-2 mt-1.5">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
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
                  <span>{user.company}</span>
                </div>
              )}
            </div>

            {/* Right column */}
            <div>
              {user.blog && (
                <div className="flex items-center text-l-text-2 dark:text-d-text-2">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
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
                    className="text-accent-1 hover:underline cursor-pointer truncate"
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
                <div className="flex items-center text-l-text-2 dark:text-d-text-2 mt-1.5">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
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
            </div>
          </div>

          {/* Email Info - Removed duplicate join date */}
          {user.email && (
            <div className="flex items-center text-l-text-2 dark:text-d-text-2 mt-4">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
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

          <div className="text-l-text-3 dark:text-d-text-3 text-sm mt-4">
            <span className="bg-l-bg-1 dark:bg-d-bg-1 px-2 py-1 rounded-md">
              Last updated {formatDate(user.updated_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Updated with React Query hooks */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
        <StatCard
          title="Repos"
          value={user.public_repos}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
              />
            </svg>
          }
        />
        <StatCard
          title="Followers"
          value={user.followers}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Following"
          value={user.following}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
              />
            </svg>
          }
        />
        <StatCard
          title="Gists"
          value={user.public_gists}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          }
        />
        {/* Updated PR and Issues cards with React Query */}
        <StatCard
          title="PRs"
          value={pullRequests}
          isLoading={isPRsLoading}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
          }
        />
        <StatCard
          title="Issues"
          value={issues}
          isLoading={isIssuesLoading}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

function StatCard({ title, value, icon, isLoading = false }: StatCardProps) {
  return (
    <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l dark:border-border-d hover:shadow-md transition-all hover:border-accent-1/30 group">
      <div className="flex items-center gap-2">
        {icon && (
          <div className="text-accent-1 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
        <div className="text-l-text-3 dark:text-d-text-3 text-sm font-medium">
          {title}
        </div>
      </div>
      <div className="text-l-text-1 dark:text-d-text-1 text-xl font-bold mt-2">
        {isLoading ? (
          <div className="w-6 h-5 bg-l-bg-3 dark:bg-d-bg-3 rounded animate-pulse"></div>
        ) : (
          value.toLocaleString()
        )}
      </div>
    </div>
  );
}
