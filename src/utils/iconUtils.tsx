import { JSX } from 'react';
import { Icons } from '../components/shared/Icons';

/**
 * Returns the appropriate icon component for a given metric ID
 */
export function getIconForMetric(metricId: string): JSX.Element {
  switch (metricId) {
    case 'repos':
      return <Icons.Repository className="w-4 h-4" />;
    case 'stars':
      return <Icons.Star className="w-4 h-4" />;
    case 'commits':
      return <Icons.Commit className="w-4 h-4" />;
    case 'followers':
      return <Icons.Users className="w-4 h-4" />;
    case 'experience':
      return <Icons.Calendar className="w-4 h-4" />;
    case 'forks':
      return <Icons.GitBranch className="w-4 h-4" />;
    case 'languages':
      return <Icons.Languages className="w-4 h-4" />;
    case 'quality':
      return <Icons.BadgeCheck className="w-4 h-4" />;
    case 'prs':
      return <Icons.GitPullRequest className="w-4 h-4" />;
    case 'activity':
      return <Icons.Activity className="w-4 h-4" />;
    default:
      return <Icons.Info className="w-4 h-4" />;
  }
}
