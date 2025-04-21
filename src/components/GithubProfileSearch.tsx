import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
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

// Add ref for external control
const GithubProfileSearch = forwardRef(
  (
    {
      onSearch,
      isLoading,
      initialUsername = '',
      initialToken = '',
    }: GithubProfileSearchProps,
    ref
  ) => {
    const [username, setUsername] = useState(initialUsername);
    const [token, setToken] = useState(initialToken);
    const [showTokenInput, setShowTokenInput] = useState(false); // Always closed by default
    const [recentUsers, setRecentUsers] = useState<string[]>([]);
    const [showTokenSaved, setShowTokenSaved] = useState(false);
    const tokenTimeoutRef = useRef<number | null>(null);
    const usernameTimeoutRef = useRef<number | null>(null);

    // Track the last searched username to detect changes
    const [lastSearchedUsername, setLastSearchedUsername] = useState('');

    // Check if there are changes to search
    const hasUsernameChanges = username.trim() !== lastSearchedUsername;

    // Expose methods for parent component to use
    useImperativeHandle(ref, () => ({
      setUsername,
      setToken,
      setRecentUsers,
      handleQuickFill,
    }));

    // Load saved values from localStorage on initial render
    useEffect(() => {
      const savedUsername = localStorage.getItem('github_username');
      const savedToken = localStorage.getItem('github_token');
      const savedRecentUsers = localStorage.getItem('recent_github_users');

      if (savedUsername) {
        setUsername(savedUsername);
        // Also set as last searched username since we're auto-searching with it
        setLastSearchedUsername(savedUsername);
      }

      if (savedToken) {
        setToken(savedToken);
        // Don't set showTokenInput to true here to keep it closed by default
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

    // Debounced username saving/removing
    useEffect(() => {
      // Clear any existing timeout
      if (usernameTimeoutRef.current) {
        clearTimeout(usernameTimeoutRef.current);
      }

      usernameTimeoutRef.current = window.setTimeout(() => {
        if (username.trim()) {
          localStorage.setItem('github_username', username.trim());
        } else {
          localStorage.removeItem('github_username');
        }
      }, 500); // 500ms debounce

      return () => {
        if (usernameTimeoutRef.current) {
          clearTimeout(usernameTimeoutRef.current);
        }
      };
    }, [username]);

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

        // Update the last searched username
        setLastSearchedUsername(username.trim());
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

      // Update the last searched username
      setLastSearchedUsername(selectedUsername);
    };

    // Handle clearing username input
    const handleUsernameClear = () => {
      setUsername('');
      localStorage.removeItem('github_username');
      // Don't reset lastSearchedUsername here - we want to detect the change
    };

    // Handle removing specific user from recent searches
    const handleRemoveRecentUser = (
      userToRemove: string,
      e: React.MouseEvent
    ) => {
      e.stopPropagation(); // Prevent triggering parent button

      const updatedRecentUsers = recentUsers.filter(
        user => user !== userToRemove
      );
      setRecentUsers(updatedRecentUsers);
      localStorage.setItem(
        'recent_github_users',
        JSON.stringify(updatedRecentUsers)
      );
    };

    return (
      <form onSubmit={handleSubmit} className="w-full mb-6">
        <div className="flex flex-col gap-3">
          {/* Main search bar with improved UI and clear button */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3">
                <User size={16} />
              </div>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
                className="w-full pl-8 pr-10 py-2.5 text-sm rounded-lg bg-l-bg-2 dark:bg-d-bg-2 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none transition-all duration-200"
                disabled={isLoading}
              />
              {username && (
                <button
                  type="button"
                  onClick={handleUsernameClear}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger cursor-pointer transition-colors duration-200"
                  aria-label="Clear username"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !username.trim() || !hasUsernameChanges}
              className="px-4 py-2.5 rounded-lg bg-accent-1 hover:bg-accent-2 disabled:opacity-50 text-l-text-inv dark:text-d-text-inv transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 min-w-[100px] text-sm"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⌛</span>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {/* Recent users section with improved UI */}
          {recentUsers.length > 0 && (
            <div className="bg-l-bg-3/50 dark:bg-d-bg-3/50 p-2.5 rounded-lg">
              <div className="flex items-center gap-2 mb-1.5 text-xs text-l-text-2 dark:text-d-text-2">
                <Clock size={14} />
                <span>Recent searches:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentUsers.map(user => (
                  <div key={user} className="relative group">
                    <button
                      type="button"
                      onClick={() => handleQuickFill(user)}
                      className="pl-2.5 pr-7 py-1 text-xs rounded-full bg-l-bg-2 dark:bg-d-bg-2 hover:bg-accent-1/10 hover:text-accent-1 dark:hover:bg-accent-1/10 dark:hover:text-accent-1 text-l-text-2 dark:text-d-text-2 border border-border-l/50 dark:border-border-d/50 transition-all duration-200 cursor-pointer"
                    >
                      {user}
                    </button>
                    <button
                      type="button"
                      onClick={e => handleRemoveRecentUser(user, e)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger rounded-full p-0.5 cursor-pointer opacity-40 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                      aria-label={`Remove ${user} from recent searches`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('recent_github_users');
                    setRecentUsers([]);
                  }}
                  className="px-2.5 py-1 text-xs rounded-full bg-accent-danger/10 text-accent-danger hover:bg-accent-danger/20 transition-colors duration-200 cursor-pointer"
                >
                  Clear history
                </button>
              </div>
            </div>
          )}

          {/* Token section with improved mobile layout */}
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setShowTokenInput(!showTokenInput)}
              className="flex flex-wrap items-center gap-1.5 text-accent-1 hover:text-accent-2 transition-colors mb-2 cursor-pointer text-sm w-full"
            >
              <div className="flex items-center">
                <Key size={14} className="flex-shrink-0" />
                <span className="font-medium ml-1.5">
                  {showTokenInput ? 'Hide token' : 'GitHub Token'}
                </span>
              </div>
              <span className="text-xs text-l-text-3 dark:text-d-text-3">
                (required for contribution data)
              </span>
              {token && !showTokenInput && !showTokenSaved && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-accent-success/10 text-accent-success flex items-center gap-1 ml-0 sm:ml-1.5">
                  <CheckCircle size={12} />
                  <span>Active</span>
                </span>
              )}
              {showTokenSaved && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-accent-success/10 text-accent-success flex items-center gap-1 animate-pulse ml-0 sm:ml-1.5">
                  <CheckCircle size={12} />
                  <span>{token ? 'Saved' : 'Cleared'}</span>
                </span>
              )}
            </button>

            {showTokenInput && (
              <div className="bg-l-bg-3 dark:bg-d-bg-3 p-3 rounded-lg border border-border-l dark:border-border-d animate-fade-in-down">
                <div className="relative">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3">
                    <Key size={16} />
                  </div>
                  <input
                    type="password"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    placeholder="GitHub Personal Access Token (optional)"
                    className="w-full pl-8 pr-16 py-2.5 text-sm rounded-lg bg-l-bg-2 dark:bg-d-bg-2 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none transition-all duration-200"
                    disabled={isLoading}
                  />
                  {token && (
                    <button
                      type="button"
                      onClick={handleTokenClear}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 bg-accent-danger/10 text-accent-danger rounded hover:bg-accent-danger/20 flex items-center gap-1 transition-colors duration-200"
                    >
                      <X size={12} />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
                <div className="flex items-start gap-1.5 mt-2 text-xs text-l-text-3 dark:text-d-text-3">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <p className="text-xs">
                    The token is required to fetch contribution data. It&apos;s
                    stored only in your browser and never sent to our servers.
                    Create a token with the &apos;user&apos; scope at{' '}
                    <a
                      href="https://github.com/settings/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-accent-1 hover:text-accent-2 transition-colors duration-200"
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
);

// Add display name
GithubProfileSearch.displayName = 'GithubProfileSearch';

export default GithubProfileSearch;
