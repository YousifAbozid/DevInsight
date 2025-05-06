import { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';

interface GitHubTokenSectionProps {
  // Token related props
  token: string;
  onTokenChange: (newToken: string) => void;
  onTokenClear: () => void;
  isLoading?: boolean;
  isTokenLoading?: boolean;

  // UI customization
  defaultExpanded?: boolean;
  className?: string;
  showTokenSaved?: boolean;

  // Placeholders & text customization
  toggleText?: string;
  hiddenToggleText?: string;
  placeholder?: string;
  explanatoryText?: React.ReactNode;
}

export default function GitHubTokenSection({
  token,
  onTokenChange,
  onTokenClear,
  isLoading = false,
  isTokenLoading = false,
  defaultExpanded = false,
  className = '',
  showTokenSaved = false,
  toggleText = 'GitHub Token',
  hiddenToggleText = 'Hide token',
  placeholder = 'GitHub Personal Access Token (optional)',
  explanatoryText = (
    <>
      The token is required to fetch contribution data. It&apos;s stored
      securely in your browser and never sent to our servers. Create a token
      with the &apos;user&apos; scope at{' '}
      <a
        href="https://github.com/settings/tokens"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-accent-1 hover:text-accent-2 transition-colors duration-200"
      >
        github.com/settings/tokens
      </a>
    </>
  ),
}: GitHubTokenSectionProps) {
  const [showTokenInput, setShowTokenInput] = useState(defaultExpanded);

  // Add a ref to track previous token value
  const prevTokenRef = useRef(token);

  // Add an effect to detect token changes
  useEffect(() => {
    if (prevTokenRef.current !== token) {
      console.warn('Token changed in GitHubTokenSection');
      prevTokenRef.current = token;
    }
  }, [token]);

  // Wrap the token change handler to prevent unnecessary updates
  const handleTokenChange = (newToken: string) => {
    // Only update if the token actually changed
    if (newToken !== token) {
      onTokenChange(newToken);
    }
  };

  return (
    <div className={`mt-1 ${className}`}>
      <button
        type="button"
        onClick={() => setShowTokenInput(!showTokenInput)}
        className="flex flex-wrap items-center gap-1.5 text-accent-1 hover:text-accent-2 transition-colors mb-2 cursor-pointer text-sm w-full"
      >
        <div className="flex items-center">
          <Icons.Key className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-medium ml-1.5">
            {showTokenInput ? hiddenToggleText : toggleText}
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
              placeholder={placeholder}
              className="w-full pl-8 pr-16 py-2.5 text-sm rounded-lg bg-l-bg-2 dark:bg-d-bg-2 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none transition-all duration-200"
              disabled={isLoading || isTokenLoading}
            />
            {token && (
              <button
                type="button"
                onClick={onTokenClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 bg-accent-danger/10 text-accent-danger rounded hover:bg-accent-danger/20 flex items-center gap-1 transition-colors duration-200"
              >
                <Icons.Close className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
          <div className="flex items-start gap-1.5 mt-2 text-xs text-l-text-3 dark:text-d-text-3">
            <Icons.AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <p className="text-xs">{explanatoryText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
