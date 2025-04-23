import { useState } from 'react';
import { ContributionData } from '../services/githubGraphQLService';
import { Icons } from './shared/Icons';
import { Link } from 'react-router-dom';
import SectionHeader from './shared/SectionHeader';
import FilterTabs, { FilterTab } from './shared/FilterTabs';
import {
  useBadges,
  Badge,
  getBadgeBorderClass,
  getBadgeBgClass,
  getBadgeTierClass,
} from '../hooks/useBadgeFunctions';
import DeveloperBadgesSkeleton from './shared/Skeletons/DeveloperBadgesSkeleton';

interface DeveloperBadgesProps {
  user: GithubUser;
  repositories: Repository[] | undefined;
  contributionData?: ContributionData;
  loading: boolean;
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

  // Use the extracted hook
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
    ? badges.filter(badge => badge.category === activeCategory && badge.earned)
    : earnedBadges;

  // Create filter tabs for categories with earned badges
  const filterTabs: FilterTab[] = [
    {
      id: null,
      label: `All Earned (${earnedBadges.length})`,
      active: activeCategory === null,
      icon: Icons.Medal,
      onClick: () => setActiveCategory(null),
    },
    ...Object.entries(badgesByCategory)
      .filter(([, categoryBadges]) => categoryBadges.some(b => b.earned))
      .map(([category, categoryBadges]) => {
        const earnedCount = categoryBadges.filter(b => b.earned).length;
        return {
          id: category,
          label: `${categoryInfo[category as keyof typeof categoryInfo]?.title || category} (${earnedCount})`,
          icon: categoryInfo[category as keyof typeof categoryInfo]?.icon,
          active: activeCategory === category,
          onClick: () => setActiveCategory(category),
        };
      }),
  ];

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm">
      <SectionHeader
        title="Developer Badges"
        icon={Icons.Medal}
        subtitle="Showcase your GitHub development milestones and accomplishments"
        infoTooltip="Badges are awarded based on your GitHub activity and achievements. They come in four tiers: Bronze, Silver, Gold, and Platinum. Continue your open source journey to unlock more badges!"
        rightControls={
          <div className="flex items-center gap-2">
            <Link
              to="/badges"
              className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 group rounded-md relative overflow-hidden border border-accent-1/50"
              aria-label="View all badges"
            >
              <span className="absolute inset-0 bg-accent-1 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <Icons.Medal className="w-4 h-4 text-accent-1 z-10 group-hover:text-l-text-inv dark:group-hover:text-d-text-inv transition-colors duration-200" />
              <span className="text-xs font-medium z-10 text-l-text-2 dark:text-d-text-2 group-hover:text-l-text-inv dark:group-hover:text-d-text-inv transition-colors duration-200">
                See all badges
              </span>
            </Link>
            <div className="text-sm text-l-text-2 dark:text-d-text-2 flex items-center gap-2 bg-l-bg-1 dark:bg-d-bg-1 px-3 py-1 rounded-full">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent-1"></span>
                <span className="font-medium">{earnedBadges.length}</span>
                <span className="text-l-text-3 dark:text-d-text-3">/</span>
                <span className="text-l-text-3 dark:text-d-text-3">
                  {badges.length}
                </span>
              </span>
              badges earned
            </div>
          </div>
        }
      />

      <FilterTabs tabs={filterTabs} activeTabId={activeCategory} />

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

// Export the badge calculation function from the hook file
export { calculateBadges } from '../hooks/useBadgeFunctions';
