import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import {
  useGithubUser,
  useUserRepositories,
  aggregateLanguageData,
} from '../services/githubService';
import GithubProfileCard from '../components/GithubProfileCard';
import ProfileSkeleton from '../components/ProfileSkeleton';
import LanguagePieChart from '../components/LanguagePieChart';
import LanguageChartSkeleton from '../components/LanguageChartSkeleton';
import ContributionHeatmap from '../components/ContributionHeatmap';
import MostStarredRepos from '../components/MostStarredRepos';
import DeveloperBadges from '../components/DeveloperBadges';
import PersonalizedSummary from '../components/PersonalizedSummary';
import { useContributionData } from '../services/githubGraphQLService';
import DevCardGenerator from '../components/DevCardGenerator';
import CoderPersona from '../components/CoderPersona';
import DevJourneyTimeline from '../components/DevJourneyTimeline';

// Define interface for JSON-LD structured data
interface StructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  mainEntity: {
    '@type': string;
    name: string;
    alternateName: string;
    url: string;
    image: string;
    description: string;
  };
}

interface PublicProfilePageProps {
  profileType?: 'user' | 'organization';
}

export default function PublicProfilePage({
  profileType,
}: PublicProfilePageProps) {
  // Get username from URL params
  const { username = '' } = useParams<{ username: string }>();
  const navigate = useNavigate();

  // Add token state and UI controls
  const [token, setToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const tokenTimeoutRef = useRef<number | null>(null);

  // Add state for detected profile type
  const [detectedProfileType, setDetectedProfileType] = useState<
    'user' | 'organization' | null
  >(profileType || null);

  // Load token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('github_token');
    if (storedToken) {
      setToken(storedToken);
      setSavedToken(storedToken);
    }
  }, []);

  // Debounced token saving with feedback
  useEffect(() => {
    if (token === savedToken) return;

    // Clear previous timeout if it exists
    if (tokenTimeoutRef.current) {
      clearTimeout(tokenTimeoutRef.current);
    }

    // Only save if token changes and isn't empty
    if (token.trim()) {
      tokenTimeoutRef.current = setTimeout(() => {
        localStorage.setItem('github_token', token.trim());
        setSavedToken(token);
        setShowSaveMessage(true);

        // Hide message after 3 seconds
        setTimeout(() => {
          setShowSaveMessage(false);
        }, 3000);
      }, 1000); // 1 second debounce
    }

    return () => {
      if (tokenTimeoutRef.current) {
        clearTimeout(tokenTimeoutRef.current);
      }
    };
  }, [token, savedToken]);

  // Fetch data using the same hooks as in GithubProfilePage
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
    isError: isUserError,
  } = useGithubUser(username);

  const { data: repositories, isLoading: isReposLoading } =
    useUserRepositories(username);

  const { data: contributionData, isLoading: isContributionLoading } =
    useContributionData(username, savedToken || undefined);

  // Detect if the profile is a user or organization based on the API response
  useEffect(() => {
    if (user) {
      const isOrg = user.type === 'Organization';
      setDetectedProfileType(isOrg ? 'organization' : 'user');

      // If we're on the legacy route and now know the type, redirect to the appropriate route
      if (!profileType && window.location.pathname === `/${username}`) {
        navigate(isOrg ? `/org/${username}` : `/user/${username}`, {
          replace: true,
        });
      }
    }
  }, [user, username, profileType, navigate]);

  // Generate page URL and description
  const profilePath = detectedProfileType
    ? `/${detectedProfileType}/${username}`
    : `/${username}`;
  const pageUrl = `${window.location.origin}${profilePath}`;

  const pageTitle = username
    ? `${username}'s GitHub ${detectedProfileType === 'organization' ? 'Organization' : 'Profile'} | DevInsight`
    : 'DevInsight';

  const pageDescription = `View ${username}'s GitHub ${
    detectedProfileType === 'organization' ? 'organization' : 'profile'
  } data, repositories, ${detectedProfileType === 'user' ? 'contributions, ' : ''}and programming language analytics on DevInsight`;

  // Create JSON-LD structured data
  const structuredData: StructuredData | null = user
    ? {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: pageTitle,
        description: pageDescription,
        mainEntity: {
          '@type':
            detectedProfileType === 'organization' ? 'Organization' : 'Person',
          name: user.name || username,
          alternateName: username,
          url: user.html_url,
          image: user.avatar_url,
          description: user.bio || pageDescription,
        },
      }
    : null;

  // Update document metadata whenever username or user data changes
  useEffect(() => {
    // Update page title
    document.title = pageTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateOgMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(
        `meta[property="og:${property}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', `og:${property}`);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateTwitterMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(
        `meta[name="twitter:${name}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', `twitter:${name}`);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Set canonical URL
    const setCanonicalLink = (url: string) => {
      let link = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = url;
    };

    // Add or update JSON-LD structured data
    const updateJsonLd = (data: StructuredData) => {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    // Basic meta tags
    updateMetaTag('description', pageDescription);
    updateMetaTag('robots', 'index, follow');

    // Open Graph tags
    updateOgMetaTag('title', pageTitle);
    updateOgMetaTag('description', pageDescription);
    updateOgMetaTag(
      'type',
      detectedProfileType === 'organization' ? 'profile.business' : 'profile'
    );
    updateOgMetaTag('url', pageUrl);

    // Add user avatar as og:image if available
    if (user?.avatar_url) {
      updateOgMetaTag('image', user.avatar_url);
    }

    // Twitter Card metadata
    updateTwitterMetaTag('card', 'summary');
    updateTwitterMetaTag('title', pageTitle);
    updateTwitterMetaTag('description', pageDescription);
    if (user?.avatar_url) {
      updateTwitterMetaTag('image', user.avatar_url);
    }

    // Set canonical URL
    setCanonicalLink(pageUrl);

    // Add JSON-LD structured data if user data is available
    if (structuredData) {
      updateJsonLd(structuredData);
    }

    // Cleanup function to remove JSON-LD when component unmounts
    return () => {
      const script = document.querySelector(
        'script[type="application/ld+json"]'
      );
      if (script) {
        script.remove();
      }
    };
  }, [
    username,
    user,
    pageTitle,
    pageDescription,
    pageUrl,
    structuredData,
    detectedProfileType,
  ]);

  const errorMessage = isUserError
    ? userError instanceof Error
      ? userError.message
      : 'An error occurred'
    : null;

  const languageData = repositories ? aggregateLanguageData(repositories) : [];

  // Handle token clearing
  const handleClearToken = () => {
    localStorage.removeItem('github_token');
    setToken('');
    setSavedToken(null);
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  // If we're on the legacy route and have detected the profile type, redirect
  if (
    !profileType &&
    detectedProfileType &&
    window.location.pathname === `/${username}`
  ) {
    return <Navigate to={`/${detectedProfileType}/${username}`} replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-l-text-1 dark:text-d-text-1 mb-2">
          {username}&apos;s GitHub{' '}
          {detectedProfileType === 'organization' ? 'Organization' : 'Profile'}
        </h1>
        <p className="text-l-text-2 dark:text-d-text-2 text-base md:text-lg">
          View public{' '}
          {detectedProfileType === 'organization' ? 'organization' : 'profile'}{' '}
          information and stats
        </p>
      </div>

      {/* Enhanced Token Input Section - Only show for user profiles where contribution data is relevant */}
      {(detectedProfileType === 'user' || !detectedProfileType) && (
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="text-sm text-accent-1 hover:text-accent-2 flex items-center gap-1 mb-2"
          >
            {showTokenInput ? 'Hide token input' : 'Show token input'}
            <span className="text-xs">(for enhanced data access)</span>
            {!showTokenInput && savedToken && (
              <span className="ml-1 text-xs px-2 py-0.5 bg-accent-success/10 text-accent-success rounded-full">
                Token active
              </span>
            )}
          </button>

          {showTokenInput && (
            <div className="relative bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-4 border border-border-l dark:border-border-d">
              {showSaveMessage && (
                <div className="absolute -top-2 right-4 px-3 py-1 bg-accent-success/10 text-accent-success text-xs rounded-full transform translate-y-0 animate-fade-in-down">
                  {token ? 'Token saved!' : 'Token cleared!'}
                </div>
              )}
              <div className="relative">
                <input
                  type="password"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="GitHub Personal Access Token"
                  className="w-full px-4 py-2 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none"
                />
                {token && (
                  <button
                    type="button"
                    onClick={handleClearToken}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-accent-danger/10 text-accent-danger rounded hover:bg-accent-danger/20"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-xs text-l-text-3 dark:text-d-text-3 mt-2">
                The token enables fetching contribution data. Changes are
                automatically saved after typing. Your token is stored only in
                your browser.
              </p>
            </div>
          )}
        </div>
      )}

      {isUserLoading ? (
        <ProfileSkeleton />
      ) : errorMessage ? (
        <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-8 border border-l-4 border-accent-danger border-l-accent-danger dark:border-l-accent-danger">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-left">
            {/* Error icon */}
            <div className="p-3 bg-accent-danger/10 rounded-full flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-accent-danger"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>

            <div>
              {/* Error heading and message */}
              <h2 className="text-xl font-bold text-accent-danger mb-2">
                Error Finding GitHub Profile
              </h2>
              <p className="text-l-text-2 dark:text-d-text-2 mb-4">
                {errorMessage}
              </p>

              {/* Additional help */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-l-text-1 dark:text-d-text-1 mb-1">
                    What you can try:
                  </h3>
                  <ul className="text-sm text-l-text-2 dark:text-d-text-2 space-y-1 list-disc pl-4">
                    <li>Check if the GitHub username is spelled correctly</li>
                    <li>Verify your internet connection</li>
                    {userError instanceof Error &&
                      userError.message.includes('rate limit') && (
                        <li>
                          Wait a few minutes and try again (GitHub API rate
                          limit exceeded)
                        </li>
                      )}
                    {userError instanceof Error &&
                      userError.message.includes('token') && (
                        <li>
                          Check if your GitHub access token is valid and has the
                          necessary permissions
                        </li>
                      )}
                    <li>Try refreshing the page</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 text-sm bg-accent-1 hover:bg-accent-2 text-white rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                  <a
                    href="/"
                    className="px-4 py-2 text-sm border border-accent-1 text-accent-1 hover:bg-accent-1/10 rounded-lg transition-colors inline-flex items-center"
                  >
                    Return Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : user ? (
        <div className="space-y-6 md:space-y-8">
          <GithubProfileCard user={user} />

          {/* Personalized Summary */}
          <PersonalizedSummary
            user={user}
            repositories={repositories}
            contributionData={contributionData}
            loading={isReposLoading || isContributionLoading}
          />

          {/* Dev Journey Timeline - Only for user profiles */}
          {detectedProfileType === 'user' && (
            <DevJourneyTimeline
              user={user}
              repositories={repositories}
              contributionData={contributionData}
              loading={isReposLoading || isContributionLoading}
            />
          )}

          {/* Coder Persona - Only for user profiles */}
          {detectedProfileType === 'user' && (
            <CoderPersona
              user={user}
              repositories={repositories}
              contributionData={contributionData}
              loading={isReposLoading || isContributionLoading}
            />
          )}

          {/* Dev Card Generator - Only for user profiles */}
          {detectedProfileType === 'user' && (
            <DevCardGenerator
              user={user}
              repositories={repositories}
              languageData={languageData}
              badges={[]}
            />
          )}

          {/* Developer badges - Only for user profiles */}
          {detectedProfileType === 'user' && (
            <DeveloperBadges
              user={user}
              repositories={repositories}
              contributionData={contributionData}
              loading={isReposLoading || isContributionLoading}
            />
          )}

          {/* Most starred repositories - For both users and organizations */}
          <MostStarredRepos
            repositories={repositories}
            loading={isReposLoading}
          />

          {/* Language pie chart - For both users and organizations */}
          {isReposLoading ? (
            <LanguageChartSkeleton />
          ) : (
            <LanguagePieChart data={languageData} loading={isReposLoading} />
          )}

          {/* Contribution heatmap - Only for user profiles */}
          {detectedProfileType === 'user' && username && (
            <ContributionHeatmap
              username={username}
              token={savedToken || undefined}
              userCreatedAt={user?.created_at}
            />
          )}
        </div>
      ) : (
        <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-8 border border-border-l dark:border-border-d">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Profile not found icon */}
            <div className="p-4 bg-accent-danger/10 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-accent-danger"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>

            {/* Clear error heading */}
            <h2 className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              GitHub Profile Not Found
            </h2>

            {/* Informative message */}
            <p className="text-l-text-2 dark:text-d-text-2 max-w-md mx-auto">
              We couldn&apos;t find a GitHub {profileType || 'user'} profile for{' '}
              <span className="font-bold text-accent-1">{username}</span>. This
              could be because:
            </p>

            {/* Reasons for profile not found */}
            <ul className="text-left text-l-text-2 dark:text-d-text-2 space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-accent-danger mt-1">•</span>
                <span>The username is misspelled or doesn&apos;t exist</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-danger mt-1">•</span>
                <span>The profile may have been deleted or renamed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-danger mt-1">•</span>
                <span>GitHub API might be experiencing issues</span>
              </li>
              {profileType && (
                <li className="flex items-start gap-2">
                  <span className="text-accent-danger mt-1">•</span>
                  <span>
                    It might be a{' '}
                    {profileType === 'organization' ? 'user' : 'organization'}{' '}
                    account instead of a{' '}
                    {profileType === 'organization'
                      ? 'an organization'
                      : 'user'}{' '}
                    account
                  </span>
                </li>
              )}
            </ul>

            {/* Search again section */}
            <div className="w-full max-w-md mx-auto pt-4 border-t border-border-l dark:border-border-d">
              <h3 className="text-lg font-semibold text-l-text-1 dark:text-d-text-1 mb-4">
                Try searching for another profile
              </h3>

              <form
                className="flex gap-2"
                onSubmit={e => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const searchUsername = formData.get(
                    'searchUsername'
                  ) as string;
                  if (searchUsername.trim()) {
                    navigate(`/${searchUsername}`);
                  }
                }}
              >
                <input
                  type="text"
                  name="searchUsername"
                  placeholder="Enter GitHub username"
                  className="flex-1 px-4 py-2 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1 border border-border-l dark:border-border-d focus:border-accent-1 focus:ring-1 focus:ring-accent-1 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent-1 hover:bg-accent-2 text-white rounded-lg transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Popular profiles suggestions */}
            <div className="w-full max-w-md mx-auto">
              <h4 className="text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-2">
                Or try one of these popular profiles:
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {['github', 'microsoft', 'facebook', 'google', 'torvalds'].map(
                  suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => navigate(`/${suggestion}`)}
                      className="px-2 py-1 text-xs bg-accent-1/10 hover:bg-accent-1/20 text-accent-1 rounded-md transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Return home link */}
            <div className="pt-4">
              <a
                href="/"
                className="text-accent-1 hover:text-accent-2 transition-colors font-medium"
              >
                Return to Home Page
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
