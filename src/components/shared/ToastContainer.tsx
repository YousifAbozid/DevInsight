import { useToast } from './ToastContext';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex flex-col items-center justify-center pointer-events-none space-y-2 px-4 md:px-0">
      <div className="w-full max-w-md flex flex-col gap-2">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
