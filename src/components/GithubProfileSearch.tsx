import { useState } from 'react';

interface GithubProfileSearchProps {
  onSearch: (username: string, token?: string) => void;
  isLoading: boolean;
}

export default function GithubProfileSearch({
  onSearch,
  isLoading,
}: GithubProfileSearchProps) {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim(), token.trim() || undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className="flex-grow px-4 py-2 rounded-lg bg-l-bg-2 dark:bg-d-bg-2 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="px-6 py-2 rounded-lg bg-accent-1 hover:bg-accent-2 disabled:opacity-50 text-l-text-inv dark:text-d-text-inv transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="text-sm text-accent-1 hover:text-accent-2 flex items-center gap-1"
          >
            {showTokenInput ? 'Hide token input' : 'Show token input'}
            <span className="text-xs">(for contribution heatmap)</span>
          </button>
        </div>

        {showTokenInput && (
          <div className="flex flex-col gap-2">
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="GitHub Personal Access Token (optional)"
              className="px-4 py-2 rounded-lg bg-l-bg-2 dark:bg-d-bg-2 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none"
              disabled={isLoading}
            />
            <p className="text-xs text-l-text-3 dark:text-d-text-3">
              The token is required to fetch contribution data. It&apos;s stored
              only in memory and never sent to our servers. Create a token with
              the &apos;user&apos; scope at{' '}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-accent-1"
              >
                github.com/settings/tokens
              </a>
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
