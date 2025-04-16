import { useRef, useState, useEffect } from 'react';
import DevCard from './DevCard';

interface DevCardGeneratorProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

type ThemeVariant = 'default' | 'minimal' | 'gradient' | 'github';

// Color definitions for each theme
const themeColors = {
  default: {
    bg: '#f6f8fa',
    cardBg: '#ffffff',
    text: '#24292f',
    secondaryText: '#57606a',
    accentColor: '#58a6ff',
    dark: {
      bg: '#0d1117',
      cardBg: '#161b22',
      text: '#f0f6fc',
      secondaryText: '#c9d1d9',
    },
  },
  minimal: {
    bg: '#f6f8fa',
    cardBg: '#ffffff',
    text: '#24292f',
    secondaryText: '#57606a',
    accentColor: '#58a6ff',
    dark: {
      bg: '#0d1117',
      cardBg: '#161b22',
      text: '#f0f6fc',
      secondaryText: '#c9d1d9',
    },
  },
  gradient: {
    bg: 'linear-gradient(135deg, #1a6dff 0%, #c822ff 100%)',
    cardBg: 'linear-gradient(135deg, #1a6dff 0%, #c822ff 100%)',
    text: '#ffffff',
    secondaryText: 'rgba(255, 255, 255, 0.8)',
    accentColor: '#ffffff',
  },
  github: {
    bg: '#ffffff',
    cardBg: '#ffffff',
    text: '#24292e',
    secondaryText: '#586069',
    accentColor: '#0366d6',
    dark: {
      bg: '#0d1117',
      cardBg: '#0d1117',
      text: '#f0f6fc',
      secondaryText: '#c9d1d9',
    },
  },
};

