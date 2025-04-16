import { useQuery } from '@tanstack/react-query';

export const fetchGithubUser = async (
  username: string
): Promise<GithubUser> => {
  if (!username.trim()) {
    throw new Error('Username cannot be empty');
  }

  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    if (response.status === 403) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    throw new Error('Failed to fetch user data');
  }

  const userData = await response.json();
  console.warn('GitHub User API Response:', userData);
  return userData;
};

export const useGithubUser = (username: string) => {
  return useQuery({
    queryKey: ['githubUser', username],
    queryFn: () => fetchGithubUser(username),
    enabled: !!username.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const fetchUserRepositories = async (
  username: string
): Promise<Repository[]> => {
  if (!username.trim()) {
    throw new Error('Username cannot be empty');
  }

  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    if (response.status === 403) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    throw new Error('Failed to fetch repositories');
  }

  const reposData = await response.json();
  console.warn('GitHub Repositories API Response:', reposData);
  return reposData;
};

export const useUserRepositories = (username: string) => {
  return useQuery({
    queryKey: ['userRepos', username],
    queryFn: () => fetchUserRepositories(username),
    enabled: !!username.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const aggregateLanguageData = (repos: Repository[]): LanguageData[] => {
  const languageCount: Record<string, number> = {};
  let totalCount = 0;

  repos.forEach(repo => {
    if (repo.language && repo.language !== 'null') {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      totalCount += 1;
    }
  });

  const languageColors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Go: '#00ADD8',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Rust: '#dea584',
    Dart: '#00B4AB',
    Shell: '#89e051',
    Scala: '#c22d40',
    'Objective-C': '#438eff',
    R: '#198ce7',
  };

  return Object.entries(languageCount)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / totalCount) * 100),
      color:
        languageColors[name] ||
        `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Saves GitHub API response data as a downloadable JSON file
 */
export function saveResponseAsJson(
  data: object,
  filename = 'github-data.json'
): void {
  // Create a Blob with the JSON data
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a download link
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = filename;

  // Append to the document, trigger click, and remove
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  // Clean up the URL object
  URL.revokeObjectURL(url);

  console.warn(`Data saved as ${filename}`);
}

/**
 * Helper function to save user data to a file
 */
export function saveUserData(userData: GithubUser): void {
  saveResponseAsJson(userData, `${userData.login}-user-data.json`);
}

/**
 * Helper function to save repositories data to a file
 */
export function saveRepositoriesData(
  username: string,
  repositories: Repository[]
): void {
  saveResponseAsJson(repositories, `${username}-repositories.json`);
}

/**
 * Helper function to save all GitHub data to files
 */
export function saveAllGithubData(
  userData: GithubUser,
  repositories: Repository[]
): void {
  saveUserData(userData);
  saveRepositoriesData(userData.login, repositories);
}
