import { useParams } from 'react-router-dom';
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

export default function PublicProfilePage() {
  // Get username from URL params
  const { username = '' } = useParams<{ username: string }>();

  // Add token state and UI controls
  const [token, setToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const tokenTimeoutRef = useRef<number | null>(null);

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

  // Generate page URL and description
  const pageUrl = `${window.location.origin}/profile/${username}`;
  const pageTitle = username
    ? `${username}'s GitHub Profile | DevInsight`
    : 'DevInsight';
  const pageDescription = `View ${username}'s GitHub profile data, repositories, contributions, and programming language analytics on DevInsight`;

  // Create JSON-LD structured data
  const structuredData: StructuredData | null = user
    ? {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: pageTitle,
        description: pageDescription,
        mainEntity: {
          '@type': 'Person',
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

    // Update Twitter card metadata
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
    updateOgMetaTag('type', 'profile');
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
  }, [username, user, pageTitle, pageDescription, pageUrl, structuredData]);

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-l-text-1 dark:text-d-text-1 mb-2">
          {username}&apos;s GitHub Profile
        </h1>
        <p className="text-l-text-2 dark:text-d-text-2 text-base md:text-lg">
          View public profile information and stats
        </p>
      </div>

      {/* Enhanced Token Input Section */}
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

      {isUserLoading ? (
        <ProfileSkeleton />
      ) : errorMessage ? (
        <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-4 rounded">
          <p className="text-accent-danger">{errorMessage}</p>
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

          {/* Dev Card Generator */}
          <DevCardGenerator
            user={user}
            repositories={repositories}
            languageData={languageData}
            badges={[]}
          />

          {/* Developer badges */}
          <DeveloperBadges
            user={user}
            repositories={repositories}
            contributionData={contributionData}
            loading={isReposLoading || isContributionLoading}
          />

          {/* Most starred repositories */}
          <MostStarredRepos
            repositories={repositories}
            loading={isReposLoading}
          />

          {/* Language pie chart */}
          {isReposLoading ? (
            <LanguageChartSkeleton />
          ) : (
            <LanguagePieChart data={languageData} loading={isReposLoading} />
          )}

          {/* Contribution heatmap */}
          {username && (
            <ContributionHeatmap
              username={username}
              token={savedToken || undefined}
            />
          )}
        </div>
      ) : (
        <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d text-center">
          <p className="text-l-text-2 dark:text-d-text-2">Profile not found</p>
        </div>
      )}
    </div>
  );
}
