import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
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
    useContributionData(username);

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
          {username && <ContributionHeatmap username={username} />}
        </div>
      ) : (
        <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d text-center">
          <p className="text-l-text-2 dark:text-d-text-2">Profile not found</p>
        </div>
      )}
    </div>
  );
}
