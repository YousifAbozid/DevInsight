import ThemeToggle from './components/ThemeToggle';
import GithubProfilePage from './features/github-profile/GithubProfilePage';

function App() {
  return (
    <div className="min-h-screen bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1">
      <header className="py-6 px-4 md:px-8 border-b border-border-l dark:border-border-d">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">DevInsight</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 md:px-8">
        <GithubProfilePage />
      </main>

      <footer className="py-6 px-4 md:px-8 border-t border-border-l dark:border-border-d mt-12">
        <div className="container mx-auto text-center text-l-text-3 dark:text-d-text-3">
          <p>DevInsight — Visual GitHub Dashboard Builder</p>
          <p className="mt-1">Built with 💙 by Yousif Abozid</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
