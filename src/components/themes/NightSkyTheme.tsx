import { useState, useEffect } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface NightSkyThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

// Star type definition
interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  brightness: number;
  color: string;
  label?: string;
  isLanguageStar?: boolean;
  isPolarStar?: boolean;
  twinkleSpeed?: number;
}

// Connection between stars for constellation
interface Constellation {
  from: string;
  to: string;
  importance: number; // 1-10, affects opacity
}

export default function NightSkyTheme({
  user,
  repositories,
  languageData,
}: NightSkyThemeProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [twinkle, setTwinkle] = useState(0);

  // Generate a star field based on user's data
  useEffect(() => {
    const generatedStars: Star[] = [];
    const generatedConstellations: Constellation[] = [];

    // Background stars (random)
    for (let i = 0; i < 65; i++) {
      // Generate random positions for background stars
      generatedStars.push({
        id: `bg-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 1.5,
        brightness: 0.3 + Math.random() * 0.4,
        color:
          Math.random() > 0.8
            ? '#FFD700'
            : Math.random() > 0.6
              ? '#BFEFFF'
              : '#FFFFFF',
        twinkleSpeed: 0.5 + Math.random() * 2,
      });
    }

    // Create stars for top 5 languages
    if (languageData && languageData.length > 0) {
      // Language stars form a constellation in the upper part
      const langStars = languageData.slice(0, 5).map((lang, idx) => {
        const x = 15 + idx * 15 + Math.random() * 8;
        const y = 20 + Math.random() * 15;
        const size = 2 + lang.percentage / 10;

        return {
          id: `lang-${lang.name}`,
          x,
          y,
          size,
          brightness: 0.7 + (lang.percentage / 100) * 0.3,
          color: lang.color || '#FFFFFF',
          label: lang.name,
          isLanguageStar: true,
          twinkleSpeed: 1 + Math.random(),
        };
      });

      generatedStars.push(...langStars);

      // Create constellation connections between language stars
      for (let i = 0; i < langStars.length - 1; i++) {
        generatedConstellations.push({
          from: langStars[i].id,
          to: langStars[i + 1].id,
          importance: 8,
        });
      }
    }

    // Create stars for repositories (a different constellation)
    if (repositories && repositories.length > 0) {
      // Find most popular repositories
      const topRepos = [...repositories]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 7);

      // Determine the most starred repo (North Star / Polaris)
      const mostStarredRepo = topRepos[0];

      // Create the North Star (Polaris) - the most starred repo
      const polaris: Star = {
        id: `repo-${mostStarredRepo.id}`,
        x: 50,
        y: 50,
        size: 4,
        brightness: 1,
        color: '#FFFFFF',
        label: mostStarredRepo.name,
        isPolarStar: true,
        twinkleSpeed: 0.5,
      };
      generatedStars.push(polaris);

      // Create stars for other top repos in a formation around Polaris
      const repoStars = topRepos.slice(1).map((repo, idx) => {
        // Calculate position in a rough circle around Polaris
        const angle = (idx * Math.PI * 2) / (topRepos.length - 1);
        const distance = 15 + Math.random() * 5;
        const x = 50 + Math.cos(angle) * distance;
        const y = 50 + Math.sin(angle) * distance;

        return {
          id: `repo-${repo.id}`,
          x,
          y,
          size:
            1.5 +
            (repo.stargazers_count / mostStarredRepo.stargazers_count) * 1.5,
          brightness:
            0.6 +
            (repo.stargazers_count / mostStarredRepo.stargazers_count) * 0.4,
          color: '#FFD700',
          label: repo.name,
          twinkleSpeed: 0.5 + Math.random() * 1.5,
        };
      });
      generatedStars.push(...repoStars);

      // Connect repo stars to Polaris forming a constellation
      repoStars.forEach(star => {
        generatedConstellations.push({
          from: polaris.id,
          to: star.id,
          importance: 6,
        });
      });

      // Connect some repo stars to each other to form a recognizable constellation
      for (let i = 0; i < repoStars.length - 1; i++) {
        if (i % 2 === 0 || repoStars.length <= 3) {
          generatedConstellations.push({
            from: repoStars[i].id,
            to: repoStars[(i + 1) % repoStars.length].id,
            importance: 4,
          });
        }
      }
    }

    setStars(generatedStars);
    setConstellations(generatedConstellations);
  }, [user, repositories, languageData]);

  // Animate star twinkling
  useEffect(() => {
    const timer = setInterval(() => {
      setTwinkle(prev => (prev + 0.1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Get most starred repository
  const getMostStarredRepo = () => {
    if (!repositories || repositories.length === 0) return null;
    return [...repositories].sort(
      (a, b) => b.stargazers_count - a.stargazers_count
    )[0];
  };

  const mostStarredRepo = getMostStarredRepo();

  // Calculate total stars
  const totalStars =
    repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0;

  return (
    <div
      className="w-full max-w-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          backgroundColor: '#0A0F2A',
          backgroundImage:
            'radial-gradient(circle at 50% 70%, #1A1F45 0%, #060B25 70%)',
          boxShadow: isHovered
            ? '0 0 40px rgba(255, 255, 255, 0.1), inset 0 0 60px rgba(120, 120, 255, 0.1)'
            : '0 0 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Star field with constellations */}
        <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
          {/* Constellation lines */}
          <svg className="absolute inset-0 w-full h-full">
            {constellations.map((line, idx) => {
              const fromStar = stars.find(s => s.id === line.from);
              const toStar = stars.find(s => s.id === line.to);

              if (!fromStar || !toStar) return null;

              return (
                <line
                  key={`line-${idx}`}
                  x1={`${fromStar.x}%`}
                  y1={`${fromStar.y}%`}
                  x2={`${toStar.x}%`}
                  y2={`${toStar.y}%`}
                  stroke="white"
                  strokeWidth={isHovered ? 1 : 0.6}
                  strokeOpacity={line.importance / 10}
                  strokeDasharray={
                    fromStar.isPolarStar || toStar.isPolarStar ? 'none' : '3,2'
                  }
                />
              );
            })}
          </svg>

          {/* Stars */}
          {stars.map(star => {
            // Calculate twinkling effect
            const twinkleFactor =
              Math.sin(twinkle * star.twinkleSpeed! * 0.1) * 0.2 + 0.8;

            return (
              <div
                key={star.id}
                className="absolute rounded-full transition-all duration-300"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size * (star.isPolarStar && isHovered ? 1.2 : 1)}px`,
                  height: `${star.size * (star.isPolarStar && isHovered ? 1.2 : 1)}px`,
                  backgroundColor: star.color,
                  opacity: star.brightness * twinkleFactor,
                  boxShadow: `0 0 ${star.size * 2}px ${star.size / 2}px ${star.color}`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: star.isPolarStar ? 3 : star.isLanguageStar ? 2 : 1,
                }}
              ></div>
            );
          })}

          {/* Star labels (only shown on hover or for important stars) */}
          {isHovered &&
            stars
              .filter(
                star =>
                  star.label &&
                  (star.isPolarStar || star.isLanguageStar || isHovered)
              )
              .map(star => (
                <div
                  key={`label-${star.id}`}
                  className="absolute text-white text-opacity-90 text-xs pointer-events-none"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y + star.size / 2 + 1}%`,
                    transform: 'translate(-50%, 0)',
                    textShadow: '0 0 4px rgba(0, 0, 0, 0.8)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    padding: '1px 4px',
                    borderRadius: '3px',
                    opacity: star.isPolarStar ? 1 : isHovered ? 0.8 : 0,
                    zIndex: 10,
                  }}
                >
                  {star.label}
                </div>
              ))}
        </div>

        {/* Content */}
        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-white text-xl font-bold">
                {user.name || user.login}
              </h1>
              <div className="flex items-center text-blue-300 text-sm">
                <Icons.GitHub className="w-3.5 h-3.5 mr-1" />
                {user.login}
              </div>
            </div>

            <div className="bg-indigo-900 bg-opacity-50 px-3 py-1.5 rounded-full border border-indigo-700">
              <div className="flex items-center text-xs font-medium text-blue-200">
                <Icons.Star className="w-3.5 h-3.5 mr-1 text-yellow-300" />
                <span>{totalStars} Stars</span>
              </div>
            </div>
          </div>

          {/* Bio as cosmic message */}
          {user.bio && (
            <div className="mb-8 bg-indigo-900 bg-opacity-30 p-3 rounded-lg border border-indigo-800 text-blue-100 italic text-sm">
              &quot;{user.bio}&quot;
            </div>
          )}

          {/* North Star - Most starred repository */}
          {mostStarredRepo && (
            <div className="mb-8">
              <h2 className="text-blue-200 text-sm font-medium mb-2 flex items-center">
                <Icons.Star className="w-4 h-4 mr-1.5 text-yellow-300" />
                Polaris (North Star)
              </h2>

              <div className="bg-indigo-900 bg-opacity-40 rounded-lg border border-indigo-700 p-3">
                <div className="text-white font-semibold flex items-center">
                  {mostStarredRepo.name}
                  <span className="ml-2 bg-yellow-600 text-yellow-100 text-xs px-1.5 py-0.5 rounded">
                    {mostStarredRepo.stargazers_count} ★
                  </span>
                </div>

                {mostStarredRepo.description && (
                  <p className="text-blue-200 text-sm mt-1">
                    {mostStarredRepo.description}
                  </p>
                )}

                <div className="flex items-center mt-2 text-xs text-blue-300">
                  <span className="mr-3 flex items-center">
                    <Icons.Network className="w-3.5 h-3.5 mr-1" />
                    {mostStarredRepo.forks_count} forks
                  </span>

                  <span className="flex items-center">
                    <Icons.Calendar className="w-3.5 h-3.5 mr-1" />
                    Updated{' '}
                    {new Date(mostStarredRepo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Language constellations */}
          <div className="mb-6">
            <h2 className="text-blue-200 text-sm font-medium mb-2 flex items-center">
              <Icons.Code className="w-4 h-4 mr-1.5 text-blue-300" />
              Major Constellations
            </h2>

            <div className="flex flex-wrap gap-2">
              {languageData.slice(0, 5).map((lang, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-indigo-900 bg-opacity-40 px-2 py-1 rounded border border-indigo-700"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full mr-1.5"
                    style={{
                      backgroundColor: lang.color || '#FFFFFF',
                      boxShadow: `0 0 5px ${lang.color || '#FFFFFF'}`,
                    }}
                  ></div>
                  <span className="text-white text-xs">{lang.name}</span>
                  <span className="text-blue-300 text-xs ml-1.5">
                    {Math.round(lang.percentage)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer with cosmic coordinates */}
          <div className="mt-auto pt-4 border-t border-indigo-800 border-opacity-50 flex justify-between items-center text-xs text-blue-300">
            <div>
              <div>Celestial coordinates:</div>
              <div className="font-mono">
                RA {user.public_repos}h {user.followers}m
              </div>
            </div>

            <div className="text-right">
              <div>Observed with DevInsight</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
