import { useState, useEffect } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface IOSWidgetThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function IOSWidgetTheme({
  user,
  repositories,
  languageData,
}: IOSWidgetThemeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get latest 3 repositories
  const latestRepos = repositories
    ? [...repositories]
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        .slice(0, 3)
    : [];

  // Generate commit activity by hour (simulated data based on repositories)
  const generateCommitHours = () => {
    // Initialize hours array (0-23)
    const hours = Array(24)
      .fill(0)
      .map((_, i) => ({ hour: i, count: 0 }));

    if (!repositories || repositories.length === 0) {
      // Generate random data if no repositories
      return hours.map(h => ({
        hour: h.hour,
        count: Math.floor(Math.random() * 8),
      }));
    }

    // Generate synthetic commit hours based on repo activity
    repositories.forEach(repo => {
      // Extract hour from updated_at
      const hour = new Date(repo.updated_at).getHours();

      // Add activity to that hour and surrounding hours
      hours[hour].count += 2 + Math.floor(repo.size / 1000);
      hours[(hour + 1) % 24].count += 1 + Math.floor(repo.size / 2000);
      hours[(hour + 23) % 24].count += 1 + Math.floor(repo.size / 2000);
    });

    return hours;
  };

  const commitHours = generateCommitHours();
  const maxCommits = Math.max(...commitHours.map(h => h.count));

  // Generate calendar activity data (simplified)
  const generateCalendarData = () => {
    const today = new Date();
    const days = [];

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);

      // Generate activity level (0-4)
      let activityLevel = 0;

      if (repositories && repositories.length > 0) {
        // Check for repository updates on this day
        const updatesOnDay = repositories.filter(repo => {
          const updateDate = new Date(repo.updated_at);
          return (
            updateDate.getDate() === day.getDate() &&
            updateDate.getMonth() === day.getMonth() &&
            updateDate.getFullYear() === day.getFullYear()
          );
        }).length;

        if (updatesOnDay > 3) activityLevel = 4;
        else if (updatesOnDay > 1) activityLevel = 3;
        else if (updatesOnDay > 0) activityLevel = 2;
        else if (Math.random() > 0.7) activityLevel = 1;
      } else {
        // Random data if no repositories
        activityLevel = Math.floor(Math.random() * 5);
      }

      days.push({
        date: day,
        level: activityLevel,
      });
    }

    return days;
  };

  const calendarData = generateCalendarData();

  // Format day for calendar display
  const formatDay = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
  };

  // Get iOS-style accent color based on user's primary language
  const getAccentColor = (): string => {
    if (!languageData || languageData.length === 0) return '#007AFF'; // Default iOS blue

    const primaryLang = languageData[0].name.toLowerCase();

    if (primaryLang.includes('javascript')) return '#FFCC00'; // Yellow
    if (primaryLang.includes('typescript')) return '#0A84FF'; // Blue
    if (primaryLang.includes('python')) return '#32D74B'; // Green
    if (primaryLang.includes('ruby')) return '#FF453A'; // Red
    if (primaryLang.includes('go')) return '#5E5CE6'; // Indigo
    if (primaryLang.includes('java')) return '#FF9F0A'; // Orange

    return '#007AFF'; // Default iOS blue
  };

  const accentColor = getAccentColor();

  return (
    <div
      className="w-full max-w-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="rounded-3xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Light mode glass
          boxShadow: isHovered
            ? '0 8px 32px rgba(0, 0, 0, 0.15)'
            : '0 4px 16px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header with time and user */}
        <div className="pt-4 px-5 pb-2 flex justify-between items-center">
          <div>
            <div className="text-xs font-medium text-gray-500">
              GitHub Activity
            </div>
            <div className="flex items-center">
              <Icons.GitHub className="w-3 h-3 mr-1 text-gray-800" />
              <span className="text-sm font-semibold text-gray-800">
                {user.login}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-medium text-gray-500">
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </div>
            <div className="text-sm font-semibold text-gray-800">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="px-5 py-2">
          {/* Active hours chart */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-semibold text-gray-800">
                Active Hours
              </h3>
              <span
                className="text-xs font-medium rounded-full px-2 py-0.5"
                style={{ backgroundColor: accentColor, color: 'white' }}
              >
                Today
              </span>
            </div>

            <div className="flex items-end h-24 gap-0.5">
              {commitHours.map(hour => (
                <div
                  key={hour.hour}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full rounded-sm transition-all duration-300"
                    style={{
                      height: `${(hour.count / maxCommits) * 100}%`,
                      backgroundColor:
                        hour.count > 0 ? accentColor : 'rgba(0, 0, 0, 0.1)',
                      opacity: isHovered
                        ? 1
                        : hour.hour >= 9 && hour.hour <= 17
                          ? 1
                          : 0.5, // Highlight working hours
                    }}
                  ></div>

                  {/* Show hour labels for 6am, 12pm, 6pm, 12am */}
                  {(hour.hour === 6 ||
                    hour.hour === 12 ||
                    hour.hour === 18 ||
                    hour.hour === 0) && (
                    <div className="text-xxs text-gray-500 mt-1">
                      {hour.hour === 0
                        ? '12a'
                        : hour.hour === 12
                          ? '12p'
                          : hour.hour > 12
                            ? `${hour.hour - 12}p`
                            : `${hour.hour}a`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Latest repos */}
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-gray-800 mb-2">
              Recent Activity
            </h3>

            <div className="space-y-2.5">
              {latestRepos.map(repo => (
                <div
                  key={repo.id}
                  className="flex items-center p-2.5 rounded-xl bg-white bg-opacity-50"
                  style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Icons.Code className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {repo.name}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="truncate mr-2">
                        Updated{' '}
                        {new Date(repo.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <div className="flex items-center">
                        <Icons.Star className="w-3 h-3 mr-0.5" />
                        {repo.stargazers_count}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {latestRepos.length === 0 && (
                <div className="text-center text-gray-500 text-xs p-3">
                  No recent repositories found
                </div>
              )}
            </div>
          </div>

          {/* Contribution calendar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-semibold text-gray-800">
                Contribution Activity
              </h3>
              <span className="text-xs text-gray-500">Last 7 days</span>
            </div>

            <div className="flex justify-between">
              {calendarData.map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-xxs text-gray-500 mb-1">
                    {formatDay(day.date)}
                  </div>
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{
                      backgroundColor:
                        day.level === 0
                          ? 'rgba(0, 0, 0, 0.05)'
                          : `${accentColor}${day.level * 25}`,
                      color: day.level > 2 ? 'white' : 'black',
                    }}
                  >
                    {day.date.getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* iOS-style footer indicator */}
        <div className="flex justify-center py-2">
          <div className="w-8 h-1 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Custom text size that's even smaller than xs */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .text-xxs {
          font-size: 0.65rem;
        }
      `,
        }}
      />
    </div>
  );
}
