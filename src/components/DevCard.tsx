import { Badge } from './DevCardGenerator';
import DefaultTheme from './themes/DefaultTheme';
import MinimalTheme from './themes/MinimalTheme';
import GradientTheme from './themes/GradientTheme';
import GithubTheme from './themes/GithubTheme';
import PastelGardenTheme from './themes/PastelGardenTheme';
import TerminalHackerTheme from './themes/TerminalHackerTheme';
import CyberpunkTheme from './themes/CyberpunkTheme';
import RetroArcadeTheme from './themes/RetroArcadeTheme';
import GalaxySpaceTheme from './themes/GalaxySpaceTheme';
import MatrixRainTheme from './themes/MatrixRainTheme';
import ProductHuntTheme from './themes/ProductHuntTheme';
import MonochromeBusinessTheme from './themes/MonochromeBusinessTheme';
import BlueprintTheme from './themes/BlueprintTheme';

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
    | 'cyberpunk'
    | 'retro-arcade'
    | 'galaxy-space'
    | 'matrix-rain'
    | 'producthunt'
    | 'monochrome-business'
    | 'blueprint';
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

    case 'retro-arcade':
      return (
        <RetroArcadeTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );

    case 'galaxy-space':
      return (
        <GalaxySpaceTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );

    case 'matrix-rain':
      return (
        <MatrixRainTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );

    case 'producthunt':
      return (
        <ProductHuntTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );

    case 'monochrome-business':
      return (
        <MonochromeBusinessTheme
          user={user}
          repositories={repositories}
          languageData={languageData}
          badges={badges}
        />
      );

    case 'blueprint':
      return (
        <BlueprintTheme
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
