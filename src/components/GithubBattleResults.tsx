import React, { JSX, useMemo } from 'react';
import { ContributionData } from '../services/githubGraphQLService';
import { calculateBadges } from './DeveloperBadges';
import { aggregateLanguageData } from '../services/githubService';
import { Icons } from './shared/Icons';
import { motion } from 'framer-motion';

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
    forks: number;
    languages: number;
    quality: number;
    prs: number;
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
  const user1Badges = useMemo(
    () => calculateBadges(user1.repositories, user1.contributionData),
    [user1.repositories, user1.contributionData]
  );

  const user2Badges = useMemo(
    () => calculateBadges(user2.repositories, user2.contributionData),
    [user2.repositories, user2.contributionData]
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const bannerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Battle Result Banner */}
      <motion.div
        className="bg-gradient-to-r from-accent-1 to-accent-2 text-white rounded-lg p-8 shadow-lg relative overflow-hidden"
        variants={bannerVariants}
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Icons.Trophy className="w-8 h-8" />
            Battle Results
          </h2>
          {isDraw ? (
            <p className="text-xl text-center font-bold">
              It&apos;s a draw! Both developers are evenly matched!
            </p>
          ) : (
            <div className="text-center">
              <div className="inline-block bg-white/20 px-4 py-2 rounded-full mb-2">
                <span className="text-xl font-bold">
                  {winner === 1 ? user1.user.login : user2.user.login}
                </span>
              </div>
              <p className="text-xl font-bold">
                wins with{' '}
                <span className="text-2xl bg-white/30 px-2 py-0.5 rounded">
                  {winner === 1 ? user1Score.totalScore : user2Score.totalScore}
                </span>{' '}
                points!
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Battle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User 1 Card */}
        <UserBattleCard
          userData={user1}
          score={user1Score}
          badges={user1Badges}
          languages={user1Languages}
          isWinner={winner === 1 && !isDraw}
          isDraw={isDraw}
          opponent={{ ...user2, score: user2Score }}
          formatDate={formatDate}
          calculateAccountAge={calculateAccountAge}
          variants={itemVariants}
        />

        {/* User 2 Card */}
        <UserBattleCard
          userData={user2}
          score={user2Score}
          badges={user2Badges}
          languages={user2Languages}
          isWinner={winner === 2 && !isDraw}
          isDraw={isDraw}
          opponent={{ ...user1, score: user1Score }}
          formatDate={formatDate}
          calculateAccountAge={calculateAccountAge}
          variants={itemVariants}
        />
      </div>

      {/* Score Breakdown */}
      <motion.div
        className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-8 border border-border-l dark:border-border-d shadow-md"
        variants={itemVariants}
      >
        <h3 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-6 flex items-center gap-2">
          <Icons.Award className="w-5 h-5 text-accent-1" />
          Score Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScoreBreakdownItem
            label="Repositories"
            user1Score={user1Score.metrics.repos}
            user2Score={user2Score.metrics.repos}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
            icon={<Icons.Repository className="w-4 h-4 text-accent-1" />}
          />
          <ScoreBreakdownItem
            label="Stars"
            user1Score={user1Score.metrics.stars}
            user2Score={user2Score.metrics.stars}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
            icon={<Icons.Star className="w-4 h-4 text-accent-1" />}
          />
          <ScoreBreakdownItem
            label="Commits"
            user1Score={user1Score.metrics.commits}
            user2Score={user2Score.metrics.commits}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
            icon={<Icons.Commit className="w-4 h-4 text-accent-1" />}
          />
          <ScoreBreakdownItem
            label="Followers"
            user1Score={user1Score.metrics.followers}
            user2Score={user2Score.metrics.followers}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
            icon={<Icons.Users className="w-4 h-4 text-accent-1" />}
          />
          <ScoreBreakdownItem
            label="Experience"
            user1Score={user1Score.metrics.experience}
            user2Score={user2Score.metrics.experience}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
            icon={<Icons.Calendar className="w-4 h-4 text-accent-1" />}
          />
          <ScoreBreakdownItem
            label="Forks"
            user1Score={user1Score.metrics.forks}
            user2Score={user2Score.metrics.forks}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
            icon={<Icons.GitBranch className="w-4 h-4 text-accent-1" />}
          />
          <ScoreBreakdownItem
            label="Languages"
            user1Score={user1Score.metrics.languages}
            user2Score={user2Score.metrics.languages}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
            icon={<Icons.Languages className="w-4 h-4 text-accent-1" />}
          />
          <ScoreBreakdownItem
            label="Quality"
            user1Score={user1Score.metrics.quality}
            user2Score={user2Score.metrics.quality}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
            icon={<Icons.BadgeCheck className="w-4 h-4 text-accent-1" />}
          />
          <ScoreBreakdownItem
            label="PRs"
            user1Score={user1Score.metrics.prs}
            user2Score={user2Score.metrics.prs}
            user1Name={user1.user.login}
            user2Name={user2.user.login}
            icon={<Icons.GitPullRequest className="w-4 h-4 text-accent-1" />}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// UserBattleCard component for improved layout
interface UserBattleCardProps {
  userData: BattleUserData;
  score: ScoreDetails;
  badges: {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    tier: string;
    earned: boolean;
  }[];
  languages: {
    name: string;
    color: string;
    percentage: number;
  }[];
  isWinner: boolean;
  isDraw: boolean;
  opponent: {
    user: GithubUser;
    repositories: Repository[];
    contributionData?: ContributionData;
    score: ScoreDetails;
  };
  formatDate: (dateString: string) => string;
  calculateAccountAge: (createdAt: string) => string;
  variants: {
    hidden: {
      y: number;
      opacity: number;
    };
    visible: {
      y: number;
      opacity: number;
      transition: {
        duration: number;
      };
    };
  };
}

function UserBattleCard({
  userData,
  score,
  badges,
  languages,
  isWinner,
  isDraw,
  opponent,
  formatDate,
  calculateAccountAge,
  variants,
}: UserBattleCardProps) {
  const { user, repositories, contributionData } = userData;

  // Calculate comparison metrics
  const totalStars = repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const opponentStars = opponent.repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  const totalCommits = contributionData?.totalContributions || 0;
  const opponentCommits = opponent.contributionData?.totalContributions || 0;

  return (
    <motion.div
      variants={variants}
      className={`bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border-2 ${
        isWinner
          ? 'border-accent-success shadow-lg shadow-accent-success/10'
          : isDraw
            ? 'border-accent-1 shadow-lg shadow-accent-1/10'
            : 'border-border-l dark:border-border-d'
      } overflow-hidden transition-all hover:shadow-xl`}
    >
      {isWinner && (
        <div className="bg-accent-success text-white text-center py-2 font-bold flex items-center justify-center gap-2">
          <Icons.Trophy className="w-4 h-4" />
          WINNER
        </div>
      )}
      {isDraw && (
        <div className="bg-accent-1 text-white text-center py-2 font-bold flex items-center justify-center gap-2">
          <Icons.Medal className="w-4 h-4" />
          DRAW
        </div>
      )}

      <div className="p-6">
        {/* Profile Header */}
        <div className="flex gap-4 items-center mb-6">
          <div className="relative">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-20 h-20 rounded-lg border-2 border-border-l dark:border-border-d"
            />
            {(isWinner || isDraw) && (
              <motion.div
                className="absolute -top-3 -right-3 bg-accent-success text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white dark:border-d-bg-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
              >
                {isWinner ? (
                  <Icons.Trophy className="w-4 h-4" />
                ) : (
                  <Icons.Medal className="w-4 h-4" />
                )}
              </motion.div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 flex items-center gap-2">
              {user.name || user.login}
              {user.name && (
                <span className="text-base font-normal text-l-text-2 dark:text-d-text-2">
                  @{user.login}
                </span>
              )}
            </h3>
            {user.bio && (
              <p className="text-l-text-2 dark:text-d-text-2 text-sm line-clamp-2 mt-1">
                {user.bio}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl font-bold text-accent-1">
              {score.totalScore}
            </div>
            <div className="text-sm text-l-text-3 dark:text-d-text-3">
              points
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Icons.Repository className="w-4 h-4 text-accent-1" />
                <span className="font-medium text-l-text-1 dark:text-d-text-1">
                  Repositories
                </span>
              </div>
              {user.public_repos > opponent.user.public_repos && (
                <span className="text-xs bg-accent-success/20 text-accent-success p-1 rounded font-medium flex items-center">
                  <Icons.ChevronUp className="w-3 h-3 mr-1" />
                  {user.public_repos - opponent.user.public_repos}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              {user.public_repos.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-accent-1 mt-1">
              +{score.metrics.repos} points
            </div>
          </div>

          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Icons.Users className="w-4 h-4 text-accent-1" />
                <span className="font-medium text-l-text-1 dark:text-d-text-1">
                  Followers
                </span>
              </div>
              {user.followers > opponent.user.followers && (
                <span className="text-xs bg-accent-success/20 text-accent-success p-1 rounded font-medium flex items-center">
                  <Icons.ChevronUp className="w-3 h-3 mr-1" />
                  {user.followers - opponent.user.followers}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              {user.followers.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-accent-1 mt-1">
              +{score.metrics.followers} points
            </div>
          </div>

          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Icons.Star className="w-4 h-4 text-accent-1" />
                <span className="font-medium text-l-text-1 dark:text-d-text-1">
                  Stars
                </span>
              </div>
              {totalStars > opponentStars && (
                <span className="text-xs bg-accent-success/20 text-accent-success p-1 rounded font-medium flex items-center">
                  <Icons.ChevronUp className="w-3 h-3 mr-1" />
                  {totalStars - opponentStars}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              {totalStars.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-accent-1 mt-1">
              +{score.metrics.stars} points
            </div>
          </div>

          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Icons.Commit className="w-4 h-4 text-accent-1" />
                <span className="font-medium text-l-text-1 dark:text-d-text-1">
                  Commits
                </span>
              </div>
              {totalCommits > opponentCommits && (
                <span className="text-xs bg-accent-success/20 text-accent-success p-1 rounded font-medium flex items-center">
                  <Icons.ChevronUp className="w-3 h-3 mr-1" />
                  {totalCommits - opponentCommits}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              {totalCommits.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-accent-1 mt-1">
              +{score.metrics.commits} points
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Icons.GitBranch className="w-4 h-4 text-accent-1" />
                <span className="font-medium text-l-text-1 dark:text-d-text-1">
                  Forks
                </span>
              </div>
              {score.metrics.forks > opponent.score.metrics.forks && (
                <span className="text-xs bg-accent-success/20 text-accent-success p-1 rounded font-medium flex items-center">
                  <Icons.ChevronUp className="w-3 h-3 mr-1" />
                  {score.metrics.forks - opponent.score.metrics.forks}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              {repositories
                .reduce((sum, repo) => sum + repo.forks_count, 0)
                .toLocaleString()}
            </div>
            <div className="text-xs font-medium text-accent-1 mt-1">
              +{score.metrics.forks} points
            </div>
          </div>

          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Icons.Languages className="w-4 h-4 text-accent-1" />
                <span className="font-medium text-l-text-1 dark:text-d-text-1">
                  Languages
                </span>
              </div>
              {score.metrics.languages > opponent.score.metrics.languages && (
                <span className="text-xs bg-accent-success/20 text-accent-success p-1 rounded font-medium flex items-center">
                  <Icons.ChevronUp className="w-3 h-3 mr-1" />
                  {score.metrics.languages - opponent.score.metrics.languages}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              {
                new Set(repositories.map(repo => repo.language).filter(Boolean))
                  .size
              }
            </div>
            <div className="text-xs font-medium text-accent-1 mt-1">
              +{score.metrics.languages} points
            </div>
          </div>

          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Icons.BadgeCheck className="w-4 h-4 text-accent-1" />
                <span className="font-medium text-l-text-1 dark:text-d-text-1">
                  Quality Projects
                </span>
              </div>
              {score.metrics.quality > opponent.score.metrics.quality && (
                <span className="text-xs bg-accent-success/20 text-accent-success p-1 rounded font-medium flex items-center">
                  <Icons.ChevronUp className="w-3 h-3 mr-1" />
                  {score.metrics.quality - opponent.score.metrics.quality}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              {
                repositories.filter(
                  repo => !repo.fork && repo.stargazers_count > 0
                ).length
              }
            </div>
            <div className="text-xs font-medium text-accent-1 mt-1">
              +{score.metrics.quality} points
            </div>
          </div>

          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Icons.GitPullRequest className="w-4 h-4 text-accent-1" />
                <span className="font-medium text-l-text-1 dark:text-d-text-1">
                  Pull Requests
                </span>
              </div>
              {score.metrics.prs > opponent.score.metrics.prs && (
                <span className="text-xs bg-accent-success/20 text-accent-success p-1 rounded font-medium flex items-center">
                  <Icons.ChevronUp className="w-3 h-3 mr-1" />
                  {score.metrics.prs - opponent.score.metrics.prs}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              {Math.round(totalCommits * 0.1).toLocaleString()}
              <span className="text-xs text-l-text-3 dark:text-d-text-3 ml-1">
                (est.)
              </span>
            </div>
            <div className="text-xs font-medium text-accent-1 mt-1">
              +{score.metrics.prs} points
            </div>
          </div>
        </div>

        {/* GitHub Details */}
        <div className="bg-l-bg-1/50 dark:bg-d-bg-1/50 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 mb-6">
          <h4 className="text-sm font-medium text-l-text-1 dark:text-d-text-1 mb-3 flex items-center gap-1.5">
            <Icons.Info className="w-4 h-4 text-accent-1" />
            Developer Info
          </h4>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2 text-l-text-2 dark:text-d-text-2">
              <Icons.MapPin className="w-4 h-4 text-l-text-3 dark:text-d-text-3" />
              {user.location || 'Location not specified'}
            </div>
            <div className="flex items-center gap-2 text-l-text-2 dark:text-d-text-2">
              <Icons.Calendar className="w-4 h-4 text-l-text-3 dark:text-d-text-3" />
              Joined {formatDate(user.created_at)} (
              {calculateAccountAge(user.created_at)} years)
              <span className="text-xs bg-accent-1/10 text-accent-1 px-2 py-0.5 rounded-full ml-auto">
                +{score.metrics.experience} exp points
              </span>
            </div>

            <div className="flex gap-2 text-l-text-2 dark:text-d-text-2">
              <Icons.Code className="w-4 h-4 text-l-text-3 dark:text-d-text-3 mt-0.5" />
              <div className="flex-grow">
                <div>Top languages:</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.length > 0 ? (
                    languages.map(lang => (
                      <span
                        key={lang.name}
                        className="inline-flex items-center gap-1.5 text-xs px-2 py-1 bg-l-bg-2 dark:bg-d-bg-2 rounded-full"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: lang.color }}
                        />
                        {lang.name}
                        <span className="opacity-70">{lang.percentage}%</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-l-text-3 dark:text-d-text-3">
                      No language data available
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earned Badges */}
        <div>
          <h4 className="text-sm font-medium text-l-text-1 dark:text-d-text-1 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Icons.Medal className="w-4 h-4 text-accent-1" />
              Developer Achievements
            </span>
            <span className="text-xs text-l-text-3 dark:text-d-text-3">
              {badges.filter(b => b.earned).length} earned
            </span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {badges
              .filter(b => b.earned)
              .map(badge => (
                <div
                  key={badge.id}
                  className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 
                  ${getBadgeBgClass(badge.tier)} ${getBadgeTextClass(badge.tier)} shadow-sm hover:shadow-md transition-shadow`}
                  title={badge.description}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    {React.createElement(badge.icon, {
                      className: 'w-full h-full',
                    })}
                  </span>
                  {badge.name}
                </div>
              ))}
            {badges.filter(b => b.earned).length === 0 && (
              <div className="text-sm text-l-text-3 dark:text-d-text-3 italic">
                No badges earned yet
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper components
function ScoreBreakdownItem({
  label,
  user1Score,
  user2Score,
  user1Name,
  user2Name,
  icon,
}: {
  label: string;
  user1Score: number;
  user2Score: number;
  user1Name: string;
  user2Name: string;
  icon: JSX.Element;
}) {
  const totalScore = user1Score + user2Score;
  const user1Percentage = totalScore > 0 ? (user1Score / totalScore) * 100 : 50;
  const winner = user1Score > user2Score ? 1 : user2Score > user1Score ? 2 : 0;

  return (
    <motion.div
      className="flex flex-col bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30"
      whileHover={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      <div className="text-sm text-l-text-1 dark:text-d-text-1 font-medium mb-2 flex items-center gap-2">
        {icon}
        {label}
      </div>
      <div className="flex items-center justify-between text-xs mb-2">
        <span
          className={`${winner === 1 ? 'text-accent-success font-medium' : 'text-l-text-2 dark:text-d-text-2'} flex items-center gap-1`}
        >
          {winner === 1 && <Icons.ChevronUp className="w-3 h-3" />}
          {user1Name}: {user1Score}
        </span>
        <span className="text-l-text-3 dark:text-d-text-3">vs</span>
        <span
          className={`${winner === 2 ? 'text-accent-success font-medium' : 'text-l-text-2 dark:text-d-text-2'} flex items-center gap-1`}
        >
          {user2Name}: {user2Score}
          {winner === 2 && <Icons.ChevronUp className="w-3 h-3" />}
        </span>
      </div>
      <div className="h-3 bg-l-bg-3 dark:bg-d-bg-3 rounded-full overflow-hidden relative mt-1">
        <div
          className={`h-full ${winner === 1 ? 'bg-accent-success' : 'bg-accent-1'}`}
          style={{
            width: `${user1Percentage}%`,
            transition: 'width 1s ease-out',
          }}
        ></div>
        <div
          className={`h-full ${winner === 2 ? 'bg-accent-success' : 'bg-accent-2'}`}
          style={{
            width: `${100 - user1Percentage}%`,
            position: 'absolute',
            top: 0,
            right: 0,
            transition: 'width 1s ease-out',
          }}
        ></div>
        <div
          className="absolute top-0 left-0 h-full border-r-2 border-white"
          style={{ left: `${user1Percentage}%` }}
        ></div>
      </div>
    </motion.div>
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

  // Calculate forks (4 points per fork, max 200)
  const totalForks = repositories.reduce(
    (sum, repo) => sum + repo.forks_count,
    0
  );
  const forkPoints = Math.min(totalForks * 4, 200);

  // Calculate language diversity (10 points per language, max 100)
  const languages = new Set(
    repositories.map(repo => repo.language).filter(Boolean)
  );
  const languagePoints = Math.min(languages.size * 10, 100);

  // Calculate project quality (non-forked repos with stars > 0, 15 points each, max 150)
  const qualityProjects = repositories.filter(
    repo => !repo.fork && repo.stargazers_count > 0
  ).length;
  const qualityPoints = Math.min(qualityProjects * 15, 150);

  // Calculate contribution quality (PRs and issues can be estimated from contribution data)
  // Since we don't have direct PR data, we'll estimate based on commits (10% of commit points)
  const prPoints = Math.floor(commitPoints * 0.1);

  // Calculate total score
  const totalScore =
    starPoints +
    repoPoints +
    followerPoints +
    commitPoints +
    experiencePoints +
    forkPoints +
    languagePoints +
    qualityPoints +
    prPoints;

  return {
    totalScore,
    metrics: {
      stars: starPoints,
      repos: repoPoints,
      commits: commitPoints,
      followers: followerPoints,
      experience: experiencePoints,
      forks: forkPoints,
      languages: languagePoints,
      quality: qualityPoints,
      prs: prPoints,
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
