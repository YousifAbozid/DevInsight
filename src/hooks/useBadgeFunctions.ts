import { useMemo } from 'react';
import { Icons } from '../components/shared/Icons';
import { ContributionData } from '../services/githubGraphQLService';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'activity' | 'languages' | 'repositories' | 'impact' | 'specialty';
  earned: boolean;
}

// Helper functions for badge styling
export function getBadgeBorderClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'border-[#CD7F32]';
    case 'silver':
      return 'border-[#8E8E93]'; // Darker silver for better visibility
    case 'gold':
      return 'border-[#FFD700]';
    case 'platinum':
      return 'border-[#8A9BA8]'; // More distinctive platinum color
    default:
      return 'border-border-l dark:border-border-d';
  }
}

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

export function getBadgeTierClass(tier: string): string {
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

// Custom hook to calculate badges
export function useBadges(
  user: GithubUser | null,
  repositories: Repository[] | undefined,
  contributionData?: ContributionData
): Badge[] {
  return useMemo(() => {
    if (!repositories || !repositories.length) return [];

    const badges: Badge[] = [];

    // Calculate total stars across all repositories
    const totalStars = repositories.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );

    // Get all unique languages
    const languages = new Set<string>();
    repositories.forEach(repo => {
      if (repo.language) {
        languages.add(repo.language);
      }
    });

    // Total contributions in the last year
    const totalContributions = contributionData?.totalContributions || 0;

    // Determine primary language
    const languageCounts: Record<string, number> = {};
    repositories.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] =
          (languageCounts[repo.language] || 0) + 1;
      }
    });

    const primaryLanguage =
      Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      null;

    // Check for recency of activity
    const now = new Date();
    const recentActivity = repositories.some(repo => {
      const updateDate = new Date(repo.updated_at);
      const diffInDays = Math.floor(
        (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffInDays < 30; // Activity within the last 30 days
    });

    // Repository count badges - always add all 4
    badges.push({
      id: 'repo-starter',
      name: 'Project Starter',
      description: 'Created your first GitHub repository',
      icon: Icons.Repository,
      tier: 'bronze',
      category: 'repositories',
      earned: repositories.length >= 1,
    });

    badges.push({
      id: 'repo-creator',
      name: 'Project Creator',
      description: 'Maintained 5+ GitHub repositories',
      icon: Icons.Repository,
      tier: 'silver',
      category: 'repositories',
      earned: repositories.length >= 5,
    });

    badges.push({
      id: 'repo-manager',
      name: 'Repository Manager',
      description: 'Managed an impressive collection of 15+ repositories',
      icon: Icons.Repository,
      tier: 'gold',
      category: 'repositories',
      earned: repositories.length >= 15,
    });

    badges.push({
      id: 'repo-guru',
      name: 'Repository Guru',
      description: 'Mastered the art of managing 30+ repositories',
      icon: Icons.Repository,
      tier: 'platinum',
      category: 'repositories',
      earned: repositories.length >= 30,
    });

    // Contribution badges - always add all 4
    badges.push({
      id: 'code-contributor',
      name: 'Code Contributor',
      description: 'Made your first contributions on GitHub',
      icon: Icons.Commit,
      tier: 'bronze',
      category: 'activity',
      earned: totalContributions >= 1,
    });

    badges.push({
      id: 'code-enthusiast',
      name: 'Code Enthusiast',
      description: 'Made 100+ contributions in the past year',
      icon: Icons.Commit,
      tier: 'silver',
      category: 'activity',
      earned: totalContributions >= 100,
    });

    badges.push({
      id: 'commit-machine',
      name: 'Commit Machine',
      description: 'Made 500+ contributions in the past year',
      icon: Icons.Commit,
      tier: 'gold',
      category: 'activity',
      earned: totalContributions >= 500,
    });

    badges.push({
      id: 'commit-ninja',
      name: 'Commit Ninja',
      description: 'Made 1,000+ contributions in the past year',
      icon: Icons.Commit,
      tier: 'platinum',
      category: 'activity',
      earned: totalContributions >= 1000,
    });

    // Language badges - always add all 4
    badges.push({
      id: 'code-writer',
      name: 'Code Writer',
      description: 'Wrote code in your first programming language',
      icon: Icons.Code,
      tier: 'bronze',
      category: 'languages',
      earned: languages.size >= 1,
    });

    badges.push({
      id: 'language-explorer',
      name: 'Language Explorer',
      description: 'Explored and used 3+ programming languages',
      icon: Icons.Code,
      tier: 'silver',
      category: 'languages',
      earned: languages.size >= 3,
    });

    badges.push({
      id: 'polyglot-coder',
      name: 'Polyglot Programmer',
      description: 'Mastered 6+ different programming languages',
      icon: Icons.Code,
      tier: 'gold',
      category: 'languages',
      earned: languages.size >= 6,
    });

    badges.push({
      id: 'language-master',
      name: 'Language Master',
      description: 'Achieved proficiency in 10+ programming languages',
      icon: Icons.Code,
      tier: 'platinum',
      category: 'languages',
      earned: languages.size >= 10,
    });

    // Star badges - always add all 4
    badges.push({
      id: 'first-star',
      name: 'First Star',
      description: 'Someone starred one of your repositories',
      icon: Icons.Star,
      tier: 'bronze',
      category: 'impact',
      earned: totalStars >= 1,
    });

    badges.push({
      id: 'rising-star',
      name: 'Rising Star',
      description: 'Earned 50+ stars across your repositories',
      icon: Icons.Star,
      tier: 'silver',
      category: 'impact',
      earned: totalStars >= 50,
    });

    badges.push({
      id: 'community-favorite',
      name: 'Community Favorite',
      description: 'Earned 250+ stars across your repositories',
      icon: Icons.Star,
      tier: 'gold',
      category: 'impact',
      earned: totalStars >= 250,
    });

    badges.push({
      id: 'open-source-hero',
      name: 'Open Source Hero',
      description: 'Earned 1,000+ stars for your valuable contributions',
      icon: Icons.Star,
      tier: 'platinum',
      category: 'impact',
      earned: totalStars >= 1000,
    });

    // Activity badge - always add regardless of activity status
    badges.push({
      id: 'active-developer',
      name: 'Active Developer',
      description: 'Showed coding activity within the last 30 days',
      icon: Icons.Activity,
      tier: 'silver',
      category: 'activity',
      earned: recentActivity,
    });

    // Language specialty badges - only add if there's a primary language
    if (primaryLanguage) {
      const langCount = languageCounts[primaryLanguage];
      let tier: 'bronze' | 'silver' | 'gold' = 'bronze';
      let title = 'Enthusiast';

      if (langCount >= 10) {
        tier = 'gold';
        title = 'Master';
      } else if (langCount >= 5) {
        tier = 'silver';
        title = 'Developer';
      }

      badges.push({
        id: `${primaryLanguage.toLowerCase()}-${tier}`,
        name: `${primaryLanguage} ${title}`,
        description: `Created ${langCount} repositories using ${primaryLanguage}`,
        icon: Icons.Specialty,
        tier: tier,
        category: 'specialty',
        earned: true,
      });
    }

    return badges;
  }, [user, repositories, contributionData]);
}

