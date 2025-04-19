import { memo } from 'react';

interface PersonaStrengthBarsProps {
  strengths: {
    languageDiversity: number;
    contributionConsistency: number;
    collaboration: number;
    projectPopularity: number;
    codeQuality: number;
    communityImpact: number;
  };
  color: string;
}

// Map of labels for each strength category
const strengthLabels: Record<string, string> = {
  languageDiversity: 'Language Diversity',
  contributionConsistency: 'Contribution Consistency',
  collaboration: 'Collaboration',
  projectPopularity: 'Project Popularity',
  codeQuality: 'Code Quality',
  communityImpact: 'Community Impact',
};

// Memoized component to prevent unnecessary re-renders
const PersonaStrengthBars = memo(
  ({ strengths, color }: PersonaStrengthBarsProps) => {
    // Sort strengths from highest to lowest
    const sortedStrengths = Object.entries(strengths)
      .map(([key, value]) => ({
        key,
        value: Math.round(value),
        label: strengthLabels[key] || key,
      }))
      .sort((a, b) => b.value - a.value);

    return (
      <div className="space-y-3 w-full">
        {sortedStrengths.map(strength => (
          <div key={strength.key} className="mb-2 last:mb-0">
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-l-text-2 dark:text-d-text-2 font-medium">
                {strength.label}
              </span>
              <span className="text-l-text-1 dark:text-d-text-1 font-bold">
                {strength.value}
              </span>
            </div>
            <div className="h-2.5 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${strength.value}%`,
                  backgroundColor: color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

PersonaStrengthBars.displayName = 'PersonaStrengthBars';

export default PersonaStrengthBars;
