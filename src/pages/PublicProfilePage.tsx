import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  aggregateLanguageData,
  useBatchUserData,
} from '../services/githubService';
import { useGithubToken } from '../hooks/useStorage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import GitHubTokenSection from '../components/shared/GitHubTokenSection';
import GithubProfileCard from '../components/GithubProfileCard';
import LanguagePieChart from '../components/LanguagePieChart';
import ContributionHeatmap from '../components/ContributionHeatmap';
import MostStarredRepos from '../components/MostStarredRepos';
import DeveloperBadges from '../components/DeveloperBadges';
import PersonalizedSummary from '../components/PersonalizedSummary';
import { useContributionData } from '../services/githubGraphQLService';
import DevCardGenerator from '../components/DevCardGenerator';
import CoderPersona from '../components/CoderPersona';
import DevJourneyTimeline from '../components/DevJourneyTimeline';
import ProfileErrorState from '../components/ProfileErrorState';

// Import all skeleton components
import GithubProfileCardSkeleton from '../components/shared/Skeletons/GithubProfileCardSkeleton';
import PersonalizedSummarySkeleton from '../components/shared/Skeletons/PersonalizedSummarySkeleton';
import DevJourneyTimelineSkeleton from '../components/shared/Skeletons/DevJourneyTimelineSkeleton';
import CoderPersonaSkeleton from '../components/shared/Skeletons/CoderPersonaSkeleton';
import DeveloperBadgesSkeleton from '../components/shared/Skeletons/DeveloperBadgesSkeleton';
import MostStarredReposSkeleton from '../components/shared/Skeletons/MostStarredReposSkeleton';
import LanguagePieChartSkeleton from '../components/shared/Skeletons/LanguagePieChartSkeleton';
import ContributionHeatmapPageSkeleton from '../components/shared/Skeletons/ContributionHeatmapPageSkeleton';
import { useBadges } from '../hooks/useBadgeFunctions';

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

  // Replace token storage with useGithubToken hook
  const [token, setToken, removeToken] = useGithubToken();
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // Add state for detected profile type
  const [detectedProfileType, setDetectedProfileType] = useState<
    'user' | 'organization' | null
  >(profileType || null);

  // Use batch data fetching instead of separate requests
  const {
    data: batchData,
    isLoading: isBatchLoading,
    error: batchError,
    isError: isBatchError,
  } = useBatchUserData(username, token || undefined);

  // For backwards compatibility, keep these variables but derive them from batch data
  const user = batchData?.userData;
  const repositories = batchData?.repositories;
  const isUserLoading = isBatchLoading;
  const isReposLoading = isBatchLoading;
  const userError = batchError;
  const isUserError = isBatchError;

  const { data: contributionData, isLoading: isContributionLoading } =
    useContributionData(username, token || undefined);

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
    ? `${username}'s GitHub ${detectedProfileType === 'organization' ? 'Organization' : 'Profile'}`
    : 'GitHub Profile Explorer';

  // Use the document title hook with custom format to avoid double-formatting
  useDocumentTitle(pageTitle, { format: 'custom' });

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
    // Update meta tags (skip title setting as it's now handled by useDocumentTitle)
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

  // Handle token saving with feedback
  const handleTokenChange = async (newToken: string) => {
    try {
      await setToken(newToken.trim());
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  // Handle token clearing
  const handleClearToken = async () => {
    try {
      removeToken();
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  };

  // If we're on the legacy route and have detected the profile type, redirect
  if (
    !profileType &&
    detectedProfileType &&
    window.location.pathname === `/${username}`
  ) {
    return <Navigate to={`/${detectedProfileType}/${username}`} replace />;
  }

  // Calculate badges for the user if they're not an organization
  const badges = useBadges(
    user && user.type !== 'Organization' ? user : null,
    repositories,
    contributionData
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <GitHubTokenSection
            token={token}
            onTokenChange={handleTokenChange}
            onTokenClear={handleClearToken}
            showTokenSaved={showSaveMessage}
          />
        </div>
      )}

      {isUserLoading ? (
        // Show all skeleton components during loading
        <div className="space-y-6 md:space-y-8">
          <GithubProfileCardSkeleton />

          {/* Personalized Summary Skeleton */}
          <PersonalizedSummarySkeleton />

          {/* Dev Journey Timeline Skeleton - Only for user profiles */}
          <DevJourneyTimelineSkeleton />

          {/* Coder Persona Skeleton - Only for user profiles */}
          <CoderPersonaSkeleton />

          {/* Developer Badges Skeleton - Only for user profiles */}
          <DeveloperBadgesSkeleton />

          {/* Most Starred Repos Skeleton */}
          <MostStarredReposSkeleton />

          {/* Language Chart Skeleton */}
          <LanguagePieChartSkeleton />

          {/* Contribution Heatmap Skeleton - Only for user profiles */}
          <ContributionHeatmapPageSkeleton />
        </div>
      ) : isUserError || !user ? (
        <ProfileErrorState
          username={username}
          profileType={profileType}
          errorType={isUserError ? 'error' : 'not_found'}
          errorMessage={errorMessage || undefined}
        />
      ) : (
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
              badges={badges}
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
          <LanguagePieChart data={languageData} loading={isReposLoading} />

          {/* Contribution heatmap - Only for user profiles */}
          {detectedProfileType === 'user' && username && (
            <ContributionHeatmap
              username={username}
              token={token || undefined}
              userCreatedAt={user?.created_at}
            />
          )}
        </div>
      )}
    </div>
  );
}
