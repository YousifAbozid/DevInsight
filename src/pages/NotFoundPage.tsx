import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/shared/Icons';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Page Not Found');
  const navigate = useNavigate();

  const popularPages = [
    { name: 'Home', path: '/' },
    { name: 'Badges', path: '/badges' },
    { name: 'Personas', path: '/personas' },
    { name: 'GitHub Battle', path: '/battle' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-8 border border-border-l dark:border-border-d">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Error icon */}
          <div className="p-4 bg-accent-danger/10 rounded-full">
            <Icons.AlertCircle className="w-16 h-16 text-accent-danger" />
          </div>

          {/* Error heading */}
          <h2 className="text-3xl font-bold text-l-text-1 dark:text-d-text-1">
            404 - Page Not Found
          </h2>

          {/* Error message */}
          <p className="text-l-text-2 dark:text-d-text-2 max-w-md mx-auto">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Popular pages */}
          <div className="w-full max-w-md mx-auto pt-6 border-t border-border-l dark:border-border-d">
            <h4 className="text-sm font-medium text-l-text-2 dark:text-d-text-2 mb-3">
              Visit one of these pages instead:
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularPages.map(page => (
                <button
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  className="px-3 py-1.5 text-xs bg-accent-1/10 hover:bg-accent-1/20 text-accent-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                >
                  {page.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm bg-accent-1 hover:bg-accent-2 text-white rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer mt-2"
          >
            <Icons.Home className="w-4 h-4" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
