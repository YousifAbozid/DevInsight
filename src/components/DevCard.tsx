import { Badge } from './DevCardGenerator';
import { useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);

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
        <div
          className="p-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-md shadow-sm hover:shadow-md transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 transition-transform duration-300"
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              />
              {user.twitter_username && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.035 10.035 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user.name || user.login}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <svg
                  className="w-3.5 h-3.5 mr-1 text-gray-500 dark:text-gray-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                @{user.login}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 mr-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                  </svg>
                </span>
                {repoCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Repos
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">
                <span className="text-yellow-500 dark:text-yellow-400 mr-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                  </svg>
                </span>
                {starCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Stars
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">
                <span className="text-blue-500 dark:text-blue-400 mr-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z" />
                  </svg>
                </span>
                {user.followers}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Followers
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-gray-800 dark:text-gray-200 font-medium">
              <span>Languages</span>
              <span className="text-gray-500 dark:text-gray-400">
                {topLanguages.length} used
              </span>
            </div>
            <div className="h-2 flex rounded-full overflow-hidden">
              {topLanguages.map(lang => (
                <div
                  key={lang.name}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 hover:translate-y-[-1px]"
                  style={{
                    backgroundColor: lang.color,
                    width: `${lang.percentage}%`,
                  }}
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
              {topLanguages.map(lang => (
                <div
                  key={lang.name}
                  className="flex items-center text-xs text-gray-600 dark:text-gray-400"
                >
                  <div
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: lang.color }}
                  />
                  {lang.name}{' '}
                  <span className="opacity-70 ml-1">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-center space-x-2">
            {badges?.map(badge => (
              <div
                key={badge.id}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${getBadgeColor(badge.tier)} transition-transform hover:scale-110 duration-200 shadow-sm`}
                title={badge.name}
              >
                <badge.icon className="w-5 h-5 text-white" />
              </div>
            ))}
          </div>

          <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400">
            Generated with{' '}
            <a
              href="https://github.com/YousifAbozid/DevInsight"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DevInsight
            </a>
          </div>
        </div>
      );

    case 'gradient':
      return (
        <div
          className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 p-6 rounded-lg w-full max-w-md text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                className={`w-24 h-24 rounded-full border-4 border-white/40 shadow-lg transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}
              />
              {user.twitter_username && (
                <div className="absolute -bottom-2 -right-2 bg-blue-400 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white/50">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.035 10.035 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                  </svg>
                </div>
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold text-white">
              {user.name || user.login}
            </h2>
            <p className="text-blue-100 flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-1 text-blue-200/80"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              @{user.login}
            </p>

            {user.bio && (
              <p className="mt-3 text-sm text-blue-50/90 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                {user.bio.length > 120
                  ? `${user.bio.substring(0, 120)}...`
                  : user.bio}
              </p>
            )}

            <div className="mt-6 grid grid-cols-4 gap-3 w-full">
              <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="flex justify-center mb-1.5">
                  <svg
                    className="w-4 h-4 text-blue-200"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
                  </svg>
                </div>
                <div className="text-xl font-bold">{repoCount}</div>
                <div className="text-xs text-blue-100/80">Repos</div>
              </div>
              <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="flex justify-center mb-1.5">
                  <svg
                    className="w-4 h-4 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                  </svg>
                </div>
                <div className="text-xl font-bold">{starCount}</div>
                <div className="text-xs text-blue-100/80">Stars</div>
              </div>
              <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="flex justify-center mb-1.5">
                  <svg
                    className="w-4 h-4 text-green-300"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  </svg>
                </div>
                <div className="text-xl font-bold">{forkCount}</div>
                <div className="text-xs text-blue-100/80">Forks</div>
              </div>
              <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="flex justify-center mb-1.5">
                  <svg
                    className="w-4 h-4 text-purple-300"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 3.25a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 111.5 3.25zm5.677-.177L9.573.677A.25.25 0 0110 .854V2.5h1A2.5 2.5 0 0113.5 5v5.628a2.251 2.251 0 11-1.5 0V5a1 1 0 00-1-1h-1v1.646a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm0 9.5a.75.75 0 100 1.5.75.75 0 000-1.5zm8.25.75a.75.75 0 101.5 0 .75.75 0 00-1.5 0z" />
                  </svg>
                </div>
                <div className="text-xl font-bold">{user.followers}</div>
                <div className="text-xs text-blue-100/80">Followers</div>
              </div>
            </div>

            {/* Add PRs and Issues Section */}
            <div className="w-full mt-5 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-blue-50">
                  Contribution Activity
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-blue-500/20 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-200"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z" />
                  </svg>
                  <div>
                    <div className="text-lg font-bold">
                      {user.public_repos || '?'}
                    </div>
                    <div className="text-xs text-blue-100/80">
                      Pull Requests
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-purple-500/20 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-200"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
                  </svg>
                  <div>
                    <div className="text-lg font-bold">
                      {user.public_gists || '?'}
                    </div>
                    <div className="text-xs text-blue-100/80">Issues</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-50">
                  Top Languages
                </span>
                <span className="text-xs text-blue-200/80">
                  {languageData.length} total
                </span>
              </div>

              <div className="bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                <div className="flex h-full">
                  {topLanguages.map((lang, index) => (
                    <div
                      key={lang.name}
                      className={`h-full ${index === 0 ? 'rounded-l-full' : ''} ${
                        index === topLanguages.length - 1
                          ? 'rounded-r-full'
                          : ''
                      } transition-all duration-300 hover:brightness-110`}
                      style={{
                        backgroundColor: lang.color,
                        width: `${lang.percentage}%`,
                      }}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                {topLanguages.map(lang => (
                  <div
                    key={lang.name}
                    className="flex items-center gap-1.5 text-xs bg-white/10 px-2 py-1 rounded-full"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    {lang.name}{' '}
                    <span className="text-blue-200/70">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {badges && badges.length > 0 && (
              <div className="mt-5 flex justify-center gap-2">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`p-2 rounded-lg ${getBadgeGradient(badge.tier)} flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200`}
                    title={badge.name}
                  >
                    <badge.icon className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-xs text-blue-100/60 flex items-center justify-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2z" />
              </svg>
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
