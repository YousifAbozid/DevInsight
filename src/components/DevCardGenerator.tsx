import { useRef, useState } from 'react';
import DevCard from './DevCard';
import * as htmlToImage from 'html-to-image';
import SectionHeader from './shared/SectionHeader';
import { Icons } from './shared/Icons';
import { useToast } from '../context/ToastContext';

export interface Badge {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: React.ComponentType<{ className?: string }>;
  earned: boolean;
}

interface DevCardGeneratorProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

// Updated to include all implemented themes
type ThemeVariant =
  | 'default'
  | 'minimal'
  | 'gradient'
  | 'github'
  | 'terminal-hacker'
  | 'cyberpunk'
  | 'pastel'
  | 'retro-arcade'
  | 'galaxy-space'
  | 'matrix-rain'
  | 'producthunt';

interface ThemeOption {
  id: ThemeVariant;
  name: string;
  description: string;
  icon: React.ElementType;
}

export default function DevCardGenerator({
  user,
  repositories,
  languageData,
  badges,
}: DevCardGeneratorProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeVariant>('default');
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { notify } = useToast();

  // Define theme options with descriptive information
  const themeOptions: ThemeOption[] = [
    {
      id: 'default',
      name: 'Default',
      description: 'Clean theme with accent colors',
      icon: Icons.Layout,
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, clean layout with subtle gradients',
      icon: Icons.Minus,
    },
    {
      id: 'gradient',
      name: 'Gradient',
      description: 'Vibrant blue-purple gradient background',
      icon: Icons.Palette,
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'GitHub-inspired clean design',
      icon: Icons.GitHub,
    },
    {
      id: 'terminal-hacker',
      name: 'Terminal',
      description: 'Green-on-black Linux terminal style',
      icon: Icons.Terminal,
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      description: 'Neon pink, purple and cyan with glow effects',
      icon: Icons.Zap,
    },
    {
      id: 'pastel',
      name: 'Pastel Garden',
      description: 'Soft, rounded design with pastel colors',
      icon: Icons.Flower,
    },
    {
      id: 'retro-arcade',
      name: 'Retro Arcade',
      description: 'Classic 90s arcade game style with pixel art',
      icon: Icons.Trophy,
    },
    {
      id: 'galaxy-space',
      name: 'Galaxy Space',
      description: 'Deep space theme with stars and cosmic elements',
      icon: Icons.Star,
    },
    {
      id: 'matrix-rain',
      name: 'Matrix Rain',
      description: 'Green code falling on dark background',
      icon: Icons.Code,
    },
    {
      id: 'producthunt',
      name: 'Product Hunt',
      description: 'Clean white/orange product showcase design',
      icon: Icons.Heart,
    },
  ];

  // Generate the image using html-to-image
  const generateImage = async (format: 'png' | 'svg') => {
    if (!cardRef.current || !user) {
      console.error('Card reference not available');
      notify(
        'error',
        'Could not generate image - card reference not available'
      );
      return;
    }

    setIsExporting(true);

    // Show loading toast
    notify('info', `Generating ${format.toUpperCase()} image...`);

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

      // Show success toast
      notify('success', `${format.toUpperCase()} downloaded successfully!`);
    } catch (error) {
      console.error(`Error generating ${format} image:`, error);
      notify('error', `Error generating ${format.toUpperCase()} image`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <SectionHeader
        title="GitHub README Dev Card"
        icon={Icons.BadgeCheck}
        subtitle="Create and export personalized GitHub profile cards for your README"
        infoTooltip="Showcase your GitHub profile statistics with a beautiful card that you can add to your GitHub README profile. Choose a theme and download in various formats."
      />

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
              badges={badges?.filter(b => b.earned)}
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
            <div className="grid grid-cols-2 gap-3">
              {themeOptions.map(theme => (
                <button
                  key={theme.id}
                  className={`p-3 border rounded-md text-sm cursor-pointer flex flex-col items-start ${
                    selectedTheme === theme.id
                      ? 'border-accent-1 bg-accent-1/10 text-accent-1'
                      : 'border-border-l dark:border-border-d text-l-text-2 dark:text-d-text-2'
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div className="flex items-center gap-2 font-medium mb-1">
                    <theme.icon className="w-4 h-4" />
                    {theme.name}
                  </div>
                  <span className="text-xs opacity-80">
                    {theme.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-border-l dark:border-border-d pt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-sm font-medium text-l-text-1 dark:text-d-text-1 flex items-center">
                <Icons.Share2 className="w-4 h-4 text-accent-1 mr-2 flex-shrink-0" />
                <span>Export Your GitHub Card</span>
              </h3>

              <div className="flex w-full sm:w-auto gap-2.5">
                <button
                  onClick={() => generateImage('png')}
                  disabled={isExporting}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-md 
                  bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d shadow-sm
                  hover:border-accent-1/40 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover hover:shadow-md 
                  active:scale-95 transition-all duration-200 cursor-pointer"
                  title="Download as PNG image"
                  aria-label="Download as PNG image"
                >
                  <Icons.Image className="w-3.5 h-3.5 text-accent-1" />
                  <span>PNG</span>
                </button>

                <button
                  onClick={() => generateImage('svg')}
                  disabled={isExporting}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-md 
                  bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d shadow-sm
                  hover:border-accent-2/40 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover hover:shadow-md 
                  active:scale-95 transition-all duration-200 cursor-pointer"
                  title="Download as SVG vector"
                  aria-label="Download as SVG vector"
                >
                  <Icons.FileCode className="w-3.5 h-3.5 text-accent-2" />
                  <span>SVG</span>
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-l-bg-1 dark:bg-d-bg-1 rounded-md border border-border-l dark:border-border-d">
              <h4 className="text-sm font-medium text-l-text-1 dark:text-d-text-1 mb-2">
                How to use:
              </h4>
              <ol className="list-decimal list-inside text-sm text-l-text-2 dark:text-d-text-2 space-y-1">
                <li>Select a theme style that matches your GitHub profile</li>
                <li>Download the card as PNG or SVG</li>
                <li>Add it to the top of your GitHub profile README.md file</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
