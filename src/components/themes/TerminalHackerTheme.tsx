import { useState, useEffect } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';
import {
  useUserPullRequests,
  useUserIssues,
} from '../../services/githubService';
import { useGithubToken } from '../../hooks/useStorage';

interface TerminalHackerThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function TerminalHackerTheme({
  user,
  repositories,
  languageData,
}: TerminalHackerThemeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [token] = useGithubToken();

  // Get PR and issue counts using React Query hooks
  const { data: pullRequests = 0 } = useUserPullRequests(user.login, token);
  const { data: issues = 0 } = useUserIssues(user.login, token);

  // Calculate metrics
  const totalStars =
    repositories?.reduce((sum, repo) => sum + repo.stargazers_count, 0) || 0;
  const totalForks =
    repositories?.reduce((sum, repo) => sum + repo.forks_count, 0) || 0;
  const repoCount = repositories?.length || 0;

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter effect for initial text
  useEffect(() => {
    const text = `> Initializing profile scan for ${user.login}...\n> Connecting to GitHub API...\n> Fetching developer data...`;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [user.login]);

  // Format date for display
  const formatDate = (date: string) => {
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <div
      className="w-full max-w-md p-4 sm:p-6 font-mono text-sm rounded-md transform transition-all duration-300"
      style={{
        backgroundColor: '#0C0C0C',
        color: '#22C55E',
        boxShadow: isHovered ? '0 0 20px rgba(34, 197, 94, 0.5)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between mb-4 border-b border-green-600/30 pb-2">
        <div className="flex items-center gap-2">
          <Icons.Terminal className="w-5 h-5" />
          <span className="text-green-500 font-bold">terminal@github:~</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
        </div>
      </div>

      {/* Terminal content */}
      <div className="space-y-4">
        {/* Initial "typing" section */}
        <div className="whitespace-pre-line">{displayText}</div>

        {/* User info section */}
        <div>
          <div className="text-green-300 mb-1">
            {' '}
            User data retrieved successfully:
          </div>
          <div className="bg-green-900/20 p-3 rounded border border-green-600/30">
            <pre className="text-green-400 text-xs sm:text-sm">
              {`{
  "login": "${user.login}",
  "name": "${user.name || 'null'}",
  "created_at": "${formatDate(user.created_at)}",
  "location": "${user.location || 'unknown'}",
  "public_repos": ${repoCount},
  "followers": ${user.followers},
  "email": "${user.email || 'private'}"
}`}
            </pre>
          </div>
        </div>

        {/* Stats section */}
        <div>
          <div className="text-green-300 mb-1"> Development metrics:</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-900/10 border border-green-600/30 p-2 rounded">
              <div className="flex items-center gap-2">
                <Icons.Star className="w-4 h-4 text-yellow-500" />
                <span className="text-green-400">Stars:</span>
                <span className="text-green-200 ml-auto">{totalStars}</span>
              </div>
            </div>
            <div className="bg-green-900/10 border border-green-600/30 p-2 rounded">
              <div className="flex items-center gap-2">
                <Icons.GitBranch className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Forks:</span>
                <span className="text-green-200 ml-auto">{totalForks}</span>
              </div>
            </div>
            <div className="bg-green-900/10 border border-green-600/30 p-2 rounded">
              <div className="flex items-center gap-2">
                <Icons.GitPullRequest className="w-4 h-4 text-blue-400" />
                <span className="text-green-400">PRs:</span>
                <span className="text-green-200 ml-auto">{pullRequests}</span>
              </div>
            </div>
            <div className="bg-green-900/10 border border-green-600/30 p-2 rounded">
              <div className="flex items-center gap-2">
                <Icons.AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-green-400">Issues:</span>
                <span className="text-green-200 ml-auto">{issues}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Languages section */}
        <div>
          <div className="text-green-300 mb-1"> Languages detected:</div>
          <div className="bg-green-900/10 border border-green-600/30 p-2 rounded">
            <div className="grid grid-cols-2 gap-2">
              {languageData.slice(0, 4).map(lang => (
                <div key={lang.name} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-green-400">{lang.name}:</span>
                  <span className="text-green-200 ml-auto">
                    {lang.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final terminal line with cursor */}
        <div className="flex items-center">
          <span className="text-green-500">$ _</span>
          <span
            className={`w-2 h-4 bg-green-500 ml-0.5 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transition: 'opacity 0.1s' }}
          ></span>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-green-600/30 text-green-500/70 text-center text-xs">
          <span className="flex items-center justify-center gap-1">
            <Icons.Terminal className="w-3 h-3" />
            Generated with DevInsight | Connection secure
          </span>
        </div>
      </div>
    </div>
  );
}
