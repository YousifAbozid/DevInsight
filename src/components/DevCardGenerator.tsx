import { useRef, useState } from 'react';
import DevCard from './DevCard';
import * as htmlToImage from 'html-to-image';

interface DevCardGeneratorProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

type ThemeVariant = 'default' | 'minimal' | 'gradient' | 'github';

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
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate the image using html-to-image
  const generateImage = async (format: 'png' | 'svg') => {
    if (!cardRef.current || !user) {
      console.error('Card reference not available');
      return;
    }

    setIsExporting(true);

    try {
      // Add a small delay to ensure all styles are properly applied
      await new Promise(resolve => setTimeout(resolve, 100));

      let dataUrl: string;

      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(cardRef.current, {
          quality: 1,
          pixelRatio: 2, // Better quality for retina displays
          cacheBust: true,
          style: {
            // Force visible overflow for screenshot
            overflow: 'visible',
            borderRadius: '8px',
          },
        });

        // Create and trigger download link
        const link = document.createElement('a');
        link.download = `${user.login}-github-card.png`;
        link.href = dataUrl;
        link.click();
      } else {
        // For SVG format
        dataUrl = await htmlToImage.toSvg(cardRef.current, {
          cacheBust: true,
          style: {
            overflow: 'visible',
            borderRadius: '8px',
          },
        });

        // Create and trigger download link
        const link = document.createElement('a');
        link.download = `${user.login}-github-card.svg`;
        link.href = dataUrl;
        link.click();
      }

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error(`Error generating ${format} image:`, error);
    } finally {
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

  console.warn(generateMarkdownSnippet);

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
            </div>

            {/* Status messages */}
            {isExporting && (
              <div className="text-l-text-2 dark:text-d-text-2 text-sm flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
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
