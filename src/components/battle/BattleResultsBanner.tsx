import { motion, type Variants } from 'framer-motion';
import { Icons } from '../shared/Icons';

interface BattleResultsBannerProps {
  isOrgBattle: boolean;
  isDraw: boolean;
  winner: 1 | 2;
  winnerLogin: string;
  winnerScore: number;
  loserLogin?: string;
  loserScore?: number;
  user1: {
    login: string;
    avatar_url: string;
  };
  user2: {
    login: string;
    avatar_url: string;
  };
}

export default function BattleResultsBanner({
  isOrgBattle,
  isDraw,
  winner,
  winnerLogin,
  winnerScore,
  loserScore,
  user1,
  user2,
}: BattleResultsBannerProps) {
  const entityTypePlural = isOrgBattle ? 'organizations' : 'developers';

  // Calculate score difference percentage if not a draw
  const scoreDifference = !isDraw && loserScore ? winnerScore - loserScore : 0;
  const scoreDiffPercentage =
    !isDraw && loserScore
      ? Math.round((scoreDifference / loserScore) * 100)
      : 0;

  // Animation variants
  const bannerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Star decorations for winner celebration
  const StarDecoration = ({ index }: { index: number }) => (
    <motion.div
      className="absolute w-3 h-3 text-yellow-300"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10,
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: index * 0.2,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    >
      <Icons.Star className="w-full h-full" />
    </motion.div>
  );

  return (
    <motion.div
      className="relative bg-gradient-to-r from-accent-1 to-accent-2 text-white rounded-lg overflow-hidden shadow-lg border border-white/10"
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Glowing overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />

      {/* Content container with padding */}
      <div className="relative z-10 px-4 py-5 sm:p-6 md:p-8">
        {/* Header with trophy icon */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-4 sm:mb-5"
          variants={childVariants}
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          >
            <Icons.Trophy className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-yellow-300" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Battle Results
          </h2>
        </motion.div>

        {/* VS Banner with user avatars - Larger avatars and better mobile responsiveness */}
        <motion.div
          className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6"
          variants={childVariants}
        >
          <div className="flex flex-col items-center">
            <div
              className={`p-1 sm:p-1.5 rounded-full ${winner === 1 && !isDraw ? 'bg-yellow-300/50' : 'bg-white/20'}`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/40">
                <img
                  src={user1.avatar_url}
                  alt={user1.login}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="mt-1 text-xs sm:text-sm font-semibold max-w-[80px] sm:max-w-[100px] md:max-w-[140px] truncate text-center">
              {user1.login}
            </span>
          </div>

          <div className="flex flex-col items-center mx-1 sm:mx-2">
            <div className="bg-white/20 rounded-full px-3 py-1.5">
              <span className="font-bold text-sm sm:text-base">VS</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`p-1 sm:p-1.5 rounded-full ${winner === 2 && !isDraw ? 'bg-yellow-300/50' : 'bg-white/20'}`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/40">
                <img
                  src={user2.avatar_url}
                  alt={user2.login}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="mt-1 text-xs sm:text-sm font-semibold max-w-[80px] sm:max-w-[100px] md:max-w-[140px] truncate text-center">
              {user2.login}
            </span>
          </div>
        </motion.div>

        {isDraw ? (
          <motion.div className="text-center py-2" variants={childVariants}>
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <Icons.Medal className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
              <span className="text-xl sm:text-2xl font-bold">DRAW</span>
              <Icons.Medal className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
            </div>
            <p className="text-base sm:text-lg">
              Both {entityTypePlural} scored{' '}
              <span className="font-bold">{winnerScore}</span> points!
            </p>

            {/* Equal stats visualization */}
            <div className="mt-3 bg-white/10 p-2 sm:p-3 rounded-lg mx-auto max-w-[90%] sm:max-w-xs">
              <div className="flex items-center justify-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-white/30" />
                <div className="text-xs font-semibold px-2">Equal</div>
                <div className="flex-1 h-2 rounded-full bg-white/30" />
              </div>
              <p className="text-xs mt-1 opacity-75">
                These {entityTypePlural} are perfectly matched!
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div className="text-center" variants={childVariants}>
            {/* Winner declaration */}
            <div className="relative inline-block mb-1 sm:mb-2">
              {/* Decorative stars around winner name */}
              {[...Array(6)].map((_, i) => (
                <StarDecoration key={i} index={i} />
              ))}

              <div className="bg-white/20 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-white/30 shadow-inner relative z-10">
                <motion.span
                  className="text-lg sm:text-xl font-bold"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {winnerLogin} Wins!
                </motion.span>
              </div>
            </div>

            {/* Score comparison */}
            <div className="mt-3 flex flex-col items-center">
              <div className="flex items-center gap-1 text-white/90 text-sm">
                <Icons.Trophy className="w-4 h-4 text-yellow-300" />
                <span className="uppercase tracking-wide text-xs font-medium">
                  Victory Stats
                </span>
              </div>

              <div className="mt-2 w-full sm:w-4/5 md:max-w-xs mx-auto bg-white/10 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs opacity-80">Score</span>
                  <div className="font-bold text-base">
                    {winnerScore} points
                  </div>
                </div>

                {/* Score bar visualization */}
                <div className="relative h-2 bg-white/20 rounded-full w-full mt-1 mb-2">
                  <motion.div
                    className="absolute top-0 left-0 h-2 bg-yellow-300/90 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>

                {loserScore && (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Icons.TrendingUp className="w-3 h-3 text-green-300" />
                      <span>+{scoreDifference} points</span>
                    </div>
                    <div className="bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
                      {scoreDiffPercentage > 0 ? '+' : ''}
                      {scoreDiffPercentage}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
