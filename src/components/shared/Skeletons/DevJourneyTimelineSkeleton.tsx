export default function DevJourneyTimelineSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-l-bg-3 dark:bg-d-bg-3"></div>
            <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>
          <div className="h-4 w-64 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-2"></div>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="h-8 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        </div>
      </div>

      {/* Filter skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
          <div className="h-6 w-20 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
          <div className="h-6 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-l-bg-3 dark:bg-d-bg-3"></div>

        <div className="space-y-6">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="ml-12 relative">
              <div className="absolute -left-12 w-8 h-8 rounded-full bg-l-bg-3 dark:bg-d-bg-3"></div>

              <div className="p-4 rounded-lg border border-border-l dark:border-border-d bg-l-bg-1 dark:bg-d-bg-1 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <div className="h-5 w-40 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                  <div className="h-4 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                </div>
                <div className="h-4 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
