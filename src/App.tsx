import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GithubProfilePage from './pages/GithubProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import GitHubBattlePage from './pages/GitHubBattlePage';
import PersonasPage from './pages/PersonasPage';
import BadgesPage from './pages/BadgesPage';
import RateLimitIndicator from './components/RateLimitIndicator';

function App() {
  const [token, setToken] = useState<string | undefined>(undefined);

  // Load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('github_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Update token when it changes in storage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'github_token') {
        setToken(e.newValue || undefined);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1">
        <Header />

        <main className="container mx-auto p-4 md:px-8">
          {/* Rate limit indicator */}
          <RateLimitIndicator token={token} alwaysShow={true} />

          <Routes>
            <Route path="/" element={<GithubProfilePage />} />
            {/* Place the specific routes before the dynamic routes */}
            <Route path="/battle" element={<GitHubBattlePage />} />
            <Route path="/personas" element={<PersonasPage />} />
            <Route path="/badges" element={<BadgesPage />} />

            {/* New separate routes for users and organizations */}
            <Route
              path="/user/:username"
              element={<PublicProfilePage profileType="user" />}
            />
            <Route
              path="/org/:username"
              element={<PublicProfilePage profileType="organization" />}
            />

            {/* Legacy route - will redirect to the appropriate route */}
            <Route path="/:username" element={<PublicProfilePage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
