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
import StorageHooksDemo from './pages/StorageHooksDemo';
import RateLimitIndicator from './components/RateLimitIndicator';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/shared/ToastContainer';
import { useGithubToken } from './hooks/useStorage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [storedToken, , isLoading] = useGithubToken();

  // Improved token initialization
  useEffect(() => {
    // Only update local state if the token has loaded and is different from current state
    if (!isLoading && storedToken !== token) {
      console.warn('Initializing token from storage');
      setToken(storedToken);
    }
  }, [isLoading, storedToken, token]);

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
              <Route path="/badges" element={<BadgesPage />} />
              <Route path="/personas" element={<PersonasPage />} />
              <Route path="/battle" element={<GitHubBattlePage />} />
              <Route path="/toast-demo" element={<ToastDemoPage />} />
              <Route path="/storage-demo" element={<StorageHooksDemo />} />

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

              {/* 404 Page - Must be the last route */}
              <Route path="*" element={<NotFoundPage />} />
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
