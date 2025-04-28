import { JSX } from 'react';

interface ScoringMethodItemProps {
  icon: JSX.Element;
  title: string;
  formula: string;
  maxPoints: number;
  description: string;
}

/**
 * Component that displays a scoring method with its icon, title, formula,
 * max points, and description
 */
export function ScoringMethodItem({
  icon,
  title,
  formula,
  maxPoints,
  description,
}: ScoringMethodItemProps) {
  return (
    <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 hover:border-accent-1/50 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-accent-1/10 p-1.5 rounded-full text-accent-1">
          {icon}
        </div>
        <h4 className="font-medium text-l-text-1 dark:text-d-text-1">
          {title}
        </h4>
      </div>
      <p className="text-sm text-l-text-2 dark:text-d-text-2 mb-2">
        {description}
      </p>
      <div className="flex justify-between text-xs mt-2 pt-2 border-t border-border-l/20 dark:border-border-d/20">
        <span className="text-l-text-3 dark:text-d-text-3">{formula}</span>
        <span className="bg-accent-1/10 text-accent-1 px-2 py-0.5 rounded-full font-medium">
          Max: {maxPoints} pts
        </span>
      </div>
    </div>
  );
}
