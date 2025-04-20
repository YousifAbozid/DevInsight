import { useState, useEffect } from 'react';

interface GithubProfileSearchProps {
  onSearch: (username: string, token?: string) => void;
  isLoading: boolean;
  initialUsername?: string;
  initialToken?: string;
}

export default function GithubProfileSearch({
  onSearch,
  isLoading,
  initialUsername = '',
  initialToken = '',
}: GithubProfileSearchProps) {
  const [username, setUsername] = useState(initialUsername);
  const [token, setToken] = useState(initialToken);
  const [showTokenInput, setShowTokenInput] = useState(!!initialToken);
  const [recentUsers, setRecentUsers] = useState<string[]>([]);

  // Load saved values from localStorage on initial render
  useEffect(() => {
    const savedUsername = localStorage.getItem('github_username');
    const savedToken = localStorage.getItem('github_token');
    const savedRecentUsers = localStorage.getItem('recent_github_users');

    if (savedUsername) {
      setUsername(savedUsername);
    }

    if (savedToken) {
      setToken(savedToken);
      setShowTokenInput(true);
    }

    if (savedRecentUsers) {
      try {
        setRecentUsers(JSON.parse(savedRecentUsers));
      } catch (e) {
        console.error('Failed to parse recent users from localStorage', e);
      }
    }

    // Auto-search with saved credentials
    if (savedUsername) {
      onSearch(savedUsername, savedToken || undefined);
    }
  }, [onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Save to localStorage
      localStorage.setItem('github_username', username.trim());

      // Save to recent users list
      const updatedRecentUsers = [
        ...new Set([username.trim(), ...recentUsers]),
      ].slice(0, 5); // Keep only the 5 most recent

      localStorage.setItem(
        'recent_github_users',
        JSON.stringify(updatedRecentUsers)
      );
      setRecentUsers(updatedRecentUsers);

      if (token.trim()) {
        localStorage.setItem('github_token', token.trim());
      }

      onSearch(username.trim(), token.trim() || undefined);
    }
  };

  const handleQuickFill = (selectedUsername: string) => {
    setUsername(selectedUsername);
    // Optional: automatically trigger search when selecting a recent user
    localStorage.setItem('github_username', selectedUsername);
    onSearch(selectedUsername, token.trim() || undefined);
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
            className="px-6 py-2 rounded-lg bg-accent-1 hover:bg-accent-2 disabled:opacity-50 text-l-text-inv dark:text-d-text-inv transition-colors cursor-pointer"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Recent users section */}
        {recentUsers.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-l-text-2 dark:text-d-text-2 mb-1">
              Recent searches:
            </p>
            <div className="flex flex-wrap gap-2">
              {recentUsers.map(user => (
                <button
                  key={user}
                  type="button"
                  onClick={() => handleQuickFill(user)}
                  className="px-2 py-1 text-xs rounded-full bg-l-bg-2 dark:bg-d-bg-2 hover:bg-l-bg-3 dark:hover:bg-d-bg-3 text-l-text-2 dark:text-d-text-2 border border-border-l/50 dark:border-border-d/50"
                >
                  {user}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="text-sm text-accent-1 hover:text-accent-2 flex items-center gap-1"
          >
            {showTokenInput ? 'Hide token input' : 'Show token input'}
            <span className="text-xs">(for contribution heatmap)</span>
          </button>
          {token && !showTokenInput && (
            <span className="text-xs text-accent-success">(Token saved)</span>
          )}
        </div>

        {showTokenInput && (
          <div className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="GitHub Personal Access Token (optional)"
                className="w-full px-4 py-2 rounded-lg bg-l-bg-2 dark:bg-d-bg-2 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none pr-20"
                disabled={isLoading}
              />
              {token && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('github_token');
                    setToken('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-accent-danger/10 text-accent-danger rounded hover:bg-accent-danger/20"
                >
                  Clear token
                </button>
              )}
            </div>
            <p className="text-xs text-l-text-3 dark:text-d-text-3">
              The token is required to fetch contribution data. It&apos;s stored
              only in your browser and never sent to our servers. Create a token
              with the &apos;user&apos; scope at{' '}
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
