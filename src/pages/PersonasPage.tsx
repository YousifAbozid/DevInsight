import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/shared/Icons';

export default function PersonasPage() {
  // Set page title
  useEffect(() => {
    document.title = 'Coder Personas | DevInsight';

    // Cleanup function to reset title when unmounting
    return () => {
      document.title = 'DevInsight';
    };
  }, []);

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
      borderColor: 'border-purple-300 dark:border-purple-800',
      icon: Icons.CodeBranches,
    },
    {
      type: 'The Specialist',
      description:
        'You focus deeply on mastering specific technologies, becoming an expert in your chosen domain.',
      criteria:
        'Assigned when you have ≤ 2 programming languages across 5+ repositories.',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
      borderColor: 'border-blue-300 dark:border-blue-800',
      icon: Icons.Microscope,
    },
    {
      type: 'The Consistent Committer',
      description:
        'Your steady approach to coding creates reliable progress and demonstrates exceptional discipline.',
      criteria: 'Assigned when your contribution consistency score is > 75.',
      color:
        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
      borderColor: 'border-green-300 dark:border-green-800',
      icon: Icons.Calendar,
    },
    {
      type: 'The OSS Contributor',
      description:
        'You actively collaborate with the broader developer community, strengthening the open-source ecosystem.',
      criteria: 'Assigned when more than half of your repositories are forks.',
      color:
        'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
      borderColor: 'border-orange-300 dark:border-orange-800',
      icon: Icons.Network,
    },
    {
      type: 'The Solo Hacker',
      description:
        'You excel in independent development, building your own vision with focus and determination.',
      criteria:
        'Assigned when collaboration score < 30 and you have > 5 repositories.',
      color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-300',
      borderColor: 'border-gray-300 dark:border-gray-800',
      icon: Icons.Lightbulb,
    },
    {
      type: 'The Project Juggler',
      description:
        'Your diverse portfolio of projects showcases versatility and a passion for exploring new ideas.',
      criteria: 'Assigned when you have > 10 repositories.',
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300',
      borderColor: 'border-pink-300 dark:border-pink-800',
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
      borderColor: 'border-yellow-300 dark:border-yellow-800',
      icon: Icons.Star,
    },
    {
      type: 'The Documentation Hero',
      description:
        'Your attention to detail and clear communication makes your code accessible and maintainable.',
      criteria: 'Assigned when code quality score > 70.',
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300',
      borderColor: 'border-teal-300 dark:border-teal-800',
      icon: Icons.Document,
    },
    {
      type: 'The Framework Lord',
      description:
        'You build on solid foundations, leveraging frameworks and libraries to create robust applications.',
      criteria: "Default persona when others don't match.",
      color:
        'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
      borderColor: 'border-indigo-300 dark:border-indigo-800',
      icon: Icons.Template,
    },
    {
      type: 'The Sprinter',
      description:
        'You have a knack for rapid development and shipping features quickly when needed.',
      criteria: 'Currently inactive in the system.',
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
      borderColor: 'border-red-300 dark:border-red-800',
      icon: Icons.Zap,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-l-text-1 dark:text-d-text-1 mb-2">
          Coder Personas
        </h1>
        <p className="text-l-text-2 dark:text-d-text-2 max-w-3xl">
          DevInsight analyzes GitHub profiles and assigns a persona that best
          represents your development style. Each persona is determined by
          evaluating your activity across six key dimensions.
        </p>
      </div>

      <div className="mb-10 bg-l-bg-1 dark:bg-d-bg-1 rounded-lg p-6 border border-border-l dark:border-border-d">
        <h2 className="text-xl font-semibold text-l-text-1 dark:text-d-text-1 mb-4">
          How Your Persona Is Determined
        </h2>
        <p className="text-l-text-2 dark:text-d-text-2 mb-6">
          Your Coder Persona is determined by analyzing your GitHub activity
          across six dimensions. The system evaluates your repositories,
          languages, stars, followers, and contribution patterns to assign the
          most fitting persona.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-l-bg-2 dark:bg-d-bg-2 p-4 rounded-lg border border-border-l dark:border-border-d">
            <h3 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2 flex items-center gap-2">
              <Icons.Code className="w-5 h-5 text-accent-1" />
              Language Diversity
            </h3>
            <p className="text-sm text-l-text-2 dark:text-d-text-2">
              Based on the unique programming languages across your
              repositories. Higher scores indicate proficiency in multiple
              languages.
            </p>
          </div>

          <div className="bg-l-bg-2 dark:bg-d-bg-2 p-4 rounded-lg border border-border-l dark:border-border-d">
            <h3 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2 flex items-center gap-2">
              <Icons.Calendar className="w-5 h-5 text-accent-1" />
              Contribution Consistency
            </h3>
            <p className="text-sm text-l-text-2 dark:text-d-text-2">
              Calculated from your contribution calendar data, measuring how
              regularly you commit code over time.
            </p>
          </div>

          <div className="bg-l-bg-2 dark:bg-d-bg-2 p-4 rounded-lg border border-border-l dark:border-border-d">
            <h3 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2 flex items-center gap-2">
              <Icons.Users className="w-5 h-5 text-accent-1" />
              Collaboration
            </h3>
            <p className="text-sm text-l-text-2 dark:text-d-text-2">
              Determined by forked repositories and followers, reflecting how
              you interact with other developers.
            </p>
          </div>

          <div className="bg-l-bg-2 dark:bg-d-bg-2 p-4 rounded-lg border border-border-l dark:border-border-d">
            <h3 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2 flex items-center gap-2">
              <Icons.Star className="w-5 h-5 text-accent-1" />
              Project Popularity
            </h3>
            <p className="text-sm text-l-text-2 dark:text-d-text-2">
              Based on star count across repositories, indicating the
              community&apos;s interest in your work.
            </p>
          </div>

          <div className="bg-l-bg-2 dark:bg-d-bg-2 p-4 rounded-lg border border-border-l dark:border-border-d">
            <h3 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2 flex items-center gap-2">
              <Icons.Check className="w-5 h-5 text-accent-1" />
              Code Quality
            </h3>
            <p className="text-sm text-l-text-2 dark:text-d-text-2">
              Evaluated from repository descriptions, organization, and
              documentation patterns.
            </p>
          </div>

          <div className="bg-l-bg-2 dark:bg-d-bg-2 p-4 rounded-lg border border-border-l dark:border-border-d">
            <h3 className="font-medium text-l-text-1 dark:text-d-text-1 mb-2 flex items-center gap-2">
              <Icons.Globe className="w-5 h-5 text-accent-1" />
              Community Impact
            </h3>
            <p className="text-sm text-l-text-2 dark:text-d-text-2">
              Calculated from repository forks and followers, measuring your
              influence in the developer community.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-l-text-1 dark:text-d-text-1 mb-6">
        All Possible Personas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPersonas.map(persona => (
          <div
            key={persona.type}
            className={`bg-l-bg-1 dark:bg-d-bg-1 rounded-lg p-5 border-2 transition-all
               border-border-l dark:border-border-d hover:border-border-l/80 dark:hover:border-border-d/80`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${persona.color}`}>
                <persona.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-l-text-1 dark:text-d-text-1 text-lg">
                  {persona.type}
                </h3>
              </div>
            </div>

            <p className="text-l-text-2 dark:text-d-text-2 mb-4">
              {persona.description}
            </p>

            <div className="mt-auto">
              <h4 className="text-xs font-semibold text-l-text-1 dark:text-d-text-1 uppercase tracking-wider mb-1">
                Selection Criteria
              </h4>
              <p className="text-xs text-l-text-3 dark:text-d-text-3">
                {persona.criteria}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border border-dashed border-border-l dark:border-border-d text-center">
        <h3 className="text-xl font-semibold text-l-text-1 dark:text-d-text-1 mb-2">
          Want to know your Coder Persona?
        </h3>
        <p className="text-l-text-2 dark:text-d-text-2 mb-4">
          Enter your GitHub username and discover which persona best represents
          your coding style.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-accent-1 text-white rounded-lg hover:bg-accent-1/90 transition-colors"
        >
          Search GitHub Profile
        </Link>
      </div>
    </div>
  );
}
