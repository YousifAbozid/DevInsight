import { useState } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface PastelGardenThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function PastelGardenTheme({
  user,
  repositories,
  languageData,
}: PastelGardenThemeProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get top 3 repositories by stars
  const topRepos =
    repositories
      ?.sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3) || [];

  // Format GitHub join date
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      day: 'numeric',
    });
  };

  // Calculate contributions last month (this would come from actual data)
  const lastMonthContributions =
    repositories?.reduce((sum, repo) => {
      // Simple approximation of recent contributions
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const isRecent = new Date(repo.updated_at) > threeMonthsAgo;
      return sum + (isRecent ? Math.min(repo.stargazers_count, 10) : 0);
    }, 0) || 42;

  // Top languages
  const topLanguages = languageData.slice(0, 3);

  return (
    <div
      className="w-full max-w-md rounded-2xl p-6 transition-all duration-300 bg-gradient-to-br from-[#f9f3f3] to-[#f2f7f2] dark:from-[#232125] dark:to-[#1c231e] shadow-md dark:shadow-lg"
      style={{
        boxShadow: isHovered
          ? '0 10px 25px rgba(154, 190, 156, 0.4)'
          : '0 6px 15px rgba(154, 190, 156, 0.2)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Profile section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-3">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f6c9bc] to-[#c3e2c2] dark:from-[#b6796c] dark:to-[#83a282] blur-md opacity-60 transform scale-110"></div>
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 relative z-10"
          />

          {/* Little flower decorations */}
          <div className="absolute -top-2 -right-1 z-20 text-pink-300 dark:text-pink-400">
            <Icons.Flower className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-1 -left-2 z-20 text-green-300 dark:text-green-400 transform rotate-45">
            <Icons.Flower className="w-5 h-5" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#4e6151] dark:text-[#a3c2af]">
          {user.name || user.login}
        </h2>
        <p className="text-[#93ab95] dark:text-[#7e9783] flex items-center gap-1.5 mt-1">
          <Icons.GitHub className="w-4 h-4" />@{user.login}
        </p>
      </div>

      {/* Join date and last month contributions */}
      <div className="flex justify-between items-center bg-white/60 dark:bg-gray-800/40 rounded-2xl p-4 mb-4 shadow-sm">
        <div>
          <div className="text-[#93ab95] dark:text-[#7e9783] text-sm mb-1 flex items-center gap-1.5">
            <Icons.Calendar className="w-4 h-4 text-[#f6c9bc] dark:text-[#e5b8ab]" />
            Joined GitHub
          </div>
          <div className="text-[#4e6151] dark:text-[#a3c2af] font-medium">
            {formatJoinDate(user.created_at)}
          </div>
        </div>

        <div>
          <div className="text-[#93ab95] dark:text-[#7e9783] text-sm mb-1 flex items-center gap-1.5">
            <Icons.Activity className="w-4 h-4 text-[#e8a598] dark:text-[#d79587]" />
            Last Month
          </div>
          <div className="text-[#4e6151] dark:text-[#a3c2af] font-medium">
            {lastMonthContributions} contributions
          </div>
        </div>
      </div>

      {/* Top repos section */}
      <div className="mb-4">
        <h3 className="font-medium text-[#4e6151] dark:text-[#a3c2af] mb-3 flex items-center gap-2">
          <Icons.Star className="w-4 h-4 text-[#f6c9bc] dark:text-[#e5b8ab]" />
          <span>Top Repositories</span>
        </h3>

        <div className="space-y-2">
          {topRepos.map(repo => (
            <div
              key={repo.id}
              className="bg-white/60 dark:bg-gray-800/40 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#4e6151] dark:text-[#a3c2af] truncate">
                    {repo.name}
                  </h4>
                  {repo.description && (
                    <p className="text-sm text-[#93ab95] dark:text-[#7e9783] line-clamp-1 mt-0.5">
                      {repo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[#93ab95] dark:text-[#7e9783] text-sm">
                  <Icons.Star className="w-3.5 h-3.5 text-[#f6c9bc] dark:text-[#e5b8ab]" />
                  {repo.stargazers_count}
                </div>
              </div>

              {repo.language && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#93ab95] dark:text-[#7e9783]">
                  <span className="w-2 h-2 rounded-full bg-[#c3e2c2] dark:bg-[#83a282]"></span>
                  {repo.language}
                </div>
              )}
            </div>
          ))}

          {topRepos.length === 0 && (
            <div className="text-center py-4 text-[#93ab95] dark:text-[#7e9783] italic bg-white/40 dark:bg-gray-800/30 rounded-xl">
              No repositories to display
            </div>
          )}
        </div>
      </div>

      {/* Language section */}
      <div className="mb-5">
        <h3 className="font-medium text-[#4e6151] dark:text-[#a3c2af] mb-3 flex items-center gap-2">
          <Icons.Code className="w-4 h-4 text-[#e8a598] dark:text-[#d79587]" />
          <span>Top Languages</span>
        </h3>

        <div className="bg-white/60 dark:bg-gray-800/40 rounded-xl p-3 shadow-sm">
          <div className="h-3 rounded-full bg-white/75 dark:bg-gray-700/75 overflow-hidden flex mb-3">
            {topLanguages.map((lang, index) => (
              <div
                key={lang.name}
                style={{
                  backgroundColor: lang.color,
                  width: `${lang.percentage}%`,
                }}
                className={`h-full ${index === 0 ? 'rounded-l-full' : ''} ${
                  index === topLanguages.length - 1 ? 'rounded-r-full' : ''
                }`}
                title={`${lang.name}: ${lang.percentage}%`}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {topLanguages.map(lang => (
              <div
                key={lang.name}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/75 dark:bg-gray-700/60 rounded-full text-xs"
              >
                <div
                  style={{ backgroundColor: lang.color }}
                  className="w-2 h-2 rounded-full"
                />
                <span className="text-[#4e6151] dark:text-[#a3c2af]">
                  {lang.name}
                </span>
                <span className="text-[#93ab95] dark:text-[#7e9783]">
                  {lang.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-white/60 dark:bg-gray-800/40 rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[#93ab95] dark:text-[#7e9783] text-xs mb-1 flex items-center justify-center gap-1">
            <Icons.Folder className="w-3 h-3 text-[#e8a598] dark:text-[#d79587]" />
            Repos
          </div>
          <div className="text-[#4e6151] dark:text-[#a3c2af] font-bold">
            {repositories?.length || 0}
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/40 rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[#93ab95] dark:text-[#7e9783] text-xs mb-1 flex items-center justify-center gap-1">
            <Icons.Star className="w-3 h-3 text-[#f6c9bc] dark:text-[#e5b8ab]" />
            Stars
          </div>
          <div className="text-[#4e6151] dark:text-[#a3c2af] font-bold">
            {repositories?.reduce(
              (sum, repo) => sum + repo.stargazers_count,
              0
            ) || 0}
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/40 rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[#93ab95] dark:text-[#7e9783] text-xs mb-1 flex items-center justify-center gap-1">
            <Icons.Users className="w-3 h-3 text-[#c3e2c2] dark:text-[#83a282]" />
            Followers
          </div>
          <div className="text-[#4e6151] dark:text-[#a3c2af] font-bold">
            {user.followers}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-xs text-[#93ab95] dark:text-[#7e9783] pt-3 border-t border-[#c3e2c2] dark:border-[#83a282]/50">
        <span className="flex items-center justify-center gap-1.5">
          <Icons.Butterfly className="w-3.5 h-3.5 text-[#f6c9bc] dark:text-[#e5b8ab]" />
          Generated with DevInsight
        </span>
      </div>
    </div>
  );
}
