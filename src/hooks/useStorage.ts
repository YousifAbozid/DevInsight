import { useState, useEffect, useCallback, useRef } from 'react';

// Get encryption secret from environment variables
// Falls back to a default value if the env var is not available (development only)
const ENCRYPTION_SECRET =
  import.meta.env.VITE_ENCRYPTION_SECRET ||
  'dev-fallback-key-not-for-production';

/**
 * Hook for storing and retrieving data from localStorage (plain text)
 * @param key - Storage key
 * @param initialValue - Default value if none exists
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = localStorage.getItem(key);

      // Parse stored json or if none return initialValue
      // Handle null, undefined, or invalid JSON properly
      if (item === null || item === 'undefined' || item === undefined) {
        return initialValue;
      }

      try {
        return JSON.parse(item);
      } catch {
        // If JSON parsing fails, return the initialValue
        console.error(
          `Error parsing JSON for key "${key}". Returning initial value.`
        );
        return initialValue;
      }
    } catch (error) {
      // If error accessing localStorage, return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        // Save state
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Function to remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      // Remove from local storage
      window.localStorage.removeItem(key);
      // Reset state to initial value
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this localStorage key in other windows/tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          // If the key changed in another window, update state
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            `Error parsing localStorage key "${key}" from storage event:`,
            error
          );
        }
      } else if (e.key === key && e.newValue === null) {
        // If the key was removed in another window, reset state
        setStoredValue(initialValue);
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Remove event listener on cleanup
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for storing and retrieving encrypted data from localStorage
 * Uses Web Crypto API for strong encryption
 * @param key - Storage key
 * @param initialValue - Default value if none exists
 * @returns [storedValue, setValue, removeValue, isLoading, error]
 */
export function useSecureStorage(
  key: string,
  initialValue: string = ''
): [
  string,
  (value: string) => Promise<void>,
  () => void,
  boolean,
  Error | null,
] {
  const [storedValue, setStoredValue] = useState<string>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to encrypt data using Web Crypto API
  const encryptData = useCallback(async (text: string): Promise<string> => {
    try {
      // Convert encryption key to bytes
      const encoder = new TextEncoder();
      const secretKeyData = encoder.encode(ENCRYPTION_SECRET);

      // Generate random salt and IV
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // Import the secret as a raw key
      const importedKey = await window.crypto.subtle.importKey(
        'raw',
        secretKeyData,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      // Derive an AES-GCM key from the imported key
      const derivedKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        importedKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      // Encrypt the data
      const dataToEncrypt = encoder.encode(text);
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        derivedKey,
        dataToEncrypt
      );

      // Combine salt, IV, and encrypted data
      const result = new Uint8Array(
        salt.length + iv.length + encryptedData.byteLength
      );
      result.set(salt, 0);
      result.set(iv, salt.length);
      result.set(new Uint8Array(encryptedData), salt.length + iv.length);

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...result));
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }, []);

  // Function to decrypt data using Web Crypto API
  const decryptData = useCallback(
    async (encryptedText: string): Promise<string> => {
      try {
        // Convert base64 back to array buffer
        const encryptedBuffer = Uint8Array.from(atob(encryptedText), c =>
          c.charCodeAt(0)
        );

        // Extract salt, IV, and encrypted data
        const salt = encryptedBuffer.slice(0, 16);
        const iv = encryptedBuffer.slice(16, 28);
        const encryptedData = encryptedBuffer.slice(28);

        // Convert encryption key to bytes
        const encoder = new TextEncoder();
        const secretKeyData = encoder.encode(ENCRYPTION_SECRET);

        // Import the secret as a raw key
        const importedKey = await window.crypto.subtle.importKey(
          'raw',
          secretKeyData,
          { name: 'PBKDF2' },
          false,
          ['deriveKey']
        );

        // Derive the key using the extracted salt
        const derivedKey = await window.crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256',
          },
          importedKey,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );

        // Decrypt the data
        const decryptedData = await window.crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          derivedKey,
          encryptedData
        );

        // Convert decrypted data to string
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
      } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
      }
    },
    []
  );

  // Load initial value from localStorage
  useEffect(() => {
    async function loadEncryptedValue() {
      setIsLoading(true);
      setError(null);

      try {
        const encryptedValue = window.localStorage.getItem(key);

        if (encryptedValue) {
          const decryptedValue = await decryptData(encryptedValue);
          setStoredValue(decryptedValue);
        } else {
          setStoredValue(initialValue);
        }
      } catch (error) {
        console.error(
          `Error reading encrypted localStorage key "${key}":`,
          error
        );
        setError(error instanceof Error ? error : new Error(String(error)));
        setStoredValue(initialValue);
      } finally {
        setIsLoading(false);
      }
    }

    loadEncryptedValue();
  }, [key, initialValue, decryptData]);

  // Function to save encrypted value to localStorage
  const setValue = useCallback(
    async (value: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // Update state
        setStoredValue(value);

        // Encrypt and save to localStorage
        const encryptedValue = await encryptData(value);
        window.localStorage.setItem(key, encryptedValue);
      } catch (error) {
        console.error(
          `Error setting encrypted localStorage key "${key}":`,
          error
        );
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoading(false);
      }
    },
    [key, encryptData]
  );

  // Function to remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(
        `Error removing encrypted localStorage key "${key}":`,
        error
      );
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, isLoading, error];
}

