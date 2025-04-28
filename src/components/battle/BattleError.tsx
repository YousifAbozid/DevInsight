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
    <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-6 rounded-lg my-6">
      <div className="flex items-start gap-4">
        <div className="text-accent-danger">
          <Icons.AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-accent-danger mb-2">
            Battle Error
          </h3>

          {user1ErrorType === 'not_found' && (
            <p className="text-accent-danger mb-2">
              User <span className="font-bold">{usernames.user1}</span> was not
              found. Please check the spelling and try again.
            </p>
          )}

          {user2ErrorType === 'not_found' && (
            <p className="text-accent-danger mb-2">
              User <span className="font-bold">{usernames.user2}</span> was not
              found. Please check the spelling and try again.
            </p>
          )}

          {(user1ErrorType === 'rate_limit' ||
            user2ErrorType === 'rate_limit') && (
            <p className="text-accent-danger mb-2">
              GitHub API rate limit exceeded. Please try again later or use a
              personal access token.
            </p>
          )}

          {!user1ErrorType && !user2ErrorType && (
            <p className="text-accent-danger mb-2">
              {user1Error instanceof Error
                ? user1Error.message
                : user2Error instanceof Error
                  ? user2Error.message
                  : 'An error occurred'}
            </p>
          )}

          <div className="mt-3 text-sm text-accent-danger/80">
            <p>Possible solutions:</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              {(user1ErrorType === 'not_found' ||
                user2ErrorType === 'not_found') && (
                <li>Double-check the username spelling</li>
              )}
              {(user1ErrorType === 'rate_limit' ||
                user2ErrorType === 'rate_limit') && (
                <li>
                  Add your GitHub personal access token to increase rate limits
                </li>
              )}
              <li>
                Try again in a few minutes if GitHub API is experiencing issues
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
