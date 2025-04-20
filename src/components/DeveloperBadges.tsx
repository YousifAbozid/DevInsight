import { useState, useMemo } from 'react';
import { ContributionData } from '../services/githubGraphQLService';
import { Icons } from './shared/Icons';

interface DeveloperBadgesProps {
  user: GithubUser;
  repositories: Repository[] | undefined;
  contributionData?: ContributionData;
  loading: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'activity' | 'languages' | 'repositories' | 'impact' | 'specialty';
  earned: boolean;
}

// Category configuration
const categoryInfo = {
  activity: {
    title: 'Commit Activity',
    icon: Icons.Activity,
    description: 'Badges for your contribution frequency and patterns',
  },
  languages: {
    title: 'Language Mastery',
    icon: Icons.Code,
    description: 'Recognition of your programming language skills',
  },
  repositories: {
    title: 'Repository Management',
    icon: Icons.Repository,
    description: 'Achievements for creating and maintaining projects',
  },
  impact: {
    title: 'Community Impact',
    icon: Icons.Star,
    description: 'Recognition of your influence in the developer community',
  },
  specialty: {
    title: 'Specializations',
    icon: Icons.Specialty,
    description: 'Your areas of specialized expertise',
  },
};

// Custom hook to calculate badges
function useBadges(
  user: GithubUser,
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

    // Repository count badges
    if (repositories.length >= 1) {
      badges.push({
        id: 'repo-starter',
        name: 'Project Starter',
        description: 'Created your first GitHub repository',
        icon: Icons.Repository,
        tier: 'bronze',
        category: 'repositories',
        earned: true,
      });
    }

    if (repositories.length >= 5) {
      badges.push({
        id: 'repo-creator',
        name: 'Project Creator',
        description: 'Maintained 5+ GitHub repositories',
        icon: Icons.Repository,
        tier: 'silver',
        category: 'repositories',
        earned: true,
      });
    }

    if (repositories.length >= 15) {
      badges.push({
        id: 'repo-manager',
        name: 'Repository Manager',
        description: 'Managed an impressive collection of 15+ repositories',
        icon: Icons.Repository,
        tier: 'gold',
        category: 'repositories',
        earned: true,
      });
    }

    if (repositories.length >= 30) {
      badges.push({
        id: 'repo-guru',
        name: 'Repository Guru',
        description: 'Mastered the art of managing 30+ repositories',
        icon: Icons.Repository,
        tier: 'platinum',
        category: 'repositories',
        earned: true,
      });
    }

    // Contribution badges
    if (totalContributions >= 1) {
      badges.push({
        id: 'code-contributor',
        name: 'Code Contributor',
        description: 'Made your first contributions on GitHub',
        icon: Icons.Commit,
        tier: 'bronze',
        category: 'activity',
        earned: true,
      });
    }

    if (totalContributions >= 100) {
      badges.push({
        id: 'code-enthusiast',
        name: 'Code Enthusiast',
        description: 'Made 100+ contributions in the past year',
        icon: Icons.Commit,
        tier: 'silver',
        category: 'activity',
        earned: totalContributions >= 100,
      });
    }

    if (totalContributions >= 500) {
      badges.push({
        id: 'commit-machine',
        name: 'Commit Machine',
        description: 'Made 500+ contributions in the past year',
        icon: Icons.Commit,
        tier: 'gold',
        category: 'activity',
        earned: totalContributions >= 500,
      });
    }

    if (totalContributions >= 1000) {
      badges.push({
        id: 'commit-ninja',
        name: 'Commit Ninja',
        description: 'Made 1,000+ contributions in the past year',
        icon: Icons.Commit,
        tier: 'platinum',
        category: 'activity',
        earned: totalContributions >= 1000,
      });
    }

    // Language badges
    if (languages.size >= 1) {
      badges.push({
        id: 'code-writer',
        name: 'Code Writer',
        description: 'Wrote code in your first programming language',
        icon: Icons.Code,
        tier: 'bronze',
        category: 'languages',
        earned: true,
      });
    }

    if (languages.size >= 3) {
      badges.push({
        id: 'language-explorer',
        name: 'Language Explorer',
        description: 'Explored and used 3+ programming languages',
        icon: Icons.Code,
        tier: 'silver',
        category: 'languages',
        earned: languages.size >= 3,
      });
    }

    if (languages.size >= 6) {
      badges.push({
        id: 'polyglot-coder',
        name: 'Polyglot Programmer',
        description: 'Mastered 6+ different programming languages',
        icon: Icons.Code,
        tier: 'gold',
        category: 'languages',
        earned: languages.size >= 6,
      });
    }

    if (languages.size >= 10) {
      badges.push({
        id: 'language-master',
        name: 'Language Master',
        description: 'Achieved proficiency in 10+ programming languages',
        icon: Icons.Code,
        tier: 'platinum',
        category: 'languages',
        earned: languages.size >= 10,
      });
    }

    // Star badges
    if (totalStars >= 1) {
      badges.push({
        id: 'first-star',
        name: 'First Star',
        description: 'Someone starred one of your repositories',
        icon: Icons.Star,
        tier: 'bronze',
        category: 'impact',
        earned: true,
      });
    }

    if (totalStars >= 50) {
      badges.push({
        id: 'rising-star',
        name: 'Rising Star',
        description: 'Earned 50+ stars across your repositories',
        icon: Icons.Star,
        tier: 'silver',
        category: 'impact',
        earned: totalStars >= 50,
      });
    }

    if (totalStars >= 250) {
      badges.push({
        id: 'community-favorite',
        name: 'Community Favorite',
        description: 'Earned 250+ stars across your repositories',
        icon: Icons.Star,
        tier: 'gold',
        category: 'impact',
        earned: totalStars >= 250,
      });
    }

    if (totalStars >= 1000) {
      badges.push({
        id: 'open-source-hero',
        name: 'Open Source Hero',
        description: 'Earned 1,000+ stars for your valuable contributions',
        icon: Icons.Star,
        tier: 'platinum',
        category: 'impact',
        earned: totalStars >= 1000,
      });
    }

    // Activity badges
    if (recentActivity) {
      badges.push({
        id: 'active-developer',
        name: 'Active Developer',
        description: 'Showed coding activity within the last 30 days',
        icon: Icons.Activity,
        tier: 'silver',
        category: 'activity',
        earned: true,
      });
    }

    // Language specialty badges
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

// Badge component
function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <div
      className={`bg-l-bg-1 dark:bg-d-bg-1 border rounded-lg p-4 flex flex-col items-center text-center transition-all ${getBadgeBorderClass(
        badge.tier
      )} hover:shadow-md hover:scale-[1.02] transform-gpu ${
        badge.tier === 'silver'
          ? 'hover:shadow-[#8E8E93]/20'
          : badge.tier === 'platinum'
            ? 'hover:shadow-[#8A9BA8]/20'
            : ''
      }`}
    >
      <div className={`p-3 rounded-full mb-3 ${getBadgeBgClass(badge.tier)}`}>
        <badge.icon className="w-6 h-6" />
      </div>

      <h3 className="font-bold text-l-text-1 dark:text-d-text-1 mb-1">
        {badge.name}
      </h3>

      <p className="text-sm text-l-text-2 dark:text-d-text-2">
        {badge.description}
      </p>

      <div
        className={`mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeTierClass(badge.tier)}`}
      >
        {badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)}
      </div>
    </div>
  );
}

