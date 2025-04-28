import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../shared/Icons';
import { calculateBadges } from '../../hooks/useBadgeFunctions';
import { aggregateLanguageData } from '../../services/githubService';
import {
  calculateScore,
  getMaxPossibleScore,
  getScoringMetrics,
} from '../../utils/githubBattleScoring';
import { getIconForMetric } from '../../utils/iconUtils';
import { UserBattleCard } from './UserBattleCard';
import { ScoreBreakdownItem } from './ScoreBreakdownItem';
import { ScoringMethodItem } from './ScoringMethodItem';
import { ContributionData } from '../../services/githubGraphQLService';
import BattleResultBanner from './BattleResultBanner';

interface BattleUserData {
  user: GithubUser;
  repositories: Repository[];
  contributionData?: ContributionData;
}

interface GithubBattleResultsProps {
  user1: BattleUserData;
  user2: BattleUserData;
}

export default function GithubBattleResults({
  user1,
  user2,
}: GithubBattleResultsProps) {
  // Calculate scores for both users
  const user1Score = useMemo(() => calculateScore(user1), [user1]);
  const user2Score = useMemo(() => calculateScore(user2), [user2]);

  // Determine if this is an organization battle
  const isOrgBattle =
    user1.user.type === 'Organization' && user2.user.type === 'Organization';

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

  // Track if scoring explanation is expanded
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);

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

  // Get scoring metrics for explanation section
  const scoringMetrics = getScoringMetrics(isOrgBattle);
  const maxPossibleScore = getMaxPossibleScore(isOrgBattle);

  // Get the entity type label for display
  const entityType = isOrgBattle ? 'organization' : 'developer';

  return (
    <motion.div
      className="space-y-6 sm:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Battle Result Banner - extracted to its own component */}
      <BattleResultBanner
        user1={{
          user: user1.user,
          repositories: user1.repositories,
          score: user1Score,
        }}
        user2={{
          user: user2.user,
          repositories: user2.repositories,
          score: user2Score,
        }}
        maxPossibleScore={maxPossibleScore}
        isDraw={isDraw}
        winner={winner}
        isOrgBattle={isOrgBattle}
        user1Languages={user1Languages}
        user2Languages={user2Languages}
        calculateAccountAge={calculateAccountAge}
      />

      {/* Battle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

      {/* Score Breakdown - Improved for mobile */}
      <motion.div
        className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-5 sm:p-8 border border-border-l dark:border-border-d shadow-md"
        variants={itemVariants}
      >
        <h3 className="text-lg sm:text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-4 sm:mb-6 flex items-center gap-2">
          <Icons.Award className="w-5 h-5 text-accent-1" />
          Score Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {/* Common metrics for both users and organizations */}
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

          {/* User-specific metrics */}
          {!isOrgBattle && (
            <>
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
                label="PRs"
                user1Score={user1Score.metrics.prs}
                user2Score={user2Score.metrics.prs}
                user1Name={user1.user.login}
                user2Name={user2.user.login}
                icon={
                  <Icons.GitPullRequest className="w-4 h-4 text-accent-1" />
                }
              />
            </>
          )}

          {/* Organization-specific metrics */}
          {isOrgBattle && (
            <ScoreBreakdownItem
              label="Activity"
              user1Score={user1Score.metrics.activity}
              user2Score={user2Score.metrics.activity}
              user1Name={user1.user.login}
              user2Name={user2.user.login}
              icon={<Icons.Activity className="w-4 h-4 text-accent-1" />}
            />
          )}
        </div>
      </motion.div>

      {/* Scoring Methodology Explanation - Expandable/collapsible section */}
      <motion.div
        className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border border-border-l dark:border-border-d shadow-md overflow-hidden"
        variants={itemVariants}
      >
        <div
          className="p-5 sm:p-6 flex items-center justify-between cursor-pointer"
          onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsExplanationExpanded(!isExplanationExpanded);
            }
          }}
        >
          <div className="flex items-center gap-2">
            <Icons.Calculator className="w-5 h-5 text-accent-1" />
            <h3 className="text-lg font-bold text-l-text-1 dark:text-d-text-1">
              How Scores Are Calculated
            </h3>
          </div>
          <Icons.ChevronDown
            className={`w-5 h-5 text-l-text-2 dark:text-d-text-2 transition-transform ${
              isExplanationExpanded ? 'transform rotate-180' : ''
            }`}
          />
        </div>

        <motion.div
          className="px-5 sm:px-6 overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isExplanationExpanded ? 'auto' : 0,
            opacity: isExplanationExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="pb-6 pt-2 border-t border-border-l dark:border-border-d">
            <p className="text-l-text-2 dark:text-d-text-2 mb-4">
              DevInsight calculates GitHub{' '}
              {isOrgBattle ? 'Organization' : 'Developer'} Battle scores based
              on a comprehensive evaluation of {entityType} profiles. Each
              metric contributes to the total score with specific point values
              and maximum limits:
            </p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {scoringMetrics.map(metric => (
                  <ScoringMethodItem
                    key={metric.id}
                    icon={getIconForMetric(metric.id)}
                    title={metric.title}
                    formula={metric.formula}
                    maxPoints={metric.maxPoints}
                    description={metric.description}
                  />
                ))}
              </div>

              <div className="pt-2">
                <h4 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2 flex items-center gap-2">
                  <Icons.Calculator className="w-4 h-4 text-accent-1" />
                  Final Score Calculation
                </h4>
                <p className="text-l-text-2 dark:text-d-text-2 bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30">
                  The final score is the sum of points earned across all
                  metrics, with each metric subject to its maximum limit.
                  Maximum possible total score is {maxPossibleScore} points for{' '}
                  {isOrgBattle ? 'organizations' : 'developers'}.
                </p>
              </div>

              <div className="bg-accent-1/10 dark:bg-accent-1/20 p-4 rounded-lg">
                <p className="text-sm text-accent-1">
                  <span className="font-medium">Note:</span> The scoring system
                  is designed to provide a balanced evaluation of a{entityType}
                  &apos;s GitHub profile. Each metric has a maximum point value
                  to ensure that profiles are assessed across multiple
                  dimensions rather than excelling in just one area.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
