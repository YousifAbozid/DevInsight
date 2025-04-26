import { useState } from 'react';
import {
  useLocalStorage,
  useSecureStorage,
  useGithubToken,
  useUserPreferences,
  useRecentItems,
} from '../hooks/useStorage';

export default function StorageHooksDemo() {
  // Demo for simple localStorage hook
  const [simpleValue, setSimpleValue, clearSimpleValue] =
    useLocalStorage<string>('demo_simple', 'Hello World!');
  const [newSimpleValue, setNewSimpleValue] = useState(simpleValue);

  // Demo for object storage
  const [userObject, setUserObject, clearUserObject] = useLocalStorage<{
    name: string;
    age: number;
    active: boolean;
  }>('demo_user', { name: 'John Doe', age: 28, active: true });
  const [userName, setUserName] = useState(userObject.name);
  const [userAge, setUserAge] = useState(userObject.age);
  const [userActive, setUserActive] = useState(userObject.active);

  // Demo for secure storage
  const [
    secureValue,
    setSecureValue,
    clearSecureValue,
    isSecureLoading,
    secureError,
  ] = useSecureStorage('demo_secure', 'Secret Message');
  const [newSecureValue, setNewSecureValue] = useState(secureValue);

  // Demo for GitHub token
  const [token, setToken, clearToken, isTokenLoading, tokenError] =
    useGithubToken();
  const [newToken, setNewToken] = useState(token);

  // User preferences demo
  const [preferences, setPreferences, clearPreferences] = useUserPreferences({
    theme: 'light',
    fontSize: 16,
    notifications: true,
  });

  // Recent items demo
  const [recentItems, addRecentItem, clearRecentItems] =
    useRecentItems<string>(5);
  const [newRecentItem, setNewRecentItem] = useState('');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-l-text-1 dark:text-d-text-1">
        Storage Hooks Demo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Simple Storage Demo */}
        <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
            Plain Text Storage
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
              Current Value
            </label>
            <div className="px-3 py-2 bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-md mb-4">
              {simpleValue}
            </div>

            <input
              type="text"
              value={newSimpleValue}
              onChange={e => setNewSimpleValue(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d mb-3"
              placeholder="Enter new value"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setSimpleValue(newSimpleValue)}
                className="px-3 py-2 bg-accent-1 text-white rounded-md text-sm hover:bg-accent-2 transition-colors"
              >
                Save Value
              </button>
              <button
                onClick={clearSimpleValue}
                className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors"
              >
                Clear Value
              </button>
            </div>
          </div>

          <p className="text-xs text-l-text-3 dark:text-d-text-3 mt-2">
            Data is stored as plain text in localStorage.
          </p>
        </div>

        {/* Object Storage Demo */}
        <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
            Object Storage
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
              Current Object
            </label>
            <div className="px-3 py-2 bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-md mb-4 break-all">
              <pre className="text-xs">
                {JSON.stringify(userObject, null, 2)}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={userAge}
                  onChange={e => setUserAge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="flex items-center text-sm text-l-text-2 dark:text-d-text-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userActive}
                  onChange={e => setUserActive(e.target.checked)}
                  className="mr-2"
                />
                Active User
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() =>
                  setUserObject({
                    name: userName,
                    age: userAge,
                    active: userActive,
                  })
                }
                className="px-3 py-2 bg-accent-1 text-white rounded-md text-sm hover:bg-accent-2 transition-colors"
              >
                Save Object
              </button>
              <button
                onClick={clearUserObject}
                className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors"
              >
                Clear Object
              </button>
            </div>
          </div>

          <p className="text-xs text-l-text-3 dark:text-d-text-3 mt-2">
            Objects are automatically JSON-stringified when saved and parsed
            when retrieved.
          </p>
        </div>

        {/* Secure Storage Demo */}
        <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
            Secure Storage (Encrypted)
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
              Current Secure Value
            </label>
            <div className="px-3 py-2 bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-md mb-4 flex items-center min-h-[40px]">
              {isSecureLoading ? (
                <span className="text-l-text-3 dark:text-d-text-3">
                  Loading...
                </span>
              ) : secureError ? (
                <span className="text-accent-danger">
                  {secureError.message}
                </span>
              ) : (
                <span>{secureValue}</span>
              )}
            </div>

            <input
              type="text"
              value={newSecureValue}
              onChange={e => setNewSecureValue(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d mb-3"
              placeholder="Enter sensitive data"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setSecureValue(newSecureValue)}
                disabled={isSecureLoading}
                className="px-3 py-2 bg-accent-1 text-white rounded-md text-sm hover:bg-accent-2 transition-colors disabled:opacity-50"
              >
                {isSecureLoading ? 'Saving...' : 'Save Securely'}
              </button>
              <button
                onClick={clearSecureValue}
                disabled={isSecureLoading}
                className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors disabled:opacity-50"
              >
                Clear Value
              </button>
            </div>
          </div>

          <p className="text-xs text-l-text-3 dark:text-d-text-3 mt-2">
            Data is encrypted with AES-GCM using the Web Crypto API before
            storage.
          </p>
        </div>

        {/* GitHub Token Demo */}
        <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
            GitHub Token Storage
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
              Current Token
            </label>
            <div className="px-3 py-2 bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-md mb-4 flex items-center min-h-[40px]">
              {isTokenLoading ? (
                <span className="text-l-text-3 dark:text-d-text-3">
                  Loading...
                </span>
              ) : tokenError ? (
                <span className="text-accent-danger">{tokenError.message}</span>
              ) : token ? (
                <span>
                  {token.substring(0, 4)}...{token.substring(token.length - 4)}
                </span>
              ) : (
                <span className="text-l-text-3 dark:text-d-text-3">
                  No token set
                </span>
              )}
            </div>

            <input
              type="password"
              value={newToken}
              onChange={e => setNewToken(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d mb-3"
              placeholder="Enter GitHub token"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setToken(newToken)}
                disabled={isTokenLoading}
                className="px-3 py-2 bg-accent-1 text-white rounded-md text-sm hover:bg-accent-2 transition-colors disabled:opacity-50"
              >
                {isTokenLoading ? 'Saving...' : 'Save Token'}
              </button>
              <button
                onClick={clearToken}
                disabled={isTokenLoading}
                className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors disabled:opacity-50"
              >
                Clear Token
              </button>
            </div>
          </div>

          <p className="text-xs text-l-text-3 dark:text-d-text-3 mt-2">
            Special-purpose hook for storing GitHub tokens securely.
          </p>
        </div>

        {/* User Preferences Demo */}
        <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
            User Preferences
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
              Current Preferences
            </label>
            <div className="px-3 py-2 bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-md mb-4 break-all">
              <pre className="text-xs">
                {JSON.stringify(preferences, null, 2)}
              </pre>
            </div>

            <div className="space-y-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                  Theme
                </label>
                <select
                  value={preferences.theme}
                  onChange={e =>
                    setPreferences({ ...preferences, theme: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                  Font Size
                </label>
                <input
                  type="number"
                  value={preferences.fontSize}
                  onChange={e =>
                    setPreferences({
                      ...preferences,
                      fontSize: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
                  min="12"
                  max="24"
                  step="1"
                />
              </div>

              <div>
                <label className="flex items-center text-sm text-l-text-2 dark:text-d-text-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={e =>
                      setPreferences({
                        ...preferences,
                        notifications: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  Enable Notifications
                </label>
              </div>
            </div>

            <button
              onClick={clearPreferences}
              className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors"
            >
              Reset to Default
            </button>
          </div>

          <p className="text-xs text-l-text-3 dark:text-d-text-3 mt-2">
            Specialized hook for managing user preferences with defaults.
          </p>
        </div>

        {/* Recent Items Demo */}
        <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
            Recent Items List
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
              Recently Added Items
            </label>

            <div className="px-3 py-2 bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-md mb-4 min-h-[80px]">
              {recentItems.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {recentItems.map((item, index) => (
                    <li key={index} className="mb-1">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-l-text-3 dark:text-d-text-3 text-sm">
                  No items added yet
                </span>
              )}
            </div>

            <div className="flex space-x-3 mb-3">
              <input
                type="text"
                value={newRecentItem}
                onChange={e => setNewRecentItem(e.target.value)}
                className="flex-grow px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
                placeholder="Add new item"
              />

              <button
                onClick={() => {
                  if (newRecentItem.trim()) {
                    addRecentItem(newRecentItem.trim());
                    setNewRecentItem('');
                  }
                }}
                disabled={!newRecentItem.trim()}
                className="px-3 py-2 bg-accent-1 text-white rounded-md text-sm hover:bg-accent-2 transition-colors disabled:opacity-50"
              >
                Add Item
              </button>
            </div>

            {recentItems.length > 0 && (
              <button
                onClick={clearRecentItems}
                className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors"
              >
                Clear All Items
              </button>
            )}
          </div>

          <p className="text-xs text-l-text-3 dark:text-d-text-3 mt-2">
            Maintains an ordered list of recently used items, removing
            duplicates and limiting the list size.
          </p>
        </div>
      </div>

      <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d mb-10">
        <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
          Usage Examples
        </h2>

        <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-md mb-4 overflow-auto">
          <pre className="text-sm text-l-text-2 dark:text-d-text-2">
            {`// Basic localStorage usage (strings, numbers, objects)
const [value, setValue, removeValue] = useLocalStorage('key', 'default');

// Set a new value
setValue('new value');

// Remove the value
removeValue();

// Secure storage for sensitive data
const [token, setToken, removeToken, isLoading, error] = useSecureStorage('api_key', '');

// Save securely (returns a promise)
await setToken('sensitive_data_123');

// GitHub token specific hook
const [githubToken, setGithubToken, clearGithubToken, isLoading, error] = useGithubToken();

// User preferences with default values
const [prefs, setPrefs, clearPrefs] = useUserPreferences({
  theme: 'light',
  fontSize: 16,
  notifications: true
});

// Update preferences
setPrefs({...prefs, theme: 'dark'});

// Recent items list with automatic deduplication
const [recentItems, addItem, clearItems] = useRecentItems<string>(5);

// Add a new item to the front (duplicates are removed)
addItem('New Item');`}
          </pre>
        </div>
      </div>
    </div>
  );
}
