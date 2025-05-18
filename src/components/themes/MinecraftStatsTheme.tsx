import { Badge } from '../DevCardGenerator';

interface MinecraftStatsThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function MinecraftStatsTheme({
  user,
  repositories,
  languageData,
}: MinecraftStatsThemeProps) {
  // Calculate statistics
  const totalStars =
    repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0;
  // const totalForks =
  //   repositories?.reduce((sum, repo) => sum + repo.forks_count, 0) || 0;

  // Calculate "blocks placed" (simulated commits based on repository data)
  const calculateBlocksPlaced = () => {
    if (!repositories || repositories.length === 0) return 0;

    // Estimate based on repo sizes and stars (since we don't have actual commit counts)
    return repositories.reduce((sum, repo) => {
      // Generate a reasonable commit estimate based on repo size and stars
      const estimatedCommits = Math.floor(
        (repo.size / 100) * (1 + repo.stargazers_count * 0.1)
      );
      return sum + (estimatedCommits || 5); // Minimum 5 commits per repo
    }, 0);
  };

  // Format large numbers with shorthand k/m
  const formatNumber = (num: number): string => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
    return (num / 1000000).toFixed(1) + 'M';
  };

  // Get most used language (most mined)
  const getMostUsedLanguage = () => {
    if (!languageData || languageData.length === 0) return null;
    return languageData[0];
  };

  // Calculate XP level based on stars and repos
  const calculateLevel = () => {
    return Math.min(100, Math.floor(Math.sqrt(totalStars) + user.public_repos));
  };

  // Generate achievement data
  const generateAchievements = () => {
    const achievements = [];

    // Repository count achievements
    if (user.public_repos >= 1) {
      achievements.push({
        name: 'First Block',
        description: 'Created your first repository',
        icon: 'chest',
      });
    }

    if (user.public_repos >= 10) {
      achievements.push({
        name: 'Builder',
        description: 'Created 10+ repositories',
        icon: 'pickaxe',
      });
    }

    if (user.public_repos >= 30) {
      achievements.push({
        name: 'Architect',
        description: 'Created 30+ repositories',
        icon: 'diamond',
      });
    }

    // Star achievements
    if (totalStars >= 10) {
      achievements.push({
        name: 'Rising Star',
        description: 'Earned 10+ stars on your work',
        icon: 'star',
      });
    }

    if (totalStars >= 100) {
      achievements.push({
        name: 'Star Collector',
        description: 'Earned 100+ stars on your work',
        icon: 'goldStar',
      });
    }

    if (totalStars >= 1000) {
      achievements.push({
        name: 'All-Star Developer',
        description: 'Earned 1000+ stars on your work',
        icon: 'enchanted',
      });
    }

    // Follower achievements
    if (user.followers >= 10) {
      achievements.push({
        name: 'Village Leader',
        description: 'Gained 10+ followers',
        icon: 'villager',
      });
    }

    // Default achievement if none met
    if (achievements.length === 0) {
      achievements.push({
        name: 'New Player',
        description: 'Created a GitHub account',
        icon: 'sapling',
      });
    }

    return achievements.slice(0, 4); // Return max 4 achievements
  };

  const blocksPlaced = calculateBlocksPlaced();
  const mostUsedLanguage = getMostUsedLanguage();
  const level = calculateLevel();
  const achievements = generateAchievements();

  // Calculate XP bar fill percentage
  const xpProgress = (level % 1) * 100; // Extract fractional part

  // Helper function to get icon for achievements
  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'chest':
        return '🧰';
      case 'pickaxe':
        return '⛏️';
      case 'diamond':
        return '💎';
      case 'star':
        return '⭐';
      case 'goldStar':
        return '🌟';
      case 'enchanted':
        return '✨';
      case 'villager':
        return '👨‍💼';
      case 'sapling':
        return '🌱';
      default:
        return '📦';
    }
  };

  return (
    <div className="w-full max-w-md">
      <div
        className="relative rounded-none"
        style={{
          imageRendering: 'pixelated',
          backgroundImage:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QgaCgwFL4MQ+QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAl0lEQVQoz22SwQ6AIAxDN+Lv+f8/YzRGEy8eAEEQWnpbMknZw8I2qLnKVU2vg45pFZkwPL3GMO0PGWEqmCmwLdCZUF9zpAGTQU5XD9XzN3F+OoFEg3hKT0DlKrQcFjYxyS7qPTFB7Y8ERvWBcHL1KbDKzGXr21pF1/d7neglsZ1KTy0RK82/JVZTje/QJ3fPUh/I72vKB3+tL7VvMB2wE9nmAAAAAElFTkSuQmCC")',
          backgroundRepeat: 'repeat',
          border: '4px solid #291D11',
          outline: '4px solid #2E1F14',
          boxShadow: '0 0 0 8px #111',
          padding: '8px',
        }}
      >
        {/* Title bar (Minecraft inventory style) */}
        <div
          className="border-b-4 pb-2 mb-4"
          style={{
            borderBottomColor: '#291D11',
            fontFamily: '"Minecraft", monospace',
          }}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold text-shadow-minecraft">
              {user.name || user.login}
            </h1>
            <button
              className="w-7 h-7 bg-red-700 border-t-2 border-l-2 border-red-500 border-r-2 border-b-2 flex items-center justify-center"
              style={{ boxShadow: '2px 2px 0 #111' }}
            >
              <span className="text-xl font-bold text-white">X</span>
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col space-y-4">
          {/* Player stats header */}
          <div className="flex space-x-3">
            {/* Player avatar (pixelated) */}
            <div
              className="w-20 h-20 relative"
              style={{
                imageRendering: 'pixelated',
                borderWidth: '4px',
                borderStyle: 'solid',
                borderTopColor: '#666666',
                borderLeftColor: '#666666',
                borderRightColor: '#292929',
                borderBottomColor: '#292929',
                padding: '2px',
              }}
            >
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-full h-full"
                style={{ imageRendering: 'pixelated', filter: 'contrast(1.1)' }}
              />
            </div>

            {/* Player name and info */}
            <div className="flex flex-col justify-center">
              <div
                className="text-white text-lg font-bold tracking-wide text-shadow-minecraft"
                style={{ fontFamily: '"Minecraft", monospace' }}
              >
                {user.login}
              </div>

              {/* XP bar */}
              <div
                className="h-2 w-32 mt-1 mb-1"
                style={{
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderTopColor: '#292929',
                  borderLeftColor: '#292929',
                  borderRightColor: '#666666',
                  borderBottomColor: '#666666',
                  backgroundColor: '#333333',
                }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${xpProgress}%`,
                    backgroundColor: '#55DD55',
                    boxShadow: 'inset 0 0 6px rgba(120, 255, 120, 0.8)',
                  }}
                />
              </div>

              {/* Level */}
              <div
                className="text-green-300 font-bold text-shadow-minecraft"
                style={{ fontFamily: '"Minecraft", monospace' }}
              >
                Level: {level}
              </div>
            </div>
          </div>

          {/* Main stats (blocks placed, XP etc) */}
          <div
            className="grid grid-cols-2 gap-3"
            style={{
              borderWidth: '4px',
              borderStyle: 'solid',
              borderTopColor: '#292929',
              borderLeftColor: '#292929',
              borderRightColor: '#666666',
              borderBottomColor: '#666666',
              background: 'rgba(20, 20, 20, 0.7)',
              padding: '8px',
            }}
          >
            {/* Stats blocks with Minecraft styling */}
            <div
              className="flex flex-col items-center space-y-1 p-2"
              style={{
                borderWidth: '4px',
                borderStyle: 'solid',
                borderTopColor: '#666666',
                borderLeftColor: '#666666',
                borderRightColor: '#292929',
                borderBottomColor: '#292929',
                backgroundColor: '#38362E',
                padding: '6px',
              }}
            >
              <div
                className="text-white text-shadow-minecraft text-sm"
                style={{ fontFamily: '"Minecraft", monospace' }}
              >
                Blocks Placed
              </div>
              <div
                className="text-xl font-bold text-yellow-300 text-shadow-minecraft"
                style={{ fontFamily: '"Minecraft", monospace' }}
              >
                {formatNumber(blocksPlaced)}
              </div>
              <div
                className="pixelated"
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundImage:
                    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjklEQVR42mNgGAWDCjAyMv5nYGAQYIAAPxDPh9LzoTQyYID4gRgLZzCggnlQ9TokcQao/ggQXzBQDMCw+QKSPF7AgG4BVMECJLVYAQPMEqj4BSQxhQEGKaEYJIcXMOC0BCrmgG5QBNQiBqj6/VAaJBaBJM6AFpDYgAmKAYXocQCyNAKqFyDQEEE+nq7p5wIAS/gitgkaJK0AAAAASUVORK5CYII=")',
                  backgroundSize: 'contain',
                  imageRendering: 'pixelated',
                }}
              />
            </div>

            <div
              className="flex flex-col items-center space-y-1 p-2"
              style={{
                borderWidth: '4px',
                borderStyle: 'solid',
                borderTopColor: '#666666',
                borderLeftColor: '#666666',
                borderRightColor: '#292929',
                borderBottomColor: '#292929',
                backgroundColor: '#38362E',
                padding: '6px',
              }}
            >
              <div
                className="text-white text-shadow-minecraft text-sm"
                style={{ fontFamily: '"Minecraft", monospace' }}
              >
                Experience
              </div>
              <div
                className="text-xl font-bold text-green-300 text-shadow-minecraft"
                style={{ fontFamily: '"Minecraft", monospace' }}
              >
                {formatNumber(totalStars)}
              </div>
              <div
                className="pixelated"
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundImage:
                    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5UlEQVR42mNgGHLAw8JCIMDFZQGEni4ufCp8fPwMaACkyCfA0fHAp8Ue/782O/33cbQFY5C4j739f99ABwG4Ab6OjgJAzW+ChFT//1pv+f/XRvv/oFBTMM/LzuY/0JD3vg72AgwgG3yt7QTcgGqugMR/TTD//2eZ7f9vM6z//5pr+h8oB1IHUsML1APi+9nbCDCANPk7Ogr4WFhJgBWB5H9NM/n/a5LJ/6/dWv//dGr+/2OK8f/fE439/4INAgYiuoGW1mADvK1s+NX5+IyB8u99rWwE0CxzB2oCYhGoe4CG8QMNFGCgNwAAkIGaESN88bIAAAAASUVORK5CYII=")',
                  backgroundSize: 'contain',
                  imageRendering: 'pixelated',
                }}
              />
            </div>

            <div
              className="flex flex-col items-center space-y-1 p-2"
              style={{
                borderWidth: '4px',
                borderStyle: 'solid',
                borderTopColor: '#666666',
                borderLeftColor: '#666666',
                borderRightColor: '#292929',
                borderBottomColor: '#292929',
                backgroundColor: '#38362E',
                padding: '6px',
              }}
            >
              <div
                className="text-white text-shadow-minecraft text-sm"
                style={{ fontFamily: '"Minecraft", monospace' }}
              >
                Items
              </div>
              <div
                className="text-xl font-bold text-blue-300 text-shadow-minecraft"
                style={{ fontFamily: '"Minecraft", monospace' }}
              >
                {user.public_repos}
              </div>
              <div
                className="pixelated"
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundImage:
                    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAXklEQVR42mNgGAXDAggwMAgwQGgQWwiE4fyBBAwwFw5qAxjQAF5AiS0QhXMYkADcJSheYaAUUMWCQW0Aihdg+DKMLsQXDeJIToMotICRliACNxzqQoZ9IDLQDAET0AIAFflQpLYWDboAAAAASUVORK5CYII=")',
                  backgroundSize: 'contain',
                  imageRendering: 'pixelated',
                }}
              />
            </div>

            <div
              className="flex flex-col items-center space-y-1 p-2"
              style={{
                borderWidth: '4px',
                borderStyle: 'solid',
                borderTopColor: '#666666',
                borderLeftColor: '#666666',
                borderRightColor: '#292929',
                borderBottomColor: '#292929',
                backgroundColor: '#38362E',
                padding: '6px',
              }}
            >
              <div
                className="text-white text-shadow-minecraft text-sm"
                style={{ fontFamily: '"Minecraft", monospace' }}
              >
                Villagers
              </div>
              <div
                className="text-xl font-bold text-red-300 text-shadow-minecraft"
                style={{ fontFamily: '"Minecraft", monospace' }}
              >
                {user.followers}
              </div>
              <div
                className="pixelated"
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundImage:
                    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAqklEQVR42mNgGHLAyMzsvoOFxX8QbW9uzg9VwoCuMcLB4b+Pg8N/J0tL/tCAgP9ejo7/3ayt+UEGIBsS7e7+39fR8b+HjQ0/Q0RAwP8oZ+f/rnZ2/2EueDs6CkTDDIgN+O/t5CQAMgBmM8iwKCen/672DsJgA9zs7QWinZ3+R8E0A/kgzTC/xvj5/Y90ckI1IMLJCcMrYANgLoS5Epc41AU+9nb3B1XiAQDavma7ylaMFgAAAABJRU5ErkJggg==")',
                  backgroundSize: 'contain',
                  imageRendering: 'pixelated',
                }}
              />
            </div>
          </div>

          {/* Most mined block (top language) */}
          {mostUsedLanguage && (
            <div
              className="p-3"
              style={{
                borderWidth: '4px',
                borderStyle: 'solid',
                borderTopColor: '#292929',
                borderLeftColor: '#292929',
                borderRightColor: '#666666',
                borderBottomColor: '#666666',
                background: 'rgba(20, 20, 20, 0.7)',
              }}
            >
              <div
                className="text-white font-bold mb-2 text-shadow-minecraft"
                style={{ fontFamily: '"Minecraft", monospace' }}
              >
                Most Mined Block
              </div>

              <div className="flex items-center space-x-3">
                {/* Language color as a Minecraft block */}
                <div
                  className="w-10 h-10"
                  style={{
                    borderWidth: '4px',
                    borderStyle: 'solid',
                    borderTopColor: '#CCCCCC',
                    borderLeftColor: '#CCCCCC',
                    borderRightColor: '#292929',
                    borderBottomColor: '#292929',
                    backgroundColor: mostUsedLanguage.color || '#58a6ff',
                    imageRendering: 'pixelated',
                  }}
                />

                <div>
                  <div
                    className="text-white text-shadow-minecraft"
                    style={{ fontFamily: '"Minecraft", monospace' }}
                  >
                    {mostUsedLanguage.name}
                  </div>
                  <div
                    className="text-gray-300 text-shadow-minecraft"
                    style={{ fontFamily: '"Minecraft", monospace' }}
                  >
                    {Math.round(mostUsedLanguage.percentage)}% of inventory
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements */}
          <div
            className="p-3"
            style={{
              borderWidth: '4px',
              borderStyle: 'solid',
              borderTopColor: '#292929',
              borderLeftColor: '#292929',
              borderRightColor: '#666666',
              borderBottomColor: '#666666',
              background: 'rgba(20, 20, 20, 0.7)',
            }}
          >
            <div
              className="text-white font-bold mb-2 text-shadow-minecraft"
              style={{ fontFamily: '"Minecraft", monospace' }}
            >
              Achievements
            </div>

            <div className="grid grid-cols-2 gap-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2"
                  style={{
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    borderTopColor: '#666666',
                    borderLeftColor: '#666666',
                    borderRightColor: '#292929',
                    borderBottomColor: '#292929',
                    backgroundColor: '#3C3C3C',
                  }}
                >
                  <div className="text-2xl">
                    {getAchievementIcon(achievement.icon)}
                  </div>
                  <div>
                    <div
                      className="text-yellow-300 text-sm text-shadow-minecraft"
                      style={{ fontFamily: '"Minecraft", monospace' }}
                    >
                      {achievement.name}
                    </div>
                    <div
                      className="text-gray-300 text-xs text-shadow-minecraft"
                      style={{ fontFamily: '"Minecraft", monospace' }}
                    >
                      {achievement.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="text-center text-gray-400 text-xs font-bold text-shadow-minecraft mt-2"
            style={{ fontFamily: '"Minecraft", monospace' }}
          >
            Generated with DevInsight v1.18.2
          </div>
        </div>
      </div>

      {/* Custom Minecraft-style text drop shadow */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Minecraft';
              src: url('https://cdn.jsdelivr.net/npm/minecraft-font@1.0.0/font/minecraft-font.woff') format('woff');
              font-weight: normal;
              font-style: normal;
            }
            
            .text-shadow-minecraft {
              text-shadow: 2px 2px #000000;
            }
            
            .pixelated {
              image-rendering: pixelated;
            }
          `,
        }}
      />
    </div>
  );
}
