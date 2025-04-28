import { JSX } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../shared/Icons';

interface ScoreBreakdownItemProps {
  label: string;
  user1Score: number;
  user2Score: number;
  user1Name: string;
  user2Name: string;
  icon: JSX.Element;
}

/**
 * Component that displays a score comparison between two users for a specific metric
 */
export function ScoreBreakdownItem({
  label,
  user1Score,
  user2Score,
  user1Name,
  user2Name,
  icon,
}: ScoreBreakdownItemProps) {
  const totalScore = user1Score + user2Score;
  const user1Percentage = totalScore > 0 ? (user1Score / totalScore) * 100 : 50;
  const winner = user1Score > user2Score ? 1 : user2Score > user1Score ? 2 : 0;

  return (
    <motion.div
      className="flex flex-col bg-l-bg-1 dark:bg-d-bg-1 p-3 sm:p-4 rounded-lg border border-border-l/30 dark:border-border-d/30"
      whileHover={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
    >
      <div className="text-sm text-l-text-1 dark:text-d-text-1 font-medium mb-2 flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div className="flex items-center justify-between text-xs mb-2">
        <span
          className={`${
            winner === 1
              ? 'text-accent-success font-medium'
              : 'text-l-text-2 dark:text-d-text-2'
          } flex items-center gap-1 truncate max-w-[45%]`}
        >
          {winner === 1 && (
            <Icons.ChevronUp className="w-3 h-3 flex-shrink-0" />
          )}
          <span className="truncate">{user1Name}</span>: {user1Score}
        </span>
        <span className="text-l-text-3 dark:text-d-text-3 mx-1 flex-shrink-0">
          vs
        </span>
        <span
          className={`${
            winner === 2
              ? 'text-accent-success font-medium'
              : 'text-l-text-2 dark:text-d-text-2'
          } flex items-center gap-1 justify-end truncate max-w-[45%]`}
        >
          <span className="truncate">{user2Name}</span>: {user2Score}
          {winner === 2 && (
            <Icons.ChevronUp className="w-3 h-3 flex-shrink-0" />
          )}
        </span>
      </div>
      <div className="h-2.5 sm:h-3 bg-l-bg-3 dark:bg-d-bg-3 rounded-full overflow-hidden relative mt-1">
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
          className="absolute top-0 left-0 h-full border-r-[1px] sm:border-r-2 border-white"
          style={{ left: `${user1Percentage}%` }}
        ></div>
      </div>
    </motion.div>
  );
}
