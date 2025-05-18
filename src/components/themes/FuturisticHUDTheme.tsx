import { useState, useEffect } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface FuturisticHUDThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function FuturisticHUDTheme({
  user,
  repositories,
  languageData,
}: FuturisticHUDThemeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [scanAngle, setScanAngle] = useState(0);
  const [arcReactorPulse, setArcReactorPulse] = useState(0);
  const [systemText, setSystemText] = useState('Initializing...');
  const [systemTextIndex, setSystemTextIndex] = useState(0);

  // List of system texts to cycle through
  const systemTexts = [
    'System online',
    'Developer profile loaded',
    'Analyzing activity patterns',
    'Repository scan complete',
    'Language analysis successful',
    'Performance metrics compiled',
    'All systems operational',
  ];

  // Calculate coding activity based on repository data
  const calculateActivity = () => {
    if (!repositories || repositories.length === 0) return 35; // Default value

    // Calculate weighted activity based on recent updates
    const now = new Date().getTime();
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Count recent updates
    const recentUpdates = repositories.filter(
      repo => new Date(repo.updated_at).getTime() > oneMonthAgo
    ).length;

    // Calculate activity percentage (more recent updates = higher activity)
    const activityPercentage = Math.min(
      98,
      Math.max(
        25,
        (recentUpdates / Math.max(1, repositories.length)) * 100 + 30
      )
    );

    return Math.round(activityPercentage);
  };

  // Calculate repository "heat" (combined metric of stars, forks, and recency)
  const calculateRepoHeat = () => {
    if (!repositories || repositories.length === 0) return 40; // Default value

    // Combine stars and forks
    const totalEngagement = repositories.reduce(
      (sum, repo) => sum + repo.stargazers_count + repo.forks_count,
      0
    );

    // Factor in recency of updates
    const averageUpdatedAt =
      repositories.reduce(
        (sum, repo) => sum + new Date(repo.updated_at).getTime(),
        0
      ) / repositories.length;

    // Calculate days since average update
    const daysSinceUpdate =
      (new Date().getTime() - averageUpdatedAt) / (1000 * 60 * 60 * 24);
    const recencyFactor = Math.max(
      0.5,
      Math.min(1.5, 30 / Math.max(1, daysSinceUpdate))
    );

    // Calculate heat (normalized between 30-95)
    const baseHeat = Math.min(
      repositories.length * 3 + totalEngagement / 2,
      300
    );
    return Math.min(95, Math.max(30, (baseHeat * recencyFactor) / 5));
  };

  // Transform repositories into radar chart data
  const getRepositoriesForRadar = () => {
    if (!repositories || repositories.length === 0) return [];

    // Sort by stars and take top 8
    const topRepos = [...repositories]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 8);

    // Calculate positions on radar
    return topRepos.map((repo, i) => {
      // Calculate angle for positioning (evenly distributed)
      const angle = (i / topRepos.length) * 2 * Math.PI;
      // Distance from center based on stars and activity
      const distance =
        30 + Math.min(50, (repo.stargazers_count + repo.forks_count) / 2);

      // Position on radar
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      return { repo, x, y, angle };
    });
  };

  // Radar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanAngle(prev => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Arc reactor pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setArcReactorPulse(prev => (prev < 10 ? prev + 0.5 : 0));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Cycle through system texts
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTextIndex(prev => (prev + 1) % systemTexts.length);
      setSystemText(systemTexts[systemTextIndex]);
    }, 3000);
    return () => clearInterval(interval);
  }, [systemTextIndex, systemTexts]);

  // Get top language by percentage
  const getTopLanguage = () => {
    if (!languageData || languageData.length === 0)
      return { name: 'Unknown', color: '#58a6ff', percentage: 0 };
    return languageData[0];
  };

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Calculate stats
  const activity = calculateActivity();
  const repoHeat = calculateRepoHeat();
  const totalStars =
    repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0;
  const totalForks =
    repositories?.reduce((sum, repo) => sum + repo.forks_count, 0) || 0;
  const radarRepositories = getRepositoriesForRadar();
  const topLanguage = getTopLanguage();

  return (
    <div
      className="w-full max-w-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative rounded-lg overflow-hidden bg-gray-900"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(16, 42, 66, 0.6) 0%, rgba(8, 24, 40, 0.8) 70%, rgba(0, 12, 20, 0.9) 100%)',
          boxShadow: isHovered
            ? '0 0 30px rgba(0, 195, 255, 0.4), inset 0 0 20px rgba(0, 195, 255, 0.2)'
            : '0 0 15px rgba(0, 195, 255, 0.2)',
          border: '1px solid rgba(0, 195, 255, 0.3)',
          height: '480px',
        }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 195, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 195, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px',
          }}
        />

        {/* Top Header Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-10 z-10 flex items-center justify-between px-4"
          style={{
            background:
              'linear-gradient(90deg, rgba(0, 195, 255, 0.3) 0%, rgba(0, 195, 255, 0.1) 100%)',
            borderBottom: '1px solid rgba(0, 195, 255, 0.5)',
          }}
        >
          {/* Left header elements */}
          <div className="flex items-center">
            <span
              className="text-xs font-mono text-cyan-300 mr-4"
              style={{ textShadow: '0 0 5px rgba(0, 195, 255, 0.8)' }}
            >
              JARVIS v3.42
            </span>
            <div className="flex space-x-1">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      i === 1
                        ? 'rgba(0, 255, 0, 0.8)'
                        : 'rgba(0, 195, 255, 0.5)',
                    boxShadow:
                      i === 1
                        ? '0 0 5px rgba(0, 255, 0, 0.8)'
                        : '0 0 3px rgba(0, 195, 255, 0.5)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right header elements */}
          <div className="flex items-center">
            <span
              className="text-xs font-mono text-cyan-300 animate-pulse"
              style={{ textShadow: '0 0 5px rgba(0, 195, 255, 0.8)' }}
            >
              {systemText}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 pt-12 px-5 h-full flex flex-col">
          {/* User header with glowing elements */}
          <div className="flex justify-between items-start mb-5 mt-1">
            <div className="flex items-center">
              {/* Glowing avatar frame */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full opacity-80"
                  style={{
                    border: '2px solid rgba(0, 195, 255, 0.8)',
                    boxShadow: '0 0 10px rgba(0, 195, 255, 0.8)',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-14 h-14 rounded-full border-2 border-cyan-400 relative"
                />
                <div
                  className="absolute top-0 left-0 w-full h-full rounded-full"
                  style={{
                    background:
                      'linear-gradient(45deg, rgba(0, 195, 255, 0.4) 0%, transparent 70%)',
                  }}
                />
              </div>

              <div className="ml-3">
                <h1
                  className="text-white text-lg font-bold tracking-wide"
                  style={{ textShadow: '0 0 10px rgba(0, 195, 255, 0.8)' }}
                >
                  {user.name || user.login}
                </h1>
                <div className="flex items-center text-cyan-400 text-sm font-mono">
                  <Icons.GitHub className="w-3.5 h-3.5 mr-1" />@{user.login}
                </div>
              </div>
            </div>

            {/* Status indicators */}
            <div
              className="bg-gray-800 bg-opacity-60 px-3 py-1.5 rounded border"
              style={{ borderColor: 'rgba(0, 195, 255, 0.5)' }}
            >
              <div className="flex items-center text-xs text-cyan-300 font-mono space-x-2">
                <span className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full bg-green-400 mr-1.5"
                    style={{ boxShadow: '0 0 5px rgba(0, 255, 0, 0.8)' }}
                  />
                  ONLINE
                </span>
                <span>|</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Three-column layout */}
          <div className="flex h-full space-x-4 pb-4">
            {/* Left column - Activity Metrics */}
            <div className="w-1/4 flex flex-col space-y-4">
              {/* Energy meter (coding activity) */}
              <div
                className="bg-gray-800 bg-opacity-40 p-3 rounded border flex-1"
                style={{ borderColor: 'rgba(0, 195, 255, 0.5)' }}
              >
                <h3
                  className="text-cyan-300 text-xs font-mono mb-3 flex items-center"
                  style={{ textShadow: '0 0 5px rgba(0, 195, 255, 0.5)' }}
                >
                  <Icons.Activity className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  ACTIVITY LEVEL
                </h3>

                {/* Vertical energy bar */}
                <div className="flex justify-center">
                  <div className="relative h-40 w-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full rounded-full transition-all duration-300"
                      style={{
                        height: `${activity}%`,
                        background:
                          'linear-gradient(to top, rgba(0, 255, 0, 0.8), rgba(0, 195, 255, 0.8))',
                        boxShadow: '0 0 10px rgba(0, 195, 255, 0.8)',
                      }}
                    />

                    {/* Level markers */}
                    {[25, 50, 75].map(level => (
                      <div
                        key={level}
                        className="absolute w-full h-px bg-gray-500"
                        style={{ bottom: `${level}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center mt-3 font-mono text-cyan-300 text-sm">
                  {activity}%
                </div>
              </div>

              {/* Simple stats */}
              <div
                className="bg-gray-800 bg-opacity-40 p-3 rounded border"
                style={{ borderColor: 'rgba(0, 195, 255, 0.5)' }}
              >
                <h3
                  className="text-cyan-300 text-xs font-mono mb-2 flex items-center"
                  style={{ textShadow: '0 0 5px rgba(0, 195, 255, 0.5)' }}
                >
                  <Icons.GitBranch className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  DEPLOYMENT STATS
                </h3>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-mono">
                      Repositories:
                    </span>
                    <span className="text-cyan-300 font-mono">
                      {user.public_repos}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-mono">Stars:</span>
                    <span className="text-cyan-300 font-mono">
                      {formatNumber(totalStars)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-mono">Forks:</span>
                    <span className="text-cyan-300 font-mono">
                      {formatNumber(totalForks)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-mono">Followers:</span>
                    <span className="text-cyan-300 font-mono">
                      {user.followers}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center column - Radar Chart */}
            <div className="w-2/4">
              <div
                className="h-full bg-gray-800 bg-opacity-40 rounded border relative overflow-hidden"
                style={{ borderColor: 'rgba(0, 195, 255, 0.5)' }}
              >
                <div className="absolute inset-0">
                  {/* Radar circles */}
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="absolute rounded-full border border-cyan-500"
                      style={{
                        width: `${i * 33}%`,
                        height: `${i * 33}%`,
                        left: `${50 - (i * 33) / 2}%`,
                        top: `${50 - (i * 33) / 2}%`,
                        opacity: 0.2,
                      }}
                    />
                  ))}

                  {/* Radar scan line */}
                  <div
                    className="absolute top-1/2 left-1/2 h-1/2 w-1 bg-cyan-400 origin-top"
                    style={{
                      transform: `translateX(-50%) rotate(${scanAngle}deg)`,
                      opacity: 0.6,
                      boxShadow: '0 0 10px rgba(0, 195, 255, 0.8)',
                    }}
                  />

                  {/* Scan effect */}
                  <div
                    className="absolute top-1/2 left-1/2 h-1/2 w-1/2 origin-top-left"
                    style={{
                      transform: `rotate(${scanAngle}deg)`,
                      background:
                        'linear-gradient(transparent, rgba(0, 195, 255, 0.1))',
                    }}
                  />

                  {/* Repository dots */}
                  {radarRepositories.map((item, i) => (
                    <div
                      key={i}
                      className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400"
                      style={{
                        left: `calc(50% + ${item.x}%)`,
                        top: `calc(50% + ${item.y}%)`,
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 5px rgba(0, 195, 255, 0.8)',
                        opacity:
                          Math.abs(
                            (scanAngle - (item.angle * 180) / Math.PI) % 360
                          ) < 30
                            ? 1
                            : 0.6,
                      }}
                      title={item.repo.name}
                    />
                  ))}

                  {/* Center dot */}
                  <div
                    className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-cyan-400"
                    style={{
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 10px rgba(0, 195, 255, 0.8)',
                    }}
                  />
                </div>

                {/* Radar header */}
                <div className="absolute top-0 left-0 right-0 text-center py-2 bg-gray-900 bg-opacity-50">
                  <h3
                    className="text-cyan-300 text-xs font-mono flex items-center justify-center"
                    style={{ textShadow: '0 0 5px rgba(0, 195, 255, 0.5)' }}
                  >
                    <Icons.Gauge className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                    REPOSITORY RADAR
                  </h3>
                </div>

                {/* Repository name display (changes based on scan angle) */}
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <div className="text-cyan-300 text-xs font-mono">
                    {radarRepositories.length > 0
                      ? radarRepositories.find(
                          item =>
                            Math.abs(
                              (scanAngle - (item.angle * 180) / Math.PI) % 360
                            ) < 15
                        )?.repo.name || 'Scanning repositories...'
                      : 'No repository data'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Arc reactor and language data */}
            <div className="w-1/4 flex flex-col space-y-4">
              {/* Arc reactor (repo heat) */}
              <div
                className="bg-gray-800 bg-opacity-40 p-3 rounded border flex-1 flex flex-col items-center justify-center"
                style={{ borderColor: 'rgba(0, 195, 255, 0.5)' }}
              >
                <h3
                  className="text-cyan-300 text-xs font-mono mb-3 flex items-center absolute top-3"
                  style={{ textShadow: '0 0 5px rgba(0, 195, 255, 0.5)' }}
                >
                  <Icons.Fire className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  REPO HEAT INDEX
                </h3>

                {/* Arc reactor */}
                <div className="relative">
                  {/* Outer rings */}
                  {[44, 38, 32].map((size, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border-2"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `calc(50% - ${size / 2}px)`,
                        top: `calc(50% - ${size / 2}px)`,
                        borderColor: 'rgba(0, 195, 255, 0.8)',
                        transform: `rotate(${scanAngle + 30 * i}deg)`,
                      }}
                    />
                  ))}

                  {/* Center core */}
                  <div
                    className="w-20 h-20 rounded-full relative"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(0, 195, 255, 0.8) 0%, rgba(0, 116, 158, 0.6) 60%, rgba(0, 52, 82, 0.4) 100%)',
                      boxShadow: `0 0 ${10 + arcReactorPulse}px rgba(0, 195, 255, 0.8)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="text-white text-xl font-bold"
                        style={{
                          textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {Math.round(repoHeat)}%
                      </div>
                    </div>

                    {/* Triangular segments */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <div
                        key={i}
                        className="absolute w-1/2 h-1/2 bg-gradient-to-t from-cyan-400 to-transparent"
                        style={{
                          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                          transform: `rotate(${angle}deg) translateY(-8px)`,
                          transformOrigin: 'bottom center',
                          opacity: 0.4,
                          left: '25%',
                          top: '25%',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-3 font-mono text-cyan-300 text-xs">
                  {repoHeat < 40 ? 'LOW' : repoHeat < 70 ? 'MODERATE' : 'HIGH'}{' '}
                  ACTIVITY
                </div>
              </div>

              {/* Main language */}
              <div
                className="bg-gray-800 bg-opacity-40 p-3 rounded border"
                style={{ borderColor: 'rgba(0, 195, 255, 0.5)' }}
              >
                <h3
                  className="text-cyan-300 text-xs font-mono mb-3 flex items-center"
                  style={{ textShadow: '0 0 5px rgba(0, 195, 255, 0.5)' }}
                >
                  <Icons.Code className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  PRIMARY LANGUAGE
                </h3>

                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{
                      backgroundColor: topLanguage.color || '#58a6ff',
                      boxShadow: `0 0 10px ${topLanguage.color || '#58a6ff'}`,
                    }}
                  />
                  <div>
                    <div className="font-mono text-white text-sm">
                      {topLanguage.name}
                    </div>
                    <div className="font-mono text-cyan-300 text-xs">
                      {Math.round(topLanguage.percentage)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer status bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-between px-4"
            style={{
              background:
                'linear-gradient(90deg, rgba(0, 195, 255, 0.2) 0%, rgba(0, 195, 255, 0.1) 100%)',
              borderTop: '1px solid rgba(0, 195, 255, 0.3)',
            }}
          >
            <span className="text-xs font-mono text-cyan-300 opacity-80">
              DEV_INSIGHT_OS v2.0 // SECURE CONNECTION
            </span>
            <span className="text-xs font-mono text-cyan-300 opacity-80">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
          `,
        }}
      />
    </div>
  );
}
