/**
 * Helper functions for styling badges based on their tier
 */

// Badge background class based on tier
export function getBadgeBgClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'bg-[#CD7F32]/20 text-[#CD7F32] dark:bg-[#CD7F32]/30 dark:text-[#CD7F32]';
    case 'silver':
      return 'bg-[#8E8E93]/20 text-[#8E8E93] dark:bg-[#8E8E93]/30 dark:text-[#C8C8C8]';
    case 'gold':
      return 'bg-[#FFD700]/20 text-[#FFD700] dark:bg-[#FFD700]/30 dark:text-[#FFD700]';
    case 'platinum':
      return 'bg-[#8A9BA8]/20 text-[#8A9BA8] dark:bg-[#8A9BA8]/30 dark:text-[#B8C5D0]';
    default:
      return 'bg-l-bg-3 dark:bg-d-bg-3';
  }
}

// Badge border class based on tier
export function getBadgeBorderClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'border-[#CD7F32]/40';
    case 'silver':
      return 'border-[#C0C0C0]/40';
    case 'gold':
      return 'border-[#FFD700]/40';
    case 'platinum':
      return 'border-[#E5E4E2]/40';
    default:
      return 'border-border-l dark:border-border-d';
  }
}

// Badge text color class based on tier
export function getBadgeTextClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'text-[#CD7F32]';
    case 'silver':
      return 'text-[#8E8E93] dark:text-[#C0C0C0]';
    case 'gold':
      return 'text-[#FFD700]';
    case 'platinum':
      return 'text-[#8A9BA8] dark:text-[#B8C5D0]';
    default:
      return 'text-l-text-2 dark:text-d-text-2';
  }
}
