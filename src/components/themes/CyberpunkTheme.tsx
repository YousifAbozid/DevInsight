import { useState } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';
import { useUserPullRequests } from '../../services/githubService';
import { useGithubToken } from '../../hooks/useStorage';

interface CyberpunkThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function CyberpunkTheme({
  user,
  repositories,
  languageData,
}: CyberpunkThemeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [token] = useGithubToken();

  // Get PR and issue counts using React Query hooks
  const { data: pullRequests = 0 } = useUserPullRequests(user.login, token);

  // Calculate metrics
  const repoCount = repositories?.length || 0;
  const totalStars =
    repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0;

  // Format date in cyberpunk style
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div
      className="w-full max-w-md rounded-lg p-6 transition-all duration-300"
      style={{
        background:
          'linear-gradient(135deg, #0d0221 0%, #150941 50%, #0a0219 100%)',
        boxShadow: isHovered
          ? '0 0 25px rgba(255, 0, 230, 0.5), 0 0 15px rgba(21, 255, 253, 0.3)'
          : '0 0 15px rgba(255, 0, 230, 0.3)',
        color: '#f8f8f8',
        border: '1px solid rgba(21, 255, 253, 0.2)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with neon-glowing elements */}
      <div className="relative flex flex-col items-center mb-6">
        {/* Glowing circle behind avatar */}
        <div
          className="absolute rounded-full blur-md z-0"
          style={{
            width: '110px',
            height: '110px',
            background:
              'radial-gradient(circle, rgba(255, 0, 230, 0.6) 0%, rgba(21, 255, 253, 0.3) 70%, transparent 100%)',
            animation: 'pulse 4s infinite alternate',
          }}
        ></div>

        {/* Avatar */}
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-24 h-24 rounded-full border-4 relative z-10 mb-3"
          style={{
            borderColor: 'rgba(21, 255, 253, 0.8)',
            boxShadow: '0 0 10px rgba(21, 255, 253, 0.8)',
          }}
        />

        {/* Name with cyberpunk styling */}
        <h2
          className="text-xl font-bold uppercase tracking-wider mb-1"
          style={{
            color: '#15fffd',
            textShadow: '0 0 5px rgba(21, 255, 253, 0.8)',
          }}
        >
          {user.name || user.login}
        </h2>

        <p
          className="flex items-center gap-1.5 font-mono"
          style={{ color: '#ff00e6' }}
        >
          <Icons.GitHub className="w-4 h-4" />@{user.login}
        </p>

        {/* Joined date */}
        <div
          className="mt-2 px-3 py-1 rounded-full text-xs font-mono"
          style={{
            background: 'rgba(21, 255, 253, 0.1)',
            border: '1px solid rgba(21, 255, 253, 0.3)',
          }}
        >
          <span style={{ color: '#15fffd' }}>NETRUNNER SINCE: </span>
          <span className="opacity-80">{formatDate(user.created_at)}</span>
        </div>
      </div>

      {/* Stats in a grid with neon borders */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className="flex flex-col items-center justify-center p-3 rounded-lg relative overflow-hidden"
          style={{
            background: 'rgba(255, 0, 230, 0.05)',
            border: '1px solid rgba(255, 0, 230, 0.3)',
            boxShadow: '0 0 8px rgba(255, 0, 230, 0.3) inset',
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff00e6] to-transparent opacity-70"></div>
          <div className="text-4xl font-bold" style={{ color: '#ff00e6' }}>
            {repoCount}
          </div>
          <div className="text-sm uppercase tracking-wider opacity-70">
            Repositories
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center p-3 rounded-lg relative overflow-hidden"
          style={{
            background: 'rgba(21, 255, 253, 0.05)',
            border: '1px solid rgba(21, 255, 253, 0.3)',
            boxShadow: '0 0 8px rgba(21, 255, 253, 0.3) inset',
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#15fffd] to-transparent opacity-70"></div>
          <div className="text-4xl font-bold" style={{ color: '#15fffd' }}>
            {totalStars}
          </div>
          <div className="text-sm uppercase tracking-wider opacity-70">
            Stars
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center p-3 rounded-lg relative overflow-hidden"
          style={{
            background: 'rgba(255, 213, 25, 0.05)',
            border: '1px solid rgba(255, 213, 25, 0.3)',
            boxShadow: '0 0 8px rgba(255, 213, 25, 0.3) inset',
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ffd519] to-transparent opacity-70"></div>
          <div className="text-4xl font-bold" style={{ color: '#ffd519' }}>
            {pullRequests}
          </div>
          <div className="text-sm uppercase tracking-wider opacity-70">
            Pull Requests
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center p-3 rounded-lg relative overflow-hidden"
          style={{
            background: 'rgba(132, 0, 255, 0.05)',
            border: '1px solid rgba(132, 0, 255, 0.3)',
            boxShadow: '0 0 8px rgba(132, 0, 255, 0.3) inset',
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8400ff] to-transparent opacity-70"></div>
          <div className="text-4xl font-bold" style={{ color: '#8400ff' }}>
            {user.followers}
          </div>
          <div className="text-sm uppercase tracking-wider opacity-70">
            Followers
          </div>
        </div>
      </div>

      {/* Languages section */}
      <div
        className="p-4 rounded-lg mb-6 relative overflow-hidden"
        style={{
          background: 'rgba(21, 255, 253, 0.05)',
          border: '1px solid rgba(21, 255, 253, 0.3)',
        }}
      >
        <h3
          className="text-base uppercase tracking-wider mb-3 font-mono flex items-center gap-2"
          style={{ color: '#15fffd' }}
        >
          <Icons.Code className="w-4 h-4" />
          Tech Matrix
        </h3>

        {/* Languages bar */}
        <div
          className="h-2 rounded-full overflow-hidden mb-4 relative"
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          {languageData.slice(0, 5).map((lang, index) => (
            <div
              key={lang.name}
              style={{
                backgroundColor: lang.color,
                width: `${lang.percentage}%`,
                position: 'absolute',
                height: '100%',
                left: `${languageData.slice(0, index).reduce((sum, l) => sum + l.percentage, 0)}%`,
                boxShadow: `0 0 10px ${lang.color}`,
              }}
            />
          ))}
        </div>

        {/* Languages list */}
        <div className="flex flex-wrap gap-2">
          {languageData.slice(0, 5).map(lang => (
            <div
              key={lang.name}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: `1px solid ${lang.color}`,
                boxShadow: `0 0 5px ${lang.color}`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span>{lang.name}</span>
              <span className="opacity-70">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="text-center text-xs py-2 font-mono"
        style={{ color: 'rgba(255, 255, 255, 0.5)' }}
      >
        <div
          className="mb-2 h-px w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent, #ff00e6, #15fffd, transparent)',
          }}
        ></div>
        GENERATED WITH DEVINSIGHT // V.2077
      </div>

      {/* Decorative corner elements */}
      <div
        className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 rounded-tl-sm"
        style={{ borderColor: '#ff00e6' }}
      ></div>
      <div
        className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 rounded-tr-sm"
        style={{ borderColor: '#15fffd' }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 rounded-bl-sm"
        style={{ borderColor: '#15fffd' }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 rounded-br-sm"
        style={{ borderColor: '#ff00e6' }}
      ></div>
    </div>
  );
}
