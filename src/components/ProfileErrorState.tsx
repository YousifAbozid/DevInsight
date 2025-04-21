import { useNavigate } from 'react-router-dom';
import { Icons } from './shared/Icons';

// Interface for the ProfileErrorState component props
export interface ProfileErrorStateProps {
  username: string;
  profileType?: 'user' | 'organization';
  errorType: 'not_found' | 'error';
  errorMessage?: string;
}

/**
 * A unified component for displaying profile errors
 * Can be used in both public and regular profile pages
 */
export default function ProfileErrorState({
  username,
  profileType,
  errorType,
  errorMessage,
}: ProfileErrorStateProps) {
  const navigate = useNavigate();

  // Popular and verified GitHub profiles to suggest
  const popularProfiles = [
    { username: 'github', type: 'org' },
    { username: 'microsoft', type: 'org' },
    { username: 'google', type: 'org' },
    { username: 'torvalds', type: 'user' },
    { username: 'sindresorhus', type: 'user' },
  ];

  const isNotFound = errorType === 'not_found';

  // Handle suggestion clicks - simple navigation only
  const handleSuggestionClick = (suggestion: string, type: string) => {
    navigate(`/${type}/${suggestion}`);
  };

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-8 border border-border-l dark:border-border-d">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        {/* Error icon */}
        <div
          className={`p-4 ${isNotFound ? 'bg-accent-danger/10' : 'bg-accent-warning/10'} rounded-full`}
        >
          {isNotFound ? (
            <Icons.AlertCircle className="w-16 h-16 text-accent-danger" />
          ) : (
            <Icons.AlertTriangle className="w-16 h-16 text-accent-warning" />
          )}
        </div>

        {/* Error heading */}
        <h2 className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
          {isNotFound
            ? `GitHub ${profileType || 'Profile'} Not Found`
            : 'Error Finding GitHub Profile'}
        </h2>

        {/* Error message */}
        <p className="text-l-text-2 dark:text-d-text-2 max-w-md mx-auto">
          {isNotFound ? (
            <>
              We couldn&apos;t find a GitHub {profileType || 'profile'} for{' '}
              <span className="font-bold text-accent-1">{username}</span>.
            </>
          ) : (
            <span className="font-medium text-accent-danger">
              {errorMessage || 'An unexpected error occurred.'}
            </span>
          )}
        </p>

        {/* Possible reasons */}
        <div className="w-full max-w-md mx-auto">
          <h3 className="text-base font-semibold text-l-text-1 dark:text-d-text-1 mb-3 text-left">
            This could be because:
          </h3>
          <ul className="text-left text-l-text-2 dark:text-d-text-2 space-y-2">
            <li className="flex items-start gap-2">
              <Icons.AlertCircle
                className={`w-4 h-4 ${isNotFound ? 'text-accent-danger' : 'text-accent-warning'} mt-0.5 flex-shrink-0`}
              />
              <span>The username is misspelled or doesn&apos;t exist</span>
            </li>

            {isNotFound && (
              <li className="flex items-start gap-2">
                <Icons.AlertCircle className="w-4 h-4 text-accent-danger mt-0.5 flex-shrink-0" />
                <span>The profile may have been deleted or renamed</span>
              </li>
            )}

            <li className="flex items-start gap-2">
              <Icons.AlertCircle
                className={`w-4 h-4 ${isNotFound ? 'text-accent-danger' : 'text-accent-warning'} mt-0.5 flex-shrink-0`}
              />
              <span>GitHub API might be experiencing issues</span>
            </li>

            {!isNotFound &&
              errorMessage &&
              errorMessage.includes('rate limit') && (
                <li className="flex items-start gap-2">
                  <Icons.Clock className="w-4 h-4 text-accent-warning mt-0.5 flex-shrink-0" />
                  <span>
                    GitHub API rate limit has been exceeded - wait a few minutes
                    and try again
                  </span>
                </li>
              )}

            {!isNotFound && errorMessage && errorMessage.includes('token') && (
              <li className="flex items-start gap-2">
                <Icons.Key className="w-4 h-4 text-accent-warning mt-0.5 flex-shrink-0" />
                <span>
                  Your GitHub access token may be invalid or doesn&apos;t have
                  the necessary permissions
                </span>
              </li>
            )}

            {profileType && (
              <li className="flex items-start gap-2">
                <Icons.SwitchHorizontal
                  className={`w-4 h-4 ${isNotFound ? 'text-accent-danger' : 'text-accent-warning'} mt-0.5 flex-shrink-0`}
                />
                <span>
                  It might be a{' '}
                  {profileType === 'organization' ? 'user' : 'organization'}{' '}
                  account instead of{' '}
                  {profileType === 'organization'
                    ? 'an organization'
                    : 'a user'}{' '}
                  account - try{' '}
                  <button
                    onClick={() =>
                      navigate(
                        `/${profileType === 'organization' ? 'user' : 'org'}/${username}`
                      )
                    }
                    className="text-accent-1 hover:underline"
                  >
                    viewing as a{' '}
                    {profileType === 'organization' ? 'user' : 'organization'}
                  </button>
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Popular profiles suggestions */}
        <div className="w-full max-w-md mx-auto pt-4 border-t border-border-l dark:border-border-d">
          <h4 className="text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-3">
            Try one of these verified profiles instead:
          </h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularProfiles.map(profile => (
              <button
                key={profile.username}
                onClick={() =>
                  handleSuggestionClick(profile.username, profile.type)
                }
                className="px-3 py-1.5 text-xs bg-accent-1/10 hover:bg-accent-1/20 text-accent-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                {profile.username}
                <span
                  className={`text-xs ${profile.type === 'org' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'} px-1.5 py-0.5 rounded-full flex items-center gap-0.5`}
                >
                  {profile.type === 'org' ? (
                    <Icons.Building className="w-3 h-3" />
                  ) : (
                    <Icons.User className="w-3 h-3" />
                  )}
                  {profile.type}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 flex gap-4 justify-center">
          {!isNotFound && (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm bg-accent-1 hover:bg-accent-2 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Icons.RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          <a
            href="/"
            className="px-4 py-2 text-sm border border-accent-1 text-accent-1 hover:bg-accent-1/10 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Icons.Home className="w-4 h-4" />
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
