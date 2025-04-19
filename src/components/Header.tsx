import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for elegant shadow transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-l-bg-1/95 dark:bg-d-bg-1/95 backdrop-blur-sm transition-all duration-300 border-b border-border-l dark:border-border-d py-3 px-4 md:px-8 ${
        scrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Brand Name */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="DevInsight Home"
        >
          {/* Using the favicon as logo with simpler styling */}
          <img src="/favicon.svg" alt="DevInsight Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
            DevInsight
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {/* Battle Mode Link with Better Crossed Swords */}
          <Link
            to="/battle"
            className="relative px-4 py-2 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 flex items-center gap-2 group transition-all duration-200 rounded-full hover:bg-l-bg-hover dark:hover:bg-d-bg-hover"
            aria-label="Battle Mode"
          >
            <div className="relative w-6 h-6">
              <CrossedSwordsIcon className="absolute inset-0 w-full h-full text-accent-1" />
            </div>
            <span className="font-medium">Battle Mode</span>
          </Link>

          {/* Reverted Theme Toggle (no wrapper) */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function CrossedSwordsIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5"></path>
      <path d="M13 19l6-6"></path>
      <path d="M16 16l4 4"></path>
      <path d="M19 21l2-2"></path>
    </svg>
  );
}
