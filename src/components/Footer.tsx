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

  // Social icon hover animation
  const socialIconVariants = {
    hover: { scale: 1.15, rotate: 5, transition: { duration: 0.2 } },
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
            <div className="flex flex-wrap gap-3">
              <motion.a
                href="https://github.com/YousifAbozid/DevInsight"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover shadow-sm"
                aria-label="GitHub Repository"
                whileHover="hover"
                variants={socialIconVariants}
              >
                <Icons.GitBranch className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://github.com/YousifAbozid"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover shadow-sm"
                aria-label="GitHub Profile"
                whileHover="hover"
                variants={socialIconVariants}
              >
                <Icons.User className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover shadow-sm"
                aria-label="Twitter"
                whileHover="hover"
                variants={socialIconVariants}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover shadow-sm"
                aria-label="Website"
                whileHover="hover"
                variants={socialIconVariants}
              >
                <Icons.Globe className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:info@example.com"
                className="p-2.5 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover shadow-sm"
                aria-label="Email"
                whileHover="hover"
                variants={socialIconVariants}
              >
                <Icons.Mail className="w-5 h-5" />
              </motion.a>
            </div>

            {/* Newsletter subscribe or call to action */}
            <motion.div
              className="mt-2 p-3 rounded-lg bg-l-bg-1 dark:bg-d-bg-1 border border-border-l dark:border-border-d"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <h4 className="text-sm font-medium text-l-text-1 dark:text-d-text-1 mb-1">
                Stay Updated
              </h4>
              <p className="text-xs text-l-text-2 dark:text-d-text-2 mb-2">
                Star the repository to get updates and new features
              </p>
              <a
                href="https://github.com/YousifAbozid/DevInsight"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-accent-1 hover:bg-accent-2 text-white py-1.5 px-2 rounded-md text-sm transition-colors"
              >
                <Icons.Star className="w-4 h-4" />
                <span>Star on GitHub</span>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="h-px w-full bg-border-l dark:bg-border-d my-4"></div>

        {/* Bottom copyright section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
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
          <p className="text-l-text-3 dark:text-d-text-3 text-sm mt-2 md:mt-0 flex items-center gap-1.5">
            Built with
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              <Icons.Award className="w-4 h-4 text-accent-danger fill-accent-danger" />
            </motion.div>
            by
            <a
              href="https://github.com/YousifAbozid"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-1 hover:underline"
            >
              Yousif Abozid
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
