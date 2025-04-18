import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import GithubProfilePage from './pages/GithubProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import GitHubBattlePage from './pages/GitHubBattlePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-l-bg-1 dark:bg-d-bg-1 text-l-text-1 dark:text-d-text-1">
        <Header />

        <main className="container mx-auto py-8 px-4 md:px-8">
          <Routes>
            <Route path="/" element={<GithubProfilePage />} />
            {/* Place the specific route before the dynamic route */}
            <Route path="/battle" element={<GitHubBattlePage />} />
            {/* This dynamic route should come last since it matches any string */}
            <Route path="/:username" element={<PublicProfilePage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
