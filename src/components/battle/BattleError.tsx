import { Icons } from '../shared/Icons';

interface BattleErrorProps {
  usernames: { user1: string; user2: string } | null;
  user1ErrorType: 'not_found' | 'rate_limit' | 'generic' | null;
  user2ErrorType: 'not_found' | 'rate_limit' | 'generic' | null;
  user1Error?: unknown;
  user2Error?: unknown;
}

export default function BattleError({
  usernames,
  user1ErrorType,
  user2ErrorType,
  user1Error,
  user2Error,
}: BattleErrorProps) {
  if (!usernames) return null;

  return (
    <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-4 sm:p-6 rounded-lg my-4 sm:my-6 animate-fade-in">
      <div className="flex items-start gap-2 sm:gap-4">
        <div className="text-accent-danger hidden sm:block">
          <Icons.AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-medium text-accent-danger mb-2 flex items-center gap-2">
            <Icons.AlertCircle className="w-5 h-5 sm:hidden" />
            <Icons.Close className="w-4 h-4 sm:w-5 sm:h-5 text-accent-danger" />
            Battle Error
          </h3>

          {user1ErrorType === 'not_found' && (
            <p className="text-accent-danger mb-2 text-sm sm:text-base">
              User{' '}
              <span className="font-bold break-all">{usernames.user1}</span> was
              not found. Please check the spelling and try again.
            </p>
          )}

          {user2ErrorType === 'not_found' && (
            <p className="text-accent-danger mb-2 text-sm sm:text-base">
              User{' '}
              <span className="font-bold break-all">{usernames.user2}</span> was
              not found. Please check the spelling and try again.
            </p>
          )}

          {(user1ErrorType === 'rate_limit' ||
            user2ErrorType === 'rate_limit') && (
            <p className="text-accent-danger mb-2 text-sm sm:text-base">
              GitHub API rate limit exceeded. Please try again later or use a
              personal access token.
            </p>
          )}

          {!user1ErrorType && !user2ErrorType && (
            <p className="text-accent-danger mb-2 text-sm sm:text-base break-words">
              {user1Error instanceof Error
                ? user1Error.message
                : user2Error instanceof Error
                  ? user2Error.message
                  : 'An error occurred'}
            </p>
          )}

          <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-accent-danger/80 bg-accent-danger/5 p-3 rounded-lg">
            <p className="font-medium flex items-center gap-1.5">
              <Icons.Info className="w-3.5 h-3.5 flex-shrink-0" />
              Possible solutions:
            </p>
            <ul className="list-disc ml-4 sm:ml-5 mt-1.5 space-y-1">
              {(user1ErrorType === 'not_found' ||
                user2ErrorType === 'not_found') && (
                <li>Double-check the username spelling</li>
              )}
              {(user1ErrorType === 'rate_limit' ||
                user2ErrorType === 'rate_limit') && (
                <li className="flex flex-wrap items-center gap-1">
                  <Icons.Key className="w-3 h-3 text-accent-danger/70 flex-shrink-0" />
                  Add your GitHub personal access token to increase rate limits
                </li>
              )}
              <li className="flex flex-wrap items-center gap-1">
                <Icons.RefreshCw className="w-3 h-3 text-accent-danger/70 flex-shrink-0" />
                Try again in a few minutes if GitHub API is experiencing issues
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
