export default function PersonalizedSummarySkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-3 sm:p-5 border border-border-l dark:border-border-d shadow-sm animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
          <div>
            <div className="h-5 w-36 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-1"></div>
            <div className="h-3 w-28 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>
        </div>
        <div className="h-6 w-20 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        <div className="h-8 w-20 bg-l-bg-3 dark:bg-d-bg-3 rounded-md flex-shrink-0"></div>
        <div className="h-8 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-md flex-shrink-0"></div>
        <div className="h-8 w-28 bg-l-bg-3 dark:bg-d-bg-3 rounded-md flex-shrink-0"></div>
      </div>

      {/* Insights skeleton */}
      <div className="space-y-2.5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 p-3 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d"
          >
            <div className="w-7 h-7 bg-l-bg-3 dark:bg-d-bg-3 rounded-full flex-shrink-0"></div>
            <div className="w-full">
              <div className="h-4 w-4/5 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
              <div className="h-3 w-3/5 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
            </div>
          </div>
        ))}
        <div className="h-8 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded-md mt-1"></div>
      </div>
    </div>
  );
}
