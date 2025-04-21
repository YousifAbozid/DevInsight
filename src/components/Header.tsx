import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Icons } from './shared/Icons';

export default function Header() {
  // Get current location to determine active route
  const location = useLocation();
  const currentPath = location.pathname;

  // Helper function to check if a route is active
  const isActive = (path: string) => {
    // For home route
    if (path === '/' && currentPath === '/') {
      return true;
    }
    // For battle route, check if current path starts with /battle
    if (path === '/battle' && currentPath.startsWith('/battle')) {
      return true;
    }
    // For other routes, do exact match
    return currentPath === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-l-bg-1/95 dark:bg-d-bg-1/95 backdrop-blur-sm transition-all duration-300 border-b border-border-l dark:border-border-d py-3 px-4 md:px-8 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          {/* Navigation - Centered */}
          <nav className="flex items-center gap-2 md:gap-3">
            {/* Home Link - Shown on all screen sizes, styled like other nav items */}
            <Link
              to="/"
              className={`p-2 md:px-3 md:py-1.5 flex items-center justify-center gap-1.5 group rounded-md relative overflow-hidden ${isActive('/') ? 'border-accent-1' : 'border border-border-l dark:border-border-d'}`}
              aria-label="Home"
            >
              <span
                className={`absolute inset-0 bg-accent-1 transition-transform duration-300 ease-out ${isActive('/') ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}
              ></span>
              <Icons.Home
                className={`w-4 h-4 z-10 ${isActive('/') ? 'text-white' : 'text-accent-1 group-hover:text-white'} transition-colors duration-200`}
              />
              <span
                className={`hidden md:block text-sm font-medium z-10 ${isActive('/') ? 'text-white' : 'text-l-text-2 dark:text-d-text-2 group-hover:text-white'} transition-colors duration-200`}
              >
                Home
              </span>
            </Link>

            {/* Personas Link with filling effect */}
            <Link
              to="/personas"
              className={`p-2 md:px-3 md:py-1.5 flex items-center justify-center gap-1.5 group rounded-md relative overflow-hidden ${isActive('/personas') ? 'border-accent-1' : 'border border-border-l dark:border-border-d'}`}
              aria-label="Coder Personas"
            >
              <span
                className={`absolute inset-0 bg-accent-1 transition-transform duration-300 ease-out ${isActive('/personas') ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}
              ></span>
              <Icons.Users
                className={`w-4 h-4 z-10 ${isActive('/personas') ? 'text-white' : 'text-accent-1 group-hover:text-white'} transition-colors duration-200`}
              />
              <span
                className={`hidden md:block text-sm font-medium z-10 ${isActive('/personas') ? 'text-white' : 'text-l-text-2 dark:text-d-text-2 group-hover:text-white'} transition-colors duration-200`}
              >
                Personas
              </span>
            </Link>

            {/* Badges Link with filling effect */}
            <Link
              to="/badges"
              className={`p-2 md:px-3 md:py-1.5 flex items-center justify-center gap-1.5 group rounded-md relative overflow-hidden ${isActive('/badges') ? 'border-accent-1' : 'border border-border-l dark:border-border-d'}`}
              aria-label="Developer Badges"
            >
              <span
                className={`absolute inset-0 bg-accent-1 transition-transform duration-300 ease-out ${isActive('/badges') ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}
              ></span>
              <Icons.Medal
                className={`w-4 h-4 z-10 ${isActive('/badges') ? 'text-white' : 'text-accent-1 group-hover:text-white'} transition-colors duration-200`}
              />
              <span
                className={`hidden md:block text-sm font-medium z-10 ${isActive('/badges') ? 'text-white' : 'text-l-text-2 dark:text-d-text-2 group-hover:text-white'} transition-colors duration-200`}
              >
                Badges
              </span>
            </Link>

            {/* Battle Mode with filling effect */}
            <Link
              to="/battle"
              className={`p-2 md:px-3 md:py-1.5 flex items-center justify-center gap-1.5 group rounded-md relative overflow-hidden ${isActive('/battle') ? 'border-accent-1' : 'border border-border-l dark:border-border-d'}`}
              aria-label="Battle Mode"
            >
              <span
                className={`absolute inset-0 bg-accent-1 transition-transform duration-300 ease-out ${isActive('/battle') ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}
              ></span>
              <Icons.Trophy
                className={`w-4 h-4 z-10 ${isActive('/battle') ? 'text-white' : 'text-accent-1 group-hover:text-white'} transition-colors duration-200`}
              />
              <span
                className={`hidden md:block text-sm font-medium z-10 ${isActive('/battle') ? 'text-white' : 'text-l-text-2 dark:text-d-text-2 group-hover:text-white'} transition-colors duration-200`}
              >
                Battle
              </span>
            </Link>

            {/* Theme Toggle with spacing to separate it */}
            <div className="ml-1 md:ml-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
