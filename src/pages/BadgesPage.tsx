import { Link } from 'react-router-dom';
import { Icons } from '../components/shared/Icons';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function BadgesPage() {
  useDocumentTitle('Developer Badges');

  // Category configuration - matches the one in DeveloperBadges.tsx
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

  // Helper functions for badge styling
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

  function getBadgeBorderClass(tier: string): string {
    switch (tier) {
      case 'bronze':
        return 'border-[#CD7F32]';
      case 'silver':
        return 'border-[#8E8E93]';
      case 'gold':
        return 'border-[#FFD700]';
      case 'platinum':
        return 'border-[#8A9BA8]';
      default:
        return 'border-border-l dark:border-border-d';
    }
  }

  // All available badges extracted from DeveloperBadges.tsx
  const allBadges = [
    // Repository badges
    {
      id: 'repo-starter',
      name: 'Project Starter',
      description: 'Created your first GitHub repository',
      icon: Icons.Repository,
      tier: 'bronze',
      category: 'repositories',
      criteria: 'Have at least 1 repository',
    },
    {
      id: 'repo-creator',
      name: 'Project Creator',
      description: 'Maintained 5+ GitHub repositories',
      icon: Icons.Repository,
      tier: 'silver',
      category: 'repositories',
      criteria: 'Have at least 5 repositories',
    },
    {
      id: 'repo-manager',
      name: 'Repository Manager',
      description: 'Managed an impressive collection of 15+ repositories',
      icon: Icons.Repository,
      tier: 'gold',
      category: 'repositories',
      criteria: 'Have at least 15 repositories',
    },
    {
      id: 'repo-guru',
      name: 'Repository Guru',
      description: 'Mastered the art of managing 30+ repositories',
      icon: Icons.Repository,
      tier: 'platinum',
      category: 'repositories',
      criteria: 'Have at least 30 repositories',
    },

    // Activity badges
    {
      id: 'code-contributor',
      name: 'Code Contributor',
      description: 'Made your first contributions on GitHub',
      icon: Icons.Commit,
      tier: 'bronze',
      category: 'activity',
      criteria: 'Have at least 1 contribution',
    },
    {
      id: 'code-enthusiast',
      name: 'Code Enthusiast',
      description: 'Made 100+ contributions in the past year',
      icon: Icons.Commit,
      tier: 'silver',
      category: 'activity',
      criteria: 'Have at least 100 contributions in the past year',
    },
    {
      id: 'commit-machine',
      name: 'Commit Machine',
      description: 'Made 500+ contributions in the past year',
      icon: Icons.Commit,
      tier: 'gold',
      category: 'activity',
      criteria: 'Have at least 500 contributions in the past year',
    },
    {
      id: 'commit-ninja',
      name: 'Commit Ninja',
      description: 'Made 1,000+ contributions in the past year',
      icon: Icons.Commit,
      tier: 'platinum',
      category: 'activity',
      criteria: 'Have at least 1,000 contributions in the past year',
    },
    {
      id: 'active-developer',
      name: 'Active Developer',
      description: 'Showed coding activity within the last 30 days',
      icon: Icons.Activity,
      tier: 'silver',
      category: 'activity',
      criteria: 'Have repository updates within the last 30 days',
    },

    // Language badges
    {
      id: 'code-writer',
      name: 'Code Writer',
      description: 'Wrote code in your first programming language',
      icon: Icons.Code,
      tier: 'bronze',
      category: 'languages',
      criteria: 'Have at least 1 programming language',
    },
    {
      id: 'language-explorer',
      name: 'Language Explorer',
      description: 'Explored and used 3+ programming languages',
      icon: Icons.Code,
      tier: 'silver',
      category: 'languages',
      criteria: 'Have at least 3 different programming languages',
    },
    {
      id: 'polyglot-coder',
      name: 'Polyglot Programmer',
      description: 'Mastered 6+ different programming languages',
      icon: Icons.Code,
      tier: 'gold',
      category: 'languages',
      criteria: 'Have at least 6 different programming languages',
    },
    {
      id: 'language-master',
      name: 'Language Master',
      description: 'Achieved proficiency in 10+ programming languages',
      icon: Icons.Code,
      tier: 'platinum',
      category: 'languages',
      criteria: 'Have at least 10 different programming languages',
    },

    // Impact badges
    {
      id: 'first-star',
      name: 'First Star',
      description: 'Someone starred one of your repositories',
      icon: Icons.Star,
      tier: 'bronze',
      category: 'impact',
      criteria: 'Have at least 1 star across all repositories',
    },
    {
      id: 'rising-star',
      name: 'Rising Star',
      description: 'Earned 50+ stars across your repositories',
      icon: Icons.Star,
      tier: 'silver',
      category: 'impact',
      criteria: 'Have at least 50 stars across all repositories',
    },
    {
      id: 'community-favorite',
      name: 'Community Favorite',
      description: 'Earned 250+ stars across your repositories',
      icon: Icons.Star,
      tier: 'gold',
      category: 'impact',
      criteria: 'Have at least 250 stars across all repositories',
    },
    {
      id: 'open-source-hero',
      name: 'Open Source Hero',
      description: 'Earned 1,000+ stars for your valuable contributions',
      icon: Icons.Star,
      tier: 'platinum',
      category: 'impact',
      criteria: 'Have at least 1,000 stars across all repositories',
    },

    // Specialty badge example
    {
      id: 'language-specialist',
      name: 'Language Specialist',
      description: 'Created multiple repositories using a specific language',
      icon: Icons.Specialty,
      tier: 'varies',
      category: 'specialty',
      criteria:
        'Bronze: 3+ repos in language, Silver: 5+ repos, Gold: 10+ repos',
    },
  ];

  // Group badges by category
  const badgesByCategory = allBadges.reduce(
    (acc, badge) => {
      if (!acc[badge.category]) {
        acc[badge.category] = [];
      }
      acc[badge.category].push(badge);
      return acc;
    },
    {} as Record<string, typeof allBadges>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-l-text-1 dark:text-d-text-1 mb-2">
          Developer Badges
        </h1>
        <p className="text-l-text-2 dark:text-d-text-2 max-w-3xl">
          DevInsight awards badges based on your GitHub activity and
          achievements. Badges come in four tiers: Bronze, Silver, Gold, and
          Platinum. Continue your open source journey to unlock more badges!
        </p>
      </div>

      <div className="mb-10 bg-l-bg-1 dark:bg-d-bg-1 rounded-lg p-6 border border-border-l dark:border-border-d">
        <h2 className="text-xl font-semibold text-l-text-1 dark:text-d-text-1 mb-4">
          Badge Tiers
        </h2>
        <p className="text-l-text-2 dark:text-d-text-2 mb-6">
          Each badge represents a specific achievement and comes in different
          tiers that reflect the level of accomplishment.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-l-bg-2 dark:bg-d-bg-2 p-4 rounded-lg border-2 border-[#CD7F32]">
            <h3 className="font-medium text-[#CD7F32] mb-2 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#CD7F32]"></span>
              Bronze
            </h3>
            <p className="text-sm text-l-text-2 dark:text-d-text-2">
              Entry-level achievements that mark the beginning of your journey.
            </p>
          </div>

          <div className="bg-l-bg-2 dark:bg-d-bg-2 p-4 rounded-lg border-2 border-[#8E8E93]">
            <h3 className="font-medium text-[#8E8E93] dark:text-[#C8C8C8] mb-2 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#8E8E93] dark:bg-[#C8C8C8]"></span>
              Silver
            </h3>
            <p className="text-sm text-l-text-2 dark:text-d-text-2">
              Intermediate accomplishments that demonstrate growing expertise.
            </p>
          </div>

          <div className="bg-l-bg-2 dark:bg-d-bg-2 p-4 rounded-lg border-2 border-[#FFD700]">
            <h3 className="font-medium text-[#FFD700] mb-2 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FFD700]"></span>
              Gold
            </h3>
            <p className="text-sm text-l-text-2 dark:text-d-text-2">
              Advanced achievements that showcase significant experience and
              skill.
            </p>
          </div>

          <div className="bg-l-bg-2 dark:bg-d-bg-2 p-4 rounded-lg border-2 border-[#8A9BA8]">
            <h3 className="font-medium text-[#8A9BA8] dark:text-[#B8C5D0] mb-2 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#8A9BA8] dark:bg-[#B8C5D0]"></span>
              Platinum
            </h3>
            <p className="text-sm text-l-text-2 dark:text-d-text-2">
              Elite accomplishments that represent mastery and exceptional
              contributions.
            </p>
          </div>
        </div>
      </div>

      {/* Show badges by category */}
      {Object.entries(badgesByCategory).map(([category, badges]) => (
        <div key={category} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            {(() => {
              const IconComponent =
                categoryInfo[category as keyof typeof categoryInfo]?.icon;
              return IconComponent ? (
                <IconComponent className="w-6 h-6 text-accent-1" />
              ) : null;
            })()}
            <h2 className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              {categoryInfo[category as keyof typeof categoryInfo]?.title ||
                category}
            </h2>
          </div>

          <p className="text-l-text-2 dark:text-d-text-2 mb-6">
            {categoryInfo[category as keyof typeof categoryInfo]?.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`bg-l-bg-1 dark:bg-d-bg-1 border-2 ${getBadgeBorderClass(
                  badge.tier
                )} rounded-lg p-5 transition-all hover:shadow-md`}
              >
                <div className="flex flex-col items-center mb-4">
                  <div
                    className={`p-3 rounded-full mb-3 ${getBadgeBgClass(badge.tier)}`}
                  >
                    <badge.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-l-text-1 dark:text-d-text-1 text-lg text-center">
                    {badge.name}
                  </h3>
                  <div
                    className={`mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeTierClass(
                      badge.tier
                    )}`}
                  >
                    {badge.tier === 'varies'
                      ? 'Multiple Tiers'
                      : badge.tier.charAt(0).toUpperCase() +
                        badge.tier.slice(1)}
                  </div>
                </div>

                <p className="text-l-text-2 dark:text-d-text-2 text-sm text-center mb-4">
                  {badge.description}
                </p>

                <div className="mt-auto">
                  <h4 className="text-xs font-semibold text-l-text-1 dark:text-d-text-1 uppercase tracking-wider mb-1 text-center">
                    How to Earn
                  </h4>
                  <p className="text-xs text-l-text-3 dark:text-d-text-3 text-center">
                    {badge.criteria}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 p-6 bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border border-dashed border-border-l dark:border-border-d text-center">
        <h3 className="text-xl font-semibold text-l-text-1 dark:text-d-text-1 mb-2">
          Want to earn your Developer Badges?
        </h3>
        <p className="text-l-text-2 dark:text-d-text-2 mb-4">
          Enter your GitHub username to see which badges you&apos;ve already
          earned and which ones you&apos;re close to unlocking.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-accent-1 text-white rounded-lg hover:bg-accent-1/90 transition-colors"
        >
          Search GitHub Profile
        </Link>
      </div>
    </div>
  );
}
