import { motion } from 'framer-motion';
import { Icons } from '../shared/Icons';

interface BattleLanguage {
  name: string;
  percentage: number;
  color: string;
}

interface BattleUserData {
  user: GithubUser;
  repositories: Repository[];
  score: {
    totalScore: number;
    metrics: Record<string, number>;
  };
}

interface BattleResultsBannerProps {
  user1: BattleUserData;
  user2: BattleUserData;
  maxPossibleScore: number;
  isDraw: boolean;
  winner: number;
  isOrgBattle: boolean;
  user1Languages: BattleLanguage[];
  user2Languages: BattleLanguage[];
  calculateAccountAge: (createdAt: string) => string;
}

export function BattleResultsBanner({
  user1,
  user2,
  maxPossibleScore,
  isDraw,
  winner,
  isOrgBattle,
  user1Languages,
  user2Languages,
  calculateAccountAge,
}: BattleResultsBannerProps) {
  const entityType = isOrgBattle ? 'Organization' : 'Developer';
  const winnerData = winner === 1 ? user1 : user2;
  const loserData = winner === 1 ? user2 : user1;

  // Calculate some useful metrics
  const winnerScore = winnerData.score.totalScore;
  const loserScore = loserData.score.totalScore;
  const scoreDifference = !isDraw ? winnerScore - loserScore : 0;
  const winnerScorePercentage = Math.round(
    (winnerScore / maxPossibleScore) * 100
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  const scoreCounterVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        delay: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
      },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="bg-l-bg-1 dark:bg-d-bg-1 rounded-xl overflow-hidden border border-border-l dark:border-border-d shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header - Trophy section */}
      <div
        className={`relative px-6 py-8 sm:px-8 ${isDraw ? 'bg-gradient-to-r from-accent-1/80 to-accent-2/80' : 'bg-gradient-to-r from-accent-success/80 to-accent-1/60'} text-white`}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        </div>

        <motion.div
          className="relative flex flex-col items-center z-10"
          variants={itemVariants}
        >
          {/* Title with icon */}
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full mr-3"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Icons.Trophy className="w-8 h-8 text-yellow-300" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {entityType} Battle Results
            </h1>
          </div>

          {/* Result display */}
          {isDraw ? (
            <motion.div className="text-center mb-4" variants={itemVariants}>
              <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg px-5 py-2 mb-3">
                <Icons.Medal className="w-5 h-5 mr-2" />
                <span className="text-xl font-semibold">It&apos;s a Draw!</span>
              </div>
              <p className="text-white/80">
                Both {entityType.toLowerCase()}s achieved{' '}
                {user1.score.totalScore} points (
                {Math.round((user1.score.totalScore / maxPossibleScore) * 100)}%
                of max possible score)
              </p>
            </motion.div>
          ) : (
            <motion.div className="text-center mb-4" variants={itemVariants}>
              <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg px-5 py-2 mb-3">
                <Icons.Trophy className="w-5 h-5 mr-2 text-yellow-300" />
                <span className="text-xl font-semibold">
                  {winnerData.user.login} Wins!
                </span>
              </div>
              <motion.div
                className="text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                With a score of <span className="font-bold">{winnerScore}</span>{' '}
                points ({winnerScorePercentage}% of max possible score)
              </motion.div>
            </motion.div>
          )}

          {/* Score indicator */}
          <motion.div
            className="w-full max-w-xl mx-auto mb-2"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center text-sm mb-2">
              <div className="flex items-center">
                <span
                  className={`font-medium ${isDraw || winner === 1 ? 'text-white' : 'text-white/70'}`}
                >
                  {user1.user.login}
                </span>
                <div
                  className={`ml-2 px-1.5 py-0.5 rounded-md bg-white/20 ${isDraw || winner === 1 ? 'text-white font-medium' : 'text-white/70'}`}
                >
                  {user1.score.totalScore}
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className={`mr-2 px-1.5 py-0.5 rounded-md bg-white/20 ${isDraw || winner === 2 ? 'text-white font-medium' : 'text-white/70'}`}
                >
                  {user2.score.totalScore}
                </div>
                <span
                  className={`font-medium ${isDraw || winner === 2 ? 'text-white' : 'text-white/70'}`}
                >
                  {user2.user.login}
                </span>
              </div>
            </div>

            <div className="h-2 bg-white/20 rounded-full overflow-hidden flex">
              <motion.div
                className={`h-full ${isDraw ? 'bg-accent-1' : 'bg-accent-success'}`}
                style={{
                  width: `${(user1.score.totalScore / (user1.score.totalScore + user2.score.totalScore)) * 100}%`,
                }}
                initial={{ width: '50%' }}
                animate={{
                  width: `${(user1.score.totalScore / (user1.score.totalScore + user2.score.totalScore)) * 100}%`,
                }}
                transition={{ duration: 1, delay: 0.2 }}
              />
              <motion.div
                className="h-full bg-accent-1"
                style={{
                  width: `${(user2.score.totalScore / (user1.score.totalScore + user2.score.totalScore)) * 100}%`,
                }}
              />
            </div>
          </motion.div>

          {!isDraw && (
            <motion.div
              className="text-sm text-white/70 mb-3 flex items-center justify-center"
              variants={itemVariants}
            >
              <Icons.ArrowUpRight className="w-3.5 h-3.5 mr-1 text-accent-success" />
              Won by {scoreDifference} points (
              {Math.round((scoreDifference / loserScore) * 100)}% margin)
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Stats Cards Section */}
      <div className="p-4 sm:p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* User 1 Card */}
        <motion.div
          className={`bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-4 border ${winner === 1 && !isDraw ? 'border-accent-success shadow-md shadow-accent-success/10' : isDraw ? 'border-accent-1 shadow-md shadow-accent-1/10' : 'border-border-l dark:border-border-d'}`}
          variants={cardVariants}
          whileHover={{ translateY: -2, transition: { duration: 0.2 } }}
        >
          {/* Header */}
          <div className="flex items-center mb-3">
            <img
              src={user1.user.avatar_url}
              alt={user1.user.login}
              className="w-10 h-10 rounded-full border-2 border-l-bg-1 dark:border-d-bg-1"
            />
            <div className="ml-3">
              <div className="flex items-center">
                <h3 className="font-semibold text-l-text-1 dark:text-d-text-1">
                  {user1.user.login}
                </h3>
                {winner === 1 && !isDraw && (
                  <span className="ml-2 bg-accent-success/20 text-accent-success text-xs px-1.5 py-0.5 rounded-full flex items-center">
                    <Icons.Trophy className="w-3 h-3 mr-0.5" />
                    Winner
                  </span>
                )}
                {isDraw && (
                  <span className="ml-2 bg-accent-1/20 text-accent-1 text-xs px-1.5 py-0.5 rounded-full">
                    Draw
                  </span>
                )}
              </div>
              <div className="text-xs text-l-text-2 dark:text-d-text-2">
                {isOrgBattle ? 'Organization' : 'Developer'} •{' '}
                {calculateAccountAge(user1.user.created_at)} years
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <motion.div
              className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-md flex items-center"
              variants={statVariants}
            >
              <div className="p-1.5 bg-accent-1/10 rounded-md mr-2">
                <Icons.Star className="w-3.5 h-3.5 text-accent-1" />
              </div>
              <div>
                <div className="text-xs text-l-text-2 dark:text-d-text-2">
                  Stars
                </div>
                <div className="font-medium text-l-text-1 dark:text-d-text-1">
                  {user1.score.metrics.stars || 0}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-md flex items-center"
              variants={statVariants}
            >
              <div className="p-1.5 bg-accent-1/10 rounded-md mr-2">
                <Icons.Repository className="w-3.5 h-3.5 text-accent-1" />
              </div>
              <div>
                <div className="text-xs text-l-text-2 dark:text-d-text-2">
                  Repos
                </div>
                <div className="font-medium text-l-text-1 dark:text-d-text-1">
                  {user1.repositories.length}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Languages */}
          <div className="mb-3">
            <div className="text-xs text-l-text-2 dark:text-d-text-2 mb-1 flex items-center">
              <Icons.Code className="w-3.5 h-3.5 mr-1" />
              Top Languages
            </div>
            <div className="flex gap-2 flex-wrap">
              {user1Languages.map(lang => (
                <div
                  key={lang.name}
                  className="text-xs px-2 py-1 bg-l-bg-1 dark:bg-d-bg-1 rounded-full flex items-center"
                >
                  <div
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: lang.color }}
                  />
                  {lang.name}
                </div>
              ))}
            </div>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="text-xs text-l-text-2 dark:text-d-text-2 mb-1">
              Score
            </div>
            <motion.div
              className="text-2xl font-bold text-l-text-1 dark:text-d-text-1"
              variants={scoreCounterVariants}
            >
              {user1.score.totalScore}
              <span className="text-xs font-normal text-l-text-2 dark:text-d-text-2 ml-1">
                / {maxPossibleScore}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* User 2 Card */}
        <motion.div
          className={`bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-4 border ${winner === 2 && !isDraw ? 'border-accent-success shadow-md shadow-accent-success/10' : isDraw ? 'border-accent-1 shadow-md shadow-accent-1/10' : 'border-border-l dark:border-border-d'}`}
          variants={cardVariants}
          whileHover={{ translateY: -2, transition: { duration: 0.2 } }}
        >
          {/* Header */}
          <div className="flex items-center mb-3">
            <img
              src={user2.user.avatar_url}
              alt={user2.user.login}
              className="w-10 h-10 rounded-full border-2 border-l-bg-1 dark:border-d-bg-1"
            />
            <div className="ml-3">
              <div className="flex items-center">
                <h3 className="font-semibold text-l-text-1 dark:text-d-text-1">
                  {user2.user.login}
                </h3>
                {winner === 2 && !isDraw && (
                  <span className="ml-2 bg-accent-success/20 text-accent-success text-xs px-1.5 py-0.5 rounded-full flex items-center">
                    <Icons.Trophy className="w-3 h-3 mr-0.5" />
                    Winner
                  </span>
                )}
                {isDraw && (
                  <span className="ml-2 bg-accent-1/20 text-accent-1 text-xs px-1.5 py-0.5 rounded-full">
                    Draw
                  </span>
                )}
              </div>
              <div className="text-xs text-l-text-2 dark:text-d-text-2">
                {isOrgBattle ? 'Organization' : 'Developer'} •{' '}
                {calculateAccountAge(user2.user.created_at)} years
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <motion.div
              className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-md flex items-center"
              variants={statVariants}
            >
              <div className="p-1.5 bg-accent-1/10 rounded-md mr-2">
                <Icons.Star className="w-3.5 h-3.5 text-accent-1" />
              </div>
              <div>
                <div className="text-xs text-l-text-2 dark:text-d-text-2">
                  Stars
                </div>
                <div className="font-medium text-l-text-1 dark:text-d-text-1">
                  {user2.score.metrics.stars || 0}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-md flex items-center"
              variants={statVariants}
            >
              <div className="p-1.5 bg-accent-1/10 rounded-md mr-2">
                <Icons.Repository className="w-3.5 h-3.5 text-accent-1" />
              </div>
              <div>
                <div className="text-xs text-l-text-2 dark:text-d-text-2">
                  Repos
                </div>
                <div className="font-medium text-l-text-1 dark:text-d-text-1">
                  {user2.repositories.length}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Languages */}
          <div className="mb-3">
            <div className="text-xs text-l-text-2 dark:text-d-text-2 mb-1 flex items-center">
              <Icons.Code className="w-3.5 h-3.5 mr-1" />
              Top Languages
            </div>
            <div className="flex gap-2 flex-wrap">
              {user2Languages.map(lang => (
                <div
                  key={lang.name}
                  className="text-xs px-2 py-1 bg-l-bg-1 dark:bg-d-bg-1 rounded-full flex items-center"
                >
                  <div
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: lang.color }}
                  />
                  {lang.name}
                </div>
              ))}
            </div>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="text-xs text-l-text-2 dark:text-d-text-2 mb-1">
              Score
            </div>
            <motion.div
              className="text-2xl font-bold text-l-text-1 dark:text-d-text-1"
              variants={scoreCounterVariants}
            >
              {user2.score.totalScore}
              <span className="text-xs font-normal text-l-text-2 dark:text-d-text-2 ml-1">
                / {maxPossibleScore}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
