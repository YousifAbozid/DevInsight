import { useEffect, useState, useRef } from 'react';
import { Toast as ToastType } from '../../context/ToastContext';
import { Icons } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  toast: ToastType;
  onRemove: () => void;
}

export default function Toast({ toast, onRemove }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  // Start exit animation before removing from DOM
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, toast.duration - 300); // 300ms before the actual removal to allow for animation

    // Update progress bar
    const updateProgressBar = () => {
      if (!progressRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, toast.duration - elapsed);
      const progress = (remaining / toast.duration) * 100;

      progressRef.current.style.width = `${progress}%`;

      if (progress > 0) {
        animationFrameRef.current = requestAnimationFrame(updateProgressBar);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgressBar);

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [toast.duration]);

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
          progressColor: 'bg-white/60',
        };
      case 'error':
        return {
          icon: <Icons.AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-accent-danger text-white',
          progressColor: 'bg-white/60',
        };
      case 'warning':
        return {
          icon: <Icons.AlertTriangle className="w-5 h-5" />,
          bgColor: 'bg-accent-warning text-l-text-1 dark:text-d-text-1',
          progressColor: 'bg-l-text-1 dark:bg-d-text-1/60',
        };
      case 'info':
      default:
        return {
          icon: <Icons.Info className="w-5 h-5" />,
          bgColor: 'bg-accent-1 text-white',
          progressColor: 'bg-white/60',
        };
    }
  };

  const { icon, bgColor, progressColor } = getToastStyles();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`${bgColor} rounded-lg shadow-lg flex flex-col max-w-md w-full overflow-hidden`}
          role="alert"
        >
          <div className="p-3 flex items-center gap-3">
            {icon}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
          </div>

          {/* Progress indicator */}
          <div className="h-1 w-full bg-black/10">
            <div
              ref={progressRef}
              className={`h-full ${progressColor} transition-all`}
              style={{ width: '100%' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
