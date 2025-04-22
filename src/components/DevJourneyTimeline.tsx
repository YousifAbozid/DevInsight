import { useState, useMemo } from 'react';
import { ContributionData } from '../services/githubGraphQLService';
import { Icons } from './shared/Icons';
import SectionHeader from './shared/SectionHeader';

interface DevJourneyTimelineProps {
  user: GithubUser;
  repositories?: Repository[];
  contributionData?: ContributionData;
  loading: boolean;
}

interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  type: 'repo' | 'star' | 'follower' | 'streak' | 'anniversary' | 'milestone';
  highlight?: boolean;
  metadata?: {
    repoId?: number;
    repoName?: string;
    language?: string;
    languageColor?: string;
    stars?: number;
  };
}

// Custom hook for generating timeline events
function useTimelineEvents(
  user: GithubUser,
  repositories: Repository[],
  contributionData?: ContributionData
): TimelineEvent[] {
  return useMemo(() => {
    const events: TimelineEvent[] = [];

    if (!repositories.length) return events;

    // Sort repositories by creation date
    const sortedRepos = [...repositories].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // First repository created
    if (sortedRepos.length > 0) {
      const firstRepo = sortedRepos[0];
      events.push({
        id: `first-repo-${firstRepo.id}`,
        date: new Date(firstRepo.created_at),
        title: 'First Repository Created',
        description: `Started your GitHub journey with "${firstRepo.name}"! ${
          firstRepo.description
            ? `"${firstRepo.description.substring(0, 80)}${firstRepo.description.length > 80 ? '...' : ''}"`
            : ''
        }`,
        icon: Icons.Repo,
        type: 'repo',
        highlight: true,
        metadata: {
          repoId: firstRepo.id,
          repoName: firstRepo.name,
          language: firstRepo.language || undefined,
          languageColor: getLanguageColor(firstRepo.language),
        },
      });
    }

    // Account created milestone
    events.push({
      id: 'account-created',
      date: new Date(user.created_at),
      title: 'Joined GitHub',
      description: `${user.name || user.login} started their GitHub journey! ${getAccountAgeDescription(user.created_at)}`,
      icon: Icons.Calendar,
      type: 'anniversary',
      highlight: true,
    });

    // Most starred repository
    if (sortedRepos.length > 0) {
      const mostStarredRepo = [...sortedRepos].sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      )[0];

      if (mostStarredRepo.stargazers_count > 0) {
        events.push({
          id: `most-starred-${mostStarredRepo.id}`,
          date: new Date(mostStarredRepo.created_at),
          title: 'Most Popular Repository',
          description: `"${mostStarredRepo.name}" is your most starred project with ${mostStarredRepo.stargazers_count} ${mostStarredRepo.stargazers_count === 1 ? 'star' : 'stars'}!`,
          icon: Icons.Star,
          type: 'star',
          highlight: true,
          metadata: {
            repoId: mostStarredRepo.id,
            repoName: mostStarredRepo.name,
            stars: mostStarredRepo.stargazers_count,
          },
        });
      }
    }

    // Significant repository milestones (non-fork repos with stars)
    sortedRepos
      .filter(repo => !repo.fork && repo.stargazers_count > 0)
      .filter(repo => repo.stargazers_count >= 5) // Only significant star counts
      .forEach(repo => {
        if (
          events.findIndex(
            e => e.type === 'star' && e.metadata?.repoId === repo.id
          ) === -1
        ) {
          events.push({
            id: `starred-repo-${repo.id}`,
            date: new Date(repo.created_at),
            title: `Popular Repository`,
            description: `"${repo.name}" has gained ${repo.stargazers_count} ${repo.stargazers_count === 1 ? 'star' : 'stars'}!`,
            icon: Icons.Star,
            type: 'star',
            highlight: repo.stargazers_count >= 10,
            metadata: {
              repoId: repo.id,
              repoName: repo.name,
              stars: repo.stargazers_count,
            },
          });
        }
      });

    // Language milestones - first use of top languages
    const languages = new Set<string>();
    sortedRepos.forEach(repo => {
      if (repo.language && !languages.has(repo.language)) {
        languages.add(repo.language);
        events.push({
          id: `first-${repo.language}-${repo.id}`,
          date: new Date(repo.created_at),
          title: `First ${repo.language} Project`,
          description: `Started coding in ${repo.language} with "${repo.name}"!`,
          icon: Icons.Code,
          type: 'milestone',
          highlight: false,
          metadata: {
            language: repo.language,
            languageColor: getLanguageColor(repo.language),
          },
        });
      }
    });

    // Repository count milestone events
    const repoMilestones = [5, 10, 25, 50, 100];

    sortedRepos.forEach((repo, index) => {
      const repoCount = index + 1;
      if (repoMilestones.includes(repoCount)) {
        events.push({
          id: `repo-milestone-${repoCount}`,
          date: new Date(repo.created_at),
          title: `${repoCount} Repositories Created`,
          description: `You've created ${repoCount} repositories on GitHub! "${repo.name}" marks this milestone.`,
          icon: Icons.Folder,
          type: 'milestone',
          highlight: repoCount >= 10,
        });
      }
    });

    // Contribution streak milestones using contributionData
    if (contributionData) {
      try {
        // Calculate longest streak
        let currentStreak = 0;
        let longestStreak = 0;
        let longestStreakStart: string | null = null;
        let longestStreakEnd: string | null = null;
        let inStreak = false;

        // Get all contribution days sorted by date
        const allContributionDays = contributionData.weeks
          .flatMap(week => week.contributionDays)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        // Find longest streak
        for (let i = 0; i < allContributionDays.length; i++) {
          const day = allContributionDays[i];
          if (day.contributionCount > 0) {
            if (!inStreak) {
              inStreak = true;
              currentStreak = 1;
              if (longestStreakStart === null) {
                longestStreakStart = day.date;
              }
            } else {
              currentStreak++;
            }

            if (currentStreak > longestStreak) {
              longestStreak = currentStreak;
              longestStreakStart =
                allContributionDays[i - currentStreak + 1].date;
              longestStreakEnd = day.date;
            }
          } else {
            inStreak = false;
            if (currentStreak > 3) {
              // Only record streaks longer than 3 days
              const streakStart = allContributionDays[i - currentStreak].date;
              const streakEnd = allContributionDays[i - 1].date;

              events.push({
                id: `streak-${streakStart}-${streakEnd}`,
                date: new Date(streakEnd),
                title: `${currentStreak}-Day Contribution Streak`,
                description: `You maintained a ${currentStreak}-day streak of activity from ${formatDate(new Date(streakStart))} to ${formatDate(new Date(streakEnd))}!`,
                icon: Icons.Fire,
                type: 'streak',
                highlight: currentStreak >= 7, // Highlight week-long or longer streaks
              });
            }
            currentStreak = 0;
          }
        }

        // Add longest streak if found
        if (longestStreakStart && longestStreakEnd && longestStreak >= 5) {
          events.push({
            id: `longest-streak-${longestStreak}`,
            date: new Date(longestStreakEnd),
            title: `Longest Contribution Streak: ${longestStreak} Days!`,
            description: `Your longest contribution streak lasted from ${formatDate(new Date(longestStreakStart))} to ${formatDate(new Date(longestStreakEnd))}. Great dedication!`,
            icon: Icons.Fire,
            type: 'streak',
            highlight: true,
          });
        }
      } catch (error) {
        console.error('Error calculating streaks:', error);
      }
    }

    // GitHub anniversaries (yearly)
    const accountCreationDate = new Date(user.created_at);
    const now = new Date();
    const accountAgeInYears = Math.floor(
      (now.getTime() - accountCreationDate.getTime()) /
        (1000 * 60 * 60 * 24 * 365)
    );

    // Add anniversaries for completed years (not the current partial year)
    for (let year = 1; year <= accountAgeInYears; year++) {
      const anniversaryDate = new Date(accountCreationDate);
      anniversaryDate.setFullYear(accountCreationDate.getFullYear() + year);

      // Skip future anniversaries
      if (anniversaryDate > now) continue;

      events.push({
        id: `github-anniversary-${year}`,
        date: anniversaryDate,
        title: `${year}-Year GitHub Anniversary`,
        description: `Celebrating ${year} ${year === 1 ? 'year' : 'years'} as a GitHub developer! You've come a long way since ${formatDate(accountCreationDate)}.`,
        icon: Icons.Cake,
        type: 'anniversary',
        highlight: year % 5 === 0 || year === 1, // Highlight 1st, 5th, 10th, etc.
      });
    }

    // Follower milestones
    if (user.followers > 0) {
      // Simulate when follower milestones might have been reached
      // For this example, we'll assign them to repository creation dates as estimates
      const followerMilestones = [1, 10, 50, 100, 500, 1000];
      const applicableMilestones = followerMilestones.filter(
        m => m <= user.followers
      );

      if (applicableMilestones.length > 0) {
        // Estimate dates based on repository creation timeline
        const timespan = now.getTime() - accountCreationDate.getTime();

        applicableMilestones.forEach(milestone => {
          // Estimate when this milestone was reached (distributed proportionally)
          const timeOffset = (milestone / user.followers) * timespan;
          const estimatedDate = new Date(
            accountCreationDate.getTime() + timeOffset
          );

          // Cap to current date
          const milestoneDate = estimatedDate > now ? now : estimatedDate;

          events.push({
            id: `follower-milestone-${milestone}`,
            date: milestoneDate,
            title: `${milestone} GitHub Followers`,
            description: `You've reached ${milestone} followers on GitHub! Your work is gaining recognition.`,
            icon: Icons.Users,
            type: 'follower',
            highlight: milestone >= 50,
          });
        });
      }
    }

    return events;
  }, [user, repositories, contributionData]);
}

