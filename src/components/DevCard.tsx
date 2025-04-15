import { Badge } from './DevCardGenerator';

interface DevCardProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
  theme: 'default' | 'minimal' | 'gradient' | 'github';
}

export default function DevCard({
  user,
  repositories,
  languageData,
  badges,
  theme,
}: DevCardProps) {
  // Select only top 5 languages
  const topLanguages = languageData.slice(0, 5);

  // Total repositories count
  const repoCount = repositories?.length || 0;
  const starCount =
    repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0;
  const forkCount =
    repositories?.reduce((sum, repo) => sum + repo.forks_count, 0) || 0;

  // Generate component based on theme
  switch (theme) {
    case 'minimal':
      return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-md">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user.name || user.login}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{user.login}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded bg-gray-100 dark:bg-gray-800">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {repoCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Repos
              </div>
            </div>
            <div className="text-center p-2 rounded bg-gray-100 dark:bg-gray-800">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {starCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Stars
              </div>
            </div>
            <div className="text-center p-2 rounded bg-gray-100 dark:bg-gray-800">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user.followers}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Followers
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-1.5">
            {topLanguages.map(lang => (
              <div
                key={lang.name}
                className="h-3 rounded-full"
                style={{
                  backgroundColor: lang.color,
                  width: `${lang.percentage}%`,
                }}
                title={`${lang.name}: ${lang.percentage}%`}
              />
            ))}
          </div>

          <div className="mt-3 flex justify-center space-x-1">
            {badges?.map(badge => (
              <div
                key={badge.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getBadgeColor(badge.tier)}`}
                title={badge.name}
              >
                <badge.icon className="w-4 h-4 text-white" />
              </div>
            ))}
          </div>

          <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400">
            Generated with DevInsight
          </div>
        </div>
      );

    case 'gradient':
      return (
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-lg w-full max-w-md text-white">
          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg"
            />
            <h2 className="mt-4 text-xl font-bold">
              {user.name || user.login}
            </h2>
            <p className="text-blue-100">@{user.login}</p>
            {user.bio && (
              <p className="mt-2 text-sm text-blue-50">
                {user.bio.length > 100
                  ? `${user.bio.substring(0, 100)}...`
                  : user.bio}
              </p>
            )}

            <div className="mt-6 grid grid-cols-3 gap-6 w-full">
              <div className="text-center">
                <div className="text-2xl font-bold">{repoCount}</div>
                <div className="text-xs text-blue-100">Repositories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{starCount}</div>
                <div className="text-xs text-blue-100">Stars</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.followers}</div>
                <div className="text-xs text-blue-100">Followers</div>
              </div>
            </div>

            <div className="mt-6 w-full">
              <div className="text-sm mb-2 text-blue-100">Top Languages</div>
              <div className="bg-blue-900/30 rounded-full h-3 overflow-hidden">
                <div className="flex h-full">
                  {topLanguages.map(lang => (
                    <div
                      key={lang.name}
                      className="h-full"
                      style={{
                        backgroundColor: lang.color,
                        width: `${lang.percentage}%`,
                      }}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-1 flex flex-wrap justify-center gap-2">
                {topLanguages.slice(0, 3).map(lang => (
                  <div
                    key={lang.name}
                    className="flex items-center gap-1 text-xs"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    {lang.name}
                  </div>
                ))}
              </div>
            </div>

            {badges && badges.length > 0 && (
              <div className="mt-4 flex justify-center gap-2">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`p-1.5 rounded-lg ${getBadgeGradient(badge.tier)} flex items-center justify-center`}
                    title={badge.name}
                  >
                    <badge.icon className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-xs text-blue-100/70">
              Generated with DevInsight
            </div>
          </div>
        </div>
      );

    case 'github':
      return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md w-full max-w-md">
          <div className="flex gap-4">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {user.name || user.login}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{user.login}
              </p>
              {user.bio && (
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {user.bio.length > 100
                    ? `${user.bio.substring(0, 100)}...`
                    : user.bio}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-x-4 gap-y-2 flex-wrap text-sm">
            {user.location && (
              <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{user.location}</span>
              </div>
            )}
            {user.twitter_username && (
              <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.615 11.615 0 006.29 1.84" />
                </svg>
                <span>@{user.twitter_username}</span>
              </div>
            )}
          </div>

          <div className="mt-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    className="w-4 h-4"
                  >
                    <path
                      fill="currentColor"
                      d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5V2.5Zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2v-3.25Z"
                    />
                  </svg>
                  <span className="text-sm font-semibold">Repositories</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {repoCount}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    className="w-4 h-4"
                  >
                    <path
                      fill="currentColor"
                      d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"
                    />
                  </svg>
                  <span className="text-sm font-semibold">Stars Earned</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {starCount}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2 text-gray-800 dark:text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  className="w-4 h-4"
                >
                  <path
                    fill="currentColor"
                    d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
                  />
                </svg>
                <span className="text-sm font-semibold">Languages</span>
              </div>

              <div className="h-2 flex rounded-full overflow-hidden">
                {topLanguages.map(lang => (
                  <div
                    key={lang.name}
                    className="h-full"
                    style={{
                      backgroundColor: lang.color,
                      width: `${lang.percentage}%`,
                    }}
                    title={`${lang.name}: ${lang.percentage}%`}
                  />
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {topLanguages.map(lang => (
                  <div
                    key={lang.name}
                    className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    {lang.name}{' '}
                    <span className="text-gray-500 dark:text-gray-400">
                      {lang.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {badges && badges.length > 0 && (
            <div className="mt-4 flex gap-2">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className="px-2 py-1 text-xs rounded-full flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  title={badge.name}
                >
                  <badge.icon className="w-3.5 h-3.5" />
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
            <a
              href="https://github.com/YousifAbozid/DevInsight"
              className="hover:text-blue-500"
            >
              Generated with DevInsight
            </a>
          </div>
        </div>
      );

    // Default theme
    default:
      return (
        <div className="p-6 bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border border-border-l dark:border-border-d w-full max-w-md">
          <div className="flex flex-col items-center">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="w-24 h-24 rounded-full border-4 border-accent-1"
            />
            <h2 className="mt-2 text-xl font-bold text-l-text-1 dark:text-d-text-1">
              {user.name || user.login}
            </h2>
            <a
              href={`https://github.com/${user.login}`}
              className="text-accent-1 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @{user.login}
            </a>
            {user.bio && (
              <p className="mt-2 text-center text-sm text-l-text-2 dark:text-d-text-2">
                {user.bio.length > 100
                  ? `${user.bio.substring(0, 100)}...`
                  : user.bio}
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-lg text-center">
              <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
                {repoCount}
              </div>
              <div className="text-xs text-l-text-3 dark:text-d-text-3">
                Repositories
              </div>
            </div>
            <div className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-lg text-center">
              <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
                {starCount}
              </div>
              <div className="text-xs text-l-text-3 dark:text-d-text-3">
                Stars
              </div>
            </div>
            <div className="bg-l-bg-1 dark:bg-d-bg-1 p-2 rounded-lg text-center">
              <div className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
                {forkCount}
              </div>
              <div className="text-xs text-l-text-3 dark:text-d-text-3">
                Forks
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-l-text-1 dark:text-d-text-1">
                Top Languages
              </div>
              <div className="text-xs text-l-text-3 dark:text-d-text-3">
                {languageData.length} total
              </div>
            </div>

            <div className="space-y-2">
              {topLanguages.map(lang => (
                <div key={lang.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: lang.color }}
                  />
                  <div className="text-sm text-l-text-2 dark:text-d-text-2">
                    {lang.name}
                  </div>
                  <div className="ml-auto text-xs text-l-text-3 dark:text-d-text-3">
                    {lang.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {badges && badges.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-medium text-l-text-1 dark:text-d-text-1 mb-2">
                Developer Badges
              </div>
              <div className="flex gap-2">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`p-2 rounded-lg ${getBadgeBgClass(badge.tier)} flex flex-col items-center gap-1`}
                    title={badge.name}
                  >
                    <badge.icon className="w-6 h-6 text-l-text-1 dark:text-d-text-1" />
                    <span className="text-xs text-l-text-2 dark:text-d-text-2">
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-border-l dark:border-border-d text-center">
            <div className="text-xs text-l-text-3 dark:text-d-text-3">
              Generated with
              <a
                href="https://github.com/YousifAbozid/DevInsight"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-accent-1 hover:underline"
              >
                DevInsight
              </a>
            </div>
          </div>
        </div>
      );
  }
}

// Helper functions for badge styling
function getBadgeBgClass(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'bg-[#CD7F32]/10';
    case 'silver':
      return 'bg-[#C0C0C0]/10';
    case 'gold':
      return 'bg-[#FFD700]/10';
    case 'platinum':
      return 'bg-[#E5E4E2]/10';
    default:
      return 'bg-l-bg-3 dark:bg-d-bg-3';
  }
}

function getBadgeColor(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'bg-[#CD7F32]';
    case 'silver':
      return 'bg-[#C0C0C0]';
    case 'gold':
      return 'bg-[#FFD700]';
    case 'platinum':
      return 'bg-[#E5E4E2]';
    default:
      return 'bg-gray-400';
  }
}

function getBadgeGradient(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'bg-gradient-to-br from-amber-600 to-amber-700';
    case 'silver':
      return 'bg-gradient-to-br from-gray-400 to-gray-500';
    case 'gold':
      return 'bg-gradient-to-br from-yellow-400 to-yellow-500';
    case 'platinum':
      return 'bg-gradient-to-br from-gray-300 to-gray-400';
    default:
      return 'bg-gradient-to-br from-gray-500 to-gray-600';
  }
}
