import { useState, useMemo } from 'react';
import { ContributionData } from '../services/githubGraphQLService';
import { Icons } from './shared/Icons';

// Define proper interfaces
interface PersonalizedSummaryProps {
  user: GithubUser;
  repositories?: Repository[];
  contributionData?: ContributionData;
  loading: boolean;
}

interface Insight {
  id: string;
  text: string;
  subtext?: string;
  icon: React.FC<{ className?: string }>;
  iconBg: string;
}

// Custom hook to generate insights
function useGithubInsights(
  user: GithubUser,
  repositories: Repository[],
  contributionData?: ContributionData
): Insight[] {
  return useMemo(() => {
    const insights: Insight[] = [];
    const now = new Date();

    // Calculate most active day from contribution data
    if (contributionData) {
      const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat

      contributionData.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
          const date = new Date(day.date);
          const dayOfWeek = date.getDay();
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
          id: 'active-day',
          text: `Your most active day is ${mostActiveDay}!`,
          subtext: `That's when you make the most contributions to your projects.`,
          icon: Icons.Calendar,
          iconBg: 'bg-accent-1',
        });
      }

      // Calculate commit streak
      let currentStreak = 0;
      let longestStreak = 0;
      let inStreak = false;

      const allContributionDays = contributionData.weeks
        .flatMap(week => week.contributionDays)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

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
            id: 'streak',
            text: `You're on a ${currentStreak}-day contribution streak!`,
            subtext:
              currentStreak > 1
                ? `Keep it up! Your longest streak is ${longestStreak} days.`
                : `Great start! Try to build momentum with regular contributions.`,
            icon: Icons.Fire,
            iconBg: 'bg-accent-warning',
          });
        }
      }
    }

    // Calculate most used language
    const languageCounts: Record<string, number> = {};
    repositories.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] =
          (languageCounts[repo.language] || 0) + 1;
      }
    });

    const sortedLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .filter(([lang]) => lang !== 'null');

    if (sortedLanguages.length > 0) {
      const [topLanguage, count] = sortedLanguages[0];
      const percentage = Math.round((count / repositories.length) * 100);

      insights.push({
        id: 'top-language',
        text: `You're a ${topLanguage} enthusiast!`,
        subtext: `${percentage}% of your repositories use ${topLanguage}. ${getLanguageCompliment(topLanguage)}`,
        icon: Icons.Code,
        iconBg: 'bg-accent-success',
      });

      // If they have multiple languages
      if (sortedLanguages.length >= 3) {
        insights.push({
          id: 'polyglot',
          text: `You're a polyglot programmer with ${sortedLanguages.length} languages!`,
          subtext: `Your top 3: ${sortedLanguages
            .slice(0, 3)
            .map(([lang]) => lang)
            .join(', ')}`,
          icon: Icons.Globe,
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
        (now.getTime() - new Date(oldestRepo.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysSinceFirstRepo > 30) {
        const monthsSinceFirstRepo = Math.floor(daysSinceFirstRepo / 30);
        const reposPerMonth = (
          repositories.length / monthsSinceFirstRepo
        ).toFixed(1);

        insights.push({
          id: 'repo-pace',
          text: `You create about ${reposPerMonth} repositories per month!`,
          subtext: `That's based on your activity since ${new Date(
            oldestRepo.created_at
          ).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
          })}`,
          icon: Icons.Folder,
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
        id: 'total-stars',
        text: `You've earned ${totalStars} stars across your repositories!`,
        subtext: starLevel,
        icon: Icons.Star,
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
        id: 'popular-project',
        text: `"${mostStarredRepo.name}" is your most popular project!`,
        subtext: `It has ${mostStarredRepo.stargazers_count} stars${mostStarredRepo.forks_count ? ` and ${mostStarredRepo.forks_count} forks` : ''}.`,
        icon: Icons.Trophy,
        iconBg: 'bg-accent-1',
      });
    }

    // Recent activity
    const recentRepos = repositories.filter(repo => {
      const updateDate = new Date(repo.updated_at);
      const diffInDays = Math.floor(
        (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffInDays < 30;
    });

    if (recentRepos.length > 0) {
      insights.push({
        id: 'recent-activity',
        text: `You've been busy! ${recentRepos.length} projects updated in the last month.`,
        subtext:
          recentRepos.length > 2
            ? `Including ${recentRepos
                .slice(0, 2)
                .map(r => r.name)
                .join(', ')} and more.`
            : `Keep up the good work!`,
        icon: Icons.Clock,
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
        id: 'account-age',
        text: `You're a GitHub veteran of ${accountAgeInYears.toFixed(1)} years!`,
        subtext: `Account created on ${new Date(
          user.created_at
        ).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`,
        icon: Icons.Award,
        iconBg: 'bg-accent-success',
      });
    }

    // Account type insights
    if (user.type && user.type !== 'User') {
      insights.push({
        id: 'account-type',
        text: `Account type: ${user.type}`,
        subtext: `This is a special GitHub account with additional capabilities.`,
        icon: Icons.Shield,
        iconBg: 'bg-accent-2',
      });
    }

    // Account status insights for staff
    if (user.site_admin) {
      insights.push({
        id: 'staff-member',
        text: `GitHub Staff Member!`,
        subtext: `This user works at GitHub and has administrative privileges.`,
        icon: Icons.Star,
        iconBg: 'bg-accent-warning',
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
        id: 'followers',
        text: `You have ${user.followers} GitHub followers!`,
        subtext: followerMilestone,
        icon: Icons.Users,
        iconBg: 'bg-accent-1',
      });
    }

    return shuffleArray(insights);
  }, [user, repositories, contributionData]);
}

// Helper function to get profile level
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

// Helper functions
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

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

// Main component with improved structure
export default function PersonalizedSummary({
  user,
  repositories,
  contributionData,
  loading,
}: PersonalizedSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  // Move the custom hook call to the top level, before any conditional returns
  // This ensures hooks are always called in the same order
  const insights = useGithubInsights(
    user,
    repositories || [],
    contributionData
  );

  if (loading) {
    return <PersonalizedSummarySkeleton />;
  }

  if (!repositories || !repositories.length) {
    return null;
  }

  // Select a subset of insights to display initially
  const initialInsights = insights.slice(0, 3);
  const expandedInsights = insights.slice(3);
  const hasMoreInsights = expandedInsights.length > 0;

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-4 sm:p-6 border border-border-l dark:border-border-d shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 flex items-center gap-2">
            <Icons.Award className="w-5 h-5 text-accent-1" />
            Your GitHub Story
          </h2>
          <p className="text-sm text-l-text-2 dark:text-d-text-2 mt-1">
            Insights from your developer journey
          </p>
        </div>
        <div className="flex items-center">
          <span className="px-3 py-1 text-xs rounded-full bg-accent-1/15 text-accent-1 font-medium">
            {getProfileLevel(user, repositories, contributionData)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {initialInsights.map(insight => (
          <div
            key={insight.id}
            className="flex flex-col sm:flex-row items-start gap-3 p-4 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors transform hover:-translate-y-0.5 duration-300"
          >
            <div
              className={`p-2.5 rounded-full ${insight.iconBg} shrink-0 self-center sm:self-start`}
            >
              <insight.icon className="w-4 h-4 text-l-text-inv dark:text-d-text-inv" />
            </div>
            <div>
              <p className="text-center sm:text-left text-l-text-1 dark:text-d-text-1 font-medium">
                {insight.text}
              </p>
              {insight.subtext && (
                <p className="text-sm text-center sm:text-left text-l-text-3 dark:text-d-text-3 mt-1">
                  {insight.subtext}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Expanded insights with transition */}
        <div
          className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out ${
            expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {expandedInsights.map(insight => (
            <div
              key={insight.id}
              className="flex flex-col sm:flex-row items-start gap-3 p-4 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors transform hover:-translate-y-0.5 duration-300"
            >
              <div
                className={`p-2.5 rounded-full ${insight.iconBg} shrink-0 self-center sm:self-start`}
              >
                <insight.icon className="w-4 h-4 text-l-text-inv dark:text-d-text-inv" />
              </div>
              <div>
                <p className="text-center sm:text-left text-l-text-1 dark:text-d-text-1 font-medium">
                  {insight.text}
                </p>
                {insight.subtext && (
                  <p className="text-sm text-center sm:text-left text-l-text-3 dark:text-d-text-3 mt-1">
                    {insight.subtext}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Show more/less button with improved styling */}
        {hasMoreInsights && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2.5 px-4 mt-2 text-sm border border-border-l dark:border-border-d rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover hover:border-accent-1/30 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group"
          >
            {expanded ? (
              <>
                <Icons.ChevronUp className="w-5 h-5 group-hover:animate-bounce-short" />
                <span>Show less insights</span>
              </>
            ) : (
              <>
                <Icons.ChevronDown className="w-5 h-5 group-hover:animate-pulse" />
                <span>Show {expandedInsights.length} more insights</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function PersonalizedSummarySkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-4 sm:p-6 border border-border-l dark:border-border-d shadow-sm animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4 sm:mb-6">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-4 w-36 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>
        <div className="h-6 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-full self-start"></div>
      </div>

      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start gap-3 p-4 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d"
            >
              <div className="p-2.5 rounded-full bg-l-bg-3 dark:bg-d-bg-3 h-8 w-8 shrink-0 self-center sm:self-start mb-2 sm:mb-0"></div>
              <div className="flex-1 w-full">
                <div className="h-4 w-full sm:w-3/4 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2 mx-auto sm:mx-0"></div>
                <div className="h-3 w-2/3 sm:w-1/2 bg-l-bg-3 dark:bg-d-bg-3 rounded mx-auto sm:mx-0"></div>
              </div>
            </div>
          ))}

        <div className="h-10 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded-lg mt-2"></div>
      </div>
    </div>
  );
}
