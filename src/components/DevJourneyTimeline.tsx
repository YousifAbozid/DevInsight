import { useState, useMemo } from 'react';
import { ContributionData } from '../services/githubGraphQLService';

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

// Icons organized in a single object for better maintenance
const Icons = {
  Repo: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5V2.5Zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2v-3.25Z" />
    </svg>
  ),
  Star: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  ),
  Fire: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Code: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
      <path
        fillRule="evenodd"
        d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Cake: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M15 1.784l-.796.796a1.125 1.125 0 101.591 0L15 1.784zM12 1.784l-.796.796a1.125 1.125 0 101.591 0L12 1.784zM9 1.784l-.796.796a1.125 1.125 0 101.591 0L9 1.784zM9.75 7.547c.498-.02.998-.035 1.5-.042V6.75a.75.75 0 011.5 0v.755c.502.007 1.002.021 1.5.042V6.75a.75.75 0 011.5 0v.88l.307.022c1.55.117 2.693 1.427 2.693 2.946v1.018a62.182 62.182 0 00-13.5 0v-1.018c0-1.519 1.143-2.829 2.693-2.946l.307-.022v-.88a.75.75 0 011.5 0v.797zM12 12.75c-2.472 0-4.9.184-7.274.54-1.454.217-2.476 1.482-2.476 2.916v.384a4.104 4.104 0 012.585.364 2.605 2.605 0 002.33 0 4.104 4.104 0 013.67 0 2.605 2.605 0 002.33 0 4.104 4.104 0 013.67 0 2.605 2.605 0 002.33 0 4.104 4.104 0 012.585-.364v-.384c0-1.434-1.022-2.7-2.476-2.917A49.138 49.138 0 0012 12.75zM21.75 18.131a2.604 2.604 0 00-1.915.165 4.104 4.104 0 01-3.67 0 2.604 2.604 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.604 2.604 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.604 2.604 0 00-1.915-.165v2.494c0 1.036.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875v-2.494z" />
    </svg>
  ),
  Users: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </svg>
  ),
  Folder: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
    </svg>
  ),
  Filter: ({ className }: { className?: string }) => (
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
  ChevronDown: ({ className }: { className?: string }) => (
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
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
};

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 flex items-center gap-2">
            <Icons.Calendar className="w-5 h-5 text-accent-1" />
            Developer Journey Timeline
          </h2>
          <p className="text-sm text-l-text-2 dark:text-d-text-2 mt-1">
            Your GitHub story, from first commit to latest achievements
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
        </div>
      </div>

      {/* Filter options */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-l-text-2 dark:text-d-text-2">
          <Icons.Filter className="w-4 h-4" />
          <span className="text-sm">Filter:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
              filter === 'all'
                ? 'bg-accent-1 text-white'
                : 'bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
            }`}
          >
            All ({sortedEvents.length})
          </button>

          {eventTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-2.5 py-1 text-xs rounded-full capitalize transition-colors ${
                filter === type
                  ? 'bg-accent-1 text-white'
                  : 'bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
              }`}
            >
              {type} ({eventCounts[type]})
            </button>
          ))}
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
