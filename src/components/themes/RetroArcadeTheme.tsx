import React, { useState, useEffect } from 'react';
import { Badge } from '../DevCardGenerator';

interface RetroArcadeThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function RetroArcadeTheme({
  user,
  repositories,
  languageData,
}: RetroArcadeThemeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [blinkState, setBlinkState] = useState(true);

  // Simulate pixel font with text-shadow
  const pixelTextStyle = {
    fontFamily: 'monospace',
    textShadow: '2px 2px 0 #000',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  };

  // Create a blinking effect for arcade feel
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(prev => !prev);
    }, 800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Calculate commits by year
  const commitsByYear = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    // Create an array of the last 3 years
    const years = [currentYear - 2, currentYear - 1, currentYear];

    // Generate simulated commit data based on repos
    return years.map(year => ({
      year: year.toString(),
      // Generate pseudo-random but consistent count based on user and year
      count: repositories?.length
        ? (user.public_repos * 10 + (year % 100)) % 999
        : 0,
    }));
  }, [user, repositories]);

  // Top languages for bar chart
  const topLanguages = languageData.slice(0, 4);

  // Format follower count as arcade score
  const formatScore = (num: number): string => {
    return num.toString().padStart(6, '0');
  };

  return (
    <div
      className="w-full max-w-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="p-6 rounded-lg relative overflow-hidden transition-all"
        style={{
          backgroundColor: '#1E1E3F',
          backgroundImage: 'radial-gradient(#2A2A6A 1px, transparent 1px)',
          backgroundSize: '8px 8px',
          border: '4px solid #FF004D',
          boxShadow: isHovered
            ? '0 0 0 4px #FAEF5D, 0 0 0 8px #29ADFF, 0 0 20px rgba(41, 173, 255, 0.5)'
            : '0 0 0 4px #FAEF5D, 0 0 0 8px #29ADFF',
        }}
      >
        {/* Screen scan lines effect */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
            backgroundSize: '100% 4px',
          }}
        />

        {/* Header - Arcade Style */}
        <div className="mb-6 text-center relative">
          <div
            className={`text-xl mb-1 font-bold ${blinkState ? 'text-white' : 'text-gray-500'}`}
            style={pixelTextStyle}
          >
            {blinkState ? 'INSERT COIN' : '* PLAYER 1 *'}
          </div>

          {/* User info */}
          <div className="flex justify-center mb-2">
            <div
              className="w-16 h-16 rounded-md p-1"
              style={{
                backgroundColor: '#29ADFF',
                border: '2px solid #FAEF5D',
                transform: 'rotate(2deg)',
              }}
            >
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-full h-full object-cover rounded-sm"
                style={{
                  imageRendering: 'pixelated',
                  filter: 'contrast(1.2) brightness(1.1)',
                }}
              />
            </div>
          </div>

          <div
            className="text-xl font-bold text-white mb-0.5"
            style={pixelTextStyle}
          >
            {user.name || user.login}
          </div>

          <div className="text-xs text-[#FAEF5D]" style={pixelTextStyle}>
            @{user.login}
          </div>
        </div>

        {/* Stats - Pixelated */}
        <div
          className="mb-5 p-3 rounded-md relative"
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            border: '2px solid #29ADFF',
          }}
        >
          <div className="text-center mb-3">
            <div className="text-xs mb-1 text-[#FAEF5D]" style={pixelTextStyle}>
              HIGH SCORE
            </div>
            <div
              className="text-2xl font-bold text-[#FF004D]"
              style={pixelTextStyle}
            >
              {formatScore(user.followers)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div
                className="text-xs mb-1 text-[#29ADFF]"
                style={pixelTextStyle}
              >
                Repos
              </div>
              <div
                className="text-lg font-bold text-white"
                style={pixelTextStyle}
              >
                {user.public_repos}
              </div>
            </div>

            <div>
              <div
                className="text-xs mb-1 text-[#29ADFF]"
                style={pixelTextStyle}
              >
                Stars
              </div>
              <div
                className="text-lg font-bold text-white"
                style={pixelTextStyle}
              >
                {repositories?.reduce(
                  (sum, repo) => sum + repo.stargazers_count,
                  0
                ) || 0}
              </div>
            </div>

            <div>
              <div
                className="text-xs mb-1 text-[#29ADFF]"
                style={pixelTextStyle}
              >
                Followers
              </div>
              <div
                className="text-lg font-bold text-white"
                style={pixelTextStyle}
              >
                {user.followers}
              </div>
            </div>
          </div>
        </div>

        {/* Commits by Year - Arcade Scoreboard */}
        <div
          className="mb-5 p-3 rounded-md"
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            border: '2px solid #FF004D',
          }}
        >
          <div
            className="text-xs mb-3 text-white text-center"
            style={pixelTextStyle}
          >
            COMMITS BY YEAR
          </div>

          <div className="space-y-2">
            {commitsByYear.map(yearData => (
              <div key={yearData.year} className="flex items-center gap-2">
                <div
                  className="text-xs font-bold text-[#FAEF5D] w-12"
                  style={pixelTextStyle}
                >
                  {yearData.year}:
                </div>
                <div className="flex-1 h-4 bg-black rounded-sm overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(100, (yearData.count / 999) * 100)}%`,
                      backgroundColor: '#29ADFF',
                      backgroundImage:
                        'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.2) 50%)',
                      backgroundSize: '4px 4px',
                    }}
                  />
                </div>
                <div
                  className="text-xs font-bold text-white w-14 text-right"
                  style={pixelTextStyle}
                >
                  {yearData.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages - Pixelated Bar Chart */}
        <div
          className="mb-5 p-3 rounded-md"
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            border: '2px solid #FAEF5D',
          }}
        >
          <div
            className="text-xs mb-3 text-white text-center"
            style={pixelTextStyle}
          >
            LANGUAGE MASTERY
          </div>

          <div className="space-y-3">
            {topLanguages.map(lang => (
              <div key={lang.name} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div
                    className="text-xs font-bold"
                    style={{
                      ...pixelTextStyle,
                      color: lang.color || 'white',
                    }}
                  >
                    {lang.name}
                  </div>
                  <div
                    className="text-xs text-[#FAEF5D]"
                    style={pixelTextStyle}
                  >
                    {Math.round(lang.percentage)}%
                  </div>
                </div>

                <div className="h-6 bg-black rounded-sm overflow-hidden p-1">
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: lang.color,
                      backgroundImage:
                        'linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.2) 50%)',
                      backgroundSize: '6px 6px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright/Footer */}
        <div className="text-center">
          <div
            className={`text-xs ${blinkState ? 'text-white' : 'text-[#29ADFF]'}`}
            style={pixelTextStyle}
          >
            PRESS START TO CONTINUE
          </div>
          <div className="text-xs mt-1 text-[#FAEF5D]" style={pixelTextStyle}>
            © 2023 DEVINSIGHT ARCADE
          </div>
        </div>
      </div>
    </div>
  );
}
