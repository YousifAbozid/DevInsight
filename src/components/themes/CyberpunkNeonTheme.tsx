import { useState } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface CyberpunkNeonThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function CyberpunkNeonTheme({
  user,
  repositories,
  languageData,
}: CyberpunkNeonThemeProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get top languages
  const topLanguages = languageData.slice(0, 5);

  // Find most starred repo
  const mostStarredRepo = repositories?.length
    ? repositories.reduce((prev, current) =>
        prev.stargazers_count > current.stargazers_count ? prev : current
      )
    : null;

  // Language icons mapping (simplified)
  const getLanguageIcon = (language: string) => {
    const iconMap: Record<string, React.ElementType> = {
      JavaScript: Icons.JavaScript,
      TypeScript: Icons.TypeScript,
      Python: Icons.Python,
      Java: Icons.Java,
      Ruby: Icons.Ruby,
      HTML: Icons.Html,
      CSS: Icons.Css,
      PHP: Icons.Php,
      Go: Icons.Go,
      C: Icons.C,
      'C++': Icons.CPlusPlus,
      'C#': Icons.CSharp,
      Rust: Icons.Rust,
    };

    return iconMap[language] || Icons.Code;
  };

  return (
    <div
      className={`relative p-6 w-full max-w-md text-white rounded-lg border-2 transition-all duration-500 ${
        isHovered
          ? 'shadow-[0_0_15px_5px_rgba(136,58,234,0.5)] border-[#FF2AAA]'
          : 'shadow-lg border-[#8338EC]'
      }`}
      style={{
        background: 'linear-gradient(125deg, #1E0533 0%, #120224 100%)',
        boxShadow: isHovered
          ? '0 0 15px 5px rgba(136, 58, 234, 0.5), inset 0 0 10px 1px rgba(136, 58, 234, 0.2)'
          : 'inset 0 0 5px 1px rgba(136, 58, 234, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top-right decorative elements */}
      <div className="absolute -top-2 -right-2 w-20 h-20 overflow-hidden opacity-60">
        <div className="absolute top-7 left-0 w-full h-[1px] bg-[#FF2AAA] rotate-45"></div>
        <div className="absolute top-9 left-0 w-full h-[1px] bg-[#3AECF9] rotate-45"></div>
        <div className="absolute top-11 left-0 w-full h-[1px] bg-[#8338EC] rotate-45"></div>
      </div>

      {/* Bottom-left decorative elements */}
      <div className="absolute -bottom-2 -left-2 w-20 h-20 overflow-hidden opacity-60">
        <div className="absolute bottom-7 right-0 w-full h-[1px] bg-[#FF2AAA] rotate-45"></div>
        <div className="absolute bottom-9 right-0 w-full h-[1px] bg-[#3AECF9] rotate-45"></div>
        <div className="absolute bottom-11 right-0 w-full h-[1px] bg-[#8338EC] rotate-45"></div>
      </div>

      {/* Profile section */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="relative">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${isHovered ? 'blur-lg bg-[#FF2AAA]/30' : 'blur-md bg-[#8338EC]/20'}`}
          ></div>
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-20 h-20 rounded-full border-2 border-[#FF2AAA] relative z-10"
          />
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF2AAA] to-[#3AECF9]">
            {user.name || user.login}
          </h2>
          <p className="text-[#B7A8E2] flex items-center justify-center sm:justify-start gap-1.5">
            <Icons.GitHub className="w-4 h-4 text-[#3AECF9]" />@{user.login}
          </p>

          {user.bio && (
            <p className="mt-2 text-sm text-[#D3C9F5] line-clamp-2 bg-black/20 p-2 rounded border border-[#8338EC]/30">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Most starred repo section */}
      {mostStarredRepo && (
        <div className="mt-5 bg-black/30 p-3 rounded-lg border border-[#3AECF9]/30">
          <h3 className="text-sm font-bold flex items-center gap-2 text-[#3AECF9]">
            <Icons.Star className="w-4 h-4 text-yellow-300" />
            <span>TOP REPO</span>
          </h3>

          <div className="mt-2">
            <div className="font-bold text-white">{mostStarredRepo.name}</div>

            <div className="flex justify-between items-center mt-1 text-sm">
              <div className="flex items-center gap-2 text-[#D3C9F5]">
                <span className="flex items-center gap-1">
                  <Icons.Star className="w-3.5 h-3.5 text-yellow-300" />
                  {mostStarredRepo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <Icons.Network className="w-3.5 h-3.5 text-[#B7A8E2]" />
                  {mostStarredRepo.forks_count}
                </span>
              </div>

              <div className="text-xs text-[#B7A8E2]/70">
                {mostStarredRepo.language || 'No language'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Languages section */}
      <div className="mt-4">
        <h3 className="text-sm font-bold flex items-center gap-2 text-[#FF2AAA] mb-2">
          <Icons.Terminal className="w-4 h-4" />
          <span>CODE MASTERY</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {topLanguages.map(lang => {
            const LangIcon = getLanguageIcon(lang.name);
            return (
              <div
                key={lang.name}
                className="flex items-center gap-2 p-2 bg-black/30 rounded border border-[#8338EC]/30 hover:border-[#FF2AAA]/50 transition-colors"
              >
                <div className="p-1.5 rounded-full bg-[#1A073D]">
                  <LangIcon className="w-4 h-4" style={{ color: lang.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {lang.name}
                  </div>
                  <div className="w-full bg-[#1A073D] rounded-full h-1.5 mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-[#3AECF9] font-mono">
                  {lang.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[#8338EC]/30 text-xs text-center text-[#B7A8E2]/70">
        <div className="flex items-center justify-center gap-1.5">
          <Icons.GitHub className="w-3.5 h-3.5 text-[#B7A8E2]" />
          <span>Generated with DevInsight</span>
        </div>
      </div>
    </div>
  );
}
