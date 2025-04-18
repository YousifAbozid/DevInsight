import { JSX, useMemo } from 'react';
import { ContributionData } from '../services/githubGraphQLService';
import { calculateBadges } from './DeveloperBadges';
import { aggregateLanguageData } from '../services/githubService';

interface BattleUserData {
  user: GithubUser;
  repositories: Repository[];
  contributionData?: ContributionData;
}

interface GithubBattleResultsProps {
  user1: BattleUserData;
  user2: BattleUserData;
}

interface ScoreDetails {
  totalScore: number;
  metrics: {
    stars: number;
    repos: number;
    commits: number;
    followers: number;
    experience: number;
  };
}

export default function GithubBattleResults({
  user1,
  user2,
}: GithubBattleResultsProps) {
  // Calculate scores for both users
  const user1Score = useMemo(() => calculateScore(user1), [user1]);
  const user2Score = useMemo(() => calculateScore(user2), [user2]);

  // Determine winner
  const isDraw = user1Score.totalScore === user2Score.totalScore;
  const winner = user1Score.totalScore > user2Score.totalScore ? 1 : 2;

  // Calculate badges for both users
  const user1Badges = calculateBadges(
    user1.user,
    user1.repositories,
    user1.contributionData
  );
  const user2Badges = calculateBadges(
    user2.user,
    user2.repositories,
    user2.contributionData
  );

  // Get top 3 languages for both users
  const user1Languages = aggregateLanguageData(user1.repositories).slice(0, 3);
  const user2Languages = aggregateLanguageData(user2.repositories).slice(0, 3);

  // Format date helper
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate account age in years
  const calculateAccountAge = (createdAt: string) => {
    const joinDate = new Date(createdAt);
    const now = new Date();
    const diffInYears =
      (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return diffInYears.toFixed(1);
  };

  return (
    <div>
      {/* Battle Result Banner */}
      <div className="bg-gradient-to-r from-accent-1 to-accent-2 text-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Battle Results</h2>
        {isDraw ? (
          <p className="text-xl text-center font-bold">
            It&apos;s a draw! Both developers are evenly matched!
          </p>
        ) : (
          <p className="text-xl text-center font-bold">
            <span className="bg-white/20 px-2 py-1 rounded mr-1">
              {winner === 1 ? user1.user.login : user2.user.login}
            </span>
            wins with{' '}
            {winner === 1 ? user1Score.totalScore : user2Score.totalScore}{' '}
            points!
          </p>
        )}
      </div>

      {/* Battle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User 1 Card */}
        <div
          className={`bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border-2 ${winner === 1 && !isDraw ? 'border-accent-success' : isDraw ? 'border-accent-1' : 'border-border-l dark:border-border-d'} overflow-hidden`}
        >
          {winner === 1 && !isDraw && (
            <div className="bg-accent-success text-white text-center py-1 font-bold">
              WINNER
            </div>
          )}
          {isDraw && (
            <div className="bg-accent-1 text-white text-center py-1 font-bold">
              DRAW
            </div>
          )}

          <div className="p-6">
            {/* Profile Header */}
            <div className="flex gap-4 items-center mb-4">
              <img
                src={user1.user.avatar_url}
                alt={user1.user.login}
                className="w-16 h-16 rounded-full border-2 border-border-l dark:border-border-d"
              />
              <div>
                <h3 className="text-lg font-bold text-l-text-1 dark:text-d-text-1">
                  {user1.user.name || user1.user.login}
                </h3>
                <p className="text-l-text-2 dark:text-d-text-2">
                  @{user1.user.login}
                </p>
              </div>
              <div className="ml-auto flex flex-col items-end">
                <div className="text-2xl font-bold text-accent-1">
                  {user1Score.totalScore}
                </div>
                <div className="text-sm text-l-text-3 dark:text-d-text-3">
                  points
                </div>
              </div>
            </div>

            {/* Bio */}
            {user1.user.bio && (
              <div className="mb-4 p-3 bg-l-bg-1 dark:bg-d-bg-1 rounded border border-border-l/50 dark:border-border-d/50">
                <p className="text-l-text-2 dark:text-d-text-2 text-sm line-clamp-2">
                  {user1.user.bio}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatBox
                label="Repositories"
                value={user1.user.public_repos}
                comparison={user1.user.public_repos > user2.user.public_repos}
                isEqual={user1.user.public_repos === user2.user.public_repos}
                metric={user1Score.metrics.repos}
                icon={<RepositoryIcon />}
              />
              <StatBox
                label="Followers"
                value={user1.user.followers}
                comparison={user1.user.followers > user2.user.followers}
                isEqual={user1.user.followers === user2.user.followers}
                metric={user1Score.metrics.followers}
                icon={<UsersIcon />}
              />
              <StatBox
                label="Total Stars"
                value={user1.repositories.reduce(
                  (sum, repo) => sum + repo.stargazers_count,
                  0
                )}
                comparison={user1Score.metrics.stars > user2Score.metrics.stars}
                isEqual={user1Score.metrics.stars === user2Score.metrics.stars}
                metric={user1Score.metrics.stars}
                icon={<StarIcon />}
              />
              <StatBox
                label="Commits (Year)"
                value={user1.contributionData?.totalContributions || 0}
                comparison={
                  user1Score.metrics.commits > user2Score.metrics.commits
                }
                isEqual={
                  user1Score.metrics.commits === user2Score.metrics.commits
                }
                metric={user1Score.metrics.commits}
                icon={<CommitIcon />}
              />
            </div>

            {/* GitHub Details */}
            <div className="flex flex-col gap-2 mb-4 text-sm">
              <DetailRow
                icon={<LocationIcon />}
                text={user1.user.location || 'Location not specified'}
              />
              <DetailRow
                icon={<CalendarIcon />}
                text={`Joined ${formatDate(user1.user.created_at)} (${calculateAccountAge(user1.user.created_at)} years)`}
              />
              <DetailRow
                icon={<CodeIcon />}
                text={
                  user1Languages.length > 0
                    ? `Top languages: ${user1Languages.map(l => l.name).join(', ')}`
                    : 'No language data'
                }
              />
            </div>

            {/* Earned Badges */}
            <div>
              <h4 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2">
                Top Badges
              </h4>
              <div className="flex flex-wrap gap-2">
                {user1Badges
                  .filter(b => b.earned)
                  .slice(0, 3)
                  .map(badge => (
                    <div
                      key={badge.id}
                      className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 
                      ${getBadgeBgClass(badge.tier)} ${getBadgeTextClass(badge.tier)}`}
                    >
                      <span className="w-3 h-3">{badge.icon}</span>
                      {badge.name}
                    </div>
                  ))}
                <div className="px-2 py-1 rounded-full text-xs bg-l-bg-3 dark:bg-d-bg-3 text-l-text-2 dark:text-d-text-2">
                  +{Math.max(0, user1Badges.filter(b => b.earned).length - 3)}{' '}
                  more
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User 2 Card */}
        <div
          className={`bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border-2 ${winner === 2 && !isDraw ? 'border-accent-success' : isDraw ? 'border-accent-1' : 'border-border-l dark:border-border-d'} overflow-hidden`}
        >
          {winner === 2 && !isDraw && (
            <div className="bg-accent-success text-white text-center py-1 font-bold">
              WINNER
            </div>
          )}
          {isDraw && (
            <div className="bg-accent-1 text-white text-center py-1 font-bold">
              DRAW
            </div>
          )}

          <div className="p-6">
            {/* Profile Header */}
            <div className="flex gap-4 items-center mb-4">
              <img
                src={user2.user.avatar_url}
                alt={user2.user.login}
                className="w-16 h-16 rounded-full border-2 border-border-l dark:border-border-d"
              />
              <div>
                <h3 className="text-lg font-bold text-l-text-1 dark:text-d-text-1">
                  {user2.user.name || user2.user.login}
                </h3>
                <p className="text-l-text-2 dark:text-d-text-2">
                  @{user2.user.login}
                </p>
              </div>
              <div className="ml-auto flex flex-col items-end">
                <div className="text-2xl font-bold text-accent-1">
                  {user2Score.totalScore}
                </div>
                <div className="text-sm text-l-text-3 dark:text-d-text-3">
                  points
                </div>
              </div>
            </div>

            {/* Bio */}
            {user2.user.bio && (
              <div className="mb-4 p-3 bg-l-bg-1 dark:bg-d-bg-1 rounded border border-border-l/50 dark:border-border-d/50">
                <p className="text-l-text-2 dark:text-d-text-2 text-sm line-clamp-2">
                  {user2.user.bio}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatBox
                label="Repositories"
                value={user2.user.public_repos}
                comparison={user2.user.public_repos > user1.user.public_repos}
                isEqual={user2.user.public_repos === user1.user.public_repos}
                metric={user2Score.metrics.repos}
                icon={<RepositoryIcon />}
              />
              <StatBox
                label="Followers"
                value={user2.user.followers}
                comparison={user2.user.followers > user1.user.followers}
                isEqual={user2.user.followers === user1.user.followers}
                metric={user2Score.metrics.followers}
                icon={<UsersIcon />}
              />
              <StatBox
                label="Total Stars"
                value={user2.repositories.reduce(
                  (sum, repo) => sum + repo.stargazers_count,
                  0
                )}
                comparison={user2Score.metrics.stars > user1Score.metrics.stars}
                isEqual={user2Score.metrics.stars === user1Score.metrics.stars}
                metric={user2Score.metrics.stars}
                icon={<StarIcon />}
              />
              <StatBox
                label="Commits (Year)"
                value={user2.contributionData?.totalContributions || 0}
                comparison={
                  user2Score.metrics.commits > user1Score.metrics.commits
                }
                isEqual={
                  user2Score.metrics.commits === user1Score.metrics.commits
                }
                metric={user2Score.metrics.commits}
                icon={<CommitIcon />}
              />
            </div>

            {/* GitHub Details */}
            <div className="flex flex-col gap-2 mb-4 text-sm">
              <DetailRow
                icon={<LocationIcon />}
                text={user2.user.location || 'Location not specified'}
              />
              <DetailRow
                icon={<CalendarIcon />}
                text={`Joined ${formatDate(user2.user.created_at)} (${calculateAccountAge(user2.user.created_at)} years)`}
              />
              <DetailRow
                icon={<CodeIcon />}
                text={
                  user2Languages.length > 0
                    ? `Top languages: ${user2Languages.map(l => l.name).join(', ')}`
                    : 'No language data'
                }
              />
            </div>

            {/* Earned Badges */}
            <div>
              <h4 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2">
                Top Badges
              </h4>
              <div className="flex flex-wrap gap-2">
                {user2Badges
                  .filter(b => b.earned)
                  .slice(0, 3)
                  .map(badge => (
                    <div
                      key={badge.id}
                      className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 
                      ${getBadgeBgClass(badge.tier)} ${getBadgeTextClass(badge.tier)}`}
                    >
                      <span className="w-3 h-3">{badge.icon}</span>
                      {badge.name}
                    </div>
                  ))}
                <div className="px-2 py-1 rounded-full text-xs bg-l-bg-3 dark:bg-d-bg-3 text-l-text-2 dark:text-d-text-2">
                  +{Math.max(0, user2Badges.filter(b => b.earned).length - 3)}{' '}
                  more
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="mt-8 bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
        <h3 className="text-lg font-bold text-l-text-1 dark:text-d-text-1 mb-4">
          Score Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <ScoreBreakdownItem
            label="Repositories"
            user1Score={user1Score.metrics.repos}
            user2Score={user2Score.metrics.repos}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
          />
          <ScoreBreakdownItem
            label="Stars"
            user1Score={user1Score.metrics.stars}
            user2Score={user2Score.metrics.stars}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
          />
          <ScoreBreakdownItem
            label="Commits"
            user1Score={user1Score.metrics.commits}
            user2Score={user2Score.metrics.commits}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
          />
          <ScoreBreakdownItem
            label="Followers"
            user1Score={user1Score.metrics.followers}
            user2Score={user2Score.metrics.followers}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
          />
          <ScoreBreakdownItem
            label="Experience"
            user1Score={user1Score.metrics.experience}
            user2Score={user2Score.metrics.experience}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
          />
        </div>
      </div>
    </div>
  );
}

// Helper components
function StatBox({
  label,
  value,
  comparison,
  isEqual,
  metric,
  icon,
}: {
  label: string;
  value: number;
  comparison: boolean;
  isEqual: boolean;
  metric: number;
  icon: JSX.Element;
}) {
  return (
    <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded border border-border-l/50 dark:border-border-d/50">
      <div className="flex justify-between">
        <div className="flex items-center gap-1.5 text-xs text-l-text-2 dark:text-d-text-2 mb-1">
          {icon}
          {label}
        </div>
        {!isEqual && comparison && (
          <span className="text-xs text-accent-success">
            <ArrowUpIcon />
          </span>
        )}
      </div>
      <div className="flex justify-between items-baseline">
        <div className="text-lg font-bold text-l-text-1 dark:text-d-text-1">
          {value.toLocaleString()}
        </div>
        <div className="text-xs font-medium text-l-text-3 dark:text-d-text-3">
          {metric} pts
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, text }: { icon: JSX.Element; text: string }) {
  return (
    <div className="flex items-center gap-2 text-l-text-2 dark:text-d-text-2">
      <span className="w-4 h-4">{icon}</span>
      {text}
    </div>
  );
}

function ScoreBreakdownItem({
  label,
  user1Score,
  user2Score,
  user1Name,
  user2Name,
}: {
  label: string;
  user1Score: number;
  user2Score: number;
  user1Name: string;
  user2Name: string;
}) {
  const totalScore = user1Score + user2Score;
  const user1Percentage = totalScore > 0 ? (user1Score / totalScore) * 100 : 50;
  // const user2Percentage = 100 - user1Percentage;
  const winner = user1Score > user2Score ? 1 : user2Score > user1Score ? 2 : 0;

  return (
    <div className="flex flex-col">
      <div className="text-sm text-l-text-1 dark:text-d-text-1 font-medium mb-1">
        {label}
      </div>
      <div className="flex items-center text-xs mb-1">
        <span
          className={`${winner === 1 ? 'text-accent-success font-medium' : 'text-l-text-2 dark:text-d-text-2'}`}
        >
          {user1Name}: {user1Score}
        </span>
        <span className="text-l-text-3 dark:text-d-text-3 mx-1">vs</span>
        <span
          className={`${winner === 2 ? 'text-accent-success font-medium' : 'text-l-text-2 dark:text-d-text-2'}`}
        >
          {user2Name}: {user2Score}
        </span>
      </div>
      <div className="h-2 bg-l-bg-3 dark:bg-d-bg-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-1"
          style={{
            width: `${user1Percentage}%`,
            boxShadow: winner === 1 ? '0 0 8px var(--color-accent-1)' : 'none',
          }}
        ></div>
      </div>
    </div>
  );
}

// Score calculation function
function calculateScore(userData: BattleUserData): ScoreDetails {
  const { user, repositories, contributionData } = userData;

  // Calculate account age in days
  const accountAgeInDays = Math.floor(
    (new Date().getTime() - new Date(user.created_at).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Calculate experience based on account age (1 point per month, max 60)
  const experiencePoints = Math.min(Math.floor(accountAgeInDays / 30), 60);

  // Calculate stars (3 points per star, max 300)
  const totalStars = repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const starPoints = Math.min(totalStars * 3, 300);

  // Calculate repositories (5 points per repo, max 250)
  const repoPoints = Math.min(user.public_repos * 5, 250);

  // Calculate followers (2 points per follower, max 200)
  const followerPoints = Math.min(user.followers * 2, 200);

  // Calculate commits from contribution data (0.5 points per commit, max 300)
  const totalCommits = contributionData?.totalContributions || 0;
  const commitPoints = Math.min(Math.floor(totalCommits * 0.5), 300);

  // Calculate total score
  const totalScore =
    starPoints + repoPoints + followerPoints + commitPoints + experiencePoints;

  return {
    totalScore,
    metrics: {
      stars: starPoints,
      repos: repoPoints,
      commits: commitPoints,
      followers: followerPoints,
      experience: experiencePoints,
    },
  };
}

// Utility functions for badges
function getBadgeBgClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'bg-amber-100 dark:bg-amber-900/30';
    case 'silver':
      return 'bg-slate-200 dark:bg-slate-700/50';
    case 'gold':
      return 'bg-amber-100 dark:bg-amber-900/40';
    case 'platinum':
      return 'bg-sky-100 dark:bg-sky-900/30';
    default:
      return 'bg-l-bg-3 dark:bg-d-bg-3';
  }
}

function getBadgeTextClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'text-amber-800 dark:text-amber-300';
    case 'silver':
      return 'text-slate-700 dark:text-slate-300';
    case 'gold':
      return 'text-amber-700 dark:text-amber-300';
    case 'platinum':
      return 'text-sky-800 dark:text-sky-300';
    default:
      return 'text-l-text-2 dark:text-d-text-2';
  }
}

// Icons
function RepositoryIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-3 h-3"
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
      <path d="M16 3.13a4 4 0 010 7.75"></path>
    </svg>
  );
}

function CommitIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
      <path d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path
        fillRule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path
        fillRule="evenodd"
        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path
        fillRule="evenodd"
        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
