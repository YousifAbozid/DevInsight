import { useMemo } from 'react';
import { useToast, ToastPosition } from '../../context/ToastContext';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const groupedToasts = useMemo(() => {
    // Group toasts by position
    const grouped: Record<ToastPosition, typeof toasts> = {
      'top-left': [],
      'top-center': [],
      'top-right': [],
      'bottom-left': [],
      'bottom-center': [],
      'bottom-right': [],
    };

    toasts.forEach(toast => {
      grouped[toast.position].push(toast);
    });

    return grouped;
  }, [toasts]);

  if (toasts.length === 0) return null;

  const positionClasses: Record<ToastPosition, string> = {
    'top-left': 'top-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'top-right': 'top-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-4 right-4 items-end',
  };

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => {
        if (positionToasts.length === 0) return null;

        return (
          <div
            key={position}
            className={`fixed z-50 flex flex-col pointer-events-none space-y-2 px-4 md:px-0 ${positionClasses[position as ToastPosition]}`}
          >
            <div className="w-full max-w-md flex flex-col gap-2">
              {positionToasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                  <Toast toast={toast} onRemove={() => removeToast(toast.id)} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
