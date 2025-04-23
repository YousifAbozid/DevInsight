import { useMemo } from 'react';
import { ContributionData } from '../services/githubGraphQLService';
import { Icons } from '../components/shared/Icons';

export interface TimelineEvent {
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

/**
 * Custom hook for generating timeline events from GitHub user data
 * @param user GitHub user data
 * @param repositories Array of user's repositories
 * @param contributionData Optional contribution data from GitHub
 * @returns Array of timeline events
 */
export function useTimelineEvents(
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
