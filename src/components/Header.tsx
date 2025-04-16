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
        <ThemeToggle />
      </div>
    </header>
  );
}
