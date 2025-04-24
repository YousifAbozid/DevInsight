import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icons } from './shared/Icons';

// Footer component with CSS variable for height
export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Social icon animation - improved with combined effects
  const socialIconVariants = {
    initial: {
      scale: 1,
      opacity: 0,
      y: 10,
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.15,
      transition: {
        duration: 0.3,
        type: 'spring',
        stiffness: 300,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  // Connect link group container animation
  const connectLinksVariants = {
    initial: { opacity: 1 },
    hover: {
      scale: 1.02,
      transition: { staggerChildren: 0.05 },
    },
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <footer className="py-8 px-4 md:px-8 border-t border-border-l dark:border-border-d mt-12 bg-l-bg-2 dark:bg-d-bg-2 transition-colors">
      <div className="container mx-auto">
        {/* Top section with columns */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* About column */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <motion.img
                src="/favicon.svg"
                alt="DevInsight Logo"
                className="w-6 h-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              />
              <h3 className="text-l-text-1 dark:text-d-text-1 font-semibold text-lg">
                About DevInsight
              </h3>
            </div>
            <p className="text-l-text-2 dark:text-d-text-2 text-sm leading-relaxed">
              Visual Dashboard Builder for developers to analyze profiles,
              repositories, and track contributions with style. View insights
              and compare developer profiles on GitHub.
            </p>
          </motion.div>

          {/* Navigation Links column */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-l-text-1 dark:text-d-text-1 font-semibold text-lg flex items-center gap-2">
              <Icons.Link className="w-4 h-4 text-accent-1" />
              Navigation
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-l-text-2 dark:text-d-text-2 hover:text-accent-1 transition-colors flex items-center gap-1.5 group"
                >
                  <Icons.Home className="w-4 h-4 text-accent-1 group-hover:scale-110 transition-transform" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/personas"
                  className="text-l-text-2 dark:text-d-text-2 hover:text-accent-1 transition-colors flex items-center gap-1.5 group"
                >
                  <Icons.Users className="w-4 h-4 text-accent-1 group-hover:scale-110 transition-transform" />
                  <span>Personas</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/badges"
                  className="text-l-text-2 dark:text-d-text-2 hover:text-accent-1 transition-colors flex items-center gap-1.5 group"
                >
                  <Icons.Medal className="w-4 h-4 text-accent-1 group-hover:scale-110 transition-transform" />
                  <span>Badges</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/battle"
                  className="text-l-text-2 dark:text-d-text-2 hover:text-accent-1 transition-colors flex items-center gap-1.5 group"
                >
                  <Icons.Trophy className="w-4 h-4 text-accent-1 group-hover:scale-110 transition-transform" />
                  <span>Battle</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Connect column */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-l-text-1 dark:text-d-text-1 font-semibold text-lg flex items-center gap-2">
              <Icons.Globe className="w-4 h-4 text-accent-1" />
              Connect
            </h3>
            <motion.div
              className="flex flex-wrap gap-3"
              variants={connectLinksVariants}
              initial="initial"
              whileHover="hover"
              animate="animate"
            >
              <motion.a
                href="https://github.com/YousifAbozid/DevInsight"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover shadow-sm transition-shadow hover:shadow-md"
                aria-label="GitHub Repository"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Icons.GitHub className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://github.com/YousifAbozid"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover shadow-sm transition-shadow hover:shadow-md"
                aria-label="GitHub Profile"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Icons.User className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://x.com/YousifAbozid12"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover shadow-sm transition-shadow hover:shadow-md"
                aria-label="Twitter Profile"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Icons.Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/yousifabozid"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover shadow-sm transition-shadow hover:shadow-md"
                aria-label="LinkedIn Profile"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Icons.LinkedIn className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:yousif.abozid@yahoo.com"
                className="p-2.5 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover shadow-sm transition-shadow hover:shadow-md"
                aria-label="Email"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Icons.Mail className="w-5 h-5" />
              </motion.a>
            </motion.div>

            {/* Newsletter subscribe or call to action - enhanced with pulsing animation */}
            <motion.div
              className="mt-2 p-3 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d"
              whileHover={{
                y: -3,
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <h4 className="text-sm font-medium text-l-text-1 dark:text-d-text-1 mb-1">
                Stay Updated
              </h4>
              <p className="text-xs text-l-text-2 dark:text-d-text-2 mb-2">
                Star the repository to get updates and new features
              </p>
              <motion.div className="relative">
                {/* Pulse effect layer (behind the button) */}
                <motion.div
                  className="absolute inset-0 rounded-md bg-accent-1 opacity-30"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {/* Actual button */}
                <motion.a
                  href="https://github.com/YousifAbozid/DevInsight"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-accent-1 hover:bg-accent-2 text-white py-1.5 px-2 rounded-md text-sm transition-colors relative z-10"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icons.Star className="w-4 h-4" />
                  <span>Star on GitHub</span>
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="h-px w-full bg-border-l dark:bg-border-d my-4"></div>

        {/* Bottom copyright section - Refactored for more engagement and mobile responsiveness */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <div className="flex items-center gap-2">
            <motion.img
              src="/favicon.svg"
              alt="DevInsight Logo"
              className="w-4 h-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
            <p className="text-l-text-3 dark:text-d-text-3 text-sm">
              © {currentYear} DevInsight. All rights reserved.
            </p>
          </div>
          <div className="text-l-text-3 dark:text-d-text-3 text-sm flex items-center gap-1.5 flex-wrap justify-center md:justify-start">
            <span>Built with</span>
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="flex items-center"
            >
              <Icons.Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.span>
            <span>by</span>
            <a
              href="https://github.com/YousifAbozid"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-1 hover:underline font-medium"
            >
              Yousif Abozid
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
