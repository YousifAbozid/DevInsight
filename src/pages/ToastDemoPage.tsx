import { useToast } from '../components/shared/ToastContext';
import { Icons } from '../components/shared/Icons';

export default function ToastDemoPage() {
  const { notify } = useToast();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Toast Notification Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-border-l dark:border-border-d rounded-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icons.Info className="w-5 h-5 text-accent-1" />
            Information Toast
          </h2>
          <p className="text-l-text-2 dark:text-d-text-2 text-sm mb-4">
            Display an informational message to the user.
          </p>
          <button
            onClick={() => notify('info', 'This is an informational message')}
            className="px-4 py-2 bg-accent-1 hover:bg-accent-2 text-white rounded-lg transition-colors"
          >
            Show Info Toast
          </button>
        </div>

        <div className="p-4 border border-border-l dark:border-border-d rounded-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icons.Check className="w-5 h-5 text-accent-success" />
            Success Toast
          </h2>
          <p className="text-l-text-2 dark:text-d-text-2 text-sm mb-4">
            Display a success message to the user.
          </p>
          <button
            onClick={() =>
              notify('success', 'Operation completed successfully!')
            }
            className="px-4 py-2 bg-accent-success hover:bg-accent-success/90 text-white rounded-lg transition-colors"
          >
            Show Success Toast
          </button>
        </div>

        <div className="p-4 border border-border-l dark:border-border-d rounded-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icons.AlertTriangle className="w-5 h-5 text-accent-warning" />
            Warning Toast
          </h2>
          <p className="text-l-text-2 dark:text-d-text-2 text-sm mb-4">
            Display a warning message to the user.
          </p>
          <button
            onClick={() =>
              notify('warning', 'Please be careful with this action')
            }
            className="px-4 py-2 bg-accent-warning hover:bg-accent-warning/90 text-l-text-1 dark:text-d-text-1 rounded-lg transition-colors"
          >
            Show Warning Toast
          </button>
        </div>

        <div className="p-4 border border-border-l dark:border-border-d rounded-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icons.AlertCircle className="w-5 h-5 text-accent-danger" />
            Error Toast
          </h2>
          <p className="text-l-text-2 dark:text-d-text-2 text-sm mb-4">
            Display an error message to the user.
          </p>
          <button
            onClick={() =>
              notify('error', 'An error occurred! Please try again.')
            }
            className="px-4 py-2 bg-accent-danger hover:bg-accent-danger/90 text-white rounded-lg transition-colors"
          >
            Show Error Toast
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border border-border-l dark:border-border-d">
        <h2 className="text-lg font-semibold mb-4">
          How to Use The Toast System
        </h2>
        <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md font-mono text-sm overflow-x-auto mb-4">
          <pre>
            {`// Import the useToast hook
import { useToast } from '../components/shared/ToastContext';

// Use it in your component
function MyComponent() {
  const { notify } = useToast();
  
  // Show different types of toasts
  notify('success', 'Operation successful!');
  notify('error', 'Something went wrong');
  notify('warning', 'Please be careful');
  notify('info', 'Here is some information');
  
  // ...rest of your component
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
