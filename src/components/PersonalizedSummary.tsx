import { useState } from 'react';
import { ContributionData } from '../services/githubGraphQLService';

interface PersonalizedSummaryProps {
  user: GithubUser;
  repositories?: Repository[];
  contributionData?: ContributionData;
  loading: boolean;
}

export default function PersonalizedSummary({
  user,
  repositories,
  contributionData,
  loading,
}: PersonalizedSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return <PersonalizedSummarySkeleton />;
  }

  if (!repositories || !repositories.length) {
    return null;
  }

  // Generate insights from the user data
  const insights = generateInsights(user, repositories, contributionData);

  // Select a subset of insights to display initially
  const initialInsights = insights.slice(0, 3);
  const expandedInsights = insights.slice(3);
  const hasMoreInsights = expandedInsights.length > 0;

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
            Your GitHub Story
          </h2>
          <p className="text-sm text-l-text-2 dark:text-d-text-2">
            Insights from your developer journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs rounded-full bg-accent-1/15 text-accent-1 font-medium">
            {getProfileLevel(user, repositories, contributionData)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {initialInsights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d"
          >
            <div className={`mt-1 p-2 rounded-full ${insight.iconBg}`}>
              <insight.icon className="w-4 h-4 text-l-text-inv dark:text-d-text-inv" />
            </div>
            <div>
              <p className="text-l-text-1 dark:text-d-text-1">{insight.text}</p>
              {insight.subtext && (
                <p className="text-sm text-l-text-3 dark:text-d-text-3 mt-1">
                  {insight.subtext}
                </p>
              )}
            </div>
          </div>
        ))}

        {expanded &&
          expandedInsights.map((insight, index) => (
            <div
              key={`expanded-${index}`}
              className="flex items-start gap-3 p-3 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d"
            >
              <div className={`mt-1 p-2 rounded-full ${insight.iconBg}`}>
                <insight.icon className="w-4 h-4 text-l-text-inv dark:text-d-text-inv" />
              </div>
              <div>
                <p className="text-l-text-1 dark:text-d-text-1">
                  {insight.text}
                </p>
                {insight.subtext && (
                  <p className="text-sm text-l-text-3 dark:text-d-text-3 mt-1">
                    {insight.subtext}
                  </p>
                )}
              </div>
            </div>
          ))}

        {hasMoreInsights && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2 px-4 text-sm border border-border-l dark:border-border-d rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors"
          >
            {expanded
              ? 'Show less insights'
              : `Show ${expandedInsights.length} more insights`}
          </button>
        )}
      </div>
    </div>
  );
}

