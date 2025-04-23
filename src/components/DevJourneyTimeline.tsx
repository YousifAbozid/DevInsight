import { useState } from 'react';
import { ContributionData } from '../services/githubGraphQLService';
import { Icons } from './shared/Icons';
import SectionHeader from './shared/SectionHeader';
import FilterTabs, { FilterTab } from './shared/FilterTabs';
import DevJourneyTimelineSkeleton from './shared/Skeletons/DevJourneyTimelineSkeleton';
import { useTimelineEvents, TimelineEvent } from '../hooks/useTimelineEvents';

interface DevJourneyTimelineProps {
  user: GithubUser;
  repositories?: Repository[];
  contributionData?: ContributionData;
  loading: boolean;
}

// Category configuration for timeline events
const eventTypeInfo = {
  all: {
    title: 'All Events',
    icon: Icons.Calendar,
    description: 'View your complete GitHub journey',
  },
  repo: {
    title: 'Repository Events',
    icon: Icons.Repo,
    description: 'Events related to your GitHub repositories',
  },
  star: {
    title: 'Star Achievements',
    icon: Icons.Star,
    description: 'Recognition from the GitHub community',
  },
  follower: {
    title: 'Follower Milestones',
    icon: Icons.Users,
    description: 'Growth of your GitHub following',
  },
  streak: {
    title: 'Contribution Streaks',
    icon: Icons.Fire,
    description: 'Periods of consistent activity on GitHub',
  },
  anniversary: {
    title: 'GitHub Anniversaries',
    icon: Icons.Cake,
    description: 'Celebrating your time on GitHub',
  },
  milestone: {
    title: 'Career Milestones',
    icon: Icons.Trophy,
    description: 'Significant achievements in your developer journey',
  },
};

// Helper function for rendering individual timeline events
function TimelineEventItem({ event }: { event: TimelineEvent }) {
  return (
    <div className="ml-12 relative group">
      <div
        className={`absolute -left-10  p-2 rounded-full flex items-center justify-center
          ${
            event.highlight
              ? 'bg-accent-1 text-white shadow-md shadow-accent-1/20'
              : 'bg-l-bg-3 dark:bg-d-bg-3 text-l-text-1 dark:text-d-text-1'
          } transition-all duration-300 group-hover:scale-110`}
      >
        <event.icon className="w-4 h-4" />
      </div>

      {/* Event content */}
      <div
        className={`p-4 rounded-lg border shadow-sm
        ${
          event.highlight
            ? 'bg-accent-1/10 border-accent-1/30 hover:bg-accent-1/15'
            : 'bg-l-bg-1 dark:bg-d-bg-1 border-border-l dark:border-border-d hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
        } transition-all duration-200`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="font-medium text-l-text-1 dark:text-d-text-1">
            {event.title}
          </h3>
          <span className="text-xs text-l-text-3 dark:text-d-text-3">
            {formatDate(event.date)}
          </span>
        </div>
        <p className="text-sm mt-1 text-l-text-2 dark:text-d-text-2">
          {event.description}
        </p>

        {/* Display additional metadata based on event type */}
        {event.type === 'repo' && event.metadata?.language && (
          <div className="mt-2 flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: event.metadata.languageColor || '#ddd',
              }}
            ></div>
            <span className="text-xs text-l-text-3 dark:text-d-text-3">
              {event.metadata.language}
            </span>
          </div>
        )}

        {event.type === 'star' && (
          <div className="mt-2 flex items-center gap-1">
            <Icons.Star className="w-3 h-3 text-accent-warning" />
            <span className="text-xs text-l-text-3 dark:text-d-text-3">
              {event.metadata?.stars}{' '}
              {event.metadata?.stars === 1 ? 'star' : 'stars'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component
export default function DevJourneyTimeline({
  user,
  repositories = [],
  contributionData,
  loading,
}: DevJourneyTimelineProps) {
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
  const [filter, setFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<boolean>(false);

  // Use the extracted hook
  const timelineEvents = useTimelineEvents(
    user,
    repositories,
    contributionData
  );

  if (loading) {
    return <DevJourneyTimelineSkeleton />;
  }

  if (!repositories || repositories.length === 0) {
    return null;
  }

  // Sort events by date (newest first)
  const sortedEvents = [...timelineEvents].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Filter events by type if filter is set
  const filteredEvents =
    filter === 'all'
      ? sortedEvents
      : sortedEvents.filter(event => event.type === filter);

  // For compact mode, limit to most important events or based on filter
  let displayEvents =
    viewMode === 'compact'
      ? filteredEvents.filter(event => event.highlight).slice(0, 5)
      : filteredEvents;

  // If expanded is false, limit to first 5 events
  if (!expanded && viewMode === 'detailed' && displayEvents.length > 5) {
    displayEvents = displayEvents.slice(0, 5);
  }

  // Count events by type for filter badges
  const eventCounts = sortedEvents.reduce(
    (counts, event) => {
      counts[event.type] = (counts[event.type] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );

  // Generate filter tabs from event types
  const filterTabs: FilterTab[] = [
    {
      id: 'all',
      label: 'All Events',
      count: sortedEvents.length,
      icon: Icons.Calendar,
      active: filter === 'all',
      onClick: () => setFilter('all'),
    },
    ...Object.keys(eventCounts).map(type => ({
      id: type,
      label: eventTypeInfo[type as keyof typeof eventTypeInfo]?.title || type,
      count: eventCounts[type],
      icon: eventTypeInfo[type as keyof typeof eventTypeInfo]?.icon,
      active: filter === type,
      onClick: () => setFilter(type),
    })),
  ];

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm">
      <SectionHeader
        title="Developer Journey Timeline"
        subtitle="Your GitHub story, from first commit to latest achievements"
        icon={Icons.Calendar}
        infoTooltip="The Developer Journey Timeline visualizes your GitHub milestones and achievements chronologically. It shows repository creations, contribution streaks, follower milestones, and important events from your developer career."
        rightControls={
          <div className="flex items-center p-1 bg-l-bg-1 dark:bg-d-bg-1 rounded-full border border-border-l dark:border-border-d">
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1 text-sm rounded-full transition-all cursor-pointer ${
                viewMode === 'compact'
                  ? 'bg-accent-1 text-white shadow-sm'
                  : 'bg-transparent text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
              }`}
            >
              Highlights
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 text-sm rounded-full transition-all cursor-pointer ${
                viewMode === 'detailed'
                  ? 'bg-accent-1 text-white shadow-sm'
                  : 'bg-transparent text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
              }`}
            >
              Full Journey
            </button>
          </div>
        }
      />

      <FilterTabs tabs={filterTabs} activeTabId={filter} />

      {/* Timeline container */}
      <div className="relative">
        {/* Vertical line with gradient effect */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-1/50 via-border-l dark:via-border-d to-border-l dark:to-border-d"></div>

        {/* Timeline events */}
        <div className="space-y-6">
          {displayEvents.length > 0 ? (
            <>
              {displayEvents.map(event => (
                <TimelineEventItem key={event.id} event={event} />
              ))}

              {/* Show more/less button for detailed view */}
              {viewMode === 'detailed' && filteredEvents.length > 5 && (
                <div className="ml-12 mt-4">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full py-2 px-4 text-sm border border-border-l dark:border-border-d rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Icons.ChevronDown
                      className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    />
                    {expanded
                      ? 'Show fewer events'
                      : `Show ${filteredEvents.length - 5} more events`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-l-text-3 dark:text-d-text-3">
                No timeline events to display
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-2 text-accent-1 hover:underline text-sm"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function needed in this component
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