export default function DevCardGenerator({
  user,
  repositories,
  languageData,
  badges,
}: DevCardGeneratorProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeVariant>('default');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Detect dark mode
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setDarkMode(isDarkMode);

    // Listen for theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          setDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Generate the image directly using Canvas API
  const generateImage = async (format: 'png' | 'svg') => {
    if (!canvasRef.current || !user || !repositories) return;

    setIsExporting(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas dimensions
      const width = 600;
      const height = 320;
      canvas.width = width;
      canvas.height = height;

      // Get theme colors
      const theme = themeColors[selectedTheme];
      const colors = darkMode && 'dark' in theme ? theme.dark : theme;

      // Draw background
      ctx.fillStyle = colors.cardBg;
      if (selectedTheme === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a6dff');
        gradient.addColorStop(1, '#c822ff');
        ctx.fillStyle = gradient;
      }
      ctx.fillRect(0, 0, width, height);

      // Draw card container
      if (selectedTheme !== 'gradient') {
        ctx.fillStyle = colors.cardBg;
        ctx.fillRect(20, 20, width - 40, height - 40);
      }

      // Load user avatar
      const avatar = new Image();
      avatar.crossOrigin = 'anonymous';

      avatar.onload = async () => {
        // Draw rounded avatar
        const avatarSize = 80;
        const avatarX = 40;
        const avatarY = 40;

        ctx.save();
        ctx.beginPath();
        ctx.arc(
          avatarX + avatarSize / 2,
          avatarY + avatarSize / 2,
          avatarSize / 2,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();

        // Draw border around avatar for certain themes
        if (selectedTheme === 'default' || selectedTheme === 'github') {
          ctx.strokeStyle = colors.accentColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(
            avatarX + avatarSize / 2,
            avatarY + avatarSize / 2,
            avatarSize / 2,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }

        // Draw user name
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(user.name || user.login, 140, 60);

        // Draw username
        ctx.fillStyle = colors.secondaryText;
        ctx.font = '16px Arial, sans-serif';
        ctx.fillText(`@${user.login}`, 140, 85);

        // Draw stats
        const repoCount = repositories.length;
        const starCount = repositories.reduce(
          (sum, repo) => sum + repo.stargazers_count,
          0
        );
        const forkCount = repositories.reduce(
          (sum, repo) => sum + repo.forks_count,
          0
        );

        // Stats background
        if (selectedTheme !== 'gradient') {
          const statsY = 120;
          const statBoxWidth = (width - 80) / 3;

          // Draw stat boxes
          ctx.fillStyle =
            selectedTheme === 'minimal'
              ? colors.bg
              : selectedTheme === 'github'
                ? colors.bg
                : darkMode
                  ? '#21262d'
                  : '#f6f8fa';

          ctx.fillRect(40, statsY, statBoxWidth - 10, 70);
          ctx.fillRect(40 + statBoxWidth, statsY, statBoxWidth - 10, 70);
          ctx.fillRect(40 + statBoxWidth * 2, statsY, statBoxWidth - 10, 70);
        }

        // Draw stats content
        const statsItems = [
          { label: 'Repositories', value: repoCount },
          { label: 'Stars', value: starCount },
          { label: 'Forks', value: forkCount },
        ];

        statsItems.forEach((stat, index) => {
          const statX = 40 + ((width - 80) / 3) * index + (width - 80) / 3 / 2;

          ctx.fillStyle = colors.text;
          ctx.font = 'bold 24px Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(stat.value.toString(), statX, 155);

          ctx.fillStyle = colors.secondaryText;
          ctx.font = '14px Arial, sans-serif';
          ctx.fillText(stat.label, statX, 175);
        });

        // Draw languages
        const topLanguages = languageData.slice(0, 3);

        if (topLanguages.length > 0) {
          ctx.fillStyle = colors.text;
          ctx.font = 'bold 16px Arial, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('Top Languages', 40, 220);

          // Draw language bar
          const barY = 235;
          const barHeight = 8;
          let currentX = 40;

          topLanguages.forEach(lang => {
            const width = (lang.percentage / 100) * (canvas.width - 80);
            ctx.fillStyle = lang.color;
            ctx.fillRect(currentX, barY, width, barHeight);
            currentX += width;
          });

          // Draw language labels
          const labelY = 260;
          topLanguages.forEach((lang, i) => {
            const labelX = 40 + i * 100;

            // Draw color dot
            ctx.fillStyle = lang.color;
            ctx.beginPath();
            ctx.arc(labelX + 5, labelY, 5, 0, Math.PI * 2);
            ctx.fill();

            // Draw language name and percentage
            ctx.fillStyle = colors.secondaryText;
            ctx.font = '14px Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(
              `${lang.name} ${lang.percentage}%`,
              labelX + 15,
              labelY + 5
            );
          });
        }

        // Draw footer
        ctx.fillStyle = colors.secondaryText;
        ctx.font = '12px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Generated with DevInsight', width / 2, height - 20);

        // Create download link
        const link = document.createElement('a');

        if (format === 'png') {
          link.download = `${user.login}-github-card.png`;
          link.href = canvas.toDataURL('image/png');
        } else {
          // Convert canvas to SVG
          const svgData = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <image href="${canvas.toDataURL('image/png')}" width="${width}" height="${height}"/>
          </svg>
          `;
          const blob = new Blob([svgData], { type: 'image/svg+xml' });
          link.download = `${user.login}-github-card.svg`;
          link.href = URL.createObjectURL(blob);
        }

        link.click();
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
        setIsExporting(false);
      };

      avatar.onerror = () => {
        console.error('Error loading avatar');
        setIsExporting(false);
      };

      avatar.src = user.avatar_url;
    } catch (error) {
      console.error('Error generating image:', error);
      setIsExporting(false);
    }
  };

  // Generate a markdown snippet for embedding
  const generateMarkdownSnippet = () => {
    const baseUrl = window.location.origin;
    // In a real app, you would generate an actual image URL here
    // For demo purposes, we'll just use a placeholder
    const imageUrl = `${baseUrl}/api/devcard/${user.login}?theme=${selectedTheme}`;

    const markdown = `[![${user.login}'s GitHub Stats](${imageUrl})](https://github.com/${user.login})`;

    navigator.clipboard.writeText(markdown);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 3000);
  };

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1 mb-4">
        GitHub README Dev Card
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Card Preview */}
        <div className="lg:w-1/2 flex flex-col items-center">
          <div
            className="w-full max-w-md mx-auto mb-4 rounded-lg overflow-hidden"
            ref={cardRef}
          >
            <DevCard
              user={user}
              repositories={repositories}
              languageData={languageData}
              badges={badges?.filter(b => b.earned).slice(0, 3)}
              theme={selectedTheme}
            />
          </div>
          <div className="text-sm text-l-text-3 dark:text-d-text-3 italic text-center">
            Preview of your GitHub profile card
          </div>
        </div>

        {/* Controls */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-l-text-1 dark:text-d-text-1">
              Theme Style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(
                ['default', 'minimal', 'gradient', 'github'] as ThemeVariant[]
              ).map(theme => (
                <button
                  key={theme}
                  className={`p-3 border rounded-md text-sm ${
                    selectedTheme === theme
                      ? 'border-accent-1 bg-accent-1/10 text-accent-1'
                      : 'border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2'
                  }`}
                  onClick={() => setSelectedTheme(theme)}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-semibold text-l-text-1 dark:text-d-text-1">
              Export Options
            </h3>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => generateImage('png')}
                disabled={isExporting}
                className="px-4 py-2 bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-md text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                Download as PNG
              </button>

              <button
                onClick={() => generateImage('svg')}
                disabled={isExporting}
                className="px-4 py-2 bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-md text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.447 3.027a.75.75 0 0 1 .527.92l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.526ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                Download as SVG
              </button>

              <button
                onClick={generateMarkdownSnippet}
                className="px-4 py-2 bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-md text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H16A1.5 1.5 0 0 1 17.5 6v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V6c0-.001 0-.001 0-.002a1.5 1.5 0 0 1 1.5-1.498H6A1.5 1.5 0 0 1 7.5 3H9a1.5 1.5 0 0 1 1.5 1.5h1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                Copy Markdown
              </button>
            </div>

            {/* Status messages */}
            {isExporting && (
              <div className="text-l-text-2 dark:text-d-text-2 text-sm">
                Generating image...
              </div>
            )}

            {exportSuccess && (
              <div className="text-accent-success text-sm flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
                Image downloaded successfully!
              </div>
            )}

            {copiedSnippet && (
              <div className="text-accent-success text-sm flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
                Markdown snippet copied to clipboard!
              </div>
            )}

            {/* Instructions */}
            <div className="mt-4 p-3 bg-l-bg-1 dark:bg-d-bg-1 rounded-md border border-border-l dark:border-border-d">
              <h4 className="text-sm font-medium text-l-text-1 dark:text-d-text-1 mb-2">
                How to use:
              </h4>
              <ol className="list-decimal list-inside text-sm text-l-text-2 dark:text-d-text-2 space-y-1">
                <li>Select a theme style that matches your GitHub profile</li>
                <li>Download the card as PNG or SVG</li>
                <li>Or copy the markdown to embed directly in your README</li>
                <li>Add it to the top of your GitHub profile README.md file</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image generation */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width="600"
        height="320"
      />
    </div>
  );
}

// Export Badge interface for use in other components
export interface Badge {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: React.ComponentType<{ className?: string }>;
  earned: boolean;
}
