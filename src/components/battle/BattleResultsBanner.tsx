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

  // Find top languages
  const getTopLanguage = (languages: BattleLanguage[]) => {
    return languages.length > 0 ? languages[0] : null;
  };

  const user1TopLang = getTopLanguage(user1Languages);
  const user2TopLang = getTopLanguage(user2Languages);

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

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 ${isDraw ? 'bg-gradient-to-r from-accent-1/80 to-accent-2/80' : 'bg-gradient-to-r from-accent-success/80 to-accent-1/60'}`}
      ></div>

      {/* Background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="relative z-10 px-5 py-6 sm:p-8 text-white">
        {/* Header with Trophy */}
        <motion.div
          className="flex flex-col items-center mb-6"
          variants={itemVariants}
        >
          <motion.div
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full mb-4"
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

          <h1 className="text-2xl sm:text-3xl font-bold text-center">
            {entityType} Battle Results
          </h1>
        </motion.div>

        {/* Result Banner */}
        <motion.div variants={itemVariants} className="mb-6">
          {isDraw ? (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg px-5 py-2 mb-3">
                <Icons.Medal className="w-5 h-5 mr-2" />
                <span className="text-xl font-semibold">It&apos;s a Draw!</span>
              </div>
              <p className="text-white/80 text-center">
                Both {entityType.toLowerCase()}s achieved{' '}
                {user1.score.totalScore} points
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg px-5 py-2 mb-3">
                <Icons.Trophy className="w-5 h-5 mr-2 text-yellow-300" />
                <span className="text-xl font-semibold">
                  {winnerData.user.login} Wins!
                </span>
              </div>

              <motion.div
                className="text-white/80 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                With {winnerScore} points ({winnerScorePercentage}% of possible
                score)
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Compact Battle Cards */}
        <div className="sm:flex gap-4 justify-center">
          {/* User 1 */}
          <motion.div
            className={`flex items-center p-3 ${winner === 1 && !isDraw ? 'bg-white/30' : 'bg-white/10'} backdrop-blur-sm rounded-lg mb-3 sm:mb-0 flex-1`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={user1.user.avatar_url}
              alt={user1.user.login}
              className={`w-10 h-10 rounded-full border-2 ${winner === 1 && !isDraw ? 'border-yellow-300' : 'border-white/20'}`}
            />

            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center">
                <h3 className="font-medium text-sm sm:text-base truncate">
                  {user1.user.login}
                </h3>
                {winner === 1 && !isDraw && (
                  <span className="ml-auto text-yellow-300 flex items-center text-xs">
                    <Icons.Trophy className="w-3 h-3 mr-1" />
                    Winner
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-white/80 text-xs">
                <motion.div
                  variants={scoreCounterVariants}
                  className="font-bold"
                >
                  {user1.score.totalScore} pts
                </motion.div>

                {user1TopLang && (
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: user1TopLang.color || '#888' }}
                    />
                    {user1TopLang.name}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* VS Divider */}
          <motion.div
            className="hidden sm:flex items-center justify-center text-white/60 font-bold"
            variants={itemVariants}
          >
            VS
          </motion.div>

          {/* User 2 */}
          <motion.div
            className={`flex items-center p-3 ${winner === 2 && !isDraw ? 'bg-white/30' : 'bg-white/10'} backdrop-blur-sm rounded-lg flex-1`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={user2.user.avatar_url}
              alt={user2.user.login}
              className={`w-10 h-10 rounded-full border-2 ${winner === 2 && !isDraw ? 'border-yellow-300' : 'border-white/20'}`}
            />

            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center">
                <h3 className="font-medium text-sm sm:text-base truncate">
                  {user2.user.login}
                </h3>
                {winner === 2 && !isDraw && (
                  <span className="ml-auto text-yellow-300 flex items-center text-xs">
                    <Icons.Trophy className="w-3 h-3 mr-1" />
                    Winner
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-white/80 text-xs">
                <motion.div
                  variants={scoreCounterVariants}
                  className="font-bold"
                >
                  {user2.score.totalScore} pts
                </motion.div>

                {user2TopLang && (
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: user2TopLang.color || '#888' }}
                    />
                    {user2TopLang.name}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Score comparison bar */}
        <motion.div variants={itemVariants} className="mt-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden flex">
            <motion.div
              className={`h-full ${isDraw ? 'bg-white/40' : winner === 1 ? 'bg-yellow-300/70' : 'bg-white/40'}`}
              style={{
                width: `${(user1.score.totalScore / (user1.score.totalScore + user2.score.totalScore)) * 100}%`,
              }}
              initial={{ width: '50%' }}
              animate={{
                width: `${(user1.score.totalScore / (user1.score.totalScore + user2.score.totalScore)) * 100}%`,
              }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
            <motion.div
              className={`h-full ${isDraw ? 'bg-white/40' : winner === 2 ? 'bg-yellow-300/70' : 'bg-white/40'}`}
              style={{
                width: `${(user2.score.totalScore / (user1.score.totalScore + user2.score.totalScore)) * 100}%`,
              }}
            />
          </div>

          {!isDraw && (
            <div className="mt-2 text-center text-white/80 text-xs">
              <Icons.ArrowUpRight className="inline-block w-3 h-3 mr-1 text-white/80" />
              Won by {scoreDifference} points
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
