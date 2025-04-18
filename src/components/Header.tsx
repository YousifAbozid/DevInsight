import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-l-bg-1 dark:bg-d-bg-1 border-b border-border-l dark:border-border-d py-4 px-4 md:px-8 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-accent-1 hover:text-accent-2 transition-colors"
        >
          DevInsight
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/battle"
            className="text-l-text-2 dark:text-d-text-2 hover:text-accent-1 flex items-center gap-1"
          >
            <SwordIcon className="w-4 h-4" />
            Battle
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function SwordIcon({ className }: { className?: string }) {
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