// Simple example hooks for common use cases

/**
 * Hook for managing GitHub token with encryption and debouncing
 */
export function useGithubToken(): [
  string,
  (token: string) => Promise<void>,
  () => void,
  boolean,
  Error | null,
] {
  const [value, baseSetValue, removeValue, isLoading, error] = useSecureStorage(
    'github_token',
    ''
  );

  // Keep track of the last update time to prevent rapid changes
  const lastUpdateRef = useRef<number>(0);

  // Debounced setter that prevents updates happening too rapidly
  const setValue = useCallback(
    async (newToken: string) => {
      try {
        // If the new token is the same as the current one, do nothing
        if (newToken === value) {
          return;
        }

        // Throttle updates to prevent rapid changes
        // Only allow updates once every 500ms
        const now = Date.now();
        if (now - lastUpdateRef.current < 500) {
          console.warn('Token update throttled - too soon after last update');
          return;
        }

        lastUpdateRef.current = now;
        await baseSetValue(newToken);
      } catch (error) {
        console.error('Error updating GitHub token:', error);
        throw error;
      }
    },
    [value, baseSetValue]
  );

  return [value, setValue, removeValue, isLoading, error];
}

/**
 * Hook for managing user preferences
 */
export function useUserPreferences<T extends object>(
  defaultPrefs: T
): [T, (prefs: T) => void, () => void] {
  return useLocalStorage<T>('user_preferences', defaultPrefs);
}

/**
 * Hook specifically for managing GitHub username search history
 * Provides full CRUD operations for recent searches
 * @param maxUsers - Maximum number of usernames to store (default: 5)
 * @returns [users, addUser, removeUser, clearUsers] - Array of usernames and operations
 */
