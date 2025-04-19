import { useState, useMemo } from 'react';
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
  icon: React.FC<{ className?: string }>;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'activity' | 'languages' | 'repositories' | 'impact' | 'specialty';
  earned: boolean;
}

// Icons organized in a single object for better maintenance
const Icons = {
  Repository: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M3 3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3v-2h3V3H5v14h3v2H5a2 2 0 0 1-2-2V3Z" />
      <path d="M12.293 7.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L15.586 12l-3.293-3.293a1 1 0 0 1 0-1.414Z" />
      <path d="M6.293 7.293a1 1 0 0 1 1.414 0L12 11.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414Z" />
    </svg>
  ),
  Commit: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12 2c-2.4 0-4.7.9-6.5 2.4a10.5 10.5 0 0 0-2 13.1A10 10 0 0 0 8.7 22c1 .7 2.2 1.2 3.3 1.4.5.1 1 .2 1.5.2.5 0 1-.1 1.4-.2 1.2-.2 2.3-.7 3.4-1.4a10 10 0 0 0 5.2-8.5c0-5.6-4.5-10.1-10-10.1h-1.5zm-.5 3h1c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7c0-3.9 3.1-7 7-7z"
        clipRule="evenodd"
      />
      <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  ),
  Code: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M14.447 3.027a.75.75 0 0 1 .527.92l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.526ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Star: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Activity: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
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
  ),
  Specialty: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75h3a.75.75 0 0 1 0 1.5h-3.75a.75.75 0 0 1-.75-.75V9a.75.75 0 0 1 .75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Trophy: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Filter: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  ),
  Medal: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
      <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
      <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
    </svg>
  ),
};

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
      )} hover:shadow-md hover:scale-[1.02] transform-gpu`}
    >
      <div className={`p-3 rounded-full mb-3 ${getBadgeBgClass(badge.tier)}`}>
        <badge.icon />
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

  // Use the custom hook to get badges
  const badges = useBadges(user, repositories, contributionData);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 flex items-center gap-2">
          <Icons.Medal className="w-5 h-5 text-accent-1" />
          Developer Achievements
        </h2>

        <div className="text-sm text-l-text-2 dark:text-d-text-2 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent-1"></span>
            {earnedBadges.length}
          </span>
          badge{earnedBadges.length !== 1 ? 's' : ''} earned
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="bg-l-bg-3 dark:bg-d-bg-3 text-l-text-2 dark:text-d-text-2 rounded-full p-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors cursor-pointer"
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
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="mb-4 p-3 bg-l-bg-3/40 dark:bg-d-bg-3/40 rounded-lg text-sm text-l-text-2 dark:text-d-text-2 animate-fadeIn">
          <p>
            Badges are awarded based on your GitHub activity and achievements.
            They come in four tiers: Bronze, Silver, Gold, and Platinum.
            Continue your open source journey to unlock more badges!
          </p>
        </div>
      )}

      {/* Category filters with style matching DevJourneyTimeline */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-l-text-2 dark:text-d-text-2">
          <Icons.Filter className="w-4 h-4" />
          <span className="text-sm">Filter:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-2.5 py-1 text-xs rounded-full flex items-center gap-1.5 transition-colors ${
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

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-2.5 py-1 text-xs rounded-full flex items-center gap-1.5 transition-colors ${
                    activeCategory === category
                      ? 'bg-accent-1 text-white'
                      : 'bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
                  }`}
                >
                  {categoryInfo[category as keyof typeof categoryInfo]?.icon({
                    className: 'w-3.5 h-3.5',
                  })}
                  {categoryInfo[category as keyof typeof categoryInfo]?.title ||
                    category}{' '}
                  ({earnedCount})
                </button>
              );
            }
          )}
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
  repositories: Repository[],
  contributionData?: ContributionData
): Badge[] {
  // Use the same function from the custom hook but call it directly
  const getIcon = (type: string): React.FC<{ className?: string }> => {
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
