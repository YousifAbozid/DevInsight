import { Icons } from './shared/Icons';

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

export default function WelcomeScreen({
  onSuggestionClick,
}: WelcomeScreenProps) {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-8 border border-border-l dark:border-border-d">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-4 bg-accent-1/10 rounded-full">
          <Icons.GitHub className="w-16 h-16 text-accent-1" />
        </div>

        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
          Discover Developer Insights
        </h2>

        <p className="text-l-text-2 dark:text-d-text-2 max-w-md">
          Enter a GitHub username above to explore their profile, repositories,
          contribution history, and generate personalized insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
          <div className="bg-l-bg-3 dark:bg-d-bg-3 p-4 rounded-lg">
            <h3 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2">
              What You&apos;ll See
            </h3>
            <ul className="text-sm text-l-text-2 dark:text-d-text-2 space-y-1">
              <li>• Language distribution</li>
              <li>• Contribution patterns</li>
              <li>• Developer badges</li>
              <li>• Developer persona</li>
              <li>• Personalized stats</li>
            </ul>
          </div>

          <div className="bg-l-bg-3 dark:bg-d-bg-3 p-4 rounded-lg">
            <h3 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2">
              Try These Profiles
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'torvalds',
                'gaearon',
                'yyx990803',
                'sindresorhus',
                'ThePrimeagen',
              ].map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="px-2 py-1 text-xs bg-accent-1/10 hover:bg-accent-1/20 text-accent-1 rounded-md transition-all cursor-pointer hover:scale-110 hover:-translate-y-1"
                  style={{
                    animation: 'fadeInDown 0.5s ease-out forwards',
                    animationDelay: `${0.2 + index * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm text-l-text-3 dark:text-d-text-3 mt-2 bg-l-bg-3/50 dark:bg-d-bg-3/50 p-2 rounded-md inline-block">
          💡 Add a GitHub token for access to more detailed contribution data
        </div>
      </div>
    </div>
  );
}
