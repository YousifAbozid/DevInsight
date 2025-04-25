import { useState, useEffect } from 'react';
import {
  storage,
  objectStorage,
  secureStorage,
  tokenStorage,
  enhancedSecureStorage,
  enhancedTokenStorage,
} from '../utils/storageUtils';

/**
 * Demo component to show usage of storage utilities
 */
export default function StorageUtilsDemo() {
  // Basic Storage Demo
  const [basicKey, setBasicKey] = useState('demo_key');
  const [basicValue, setBasicValue] = useState('Hello DevInsight!');
  const [retrievedBasicValue, setRetrievedBasicValue] = useState<string | null>(
    null
  );

  // Object Storage Demo
  const [objectKey, setObjectKey] = useState('demo_object');
  const [objectName, setObjectName] = useState('User1');
  const [objectAge, setObjectAge] = useState(25);
  const [objectActive, setObjectActive] = useState(true);
  const [retrievedObject, setRetrievedObject] = useState<{
    name: string;
    age: number;
    active: boolean;
  } | null>(null);

  // Secure Storage Demo
  const [secureKey, setSecureKey] = useState('demo_secure');
  const [secureValue, setSecureValue] = useState('sensitive_data_123');
  const [retrievedSecureValue, setRetrievedSecureValue] = useState<
    string | null
  >(null);

  // Enhanced Secure Storage Demo
  const [enhancedSecureKey, setEnhancedSecureKey] = useState(
    'demo_enhanced_secure'
  );
  const [enhancedSecureValue, setEnhancedSecureValue] = useState(
    'top_secret_data_456'
  );
  const [retrievedEnhancedValue, setRetrievedEnhancedValue] = useState<
    string | null
  >(null);
  const [isEnhancedLoading, setIsEnhancedLoading] = useState(false);

  // Token Demo
  const [token, setToken] = useState('demo_github_token_xyz');
  const [retrievedToken, setRetrievedToken] = useState<string | null>(null);
  const [retrievedEnhancedToken, setRetrievedEnhancedToken] = useState<
    string | null
  >(null);
  const [isTokenLoading, setIsTokenLoading] = useState(false);

  // Load initial values
  useEffect(() => {
    setRetrievedBasicValue(storage.get(basicKey));
    setRetrievedObject(objectStorage.get(objectKey));
    setRetrievedSecureValue(secureStorage.get(secureKey));
    setRetrievedToken(tokenStorage.getGithubToken());

    // Load async values
    const loadAsyncData = async () => {
      setIsEnhancedLoading(true);
      setIsTokenLoading(true);

      const enhancedValue = await enhancedSecureStorage.get(enhancedSecureKey);
      setRetrievedEnhancedValue(enhancedValue);

      const enhancedToken = await enhancedTokenStorage.getGithubToken();
      setRetrievedEnhancedToken(enhancedToken);

      setIsEnhancedLoading(false);
      setIsTokenLoading(false);
    };

    loadAsyncData();
  }, [basicKey, objectKey, secureKey, enhancedSecureKey]);

  // Basic Storage Handlers
  const handleBasicSave = () => {
    storage.set(basicKey, basicValue);
    setRetrievedBasicValue(storage.get(basicKey));
  };

  const handleBasicRemove = () => {
    storage.remove(basicKey);
    setRetrievedBasicValue(storage.get(basicKey));
  };

  // Object Storage Handlers
  const handleObjectSave = () => {
    const objectValue = {
      name: objectName,
      age: objectAge,
      active: objectActive,
    };
    objectStorage.set(objectKey, objectValue);
    setRetrievedObject(objectStorage.get(objectKey));
  };

  const handleObjectRemove = () => {
    storage.remove(objectKey);
    setRetrievedObject(null);
  };

  // Secure Storage Handlers
  const handleSecureSave = () => {
    secureStorage.set(secureKey, secureValue);
    setRetrievedSecureValue(secureStorage.get(secureKey));
  };

  const handleSecureRemove = () => {
    secureStorage.remove(secureKey);
    setRetrievedSecureValue(null);
  };

  // Enhanced Secure Storage Handlers
  const handleEnhancedSecureSave = async () => {
    setIsEnhancedLoading(true);
    await enhancedSecureStorage.set(enhancedSecureKey, enhancedSecureValue);
    const value = await enhancedSecureStorage.get(enhancedSecureKey);
    setRetrievedEnhancedValue(value);
    setIsEnhancedLoading(false);
  };

  const handleEnhancedSecureRemove = async () => {
    setIsEnhancedLoading(true);
    enhancedSecureStorage.remove(enhancedSecureKey);
    setRetrievedEnhancedValue(null);
    setIsEnhancedLoading(false);
  };

  // Token Storage Handlers
  const handleTokenSave = () => {
    tokenStorage.setGithubToken(token);
    setRetrievedToken(tokenStorage.getGithubToken());
  };

  const handleTokenRemove = () => {
    tokenStorage.clearGithubToken();
    setRetrievedToken(null);
  };

  // Enhanced Token Storage Handlers
  const handleEnhancedTokenSave = async () => {
    setIsTokenLoading(true);
    await enhancedTokenStorage.setGithubToken(token);
    const value = await enhancedTokenStorage.getGithubToken();
    setRetrievedEnhancedToken(value);
    setIsTokenLoading(false);
  };

  const handleEnhancedTokenRemove = async () => {
    setIsTokenLoading(true);
    enhancedTokenStorage.clearGithubToken();
    setRetrievedEnhancedToken(null);
    setIsTokenLoading(false);
  };

  // Helper function for displaying storage contents
  const getStorageSnapshot = () => {
    const snapshot: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        snapshot[key] = localStorage.getItem(key) || '';
      }
    }
    return snapshot;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-l-text-1 dark:text-d-text-1">
        Storage Utilities Demo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Basic Storage */}
        <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
            Basic Storage
          </h2>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                Key
              </label>
              <input
                type="text"
                value={basicKey}
                onChange={e => setBasicKey(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                Value
              </label>
              <input
                type="text"
                value={basicValue}
                onChange={e => setBasicValue(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
              />
            </div>
          </div>

          <div className="flex space-x-3 mb-4">
            <button
              onClick={handleBasicSave}
              className="px-3 py-2 bg-accent-1 text-white rounded-md text-sm hover:bg-accent-2 transition-colors"
            >
              Save to Storage
            </button>
            <button
              onClick={handleBasicRemove}
              className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors"
            >
              Remove
            </button>
          </div>

          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md">
            <div className="text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
              Retrieved Value:
            </div>
            <div className="text-l-text-1 dark:text-d-text-1 font-mono text-sm break-all">
              {retrievedBasicValue !== null ? retrievedBasicValue : '(null)'}
            </div>
          </div>
        </div>

        {/* Object Storage */}
        <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
            Object Storage
          </h2>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                Key
              </label>
              <input
                type="text"
                value={objectKey}
                onChange={e => setObjectKey(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                Object Data
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={objectName}
                  onChange={e => setObjectName(e.target.value)}
                  placeholder="Name"
                  className="px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
                />
                <input
                  type="number"
                  value={objectAge}
                  onChange={e => setObjectAge(Number(e.target.value))}
                  placeholder="Age"
                  className="px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
                />
              </div>
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={objectActive}
                  onChange={e => setObjectActive(e.target.checked)}
                  className="mr-2"
                />
                <label
                  htmlFor="active"
                  className="text-sm text-l-text-2 dark:text-d-text-2"
                >
                  Active
                </label>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mb-4">
            <button
              onClick={handleObjectSave}
              className="px-3 py-2 bg-accent-1 text-white rounded-md text-sm hover:bg-accent-2 transition-colors"
            >
              Save Object
            </button>
            <button
              onClick={handleObjectRemove}
              className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors"
            >
              Remove
            </button>
          </div>

          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md">
            <div className="text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
              Retrieved Object:
            </div>
            <div className="text-l-text-1 dark:text-d-text-1 font-mono text-sm break-all">
              {retrievedObject !== null
                ? JSON.stringify(retrievedObject, null, 2)
                : '(null)'}
            </div>
          </div>
        </div>

        {/* Secure Storage */}
        <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
            Secure Storage
          </h2>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                Secure Key
              </label>
              <input
                type="text"
                value={secureKey}
                onChange={e => setSecureKey(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                Sensitive Value
              </label>
              <input
                type="text"
                value={secureValue}
                onChange={e => setSecureValue(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
              />
            </div>
          </div>

          <div className="flex space-x-3 mb-4">
            <button
              onClick={handleSecureSave}
              className="px-3 py-2 bg-accent-1 text-white rounded-md text-sm hover:bg-accent-2 transition-colors"
            >
              Save Securely
            </button>
            <button
              onClick={handleSecureRemove}
              className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors"
            >
              Remove
            </button>
          </div>

          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md">
            <div className="text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
              Retrieved Secure Value:
            </div>
            <div className="text-l-text-1 dark:text-d-text-1 font-mono text-sm break-all">
              {retrievedSecureValue !== null ? retrievedSecureValue : '(null)'}
            </div>
          </div>
        </div>

        {/* Enhanced Secure Storage */}
        <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
            Enhanced Secure Storage (Web Crypto)
          </h2>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                Enhanced Key
              </label>
              <input
                type="text"
                value={enhancedSecureKey}
                onChange={e => setEnhancedSecureKey(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                Highly Sensitive Value
              </label>
              <input
                type="text"
                value={enhancedSecureValue}
                onChange={e => setEnhancedSecureValue(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
              />
            </div>
          </div>

          <div className="flex space-x-3 mb-4">
            <button
              onClick={handleEnhancedSecureSave}
              disabled={isEnhancedLoading}
              className="px-3 py-2 bg-accent-1 text-white rounded-md text-sm hover:bg-accent-2 transition-colors disabled:opacity-50"
            >
              {isEnhancedLoading ? 'Processing...' : 'Save with Web Crypto'}
            </button>
            <button
              onClick={handleEnhancedSecureRemove}
              disabled={isEnhancedLoading}
              className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors disabled:opacity-50"
            >
              Remove
            </button>
          </div>

          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md">
            <div className="text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
              Retrieved Enhanced Value:
            </div>
            <div className="text-l-text-1 dark:text-d-text-1 font-mono text-sm break-all">
              {isEnhancedLoading ? (
                <span>Loading...</span>
              ) : retrievedEnhancedValue !== null ? (
                retrievedEnhancedValue
              ) : (
                '(null)'
              )}
            </div>
          </div>

          <div className="mt-3 text-xs text-accent-success">
            Using Web Crypto API with PBKDF2 key derivation and AES-GCM
            encryption
          </div>
        </div>
      </div>

      {/* Token Storage Demo */}
      <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d mb-10">
        <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
          Token Storage
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
            GitHub Token
          </label>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Regular Token Storage */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-l-text-1 dark:text-d-text-1">
              Standard Encryption
            </h3>

            <div className="flex space-x-3 mb-4">
              <button
                onClick={handleTokenSave}
                className="px-3 py-2 bg-accent-1 text-white rounded-md text-sm hover:bg-accent-2 transition-colors"
              >
                Save Token
              </button>
              <button
                onClick={handleTokenRemove}
                className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors"
              >
                Clear Token
              </button>
            </div>

            <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md">
              <div className="text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                Retrieved Token:
              </div>
              <div className="text-l-text-1 dark:text-d-text-1 font-mono text-sm break-all">
                {retrievedToken !== null ? retrievedToken : '(null)'}
              </div>
            </div>
          </div>

          {/* Enhanced Token Storage */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-l-text-1 dark:text-d-text-1">
              Web Crypto Enhanced
            </h3>

            <div className="flex space-x-3 mb-4">
              <button
                onClick={handleEnhancedTokenSave}
                disabled={isTokenLoading}
                className="px-3 py-2 bg-accent-1 text-white rounded-md text-sm hover:bg-accent-2 transition-colors disabled:opacity-50"
              >
                {isTokenLoading ? 'Processing...' : 'Save Enhanced Token'}
              </button>
              <button
                onClick={handleEnhancedTokenRemove}
                disabled={isTokenLoading}
                className="px-3 py-2 bg-accent-danger text-white rounded-md text-sm hover:bg-accent-danger/80 transition-colors disabled:opacity-50"
              >
                Clear Token
              </button>
            </div>

            <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md">
              <div className="text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-1">
                Retrieved Enhanced Token:
              </div>
              <div className="text-l-text-1 dark:text-d-text-1 font-mono text-sm break-all">
                {isTokenLoading ? (
                  <span>Loading...</span>
                ) : retrievedEnhancedToken !== null ? (
                  retrievedEnhancedToken
                ) : (
                  '(null)'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LocalStorage Contents Viewer */}
      <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d mb-6">
        <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
          LocalStorage Raw Contents
        </h2>

        <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md">
          <pre className="text-xs text-l-text-2 dark:text-d-text-2 overflow-auto max-h-60">
            {JSON.stringify(getStorageSnapshot(), null, 2)}
          </pre>
        </div>

        <div className="mt-3 text-xs text-accent-warning">
          Notice that sensitive values are encrypted and not readable in their
          raw form.
        </div>
      </div>

      {/* Storage Utilities Documentation */}
      <div className="bg-l-bg-2 dark:bg-d-bg-2 p-5 rounded-lg border border-border-l dark:border-border-d mb-10">
        <h2 className="text-xl font-semibold mb-4 text-l-text-1 dark:text-d-text-1">
          Storage Utilities Documentation
        </h2>

        <div className="space-y-4 text-sm text-l-text-2 dark:text-d-text-2">
          <div>
            <h3 className="text-md font-medium text-l-text-1 dark:text-d-text-1 mb-1">
              Basic Storage
            </h3>
            <p className="mb-2">For storing simple string values:</p>
            <pre className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-md overflow-auto">
              {`// Store a value
storage.set('key', 'value');

// Retrieve a value
const value = storage.get('key');

// Check if a key exists
if (storage.has('key')) {
  // Do something
}

// Remove a value
storage.remove('key');`}
            </pre>
          </div>

          <div>
            <h3 className="text-md font-medium text-l-text-1 dark:text-d-text-1 mb-1">
              Object Storage
            </h3>
            <p className="mb-2">For storing and retrieving JSON objects:</p>
            <pre className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-md overflow-auto">
              {`// Store an object
const user = { name: 'John', age: 30 };
objectStorage.set('user', user);

// Retrieve an object with type safety
const retrievedUser = objectStorage.get<{ name: string; age: number }>('user');
if (retrievedUser) {
  console.log(retrievedUser.name); // Type-safe access
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-md font-medium text-l-text-1 dark:text-d-text-1 mb-1">
              Secure Storage
            </h3>
            <p className="mb-2">For storing sensitive data with encryption:</p>
            <pre className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-md overflow-auto">
              {`// Store sensitive data securely
secureStorage.set('api_key', 'secret123');

// Retrieve encrypted data
const apiKey = secureStorage.get('api_key');

// Remove sensitive data
secureStorage.remove('api_key');`}
            </pre>
          </div>

          <div>
            <h3 className="text-md font-medium text-l-text-1 dark:text-d-text-1 mb-1">
              Enhanced Secure Storage (Web Crypto)
            </h3>
            <p className="mb-2">
              For maximum security with the Web Crypto API:
            </p>
            <pre className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-md overflow-auto">
              {`// Store highly sensitive data with Web Crypto
await enhancedSecureStorage.set('secret_key', 'top_secret');

// Retrieve data (async operation)
const secretKey = await enhancedSecureStorage.get('secret_key');

// Remove data
enhancedSecureStorage.remove('secret_key');`}
            </pre>
          </div>

          <div>
            <h3 className="text-md font-medium text-l-text-1 dark:text-d-text-1 mb-1">
              Token Management
            </h3>
            <p className="mb-2">
              Specialized utilities for GitHub token management:
            </p>
            <pre className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-md overflow-auto">
              {`// Using standard encryption
tokenStorage.setGithubToken('github_token_123');
const token = tokenStorage.getGithubToken();
tokenStorage.clearGithubToken();

// Using enhanced encryption (Web Crypto)
await enhancedTokenStorage.setGithubToken('github_token_123');
const enhancedToken = await enhancedTokenStorage.getGithubToken();
enhancedTokenStorage.clearGithubToken();`}
            </pre>
          </div>

          <div>
            <h3 className="text-md font-medium text-l-text-1 dark:text-d-text-1 mb-1">
              Security Considerations
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>All client-side storage has inherent security limitations</li>
              <li>
                Web Crypto provides the strongest browser encryption available
              </li>
              <li>
                Never store truly sensitive information like passwords
                client-side
              </li>
              <li>The encryption key is stored in environment variables</li>
              <li>Always use HTTPS in production</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
