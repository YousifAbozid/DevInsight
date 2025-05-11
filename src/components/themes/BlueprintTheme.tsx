import { useState } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface BlueprintThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function BlueprintTheme({
  user,
  repositories,
  languageData,
}: BlueprintThemeProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Blueprint theme colors
  const blueprintBlue = '#0F52BA';
  const blueprintLight = '#CFDDF0';

  // Calculate total lines of code (estimate based on repositories)
  const totalLinesOfCode =
    repositories?.reduce((acc, repo) => {
      // Generate a pseudo-random but consistent code line count
      const pseudoLines = Math.floor(
        repo.size *
          2.5 *
          (1 + repo.stargazers_count * 0.01) *
          (1 + repo.forks_count * 0.05)
      );
      return acc + (pseudoLines || 100);
    }, 0) || 35842; // Fallback to a reasonable number if no repos

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Generate repo growth data (simulated)
  const repoGrowthData = [];
  if (repositories && repositories.length > 0) {
    // Get earliest and latest repo creation dates
    const dates = repositories.map(repo => new Date(repo.created_at));
    const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const latestDate = new Date();

    // Generate quarterly data points
    const startYear = earliestDate.getFullYear();
    const startQuarter = Math.floor(earliestDate.getMonth() / 3);
    const endYear = latestDate.getFullYear();
    const endQuarter = Math.floor(latestDate.getMonth() / 3);

    // Calculate total quarters to generate points for
    const totalQuarters =
      (endYear - startYear) * 4 + (endQuarter - startQuarter + 1);
    const quarterStep = Math.max(1, Math.floor(totalQuarters / 6)); // Limit to ~6 data points

    let repoCount = 0;
    for (let i = 0; i < totalQuarters; i += quarterStep) {
      const currentYear = startYear + Math.floor((startQuarter + i) / 4);
      const currentQuarter = ((startQuarter + i) % 4) + 1;

      // Count repos created before or during this quarter
      const quarterEndDate = new Date(currentYear, currentQuarter * 3, 0);
      repoCount = repositories.filter(
        repo => new Date(repo.created_at) <= quarterEndDate
      ).length;

      repoGrowthData.push({
        label: `Q${currentQuarter} ${currentYear}`,
        count: repoCount,
      });
    }

    // Ensure we include the latest data point
    if (
      repoGrowthData.length > 0 &&
      repoGrowthData[repoGrowthData.length - 1].count !== repositories.length
    ) {
      repoGrowthData.push({
        label: `Q${endQuarter + 1} ${endYear}`,
        count: repositories.length,
      });
    }
  }

  // Calculate max repo count for scaling
  const maxRepoCount = Math.max(...repoGrowthData.map(d => d.count), 1);

  return (
    <div
      className="w-full max-w-md rounded-lg transition-all duration-300 overflow-hidden"
      style={{
        backgroundColor: '#F8FBFF',
        border: `2px solid ${blueprintBlue}`,
        boxShadow: isHovered
          ? `0 0 20px rgba(15, 82, 186, 0.5)`
          : `0 0 5px rgba(15, 82, 186, 0.3)`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Grid background for blueprint effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(${blueprintLight} 1px, transparent 1px), 
                            linear-gradient(90deg, ${blueprintLight} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          opacity: 0.5,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Blueprint header with title block */}
        <div
          className="border-2 border-solid mb-6 relative"
          style={{ borderColor: blueprintBlue }}
        >
          <div
            className="absolute top-0 left-0 px-4 py-1 text-white font-bold"
            style={{ backgroundColor: blueprintBlue }}
          >
            DEVELOPER PROFILE
          </div>

          <div className="pt-8 pb-4 px-4">
            <div className="flex items-center">
              <div className="mr-4">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-20 h-20 border-2 rounded-md"
                  style={{
                    borderColor: blueprintBlue,
                    filter:
                      'grayscale(100%) sepia(100%) hue-rotate(190deg) saturate(200%) brightness(0.7)',
                  }}
                />
              </div>

              <div>
                <h2
                  className="text-xl font-bold uppercase"
                  style={{ color: blueprintBlue }}
                >
                  {user.name || user.login}
                </h2>

                <div
                  className="text-sm flex items-center gap-1"
                  style={{ color: blueprintBlue }}
                >
                  <Icons.GitHub className="w-3.5 h-3.5" />
                  <span>@{user.login}</span>
                </div>

                {user.location && (
                  <div
                    className="text-sm mt-1 flex items-center gap-1"
                    style={{ color: blueprintBlue }}
                  >
                    <Icons.MapPin className="w-3.5 h-3.5" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Blueprint specifications */}
            <div
              className="mt-4 pt-3 text-sm grid grid-cols-2 gap-x-4 gap-y-2"
              style={{
                borderTop: `1px dashed ${blueprintBlue}`,
                color: blueprintBlue,
              }}
            >
              <div className="flex justify-between">
                <span>REPOSITORIES:</span>
                <span className="font-mono">{user.public_repos}</span>
              </div>

              <div className="flex justify-between">
                <span>FOLLOWERS:</span>
                <span className="font-mono">{user.followers}</span>
              </div>

              <div className="flex justify-between">
                <span>ACCOUNT CREATED:</span>
                <span className="font-mono">
                  {new Date(user.created_at).toISOString().split('T')[0]}
                </span>
              </div>

              <div className="flex justify-between">
                <span>ANALYZED LOC:</span>
                <span className="font-mono">
                  {formatNumber(totalLinesOfCode)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Languages section - blueprint diagram */}
        <div
          className="mb-6 border-2 border-solid relative"
          style={{ borderColor: blueprintBlue }}
        >
          <div
            className="absolute top-0 left-0 px-4 py-1 text-white font-bold"
            style={{ backgroundColor: blueprintBlue }}
          >
            LANGUAGE ANALYSIS
          </div>

          <div className="pt-8 pb-4 px-4">
            <div className="space-y-3">
              {languageData.slice(0, 5).map(lang => (
                <div key={lang.name}>
                  <div className="flex justify-between mb-1">
                    <div
                      className="text-sm font-mono"
                      style={{ color: blueprintBlue }}
                    >
                      {lang.name}
                    </div>
                    <div
                      className="text-sm font-mono"
                      style={{ color: blueprintBlue }}
                    >
                      {lang.percentage.toFixed(1)}%
                    </div>
                  </div>

                  <div
                    className="h-6 flex items-center bg-white relative overflow-hidden"
                    style={{ border: `1px solid ${blueprintBlue}` }}
                  >
                    <div
                      className="absolute top-0 bottom-0 left-0 z-0"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: blueprintLight,
                        backgroundImage: `repeating-linear-gradient(45deg, ${blueprintBlue} 0, ${blueprintBlue} 1px, transparent 0, transparent 10px)`,
                      }}
                    />

                    <div
                      className="relative z-10 mx-2 text-xs font-mono"
                      style={{ color: blueprintBlue }}
                    >
                      {Math.round((totalLinesOfCode * lang.percentage) / 100)}{' '}
                      lines
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Repository Growth Chart - blueprint style */}
        <div
          className="mb-6 border-2 border-solid relative"
          style={{ borderColor: blueprintBlue }}
        >
          <div
            className="absolute top-0 left-0 px-4 py-1 text-white font-bold"
            style={{ backgroundColor: blueprintBlue }}
          >
            REPOSITORY GROWTH
          </div>

          <div className="pt-8 pb-4 px-4">
            <div
              className="h-40 relative"
              style={{
                backgroundImage: `linear-gradient(${blueprintLight} 1px, transparent 1px), 
                                  linear-gradient(90deg, ${blueprintLight} 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            >
              {/* Y-axis and X-axis */}
              <div
                className="absolute top-0 bottom-0 left-0 w-px"
                style={{ backgroundColor: blueprintBlue }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ backgroundColor: blueprintBlue }}
              />

              {/* Data points and connecting lines */}
              <svg
                className="absolute inset-0"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <polyline
                  points={repoGrowthData
                    .map(
                      (point, index) =>
                        `${(index / (repoGrowthData.length - 1)) * 100}, 
                     ${100 - (point.count / maxRepoCount) * 100}`
                    )
                    .join(' ')}
                  fill="none"
                  stroke={blueprintBlue}
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />

                {repoGrowthData.map((point, index) => (
                  <circle
                    key={index}
                    cx={`${(index / (repoGrowthData.length - 1)) * 100}`}
                    cy={`${100 - (point.count / maxRepoCount) * 100}`}
                    r="1"
                    fill="white"
                    stroke={blueprintBlue}
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>

              {/* X-axis labels */}
              <div className="absolute left-0 right-0 bottom-0 flex justify-between transform translate-y-4">
                {repoGrowthData.map((point, index) => (
                  <div
                    key={index}
                    className="text-xs font-mono -ml-4"
                    style={{ color: blueprintBlue }}
                  >
                    {point.label}
                  </div>
                ))}
              </div>

              {/* Y-axis max value */}
              <div
                className="absolute top-0 left-0 transform -translate-y-3 -translate-x-4 text-xs font-mono"
                style={{ color: blueprintBlue }}
              >
                {maxRepoCount}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - blueprint notation */}
        <div
          className="text-xs font-mono text-center"
          style={{ color: blueprintBlue }}
        >
          PREPARED BY DEVINSIGHT • SCALE 1:1 • REV{' '}
          {Math.floor(Math.random() * 10)}.{Math.floor(Math.random() * 10)}
        </div>
      </div>
    </div>
  );
}
