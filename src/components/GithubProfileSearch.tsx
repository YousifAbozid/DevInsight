import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Icons } from './shared/Icons';
import { useGithubToken } from '../hooks/useStorage';

interface GithubProfileSearchProps {
  onSearch: (username: string, token?: string) => void;
  isLoading: boolean;
  initialUsername?: string;
  initialToken?: string;
  defaultUsername?: string; // Add defaultUsername prop
}

// Add ref for external control
const GithubProfileSearch = forwardRef(
  (
    {
      onSearch,
      isLoading,
      initialUsername = '',
      // initialToken = '',
      defaultUsername = '', // Use the defaultUsername prop
    }: GithubProfileSearchProps,
    ref
  ) => {
    const [username, setUsername] = useState(
      defaultUsername || initialUsername
    );

    // Use the secure hook for token management
    const [token, setToken, removeToken, isTokenLoading] = useGithubToken();
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [recentUsers, setRecentUsers] = useState<string[]>([]);
    const [showTokenSaved, setShowTokenSaved] = useState(false);
    const usernameTimeoutRef = useRef<number | null>(null);

    // Track the last searched username to detect changes
    const [lastSearchedUsername, setLastSearchedUsername] = useState(
      defaultUsername || ''
    );

    // Check if there are changes to search
    const hasUsernameChanges = username.trim() !== lastSearchedUsername;

    // Expose methods for parent component to use
    useImperativeHandle(ref, () => ({
      setUsername,
      setToken: async (newToken: string) => {
        try {
          await setToken(newToken);
        } catch (error) {
          console.error('Error setting token:', error);
        }
      },
      setRecentUsers,
      handleQuickFill,
    }));

    // Load saved values from localStorage on initial render
    useEffect(() => {
      const savedUsername =
        defaultUsername || localStorage.getItem('github_username');
      const savedRecentUsers = localStorage.getItem('recent_github_users');

      if (savedUsername) {
        setUsername(savedUsername);
        // Also set as last searched username since we're auto-searching with it
        setLastSearchedUsername(savedUsername);
      }

      if (savedRecentUsers) {
        try {
          setRecentUsers(JSON.parse(savedRecentUsers));
        } catch (e) {
          console.error('Failed to parse recent users from localStorage', e);
        }
      }

      // Auto-search with saved credentials (token is already loaded by the hook)
      if (savedUsername) {
        onSearch(savedUsername, token || undefined);
      }
    }, [onSearch, defaultUsername, token]);

    // Update when defaultUsername changes but only on initial render or when defaultUsername changes
    // Add a ref to track if we're in an edit state
    const isEditingRef = useRef(false);

    useEffect(() => {
      // Only update if not currently being edited by user
      if (
        defaultUsername &&
        defaultUsername !== username &&
        !isEditingRef.current
      ) {
        setUsername(defaultUsername);
        setLastSearchedUsername(defaultUsername);
      }
    }, [defaultUsername, username]);

    // Track when user is editing the input
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      isEditingRef.current = true;
      setUsername(e.target.value);
    };

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

        onSearch(username.trim(), token || undefined);

        // Update the last searched username
        setLastSearchedUsername(username.trim());
      }
    };

    // Handle token changes
    const handleTokenChange = async (newToken: string) => {
      try {
        await setToken(newToken);

        // Show saved feedback
        setShowTokenSaved(true);
        setTimeout(() => setShowTokenSaved(false), 3000);

        // If we already have a username, refresh the search with the new token
        if (username.trim()) {
          onSearch(username.trim(), newToken.trim());
        }
      } catch (error) {
        console.error('Error saving token:', error);
      }
    };

    // Handle token clearing
    const handleTokenClear = async () => {
      try {
        removeToken();

        // Show cleared feedback
        setShowTokenSaved(true);
        setTimeout(() => setShowTokenSaved(false), 3000);

        // Refresh search without token if we have a username
        if (username.trim()) {
          onSearch(username.trim(), undefined);
        }
      } catch (error) {
        console.error('Error clearing token:', error);
      }
    };

    const handleQuickFill = (selectedUsername: string) => {
      setUsername(selectedUsername);
      localStorage.setItem('github_username', selectedUsername);
      onSearch(selectedUsername, token || undefined);

      // Update the last searched username
      setLastSearchedUsername(selectedUsername);
    };

    // Handle clearing username input
    const handleUsernameClear = () => {
      setUsername('');
      localStorage.removeItem('github_username');
      // Update the last searched username to empty string
      setLastSearchedUsername('');
      // Tell the parent component the username has been cleared
      onSearch('', token || undefined);
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
                <Icons.User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
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
                  <Icons.Close className="w-3.5 h-3.5" />
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
                  <Icons.Search className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {/* Recent users section with improved UI */}
          {recentUsers.length > 0 && (
            <div className="bg-l-bg-3/50 dark:bg-d-bg-3/50 p-2.5 rounded-lg">
              <div className="flex items-center gap-2 mb-1.5 text-xs text-l-text-2 dark:text-d-text-2">
                <Icons.Clock className="w-3.5 h-3.5" />
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
                      <Icons.Close className="w-3 h-3" />
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
                <Icons.Key className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-medium ml-1.5">
                  {showTokenInput ? 'Hide token' : 'GitHub Token'}
                </span>
              </div>
              <span className="text-xs text-l-text-3 dark:text-d-text-3">
                (required for contribution data)
              </span>
              {token && !showTokenInput && !showTokenSaved && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-accent-success/10 text-accent-success flex items-center gap-1 ml-0 sm:ml-1.5">
                  <Icons.Check className="w-3 h-3" />
                  <span>Active</span>
                </span>
              )}
              {showTokenSaved && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-accent-success/10 text-accent-success flex items-center gap-1 animate-pulse ml-0 sm:ml-1.5">
                  <Icons.Check className="w-3 h-3" />
                  <span>{token ? 'Saved' : 'Cleared'}</span>
                </span>
              )}
            </button>

            {showTokenInput && (
              <div className="bg-l-bg-3 dark:bg-d-bg-3 p-3 rounded-lg border border-border-l dark:border-border-d animate-fade-in-down">
                <div className="relative">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3">
                    <Icons.Key className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={token}
                    onChange={e => handleTokenChange(e.target.value)}
                    placeholder="GitHub Personal Access Token (optional)"
                    className="w-full pl-8 pr-16 py-2.5 text-sm rounded-lg bg-l-bg-2 dark:bg-d-bg-2 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none transition-all duration-200"
                    disabled={isLoading || isTokenLoading}
                  />
                  {token && (
                    <button
                      type="button"
                      onClick={handleTokenClear}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 bg-accent-danger/10 text-accent-danger rounded hover:bg-accent-danger/20 flex items-center gap-1 transition-colors duration-200"
                    >
                      <Icons.Close className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
                <div className="flex items-start gap-1.5 mt-2 text-xs text-l-text-3 dark:text-d-text-3">
                  <Icons.AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <p className="text-xs">
                    The token is required to fetch contribution data. It&apos;s
                    stored securely in your browser and never sent to our
                    servers. Create a token with the &apos;user&apos; scope at{' '}
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