// Category configuration for timeline events
const eventTypeInfo = {
  all: {
    title: 'All Events',
    icon: Icons.Calendar,
    description: 'View your complete GitHub journey',
  },
  repo: {
    title: 'Repository Events',
    icon: Icons.Repo,
    description: 'Events related to your GitHub repositories',
  },
  star: {
    title: 'Star Achievements',
    icon: Icons.Star,
    description: 'Recognition from the GitHub community',
  },
  follower: {
    title: 'Follower Milestones',
    icon: Icons.Users,
    description: 'Growth of your GitHub following',
  },
  streak: {
    title: 'Contribution Streaks',
    icon: Icons.Fire,
    description: 'Periods of consistent activity on GitHub',
  },
  anniversary: {
    title: 'GitHub Anniversaries',
    icon: Icons.Cake,
    description: 'Celebrating your time on GitHub',
  },
  milestone: {
    title: 'Career Milestones',
    icon: Icons.Trophy,
    description: 'Significant achievements in your developer journey',
  },
};

// Helper function for rendering individual timeline events
function TimelineEventItem({ event }: { event: TimelineEvent }) {
  return (
    <div className="ml-12 relative group">
      {/* Timeline dot and icon */}
      <div
        className={`absolute -left-12 p-2 rounded-full flex items-center justify-center
          ${
            event.highlight
              ? 'bg-accent-1 text-white shadow-md shadow-accent-1/20'
              : 'bg-l-bg-3 dark:bg-d-bg-3 text-l-text-1 dark:text-d-text-1'
          } transition-all duration-300 group-hover:scale-110`}
      >
        <event.icon className="w-4 h-4" />
      </div>

      {/* Event content */}
      <div
        className={`p-4 rounded-lg border shadow-sm
        ${
          event.highlight
            ? 'bg-accent-1/10 border-accent-1/30 hover:bg-accent-1/15'
            : 'bg-l-bg-1 dark:bg-d-bg-1 border-border-l dark:border-border-d hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
        } transition-all duration-200`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="font-medium text-l-text-1 dark:text-d-text-1">
            {event.title}
          </h3>
          <span className="text-xs text-l-text-3 dark:text-d-text-3">
            {formatDate(event.date)}
          </span>
        </div>
        <p className="text-sm mt-1 text-l-text-2 dark:text-d-text-2">
          {event.description}
        </p>

        {/* Display additional metadata based on event type */}
        {event.type === 'repo' && event.metadata?.language && (
          <div className="mt-2 flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: event.metadata.languageColor || '#ddd',
              }}
            ></div>
            <span className="text-xs text-l-text-3 dark:text-d-text-3">
              {event.metadata.language}
            </span>
          </div>
        )}

        {event.type === 'star' && (
          <div className="mt-2 flex items-center gap-1">
            <Icons.Star className="w-3 h-3 text-accent-warning" />
            <span className="text-xs text-l-text-3 dark:text-d-text-3">
              {event.metadata?.stars}{' '}
              {event.metadata?.stars === 1 ? 'star' : 'stars'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component
export default function DevJourneyTimeline({
  user,
  repositories = [],
  contributionData,
  loading,
}: DevJourneyTimelineProps) {
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
  const [filter, setFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<boolean>(false);

  // Move the hook call here before any conditional returns
  // This ensures hooks are always called in the same order
  const timelineEvents = useTimelineEvents(
    user,
    repositories,
    contributionData
  );

  if (loading) {
    return <DevJourneyTimelineSkeleton />;
  }

  if (!repositories || repositories.length === 0) {
    return null;
  }

  // Sort events by date (newest first)
  const sortedEvents = [...timelineEvents].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Filter events by type if filter is set
  const filteredEvents =
    filter === 'all'
      ? sortedEvents
      : sortedEvents.filter(event => event.type === filter);

  // For compact mode, limit to most important events or based on filter
  let displayEvents =
    viewMode === 'compact'
      ? filteredEvents.filter(event => event.highlight).slice(0, 5)
      : filteredEvents;

  // If expanded is false, limit to first 5 events
  if (!expanded && viewMode === 'detailed' && displayEvents.length > 5) {
    displayEvents = displayEvents.slice(0, 5);
  }

  // Count events by type for filter badges
  const eventCounts = sortedEvents.reduce(
    (counts, event) => {
      counts[event.type] = (counts[event.type] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );

  // Get unique event types for filter options
  const eventTypes = Object.keys(eventCounts);

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm">
      <SectionHeader
        title="Developer Journey Timeline"
        subtitle="Your GitHub story, from first commit to latest achievements"
        icon={Icons.Calendar}
        infoTooltip="The Developer Journey Timeline visualizes your GitHub milestones and achievements chronologically. It shows repository creations, contribution streaks, follower milestones, and important events from your developer career."
        rightControls={
          <div className="flex items-center p-1 bg-l-bg-1 dark:bg-d-bg-1 rounded-full border border-border-l dark:border-border-d">
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                viewMode === 'compact'
                  ? 'bg-accent-1 text-white shadow-sm'
                  : 'bg-transparent text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
              }`}
            >
              Highlights
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                viewMode === 'detailed'
                  ? 'bg-accent-1 text-white shadow-sm'
                  : 'bg-transparent text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
              }`}
            >
              Full Journey
            </button>
          </div>
        }
      />

      {/* Filter tabs with improved styling matching DeveloperBadges component */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-l-text-2 dark:text-d-text-2 bg-l-bg-3/50 dark:bg-d-bg-3/50 px-2.5 py-1.5 rounded-md">
            <Icons.Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter Timeline</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-accent-1 text-white'
                  : 'bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
              }`}
            >
              {eventTypeInfo.all.icon && (
                <eventTypeInfo.all.icon className="w-4 h-4" />
              )}
              All Events ({sortedEvents.length})
            </button>

            {eventTypes.map(type => {
              const EventIcon =
                eventTypeInfo[type as keyof typeof eventTypeInfo]?.icon;
              const eventTitle =
                eventTypeInfo[type as keyof typeof eventTypeInfo]?.title ||
                type;

              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                    filter === type
                      ? 'bg-accent-1 text-white'
                      : 'bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
                  }`}
                >
                  {EventIcon && <EventIcon className="w-4 h-4" />}
                  {eventTitle} ({eventCounts[type]})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline container */}
      <div className="relative">
        {/* Vertical line with gradient effect */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-1/50 via-border-l dark:via-border-d to-border-l dark:to-border-d"></div>

        {/* Timeline events */}
        <div className="space-y-6">
          {displayEvents.length > 0 ? (
            <>
              {displayEvents.map(event => (
                <TimelineEventItem key={event.id} event={event} />
              ))}

              {/* Show more/less button for detailed view */}
              {viewMode === 'detailed' && filteredEvents.length > 5 && (
                <div className="ml-12 mt-4">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full py-2 px-4 text-sm border border-border-l dark:border-border-d rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Icons.ChevronDown
                      className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    />
                    {expanded
                      ? 'Show fewer events'
                      : `Show ${filteredEvents.length - 5} more events`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-l-text-3 dark:text-d-text-3">
                No timeline events to display
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-2 text-accent-1 hover:underline text-sm"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getAccountAgeDescription(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const years = now.getFullYear() - created.getFullYear();
  const months = now.getMonth() - created.getMonth();

  let age = '';

  if (years > 0) {
    age = `${years} ${years === 1 ? 'year' : 'years'}`;
    if (months > 0 && years < 5) {
      // Only show months for accounts less than 5 years old
      age += ` and ${months} ${months === 1 ? 'month' : 'months'}`;
    }
  } else if (months > 0) {
    age = `${months} ${months === 1 ? 'month' : 'months'}`;
  } else {
    const days = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );
    age = `${days} ${days === 1 ? 'day' : 'days'}`;
  }

  return `That's over ${age} ago!`;
}

// Get color for a programming language
function getLanguageColor(language: string | null): string {
  if (!language) return '#ddd';

  // Common language colors
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    CSS: '#563d7c',
    HTML: '#e34c26',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
  };

  return colors[language] || '#8257e5'; // Default purple color
}

// Enhanced skeleton
function DevJourneyTimelineSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-l-bg-3 dark:bg-d-bg-3"></div>
            <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>
          <div className="h-4 w-64 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-2"></div>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="h-8 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        </div>
      </div>

      {/* Filter skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
          <div className="h-6 w-20 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
          <div className="h-6 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-l-bg-3 dark:bg-d-bg-3"></div>

        <div className="space-y-6">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="ml-12 relative">
              <div className="absolute -left-12 w-8 h-8 rounded-full bg-l-bg-3 dark:bg-d-bg-3"></div>

              <div className="p-4 rounded-lg border border-border-l dark:border-border-d bg-l-bg-1 dark:bg-d-bg-1 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <div className="h-5 w-40 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                  <div className="h-4 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                </div>
                <div className="h-4 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
