import { useRef, useEffect } from 'react';

export interface FilterTab {
  id: string | null;
  label: string;
  count?: number;
  icon?: React.FC<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTabId?: string | null;
  onTabChange?: (tabId: string | null) => void;
  className?: string;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

/**
 * A reusable component for horizontal scrollable filter tabs
 *
 * @param tabs - Array of tab objects with id, label, optional count and icon
 * @param activeTabId - ID of the currently active tab (or null for "All" tab)
 * @param onTabChange - Callback function when a tab is selected
 * @param className - Additional CSS classes for the container
 * @param scrollRef - Optional ref to the scroll container for external scroll control
 */
export default function FilterTabs({
  tabs,
  activeTabId,
  onTabChange,
  className = '',
  scrollRef: externalScrollRef,
}: FilterTabsProps) {
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const tabsScrollRef = externalScrollRef || internalScrollRef;

  // Scroll active tab into view when selected
  useEffect(() => {
    if (tabsScrollRef.current && activeTabId !== undefined) {
      const activeTabElement = tabsScrollRef.current.querySelector(
        `[data-tab-id="${activeTabId}"]`
      );
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeTabId, tabsScrollRef]);

  // Handle tab clicks - either use the tab's onClick or the parent onTabChange
  const handleTabClick = (tab: FilterTab) => {
    if (tab.onClick) {
      tab.onClick();
    } else if (onTabChange) {
      onTabChange(tab.id);
    }
  };

  return (
    <div className={`relative mb-4 ${className}`}>
      <div
        ref={tabsScrollRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1"
      >
        {/* Process all tabs, including the "All" tab if it's in the array */}
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive =
            tab.active !== undefined ? tab.active : activeTabId === tab.id;

          return (
            <button
              key={tab.id === null ? 'all' : tab.id}
              data-tab-id={tab.id}
              data-category={tab.id} // Support for category identification
              onClick={() => handleTabClick(tab)}
              className={`px-2.5 py-1.5 text-xs sm:text-sm rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-accent-1 text-white'
                  : 'bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
              }`}
            >
              {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
              {tab.label}
              {tab.count !== undefined && ` (${tab.count})`}
            </button>
          );
        })}
      </div>

      {/* Fade edge effect for scrollable content */}
      <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-l-bg-2 dark:from-d-bg-2 to-transparent pointer-events-none"></div>
    </div>
  );
}
