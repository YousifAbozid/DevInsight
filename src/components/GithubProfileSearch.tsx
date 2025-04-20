import { useState, useEffect, useRef } from 'react';
import {
  User,
  Search,
  X,
  Key,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

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
  const [showTokenSaved, setShowTokenSaved] = useState(false);
  const tokenTimeoutRef = useRef<number | null>(null);

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

  // Debounced token saving
  useEffect(() => {
    // Clear any existing timeout
    if (tokenTimeoutRef.current) {
      clearTimeout(tokenTimeoutRef.current);
    }

    // Only save if not empty and different from what's in localStorage
    if (token.trim() && token !== localStorage.getItem('github_token')) {
      tokenTimeoutRef.current = window.setTimeout(() => {
        localStorage.setItem('github_token', token.trim());

        // Show saved feedback
        setShowTokenSaved(true);
        setTimeout(() => setShowTokenSaved(false), 3000);

        // If we already have a username, refresh the search with the new token
        if (username.trim()) {
          onSearch(username.trim(), token.trim());
        }
      }, 1000); // 1 second debounce
    }

    return () => {
      if (tokenTimeoutRef.current) {
        clearTimeout(tokenTimeoutRef.current);
      }
    };
  }, [token, username, onSearch]);

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

      onSearch(username.trim(), token.trim() || undefined);
    }
  };

  const handleTokenClear = () => {
    localStorage.removeItem('github_token');
    setToken('');
    setShowTokenSaved(true);
    setTimeout(() => setShowTokenSaved(false), 3000);

    // Refresh search without token if we have a username
    if (username.trim()) {
      onSearch(username.trim(), undefined);
    }
  };

  const handleQuickFill = (selectedUsername: string) => {
    setUsername(selectedUsername);
    localStorage.setItem('github_username', selectedUsername);
    onSearch(selectedUsername, token.trim() || undefined);
  };

  // Handle clearing username input
  const handleUsernameClear = () => {
    setUsername('');
    localStorage.removeItem('github_username');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="flex flex-col gap-4">
        {/* Main search bar with improved UI and clear button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3">
              <User size={18} />
            </div>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              className="w-full pl-10 pr-12 py-3 rounded-lg bg-l-bg-2 dark:bg-d-bg-2 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none"
              disabled={isLoading}
            />
            {username && (
              <button
                type="button"
                onClick={handleUsernameClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger"
                aria-label="Clear username"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="px-6 py-3 rounded-lg bg-accent-1 hover:bg-accent-2 disabled:opacity-50 text-l-text-inv dark:text-d-text-inv transition-colors cursor-pointer flex items-center justify-center gap-2 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⌛</span>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Search</span>
              </>
            )}
          </button>
        </div>

        {/* Recent users section with improved UI */}
        {recentUsers.length > 0 && (
          <div className="bg-l-bg-3/50 dark:bg-d-bg-3/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-sm text-l-text-2 dark:text-d-text-2">
              <Clock size={16} />
              <span>Recent searches:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentUsers.map(user => (
                <button
                  key={user}
                  type="button"
                  onClick={() => handleQuickFill(user)}
                  className="px-3 py-1.5 text-sm rounded-full bg-l-bg-2 dark:bg-d-bg-2 hover:bg-accent-1/10 hover:text-accent-1 dark:hover:bg-accent-1/10 dark:hover:text-accent-1 text-l-text-2 dark:text-d-text-2 border border-border-l/50 dark:border-border-d/50 transition-colors"
                >
                  {user}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('recent_github_users');
                  setRecentUsers([]);
                }}
                className="px-3 py-1.5 text-sm rounded-full bg-accent-danger/10 text-accent-danger hover:bg-accent-danger/20 transition-colors"
              >
                Clear history
              </button>
            </div>
          </div>
        )}

        {/* Token section with improved UX */}
        <div className="mt-1">
          <button
            type="button"
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="flex items-center gap-2 text-accent-1 hover:text-accent-2 transition-colors mb-2"
          >
            <Key className="text-lg" />
            <div>
              <span className="font-medium">
                {showTokenInput ? 'Hide token input' : 'GitHub Access Token'}
              </span>
              <span className="text-xs ml-2 text-l-text-3 dark:text-d-text-3">
                (required for contribution data)
              </span>
            </div>
            {token && !showTokenInput && !showTokenSaved && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-accent-success/10 text-accent-success flex items-center gap-1">
                <CheckCircle size={14} />
                <span>Token active</span>
              </span>
            )}
            {showTokenSaved && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-accent-success/10 text-accent-success animate-fade-in flex items-center gap-1">
                <CheckCircle size={14} />
                <span>{token ? 'Token saved!' : 'Token cleared!'}</span>
              </span>
            )}
          </button>

          {showTokenInput && (
            <div className="bg-l-bg-3 dark:bg-d-bg-3 p-4 rounded-lg border border-border-l dark:border-border-d">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3">
                  <Key size={18} />
                </div>
                <input
                  type="password"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="GitHub Personal Access Token (optional)"
                  className="w-full pl-10 pr-20 py-3 rounded-lg bg-l-bg-2 dark:bg-d-bg-2 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none"
                  disabled={isLoading}
                />
                {token && (
                  <button
                    type="button"
                    onClick={handleTokenClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-accent-danger/10 text-accent-danger rounded hover:bg-accent-danger/20 flex items-center gap-1"
                  >
                    <X size={14} />
                    <span>Clear</span>
                  </button>
                )}
              </div>
              <div className="flex items-start gap-2 mt-3 text-xs text-l-text-3 dark:text-d-text-3">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p>
                  The token is required to fetch contribution data. It&apos;s
                  stored only in your browser and never sent to our servers.
                  Create a token with the &apos;user&apos; scope at{' '}
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-accent-1 hover:text-accent-2"
                  >
                    github.com/settings/tokens
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
