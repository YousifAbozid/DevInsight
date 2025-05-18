import { useState } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface MinimalTypographicThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function MinimalTypographicTheme({
  user,
  repositories,
}: MinimalTypographicThemeProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate total stars
  const totalStars =
    repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0;

  // Calculate total commits (estimate based on repository sizes)
  const totalCommits =
    repositories?.reduce((sum, repo) => {
      // Generate a reasonable estimate based on repo size and stars
      const estimatedCommits = Math.floor(
        (repo.size / 100) * (1 + repo.stargazers_count * 0.1)
      );
      return sum + (estimatedCommits || 5); // Minimum 5 commits per repo
    }, 0) || 0;

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div
      className="w-full max-w-md bg-white dark:bg-black transition-all duration-300"
      style={{
        fontFamily: "'Inter', sans-serif",
        padding: '2rem',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-12">
        {/* Large username heading */}
        <div className="space-y-2">
          <h1
            className="text-6xl font-black tracking-tight text-black dark:text-white transition-transform duration-300"
            style={{
              transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
              fontFamily:
                "'Inter', 'SF Pro Display', -apple-system, sans-serif",
              letterSpacing: '-0.03em',
            }}
          >
            {user.name || user.login}
          </h1>

          <div className="flex items-center">
            <div
              className="text-xl font-mono font-light text-gray-600 dark:text-gray-400 flex items-center gap-2"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <Icons.GitHub className="w-4 h-4" />
              {user.login}
            </div>
          </div>
        </div>

        {/* Large stats as typography */}
        <div className="grid grid-cols-3">
          <div>
            <div
              className="text-5xl font-bold text-black dark:text-white"
              style={{ letterSpacing: '-0.03em' }}
            >
              {user.public_repos}
            </div>
            <div className="text-base uppercase tracking-widest text-gray-400 font-light">
              Repos
            </div>
          </div>

          <div>
            <div
              className="text-5xl font-bold text-black dark:text-white"
              style={{ letterSpacing: '-0.03em' }}
            >
              {formatNumber(totalStars)}
            </div>
            <div className="text-base uppercase tracking-widest text-gray-400 font-light">
              Stars
            </div>
          </div>

          <div>
            <div
              className="text-5xl font-bold text-black dark:text-white"
              style={{ letterSpacing: '-0.03em' }}
            >
              {formatNumber(totalCommits)}
            </div>
            <div className="text-base uppercase tracking-widest text-gray-400 font-light">
              Commits
            </div>
          </div>
        </div>

        {/* Horizontal rule */}
        <div
          className="h-px bg-black dark:bg-white transition-all duration-300"
          style={{
            width: isHovered ? '100%' : '40%',
            opacity: isHovered ? 1 : 0.3,
          }}
        ></div>

        {/* User bio with large typography */}
        {user.bio && (
          <div>
            <p
              className="text-xl leading-relaxed text-gray-800 dark:text-gray-200 italic"
              style={{
                fontFamily: "'Times New Roman', serif",
                fontWeight: 300,
                maxWidth: '40ch',
              }}
            >
              &quot;{user.bio}&quot;
            </p>
          </div>
        )}

        {/* Location and join date */}
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            {user.location && (
              <div className="flex items-center gap-2">
                <Icons.MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {user.location}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Icons.Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                Since {new Date(user.created_at).getFullYear()}
              </span>
            </div>
          </div>

          <div
            className="text-sm font-mono uppercase tracking-wide text-gray-400"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'transform 0.3s ease',
            }}
          >
            DevInsight
          </div>
        </div>
      </div>

      {/* Load fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=JetBrains+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
