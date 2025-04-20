import { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ContributionData } from '../services/githubGraphQLService';
import PersonaStrengthBars from './PersonaStrengthBars';
import { Icons } from '../components/shared/Icons';

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

export default function CoderPersona({
  user,
  repositories = [],
  contributionData,
  loading,
}: CoderPersonaProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showPersonasModal, setShowPersonasModal] = useState(false);
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
            aria-label="Show information about coder persona"
          >
            <Icons.Info className="w-4 h-4 text-l-text-2 dark:text-d-text-2" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/personas"
            className="text-xs px-3 py-1 text-accent-1 hover:underline"
          >
            See all personas
          </Link>
          <span className="px-3 py-1 text-xs rounded-full bg-accent-1/15 text-accent-1 font-medium">
            {persona.type}
          </span>
        </div>
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

      {/* Persona Card */}
      <div
        ref={cardRef}
        className="bg-l-bg-1 dark:bg-d-bg-1 rounded-lg p-6 border border-border-l dark:border-border-d"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Persona Icon and Title */}
          <div className="md:w-1/4 flex flex-col items-center text-center">
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

      {/* Personas Explanation Modal */}
      {showPersonasModal && (
        <PersonasExplanationModal onClose={() => setShowPersonasModal(false)} />
      )}
    </div>
  );
}

// Personas Explanation Modal Component
function PersonasExplanationModal({ onClose }: { onClose: () => void }) {
  // All possible personas with their selection criteria
  const allPersonas = [
    {
      type: 'The Polyglot',
      description:
        'You thrive in diverse technological environments, able to adapt to different programming languages and paradigms.',
      criteria:
        'Assigned when you have 5+ programming languages and language diversity score > 70.',
      color:
        'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
      icon: Icons.CodeBranches,
    },
    {
      type: 'The Specialist',
      description:
        'You focus deeply on mastering specific technologies, becoming an expert in your chosen domain.',
      criteria:
        'Assigned when you have ≤ 2 programming languages across 5+ repositories.',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
      icon: Icons.Microscope,
    },
    {
      type: 'The Consistent Committer',
      description:
        'Your steady approach to coding creates reliable progress and demonstrates exceptional discipline.',
      criteria: 'Assigned when your contribution consistency score is > 75.',
      color:
        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
      icon: Icons.Calendar,
    },
    {
      type: 'The OSS Contributor',
      description:
        'You actively collaborate with the broader developer community, strengthening the open-source ecosystem.',
      criteria: 'Assigned when more than half of your repositories are forks.',
      color:
        'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
      icon: Icons.Network,
    },
    {
      type: 'The Solo Hacker',
      description:
        'You excel in independent development, building your own vision with focus and determination.',
      criteria:
        'Assigned when collaboration score < 30 and you have > 5 repositories.',
      color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-300',
      icon: Icons.Lightbulb,
    },
    {
      type: 'The Project Juggler',
      description:
        'Your diverse portfolio of projects showcases versatility and a passion for exploring new ideas.',
      criteria: 'Assigned when you have > 10 repositories.',
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300',
      icon: Icons.Cubes,
    },
    {
      type: 'The Community Pillar',
      description:
        'Your work resonates with the developer community, creating impact through widely-used projects.',
      criteria:
        'Assigned when total stars > 100 or project popularity score > 70.',
      color:
        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300',
      icon: Icons.Star,
    },
    {
      type: 'The Documentation Hero',
      description:
        'Your attention to detail and clear communication makes your code accessible and maintainable.',
      criteria: 'Assigned when code quality score > 70.',
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300',
      icon: Icons.Document,
    },
    {
      type: 'The Framework Lord',
      description:
        'You build on solid foundations, leveraging frameworks and libraries to create robust applications.',
      criteria: "Default persona when others don't match.",
      color:
        'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
      icon: Icons.Template,
    },
    {
      type: 'The Sprinter',
      description:
        'You have a knack for rapid development and shipping features quickly when needed.',
      criteria: 'Currently inactive in the system.',
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
      icon: Icons.Download,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-l-bg-1 dark:bg-d-bg-1 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-l-bg-1 dark:bg-d-bg-1 p-4 border-b border-border-l dark:border-border-d flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
            Understanding Coder Personas
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-l-bg-3/50 dark:hover:bg-d-bg-3/50 rounded-full"
          >
            <Icons.Info className="h-5 w-5 text-l-text-2 dark:text-d-text-2" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-l-text-1 dark:text-d-text-1 mb-2">
              How Your Persona Is Determined
            </h4>
            <p className="text-l-text-2 dark:text-d-text-2 mb-4">
              Your Coder Persona is determined by analyzing your GitHub activity
              across six dimensions: language diversity, contribution
              consistency, collaboration, project popularity, code quality, and
              community impact. The system evaluates your repositories,
              languages, stars, followers, and contribution patterns to assign
              the most fitting persona.
            </p>

            <div className="mb-6 bg-l-bg-3/30 dark:bg-d-bg-3/30 rounded-lg p-4">
              <h5 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2">
                Scoring Metrics
              </h5>
              <ul className="list-disc list-inside space-y-2 text-sm text-l-text-2 dark:text-d-text-2">
                <li>
                  <span className="font-medium">Language Diversity:</span> Based
                  on the unique programming languages across your repositories
                </li>
                <li>
                  <span className="font-medium">Contribution Consistency:</span>{' '}
                  Calculated from your contribution calendar data
                </li>
                <li>
                  <span className="font-medium">Collaboration:</span> Determined
                  by forked repositories and followers
                </li>
                <li>
                  <span className="font-medium">Project Popularity:</span> Based
                  on star count across repositories
                </li>
                <li>
                  <span className="font-medium">Code Quality:</span> Evaluated
                  from repository descriptions and organization
                </li>
                <li>
                  <span className="font-medium">Community Impact:</span>{' '}
                  Calculated from repository forks and followers
                </li>
              </ul>
            </div>
          </div>

          <h4 className="text-lg font-semibold text-l-text-1 dark:text-d-text-1 mb-4">
            All Possible Personas
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allPersonas.map(persona => (
              <div
                key={persona.type}
                className="border border-border-l dark:border-border-d rounded-lg p-4 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-full ${persona.color}`}>
                    <persona.icon className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-l-text-1 dark:text-d-text-1">
                    {persona.type}
                  </h5>
                </div>
                <p className="text-sm text-l-text-2 dark:text-d-text-2 mb-3">
                  {persona.description}
                </p>
                <div className="mt-auto">
                  <h6 className="text-xs font-semibold text-l-text-1 dark:text-d-text-1 uppercase tracking-wider mb-1">
                    Selection Criteria
                  </h6>
                  <p className="text-xs text-l-text-3 dark:text-d-text-3">
                    {persona.criteria}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
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
