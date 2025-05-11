import { useState, useEffect } from 'react';
import { Badge } from '../DevCardGenerator';

interface GalaxySpaceThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function GalaxySpaceTheme({
  user,
  languageData,
}: GalaxySpaceThemeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [starOpacities, setStarOpacities] = useState<number[]>([]);

  // Create stars with random opacity animation
  useEffect(() => {
    // Generate random opacity values for stars
    const opacities = Array.from({ length: 50 }, () => Math.random());
    setStarOpacities(opacities);

    // Animate star twinkling
    const interval = setInterval(() => {
      setStarOpacities(prev =>
        prev.map(op => {
          const newOp = op + (Math.random() * 0.2 - 0.1);
          return Math.max(0.2, Math.min(1, newOp));
        })
      );
    }, 700);

    return () => clearInterval(interval);
  }, []);

  // Calculate follower/following ratio
  const followerRatio = user.following
    ? (user.followers / user.following).toFixed(1)
    : '∞';

  // Top languages for orbiting icons
  const topLanguages = languageData.slice(0, 5);

  return (
    <div
      className="w-full max-w-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="p-6 rounded-xl relative overflow-hidden transition-all duration-300"
        style={{
          background:
            'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
          boxShadow: isHovered
            ? '0 0 30px rgba(138, 43, 226, 0.6)'
            : '0 0 15px rgba(138, 43, 226, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Star background */}
        <div className="absolute inset-0 overflow-hidden">
          {starOpacities.map((opacity, i) => {
            const size = Math.random() * 2 + 1;
            const top = Math.random() * 100;
            const left = Math.random() * 100;

            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${top}%`,
                  left: `${left}%`,
                  backgroundColor:
                    i % 5 === 0 ? '#8A2BE2' : i % 3 === 0 ? '#4B0082' : 'white',
                  opacity: opacity,
                  transition: 'opacity 0.7s ease-in-out',
                  boxShadow:
                    size > 2
                      ? `0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`
                      : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Content container with glass effect */}
        <div
          className="relative z-10 backdrop-blur-sm rounded-lg p-5"
          style={{
            backgroundColor: 'rgba(25, 31, 52, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Profile section */}
          <div className="flex flex-col items-center mb-6">
            {/* Avatar with orbital ring */}
            <div className="relative mb-4">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '2px solid rgba(138, 43, 226, 0.5)',
                  transform: 'scale(1.1)',
                  animation: 'orbit 10s linear infinite',
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.2) rotate(45deg)',
                  animation: 'orbit 15s linear infinite reverse',
                }}
              />
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-24 h-24 rounded-full border-2 border-purple-300 z-10 relative"
                style={{
                  boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)',
                  animation: 'float 3s ease-in-out infinite',
                }}
              />

              {/* Orbiting language planets */}
              {topLanguages.map((lang, index) => {
                const angle = (index / topLanguages.length) * 360;
                const delay = index * 0.5;
                return (
                  <div
                    key={lang.name}
                    className="absolute rounded-full w-8 h-8 flex items-center justify-center"
                    style={{
                      backgroundColor: lang.color,
                      transform: `rotate(${angle}deg) translateX(80px)`,
                      animation: `orbit-planet 20s linear ${delay}s infinite`,
                      boxShadow: `0 0 10px ${lang.color}`,
                      zIndex: 5,
                    }}
                  >
                    <span className="text-xs font-bold text-white">
                      {lang.name.substring(0, 2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <h2 className="text-white text-xl font-bold mb-1">
              {user.name || user.login}
            </h2>
            <p className="text-purple-300 text-sm">@{user.login}</p>

            {user.bio && (
              <p className="text-gray-300 text-sm mt-3 text-center max-w-xs">
                {user.bio.length > 100
                  ? user.bio.substring(0, 100) + '...'
                  : user.bio}
              </p>
            )}
          </div>

          {/* Cosmic stats */}
          <div
            className="grid grid-cols-3 gap-4 mb-6"
            style={{
              perspective: '1000px',
            }}
          >
            <div
              className="bg-indigo-900/50 p-3 rounded-lg text-center backdrop-blur-sm transition-transform hover:transform hover:scale-105 hover:rotate-3"
              style={{
                boxShadow: '0 0 15px rgba(76, 29, 149, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                animation: 'float 4s ease-in-out infinite',
              }}
            >
              <div className="text-purple-300 text-xs mb-1">Repositories</div>
              <div className="text-white text-2xl font-bold">
                {user.public_repos}
              </div>
            </div>

            <div
              className="bg-indigo-900/50 p-3 rounded-lg text-center backdrop-blur-sm transition-transform hover:transform hover:scale-105 hover:rotate-3"
              style={{
                boxShadow: '0 0 15px rgba(76, 29, 149, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                animation: 'float 4s ease-in-out 0.5s infinite',
              }}
            >
              <div className="text-purple-300 text-xs mb-1">Followers</div>
              <div className="text-white text-2xl font-bold">
                {user.followers}
              </div>
            </div>

            <div
              className="bg-indigo-900/50 p-3 rounded-lg text-center backdrop-blur-sm transition-transform hover:transform hover:scale-105 hover:rotate-3"
              style={{
                boxShadow: '0 0 15px rgba(76, 29, 149, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                animation: 'float 4s ease-in-out 1s infinite',
              }}
            >
              <div className="text-purple-300 text-xs mb-1">Following</div>
              <div className="text-white text-2xl font-bold">
                {user.following}
              </div>
            </div>
          </div>

          {/* Galaxy disk - representing follower to following ratio */}
          <div
            className="mb-6 rounded-lg p-4 backdrop-blur-sm"
            style={{
              background:
                'linear-gradient(to right, rgba(76, 29, 149, 0.4), rgba(138, 43, 226, 0.4))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="text-center mb-3">
              <div className="text-purple-300 text-sm mb-1">Follower Ratio</div>
              <div className="text-white text-3xl font-bold">
                {followerRatio}x
              </div>
            </div>

            <div className="relative h-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-700 to-indigo-600"
                  style={{
                    width: `${Math.min(100, (user.followers / (user.following || 1)) * 10)}%`,
                    backgroundImage:
                      'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'shine 2s linear infinite',
                  }}
                />
              </div>
              <div className="z-10 text-xs text-white font-bold">
                {user.followers} / {user.following || 1}
              </div>
            </div>
          </div>

          {/* Languages section */}
          <div className="space-y-1">
            <div className="text-purple-300 text-sm mb-2">Cosmic Languages</div>

            <div className="flex rounded-lg overflow-hidden h-4 mb-4 bg-black/30">
              {topLanguages.map(lang => (
                <div
                  key={lang.name}
                  className="h-full relative group"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-center text-white font-bold whitespace-nowrap overflow-hidden"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      transform: 'translateY(-100%)',
                      padding: '2px 4px',
                    }}
                  >
                    {lang.name} {Math.round(lang.percentage)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="text-center text-xs text-gray-400 mt-4 pt-3"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            Generated with DevInsight • Cosmic Edition
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) scale(1.1);
          }
          to {
            transform: rotate(360deg) scale(1.1);
          }
        }

        @keyframes orbit-planet {
          from {
            transform: rotate(0deg) translateX(80px);
          }
          to {
            transform: rotate(360deg) translateX(80px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes shine {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
