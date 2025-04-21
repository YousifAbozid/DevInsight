import { useEffect, useState } from 'react';
import {
  useRateLimitStatus,
  checkRateLimitWarning,
  formatRateLimitReset,
} from '../services/githubRateLimitService';
import { Icons } from './shared/Icons';

interface RateLimitIndicatorProps {
  token?: string;
}

export default function RateLimitIndicator({ token }: RateLimitIndicatorProps) {
  const [visible, setVisible] = useState(false);
  const { data: rateLimitData, isLoading, error } = useRateLimitStatus(token);
  const [expanded, setExpanded] = useState(false);

  const warning = checkRateLimitWarning(rateLimitData);

  useEffect(() => {
    // Show the indicator only when we're close to limits or there's an error
    if (warning || error) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [warning, error]);

  // Don't render if not visible or if data is still loading
  if (!visible || isLoading) return null;

  if (!rateLimitData) return null;

  const coreData = rateLimitData.resources.core;
  const searchData = rateLimitData.resources.search;
  const graphqlData = rateLimitData.resources.graphql;

  const corePercentage = Math.round(
    (coreData.remaining / coreData.limit) * 100
  );
  const searchPercentage = Math.round(
    (searchData.remaining / searchData.limit) * 100
  );
  const graphqlPercentage = Math.round(
    (graphqlData.remaining / graphqlData.limit) * 100
  );

  // Color class for progress bars
  const getColorClass = (percentage: number) => {
    if (percentage > 50) return 'bg-accent-success';
    if (percentage > 20) return 'bg-accent-warning';
    return 'bg-accent-danger';
  };

  return (
    <div className="mb-4 rounded-lg border border-border-l dark:border-border-d overflow-hidden">
      <div
        className={`p-3 ${warning ? 'bg-accent-warning/10' : 'bg-l-bg-2 dark:bg-d-bg-2'} flex justify-between items-center cursor-pointer`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Icons.Timer className="w-4 h-4 text-accent-1" />
          <span className="font-medium text-sm">
            {warning || 'GitHub API Rate Limit Status'}
          </span>
        </div>
        {expanded ? (
          <Icons.ChevronUp className="w-4 h-4 transition-transform" />
        ) : (
          <Icons.ChevronDown className="w-4 h-4 transition-transform" />
        )}
      </div>

      {expanded && (
        <div className="p-4 bg-l-bg-1 dark:bg-d-bg-1">
          <div className="space-y-3">
            {/* Core API */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-l-text-1 dark:text-d-text-1">
                  Core API
                </span>
                <span className="text-l-text-2 dark:text-d-text-2">
                  {coreData.remaining} / {coreData.limit} remaining
                </span>
              </div>
              <div className="w-full h-2 bg-l-bg-3 dark:bg-d-bg-3 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getColorClass(corePercentage)}`}
                  style={{ width: `${corePercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-l-text-3 dark:text-d-text-3 mt-1">
                Resets in {formatRateLimitReset(coreData.reset)}
              </div>
            </div>

            {/* Search API */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-l-text-1 dark:text-d-text-1">
                  Search API
                </span>
                <span className="text-l-text-2 dark:text-d-text-2">
                  {searchData.remaining} / {searchData.limit} remaining
                </span>
              </div>
              <div className="w-full h-2 bg-l-bg-3 dark:bg-d-bg-3 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getColorClass(searchPercentage)}`}
                  style={{ width: `${searchPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-l-text-3 dark:text-d-text-3 mt-1">
                Resets in {formatRateLimitReset(searchData.reset)}
              </div>
            </div>

            {/* GraphQL API */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-l-text-1 dark:text-d-text-1">
                  GraphQL API
                </span>
                <span className="text-l-text-2 dark:text-d-text-2">
                  {graphqlData.remaining} / {graphqlData.limit} remaining
                </span>
              </div>
              <div className="w-full h-2 bg-l-bg-3 dark:bg-d-bg-3 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getColorClass(graphqlPercentage)}`}
                  style={{ width: `${graphqlPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-l-text-3 dark:text-d-text-3 mt-1">
                Resets in {formatRateLimitReset(graphqlData.reset)}
              </div>
            </div>

            <div className="text-xs text-l-text-3 dark:text-d-text-3 mt-2 pt-2 border-t border-border-l dark:border-border-d">
              {token ? (
                <p>
                  You&apos;re using an authenticated session with higher rate
                  limits.
                </p>
              ) : (
                <p>
                  Add a GitHub token to increase your rate limits from 60 to
                  5,000 requests per hour.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
