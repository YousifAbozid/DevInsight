import { useState, useEffect, useRef } from 'react';
import {
  User,
  Swords,
  X,
  Key,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';

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
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [recentUsers, setRecentUsers] = useState<string[]>([]);
  const [showTokenSaved, setShowTokenSaved] = useState(false);
  const tokenTimeoutRef = useRef<number | null>(null);

  // Track current comparison state to detect changes
  const [currentComparison, setCurrentComparison] = useState({
    user1: '',
    user2: '',
    token: initialToken || '',
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
          setRecentUsers(parsedUsers.slice(0, 5)); // Limit to 5 recent users
        }
      } catch (e) {
        console.error('Error parsing recent users:', e);
      }
    }

    // Set token from localStorage if available
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Debounced token saving with auto-comparison
  useEffect(() => {
    // Clear any existing timeout
    if (tokenTimeoutRef.current) {
      clearTimeout(tokenTimeoutRef.current);
    }

    const storedToken = localStorage.getItem('github_token') || '';

    // Handle both token changes and token clearing
    if (token !== storedToken) {
      tokenTimeoutRef.current = window.setTimeout(() => {
        // Update localStorage (set or remove token)
        if (token.trim()) {
          localStorage.setItem('github_token', token.trim());
        } else {
          localStorage.removeItem('github_token');
        }

        // Show saved feedback
        setShowTokenSaved(true);
        setTimeout(() => setShowTokenSaved(false), 3000);

        // Auto-trigger comparison if both usernames are filled
        if (user1.trim() && user2.trim()) {
          onCompare(user1.trim(), user2.trim(), token.trim() || undefined);
          // Update current comparison state after comparison is triggered
          setCurrentComparison({
            user1: user1.trim(),
            user2: user2.trim(),
            token: token.trim(),
          });
        }
      }, 1000); // 1 second debounce
    }

    return () => {
      if (tokenTimeoutRef.current) {
        clearTimeout(tokenTimeoutRef.current);
      }
    };
  }, [token, user1, user2, onCompare]);

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

      // Update current comparison state
      setCurrentComparison({
        user1: user1.trim(),
        user2: user2.trim(),
        token: token.trim() || '',
      });
    }
  };

  const handleQuickFill = (username: string, field: 'user1' | 'user2') => {
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

  const handleTokenClear = () => {
    // Instead of directly calling onCompare here, we'll rely on the effect above
    localStorage.removeItem('github_token');
    setToken('');
    setShowTokenSaved(true);
    setTimeout(() => setShowTokenSaved(false), 3000);

    // Immediately update current comparison state to reflect token clearing
    // This helps properly calculate hasChanges
    if (user1.trim() && user2.trim()) {
      // Force immediate compare instead of waiting for the effect
      onCompare(user1.trim(), user2.trim(), undefined);
      setCurrentComparison({
        user1: user1.trim(),
        user2: user2.trim(),
        token: '',
      });
    }
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
            <User size={16} className="text-accent-1" />
            First Challenger
          </label>
          <div className="relative">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3">
              <User size={16} />
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
                <X size={14} />
              </button>
            )}
          </div>

          {recentUsers.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-1.5 mb-1 text-xs text-l-text-2 dark:text-d-text-2">
                <Clock size={14} />
                <span>Recent users:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentUsers.map(username => (
                  <div key={`user1-${username}`} className="relative group">
                    <button
                      type="button"
                      onClick={() => handleQuickFill(username, 'user1')}
                      className="pl-2.5 pr-7 py-1 text-xs rounded-full bg-l-bg-2 dark:bg-d-bg-2 hover:bg-accent-1/10 hover:text-accent-1 dark:hover:bg-accent-1/10 dark:hover:text-accent-1 text-l-text-2 dark:text-d-text-2 border border-border-l/50 dark:border-border-d/50 transition-all duration-200 cursor-pointer"
                    >
                      {username}
                    </button>
                    <button
                      type="button"
                      onClick={e => handleRemoveRecentUser(username, e)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger rounded-full p-0.5 cursor-pointer opacity-40 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                      aria-label={`Remove ${username} from recent searches`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="user2"
            className="text-l-text-1 dark:text-d-text-1 font-medium mb-1.5 flex items-center gap-1.5 text-sm"
          >
            <User size={16} className="text-accent-1" />
            Second Challenger
          </label>
          <div className="relative">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3">
              <User size={16} />
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
                <X size={14} />
              </button>
            )}
          </div>

          {recentUsers.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-1.5 mb-1 text-xs text-l-text-2 dark:text-d-text-2">
                <Clock size={14} />
                <span>Recent users:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentUsers.map(username => (
                  <div key={`user2-${username}`} className="relative group">
                    <button
                      type="button"
                      onClick={() => handleQuickFill(username, 'user2')}
                      className="pl-2.5 pr-7 py-1 text-xs rounded-full bg-l-bg-2 dark:bg-d-bg-2 hover:bg-accent-1/10 hover:text-accent-1 dark:hover:bg-accent-1/10 dark:hover:text-accent-1 text-l-text-2 dark:text-d-text-2 border border-border-l/50 dark:border-border-d/50 transition-all duration-200 cursor-pointer"
                    >
                      {username}
                    </button>
                    <button
                      type="button"
                      onClick={e => handleRemoveRecentUser(username, e)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger rounded-full p-0.5 cursor-pointer opacity-40 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                      aria-label={`Remove ${username} from recent searches`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowTokenInput(!showTokenInput)}
          className="flex items-center gap-1.5 text-accent-1 hover:text-accent-2 transition-colors mb-2 cursor-pointer text-sm"
        >
          <Key size={16} />
          <div>
            <span className="font-medium">
              {showTokenInput ? 'Hide token input' : 'GitHub Access Token'}
            </span>
            <span className="text-xs ml-1.5 text-l-text-3 dark:text-d-text-3">
              (required for contribution data)
            </span>
          </div>
          {token && !showTokenInput && !showTokenSaved && (
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-accent-success/10 text-accent-success flex items-center gap-1">
              <CheckCircle size={12} />
              <span>Token active</span>
            </span>
          )}
          {showTokenSaved && (
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-accent-success/10 text-accent-success flex items-center gap-1 animate-pulse">
              <CheckCircle size={12} />
              <span>{token ? 'Token saved!' : 'Token cleared!'}</span>
            </span>
          )}
        </button>

        {showTokenInput && (
          <div className="bg-l-bg-3 dark:bg-d-bg-3 p-3 rounded-lg border border-border-l dark:border-border-d mb-4 animate-fade-in-down">
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
              </p>
            </div>
          </div>
        )}

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
              <Loader size={16} className="animate-spin" />
              <span>Comparing...</span>
            </>
          ) : (
            <>
              <Swords size={16} />
              <span>Compare Users</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
