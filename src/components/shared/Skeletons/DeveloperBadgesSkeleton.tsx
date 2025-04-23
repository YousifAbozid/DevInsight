export default function DeveloperBadgesSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm animate-pulse">
      {/* Header section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-l-bg-3 dark:bg-d-bg-3"></div>
          <div className="flex flex-col">
            <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
            <div className="h-4 w-64 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-1"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-md"></div>
          <div className="h-8 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="p-2 bg-l-bg-1 dark:bg-d-bg-1 rounded-lg border border-border-l dark:border-border-d mb-6">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="h-5 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-8 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
          <div className="h-8 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
          <div className="h-8 w-28 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-lg p-4 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-l-bg-3 dark:bg-d-bg-3 mb-3"></div>
              <div className="h-5 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
              <div className="h-3 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-1"></div>
              <div className="h-3 w-3/4 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
              <div className="h-4 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded-full mt-1"></div>
            </div>
          ))}
      </div>
    </div>
  );
}
