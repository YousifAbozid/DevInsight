import { useState, useEffect } from 'react';

interface GithubCompareFormProps {
  onCompare: (user1: string, user2: string, token?: string) => void;
  isLoading: boolean;
  initialToken?: string;
}

export default function GithubCompareForm({
  onCompare,
  isLoading,
  initialToken = '',
}: GithubCompareFormProps) {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [token, setToken] = useState(initialToken);
  const [showTokenInput, setShowTokenInput] = useState(!!initialToken);
  const [recentUsers, setRecentUsers] = useState<string[]>([]);

  useEffect(() => {
    // Load recent users from localStorage
    const savedUsers = localStorage.getItem('recent_github_users');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers)) {
          setRecentUsers(parsedUsers.slice(0, 5)); // Limit to 5 recent users
        }
      } catch (e) {
        console.error('Error parsing recent users:', e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user1.trim() && user2.trim()) {
      // Save users to recent list
      const updatedRecentUsers = [
        ...new Set([user1.trim(), user2.trim(), ...recentUsers]),
      ].slice(0, 5);

      localStorage.setItem(
        'recent_github_users',
        JSON.stringify(updatedRecentUsers)
      );
      setRecentUsers(updatedRecentUsers);

      onCompare(user1.trim(), user2.trim(), token.trim() || undefined);
    }
  };

  const handleQuickFill = (username: string, field: 'user1' | 'user2') => {
    if (field === 'user1') {
      setUser1(username);
    } else {
      setUser2(username);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="user1"
            className="block text-l-text-1 dark:text-d-text-1 font-medium mb-2"
          >
            First Challenger
          </label>
          <div className="flex">
            <input
              id="user1"
              type="text"
              value={user1}
              onChange={e => setUser1(e.target.value)}
              placeholder="GitHub username"
              className="flex-grow px-4 py-2 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none"
              disabled={isLoading}
              required
            />
          </div>

          {recentUsers.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-l-text-3 dark:text-d-text-3">
                Recent users:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {recentUsers.map(username => (
                  <button
                    key={`user1-${username}`}
                    type="button"
                    onClick={() => handleQuickFill(username, 'user1')}
                    className="px-2 py-1 text-xs rounded-md bg-l-bg-3 dark:bg-d-bg-3 text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover"
                  >
                    {username}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="user2"
            className="block text-l-text-1 dark:text-d-text-1 font-medium mb-2"
          >
            Second Challenger
          </label>
          <div className="flex">
            <input
              id="user2"
              type="text"
              value={user2}
              onChange={e => setUser2(e.target.value)}
              placeholder="GitHub username"
              className="flex-grow px-4 py-2 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none"
              disabled={isLoading}
              required
            />
          </div>

          {recentUsers.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-l-text-3 dark:text-d-text-3">
                Recent users:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {recentUsers.map(username => (
                  <button
                    key={`user2-${username}`}
                    type="button"
                    onClick={() => handleQuickFill(username, 'user2')}
                    className="px-2 py-1 text-xs rounded-md bg-l-bg-3 dark:bg-d-bg-3 text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover"
                  >
                    {username}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="text-sm text-accent-1 hover:text-accent-2 flex items-center gap-1"
          >
            {showTokenInput ? 'Hide token input' : 'Show token input'}
            <span className="text-xs">(for contribution data)</span>
          </button>
          {token && !showTokenInput && (
            <span className="text-xs text-accent-success">(Token saved)</span>
          )}
        </div>

        {showTokenInput && (
          <div className="mb-4">
            <div className="relative">
              <input
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="GitHub Personal Access Token (optional)"
                className="w-full px-4 py-2 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none pr-20"
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
            <p className="text-xs text-l-text-3 dark:text-d-text-3 mt-1">
              The token is required to fetch contribution data. It&apos;s stored
              only in your browser and never sent to our servers.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !user1.trim() || !user2.trim()}
          className="w-full px-6 py-3 rounded-lg bg-accent-1 hover:bg-accent-2 disabled:opacity-50 text-l-text-inv dark:text-d-text-inv transition-colors cursor-pointer font-medium"
        >
          {isLoading ? 'Comparing...' : 'Compare Users ⚔️'}
        </button>
      </div>
    </form>
  );
}
