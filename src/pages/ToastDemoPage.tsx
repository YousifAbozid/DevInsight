import { useState } from 'react';
import { useToast, ToastPosition } from '../context/ToastContext';
import { Icons } from '../components/shared/Icons';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function ToastDemoPage() {
  useDocumentTitle('Toast Notification Demo');
  const { notify } = useToast();
  const [duration, setDuration] = useState(3000);
  const [selectedPosition, setSelectedPosition] =
    useState<ToastPosition>('bottom-center');

  const positions: ToastPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

  const handlePositionChange = (newPosition: ToastPosition) => {
    setSelectedPosition(newPosition);
  };

  const handleNotify = (
    type: 'info' | 'success' | 'warning' | 'error',
    message: string
  ) => {
    notify(type, message, selectedPosition, duration);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Toast Notification Demo</h1>

      <div className="mb-8 p-4 bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border border-border-l dark:border-border-d">
        <h2 className="text-lg font-semibold mb-4">Toast Settings</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Duration (in milliseconds)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm font-mono">{duration}ms</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Position</label>
          <div className="grid grid-cols-3 gap-2">
            {positions.map(pos => (
              <button
                key={pos}
                onClick={() => handlePositionChange(pos)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedPosition === pos
                    ? 'bg-accent-1 text-white'
                    : 'bg-l-bg-1 dark:bg-d-bg-1 hover:bg-l-bg-3 dark:hover:bg-d-bg-3'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 border border-border-l dark:border-border-d rounded-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icons.Info className="w-5 h-5 text-accent-1" />
            Information Toast
          </h2>
          <p className="text-l-text-2 dark:text-d-text-2 text-sm mb-4">
            Display an informational message to the user.
          </p>
          <button
            onClick={() =>
              handleNotify('info', 'This is an informational message')
            }
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
              handleNotify('success', 'Operation completed successfully!')
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
              handleNotify('warning', 'Please be careful with this action')
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
              handleNotify('error', 'An error occurred! Please try again.')
            }
            className="px-4 py-2 bg-accent-danger hover:bg-accent-danger/90 text-white rounded-lg transition-colors"
          >
            Show Error Toast
          </button>
        </div>
      </div>

      <div className="p-4 bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border border-border-l dark:border-border-d">
        <h2 className="text-lg font-semibold mb-4">
          How to Use The Toast System
        </h2>
        <div className="bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md font-mono text-sm overflow-x-auto mb-4">
          <pre>
            {`// Import the useToast hook
import { useToast } from '../context/ToastContext';

// Use it in your component
function MyComponent() {
  const { notify } = useToast();
  
  // Basic usage
  notify('success', 'Operation successful!');
  
  // With custom position
  notify('error', 'Something went wrong', 'top-right');
  
  // With custom position and duration (in milliseconds)
  notify('warning', 'Please be careful', 'bottom-left', 5000);
  
  // ...rest of your component
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
