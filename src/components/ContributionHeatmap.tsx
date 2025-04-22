import { useState, useRef, useEffect, useMemo } from 'react';
import { useContributionData } from '../services/githubGraphQLService';
import SectionHeader from './shared/SectionHeader';
import { Icons } from './shared/Icons';

interface ContributionHeatmapProps {
  username: string;
  token?: string;
  userCreatedAt?: string; // Add user's account creation date
}

// Grid-only loading skeleton for better UX when switching years
function ContributionGridSkeleton() {
  return (
    <div className="w-full overflow-x-auto sm:overflow-visible animate-pulse">
      <div className="min-w-[720px] sm:min-w-0 sm:w-full grid grid-cols-[auto_repeat(53,1fr)] gap-x-3 gap-y-2">
        {/* Month labels skeleton */}
        <div className="col-span-1"></div>
        <div className="col-span-53 grid grid-cols-53 text-xs mb-2">
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

        {/* Contribution grid skeleton */}
        <div className="col-span-53 grid grid-cols-53 gap-x-3 gap-y-2">
          {Array.from({ length: 53 }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-y-2">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded bg-l-bg-3 dark:bg-d-bg-3"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Complete skeleton for initial load
function ContributionHeatmapSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-4 sm:p-6 border border-border-l dark:border-border-d animate-pulse">
      <div className="flex flex-col gap-2 mb-4">
        <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        <div className="w-full mb-2">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <div className="h-5 w-10 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-5 w-14 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"
              ></div>
            ))}
          </div>
        </div>
        <div className="h-4 w-36 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
      </div>

      <ContributionGridSkeleton />

      <div className="mt-4 flex justify-between items-center">
        <div className="h-3 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-2 w-14 bg-l-bg-3 dark:bg-d-bg-3 rounded"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ContributionHeatmap({
  username,
  token,
  userCreatedAt,
}: ContributionHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    element: HTMLElement | null;
  } | null>(null);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate available years based on user's join date
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const joinYear = userCreatedAt
      ? new Date(userCreatedAt).getFullYear()
      : currentYear - 5; // Default to 5 years if join date unavailable

    // Create array of years from join year to current year (oldest to newest)
    return Array.from(
      { length: currentYear - joinYear + 1 },
      (_, i) => joinYear + i
    );
  }, [userCreatedAt]);

  // Add state for selected year
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Fetch data for the selected year
  const { data, isLoading, error } = useContributionData(
    username,
    token,
    selectedYear
  );

  // Generate calendar data - ALWAYS call this hook, even if data isn't loaded yet
  const { organizedCalendar, yearContributions, maxContributions } =
    useMemo(() => {
      // Default return values when data isn't available
      if (!data || data.weeks.length === 0) {
        return {
          yearCalendar: [],
          organizedCalendar: [],
          yearContributions: 0,
          maxContributions: 1,
        };
      }

      // Generate calendar for the selected year - ONLY showing days in that year
      const calendar = (() => {
        const result: Array<{
          date: Date;
          contributionCount: number;
          color: string;
          isFuture?: boolean; // Add flag for future dates
        }> = [];

        // Only include days in the selected year
        const startDate = new Date(selectedYear, 0, 1); // January 1st
        const endDate = new Date(selectedYear, 11, 31); // December 31st
        const now = new Date();

        // Build calendar days for the entire year
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const isFutureDate = currentDate > now;
          const dateStr = currentDate.toISOString().split('T')[0];

          // Find if there's contribution data for this day
          const contributionDay = data.weeks
            .flatMap(week => week.contributionDays)
            .find(day => day.date.startsWith(dateStr));

          result.push({
            date: new Date(currentDate.getTime()),
            contributionCount: contributionDay
              ? contributionDay.contributionCount
              : 0,
            color: contributionDay ? contributionDay.color : '#ebedf0',
            isFuture: isFutureDate, // Mark if this is a future date
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }

        return result;
      })();

      // Organize days for grid display
      const organized = (() => {
        // Create a fixed structure of 53 weeks (maximum possible in a year)
        const fixedWeeks = Array(53)
          .fill(null)
          .map(() =>
            Array(7)
              .fill(null)
              .map(() => ({
                date: new Date(),
                contributionCount: 0,
                color: '#ebedf0',
                isEmpty: true,
                isFuture: false, // Default to false for empty days
              }))
          );

        if (calendar.length === 0) return fixedWeeks;

        // Start with the first day of the year
        const firstDate = calendar[0].date;
        const firstDay = firstDate.getDay();

        // Fill in the actual days data
        calendar.forEach(day => {
          // Calculate which week and day this date belongs to
          const dayOfYear = Math.floor(
            (day.date.getTime() - firstDate.getTime()) / (24 * 60 * 60 * 1000)
          );
          const weekIndex = Math.floor((dayOfYear + firstDay) / 7);
          const dayIndex = day.date.getDay();

          // Make sure we don't exceed array bounds
          if (weekIndex < 53) {
            fixedWeeks[weekIndex][dayIndex] = {
              date: day.date,
              contributionCount: day.contributionCount,
              color: day.color,
              isEmpty: false,
              isFuture: day.isFuture || false, // Ensure it's always a boolean
            };
          }
        });

        return fixedWeeks;
      })();

      // Get contributions count for the selected year
      const contributions = data.weeks.reduce(
        (sum, week) =>
          sum +
          week.contributionDays.reduce((weekSum, day) => {
            if (new Date(day.date).getFullYear() === selectedYear) {
              return weekSum + day.contributionCount;
            }
            return weekSum;
          }, 0),
        0
      );

      // Calculate the highest number of contributions in a day for the selected year
      const maxContribs = Math.max(
        ...data.weeks.flatMap(week =>
          week.contributionDays
            .filter(day => new Date(day.date).getFullYear() === selectedYear)
            .map(day => day.contributionCount)
        ),
        1 // Ensure we don't divide by zero
      );

      return {
        organizedCalendar: organized,
        yearContributions: contributions,
        maxContributions: maxContribs,
      };
    }, [data, selectedYear]);

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

      // Calculate position relative to the container
      // Use window coordinates instead of container-relative for better positioning
      const cellCenterX = cellRect.left + cellRect.width / 2;
      const cellTopY = cellRect.top;

      // Position tooltip above the cell by default
      let top = cellTopY - tooltipElement.offsetHeight - 8;
      const left = cellCenterX - tooltipElement.offsetWidth / 2;

      // Make sure tooltip stays within viewport bounds
      if (top < 10) {
        // Position below the cell if not enough space above
        top = cellRect.bottom + 8;
      }

      tooltipElement.style.position = 'fixed';
      tooltipElement.style.top = `${top}px`;
      tooltipElement.style.left = `${left}px`;
    }
  }, [hoveredDay]);

  // Handle touch events for mobile
  const handleTouchStart = (
    day: { date: string; contributionCount: number },
    event: React.TouchEvent
  ) => {
    const element = event.currentTarget as HTMLElement;
    setHoveredDay({
      date: day.date,
      count: day.contributionCount,
      element: element,
    });

    // Auto-hide tooltip after 3 seconds on mobile
    setTimeout(() => {
      if (setHoveredDay) {
        setHoveredDay(null);
      }
    }, 3000);
  };

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

  if (isLoading && !data) {
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

  if (!data || data.weeks.length === 0) {
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

  // Function to get color based on contribution count and theme
  const getColorClass = (count: number) => {
    // Calculate intensity on a scale of 0-4
    const intensity =
      count === 0 ? 0 : Math.ceil((count / maxContributions) * 4);

    // Return appropriate color classes for light/dark themes with improved gradients
    switch (intensity) {
      case 0:
        return 'bg-gradient-to-br from-l-bg-3 to-l-bg-3/90 dark:from-d-bg-3 dark:to-d-bg-3/90';
      case 1:
        return 'bg-gradient-to-br from-[#9be9a8] to-[#9be9a8]/90 dark:from-[#0e4429] dark:to-[#0e4429]/90';
      case 2:
        return 'bg-gradient-to-br from-[#40c463] to-[#40c463]/90 dark:from-[#006d32] dark:to-[#006d32]/90';
      case 3:
        return 'bg-gradient-to-br from-[#30a14e] to-[#30a14e]/90 dark:from-[#26a641] dark:to-[#26a641]/90';
      case 4:
        return 'bg-gradient-to-br from-[#216e39] to-[#216e39]/90 dark:from-[#39d353] dark:to-[#39d353]/90';
      default:
        return 'bg-gradient-to-br from-l-bg-3 to-l-bg-3/90 dark:from-d-bg-3 dark:to-d-bg-3/90';
    }
  };

  // Function to format date
  const formatDate = (dateObj: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return dateObj.toLocaleDateString(undefined, options);
  };

  // Handle day hover
  const handleDayHover = (
    day: { date: Date; contributionCount: number },
    event: React.MouseEvent
  ) => {
    setHoveredDay({
      date: formatDate(day.date),
      count: day.contributionCount,
      element: event.currentTarget as HTMLElement,
    });
  };

  // Get month labels for the selected year
  const getMonthLabels = () => {
    const monthLabels = [];
    const year = selectedYear;

    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);
      monthLabels.push(date.toLocaleDateString(undefined, { month: 'short' }));
    }

    return monthLabels;
  };

  // Handle year selection
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-4 sm:p-6 border border-border-l dark:border-border-d">
      <SectionHeader
        title="Contribution Heatmap"
        icon={Icons.Activity}
        subtitle={`${yearContributions.toLocaleString()} contributions in ${selectedYear}`}
        infoTooltip="This heatmap visualizes your GitHub contribution activity. Each cell represents a day, with color intensity showing the number of contributions made on that day."
        rightControls={
          <div className="flex flex-wrap">
            <div className="flex overflow-x-auto hide-scrollbar">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-l-text-2 dark:text-d-text-2">
                  <span>Year:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableYears.map(year => (
                    <button
                      key={year}
                      onClick={() => handleYearChange(year)}
                      className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                        selectedYear === year
                          ? 'bg-accent-1 text-white'
                          : 'bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
                      }`}
                      disabled={isLoading} // Disable buttons during loading
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      />

      <div className="relative pb-2" ref={containerRef}>
        {/* Show grid skeleton when loading after initial load */}
        {isLoading ? (
          <ContributionGridSkeleton />
        ) : (
          /* Regular contribution grid when data is loaded */
          <div
            className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-style-github"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
            }}
          >
            <div className="w-[890px] grid grid-cols-[auto_repeat(53,1fr)] gap-x-[3px] gap-y-[2px]">
              {/* Month labels */}
              <div className="col-span-1"></div>
              <div className="col-span-53 grid grid-cols-53 text-xs text-l-text-3 dark:text-d-text-3 mb-1">
                {getMonthLabels().map((month, i) => {
                  const position = Math.floor(i * 4.3);
                  return (
                    <div
                      key={i}
                      className="text-center"
                      style={{
                        gridColumn: `${position + 1} / span 4`,
                      }}
                    >
                      {month}
                    </div>
                  );
                })}
              </div>

              {/* Day of week labels */}
              <div className="grid grid-rows-7 gap-y-2 text-xs text-l-text-3 dark:text-d-text-3 pr-2">
                <span className="h-3 flex items-center">Mon</span>
                <span className="h-3 flex items-center">Tue</span>
                <span className="h-3 flex items-center">Wed</span>
                <span className="h-3 flex items-center">Thu</span>
                <span className="h-3 flex items-center">Fri</span>
                <span className="h-3 flex items-center">Sat</span>
                <span className="h-3 flex items-center">Sun</span>
              </div>

              {/* Contribution grid */}
              <div className="col-span-53 grid grid-cols-53 gap-x-[3px] gap-y-[1px]">
                {organizedCalendar.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="grid grid-rows-7 gap-y-[1px]"
                    style={{
                      height: '100%',
                      gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
                    }}
                  >
                    {week.map((day, dayIndex) => {
                      if (day.isEmpty) {
                        return (
                          <div
                            key={`empty-${weekIndex}-${dayIndex}`}
                            className="w-2.5 h-2.5 opacity-0"
                            style={{ visibility: 'hidden' }}
                            aria-hidden="true"
                          ></div>
                        );
                      }

                      const colorClass = day.isFuture
                        ? 'bg-l-bg-3/40 dark:bg-d-bg-3/40 border border-dashed border-l-bg-3 dark:border-d-bg-3'
                        : getColorClass(day.contributionCount);

                      // Allow all cells to have interactions, including future dates
                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-2.5 h-2.5 ${colorClass} 
                          rounded-[2px] 
                          hover:scale-105 hover:shadow-md
                          transition-all duration-150 ease-in-out
                          ${day.contributionCount > 0 ? 'shadow-sm' : ''}
                          ${day.isFuture ? '' : 'ring-[0.5px] ring-inset ring-black/5 dark:ring-white/10'}
                          relative overflow-hidden`}
                          style={{
                            position: 'relative',
                            transform:
                              day.contributionCount > 0
                                ? 'translateZ(0)'
                                : 'none', // Better rendering for cells with contributions
                          }}
                          onMouseEnter={e => handleDayHover(day, e)}
                          onTouchStart={e =>
                            handleTouchStart(
                              {
                                date: formatDate(day.date),
                                contributionCount: day.contributionCount,
                              },
                              e
                            )
                          }
                          onMouseLeave={() => setHoveredDay(null)}
                          aria-label={`${formatDate(day.date)}: ${
                            day.isFuture
                              ? 'Future date'
                              : `${day.contributionCount} contributions`
                          }`}
                        >
                          {/* Add subtle shine effect for cells with contributions */}
                          {day.contributionCount > 0 && (
                            <div
                              className="absolute inset-0 opacity-30 bg-gradient-to-br from-white to-transparent"
                              style={{
                                clipPath:
                                  'polygon(0 0, 50% 0, 100% 50%, 50% 100%, 0 50%)',
                                mixBlendMode: 'soft-light',
                              }}
                            ></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Tooltip */}
        {hoveredDay && (
          <div
            ref={tooltipRef}
            className="fixed pointer-events-none bg-l-bg-1 dark:bg-d-bg-1 py-2 px-3 rounded-md shadow-lg border border-border-l dark:border-border-d text-sm z-50 transition-opacity duration-150 opacity-100"
          >
            <div className="font-medium text-l-text-1 dark:text-d-text-1">
              {hoveredDay.date}
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
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="text-xs text-l-text-3 dark:text-d-text-3">
          {typeof window !== 'undefined' && window.innerWidth < 640 && (
            <span>Scroll horizontally to view all data</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-l-text-3 dark:text-d-text-3">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-l-bg-3 to-l-bg-3/90 dark:from-d-bg-3 dark:to-d-bg-3/90 ring-[0.5px] ring-inset ring-black/5 dark:ring-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-[#9be9a8] to-[#9be9a8]/90 dark:from-[#0e4429] dark:to-[#0e4429]/90 ring-[0.5px] ring-inset ring-black/5 dark:ring-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-[#40c463] to-[#40c463]/90 dark:from-[#006d32] dark:to-[#006d32]/90 ring-[0.5px] ring-inset ring-black/5 dark:ring-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-[#30a14e] to-[#30a14e]/90 dark:from-[#26a641] dark:to-[#26a641]/90 ring-[0.5px] ring-inset ring-black/5 dark:ring-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-[#216e39] to-[#216e39]/90 dark:from-[#39d353] dark:to-[#39d353]/90 ring-[0.5px] ring-inset ring-black/5 dark:ring-white/10"></div>
          <span>More</span>

          {/* Add explanation for future dates if we're showing the current year */}
          {selectedYear === new Date().getFullYear() && (
            <>
              <span className="ml-3 mr-1">Future:</span>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-l-bg-3/40 dark:bg-d-bg-3/40 border border-dashed border-l-bg-3 dark:border-d-bg-3"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Add a CSS class to hide scrollbars but keep functionality
const styleElement =
  typeof document !== 'undefined' ? document.createElement('style') : null;
if (styleElement) {
  styleElement.textContent = `
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;
  document.head.appendChild(styleElement);
}
