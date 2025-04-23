export default function LanguagePieChartSkeleton() {
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
      </div>

      {/* Chart and legend layout */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Chart area skeleton */}
        <div className="md:w-1/2 h-64 md:h-80 flex items-center justify-center">
          <div className="relative w-48 h-48 rounded-full bg-l-bg-3 dark:bg-d-bg-3 flex items-center justify-center">
            {/* Donut hole */}
            <div
              className="absolute w-30 h-30 rounded-full bg-l-bg-2 dark:bg-d-bg-2"
              style={{ width: '65%', height: '65%' }}
            ></div>

            {/* Simulated segments */}
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 45 * Math.cos(((i * 72 - 90) * Math.PI) / 180)}% ${50 + 45 * Math.sin(((i * 72 - 90) * Math.PI) / 180)}%, ${50 + 45 * Math.cos((((i + 1) * 72 - 90) * Math.PI) / 180)}% ${50 + 45 * Math.sin((((i + 1) * 72 - 90) * Math.PI) / 180)}%)`,
                    backgroundColor:
                      i % 5 === 0
                        ? '#3B82F6'
                        : i % 5 === 1
                          ? '#10B981'
                          : i % 5 === 2
                            ? '#F59E0B'
                            : i % 5 === 3
                              ? '#EF4444'
                              : '#8B5CF6',
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Legend area skeleton */}
        <div className="md:w-1/2">
          <div className="h-5 w-24 mb-3 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="space-y-3 max-h-64 md:max-h-72 overflow-y-auto pr-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-l-bg-3 dark:bg-d-bg-3" />
                  <div className="h-4 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-10 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-1"></div>
                  <div className="h-3 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border-l dark:border-border-d">
            <div className="h-4 w-3/4 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
