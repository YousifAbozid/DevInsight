import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Trophy, Users, Medal } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-l-bg-1/95 dark:bg-d-bg-1/95 backdrop-blur-sm transition-all duration-300 border-b border-border-l dark:border-border-d py-3 px-4 md:px-8 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo and Brand Name */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="DevInsight Home"
          >
            {/* Using the favicon as logo with simpler styling */}
            <img src="/favicon.svg" alt="DevInsight Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-l-text-1 dark:text-d-text-1 group-hover:text-accent-1 transition-colors duration-200">
              DevInsight
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {/* Personas Link with Users Icon - Fill Background Effect */}
            <Link
              to="/personas"
              className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 group rounded-md relative overflow-hidden border border-accent-1/50"
              aria-label="Coder Personas"
            >
              <span className="absolute inset-0 bg-accent-1 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <Users
                className="text-accent-1 z-10 group-hover:text-l-text-inv dark:group-hover:text-d-text-inv transition-colors duration-200"
                size={16}
              />
              <span className="font-medium text-md z-10 text-l-text-2 dark:text-d-text-2 group-hover:text-l-text-inv dark:group-hover:text-d-text-inv transition-colors duration-200 hidden sm:block">
                Personas
              </span>
            </Link>

            {/* Badges Link with Medal Icon - Fill Background Effect */}
            <Link
              to="/badges"
              className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 group rounded-md relative overflow-hidden border border-accent-1/50"
              aria-label="Developer Badges"
            >
              <span className="absolute inset-0 bg-accent-1 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <Medal
                className="text-accent-1 z-10 group-hover:text-l-text-inv dark:group-hover:text-d-text-inv transition-colors duration-200"
                size={16}
              />
              <span className="font-medium text-md z-10 text-l-text-2 dark:text-d-text-2 group-hover:text-l-text-inv dark:group-hover:text-d-text-inv transition-colors duration-200 hidden sm:block">
                Badges
              </span>
            </Link>

            {/* Battle Mode with Trophy Icon - Fill Background Effect */}
            <Link
              to="/battle"
              className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 group rounded-md relative overflow-hidden border border-accent-1/50"
              aria-label="Battle Mode"
            >
              <span className="absolute inset-0 bg-accent-1 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <Trophy
                className="text-accent-1 z-10 group-hover:text-l-text-inv dark:group-hover:text-d-text-inv transition-colors duration-200"
                size={16}
              />
              <span className="font-medium text-md z-10 text-l-text-2 dark:text-d-text-2 group-hover:text-l-text-inv dark:group-hover:text-d-text-inv transition-colors duration-200 hidden sm:block">
                Battle Mode
              </span>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
