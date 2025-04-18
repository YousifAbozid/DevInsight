import { JSX, useState } from 'react';
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
  icon: JSX.Element;
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

export default function DevJourneyTimeline({
  user,
  repositories = [],
  contributionData,
  loading,
}: DevJourneyTimelineProps) {
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');

  if (loading) {
    return <DevJourneyTimelineSkeleton />;
  }

  if (!repositories || repositories.length === 0) {
    return null;
  }

  // Calculate timeline events
  const timelineEvents = calculateTimelineEvents(
    user,
    repositories,
    contributionData
  );

  // Sort events by date (newest first)
  const sortedEvents = [...timelineEvents].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // For compact mode, limit to most important events
  const displayEvents =
    viewMode === 'compact'
      ? sortedEvents.filter(event => event.highlight).slice(0, 5)
      : sortedEvents;

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
            Developer Journey Timeline
          </h2>
          <p className="text-sm text-l-text-2 dark:text-d-text-2">
            Your GitHub story, from first commit to latest achievements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('compact')}
            className={`px-3 py-1 text-sm rounded-full ${
              viewMode === 'compact'
                ? 'bg-accent-1 text-white'
                : 'bg-l-bg-3 dark:bg-d-bg-3 text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
            }`}
          >
            Highlights
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-3 py-1 text-sm rounded-full ${
              viewMode === 'detailed'
                ? 'bg-accent-1 text-white'
                : 'bg-l-bg-3 dark:bg-d-bg-3 text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
            }`}
          >
            Full Journey
          </button>
        </div>
      </div>

      {/* Timeline container */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border-l dark:bg-border-d"></div>

        {/* Timeline events */}
        <div className="space-y-6">
          {displayEvents.length > 0 ? (
            displayEvents.map(event => (
              <div key={event.id} className="ml-12 relative">
                {/* Timeline dot and icon */}
                <div
                  className={`absolute -left-12 p-2 rounded-full flex items-center justify-center
                    ${
                      event.highlight
                        ? 'bg-accent-1 text-white'
                        : 'bg-l-bg-3 dark:bg-d-bg-3 text-l-text-1 dark:text-d-text-1'
                    }`}
                >
                  {event.icon}
                </div>

                {/* Event content */}
                <div
                  className={`p-4 rounded-lg border 
                  ${
                    event.highlight
                      ? 'bg-accent-1/10 border-accent-1/30'
                      : 'bg-l-bg-1 dark:bg-d-bg-1 border-border-l dark:border-border-d'
                  }`}
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
                          backgroundColor:
                            event.metadata.languageColor || '#ddd',
                        }}
                      ></div>
                      <span className="text-xs text-l-text-3 dark:text-d-text-3">
                        {event.metadata.language}
                      </span>
                    </div>
                  )}

                  {event.type === 'star' && (
                    <div className="mt-2 flex items-center gap-1">
                      <StarIcon className="w-3 h-3 text-accent-warning" />
                      <span className="text-xs text-l-text-3 dark:text-d-text-3">
                        {event.metadata?.stars}{' '}
                        {event.metadata?.stars === 1 ? 'star' : 'stars'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-l-text-3 dark:text-d-text-3">
                No timeline events to display
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate timeline events
function calculateTimelineEvents(
  user: GithubUser,
  repositories: Repository[],
  contributionData?: ContributionData
): TimelineEvent[] {
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
      icon: <RepoIcon className="w-4 h-4" />,
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
    icon: <CalendarIcon className="w-4 h-4" />,
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
        icon: <StarIcon className="w-4 h-4" />,
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
          icon: <StarIcon className="w-4 h-4" />,
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
        icon: <CodeIcon className="w-4 h-4" />,
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
        icon: <FolderIcon className="w-4 h-4" />,
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
              icon: <FireIcon className="w-4 h-4" />,
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
          icon: <FireIcon className="w-4 h-4" />,
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
      icon: <CakeIcon className="w-4 h-4" />,
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
          icon: <UsersIcon className="w-4 h-4" />,
          type: 'follower',
          highlight: milestone >= 50,
        });
      });
    }
  }

  return events;
}

// Helper function to format dates
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Helper function to get account age description
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

// Get color for a programming language (simplified version)
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

// Icons used in the timeline
function RepoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5V2.5Zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2v-3.25Z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
}

function FireIcon({ className }: { className?: string }) {
  return (
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
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
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
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
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
  );
}

function CakeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M15 1.784l-.796.796a1.125 1.125 0 101.591 0L15 1.784zM12 1.784l-.796.796a1.125 1.125 0 101.591 0L12 1.784zM9 1.784l-.796.796a1.125 1.125 0 101.591 0L9 1.784zM9.75 7.547c.498-.02.998-.035 1.5-.042V6.75a.75.75 0 011.5 0v.755c.502.007 1.002.021 1.5.042V6.75a.75.75 0 011.5 0v.88l.307.022c1.55.117 2.693 1.427 2.693 2.946v1.018a62.182 62.182 0 00-13.5 0v-1.018c0-1.519 1.143-2.829 2.693-2.946l.307-.022v-.88a.75.75 0 011.5 0v.797zM12 12.75c-2.472 0-4.9.184-7.274.54-1.454.217-2.476 1.482-2.476 2.916v.384a4.104 4.104 0 012.585.364 2.605 2.605 0 002.33 0 4.104 4.104 0 013.67 0 2.605 2.605 0 002.33 0 4.104 4.104 0 013.67 0 2.605 2.605 0 002.33 0 4.104 4.104 0 012.585-.364v-.384c0-1.434-1.022-2.7-2.476-2.917A49.138 49.138 0 0012 12.75zM21.75 18.131a2.604 2.604 0 00-1.915.165 4.104 4.104 0 01-3.67 0 2.604 2.604 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.604 2.604 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.604 2.604 0 00-1.915-.165v2.494c0 1.036.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875v-2.494z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
    </svg>
  );
}

// Skeleton loading state for the timeline
function DevJourneyTimelineSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
          <div className="h-4 w-64 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-20 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
          <div className="h-8 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-l-bg-3 dark:bg-d-bg-3"></div>

        <div className="space-y-6">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="ml-12 relative">
              <div className="absolute -left-12 w-8 h-8 rounded-full bg-l-bg-3 dark:bg-d-bg-3"></div>

              <div className="p-4 rounded-lg border border-border-l dark:border-border-d bg-l-bg-1 dark:bg-d-bg-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <div className="h-4 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                  <div className="h-3 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                </div>
                <div className="h-3 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-1"></div>
                <div className="h-3 w-4/5 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
