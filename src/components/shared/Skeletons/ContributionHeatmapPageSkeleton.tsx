export default function ContributionHeatmapPageSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-4 sm:p-6 border border-border-l dark:border-border-d animate-pulse">
      {/* Header with SectionHeader component */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-l-bg-3/70 dark:bg-d-bg-3/70 rounded-full">
            <div className="w-3.5 h-3.5 rounded-full"></div>
          </div>
          <div>
            <div className="h-5 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-1"></div>
            <div className="h-3.5 w-36 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 opacity-70">
            <div className="h-3.5 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="px-2.5 py-1 h-[22px] w-14 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar grid skeleton */}
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="w-[890px] grid grid-cols-[auto_repeat(53,1fr)] gap-x-[3px] gap-y-[2px]">
          {/* Month labels skeleton */}
          <div className="col-span-1"></div>
          <div className="col-span-53 grid grid-cols-53 mb-1">
            {Array.from({ length: 12 }).map((_, i) => {
              const position = Math.floor(i * 4.3);
              return (
                <div
                  key={i}
                  className="text-center"
                  style={{
                    gridColumn: `${position + 2} / span 4`,
                  }}
                >
                  <div className="inline-block h-3 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                </div>
              );
            })}
          </div>

          {/* Day of week labels skeleton */}
          <div className="grid grid-rows-7 gap-y-2 -translate-y-1 pr-2 justify-items-end">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((_, i) => (
              <div
                key={i}
                className="h-3 w-6 bg-l-bg-3 dark:bg-d-bg-3 rounded"
              ></div>
            ))}
          </div>

          {/* Contribution grid skeleton */}
          <div className="col-span-53 grid grid-cols-53 gap-x-[3px] gap-y-[1px]">
            {Array.from({ length: 53 }).map((_, weekIndex) => (
              <div
                key={weekIndex}
                className="grid grid-rows-7 gap-y-[1px]"
                style={{
                  height: '100%',
                  gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
                }}
              >
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  // Create a visual pattern for the skeleton with different opacities
                  const opacityValue =
                    (weekIndex + dayIndex) % 5 === 0
                      ? '0.8'
                      : (weekIndex + dayIndex) % 4 === 0
                        ? '0.6'
                        : (weekIndex + dayIndex) % 3 === 0
                          ? '0.5'
                          : (weekIndex + dayIndex) % 2 === 0
                            ? '0.4'
                            : '0.3';

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-2.5 h-2.5 bg-l-bg-3 dark:bg-d-bg-3 rounded-[2px] opacity-${opacityValue} ring-[0.5px] ring-inset ring-black/5 dark:ring-white/10`}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend skeleton */}
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="h-3 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded text-xs"></div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-6 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-l-bg-3 dark:bg-d-bg-3 rounded-[2px] opacity-${${i * 0.2 + 0.2}} ring-[0.5px] ring-inset ring-black/5 dark:ring-white/10"
              style={{ opacity: i * 0.2 + 0.2 }}
            ></div>
          ))}
          <div className="h-3 w-6 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>
      </div>
    </div>
  );
}
