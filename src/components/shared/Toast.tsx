import { useEffect, useState } from 'react';
import { Toast as ToastType } from './ToastContext';
import { Icons } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  toast: ToastType;
  onRemove: () => void;
}

export default function Toast({ toast, onRemove }: ToastProps) {
  const [visible, setVisible] = useState(true);

  // Start exit animation before removing from DOM
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2700); // 300ms before the actual removal to allow for animation

    return () => clearTimeout(timer);
  }, []);

  // Once exit animation completes, call onRemove
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onRemove, 300);
      return () => clearTimeout(timer);
    }
  }, [visible, onRemove]);

  // Get the appropriate icon and background color based on toast type
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <Icons.Check className="w-5 h-5" />,
          bgColor: 'bg-accent-success text-white',
        };
      case 'error':
        return {
          icon: <Icons.AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-accent-danger text-white',
        };
      case 'warning':
        return {
          icon: <Icons.AlertTriangle className="w-5 h-5" />,
          bgColor: 'bg-accent-warning text-l-text-1 dark:text-d-text-1',
        };
      case 'info':
      default:
        return {
          icon: <Icons.Info className="w-5 h-5" />,
          bgColor: 'bg-accent-1 text-white',
        };
    }
  };

  const { icon, bgColor } = getToastStyles();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`${bgColor} rounded-lg p-3 shadow-lg flex items-center gap-3 max-w-md w-full`}
          role="alert"
        >
          {icon}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
