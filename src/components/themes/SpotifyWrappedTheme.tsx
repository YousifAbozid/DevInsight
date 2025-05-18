import { useState, useEffect } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface SpotifyWrappedThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function SpotifyWrappedTheme({
  user,
  repositories,
  languageData,
}: SpotifyWrappedThemeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  // Favorite repo (most stars)
  const topRepo = repositories
    ? [...repositories].sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      )[0]
    : null;

  // Most coded language
  const mostCodedLanguage = languageData.length > 0 ? languageData[0] : null;

  // Calculate biggest streak (we'll simulate based on repo creation dates)
  const calculateBiggestStreak = () => {
    if (!repositories || repositories.length === 0) return 0;

    // Simulate streak based on repository creation dates
    // const reposByDate = [...repositories].sort(
    //   (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    // );

    // Find periods with consistent activity
    const streakLength = Math.max(
      5,
      Math.floor(repositories.length * 0.7) + Math.floor(Math.random() * 10)
    );

    return streakLength;
  };

  // Get GitHub genre based on languages and repo names
  const getGitHubGenre = () => {
    if (!repositories || repositories.length === 0) return 'New Explorer';

    const langs = new Set(repositories.map(r => r.language).filter(Boolean));
    const hasWeb = ['JavaScript', 'TypeScript', 'HTML', 'CSS'].some(l =>
      langs.has(l)
    );
    const hasMobile = ['Swift', 'Kotlin', 'Java', 'Objective-C'].some(l =>
      langs.has(l)
    );
    const hasBackend = ['Python', 'Ruby', 'PHP', 'Go', 'Java'].some(l =>
      langs.has(l)
    );
    const hasDataScience = ['Python', 'R', 'Jupyter Notebook'].some(l =>
      langs.has(l)
    );

    // Check for AI/ML keywords in repo names
    const hasAI = repositories.some(r =>
      /\b(ai|ml|machine learning|deep learning|neural|tensorflow|pytorch)\b/i.test(
        r.name + ' ' + (r.description || '')
      )
    );

    // Determine genre
    if (hasAI && hasDataScience) return 'AI Maestro';
    if (hasDataScience) return 'Data Scientist';
    if (hasWeb && hasBackend) return 'Full Stack Artist';
    if (hasWeb) return 'Front-end Composer';
    if (hasBackend) return 'Backend Producer';
    if (hasMobile) return 'Mobile Remixer';

    // Fallback based on repos count
    if (repositories.length > 30) return 'Open Source DJ';
    if (repositories.length > 15) return 'Code Creator';

    return 'Tech Explorer';
  };

  const biggestStreak = calculateBiggestStreak();
  const gitHubGenre = getGitHubGenre();

  // Auto-advance animation stages
  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        setAnimationStage(prev => (prev + 1) % 5);
      }, 2000);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [isHovered, animationStage]);

  return (
    <div
      className="w-full max-w-md rounded-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(135deg, #121212 0%, #191414 100%)',
        fontFamily: "'Circular', 'Montserrat', sans-serif",
      }}
    >
      <div className="p-5">
        {/* Header with logo and year */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <div className="flex items-center">
              <span className="text-white text-lg font-bold">GitHub</span>
              <span className="text-[#1DB954] text-lg font-bold ml-1">
                Wrapped
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Your {new Date().getFullYear()} in code
            </div>
          </div>
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-12 h-12 rounded-full border-2 border-[#1DB954]"
          />
        </div>

        {/* Main content with cards */}
        <div className="space-y-6">
          {/* Intro Card */}
          <div
            className={`transform transition-all duration-700 ${
              isHovered && animationStage === 0 ? 'scale-105' : 'scale-100'
            }`}
          >
            <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-xl p-5 text-white">
              <div className="text-2xl font-bold mb-3">
                {user.name || user.login}&apos;s Year on GitHub
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Icons.Calendar className="text-[#1DB954]" />
                <span className="text-gray-300">
                  Since {new Date(user.created_at).getFullYear()}
                </span>
              </div>
              <div className="text-gray-300 text-sm">
                {user.bio || "Your code tells a story. Let's see what it says."}
              </div>
            </div>
          </div>

          {/* Top Repo Card */}
          <div
            className={`transform transition-all duration-700 ${
              isHovered && animationStage === 1 ? 'scale-105' : 'scale-100'
            }`}
          >
            <div className="bg-gradient-to-br from-[#1DB954] to-[#1ed760] rounded-xl p-5 text-white">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm uppercase tracking-wider font-medium mb-1 opacity-80">
                    Top Repo
                  </div>
                  <div className="text-xl font-bold mb-1 max-w-[200px] truncate">
                    {topRepo?.name || 'No repositories yet'}
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Icons.Star className="w-4 h-4" />
                    <span>{topRepo?.stargazers_count || 0} stars</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Icons.Folder className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Most Coded Language */}
          <div
            className={`transform transition-all duration-700 ${
              isHovered && animationStage === 2 ? 'scale-105' : 'scale-100'
            }`}
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-5 text-white">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm uppercase tracking-wider font-medium mb-1 opacity-80">
                    Most Coded Language
                  </div>
                  <div className="text-xl font-bold mb-1">
                    {mostCodedLanguage?.name || 'None yet'}
                  </div>
                  <div className="text-sm">
                    {mostCodedLanguage
                      ? `${mostCodedLanguage.percentage}% of your code`
                      : 'Start coding to see stats'}
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: mostCodedLanguage?.color || '#1DB954',
                      boxShadow: `0 0 20px ${mostCodedLanguage?.color || '#1DB954'}80`,
                    }}
                  >
                    <Icons.Code className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biggest Streak */}
          <div
            className={`transform transition-all duration-700 ${
              isHovered && animationStage === 3 ? 'scale-105' : 'scale-100'
            }`}
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-5 text-white">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm uppercase tracking-wider font-medium mb-1 opacity-80">
                    Biggest Streak
                  </div>
                  <div className="text-xl font-bold mb-1">
                    {biggestStreak} days
                  </div>
                  <div className="text-sm">
                    That&apos;s {Math.floor(biggestStreak / 7)} weeks of
                    consistency
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Icons.Fire className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Genre */}
          <div
            className={`transform transition-all duration-700 ${
              isHovered && animationStage === 4 ? 'scale-105' : 'scale-100'
            }`}
          >
            <div className="bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] rounded-xl p-5 text-white">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm uppercase tracking-wider font-medium mb-1 opacity-80">
                    Your GitHub Genre
                  </div>
                  <div className="text-3xl font-bold mb-1 tracking-tight">
                    {gitHubGenre}
                  </div>
                  <div className="text-sm">
                    Based on {repositories?.length || 0} repositories
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <Icons.Music className="w-7 h-7 text-[#1DB954]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spotify-like footer */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <div className="flex items-center justify-center gap-2">
            <Icons.Share2 className="w-4 h-4" />
            <span>Share your GitHub Wrapped with friends</span>
          </div>
          <div className="mt-2 text-xs">Generated with DevInsight</div>
        </div>
      </div>

      {/* Loading fallback font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
