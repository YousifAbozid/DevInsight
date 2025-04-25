/**
 * Storage utilities for DevInsight
 * Handles local storage with encryption support for sensitive data
 */

// Get encryption secret from environment variables
// Falls back to a default value if the env var is not available (development only)
const ENCRYPTION_SECRET =
  import.meta.env.VITE_ENCRYPTION_SECRET ||
  'dev-fallback-key-not-for-production';

// Log warning if using fallback key in development
if (!import.meta.env.VITE_ENCRYPTION_SECRET) {
  console.warn(
    'Warning: Using fallback encryption key. Set VITE_ENCRYPTION_SECRET in your .env file.'
  );
}

/**
 * Basic storage operations
 */
export const storage = {
  /**
   * Get a value from localStorage
   */
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  },

  /**
   * Set a value in localStorage
   */
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  },

  /**
   * Remove a value from localStorage
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  },

  /**
   * Clear all values from localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Check if a key exists in localStorage
   */
  has: (key: string): boolean => {
    return storage.get(key) !== null;
  },
};

/**
 * Object storage operations
 */
export const objectStorage = {
  /**
   * Get an object from localStorage
   */
  get: <T>(key: string): T | null => {
    const value = storage.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error);
      return null;
    }
  },

  /**
   * Set an object in localStorage
   */
  set: <T>(key: string, value: T): void => {
    try {
      const stringValue = JSON.stringify(value);
      storage.set(key, stringValue);
    } catch (error) {
      console.error('Error stringifying JSON for localStorage:', error);
    }
  },
};

/**
 * Advanced Encryption using Web Crypto API
 * This provides true cryptographic security with:
 * - AES-GCM authenticated encryption
 * - Secure key derivation (PBKDF2)
 * - Cryptographically secure random IVs
 */
export const advancedEncryption = {
  /**
   * Derives a key from the master secret
   * @param salt - Salt for key derivation
   * @returns Promise resolving to CryptoKey
   */
  deriveKey: async (salt: Uint8Array): Promise<CryptoKey> => {
    // Convert string secret to bytes
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

    // Derive an AES-GCM key from the imported key
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000, // High iteration count for security
        hash: 'SHA-256',
      },
      importedKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  },

  /**
   * Encrypt text using AES-GCM with derived key
   * @param text - Text to encrypt
   * @returns Promise resolving to encrypted data as base64 string
   */
  encrypt: async (text: string): Promise<string> => {
    try {
      // Generate random salt and IV
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // Derive key using the salt
      const key = await advancedEncryption.deriveKey(salt);

      // Encrypt the data
      const encoder = new TextEncoder();
      const dataToEncrypt = encoder.encode(text);

      const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        dataToEncrypt
      );

      // Combine salt, IV, and encrypted data into a single buffer
      const result = new Uint8Array(
        salt.length + iv.length + encryptedData.byteLength
      );
      result.set(salt, 0);
      result.set(iv, salt.length);
      result.set(new Uint8Array(encryptedData), salt.length + iv.length);

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...result));
    } catch (error) {
      console.error('Error encrypting data:', error);
      return '';
    }
  },

  /**
   * Decrypt text that was encrypted with AES-GCM
   * @param encryptedText - Base64 string containing salt, IV, and encrypted data
   * @returns Promise resolving to decrypted text
   */
  decrypt: async (encryptedText: string): Promise<string> => {
    try {
      // Convert base64 back to array buffer
      const encryptedBuffer = Uint8Array.from(atob(encryptedText), c =>
        c.charCodeAt(0)
      );

      // Extract salt, IV, and encrypted data
      const salt = encryptedBuffer.slice(0, 16);
      const iv = encryptedBuffer.slice(16, 28);
      const encryptedData = encryptedBuffer.slice(28);

      // Derive the key using the extracted salt
      const key = await advancedEncryption.deriveKey(salt);

      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedData
      );

      // Decode the decrypted data back to text
      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return '';
    }
  },
};

/**
 * Enhanced secure storage using advanced encryption
 * - Uses asynchronous Web Crypto API
 * - Provides the highest level of client-side encryption security
 */
export const enhancedSecureStorage = {
  /**
   * Get encrypted data from localStorage
   */
  get: async (key: string): Promise<string | null> => {
    const encryptedValue = storage.get(key);
    if (!encryptedValue) return null;

    return advancedEncryption.decrypt(encryptedValue);
  },

  /**
   * Set encrypted data in localStorage
   */
  set: async (key: string, value: string): Promise<void> => {
    const encryptedValue = await advancedEncryption.encrypt(value);
    storage.set(key, encryptedValue);
  },

  /**
   * Remove encrypted data from localStorage
   */
  remove: (key: string): void => {
    storage.remove(key);
  },
};

/**
 * Enhanced token management using Web Crypto API
 */
export const enhancedTokenStorage = {
  /**
   * Key for GitHub token storage
   */
  GITHUB_TOKEN_KEY: 'github_token_secure',

  /**
   * Get GitHub API token
   */
  getGithubToken: async (): Promise<string | null> => {
    return enhancedSecureStorage.get(enhancedTokenStorage.GITHUB_TOKEN_KEY);
  },

  /**
   * Save GitHub API token
   */
  setGithubToken: async (token: string): Promise<void> => {
    return enhancedSecureStorage.set(
      enhancedTokenStorage.GITHUB_TOKEN_KEY,
      token
    );
  },

  /**
   * Clear GitHub API token
   */
  clearGithubToken: (): void => {
    enhancedSecureStorage.remove(enhancedTokenStorage.GITHUB_TOKEN_KEY);
  },
};

/**
 * Encryption utilities
 */
export const encryption = {
  /**
   * Encrypt text using AES encryption
   * Much more secure than the previous Base64 approach
   */
  encrypt: (text: string): string => {
    try {
      return CryptoJS.AES.encrypt(text, ENCRYPTION_SECRET).toString();
    } catch (error) {
      console.error('Error encrypting data:', error);
      return '';
    }
  },

  /**
   * Decrypt AES encrypted text
   */
  decrypt: (encryptedText: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_SECRET);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return '';
    }
  },
};

/**
 * Secure storage for sensitive data like tokens
 */
export const secureStorage = {
  /**
   * Get encrypted data from localStorage
   */
  get: (key: string): string | null => {
    const encryptedValue = storage.get(key);
    if (!encryptedValue) return null;

    return encryption.decrypt(encryptedValue);
  },

  /**
   * Set encrypted data in localStorage
   */
  set: (key: string, value: string): void => {
    const encryptedValue = encryption.encrypt(value);
    storage.set(key, encryptedValue);
  },

  /**
   * Remove encrypted data from localStorage
   */
  remove: (key: string): void => {
    storage.remove(key);
  },
};

/**
 * Token management utilities
 */
export const tokenStorage = {
  /**
   * Key for GitHub token storage
   */
  GITHUB_TOKEN_KEY: 'github_token',

  /**
   * Get GitHub API token
   */
  getGithubToken: (): string | null => {
    return secureStorage.get(tokenStorage.GITHUB_TOKEN_KEY);
  },

  /**
   * Save GitHub API token
   */
  setGithubToken: (token: string): void => {
    secureStorage.set(tokenStorage.GITHUB_TOKEN_KEY, token);
  },

  /**
   * Clear GitHub API token
   */
  clearGithubToken: (): void => {
    secureStorage.remove(tokenStorage.GITHUB_TOKEN_KEY);
  },
};

export default {
  storage,
  objectStorage,
  secureStorage,
  tokenStorage,
  advancedEncryption,
  enhancedSecureStorage,
  enhancedTokenStorage,
};