export function useRecentGithubUsers(
  maxUsers: number = 5
): [
  string[],
  (username: string) => void,
  (username: string) => void,
  () => void,
] {
  // Ensure we initialize with an empty array to prevent JSON parsing errors
  const [users, setUsers, clearUsers] = useLocalStorage<string[]>(
    'recent_github_users',
    []
  );

  // Add username to the front of the list, remove duplicates, and limit length
  const addUser = useCallback(
    (username: string) => {
      if (!username || !username.trim()) return;

      const trimmedUsername = username.trim();
      setUsers((prevUsers: string[]) => {
        // Handle the case where prevUsers might be null or undefined
        const safeUsers: string[] = Array.isArray(prevUsers) ? prevUsers : [];

        // Remove the username if it already exists (to move it to the front)
        const filteredUsers: string[] = safeUsers.filter(
          u => u !== trimmedUsername
        );

        // Add the username to the front and limit the list length
        const newUsers = [trimmedUsername, ...filteredUsers].slice(0, maxUsers);

        // Dispatch both a storage event for other tabs and a custom event for same tab
        try {
          // Custom event for same tab communication
          window.dispatchEvent(
            new CustomEvent('recent_users_updated', {
              detail: {
                users: newUsers,
                action: 'add',
                username: trimmedUsername,
              },
            })
          );

          // Create a synthetic storage event for same-tab communication
          // This helps components that only listen to storage events
          const event = document.createEvent('StorageEvent');
          event.initStorageEvent(
            'storage',
            false,
            false,
            'recent_github_users',
            null,
            JSON.stringify(newUsers),
            window.location.href,
            null
          );
          window.dispatchEvent(event);
        } catch (err) {
          console.error('Error dispatching events:', err);
        }

        return newUsers;
      });
    },
    [setUsers, maxUsers]
  );

  // Remove a specific username from the list
  const removeUser = useCallback(
    (username: string) => {
      if (!username) return;

      setUsers(prevUsers => {
        // Handle the case where prevUsers might be null or undefined
        const safeUsers = Array.isArray(prevUsers) ? prevUsers : [];
        const newUsers = safeUsers.filter(user => user !== username);

        // Dispatch events
        try {
          // Custom event for same tab components
          window.dispatchEvent(
            new CustomEvent('recent_users_updated', {
              detail: { users: newUsers, action: 'remove', username },
            })
          );

          // Create a synthetic storage event
          const event = document.createEvent('StorageEvent');
          event.initStorageEvent(
            'storage',
            false,
            false,
            'recent_github_users',
            null,
            JSON.stringify(newUsers),
            window.location.href,
            null
          );
          window.dispatchEvent(event);
        } catch (err) {
          console.error('Error dispatching events:', err);
        }

        return newUsers;
      });
    },
    [setUsers]
  );

  // Enhance the clearUsers function to trigger events
  const enhancedClearUsers = useCallback(() => {
    clearUsers();

    // Dispatch events
    try {
      // Custom event for same tab communication
      window.dispatchEvent(
        new CustomEvent('recent_users_updated', {
          detail: { users: [], action: 'clear' },
        })
      );

      // Create a synthetic storage event
      const event = document.createEvent('StorageEvent');
      event.initStorageEvent(
        'storage',
        false,
        false,
        'recent_github_users',
        null,
        JSON.stringify([]),
        window.location.href,
        null
      );
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Error dispatching events:', err);
    }
  }, [clearUsers]);

  // Listen for updates from other components in the same tab
  useEffect(() => {
    const handleRecentUsersUpdate = (event: Event) => {
      try {
        const customEvent = event as CustomEvent;
        const newUsers = customEvent.detail?.users;

        if (
          Array.isArray(newUsers) &&
          JSON.stringify(newUsers) !== JSON.stringify(users)
        ) {
          setUsers(newUsers);
        }
      } catch (error) {
        console.error('Error handling recent_users_updated event:', error);
      }
    };

    // Add event listener for our custom event
    window.addEventListener('recent_users_updated', handleRecentUsersUpdate);

    return () => {
      window.removeEventListener(
        'recent_users_updated',
        handleRecentUsersUpdate
      );
    };
  }, [setUsers, users]);

  // Re-read localStorage directly for backup synchronization
  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        const storedData = localStorage.getItem('recent_github_users');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (
            Array.isArray(parsedData) &&
            JSON.stringify(parsedData) !== JSON.stringify(users)
          ) {
            setUsers(parsedData);
          }
        }
      } catch (error) {
        console.error('Error checking localStorage:', error);
      }
    };

    // Run once on mount and set up interval
    checkLocalStorage();

    // Also check when window gets focus
    const handleFocus = () => checkLocalStorage();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [setUsers, users]);

  return [users, addUser, removeUser, enhancedClearUsers];
}
