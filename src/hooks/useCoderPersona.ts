import { useMemo } from 'react';
import { ContributionData } from '../services/githubGraphQLService';
import { Icons } from '../components/shared/Icons';

export type PersonaType =
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

export interface PersonaData {
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

/**
 * Custom hook to analyze a GitHub user's coding behavior and determine their persona
 * @param user GitHub user object
 * @param repositories Array of GitHub repositories
 * @param contributionData Optional contribution data
 * @returns Object with persona data, personality text, and metrics
 */
export function useCoderPersona(
  user: GithubUser,
  repositories: Repository[],
  contributionData?: ContributionData
) {
  return useMemo(() => {
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
}

/**
 * Get chart color based on persona type
 */
export function getChartColorForPersona(personaType: PersonaType): string {
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

/**
 * Calculate metrics from user data to determine persona
 */
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

/**
 * Determine persona based on metrics
 */
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

/**
 * Generate personalized text based on persona and metrics
 */
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
