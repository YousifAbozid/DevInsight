import { useState, useRef, useEffect } from 'react';
import { Icons } from './shared/Icons';
import { useGithubToken } from '../hooks/useStorage';
import GitHubTokenSection from './shared/GitHubTokenSection';
import RecentGithubUsers from './shared/RecentGithubUsers';

interface GithubCompareFormProps {
  onCompare: (user1: string, user2: string, token?: string) => void;
  isLoading: boolean;
  initialToken?: string;
}

export default function GithubCompareForm({
  onCompare,
  isLoading,
}: GithubCompareFormProps) {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');

  // Use the secure hook for token management
  const [token, setToken, removeToken, isTokenLoading] = useGithubToken();
  const [showTokenSaved, setShowTokenSaved] = useState(false);

  // References for recent users functionality
  const recentUsersRef1 = useRef<{
    addUser: (username: string) => void;
    removeUser: (username: string) => void;
    clearUsers: () => void;
    getUsers: () => string[];
  } | null>(null);

  const recentUsersRef2 = useRef<typeof recentUsersRef1.current>(null);

  // Track current comparison state to detect changes
  const [currentComparison, setCurrentComparison] = useState({
    user1: '',
    user2: '',
    token: '',
  });

  // Check if current inputs differ from what's currently being compared
  const hasChanges =
    user1.trim() !== currentComparison.user1 ||
    user2.trim() !== currentComparison.user2 ||
    token !== currentComparison.token;

  useEffect(() => {
    // Load recent users from localStorage
    const savedUsers = localStorage.getItem('recent_github_users');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers)) {
          // setRecentUsers(parsedUsers.slice(0, 5)); // Limit to 5 recent users
        }
      } catch (e) {
        console.error('Error parsing recent users:', e);
      }
    }
  }, []);

  // Handle token changes with feedback
  const handleTokenChange = async (newToken: string) => {
    try {
      await setToken(newToken);

      // Show saved feedback
      setShowTokenSaved(true);
      setTimeout(() => setShowTokenSaved(false), 3000);

      // Auto-trigger comparison if both usernames are filled
      if (user1.trim() && user2.trim()) {
        onCompare(user1.trim(), user2.trim(), newToken.trim() || undefined);
        // Update current comparison state
        setCurrentComparison({
          user1: user1.trim(),
          user2: user2.trim(),
          token: newToken.trim(),
        });
      }
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user1.trim() && user2.trim()) {
      // Add users to recent users lists
      recentUsersRef1.current?.addUser(user1.trim());
      recentUsersRef2.current?.addUser(user2.trim());

      onCompare(user1.trim(), user2.trim(), token || undefined);

      // Update current comparison state
      setCurrentComparison({
        user1: user1.trim(),
        user2: user2.trim(),
        token: token || '',
      });
    }
  };

  const handleQuickFill = (username: string, field: string = 'user1') => {
    if (field === 'user1') {
      setUser1(username);
    } else {
      setUser2(username);
    }
  };

  const handleClearUser = (field: 'user1' | 'user2') => {
    if (field === 'user1') {
      setUser1('');
    } else {
      setUser2('');
    }
  };

  const handleTokenClear = async () => {
    try {
      removeToken();

      // Show cleared feedback
      setShowTokenSaved(true);
      setTimeout(() => setShowTokenSaved(false), 3000);

      // Force immediate compare instead of waiting for the effect if we have users
      if (user1.trim() && user2.trim()) {
        onCompare(user1.trim(), user2.trim(), undefined);
        setCurrentComparison({
          user1: user1.trim(),
          user2: user2.trim(),
          token: '',
        });
      }
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-4 sm:p-6 border border-border-l dark:border-border-d mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label
            htmlFor="user1"
            className="text-l-text-1 dark:text-d-text-1 font-medium mb-1.5 flex items-center gap-1.5 text-sm"
          >
            <Icons.User className="w-4 h-4 text-accent-1" />
            First Challenger
          </label>
          <div className="relative">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3">
              <Icons.User className="w-4 h-4" />
            </div>
            <input
              id="user1"
              type="text"
              value={user1}
              onChange={e => setUser1(e.target.value)}
              placeholder="Enter GitHub username"
              className="w-full pl-8 pr-10 py-2.5 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none transition-all duration-200"
              disabled={isLoading}
              required
            />
            {user1 && (
              <button
                type="button"
                onClick={() => handleClearUser('user1')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger cursor-pointer transition-colors duration-200"
                aria-label="Clear first username"
              >
                <Icons.Close className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Recent users for user1 */}
          <RecentGithubUsers
            onSelectUser={handleQuickFill}
            field="user1"
            className="mt-2"
            recentUsersRef={recentUsersRef1}
          />
        </div>

        <div>
          <label
            htmlFor="user2"
            className="text-l-text-1 dark:text-d-text-1 font-medium mb-1.5 flex items-center gap-1.5 text-sm"
          >
            <Icons.User className="w-4 h-4 text-accent-1" />
            Second Challenger
          </label>
          <div className="relative">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3">
              <Icons.User className="w-4 h-4" />
            </div>
            <input
              id="user2"
              type="text"
              value={user2}
              onChange={e => setUser2(e.target.value)}
              placeholder="Enter GitHub username"
              className="w-full pl-8 pr-10 py-2.5 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none transition-all duration-200"
              disabled={isLoading}
              required
            />
            {user2 && (
              <button
                type="button"
                onClick={() => handleClearUser('user2')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger cursor-pointer transition-colors duration-200"
                aria-label="Clear second username"
              >
                <Icons.Close className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Recent users for user2 */}
          <RecentGithubUsers
            onSelectUser={handleQuickFill}
            field="user2"
            className="mt-2"
            recentUsersRef={recentUsersRef2}
          />
        </div>
      </div>

      <div className="mt-4">
        {/* Token section */}
        <GitHubTokenSection
          token={token}
          onTokenChange={handleTokenChange}
          onTokenClear={handleTokenClear}
          isLoading={isLoading}
          isTokenLoading={isTokenLoading}
          showTokenSaved={showTokenSaved}
          className="mb-4"
        />

        <button
          type="submit"
          disabled={
            isLoading ||
            !user1.trim() ||
            !user2.trim() ||
            (!hasChanges && currentComparison.user1 !== '')
          }
          className="w-full px-4 py-2.5 rounded-lg bg-accent-1 hover:bg-accent-2 disabled:opacity-50 text-l-text-inv dark:text-d-text-inv transition-all duration-200 cursor-pointer font-medium flex items-center justify-center gap-1.5 text-sm"
        >
          {isLoading ? (
            <>
              <Icons.Loader className="w-4 h-4 animate-spin" />
              <span>Comparing...</span>
            </>
          ) : (
            <>
              <Icons.Swords className="w-4 h-4" />
              <span>Compare Users</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