// Helper function to generate insights based on user data
function generateInsights(
  user: GithubUser,
  repositories: Repository[],
  contributionData?: ContributionData
) {
  const insights: Array<{
    text: string;
    subtext?: string;
    icon: React.FC<{ className?: string }>;
    iconBg: string;
  }> = [];

  // Calculate most active day from contribution data
  if (contributionData) {
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat

    contributionData.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        const date = new Date(day.date);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        dayOfWeekCounts[dayOfWeek] += day.contributionCount;
      });
    });

    const mostActiveDayIndex = dayOfWeekCounts.indexOf(
      Math.max(...dayOfWeekCounts)
    );
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const mostActiveDay = dayNames[mostActiveDayIndex];

    if (Math.max(...dayOfWeekCounts) > 0) {
      insights.push({
        text: `Your most active day is ${mostActiveDay}!`,
        subtext: `That's when you make the most contributions to your projects.`,
        icon: CalendarIcon,
        iconBg: 'bg-accent-1',
      });
    }

    // Calculate commit streak
    let currentStreak = 0;
    let longestStreak = 0;
    let inStreak = false;

    // Sort contribution days in reverse chronological order
    const allContributionDays = contributionData.weeks
      .flatMap(week => week.contributionDays)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (allContributionDays.length > 0) {
      for (const day of allContributionDays) {
        if (day.contributionCount > 0) {
          currentStreak++;
          inStreak = true;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else if (inStreak) {
          break; // End of current streak
        }
      }

      if (currentStreak > 0) {
        insights.push({
          text: `You're on a ${currentStreak}-day contribution streak!`,
          subtext:
            currentStreak > 1
              ? `Keep it up! Your longest streak is ${longestStreak} days.`
              : `Great start! Try to build momentum with regular contributions.`,
          icon: FireIcon,
          iconBg: 'bg-accent-warning',
        });
      }
    }
  }

  // Calculate most used language
  const languageCounts: Record<string, number> = {};
  repositories.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  const sortedLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([lang]) => lang !== 'null');

  if (sortedLanguages.length > 0) {
    const [topLanguage, count] = sortedLanguages[0];
    const percentage = Math.round((count / repositories.length) * 100);

    insights.push({
      text: `You're a ${topLanguage} enthusiast!`,
      subtext: `${percentage}% of your repositories use ${topLanguage}. ${getLanguageCompliment(topLanguage)}`,
      icon: CodeIcon,
      iconBg: 'bg-accent-success',
    });

    // If they have multiple languages
    if (sortedLanguages.length >= 3) {
      insights.push({
        text: `You're a polyglot programmer with ${sortedLanguages.length} languages!`,
        subtext: `Your top 3: ${sortedLanguages
          .slice(0, 3)
          .map(([lang]) => lang)
          .join(', ')}`,
        icon: GlobeIcon,
        iconBg: 'bg-accent-1',
      });
    }
  }

  // Repository creation pace
  if (repositories.length > 1) {
    const oldestRepo = repositories.reduce((oldest, repo) =>
      new Date(repo.created_at) < new Date(oldest.created_at) ? repo : oldest
    );

    const daysSinceFirstRepo = Math.floor(
      (new Date().getTime() - new Date(oldestRepo.created_at).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysSinceFirstRepo > 30) {
      const monthsSinceFirstRepo = Math.floor(daysSinceFirstRepo / 30);
      const reposPerMonth = (
        repositories.length / monthsSinceFirstRepo
      ).toFixed(1);

      insights.push({
        text: `You create about ${reposPerMonth} repositories per month!`,
        subtext: `That's based on your activity since ${new Date(
          oldestRepo.created_at
        ).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
        })}`,
        icon: FolderIcon,
        iconBg: 'bg-accent-2',
      });
    }
  }

  // Stars received
  const totalStars = repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  if (totalStars > 0) {
    const starLevel = getStarLevel(totalStars);
    insights.push({
      text: `You've earned ${totalStars} stars across your repositories!`,
      subtext: starLevel,
      icon: StarIcon,
      iconBg: 'bg-accent-warning',
    });
  }

  // Popular project
  const mostStarredRepo = repositories.reduce(
    (most, repo) =>
      repo.stargazers_count > most.stargazers_count ? repo : most,
    repositories[0]
  );

  if (mostStarredRepo && mostStarredRepo.stargazers_count > 0) {
    insights.push({
      text: `"${mostStarredRepo.name}" is your most popular project!`,
      subtext: `It has ${mostStarredRepo.stargazers_count} stars${mostStarredRepo.forks_count ? ` and ${mostStarredRepo.forks_count} forks` : ''}.`,
      icon: TrophyIcon,
      iconBg: 'bg-accent-1',
    });
  }

  // Recent activity
  const now = new Date();
  const recentRepos = repositories.filter(repo => {
    const updateDate = new Date(repo.updated_at);
    const diffInDays = Math.floor(
      (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffInDays < 30;
  });

  if (recentRepos.length > 0) {
    insights.push({
      text: `You've been busy! ${recentRepos.length} projects updated in the last month.`,
      subtext:
        recentRepos.length > 2
          ? `Including ${recentRepos
              .slice(0, 2)
              .map(r => r.name)
              .join(', ')} and more.`
          : `Keep up the good work!`,
      icon: ClockIcon,
      iconBg: 'bg-accent-2',
    });
  }

  // Account age
  const accountAgeInDays = Math.floor(
    (now.getTime() - new Date(user.created_at).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const accountAgeInYears = accountAgeInDays / 365;

  if (accountAgeInYears >= 1) {
    insights.push({
      text: `You're a GitHub veteran of ${accountAgeInYears.toFixed(1)} years!`,
      subtext: `Account created on ${new Date(
        user.created_at
      ).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
      icon: AwardIcon,
      iconBg: 'bg-accent-success',
    });
  }

  // Followers milestone
  if (user.followers > 0) {
    let followerMilestone = '';
    if (user.followers >= 1000) {
      followerMilestone =
        'You have a significant following in the developer community!';
    } else if (user.followers >= 100) {
      followerMilestone = 'Your work is making an impact in the community!';
    } else if (user.followers >= 10) {
      followerMilestone = 'Your reputation is growing among developers!';
    } else {
      followerMilestone = "You're starting to build your developer network!";
    }

    insights.push({
      text: `You have ${user.followers} GitHub followers!`,
      subtext: followerMilestone,
      icon: UsersIcon,
      iconBg: 'bg-accent-1',
    });
  }

  // Shuffle insights to vary the display
  return shuffleArray(insights);
}

// Get profile level based on account age, repos, stars, and contributions
function getProfileLevel(
  user: GithubUser,
  repositories: Repository[],
  contributionData?: ContributionData
): string {
  const accountAgeInDays = Math.floor(
    (new Date().getTime() - new Date(user.created_at).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const totalStars = repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const totalContributions = contributionData?.totalContributions || 0;

  // Calculate a score based on weighted factors
  let score = 0;
  score += accountAgeInDays / 30; // 1 point per month
  score += repositories.length * 2; // 2 points per repository
  score += totalStars * 3; // 3 points per star
  score += totalContributions / 10; // 0.1 points per contribution
  score += user.followers * 5; // 5 points per follower

  // Determine level based on score
  if (score > 1000) return 'GitHub Legend';
  if (score > 500) return 'GitHub Master';
  if (score > 200) return 'GitHub Pro';
  if (score > 100) return 'GitHub Enthusiast';
  if (score > 50) return 'GitHub Regular';
  if (score > 20) return 'GitHub Explorer';
  return 'GitHub Beginner';
}

// Helper function to shuffle an array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper function to get star level description
function getStarLevel(stars: number): string {
  if (stars >= 1000)
    return "That's stellar! You're making a significant impact on the community!";
  if (stars >= 500)
    return 'Fantastic achievement! Your projects are getting serious attention!';
  if (stars >= 100)
    return 'Impressive! Your work is gaining recognition in the community!';
  if (stars >= 50) return 'Great job! Your projects are starting to shine!';
  if (stars >= 10) return 'Nice start! People are taking notice of your work!';
  return 'Every star counts! Keep building awesome projects!';
}

// Helper function to get language-specific compliments
function getLanguageCompliment(language: string): string {
  const compliments: Record<string, string> = {
    JavaScript: 'You must love building interactive web experiences!',
    TypeScript: 'You value type safety and maintainable code!',
    Python: 'Great choice for data science and automation!',
    Java: "You're working with a powerful, enterprise-grade language!",
    HTML: 'Frontend development is your thing!',
    CSS: 'You have an eye for design and UI!',
    Ruby: 'You appreciate elegant and expressive syntax!',
    Go: 'You value performance and simplicity!',
    'C#': 'A versatile choice for various applications!',
    PHP: "You're powering a significant part of the web!",
    Swift: "You're building sleek Apple platform apps!",
    Kotlin: 'Modern Android development is your specialty!',
    Rust: 'You care about memory safety without sacrificing performance!',
    'C++': "You're handling complex and performance-critical systems!",
  };

  return compliments[language] || 'Great language choice!';
}

// Icons
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
        clipRule="evenodd"
      />
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
        d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.177A7.547 7.547 0 0 1 6.648 6.61a.75.75 0 0 0-1.152-.082A9 9 0 1 0 21.75 12c0-4.347-3.055-7.985-7.166-8.83l1.123-2.117a.75.75 0 0 0-.744-1.114l-4.854.703a.75.75 0 0 0-.583.937l1.572 5.572a.75.75 0 0 0 1.438-.404L12.963 2.286Z"
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
        d="M14.447 3.027a.75.75 0 0 1 .527.92l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.526ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
        clipRule="evenodd"
      />
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
      <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
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
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function AwardIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
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
      <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
    </svg>
  );
}

function PersonalizedSummarySkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d animate-pulse">
      <div className="flex justify-between mb-6">
        <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        <div className="h-6 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
      </div>

      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d"
            >
              <div className="mt-1 p-2 rounded-full bg-l-bg-3 dark:bg-d-bg-3 h-8 w-8"></div>
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              </div>
            </div>
          ))}

        <div className="h-8 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
      </div>
    </div>
  );
}
