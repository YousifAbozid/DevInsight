import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Icons } from './shared/Icons';
import { useGithubToken } from '../hooks/useStorage';
import GitHubTokenSection from './shared/GitHubTokenSection';
import RecentGithubUsers from './shared/RecentGithubUsers';

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
      defaultUsername = '',
    }: GithubProfileSearchProps,
    ref
  ) => {
    const [username, setUsername] = useState(
      defaultUsername || initialUsername
    );

    // Use the secure hook for token management
    const [token, setToken, removeToken, isTokenLoading] = useGithubToken();
    const [showTokenSaved, setShowTokenSaved] = useState(false);
    const usernameTimeoutRef = useRef<number | null>(null);

    // Reference to recent users functions
    const recentUsersRef = useRef<{
      addUser: (
        username: string,
        options?: { noReorder?: boolean }
      ) => { status: 'added' | 'exists' | 'error'; index: number };
      removeUser: (username: string) => void;
      clearUsers: () => void;
      getUsers: () => string[];
    } | null>(null);

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
      handleQuickFill,
      addRecentUser: (username: string) => {
        recentUsersRef.current?.addUser(username);
      },
    }));

    // Load saved values from localStorage on initial render
    useEffect(() => {
      const savedUsername =
        defaultUsername || localStorage.getItem('github_username');

      if (savedUsername) {
        setUsername(savedUsername);
        // Also set as last searched username since we're auto-searching with it
        setLastSearchedUsername(savedUsername);
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

        // Check if username already exists in recent users
        const currentUsers = recentUsersRef.current?.getUsers() || [];
        const exists = currentUsers.includes(username.trim());

        // Add to recent users list with noReorder option if it already exists
        recentUsersRef.current?.addUser(username.trim(), { noReorder: exists });

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

    // Handler for when a recent user is selected
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
    //     const handleRemoveRecentUser = (
    //       userToRemove: string,
    //       e: React.MouseEvent
    //     ) => {
    //       e.stopPropagation(); // Prevent triggering parent button
    //
    //       const updatedRecentUsers = recentUsers.filter(
    //         user => user !== userToRemove
    //       );
    //       setRecentUsers(updatedRecentUsers);
    //       localStorage.setItem(
    //         'recent_github_users',
    //         JSON.stringify(updatedRecentUsers)
    //       );
    //     };

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

          {/* Recent users section */}
          <RecentGithubUsers
            onSelectUser={handleQuickFill}
            className="mt-1"
            recentUsersRef={recentUsersRef}
          />

          {/* Token section */}
          <GitHubTokenSection
            token={token}
            onTokenChange={handleTokenChange}
            onTokenClear={handleTokenClear}
            isLoading={isLoading}
            isTokenLoading={isTokenLoading}
            showTokenSaved={showTokenSaved}
          />
        </div>
      </form>
    );
  }
);

// Add display name
GithubProfileSearch.displayName = 'GithubProfileSearch';

export default GithubProfileSearch;
