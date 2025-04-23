import { Icons } from '../Icons';

/**
 * ContributionHeatmapPageSkeleton - A skeleton loader for the entire ContributionHeatmap component
 * This is intended for use at the page level when the component hasn't been mounted yet
 */
export default function ContributionHeatmapPageSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-4 sm:p-6 border border-border-l dark:border-border-d animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <div className="w-6 h-6 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
          <div>
            <div className="h-5 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-1"></div>
            <div className="h-4 w-36 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-14 bg-l-bg-3 dark:bg-d-bg-3 rounded-md"></div>
          <div className="h-8 w-14 bg-l-bg-3 dark:bg-d-bg-3 rounded-md"></div>
          <div className="h-8 w-14 bg-l-bg-3 dark:bg-d-bg-3 rounded-md"></div>
        </div>
      </div>

      {/* Calendar grid skeleton */}
      <div className="overflow-x-auto overflow-y-hidden py-4">
        <div className="w-full h-[120px] bg-l-bg-3/30 dark:bg-d-bg-3/30 rounded-md">
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-3 opacity-70">
              <Icons.Calendar className="w-8 h-8 text-l-text-3 dark:text-d-text-3" />
              <div className="h-4 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend skeleton */}
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="h-3 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-6 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-l-bg-3 dark:bg-d-bg-3 rounded-[2px]"
            ></div>
          ))}
          <div className="h-3 w-6 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>
      </div>
    </div>
  );
}
