import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ContributionData } from '../services/githubGraphQLService';
import PersonaStrengthBars from './PersonaStrengthBars';
import { Icons } from '../components/shared/Icons';
import SectionHeader from './shared/SectionHeader';
import * as htmlToImage from 'html-to-image';
import {
  useCoderPersona,
  getChartColorForPersona,
} from '../hooks/useCoderPersona';

// Define a type for status messages
interface StatusMessage {
  id: string;
  type: 'loading' | 'success';
  text: string;
  timestamp: number;
}

interface CoderPersonaProps {
  user: GithubUser;
  repositories?: Repository[];
  contributionData?: ContributionData;
  loading: boolean;
}

export default function CoderPersona({
  user,
  repositories = [],
  contributionData,
  loading,
}: CoderPersonaProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Replace single state variables with a message queue
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

  // Use the extracted hook to get persona data
  const { persona, personalityText } = useCoderPersona(
    user,
    repositories,
    contributionData
  );

  // Helper to add a message to the queue
  const addStatusMessage = (type: 'loading' | 'success', text: string) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const message = { id, type, text, timestamp: Date.now() };

    setStatusMessages(prev => [...prev, message]);

    // For success messages, set a timeout to remove them
    if (type === 'success') {
      setTimeout(() => {
        setStatusMessages(prev => prev.filter(m => m.id !== id));
      }, 3000);
    }

    return id;
  };

  // Helper to remove a specific message
  const removeStatusMessage = (id: string) => {
    setStatusMessages(prev => prev.filter(message => message.id !== id));
  };

  // Generate the image using html-to-image
  const generateImage = async (format: 'png' | 'svg') => {
    if (!cardRef.current || !user) {
      console.error('Card reference not available');
      return;
    }

    const loadingMsgId = addStatusMessage('loading', 'Generating image...');

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
        link.download = `${user.login}-coder-persona.png`;
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
        link.download = `${user.login}-coder-persona.svg`;
        link.href = dataUrl;
        link.click();
      }

      // Remove loading message and add success message
      removeStatusMessage(loadingMsgId);
      addStatusMessage(
        'success',
        `Success! ${format.toUpperCase()} downloaded`
      );
    } catch (error) {
      console.error(`Error generating ${format} image:`, error);
      removeStatusMessage(loadingMsgId);
      addStatusMessage('success', `Error generating ${format.toUpperCase()}`);
    }
  };

  // Helper function to check if there are any loading messages
  const isExporting = statusMessages.some(msg => msg.type === 'loading');

  if (loading) {
    return <CoderPersonaSkeleton />;
  }

  if (!repositories.length || !persona) {
    return null;
  }

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm">
      <SectionHeader
        title="Your Coder Persona"
        subtitle="Discover your unique developer profile based on GitHub activity"
        icon={Icons.Users}
        infoTooltip="Your Coder Persona is based on an analysis of your GitHub activity. The visualization shows your strengths across six key dimensions of software development. This helps you understand your unique coding style and preferences."
        rightControls={
          <div className="flex items-center gap-2">
            <Link
              to="/personas"
              className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 group rounded-md relative overflow-hidden border border-accent-1/50"
              aria-label="View all coder personas"
            >
              <span className="absolute inset-0 bg-accent-1 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <Icons.Users className="w-4 h-4 text-accent-1 z-10 group-hover:text-l-text-inv dark:group-hover:text-d-text-inv transition-colors duration-200" />
              <span className="text-xs font-medium z-10 text-l-text-2 dark:text-d-text-2 group-hover:text-l-text-inv dark:group-hover:text-d-text-inv transition-colors duration-200">
                See all personas
              </span>
            </Link>
            <span className="px-3 py-1 text-xs rounded-full bg-accent-1/15 text-accent-1 font-medium">
              {persona.type}
            </span>
          </div>
        }
      />

      {/* Persona Card */}
      <div
        ref={cardRef}
        className="bg-l-bg-1 dark:bg-d-bg-1 rounded-lg p-6 border border-border-l dark:border-border-d mt-4"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Persona Icon and Title */}
          <div className="md:w-1/4 flex flex-col items-center text-center my-auto">
            <div className={`p-4 rounded-full ${persona.color} mb-4`}>
              <persona.icon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-l-text-1 dark:text-d-text-1">
              {persona.type}
            </h3>
            <div className="text-sm text-l-text-2 dark:text-d-text-2 mt-2">
              {user.name || user.login}
            </div>
          </div>

          {/* Strength Bars */}
          <div className="md:w-3/4">
            <PersonaStrengthBars
              strengths={persona.strengths}
              color={getChartColorForPersona(persona.type)}
            />
          </div>
        </div>

        {/* Personality Description */}
        <div className="mt-6">
          <h4 className="font-semibold text-l-text-1 dark:text-d-text-1 mb-2 text-sm">
            What This Says About You
          </h4>
          <p className="text-sm text-l-text-2 dark:text-d-text-2">
            {personalityText}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-border-l dark:border-border-d text-xs text-l-text-3 dark:text-d-text-3 text-center">
          Generated with DevInsight • github.com/YousifAbozid/DevInsight
        </div>
      </div>

      {/* Enhanced Export Options - Responsive & Mobile Friendly */}
      <div className="mt-5 border-t border-border-l dark:border-border-d pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium text-l-text-1 dark:text-d-text-1 flex items-center">
            <Icons.Share2 className="w-4 h-4 text-accent-1 mr-2 flex-shrink-0" />
            <span>Share Your Developer Profile</span>
          </h3>

          <div className="flex w-full sm:w-auto gap-2.5">
            <button
              onClick={() => generateImage('png')}
              disabled={isExporting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-md 
              bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d shadow-sm
              hover:border-accent-1/40 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover hover:shadow-md 
              active:scale-95 disabled:opacity-60 disabled:pointer-events-none transition-all duration-200"
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
              active:scale-95 disabled:opacity-60 disabled:pointer-events-none transition-all duration-200"
              title="Download as SVG vector"
              aria-label="Download as SVG vector"
            >
              <Icons.FileCode className="w-3.5 h-3.5 text-accent-2" />
              <span>SVG</span>
            </button>
          </div>
        </div>

        {/* Status message area - Now showing multiple messages */}
        {statusMessages.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {statusMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full shadow-sm mx-auto
                  ${
                    msg.type === 'loading'
                      ? 'text-l-text-2 dark:text-d-text-2 bg-l-bg-1 dark:bg-d-bg-1 animate-pulse'
                      : 'text-accent-success bg-accent-success/10 animate-fade-in'
                  }`}
              >
                {msg.type === 'loading' ? (
                  <Icons.Loader
                    className="w-3.5 h-3.5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Icons.Check className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton loader component
function CoderPersonaSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        <div className="h-6 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
      </div>

      <div className="bg-l-bg-1 dark:bg-d-bg-1 rounded-lg p-6 border border-border-l dark:border-border-d">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-l-bg-3 dark:bg-d-bg-3 mb-4"></div>
            <div className="h-6 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
            <div className="h-4 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>

          <div className="md:w-2/3 h-64 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>

        <div className="mt-6">
          <div className="h-5 w-40 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
          <div className="h-4 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
          <div className="h-4 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>
      </div>

      <div className="mt-4 flex gap-3 justify-center">
        <div className="h-10 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        <div className="h-10 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
      </div>
    </div>
  );
}