// Function to get an icon by type (used in calculateBadges)
export function getIconByType(
  type: string
): React.ComponentType<{ className?: string }> {
  switch (type) {
    case 'repository':
      return Icons.Repository;
    case 'commit':
      return Icons.Commit;
    case 'code':
      return Icons.Code;
    case 'star':
      return Icons.Star;
    case 'activity':
      return Icons.Activity;
    case 'specialty':
      return Icons.Specialty;
    default:
      return Icons.Trophy;
  }
}

// Non-hook version of the badge calculation function (for use outside components)
export function calculateBadges(
  repositories: Repository[] | undefined | null,
  contributionData?: ContributionData
): Badge[] {
  // Early return if repositories is not a valid array
  if (
    !repositories ||
    !Array.isArray(repositories) ||
    repositories.length === 0
  ) {
    return [];
  }

  const badges: Badge[] = [];

  // Calculate total stars across all repositories
  const totalStars = repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  // Get all unique languages
  const languages = new Set<string>();
  repositories.forEach(repo => {
    if (repo.language) {
      languages.add(repo.language);
    }
  });

  // Total contributions in the last year
  const totalContributions = contributionData?.totalContributions || 0;

  // Determine primary language
  const languageCounts: Record<string, number> = {};
  repositories.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  const primaryLanguage =
    Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Check for recency of activity
  const now = new Date();
  const recentActivity = repositories.some(repo => {
    const updateDate = new Date(repo.updated_at);
    const diffInDays = Math.floor(
      (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffInDays < 30; // Activity within the last 30 days
  });

  // Repository count badges - always add all 4
  badges.push({
    id: 'repo-starter',
    name: 'Project Starter',
    description: 'Created your first GitHub repository',
    icon: getIconByType('repository'),
    tier: 'bronze',
    category: 'repositories',
    earned: repositories.length >= 1,
  });

  badges.push({
    id: 'repo-creator',
    name: 'Project Creator',
    description: 'Maintained 5+ GitHub repositories',
    icon: getIconByType('repository'),
    tier: 'silver',
    category: 'repositories',
    earned: repositories.length >= 5,
  });

  badges.push({
    id: 'repo-manager',
    name: 'Repository Manager',
    description: 'Managed an impressive collection of 15+ repositories',
    icon: getIconByType('repository'),
    tier: 'gold',
    category: 'repositories',
    earned: repositories.length >= 15,
  });

  badges.push({
    id: 'repo-guru',
    name: 'Repository Guru',
    description: 'Mastered the art of managing 30+ repositories',
    icon: getIconByType('repository'),
    tier: 'platinum',
    category: 'repositories',
    earned: repositories.length >= 30,
  });

  // Contribution badges - always add all 4
  badges.push({
    id: 'code-contributor',
    name: 'Code Contributor',
    description: 'Made your first contributions on GitHub',
    icon: getIconByType('commit'),
    tier: 'bronze',
    category: 'activity',
    earned: totalContributions >= 1,
  });

  badges.push({
    id: 'code-enthusiast',
    name: 'Code Enthusiast',
    description: 'Made 100+ contributions in the past year',
    icon: getIconByType('commit'),
    tier: 'silver',
    category: 'activity',
    earned: totalContributions >= 100,
  });

  badges.push({
    id: 'commit-machine',
    name: 'Commit Machine',
    description: 'Made 500+ contributions in the past year',
    icon: getIconByType('commit'),
    tier: 'gold',
    category: 'activity',
    earned: totalContributions >= 500,
  });

  badges.push({
    id: 'commit-ninja',
    name: 'Commit Ninja',
    description: 'Made 1,000+ contributions in the past year',
    icon: getIconByType('commit'),
    tier: 'platinum',
    category: 'activity',
    earned: totalContributions >= 1000,
  });

  // Language badges - always add all 4
  badges.push({
    id: 'code-writer',
    name: 'Code Writer',
    description: 'Wrote code in your first programming language',
    icon: getIconByType('code'),
    tier: 'bronze',
    category: 'languages',
    earned: languages.size >= 1,
  });

  badges.push({
    id: 'language-explorer',
    name: 'Language Explorer',
    description: 'Explored and used 3+ programming languages',
    icon: getIconByType('code'),
    tier: 'silver',
    category: 'languages',
    earned: languages.size >= 3,
  });

  badges.push({
    id: 'polyglot-coder',
    name: 'Polyglot Programmer',
    description: 'Mastered 6+ different programming languages',
    icon: getIconByType('code'),
    tier: 'gold',
    category: 'languages',
    earned: languages.size >= 6,
  });

  badges.push({
    id: 'language-master',
    name: 'Language Master',
    description: 'Achieved proficiency in 10+ programming languages',
    icon: getIconByType('code'),
    tier: 'platinum',
    category: 'languages',
    earned: languages.size >= 10,
  });

  // Star badges - always add all 4
  badges.push({
    id: 'first-star',
    name: 'First Star',
    description: 'Someone starred one of your repositories',
    icon: getIconByType('star'),
    tier: 'bronze',
    category: 'impact',
    earned: totalStars >= 1,
  });

  badges.push({
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Earned 50+ stars across your repositories',
    icon: getIconByType('star'),
    tier: 'silver',
    category: 'impact',
    earned: totalStars >= 50,
  });

  badges.push({
    id: 'community-favorite',
    name: 'Community Favorite',
    description: 'Earned 250+ stars across your repositories',
    icon: getIconByType('star'),
    tier: 'gold',
    category: 'impact',
    earned: totalStars >= 250,
  });

  badges.push({
    id: 'open-source-hero',
    name: 'Open Source Hero',
    description: 'Earned 1,000+ stars for your valuable contributions',
    icon: getIconByType('star'),
    tier: 'platinum',
    category: 'impact',
    earned: totalStars >= 1000,
  });

  // Activity badge - always add regardless of activity status
  badges.push({
    id: 'active-developer',
    name: 'Active Developer',
    description: 'Showed coding activity within the last 30 days',
    icon: getIconByType('activity'),
    tier: 'silver',
    category: 'activity',
    earned: recentActivity,
  });

  // Language specialty badges - only add if there's a primary language
  if (primaryLanguage) {
    const langCount = languageCounts[primaryLanguage];
    let tier: 'bronze' | 'silver' | 'gold' = 'bronze';
    let title = 'Enthusiast';

    if (langCount >= 10) {
      tier = 'gold';
      title = 'Master';
    } else if (langCount >= 5) {
      tier = 'silver';
      title = 'Developer';
    }

    badges.push({
      id: `${primaryLanguage.toLowerCase()}-${tier}`,
      name: `${primaryLanguage} ${title}`,
      description: `Created ${langCount} repositories using ${primaryLanguage}`,
      icon: getIconByType('specialty'),
      tier: tier,
      category: 'specialty',
      earned: true,
    });
  }

  return badges;
}
