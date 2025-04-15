import { useState, useRef, useEffect } from 'react';
import { useContributionData } from '../services/githubGraphQLService';

interface ContributionHeatmapProps {
  username: string;
  token?: string;
}

export default function ContributionHeatmap({
  username,
  token,
}: ContributionHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    element: HTMLElement | null;
  } | null>(null);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useContributionData(username, token);

  // Update tooltip position when hoveredDay changes
  useEffect(() => {
    if (
      hoveredDay &&
      hoveredDay.element &&
      tooltipRef.current &&
      containerRef.current
    ) {
      const tooltipElement = tooltipRef.current;
      const cellRect = hoveredDay.element.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      // Calculate position relative to the container
      const cellCenterX =
        cellRect.left + cellRect.width / 2 - containerRect.left;
      const cellTopY = cellRect.top - containerRect.top;

      // Position tooltip above the cell by default
      let top = cellTopY - tooltipElement.offsetHeight - 8;
      let left = cellCenterX - tooltipElement.offsetWidth / 2;

      // Make sure tooltip stays within container bounds
      if (top < 5) {
        // Position below the cell if not enough space above
        top = cellTopY + cellRect.height + 8;
      }

      // Adjust horizontal position if needed
      if (left < 5) {
        left = 5;
      } else if (left + tooltipElement.offsetWidth > containerRect.width - 5) {
        left = containerRect.width - tooltipElement.offsetWidth - 5;
      }

      tooltipElement.style.top = `${top}px`;
      tooltipElement.style.left = `${left}px`;
    }
  }, [hoveredDay]);

  if (!token) {
    return (
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-4">
          Contribution Heatmap
        </h2>
        <div className="bg-l-bg-3 dark:bg-d-bg-3 p-4 rounded-md">
          <p className="text-l-text-2 dark:text-d-text-2 mb-2">
            Please provide a GitHub access token to view the contribution
            heatmap.
          </p>
          <p className="text-sm text-l-text-3 dark:text-d-text-3">
            This feature requires authentication with the GitHub GraphQL API.
            Click &quot;Show token input&quot; above the search button to add
            your token.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <ContributionHeatmapSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-4">
          Contribution Heatmap
        </h2>
        <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-4 rounded">
          <p className="text-accent-danger">
            {error instanceof Error
              ? error.message
              : 'Failed to load contribution data'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-4">
          Contribution Heatmap
        </h2>
        <p className="text-l-text-2 dark:text-d-text-2">
          No contribution data available
        </p>
      </div>
    );
  }

  // Calculate the highest number of contributions in a day
  const maxContributions = Math.max(
    ...data.weeks.flatMap(week =>
      week.contributionDays.map(day => day.contributionCount)
    ),
    1 // Ensure we don't divide by zero
  );

  // Function to get color based on contribution count and theme
  const getColorClass = (count: number) => {
    // Calculate intensity on a scale of 0-4
    const intensity =
      count === 0 ? 0 : Math.ceil((count / maxContributions) * 4);

    // Return appropriate color classes for light/dark themes
    switch (intensity) {
      case 0:
        return 'bg-l-bg-3 dark:bg-d-bg-3';
      case 1:
        return 'bg-[#9be9a8] dark:bg-[#0e4429]';
      case 2:
        return 'bg-[#40c463] dark:bg-[#006d32]';
      case 3:
        return 'bg-[#30a14e] dark:bg-[#26a641]';
      case 4:
        return 'bg-[#216e39] dark:bg-[#39d353]';
      default:
        return 'bg-l-bg-3 dark:bg-d-bg-3';
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle day hover
  const handleDayHover = (
    day: { date: string; contributionCount: number },
    event: React.MouseEvent
  ) => {
    setHoveredDay({
      date: day.date,
      count: day.contributionCount,
      element: event.currentTarget as HTMLElement,
    });
  };

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
          Contribution Heatmap
        </h2>
        <span className="text-sm text-l-text-2 dark:text-d-text-2">
          {data.totalContributions.toLocaleString()} contributions in the last
          year
        </span>
      </div>

      <div className="relative overflow-x-auto pb-2" ref={containerRef}>
        <div className="grid grid-cols-[auto_repeat(53,1fr)] gap-1 min-w-[700px]">
          {/* Month labels */}
          <div className="col-span-1"></div>
          <div className="col-span-53 grid grid-cols-53 text-xs text-l-text-3 dark:text-d-text-3 mb-1">
            {Array.from({ length: 12 }).map((_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - 11 + i);
              return (
                <div
                  key={i}
                  className="col-span-4 text-center"
                  style={{ gridColumnStart: i * 4 + 2 }}
                >
                  {date.toLocaleDateString(undefined, { month: 'short' })}
                </div>
              );
            })}
          </div>

          {/* Day of week labels */}
          <div className="grid grid-rows-7 gap-1 text-xs text-l-text-3 dark:text-d-text-3 pr-2">
            <span className="h-3 flex items-center">Mon</span>
            <span className="h-3"></span>
            <span className="h-3 flex items-center">Wed</span>
            <span className="h-3"></span>
            <span className="h-3 flex items-center">Fri</span>
            <span className="h-3"></span>
            <span className="h-3 flex items-center">Sun</span>
          </div>

          {/* Contribution grid */}
          <div className="col-span-53 grid grid-cols-53 gap-1">
            {data.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = week.contributionDays.find(
                    d => new Date(d.date).getDay() === dayIndex
                  );

                  if (day) {
                    const colorClass = getColorClass(day.contributionCount);
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm ${colorClass} hover:ring-2 hover:ring-accent-1 cursor-pointer transition-all relative`}
                        onMouseEnter={e => handleDayHover(day, e)}
                        onMouseLeave={() => setHoveredDay(null)}
                        aria-label={`${formatDate(day.date)}: ${day.contributionCount} contributions`}
                      ></div>
                    );
                  }

                  return (
                    <div
                      key={`empty-${weekIndex}-${dayIndex}`}
                      className="w-3 h-3 rounded-sm bg-transparent"
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Tooltip */}
        {hoveredDay && (
          <div
            ref={tooltipRef}
            className="absolute pointer-events-none bg-l-bg-1 dark:bg-d-bg-1 py-2 px-3 rounded-md shadow-lg border border-border-l dark:border-border-d text-sm z-10 transition-opacity duration-150 opacity-100"
            style={{ transform: 'translateX(-50%)', marginTop: '-2px' }}
          >
            <div className="font-medium text-l-text-1 dark:text-d-text-1">
              {formatDate(hoveredDay.date)}
            </div>
            <div
              className={`text-center font-bold mt-1 ${
                hoveredDay.count > 0
                  ? 'text-accent-success'
                  : 'text-l-text-3 dark:text-d-text-3'
              }`}
            >
              {hoveredDay.count === 0
                ? 'No contributions'
                : `${hoveredDay.count} contribution${
                    hoveredDay.count !== 1 ? 's' : ''
                  }`}
            </div>
            {/* Triangle pointer */}
            <div className="absolute left-1/2 -mt-4 w-0 h-0 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-current hidden"></div>
          </div>
        )}
      </div>

      <div className="flex justify-end items-center mt-4">
        <div className="flex items-center gap-1 text-xs text-l-text-3 dark:text-d-text-3">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-l-bg-3 dark:bg-d-bg-3"></div>
          <div className="w-3 h-3 rounded-sm bg-[#9be9a8] dark:bg-[#0e4429]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#40c463] dark:bg-[#006d32]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#30a14e] dark:bg-[#26a641]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#216e39] dark:bg-[#39d353]"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for the contribution heatmap
function ContributionHeatmapSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        <div className="h-4 w-36 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
      </div>

      <div className="grid grid-cols-[auto_repeat(53,1fr)] gap-1 min-w-[700px]">
        <div className="col-span-1"></div>
        <div className="col-span-53 grid grid-cols-53 gap-1 mb-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="col-span-4 h-4 bg-l-bg-3 dark:bg-d-bg-3 rounded"
              style={{ gridColumnStart: i * 4 + 2 }}
            ></div>
          ))}
        </div>

        <div className="grid grid-rows-7 gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded"
            ></div>
          ))}
        </div>

        <div className="col-span-53 grid grid-cols-53 gap-1">
          {Array.from({ length: 53 }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-3 h-3 rounded-sm bg-l-bg-3 dark:bg-d-bg-3"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end items-center mt-4">
        <div className="h-3 w-36 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
      </div>
    </div>
  );
}
