import { useState, useRef, useMemo } from 'react';
import { ContributionData } from '../services/githubGraphQLService';
import PersonaRadarChart from './PersonaRadarChart';

interface CoderPersonaProps {
  user: GithubUser;
  repositories?: Repository[];
  contributionData?: ContributionData;
  loading: boolean;
}

type PersonaType =
  | 'The Polyglot'
  | 'The Specialist'
  | 'The OSS Contributor'
  | 'The Solo Hacker'
  | 'The Framework Lord'
  | 'The Consistent Committer'
  | 'The Sprinter'
  | 'The Documentation Hero'
  | 'The Project Juggler'
  | 'The Community Pillar';

interface PersonaData {
  type: PersonaType;
  description: string;
  strengths: {
    languageDiversity: number;
    contributionConsistency: number;
    collaboration: number;
    projectPopularity: number;
    codeQuality: number;
    communityImpact: number;
  };
  color: string;
  icon: React.FC<{ className?: string }>;
}

// Icons organized in a single object for better maintenance
const Icons = {
  CodeBranches: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Microscope: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path
        fillRule="evenodd"
        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Network: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zm1.5 0v1.5c0 .207.168.375.375.375h16.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375H3.375A.375.375 0 003 5.625zm0 3v10.875c0 .207.168.375.375.375h16.5a.375.375 0 00.375-.375V8.625A.375.375 0 0020.25 8.25H3.375A.375.375 0 003 8.625z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Lightbulb: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.75 6.75 0 1113.5 0v4.661c0 .326.277.585.6.544.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
      <path
        fillRule="evenodd"
        d="M9.75 15.75a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Cubes: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
      <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
      <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
    </svg>
  ),
  Star: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Document: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
        clipRule="evenodd"
      />
      <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
    </svg>
  ),
  Template: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Download: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3h-15a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Copy: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 01-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0113.5 1.5H15a3 3 0 012.663 1.618zM12 4.5A1.5 1.5 0 0113.5 3H15a1.5 1.5 0 010 3h-1.5A1.5 1.5 0 0112 4.5z"
        clipRule="evenodd"
      />
      <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 019 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0116.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625v-12z" />
    </svg>
  ),
  Info: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export default function CoderPersona({
  user,
  repositories = [],
  contributionData,
  loading,
}: CoderPersonaProps) {
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Calculate the metrics and determine the persona once, memoize the result
  const { persona, personalityText } = useMemo(() => {
    if (!repositories.length) {
      return { metrics: null, persona: null, personalityText: '' };
    }

    const calculatedMetrics = calculatePersonaMetrics(
      user,
      repositories,
      contributionData
    );
    const determinedPersona = determinePersona(calculatedMetrics);
    const generatedText = generatePersonalityText(
      determinedPersona,
      calculatedMetrics,
      user
    );

    return {
      metrics: calculatedMetrics,
      persona: determinedPersona,
      personalityText: generatedText,
    };
  }, [user, repositories, contributionData]);

  if (loading) {
    return <CoderPersonaSkeleton />;
  }

  if (!repositories.length || !persona) {
    return null;
  }

  // Function to generate markdown content for sharing
  const generateMarkdown = () => {
    const strengthsText = Object.entries(persona.strengths)
      .map(
        ([key, value]) =>
          `- ${formatStrengthName(key)}: ${Math.round(value)}/100`
      )
      .join('\n');

    return `# ${user.name || user.login}'s Coder Persona: ${persona.type}

${personalityText}

## Strengths
${strengthsText}

*Generated with [DevInsight](https://github.com/YousifAbozid/DevInsight)*
`;
  };

  // Copy markdown to clipboard
  const copyToClipboard = async () => {
    try {
      const markdown = generateMarkdown();
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  // SVG export function
  const downloadAsSVG = () => {
    if (!cardRef.current) return;

    try {
      // Clone the card element for manipulation
      const clone = cardRef.current.cloneNode(true) as HTMLElement;

      // Apply computed styles to make it look the same
      const serializer = new XMLSerializer();

      // Find all SVGs in the card and extract them
      const svgElements = clone.querySelectorAll('svg');
      const svgStrings: string[] = [];

      svgElements.forEach(svg => {
        const svgString = serializer.serializeToString(svg);
        svgStrings.push(svgString);
      });

      // Create and trigger download
      const link = document.createElement('a');
      link.download = `${user.login}-coder-persona.svg`;

      // Create a blob with simple content for now
      // In a real implementation, this would be a full SVG representation
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="padding: 20px;">
            <h2 style="margin: 0;">${persona.type}</h2>
            <p>${personalityText}</p>
            <div>Generated with DevInsight</div>
          </div>
        </foreignObject>
      </svg>`;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
      link.click();
    } catch (error) {
      console.error('Error generating SVG:', error);
    }
  };

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
            Your Coder Persona
          </h2>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="bg-l-bg-3/50 dark:bg-d-bg-3/50 p-1 rounded-full hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-colors cursor-pointer"
          >
            <Icons.Info className="w-4 h-4 text-l-text-2 dark:text-d-text-2" />
          </button>
        </div>
        <span className="px-3 py-1 text-xs rounded-full bg-accent-1/15 text-accent-1 font-medium">
          {persona.type}
        </span>
      </div>

      {showInfo && (
        <div className="mb-4 p-3 bg-l-bg-3/30 dark:bg-d-bg-3/30 rounded-lg text-sm text-l-text-2 dark:text-d-text-2">
          <p>
            Your Coder Persona is based on an analysis of your GitHub activity.
            The visualization shows your strengths across six key dimensions of
            software development. This helps you understand your unique coding
            style and preferences.
          </p>
        </div>
      )}

      {/* Persona Card - This will be the shareable element */}
      <div
        ref={cardRef}
        className="bg-l-bg-1 dark:bg-d-bg-1 rounded-lg p-6 border border-border-l dark:border-border-d"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Persona Icon and Title */}
          <div className="md:w-1/3 flex flex-col items-center text-center">
            <div className={`p-4 rounded-full ${persona.color} mb-4`}>
              <persona.icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-l-text-1 dark:text-d-text-1">
              {persona.type}
            </h3>
            <div className="text-sm text-l-text-2 dark:text-d-text-2 mt-2">
              {user.name || user.login}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="md:w-2/3">
            <PersonaRadarChart
              strengths={persona.strengths}
              color={getChartColorForPersona(persona.type)}
            />
          </div>
        </div>

        {/* Personality Description */}
        <div className="mt-6">
          <h4 className="font-semibold text-l-text-1 dark:text-d-text-1 mb-2">
            What This Says About You
          </h4>
          <p className="text-sm text-l-text-2 dark:text-d-text-2">
            {personalityText}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-border-l dark:border-border-d text-xs text-l-text-3 dark:text-d-text-3 text-center">
          Generated with DevInsight • github.com/YousifAbozid/DevInsight
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        <button
          onClick={downloadAsSVG}
          className="px-4 py-2 bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-md text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2 transition-colors"
        >
          <Icons.Download className="w-5 h-5" />
          Download as Image
        </button>

        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d rounded-md text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2 transition-colors"
        >
          <Icons.Copy className="w-5 h-5" />
          {copied ? 'Copied!' : 'Copy as Markdown'}
        </button>
      </div>
    </div>
  );
}

// Helper function to format strength names for display
function formatStrengthName(key: string): string {
  // Convert camelCase to separate words and capitalize first letter
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

// Helper function to get chart color based on persona
function getChartColorForPersona(personaType: PersonaType): string {
  const colorMap: Record<PersonaType, string> = {
    'The Polyglot': '#8B5CF6', // Purple
    'The Specialist': '#2563EB', // Blue
    'The OSS Contributor': '#F97316', // Orange
    'The Solo Hacker': '#6B7280', // Gray
    'The Framework Lord': '#6366F1', // Indigo
    'The Consistent Committer': '#10B981', // Green
    'The Sprinter': '#EF4444', // Red
    'The Documentation Hero': '#14B8A6', // Teal
    'The Project Juggler': '#EC4899', // Pink
    'The Community Pillar': '#F59E0B', // Yellow
  };

  return colorMap[personaType] || '#8B5CF6';
}

// Helper functions
function calculatePersonaMetrics(
  user: GithubUser,
  repositories: Repository[],
  contributionData?: ContributionData
) {
  // Calculate language diversity
  const languages = new Set(
    repositories.map(repo => repo.language).filter(Boolean)
  );
  const languageDiversity = Math.min(languages.size / 10, 1) * 100; // Normalize to 0-100

  // Calculate contribution consistency
  let contributionConsistency = 50; // Default
  if (contributionData) {
    const contributionDays = contributionData.weeks.flatMap(
      week => week.contributionDays
    );
    const activeDays = contributionDays.filter(
      day => day.contributionCount > 0
    ).length;
    const totalDays = contributionDays.length;
    contributionConsistency = Math.round((activeDays / totalDays) * 100);
  }

  // Calculate collaboration metrics
  const forkedRepos = repositories.filter(repo => repo.fork).length;
  const totalRepos = repositories.length;
  const collaboration = Math.round(
    totalRepos
      ? (forkedRepos / totalRepos) * 50 + Math.min(user.followers, 100) / 2
      : 0
  );

  // Calculate project popularity
  const totalStars = repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const projectPopularity = Math.min(Math.round((totalStars / 100) * 100), 100);

  // Estimate code quality (based on repository size and description completeness)
  const reposWithDescriptions = repositories.filter(
    repo => repo.description && repo.description.length > 20
  ).length;
  const codeQuality = Math.round(
    (reposWithDescriptions / Math.max(1, totalRepos)) * 100
  );

  // Calculate community impact
  const totalForks = repositories.reduce(
    (sum, repo) => sum + repo.forks_count,
    0
  );
  const communityImpact = Math.round(
    Math.min(totalForks / 20 + Math.min(user.followers, 100) / 2, 100)
  );

  return {
    languageDiversity: Math.round(languageDiversity),
    contributionConsistency,
    collaboration,
    projectPopularity,
    codeQuality,
    communityImpact,
    repositories,
    languages,
    totalStars,
    totalForks,
    user,
  };
}

function determinePersona(
  metrics: ReturnType<typeof calculatePersonaMetrics>
): PersonaData {
  const {
    languageDiversity,
    contributionConsistency,
    collaboration,
    projectPopularity,
    codeQuality,
    communityImpact,
    repositories,
    languages,
  } = metrics;

  // Determine persona based on metrics and specific conditions
  let persona: PersonaData;

  if (languages.size >= 5 && languageDiversity > 70) {
    persona = {
      type: 'The Polyglot',
      description:
        'You thrive in diverse technological environments, able to adapt to different programming languages and paradigms.',
      strengths: {
        languageDiversity,
        contributionConsistency,
        collaboration,
        projectPopularity,
        codeQuality,
        communityImpact,
      },
      color:
        'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
      icon: Icons.CodeBranches,
    };
  } else if (languages.size <= 2 && repositories.length >= 5) {
    persona = {
      type: 'The Specialist',
      description:
        'You focus deeply on mastering specific technologies, becoming an expert in your chosen domain.',
      strengths: {
        languageDiversity,
        contributionConsistency,
        collaboration,
        projectPopularity,
        codeQuality,
        communityImpact,
      },
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
      icon: Icons.Microscope,
    };
  } else if (contributionConsistency > 75) {
    persona = {
      type: 'The Consistent Committer',
      description:
        'Your steady approach to coding creates reliable progress and demonstrates exceptional discipline.',
      strengths: {
        languageDiversity,
        contributionConsistency,
        collaboration,
        projectPopularity,
        codeQuality,
        communityImpact,
      },
      color:
        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
      icon: Icons.Calendar,
    };
  } else if (
    metrics.repositories.filter(repo => repo.fork).length >
    metrics.repositories.length / 2
  ) {
    persona = {
      type: 'The OSS Contributor',
      description:
        'You actively collaborate with the broader developer community, strengthening the open-source ecosystem.',
      strengths: {
        languageDiversity,
        contributionConsistency,
        collaboration,
        projectPopularity,
        codeQuality,
        communityImpact,
      },
      color:
        'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
      icon: Icons.Network,
    };
  } else if (collaboration < 30 && repositories.length > 5) {
    persona = {
      type: 'The Solo Hacker',
      description:
        'You excel in independent development, building your own vision with focus and determination.',
      strengths: {
        languageDiversity,
        contributionConsistency,
        collaboration,
        projectPopularity,
        codeQuality,
        communityImpact,
      },
      color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-300',
      icon: Icons.Lightbulb,
    };
  } else if (metrics.repositories.length > 10) {
    persona = {
      type: 'The Project Juggler',
      description:
        'Your diverse portfolio of projects showcases versatility and a passion for exploring new ideas.',
      strengths: {
        languageDiversity,
        contributionConsistency,
        collaboration,
        projectPopularity,
        codeQuality,
        communityImpact,
      },
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300',
      icon: Icons.Cubes,
    };
  } else if (metrics.totalStars > 100 || projectPopularity > 70) {
    persona = {
      type: 'The Community Pillar',
      description:
        'Your work resonates with the developer community, creating impact through widely-used projects.',
      strengths: {
        languageDiversity,
        contributionConsistency,
        collaboration,
        projectPopularity,
        codeQuality,
        communityImpact,
      },
      color:
        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300',
      icon: Icons.Star,
    };
  } else if (codeQuality > 70) {
    persona = {
      type: 'The Documentation Hero',
      description:
        'Your attention to detail and clear communication makes your code accessible and maintainable.',
      strengths: {
        languageDiversity,
        contributionConsistency,
        collaboration,
        projectPopularity,
        codeQuality,
        communityImpact,
      },
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300',
      icon: Icons.Document,
    };
  } else {
    // Default persona if others don't match
    persona = {
      type: 'The Framework Lord',
      description:
        'You build on solid foundations, leveraging frameworks and libraries to create robust applications.',
      strengths: {
        languageDiversity,
        contributionConsistency,
        collaboration,
        projectPopularity,
        codeQuality,
        communityImpact,
      },
      color:
        'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
      icon: Icons.Template,
    };
  }

  return persona;
}

function generatePersonalityText(
  persona: PersonaData,
  metrics: ReturnType<typeof calculatePersonaMetrics>,
  user: GithubUser
): string {
  const { type, description } = persona;

  // Base text from the persona description
  let text = description + ' ';

  // Add language-specific insights
  if (metrics.languages.size > 0) {
    const languageArray = Array.from(metrics.languages).filter(Boolean);
    if (languageArray.length > 0) {
      if (type === 'The Polyglot') {
        text += `Your proficiency across ${languageArray.slice(0, 3).join(', ')}${languageArray.length > 3 ? ' and more' : ''} shows your adaptability. `;
      } else if (type === 'The Specialist') {
        text += `Your focus on ${languageArray.slice(0, 2).join(' and ')} has allowed you to develop deep expertise. `;
      } else {
        const primaryLang = languageArray[0];
        text += primaryLang
          ? `Your experience with ${primaryLang} forms a strong foundation for your development work. `
          : '';
      }
    }
  }

  // Add repository insights
  if (metrics.repositories.length > 0) {
    if (metrics.repositories.length > 10) {
      text += `With ${metrics.repositories.length} repositories, you clearly enjoy exploring diverse projects. `;
    } else if (metrics.repositories.length > 5) {
      text += `Your ${metrics.repositories.length} repositories show a healthy balance of focus and variety. `;
    }

    // Add star insights if applicable
    if (metrics.totalStars > 100) {
      text += `Your projects have gained significant attention with ${metrics.totalStars} stars. `;
    } else if (metrics.totalStars > 10) {
      text += `With ${metrics.totalStars} stars across your repositories, your work is beginning to get recognized. `;
    }
  }

  // Add social insights
  if (user.followers > 50) {
    text += `Your community of ${user.followers} followers suggests you're an influential voice in the development space.`;
  } else if (user.followers > 10) {
    text += `Your ${user.followers} followers indicate your work is resonating with other developers.`;
  } else {
    text += `As you continue to share your work, your developer network will likely expand beyond your current ${user.followers} followers.`;
  }

  return text;
}

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
