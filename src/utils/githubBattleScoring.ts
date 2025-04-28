import { ContributionData } from '../services/githubGraphQLService';

interface BattleUserData {
  user: GithubUser;
  repositories: Repository[];
  contributionData?: ContributionData;
}

export interface ScoreDetails {
  totalScore: number;
  metrics: {
    stars: number;
    repos: number;
    commits: number;
    followers: number;
    experience: number;
    forks: number;
    languages: number;
    quality: number;
    prs: number;
    activity: number; // For organization activity
  };
}

/**
 * Calculate GitHub battle score for a user or organization
 * @param userData User or organization data including repositories and contributions
 * @returns Score details with total score and individual metrics
 */
export function calculateScore(userData: BattleUserData): ScoreDetails {
  const { user, repositories, contributionData } = userData;

  // Determine if this is an organization
  const isOrg = user.type === 'Organization';

  // Calculate base metrics common to both users and organizations
  const totalStars = repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const totalForks = repositories.reduce(
    (sum, repo) => sum + repo.forks_count,
    0
  );

  // Calculate metrics appropriate for the entity type
  if (isOrg) {
    // Organization-specific scoring
    const repoScore = Math.min(user.public_repos * 5, 300); // Max 300 points
    const starsScore = Math.min(totalStars * 2, 400); // Max 400 points
    const forksScore = Math.min(totalForks * 4, 250); // Max 250 points

    // Organization age score (similar to user experience)
    const creationDate = new Date(user.created_at);
    const now = new Date();
    const ageInMonths =
      (now.getFullYear() - creationDate.getFullYear()) * 12 +
      (now.getMonth() - creationDate.getMonth());
    const ageScore = Math.min(ageInMonths * 2, 100); // Max 100 points

    // Repository quality (descriptions, READMEs, etc)
    const reposWithDescriptions = repositories.filter(
      repo => repo.description && repo.description.length > 20
    ).length;
    const qualityScore = Math.min(
      Math.round(
        (reposWithDescriptions / Math.max(1, repositories.length)) * 150
      ),
      150
    );

    // Language diversity
    const uniqueLanguages = new Set(
      repositories.map(repo => repo.language).filter(Boolean)
    ).size;
    const languageScore = Math.min(uniqueLanguages * 10, 100); // Max 100 points

    // Calculate activity score based on recent updates
    const recentlyUpdatedRepos = repositories.filter(repo => {
      const updatedAt = new Date(repo.updated_at);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return updatedAt > threeMonthsAgo;
    }).length;
    const activityScore = Math.min(recentlyUpdatedRepos * 10, 200); // Max 200 points

    return {
      totalScore:
        repoScore +
        starsScore +
        forksScore +
        ageScore +
        qualityScore +
        languageScore +
        activityScore,
      metrics: {
        repos: repoScore,
        stars: starsScore,
        commits: 0, // Organizations don't have direct commits
        followers: 0, // Organizations don't have followers
        experience: ageScore,
        forks: forksScore,
        languages: languageScore,
        quality: qualityScore,
        prs: 0, // Organizations don't have direct PRs
        activity: activityScore, // New metric for organizations
      },
    };
  } else {
    // User scoring logic
    // Calculate account age in days
    const accountAgeInDays = Math.floor(
      (new Date().getTime() - new Date(user.created_at).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Calculate experience based on account age (1 point per month, max 60)
    const experiencePoints = Math.min(Math.floor(accountAgeInDays / 30), 60);

    // Calculate stars (3 points per star, max 300)
    const starPoints = Math.min(totalStars * 3, 300);

    // Calculate repositories (5 points per repo, max 250)
    const repoPoints = Math.min(user.public_repos * 5, 250);

    // Calculate followers (2 points per follower, max 200)
    const followerPoints = Math.min(user.followers * 2, 200);

    // Calculate commits from contribution data (0.5 points per commit, max 300)
    const totalCommits = contributionData?.totalContributions || 0;
    const commitPoints = Math.min(Math.floor(totalCommits * 0.5), 300);

    // Calculate forks (4 points per fork, max 200)
    const forkPoints = Math.min(totalForks * 4, 200);

    // Calculate language diversity (10 points per language, max 100)
    const languages = new Set(
      repositories.map(repo => repo.language).filter(Boolean)
    );
    const languagePoints = Math.min(languages.size * 10, 100);

    // Calculate project quality (non-forked repos with stars > 0, 15 points each, max 150)
    const qualityProjects = repositories.filter(
      repo => !repo.fork && repo.stargazers_count > 0
    ).length;
    const qualityPoints = Math.min(qualityProjects * 15, 150);

    // Calculate contribution quality (PRs and issues can be estimated from contribution data)
    // Since we don't have direct PR data, we'll estimate based on commits (10% of commit points)
    const prPoints = Math.floor(commitPoints * 0.1);

    // Calculate activity score for users (similar to organizations)
    const recentlyUpdatedRepos = repositories.filter(repo => {
      const updatedAt = new Date(repo.updated_at);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return updatedAt > threeMonthsAgo;
    }).length;
    const activityPoints = Math.min(recentlyUpdatedRepos * 10, 200);

    // Calculate total score
    const totalScore =
      starPoints +
      repoPoints +
      followerPoints +
      commitPoints +
      experiencePoints +
      forkPoints +
      languagePoints +
      qualityPoints +
      prPoints +
      activityPoints;

    return {
      totalScore,
      metrics: {
        stars: starPoints,
        repos: repoPoints,
        commits: commitPoints,
        followers: followerPoints,
        experience: experiencePoints,
        forks: forkPoints,
        languages: languagePoints,
        quality: qualityPoints,
        prs: prPoints,
        activity: activityPoints,
      },
    };
  }
}

/**
 * Calculate the maximum possible score based on entity type
 * @param isOrg Whether the entity is an organization
 * @returns Maximum possible score
 */
export function getMaxPossibleScore(isOrg: boolean): number {
  if (isOrg) {
    return 300 + 400 + 250 + 100 + 150 + 100 + 200; // 1500 points
  } else {
    return 300 + 250 + 200 + 300 + 60 + 200 + 100 + 150 + 30; // 1590 points
  }
}

/**
 * Get the scoring formula and max points for each metric based on entity type
 */
export function getScoringMetrics(isOrg: boolean): Array<{
  id: string;
  title: string;
  formula: string;
  maxPoints: number;
  description: string;
}> {
  const commonMetrics = [
    {
      id: 'languages',
      title: 'Languages',
      formula: '10 points per language',
      maxPoints: 100,
      description:
        'Language diversity showcases versatility and technical breadth across different programming languages.',
    },
    {
      id: 'quality',
      title: 'Quality',
      formula: '15 points per quality project',
      maxPoints: 150,
      description:
        'Quality projects (non-forked repositories with at least one star) demonstrate recognized original work.',
    },
    {
      id: 'forks',
      title: 'Forks',
      formula: '4 points per fork',
      maxPoints: isOrg ? 250 : 200,
      description: `Repository forks demonstrate the usefulness and reusability of ${isOrg ? 'an organization' : 'a developer'}'s code.`,
    },
  ];

  if (isOrg) {
    return [
      {
        id: 'repos',
        title: 'Repositories',
        formula: '5 points per repository',
        maxPoints: 300,
        description:
          "Public repositories demonstrate an organization's ability to create and manage code projects.",
      },
      {
        id: 'stars',
        title: 'Stars',
        formula: '2 points per star',
        maxPoints: 400,
        description:
          'Stars represent community recognition and the value of contributions.',
      },
      {
        id: 'experience',
        title: 'Experience',
        formula: '2 points per month',
        maxPoints: 100,
        description:
          'Organization age reflects experience and longevity in the development community.',
      },
      {
        id: 'activity',
        title: 'Recent Activity',
        formula: '10 points per recently updated repo',
        maxPoints: 200,
        description:
          "Measures how actively maintained the organization's repositories are in the last 3 months.",
      },
      ...commonMetrics,
    ];
  } else {
    return [
      {
        id: 'repos',
        title: 'Repositories',
        formula: '5 points per repository',
        maxPoints: 250,
        description:
          "Public repositories demonstrate a developer's ability to create and manage code projects.",
      },
      {
        id: 'stars',
        title: 'Stars',
        formula: '3 points per star',
        maxPoints: 300,
        description:
          "Stars represent community recognition and the value of a developer's contributions.",
      },
      {
        id: 'commits',
        title: 'Commits',
        formula: '0.5 points per commit',
        maxPoints: 300,
        description:
          'Commits reflect active contribution frequency and ongoing development activity.',
      },
      {
        id: 'followers',
        title: 'Followers',
        formula: '2 points per follower',
        maxPoints: 200,
        description:
          "Followers indicate a developer's influence and reputation in the GitHub community.",
      },
      {
        id: 'experience',
        title: 'Experience',
        formula: '1 point per month',
        maxPoints: 60,
        description:
          "Account age reflects a developer's experience and longevity in the development community.",
      },
      {
        id: 'prs',
        title: 'Pull Requests',
        formula: 'Estimated as 10% of commit points',
        maxPoints: 30,
        description:
          'Pull requests demonstrate collaborative coding and contributions to other projects.',
      },
      ...commonMetrics,
    ];
  }
}
