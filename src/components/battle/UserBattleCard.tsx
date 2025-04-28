import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../shared/Icons';
import { ScoreDetails } from '../../utils/githubBattleScoring';
import { ContributionData } from '../../services/githubGraphQLService';
import { getBadgeBgClass, getBadgeTextClass } from '../../utils/badgeUtils';

export interface UserBattleCardProps {
  userData: {
    user: GithubUser;
    repositories: Repository[];
    contributionData?: ContributionData;
  };
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

/**
 * Component that displays a user or organization card with their GitHub data and battle stats
 */
export function UserBattleCard({
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
  const isOrg = user.type === 'Organization';

  // Calculate comparison metrics
  const totalStars = repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const opponentStars = opponent.repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  // Different metrics for organizations vs users
  const totalCommits = !isOrg ? contributionData?.totalContributions || 0 : 0;
  const opponentCommits = !isOrg
    ? opponent.contributionData?.totalContributions || 0
    : 0;

  // For organizations, calculate activity metric
  const recentlyUpdatedRepos = isOrg
    ? repositories.filter(repo => {
        const updatedAt = new Date(repo.updated_at);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return updatedAt > threeMonthsAgo;
      }).length
    : 0;

  const opponentRecentlyUpdatedRepos = isOrg
    ? opponent.repositories.filter(repo => {
        const updatedAt = new Date(repo.updated_at);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return updatedAt > threeMonthsAgo;
      }).length
    : 0;

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

      <div className="p-4 sm:p-6">
        {/* Profile Header - Improved for mobile */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div className="relative">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-border-l dark:border-border-d"
            />
            {(isWinner || isDraw) && (
              <motion.div
                className="absolute -top-3 -right-3 bg-accent-success text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-white dark:border-d-bg-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
              >
                {isWinner ? (
                  <Icons.Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <Icons.Medal className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </motion.div>
            )}
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-l-text-1 dark:text-d-text-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 justify-center sm:justify-start">
              {user.name || user.login}
              {user.name && (
                <span className="text-sm sm:text-base font-normal text-l-text-2 dark:text-d-text-2">
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
          <div className="flex flex-col items-center sm:items-end mt-2 sm:mt-0">
            <div className="text-2xl sm:text-3xl font-bold text-accent-1">
              {score.totalScore}
            </div>
            <div className="text-sm text-l-text-3 dark:text-d-text-3">
              points
            </div>
          </div>
        </div>

        {/* Stats - Make responsive for small screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Always show repositories for both users and orgs */}
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

          {/* Always show stars for both users and orgs */}
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

          {/* Show different metrics based on entity type */}
          {!isOrg ? (
            // User-specific metrics
            <>
              {/* Commits block */}
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

              {/* Followers block */}
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
            </>
          ) : (
            // Organization-specific metrics
            <>
              {/* Activity block for organizations */}
              <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Icons.Activity className="w-4 h-4 text-accent-1" />
                    <span className="font-medium text-l-text-1 dark:text-d-text-1 text-sm sm:text-base">
                      Recent Activity
                    </span>
                  </div>
                  {recentlyUpdatedRepos > opponentRecentlyUpdatedRepos && (
                    <span className="text-xs bg-accent-success/20 text-accent-success p-1 rounded font-medium flex items-center">
                      <Icons.ChevronUp className="w-3 h-3 mr-1" />
                      {recentlyUpdatedRepos - opponentRecentlyUpdatedRepos}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
                  {recentlyUpdatedRepos} active repos
                </div>
                <div className="text-xs font-medium text-accent-1 mt-1">
                  +{score.metrics.activity} points
                </div>
              </div>

              {/* Age block for organizations */}
              <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Icons.Calendar className="w-4 h-4 text-accent-1" />
                    <span className="font-medium text-l-text-1 dark:text-d-text-1 text-sm sm:text-base">
                      Organization Age
                    </span>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-l-text-1 dark:text-d-text-1">
                  {calculateAccountAge(user.created_at)} years
                </div>
                <div className="text-xs font-medium text-accent-1 mt-1">
                  +{score.metrics.experience} points
                </div>
              </div>
            </>
          )}

          {/* Continue with remaining blocks that apply to both... */}
          <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Icons.GitBranch className="w-4 h-4 text-accent-1" />
                <span className="font-medium text-l-text-1 dark:text-d-text-1 text-sm sm:text-base">
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
            <div className="text-xl sm:text-2xl font-bold text-l-text-1 dark:text-d-text-1">
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
                <span className="font-medium text-l-text-1 dark:text-d-text-1 text-sm sm:text-base">
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
            <div className="text-xl sm:text-2xl font-bold text-l-text-1 dark:text-d-text-1">
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
                <span className="font-medium text-l-text-1 dark:text-d-text-1 text-sm sm:text-base">
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
            <div className="text-xl sm:text-2xl font-bold text-l-text-1 dark:text-d-text-1">
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

          {/* Only show PRs for individual users, not organizations */}
          {!isOrg && (
            <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Icons.GitPullRequest className="w-4 h-4 text-accent-1" />
                  <span className="font-medium text-l-text-1 dark:text-d-text-1 text-sm sm:text-base">
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
              <div className="text-xl sm:text-2xl font-bold text-l-text-1 dark:text-d-text-1">
                {Math.round(totalCommits * 0.1).toLocaleString()}
                <span className="text-xs text-l-text-3 dark:text-d-text-3 ml-1">
                  (est.)
                </span>
              </div>
              <div className="text-xs font-medium text-accent-1 mt-1">
                +{score.metrics.prs} points
              </div>
            </div>
          )}
        </div>

        {/* GitHub Details - Improved for mobile */}
        <div className="bg-l-bg-1/50 dark:bg-d-bg-1/50 p-3 sm:p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 mb-6">
          <h4 className="text-sm font-medium text-l-text-1 dark:text-d-text-1 mb-3 flex items-center gap-1.5">
            <Icons.Info className="w-4 h-4 text-accent-1" />
            {isOrg ? 'Organization' : 'Developer'} Info
          </h4>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-start sm:items-center gap-2 text-l-text-2 dark:text-d-text-2">
              <Icons.MapPin className="w-4 h-4 text-l-text-3 dark:text-d-text-3 mt-0.5 sm:mt-0 flex-shrink-0" />
              <span className="break-words">
                {user.location || 'Location not specified'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-l-text-2 dark:text-d-text-2">
              <div className="flex items-center gap-2">
                <Icons.Calendar className="w-4 h-4 text-l-text-3 dark:text-d-text-3 flex-shrink-0" />
                <span>Joined {formatDate(user.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <span>({calculateAccountAge(user.created_at)} years)</span>
                <span className="text-xs bg-accent-1/10 text-accent-1 px-2 py-0.5 rounded-full">
                  +{score.metrics.experience} exp pts
                </span>
              </div>
            </div>

            <div className="flex gap-2 text-l-text-2 dark:text-d-text-2">
              <Icons.Code className="w-4 h-4 text-l-text-3 dark:text-d-text-3 mt-0.5 flex-shrink-0" />
              <div className="flex-grow">
                <div>Top languages:</div>
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                  {languages.length > 0 ? (
                    languages.map(lang => (
                      <span
                        key={lang.name}
                        className="inline-flex items-center gap-1 sm:gap-1.5 text-xs px-1.5 sm:px-2 py-1 bg-l-bg-2 dark:bg-d-bg-2 rounded-full"
                      >
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
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

        {/* Earned Badges - Improved for mobile */}
        <div>
          <h4 className="text-sm font-medium text-l-text-1 dark:text-d-text-1 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Icons.Medal className="w-4 h-4 text-accent-1" />
              {isOrg ? 'Organization' : 'Developer'} Achievements
            </span>
            <span className="text-xs text-l-text-3 dark:text-d-text-3">
              {badges.filter(b => b.earned).length} earned
            </span>
          </h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {badges
              .filter(b => b.earned)
              .map(badge => (
                <div
                  key={badge.id}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs flex items-center gap-1 sm:gap-1.5 
                  ${getBadgeBgClass(badge.tier)} ${getBadgeTextClass(badge.tier)} shadow-sm hover:shadow-md transition-shadow`}
                  title={badge.description}
                >
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center flex-shrink-0">
                    {React.createElement(badge.icon, {
                      className: 'w-full h-full',
                    })}
                  </span>
                  <span className="truncate max-w-[100px] sm:max-w-none">
                    {badge.name}
                  </span>
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
