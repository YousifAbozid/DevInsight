import { JSX, useState } from 'react';
import { ContributionData } from '../services/githubGraphQLService';

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
  icon: JSX.Element;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'activity' | 'languages' | 'repositories' | 'impact' | 'specialty';
  earned: boolean;
}

export default function DeveloperBadges({
  user,
  repositories,
  contributionData,
  loading,
}: DeveloperBadgesProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (loading) {
    return <DeveloperBadgesSkeleton />;
  }

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-2">
          Developer Achievements
        </h2>
        <p className="text-l-text-2 dark:text-d-text-2">
          Repository data is needed to generate developer badges
        </p>
      </div>
    );
  }

  // Calculate the badges based on user data
  const badges = calculateBadges(user, repositories, contributionData);

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

  // Category titles
  const categoryTitles: Record<string, string> = {
    activity: 'Commit Activity',
    languages: 'Language Mastery',
    repositories: 'Repository Management',
    impact: 'Community Impact',
    specialty: 'Specializations',
  };

  // Get all earned badges
  const earnedBadges = badges.filter(badge => badge.earned);

  // Filter badges by active category or show all if no category is selected
  const displayBadges = activeCategory
    ? badges.filter(badge => badge.category === activeCategory)
    : earnedBadges;

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
          Developer Achievements
        </h2>

        <div className="text-sm text-l-text-2 dark:text-d-text-2">
          {earnedBadges.length} badge{earnedBadges.length !== 1 ? 's' : ''}{' '}
          earned
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <span className="text-sm text-l-text-3 dark:text-d-text-3">
          Filter:
        </span>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            activeCategory === null
              ? 'bg-accent-1 text-white'
              : 'bg-l-bg-3 dark:bg-d-bg-3 text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
          }`}
          onClick={() => setActiveCategory(null)}
        >
          All Earned
        </button>

        {Object.keys(badgesByCategory).map(category => (
          <button
            key={category}
            className={`px-3 py-1 text-sm rounded-full ${
              activeCategory === category
                ? 'bg-accent-1 text-white'
                : 'bg-l-bg-3 dark:bg-d-bg-3 text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {categoryTitles[category]}
          </button>
        ))}
      </div>

      {displayBadges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayBadges.map(badge => (
            <div
              key={badge.id}
              className={`bg-l-bg-1 dark:bg-d-bg-1 border rounded-lg p-4 flex flex-col items-center text-center transition-all ${getBadgeBorderClass(
                badge.tier
              )}`}
            >
              <div
                className={`p-3 rounded-full mb-3 ${getBadgeBgClass(badge.tier)}`}
              >
                {badge.icon}
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
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-l-bg-3/30 dark:bg-d-bg-3/30 rounded-lg">
          <p className="text-l-text-3 dark:text-d-text-3">
            No badges found for the selected category
          </p>
        </div>
      )}
    </div>
  );
}

// Export the badge calculation function so it can be reused in the battle component
export function calculateBadges(
  _: GithubUser,
  repositories: Repository[],
  contributionData?: ContributionData
): Badge[] {
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

// Helper function to get icon for a badge
function getIcon(type: string): JSX.Element {
  switch (type) {
    case 'repository':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M3 3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3v-2h3V3H5v14h3v2H5a2 2 0 0 1-2-2V3Z" />
          <path d="M12.293 7.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L15.586 12l-3.293-3.293a1 1 0 0 1 0-1.414Z" />
          <path d="M6.293 7.293a1 1 0 0 1 1.414 0L12 11.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414Z" />
        </svg>
      );
    case 'commit':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M12 2c-2.4 0-4.7.9-6.5 2.4a10.5 10.5 0 0 0-2 13.1A10 10 0 0 0 8.7 22c1 .7 2.2 1.2 3.3 1.4.5.1 1 .2 1.5.2.5 0 1-.1 1.4-.2 1.2-.2 2.3-.7 3.4-1.4a10 10 0 0 0 5.2-8.5c0-5.6-4.5-10.1-10-10.1h-1.5zm-.5 3h1c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7c0-3.9 3.1-7 7-7z"
            clipRule="evenodd"
          />
          <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
      );
    case 'code':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M14.447 3.027a.75.75 0 0 1 .527.92l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.526ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'star':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'activity':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'specialty':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75h3a.75.75 0 0 1 0 1.5h-3.75a.75.75 0 0 1-.75-.75V9a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.177A7.547 7.547 0 0 1 6.648 6.61a.75.75 0 0 0-1.152-.082A9 9 0 1 0 21.75 12c0-4.347-3.055-7.985-7.166-8.83l1.123-2.117a.75.75 0 0 0-.744-1.114l-4.854.703a.75.75 0 0 0-.583.937l1.572 5.572a.75.75 0 0 0 1.438-.404L12.963 2.286Z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
}

// Helper functions for badge styling
function getBadgeBorderClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'border-[#CD7F32]';
    case 'silver':
      return 'border-[#C0C0C0]';
    case 'gold':
      return 'border-[#FFD700]';
    case 'platinum':
      return 'border-[#E5E4E2]';
    default:
      return 'border-border-l dark:border-border-d';
  }
}

function getBadgeBgClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'bg-[#CD7F32]/10 text-[#CD7F32]';
    case 'silver':
      return 'bg-[#C0C0C0]/10 text-[#C0C0C0]';
    case 'gold':
      return 'bg-[#FFD700]/10 text-[#FFD700]';
    case 'platinum':
      return 'bg-[#E5E4E2]/10 text-[#E5E4E2]';
    default:
      return 'bg-l-bg-3 dark:bg-d-bg-3';
  }
}

function getBadgeTierClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'bg-[#CD7F32]/20 text-[#CD7F32]';
    case 'silver':
      return 'bg-[#C0C0C0]/20 text-[#C0C0C0]';
    case 'gold':
      return 'bg-[#FFD700]/20 text-[#FFD700]';
    case 'platinum':
      return 'bg-[#E5E4E2]/20 text-[#E5E4E2]';
    default:
      return 'bg-l-bg-3 dark:bg-d-bg-3';
  }
}

function DeveloperBadgesSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        <div className="h-4 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
      </div>

      <div className="flex gap-2 mb-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"
            ></div>
          ))}
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
