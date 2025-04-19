import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';
import { Swords } from 'lucide-react';

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
          <span className="text-xl font-bold text-l-text-1 dark:text-d-text-1 group-hover:text-accent-1 transition-colors duration-200">
            DevInsight
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {/* Battle Mode Link with Lucide-React Swords Icon */}
          <Link
            to="/battle"
            className="relative px-4 py-2 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 flex items-center gap-2 group transition-all duration-200 rounded-full hover:bg-l-bg-hover dark:hover:bg-d-bg-hover"
            aria-label="Battle Mode"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <Swords
                className="text-accent-1 group-hover:scale-110 transition-transform duration-200"
                size={20}
              />
            </div>
            <span className="font-medium group-hover:font-semibold transition-all">
              Battle Mode
            </span>
            <span className="absolute inset-0 rounded-full border border-transparent group-hover:border-accent-1/30 transition-all duration-200"></span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
