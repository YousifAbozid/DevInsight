import { ReactNode, useState } from 'react';
import { Icons } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.FC<{ className?: string }>;
  infoTooltip?: string; // Additional information shown in a tooltip
  rightControls?: ReactNode; // Control elements (buttons, links, etc.)
  className?: string; // Additional styling
}

/**
 * A reusable section header component with responsive design
 *
 * @param title - Main title of the section
 * @param subtitle - Optional secondary text shown below the title
 * @param icon - Optional icon component to display next to the title
 * @param infoTooltip - Optional tooltip text shown when hovering over the info icon
 * @param rightControls - Optional control elements to display below the info section
 * @param className - Optional additional CSS classes
 */
export default function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  infoTooltip,
  rightControls,
  className = '',
}: SectionHeaderProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={className}>
      <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-6 h-6 text-accent-1" />}
          <h2 className="text-xl font-bold text-l-text-1 dark:text-d-text-1">
            {title}
          </h2>
          {infoTooltip && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-l-text-3 dark:text-d-text-3 hover:text-accent-1 transition-colors ml-1 cursor-pointer"
              aria-label="Show more information"
            >
              <Icons.Info className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right controls positioned at the right */}
        {rightControls && (
          <div className="flex items-center gap-2 flex-wrap">
            {rightControls}
          </div>
        )}
      </div>

      {/* Subtitle shown closer to the title */}
      {subtitle && (
        <p className="text-sm text-l-text-2 dark:text-d-text-2 mt-0 mb-4">
          {subtitle}
        </p>
      )}

      {/* Info tooltip expanded view with improved animation */}
      <AnimatePresence>
        {showInfo && infoTooltip && (
          <motion.div
            className="my-4 p-4 bg-l-bg-1 dark:bg-d-bg-1 rounded-lg text-sm text-l-text-2 dark:text-d-text-2 border border-border-l dark:border-border-d"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="flex items-start gap-2">
              <Icons.Info className="w-4 h-4 text-accent-1 mt-0.5 flex-shrink-0" />
              {infoTooltip}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
