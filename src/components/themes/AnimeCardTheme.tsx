import { useState } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface AnimeCardThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function AnimeCardTheme({
  user,
  repositories,
  languageData,
}: AnimeCardThemeProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate stats
  const totalStars =
    repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0;
  const totalForks =
    repositories?.reduce((sum, repo) => sum + repo.forks_count, 0) || 0;

  // Calculate "levels" based on data
  const calculateLevel = () => {
    const baseScore =
      (user.public_repos || 0) * 2 +
      (user.followers || 0) * 3 +
      totalStars * 1.5;
    return Math.max(1, Math.min(99, Math.floor(baseScore / 100)));
  };

  // Get primary language (used as "element type")
  const getPrimaryLanguage = () => {
    if (!languageData || languageData.length === 0) return 'Unknown';

    // Sort by percentage and take the highest
    const sortedLangs = [...languageData].sort(
      (a, b) => b.percentage - a.percentage
    );
    return sortedLangs[0].name;
  };

  // Map languages to elements for theme
  const languageToElement = (lang: string): string => {
    const langLower = lang.toLowerCase();
    if (langLower.includes('javascript') || langLower.includes('typescript')) {
      return 'Electric';
    } else if (langLower.includes('python')) {
      return 'Water';
    } else if (langLower.includes('rust') || langLower.includes('c++')) {
      return 'Fire';
    } else if (langLower.includes('java')) {
      return 'Earth';
    } else if (langLower.includes('ruby') || langLower.includes('php')) {
      return 'Dark';
    } else if (langLower.includes('go')) {
      return 'Wind';
    } else if (langLower.includes('html') || langLower.includes('css')) {
      return 'Light';
    }
    return 'Normal';
  };

  // Get element color based on element type
  const getElementColor = (element: string): string => {
    switch (element) {
      case 'Electric':
        return '#FFD700';
      case 'Water':
        return '#6495ED';
      case 'Fire':
        return '#FF4500';
      case 'Earth':
        return '#8B4513';
      case 'Dark':
        return '#483D8B';
      case 'Wind':
        return '#48D1CC';
      case 'Light':
        return '#FFFACD';
      default:
        return '#A9A9A9';
    }
  };

  // Calculate abilities based on repositories and user data
  const getAbilities = () => {
    if (!repositories || repositories.length === 0) {
      return [
        { name: 'Code Push', power: 50 },
        { name: 'Debugging', power: 40 },
        { name: 'Documentation', power: 30 },
      ];
    }

    const abilities = [];

    // Special ability based on most stars
    const mostStarredRepo = [...repositories].sort(
      (a, b) => b.stargazers_count - a.stargazers_count
    )[0];
    abilities.push({
      name: `${mostStarredRepo.name.slice(0, 15)}${mostStarredRepo.name.length > 15 ? '...' : ''}`,
      power: Math.min(95, 40 + mostStarredRepo.stargazers_count),
    });

    // Collaboration ability based on forks
    const collaborationPower = Math.min(
      90,
      30 + repositories.reduce((sum, repo) => sum + repo.forks_count, 0)
    );
    abilities.push({ name: 'Collaboration', power: collaborationPower });

    // Code quality based on languages
    abilities.push({
      name: 'Code Quality',
      power: 35 + Math.floor(Math.random() * 40),
    });

    return abilities;
  };

  const level = calculateLevel();
  const element = languageToElement(getPrimaryLanguage());
  const elementColor = getElementColor(element);
  const abilities = getAbilities();

  return (
    <div
      className="w-full max-w-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card container with anime styling */}
      <div
        className={`relative rounded-lg overflow-hidden transition-all duration-500`}
        style={{
          backgroundImage: "url('https://i.imgur.com/YJSRFUS.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: isHovered
            ? `0 0 30px ${elementColor}, 0 0 15px ${elementColor}`
            : '0 5px 15px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Slightly transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 p-4">
          {/* Header with element type and rarity */}
          <div className="flex justify-between items-center mb-2">
            <span
              className="px-3 py-1 rounded-full text-black font-bold text-sm"
              style={{ backgroundColor: elementColor }}
            >
              {element} Type
            </span>
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full text-black font-bold text-sm">
              ★★★★☆
            </span>
          </div>

          {/* Developer name and avatar */}
          <div className="flex flex-col items-center mt-1 mb-4">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full opacity-70 animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${elementColor} 0%, transparent 70%)`,
                  transform: 'scale(1.2)',
                }}
              ></div>
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-28 h-28 rounded-full border-4 relative"
                style={{ borderColor: elementColor }}
              />
              <div
                className="absolute -bottom-1 -right-1 rounded-full bg-gray-800 border-2 w-9 h-9 flex items-center justify-center text-white font-bold"
                style={{ borderColor: elementColor }}
              >
                {level}
              </div>
            </div>

            <h2 className="mt-3 text-xl font-bold text-white tracking-wide">
              {user.name || user.login}
            </h2>
            <p className="text-gray-300 text-sm flex items-center gap-1">
              <Icons.GitHub className="w-3.5 h-3.5" />
              {user.login}
            </p>
          </div>

          {/* Stats display in card form */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div
              className="bg-gray-900 bg-opacity-70 rounded p-2 text-center border"
              style={{ borderColor: elementColor }}
            >
              <div className="text-white text-xl font-bold">
                {user.public_repos}
              </div>
              <div className="text-gray-400 text-xs">REPOS</div>
            </div>
            <div
              className="bg-gray-900 bg-opacity-70 rounded p-2 text-center border"
              style={{ borderColor: elementColor }}
            >
              <div className="text-white text-xl font-bold">{totalStars}</div>
              <div className="text-gray-400 text-xs">STARS</div>
            </div>
            <div
              className="bg-gray-900 bg-opacity-70 rounded p-2 text-center border"
              style={{ borderColor: elementColor }}
            >
              <div className="text-white text-xl font-bold">{totalForks}</div>
              <div className="text-gray-400 text-xs">FORKS</div>
            </div>
          </div>

          {/* Abilities */}
          <div className="mb-3">
            <h3 className="text-white text-sm font-semibold mb-2 flex items-center">
              <Icons.Zap className="w-4 h-4 mr-1 text-yellow-400" />
              SPECIAL ABILITIES
            </h3>

            <div className="space-y-3">
              {abilities.map((ability, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-medium">
                      {ability.name}
                    </span>
                    <span className="font-bold" style={{ color: elementColor }}>
                      {ability.power}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${ability.power}%`,
                        backgroundColor: elementColor,
                        boxShadow: `0 0 8px ${elementColor}`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages as skill elements */}
          <div className="mb-3">
            <h3 className="text-white text-sm font-semibold mb-2 flex items-center">
              <Icons.Code className="w-4 h-4 mr-1 text-yellow-400" />
              ELEMENT SKILLS
            </h3>

            <div className="flex flex-wrap gap-2">
              {languageData.slice(0, 5).map((lang, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-md text-xs font-bold"
                  style={{
                    backgroundColor: lang.color || '#6c6c6c',
                    color: lang.color
                      ? lang.color.startsWith('#f')
                        ? 'black'
                        : 'white'
                      : 'white',
                  }}
                >
                  {lang.name}
                </span>
              ))}
            </div>
          </div>

          {/* Footer with bio */}
          {user.bio && (
            <div
              className="mt-3 p-2 rounded text-sm italic text-white bg-gray-900 bg-opacity-50 border-l-4"
              style={{ borderColor: elementColor }}
            >
              &quot;
              {user.bio.length > 100
                ? user.bio.substring(0, 100) + '...'
                : user.bio}
              &quot;
            </div>
          )}

          {/* Card edition */}
          <div className="mt-3 text-right">
            <span className="text-gray-400 text-xs">
              DevInsight Collection • {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
