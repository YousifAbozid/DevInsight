import { useState } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface FinanceDashboardThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function FinanceDashboardTheme({
  user,
  repositories,
}: FinanceDashboardThemeProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate total stars
  const totalStars =
    repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0;

  // Generate monthly commit data (simulated based on repo data)
  const generateMonthlyCommitData = () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentMonth = new Date().getMonth();

    // Last 6 months
    const lastMonths = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - i + 12) % 12; // Handle wrapping around to previous year
      return months[monthIndex];
    }).reverse();

    // Generate commit data based on repo update frequencies
    return lastMonths.map((month, i) => {
      // Base the commits on repository counts and some random noise for natural variation
      const baseFactor = repositories ? repositories.length * 5 : 20;
      // More recent months are more likely to have more activity
      const recencyMultiplier = 0.7 + i * 0.05;
      // Add randomness
      const randomFactor = 0.7 + Math.random() * 0.6;

      const value = Math.floor(baseFactor * recencyMultiplier * randomFactor);
      return { month, value };
    });
  };

  // Find most active repo (by estimated activity)
  const findMostActiveRepo = () => {
    if (!repositories || repositories.length === 0) return null;

    return repositories.reduce(
      (mostActive, repo) => {
        // Create an activity score based on recency and popularity
        const daysSinceUpdate = Math.max(
          1,
          Math.floor(
            (new Date().getTime() - new Date(repo.updated_at).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        );

        const activityScore =
          repo.stargazers_count * 2 +
          repo.forks_count * 3 +
          repo.size / 100 +
          100 / daysSinceUpdate; // Higher score for recently updated repos

        return activityScore > mostActive.score
          ? { repo, score: activityScore }
          : mostActive;
      },
      { repo: repositories[0], score: 0 }
    ).repo;
  };

  const monthlyCommitData = generateMonthlyCommitData();
  const mostActiveRepo = findMostActiveRepo();

  // Calculate max commits for scaling the chart
  const maxCommits = Math.max(...monthlyCommitData.map(d => d.value));

  // Calculate stars gained in last period (simulated)
  const calculateStarTrend = () => {
    if (!repositories || repositories.length === 0)
      return { count: 0, isPositive: true };

    // Simulate stars gained by looking at star counts and creation dates
    const totalStars = repositories.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );
    const averageRepoAge =
      repositories.reduce(
        (sum, repo) =>
          sum + (new Date().getTime() - new Date(repo.created_at).getTime()),
        0
      ) / repositories.length;

    const averageAgeInDays = averageRepoAge / (1000 * 60 * 60 * 24);
    const dailyStarRate = totalStars / Math.max(1, averageAgeInDays);
    const lastMonthStars = Math.round(dailyStarRate * 30);

    // Randomize whether it's positive or negative compared to previous period
    const isPositive = Math.random() > 0.3; // 70% chance of positive trend
    const previousPeriodStars = Math.round(
      lastMonthStars * (isPositive ? 0.7 : 1.2)
    );
    const difference = Math.abs(lastMonthStars - previousPeriodStars);

    return {
      count: difference,
      isPositive,
    };
  };

  const starTrend = calculateStarTrend();

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              {user.name || user.login}
            </h2>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Icons.GitHub className="w-3 h-3" />
              {user.login}
            </div>
          </div>
        </div>

        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
          Active
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'overview'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>

        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'activity'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>

        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'repos'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('repos')}
        >
          Repositories
        </button>
      </div>

      {/* Content area */}
      <div className="p-4">
        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Repos
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {user.public_repos}
            </div>
            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
              <Icons.Folder className="w-3 h-3 mr-1" />
              All time
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Stars
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {formatNumber(totalStars)}
            </div>
            <div className="flex items-center mt-1 text-xs">
              <span
                className={
                  starTrend.isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }
              >
                <span className="flex items-center">
                  {starTrend.isPositive ? (
                    <Icons.TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <Icons.TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {starTrend.count} last month
                </span>
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Followers
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {user.followers}
            </div>
            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
              <Icons.Users className="w-3 h-3 mr-1" />
              Total
            </div>
          </div>
        </div>

        {/* Weekly commit chart */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Commits
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last 6 months
            </div>
          </div>

          {/* Chart */}
          <div className="h-36 flex items-end gap-2">
            {monthlyCommitData.map((data, i) => (
              <div
                key={data.month}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full bg-blue-500 dark:bg-blue-600 rounded-t"
                  style={{
                    height: `${(data.value / maxCommits) * 100}%`,
                    opacity:
                      activeTab === 'overview' ||
                      (activeTab === 'activity' && i >= 3)
                        ? 1
                        : 0.5,
                  }}
                ></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {data.month}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut chart for top languages */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Language Distribution
            </h3>
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
              Pro
            </div>
          </div>

          {/* Simplified donut chart */}
          <div className="flex">
            <div className="w-1/2 flex justify-center">
              <div className="w-24 h-24 rounded-full border-8 border-gray-200 dark:border-gray-700 relative">
                {/* Simulate donut slices with conic gradient */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'conic-gradient(#38bdf8 0% 25%, #fb7185 25% 60%, #a3e635 60% 85%, #c084fc 85% 100%)',
                  }}
                ></div>
                <div className="absolute inset-3 rounded-full bg-white dark:bg-gray-800"></div>
              </div>
            </div>

            <div className="w-1/2 space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#38bdf8] mr-2"></div>
                <div className="text-xs text-gray-800 dark:text-gray-200">
                  JavaScript (25%)
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#fb7185] mr-2"></div>
                <div className="text-xs text-gray-800 dark:text-gray-200">
                  TypeScript (35%)
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#a3e635] mr-2"></div>
                <div className="text-xs text-gray-800 dark:text-gray-200">
                  Python (25%)
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#c084fc] mr-2"></div>
                <div className="text-xs text-gray-800 dark:text-gray-200">
                  Others (15%)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Most active repository */}
        {mostActiveRepo && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                Most Active Repository
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last updated:{' '}
                {new Date(mostActiveRepo.updated_at).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                <Icons.Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {mostActiveRepo.name}
                </div>
                {mostActiveRepo.description && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {mostActiveRepo.description}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                {mostActiveRepo.language || 'No language'}
              </div>

              <div className="flex gap-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Icons.Star className="w-3.5 h-3.5 mr-1" />
                  {mostActiveRepo.stargazers_count}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Icons.Network className="w-3.5 h-3.5 mr-1" />
                  {mostActiveRepo.forks_count}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
        Generated with DevInsight • Updated today
      </div>
    </div>
  );
}
