import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border-l dark:border-border-d">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">DevInsight</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