export default function DeveloperBadges({
  user,
  repositories,
  contributionData,
  loading,
}: DeveloperBadgesProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Move the hook call here before any conditional returns
  // This ensures hooks are always called in the same order
  const badges = useBadges(user, repositories, contributionData);

  if (loading) {
    return <DeveloperBadgesSkeleton />;
  }

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm">
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 flex items-center gap-2 mb-2">
          <Icons.Medal className="w-5 h-5 text-accent-1" />
          Developer Achievements
        </h2>
        <p className="text-l-text-2 dark:text-d-text-2">
          Repository data is needed to generate developer badges
        </p>
      </div>
    );
  }

  // Group badges by category
  const badgesByCategory = badges.reduce(
    (acc, badge) => {
      if (!acc[badge.category]) {
        acc[badge.category] = [];
      }
      acc[badge.category].push(badge);
      return acc;
    },
    {} as Record<string, Badge[]>
  );

  // Get all earned badges
  const earnedBadges = badges.filter(badge => badge.earned);

  // Filter badges by active category or show all if no category is selected
  const displayBadges = activeCategory
    ? badges.filter(badge => badge.category === activeCategory)
    : earnedBadges;

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm">
      {/* Improved Header Layout */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.Medal className="w-6 h-6 text-accent-1" />
            <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
              Developer Achievements
            </h2>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-l-text-3 dark:text-d-text-3 hover:text-accent-1 transition-colors ml-1 cursor-pointer"
              aria-label="Show badge information"
            >
              <Icons.Info className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-l-text-2 dark:text-d-text-2 flex items-center gap-2 bg-l-bg-1 dark:bg-d-bg-1 px-3 py-1 rounded-full">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent-1"></span>
              <span className="font-medium">{earnedBadges.length}</span>
            </span>
            badge{earnedBadges.length !== 1 ? 's' : ''} earned
          </div>
        </div>

        {showInfo && (
          <div className="mt-4 p-4 bg-l-bg-1 dark:bg-d-bg-1 rounded-lg text-sm text-l-text-2 dark:text-d-text-2 border border-border-l dark:border-border-d animate-fadeIn">
            <p className="flex items-start gap-2">
              <Icons.Info className="w-4 h-4 text-accent-1 mt-0.5 flex-shrink-0" />
              <span>
                Badges are awarded based on your GitHub activity and
                achievements. They come in four tiers: Bronze, Silver, Gold, and
                Platinum. Continue your open source journey to unlock more
                badges!
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Category filters with improved styling */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-l-text-2 dark:text-d-text-2 bg-l-bg-3/50 dark:bg-d-bg-3/50 px-2.5 py-1.5 rounded-md">
            <Icons.Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter Badges</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeCategory === null
                  ? 'bg-accent-1 text-white'
                  : 'bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
              }`}
            >
              All Earned ({earnedBadges.length})
            </button>

            {Object.entries(badgesByCategory).map(
              ([category, categoryBadges]) => {
                const earnedCount = categoryBadges.filter(b => b.earned).length;
                if (earnedCount === 0) return null;

                const CategoryIcon =
                  categoryInfo[category as keyof typeof categoryInfo]?.icon;

                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeCategory === category
                        ? 'bg-accent-1 text-white'
                        : 'bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
                    }`}
                  >
                    {CategoryIcon && <CategoryIcon className="w-4 h-4" />}
                    {categoryInfo[category as keyof typeof categoryInfo]
                      ?.title || category}{' '}
                    ({earnedCount})
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {displayBadges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayBadges.map(badge => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-l-bg-3/30 dark:bg-d-bg-3/30 rounded-lg border border-border-l dark:border-border-d">
          <div className="mb-4 inline-block p-4 rounded-full bg-l-bg-1 dark:bg-d-bg-1">
            <Icons.Trophy className="w-10 h-10 text-l-text-3 dark:text-d-text-3" />
          </div>
          <h3 className="text-lg font-semibold text-l-text-2 dark:text-d-text-2 mb-2">
            No badges found
          </h3>
          <p className="text-l-text-3 dark:text-d-text-3 max-w-md mx-auto">
            {activeCategory
              ? 'Try selecting a different category to see your achievements.'
              : 'Continue your coding journey to earn badges!'}
          </p>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="mt-4 text-accent-1 hover:underline flex items-center gap-1 mx-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              View all earned badges
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Helper functions for badge styling
function getBadgeBorderClass(tier: string): string {
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

function getBadgeBgClass(tier: string): string {
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

function getBadgeTierClass(tier: string): string {
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

// Improved skeleton loading state
function DeveloperBadgesSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-l-bg-3 dark:bg-d-bg-3"></div>
          <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>
        <div className="h-5 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
      </div>

      <div className="p-2 bg-l-bg-1 dark:bg-d-bg-1 rounded-lg border border-border-l dark:border-border-d mb-6">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="h-5 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-8 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
          <div className="h-8 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
          <div className="h-8 w-28 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-lg p-4 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-l-bg-3 dark:bg-d-bg-3 mb-3"></div>
              <div className="h-5 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
              <div className="h-3 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-1"></div>
              <div className="h-3 w-3/4 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
              <div className="h-4 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded-full mt-1"></div>
            </div>
          ))}
      </div>
    </div>
  );
}

// Export the badge calculation function so it can be reused in the battle component
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

  // Use the same function from the custom hook but call it directly
  const getIcon = (
    type: string
  ): React.ComponentType<{ className?: string }> => {
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
  };

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

  // Repository count badges
  if (repositories.length >= 1) {
    badges.push({
      id: 'repo-starter',
      name: 'Project Starter',
      description: 'Created your first GitHub repository',
      icon: getIcon('repository'),
      tier: 'bronze',
      category: 'repositories',
      earned: true,
    });
  }

  if (repositories.length >= 5) {
    badges.push({
      id: 'repo-creator',
      name: 'Project Creator',
      description: 'Maintained 5+ GitHub repositories',
      icon: getIcon('repository'),
      tier: 'silver',
      category: 'repositories',
      earned: true,
    });
  }

  if (repositories.length >= 15) {
    badges.push({
      id: 'repo-manager',
      name: 'Repository Manager',
      description: 'Managed an impressive collection of 15+ repositories',
      icon: getIcon('repository'),
      tier: 'gold',
      category: 'repositories',
      earned: true,
    });
  }

  if (repositories.length >= 30) {
    badges.push({
      id: 'repo-guru',
      name: 'Repository Guru',
      description: 'Mastered the art of managing 30+ repositories',
      icon: getIcon('repository'),
      tier: 'platinum',
      category: 'repositories',
      earned: true,
    });
  }

  // Contribution badges
  if (totalContributions >= 1) {
    badges.push({
      id: 'code-contributor',
      name: 'Code Contributor',
      description: 'Made your first contributions on GitHub',
      icon: getIcon('commit'),
      tier: 'bronze',
      category: 'activity',
      earned: true,
    });
  }

  if (totalContributions >= 100) {
    badges.push({
      id: 'code-enthusiast',
      name: 'Code Enthusiast',
      description: 'Made 100+ contributions in the past year',
      icon: getIcon('commit'),
      tier: 'silver',
      category: 'activity',
      earned: totalContributions >= 100,
    });
  }

  if (totalContributions >= 500) {
    badges.push({
      id: 'commit-machine',
      name: 'Commit Machine',
      description: 'Made 500+ contributions in the past year',
      icon: getIcon('commit'),
      tier: 'gold',
      category: 'activity',
      earned: totalContributions >= 500,
    });
  }

  if (totalContributions >= 1000) {
    badges.push({
      id: 'commit-ninja',
      name: 'Commit Ninja',
      description: 'Made 1,000+ contributions in the past year',
      icon: getIcon('commit'),
      tier: 'platinum',
      category: 'activity',
      earned: totalContributions >= 1000,
    });
  }

  // Language badges
  if (languages.size >= 1) {
    badges.push({
      id: 'code-writer',
      name: 'Code Writer',
      description: 'Wrote code in your first programming language',
      icon: getIcon('code'),
      tier: 'bronze',
      category: 'languages',
      earned: true,
    });
  }

  if (languages.size >= 3) {
    badges.push({
      id: 'language-explorer',
      name: 'Language Explorer',
      description: 'Explored and used 3+ programming languages',
      icon: getIcon('code'),
      tier: 'silver',
      category: 'languages',
      earned: languages.size >= 3,
    });
  }

  if (languages.size >= 6) {
    badges.push({
      id: 'polyglot-coder',
      name: 'Polyglot Programmer',
      description: 'Mastered 6+ different programming languages',
      icon: getIcon('code'),
      tier: 'gold',
      category: 'languages',
      earned: languages.size >= 6,
    });
  }

  if (languages.size >= 10) {
    badges.push({
      id: 'language-master',
      name: 'Language Master',
      description: 'Achieved proficiency in 10+ programming languages',
      icon: getIcon('code'),
      tier: 'platinum',
      category: 'languages',
      earned: languages.size >= 10,
    });
  }

  // Star badges
  if (totalStars >= 1) {
    badges.push({
      id: 'first-star',
      name: 'First Star',
      description: 'Someone starred one of your repositories',
      icon: getIcon('star'),
      tier: 'bronze',
      category: 'impact',
      earned: true,
    });
  }

  if (totalStars >= 50) {
    badges.push({
      id: 'rising-star',
      name: 'Rising Star',
      description: 'Earned 50+ stars across your repositories',
      icon: getIcon('star'),
      tier: 'silver',
      category: 'impact',
      earned: totalStars >= 50,
    });
  }

  if (totalStars >= 250) {
    badges.push({
      id: 'community-favorite',
      name: 'Community Favorite',
      description: 'Earned 250+ stars across your repositories',
      icon: getIcon('star'),
      tier: 'gold',
      category: 'impact',
      earned: totalStars >= 250,
    });
  }

  if (totalStars >= 1000) {
    badges.push({
      id: 'open-source-hero',
      name: 'Open Source Hero',
      description: 'Earned 1,000+ stars for your valuable contributions',
      icon: getIcon('star'),
      tier: 'platinum',
      category: 'impact',
      earned: totalStars >= 1000,
    });
  }

  // Activity badges
  if (recentActivity) {
    badges.push({
      id: 'active-developer',
      name: 'Active Developer',
      description: 'Showed coding activity within the last 30 days',
      icon: getIcon('activity'),
      tier: 'silver',
      category: 'activity',
      earned: true,
    });
  }

  // Language specialty badges
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
      icon: getIcon('specialty'),
      tier: tier,
      category: 'specialty',
      earned: true,
    });
  }

  return badges;
}
