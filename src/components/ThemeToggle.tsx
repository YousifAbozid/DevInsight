import { useEffect } from 'react';
import useLocalStorage from 'use-local-storage';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [darkMode, setDarkMode] = useLocalStorage(
    'theme',
    defaultDark ? 'dark' : 'light'
  );

  useEffect(() => {
    if (darkMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => {
        setDarkMode(darkMode === 'dark' ? 'light' : 'dark');
      }}
      className="relative p-2 rounded-md group overflow-hidden border border-border-l dark:border-border-d"
      aria-label={
        darkMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
    >
      {/* Animated background on hover */}
      <span className="absolute inset-0 bg-accent-1/10 dark:bg-accent-1/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

      {/* Circle animation */}
      <span className="absolute inset-0 rounded-full scale-0 bg-accent-1/15 group-hover:scale-150 transition-transform duration-500 origin-center"></span>

      {/* Icons with animated swap */}
      <span className="relative z-10 flex items-center justify-center transition-all duration-300">
        {darkMode === 'dark' ? (
          <Sun
            size={18}
            className="text-accent-1 dark:text-accent-1 animate-fade-in-down"
          />
        ) : (
          <Moon
            size={18}
            className="text-accent-2 dark:text-accent-2 animate-fade-in-down"
          />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
