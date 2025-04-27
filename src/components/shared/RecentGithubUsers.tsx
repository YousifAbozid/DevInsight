import { useState, useEffect } from 'react';
import { useRecentGithubUsers } from '../../hooks/useStorage';
import { Icons } from './Icons';

interface RecentGithubUsersProps {
  // Callback when a user is selected
  onSelectUser: (username: string, field?: string) => void;

  // Optional field identifier (for compare form with multiple fields)
  field?: string;

  // Optional className for container styling
  className?: string;

  // Optional max number of users to display
  maxUsers?: number;

  // Reference to access functions
  recentUsersRef?: React.MutableRefObject<{
    addUser: (username: string) => void;
    removeUser: (username: string) => void;
    clearUsers: () => void;
    getUsers: () => string[];
  } | null>;
}

export default function RecentGithubUsers({
  onSelectUser,
  field,
  className = '',
  maxUsers = 5,
  recentUsersRef,
}: RecentGithubUsersProps) {
  // Use the recentGithubUsers hook
  const [recentUsers, addUser, removeUser, clearUsers] =
    useRecentGithubUsers(maxUsers);

  // State to force re-render when localStorage changes
  const [localStorageUsers, setLocalStorageUsers] =
    useState<string[]>(recentUsers);

  // Listen for changes to localStorage, including from other components
  useEffect(() => {
    // Function to check localStorage and update state if needed
    const checkLocalStorage = () => {
      try {
        const storedData = localStorage.getItem('recent_github_users');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (Array.isArray(parsedData)) {
            setLocalStorageUsers(parsedData);
          }
        } else if (localStorageUsers.length > 0) {
          // If localStorage is empty but we have users in state, clear state
          setLocalStorageUsers([]);
        }
      } catch (error) {
        console.error(
          'Error reading recent GitHub users from localStorage:',
          error
        );
      }
    };

    // Check localStorage initially
    checkLocalStorage();

    // Listen for storage events (changes from other tabs)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'recent_github_users') {
        checkLocalStorage();
      }
    };

    // Listen for custom events from WelcomeScreen
    const handleCustomEvent = () => {
      checkLocalStorage();
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', checkLocalStorage);
    window.addEventListener(
      'recent_users_added',
      handleCustomEvent as EventListener
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkLocalStorage);
      window.removeEventListener(
        'recent_users_added',
        handleCustomEvent as EventListener
      );
    };
  }, []);

  // Update localStorageUsers when recentUsers changes (from the hook)
  useEffect(() => {
    // This ensures we sync with the hook's state
    setLocalStorageUsers(recentUsers);
  }, [recentUsers]);

  // Expose functions via ref to parent component
  useEffect(() => {
    if (recentUsersRef) {
      recentUsersRef.current = {
        addUser: (username: string) => {
          addUser(username);
          // Force immediate check of localStorage after adding a user
          const storedData = localStorage.getItem('recent_github_users');
          if (storedData) {
            try {
              const parsedData = JSON.parse(storedData);
              if (Array.isArray(parsedData)) {
                setLocalStorageUsers(parsedData);
              }
            } catch (error) {
              console.error('Error parsing recent users:', error);
            }
          }
        },
        removeUser: (username: string) => {
          removeUser(username);
        },
        clearUsers: () => {
          clearUsers();
          setLocalStorageUsers([]);
        },
        getUsers: () => localStorageUsers,
      };
    }
  }, [addUser, removeUser, clearUsers, recentUsersRef]);

  // Skip rendering if there are no recent users
  if (localStorageUsers.length === 0) {
    return null;
  }

  // Handle removing a user
  const handleRemoveUser = (username: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent button
    removeUser(username);
  };

  return (
    <div
      className={`bg-l-bg-3/50 dark:bg-d-bg-3/50 p-2.5 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-2 mb-1.5 text-xs text-l-text-2 dark:text-d-text-2">
        <Icons.Clock className="w-3.5 h-3.5" />
        <span>Recent searches:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {localStorageUsers.map(username => (
          <div
            key={`${field || 'default'}-${username}`}
            className="relative group"
          >
            <button
              type="button"
              onClick={() => onSelectUser(username, field)}
              className="pl-2.5 pr-7 py-1 text-xs rounded-full bg-l-bg-2 dark:bg-d-bg-2 hover:bg-accent-1/10 hover:text-accent-1 dark:hover:bg-accent-1/10 dark:hover:text-accent-1 text-l-text-2 dark:text-d-text-2 border border-border-l/50 dark:border-border-d/50 transition-all duration-200 cursor-pointer"
            >
              {username}
            </button>
            <button
              type="button"
              onClick={e => handleRemoveUser(username, e)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-l-text-3 dark:text-d-text-3 hover:text-accent-danger rounded-full p-0.5 cursor-pointer opacity-40 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
              aria-label={`Remove ${username} from recent searches`}
            >
              <Icons.Close className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={clearUsers}
          className="px-2.5 py-1 text-xs rounded-full bg-accent-danger/10 text-accent-danger hover:bg-accent-danger/20 transition-colors duration-200 cursor-pointer"
        >
          Clear history
        </button>
      </div>
    </div>
  );
}
