import { useState, useEffect } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface VaporwaveDreamThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function VaporwaveDreamTheme({
  user,
  repositories,
}: VaporwaveDreamThemeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [sunPosition, setSunPosition] = useState(70);

  // Find most recent commits by updated_at
  const recentRepos = repositories
    ? [...repositories]
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        .slice(0, 3)
    : [];

  // Animate sun movement
  useEffect(() => {
    const interval = setInterval(() => {
      setSunPosition(prev => {
        if (prev <= 30) return 70; // Reset position
        return prev - 0.5; // Move sun
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Create aesthetic quote from bio
  const aestheticQuote = user.bio
    ? user.bio.length > 100
      ? `"${user.bio.slice(0, 100)}..."`
      : `"${user.bio}"`
    : '「 ａｅｓｔｈｅｔｉｃ　ｃｏｄｅ 」';

  // Vaporwave styling function for text
  const vaporwaveText = (text: string): string => {
    return text
      .split('')
      .map(char => {
        if (char === ' ') return '　';
        // Only apply full-width transform to standard ASCII characters
        if (char.charCodeAt(0) >= 33 && char.charCodeAt(0) <= 126) {
          return String.fromCharCode(char.charCodeAt(0) + 0xfee0);
        }
        return char;
      })
      .join('');
  };

  // Favorite repo (most stars)
  const favoriteRepo = repositories
    ? [...repositories].sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      )[0]
    : null;

  return (
    <div
      className="w-full max-w-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="rounded-lg overflow-hidden relative transition-all duration-500"
        style={{
          backgroundColor: '#1f012b',
          boxShadow: isHovered
            ? '0 5px 50px rgba(255, 105, 180, 0.8), 0 0 30px rgba(111, 195, 223, 0.6)'
            : '0 5px 25px rgba(255, 105, 180, 0.5)',
        }}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(111, 195, 223, 0.3) 1px, transparent 1px), 
                             linear-gradient(to right, rgba(111, 195, 223, 0.3) 1px, transparent 1px)`,
            backgroundSize: '25px 25px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom',
            height: '100%',
          }}
        />

        {/* Sun */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-48 h-48 rounded-full z-0 opacity-80"
          style={{
            background: 'radial-gradient(circle, #FF6EC7 0%, #7873F5 100%)',
            bottom: `${sunPosition}%`,
            transition: 'bottom 0.2s linear',
          }}
        />

        {/* Horizon line */}
        <div
          className="absolute inset-x-0 z-0 h-px"
          style={{
            background: 'linear-gradient(to right, #FF6EC7, #7873F5, #12CAE6)',
            bottom: '30%',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="flex flex-col items-center space-y-5">
            {/* Header */}
            <div
              className="w-full text-center p-3 rounded"
              style={{
                background: 'linear-gradient(to right, #FF6EC7, #7873F5)',
                fontFamily: "'VT323', monospace",
                textShadow: '3px 3px 0 #1f012b',
                border: '2px solid white',
              }}
            >
              <h1 className="text-white text-xl font-bold tracking-wider">
                {vaporwaveText('DEVELOPER PROFILE')}
              </h1>
            </div>

            {/* Avatar */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full opacity-70"
                style={{
                  background:
                    'linear-gradient(to bottom right, #FF6EC7, #12CAE6)',
                  transform: 'scale(1.2) rotate(-15deg)',
                  filter: 'blur(10px)',
                }}
              />
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-24 h-24 rounded-full border-4 border-white relative"
                style={{
                  boxShadow: '0 0 20px rgba(255, 105, 180, 0.7)',
                }}
              />
            </div>

            {/* User info */}
            <div className="text-center space-y-1">
              <h2
                className="text-2xl font-bold text-white"
                style={{
                  fontFamily: "'VT323', monospace",
                  letterSpacing: '2px',
                  textShadow: '3px 3px 0 #FF6EC7',
                }}
              >
                {user.name || user.login}
              </h2>
              <p
                className="text-[#12CAE6] flex items-center justify-center"
                style={{ fontFamily: "'VT323', monospace" }}
              >
                <Icons.GitHub className="w-4 h-4 mr-1 text-[#FF6EC7]" />@
                {user.login}
              </p>
            </div>

            {/* Stats in retro windows */}
            <div
              className="w-full p-3 rounded"
              style={{
                background: '#241d33',
                border: '2px solid #FF6EC7',
                boxShadow: '5px 5px 0 #12CAE6',
              }}
            >
              <div className="text-center mb-3">
                <div
                  className="py-1 text-sm text-white"
                  style={{
                    background: 'linear-gradient(to right, #7873F5, #12CAE6)',
                    fontFamily: "'VT323', monospace",
                  }}
                >
                  {vaporwaveText('SYSTEM STATS')}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 mb-3">
                <div className="bg-[#241d33] p-2 text-center">
                  <div
                    className="text-[#FF6EC7] text-2xl font-bold"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    {user.public_repos}
                  </div>
                  <div
                    className="text-[#12CAE6] text-xs"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    REPOS
                  </div>
                </div>
                <div className="bg-[#241d33] p-2 text-center">
                  <div
                    className="text-[#FF6EC7] text-2xl font-bold"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    {user.followers}
                  </div>
                  <div
                    className="text-[#12CAE6] text-xs"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    FOLLOWERS
                  </div>
                </div>
                <div className="bg-[#241d33] p-2 text-center">
                  <div
                    className="text-[#FF6EC7] text-2xl font-bold"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    {repositories?.reduce(
                      (sum, repo) => sum + repo.stargazers_count,
                      0
                    ) || 0}
                  </div>
                  <div
                    className="text-[#12CAE6] text-xs"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    STARS
                  </div>
                </div>
              </div>

              {/* Recent commits */}
              <div className="text-center mb-2">
                <div
                  className="py-1 text-sm text-white"
                  style={{
                    background: 'linear-gradient(to right, #7873F5, #12CAE6)',
                    fontFamily: "'VT323', monospace",
                  }}
                >
                  {vaporwaveText('RECENT UPDATES')}
                </div>
              </div>

              <div className="space-y-2">
                {recentRepos.map(repo => (
                  <div
                    key={repo.id}
                    className="text-white p-2 text-sm flex justify-between items-center"
                    style={{
                      background: 'rgba(120, 115, 245, 0.2)',
                      fontFamily: "'VT323', monospace",
                    }}
                  >
                    <span className="text-[#FF6EC7] truncate max-w-[160px]">
                      {repo.name}
                    </span>
                    <span className="text-[#12CAE6]">
                      {new Date(repo.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                ))}

                {recentRepos.length === 0 && (
                  <div
                    className="text-[#FF6EC7] p-2 text-center text-sm"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    NO DATA FOUND
                  </div>
                )}
              </div>
            </div>

            {/* Favorite repo */}
            {favoriteRepo && (
              <div
                className="w-full p-3 rounded"
                style={{
                  background: '#241d33',
                  border: '2px solid #12CAE6',
                  boxShadow: '5px 5px 0 #FF6EC7',
                }}
              >
                <div className="text-center mb-3">
                  <div
                    className="py-1 text-sm text-white"
                    style={{
                      background: 'linear-gradient(to right, #FF6EC7, #7873F5)',
                      fontFamily: "'VT323', monospace",
                    }}
                  >
                    {vaporwaveText('TOP REPOSITORY')}
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    {favoriteRepo.name}
                  </div>

                  <div className="flex justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 text-[#FF6EC7]">
                      <Icons.Star className="w-4 h-4" />
                      <span style={{ fontFamily: "'VT323', monospace" }}>
                        {favoriteRepo.stargazers_count} STARS
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-[#12CAE6]">
                      <Icons.Network className="w-4 h-4" />
                      <span style={{ fontFamily: "'VT323', monospace" }}>
                        {favoriteRepo.forks_count} FORKS
                      </span>
                    </div>
                  </div>

                  {favoriteRepo.description && (
                    <div
                      className="text-white text-sm px-3 py-2"
                      style={{
                        background: 'rgba(120, 115, 245, 0.2)',
                        fontFamily: "'VT323', monospace",
                      }}
                    >
                      {favoriteRepo.description}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Aesthetic quote */}
            <div
              className="w-full text-center py-3 px-4 italic text-white"
              style={{
                fontFamily: "'VT323', monospace",
                letterSpacing: '1px',
                textShadow: '2px 2px 0 #FF6EC7',
                background:
                  'linear-gradient(rgba(120, 115, 245, 0.3), rgba(255, 110, 199, 0.3))',
              }}
            >
              {aestheticQuote}
            </div>

            {/* Footer with retro PC style */}
            <div
              className="w-full text-center text-white text-xs py-2"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              {vaporwaveText('GENERATED WITH DEVINSIGHT // 1999')}
            </div>
          </div>
        </div>

        {/* Link to VT323 Google Font */}
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        />
      </div>
    </div>
  );
}
