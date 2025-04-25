import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GithubProfilePage from './pages/GithubProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import GitHubBattlePage from './pages/GitHubBattlePage';
import PersonasPage from './pages/PersonasPage';
import BadgesPage from './pages/BadgesPage';
import ToastDemoPage from './pages/ToastDemoPage';
import StorageUtilsDemo from './pages/StorageUtilsDemo'; // Import the new demo page
import RateLimitIndicator from './components/RateLimitIndicator';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/shared/ToastContainer';
import { tokenStorage, enhancedTokenStorage } from './utils/storageUtils';

function App() {
  const [token, setToken] = useState<string | undefined>(undefined);

  // Load token from secure storage
  useEffect(() => {
    const loadToken = async () => {
      // Try to get token from enhanced storage first, fall back to regular storage
      const storedToken =
        (await enhancedTokenStorage.getGithubToken()) ||
        tokenStorage.getGithubToken();
      if (storedToken) {
        setToken(storedToken);
      }
    };

    loadToken();
  }, []);

  // Update token when it changes in storage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === enhancedTokenStorage.GITHUB_TOKEN_KEY ||
        e.key === tokenStorage.GITHUB_TOKEN_KEY
      ) {
        const loadToken = async () => {
          const newToken =
            (await enhancedTokenStorage.getGithubToken()) ||
            tokenStorage.getGithubToken();
          setToken(newToken || undefined);
        };

        loadToken();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1">
          <Header />

          <main className="container mx-auto p-4 md:px-8 min-h-[calc(100vh-450px)]">
            {/* Rate limit indicator */}
            <RateLimitIndicator token={token} />

            <Routes>
              <Route path="/" element={<GithubProfilePage />} />
              {/* Place the specific routes before the dynamic routes */}
              <Route path="/battle" element={<GitHubBattlePage />} />
              <Route path="/personas" element={<PersonasPage />} />
              <Route path="/badges" element={<BadgesPage />} />
              <Route path="/toast-demo" element={<ToastDemoPage />} />
              <Route path="/storage-demo" element={<StorageUtilsDemo />} />{' '}
              {/* Add new route */}
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
          <ToastContainer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
