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
      className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="user1"
            className="text-l-text-1 dark:text-d-text-1 font-medium mb-2 flex items-center gap-2"
          >
            <User size={18} className="text-accent-1" />
            First Challenger
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3">
              <User size={18} />
            </div>
            <input
              id="user1"
              type="text"
              value={user1}
              onChange={e => setUser1(e.target.value)}
              placeholder="Enter GitHub username"
              className="w-full pl-10 pr-12 py-3 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none"
              disabled={isLoading}
              required
            />
            {user1 && (
              <button
                type="button"
                onClick={() => handleClearUser('user1')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger cursor-pointer"
                aria-label="Clear first username"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {recentUsers.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1 text-sm text-l-text-2 dark:text-d-text-2">
                <Clock size={14} />
                <span className="text-xs">Recent users:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentUsers.map(username => (
                  <div key={`user1-${username}`} className="relative group">
                    <button
                      type="button"
                      onClick={() => handleQuickFill(username, 'user1')}
                      className="pl-3 pr-8 py-1.5 text-xs rounded-full bg-l-bg-2 dark:bg-d-bg-2 hover:bg-accent-1/10 hover:text-accent-1 dark:hover:bg-accent-1/10 dark:hover:text-accent-1 text-l-text-2 dark:text-d-text-2 border border-border-l/50 dark:border-border-d/50 transition-colors cursor-pointer"
                    >
                      {username}
                    </button>
                    <button
                      type="button"
                      onClick={e => handleRemoveRecentUser(username, e)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger rounded-full p-0.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
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
            className="text-l-text-1 dark:text-d-text-1 font-medium mb-2 flex items-center gap-2"
          >
            <User size={18} className="text-accent-1" />
            Second Challenger
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3">
              <User size={18} />
            </div>
            <input
              id="user2"
              type="text"
              value={user2}
              onChange={e => setUser2(e.target.value)}
              placeholder="Enter GitHub username"
              className="w-full pl-10 pr-12 py-3 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none"
              disabled={isLoading}
              required
            />
            {user2 && (
              <button
                type="button"
                onClick={() => handleClearUser('user2')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger cursor-pointer"
                aria-label="Clear second username"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {recentUsers.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1 text-sm text-l-text-2 dark:text-d-text-2">
                <Clock size={14} />
                <span className="text-xs">Recent users:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentUsers.map(username => (
                  <div key={`user2-${username}`} className="relative group">
                    <button
                      type="button"
                      onClick={() => handleQuickFill(username, 'user2')}
                      className="pl-3 pr-8 py-1.5 text-xs rounded-full bg-l-bg-2 dark:bg-d-bg-2 hover:bg-accent-1/10 hover:text-accent-1 dark:hover:bg-accent-1/10 dark:hover:text-accent-1 text-l-text-2 dark:text-d-text-2 border border-border-l/50 dark:border-border-d/50 transition-colors cursor-pointer"
                    >
                      {username}
                    </button>
                    <button
                      type="button"
                      onClick={e => handleRemoveRecentUser(username, e)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger rounded-full p-0.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
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

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowTokenInput(!showTokenInput)}
          className="flex items-center gap-2 text-accent-1 hover:text-accent-2 transition-colors mb-2 cursor-pointer"
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
          <div className="bg-l-bg-3 dark:bg-d-bg-3 p-4 rounded-lg border border-border-l dark:border-border-d mb-4">
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
          className="w-full px-6 py-3 rounded-lg bg-accent-1 hover:bg-accent-2 disabled:opacity-50 text-l-text-inv dark:text-d-text-inv transition-colors cursor-pointer font-medium flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              <span>Comparing...</span>
            </>
          ) : (
            <>
              <Swords size={18} />
              <span>Compare Users</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
