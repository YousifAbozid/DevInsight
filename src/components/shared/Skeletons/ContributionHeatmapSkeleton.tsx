export default function ContributionHeatmapSkeleton() {
  return (
    <div className="w-full overflow-x-auto sm:overflow-visible animate-pulse">
      <div className="w-[890px] grid grid-cols-[auto_repeat(53,1fr)] gap-x-[3px] gap-y-[2px]">
        {/* Month labels skeleton */}
        <div className="col-span-1"></div>
        <div className="col-span-53 grid grid-cols-53 text-xs mb-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-14 bg-l-bg-3 dark:bg-d-bg-3 rounded"
              style={{
                gridColumn: `${Math.floor(i * 4.3) + 1} / span 4`,
              }}
            ></div>
          ))}
        </div>

        {/* Day of week labels */}
        <div className="grid grid-rows-7 gap-y-2 text-xs pr-2">
          <div className="h-3 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-3 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-3 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-3 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-3 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-3 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-3 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>

        {/* Contribution grid skeleton - updated to match the current grid */}
        <div className="col-span-53 grid grid-cols-53 gap-x-[3px] gap-y-[1px]">
          {Array.from({ length: 53 }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-y-[1px]">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-2.5 h-2.5 rounded-[2px] bg-l-bg-3 dark:bg-d-bg-3"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
