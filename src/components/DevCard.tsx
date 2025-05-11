import { Badge } from './DevCardGenerator';
import DefaultTheme from './themes/DefaultTheme';
import MinimalTheme from './themes/MinimalTheme';
import GradientTheme from './themes/GradientTheme';
import GithubTheme from './themes/GithubTheme';
import PastelGardenTheme from './themes/PastelGardenTheme';
import TerminalHackerTheme from './themes/TerminalHackerTheme';
import CyberpunkTheme from './themes/CyberpunkTheme';

interface DevCardProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
  theme:
    | 'default'
    | 'minimal'
    | 'gradient'
    | 'github'
    | 'pastel'
    | 'terminal-hacker'
    | 'cyberpunk';
}

export default function DevCard({
  user,
  repositories,
  languageData,
  badges,
  theme,
}: DevCardProps) {
  // Render appropriate theme based on theme prop
  switch (theme) {
    case 'minimal':
      return (
        <MinimalTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );

    case 'gradient':
      return (
        <GradientTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );

    case 'github':
      return (
        <GithubTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );

    case 'pastel':
      return (
        <PastelGardenTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );

    case 'terminal-hacker':
      return (
        <TerminalHackerTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );

    case 'cyberpunk':
      return (
        <CyberpunkTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );

    default:
      return (
        <DefaultTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );
  }
}
