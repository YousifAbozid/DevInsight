/**
 * Get the background CSS class for a badge based on its tier
 */
export function getBadgeBgClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'bg-amber-100 dark:bg-amber-900/30';
    case 'silver':
      return 'bg-slate-200 dark:bg-slate-700/50';
    case 'gold':
      return 'bg-amber-100 dark:bg-amber-900/40';
    case 'platinum':
      return 'bg-sky-100 dark:bg-sky-900/30';
    default:
      return 'bg-l-bg-3 dark:bg-d-bg-3';
  }
}

/**
 * Get the text color CSS class for a badge based on its tier
 */
export function getBadgeTextClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'text-amber-800 dark:text-amber-300';
    case 'silver':
      return 'text-slate-700 dark:text-slate-300';
    case 'gold':
      return 'text-amber-700 dark:text-amber-300';
    case 'platinum':
      return 'text-sky-800 dark:text-sky-300';
    default:
      return 'text-l-text-2 dark:text-d-text-2';
  }
}
