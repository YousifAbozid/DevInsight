import Header from './components/Header';
import Footer from './components/Footer';
import GithubProfilePage from './pages/GithubProfilePage';

function App() {
  return (
    <div className="min-h-screen bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1">
      <Header />

      <main className="container mx-auto py-8 px-4 md:px-8">
        <GithubProfilePage />
      </main>

      <Footer />
    </div>
  );
}

export default App;
