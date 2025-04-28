export default function GithubBattleResultsSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Battle Result Banner Skeleton */}
      <div className="bg-gradient-to-r from-accent-1/40 to-accent-2/40 text-white rounded-lg p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
            <div className="h-8 w-64 bg-white/30 rounded-md"></div>
          </div>
          <div className="h-6 w-48 mx-auto bg-white/30 rounded-md"></div>
        </div>
      </div>

      {/* Battle Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* User 1 Card Skeleton */}
        <UserBattleCardSkeleton />

        {/* User 2 Card Skeleton */}
        <UserBattleCardSkeleton />
      </div>

      {/* Score Breakdown Skeleton */}
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-5 sm:p-8 border border-border-l dark:border-border-d shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 bg-accent-1/30 rounded-full"></div>
          <div className="h-6 w-40 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <ScoreBreakdownItemSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Scoring Methodology Skeleton */}
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border border-border-l dark:border-border-d shadow-md overflow-hidden">
        <div className="p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent-1/30 rounded-full"></div>
            <div className="h-6 w-56 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>
          <div className="w-5 h-5 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

// Helper component for battle card skeleton
function UserBattleCardSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border-2 border-border-l dark:border-border-d overflow-hidden">
      {/* Winner/Draw Banner */}
      <div className="h-8 bg-gradient-to-r from-l-bg-3 to-l-bg-3/70 dark:from-d-bg-3 dark:to-d-bg-3/70"></div>

      <div className="p-4 sm:p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-lg bg-l-bg-3 dark:bg-d-bg-3 border-2 border-border-l dark:border-border-d"></div>
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-l-bg-3 dark:bg-d-bg-3"></div>
          </div>
          <div className="flex-grow text-center sm:text-left">
            <div className="h-7 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded mx-auto sm:mx-0"></div>
            <div className="h-5 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-2 mx-auto sm:mx-0"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-8 w-16 bg-accent-1/20 rounded-md"></div>
            <div className="h-4 w-12 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-1"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/30 dark:border-border-d/30"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-l-bg-3 dark:bg-d-bg-3"></div>
                  <div className="h-5 w-20 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                </div>
              </div>
              <div className="h-7 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              <div className="h-4 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-1"></div>
            </div>
          ))}
        </div>

        {/* GitHub Details */}
        <div className="bg-l-bg-1/50 dark:bg-d-bg-1/50 p-3 sm:p-4 rounded-lg border border-border-l/30 dark:border-border-d/30 mb-6">
          <div className="h-5 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-3"></div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-l-bg-3 dark:bg-d-bg-3 mt-1"></div>
              <div className="h-5 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-l-bg-3 dark:bg-d-bg-3"></div>
              <div className="h-5 w-3/4 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div>
          <div className="h-5 w-40 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-3"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-6 px-3 py-1 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for score breakdown item skeleton
function ScoreBreakdownItemSkeleton() {
  return (
    <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l/20 dark:border-border-d/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-accent-1/30"></div>
          <div className="h-5 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="h-6 w-10 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-4 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-1"></div>
        </div>
        <div className="h-5 w-5 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        <div className="flex flex-col items-end">
          <div className="h-6 w-10 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-4 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-1"></div>
        </div>
      </div>
    </div>
  );
}
