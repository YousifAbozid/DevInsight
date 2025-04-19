import { Github, Twitter, Globe, Heart, Trophy } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 md:px-8 border-t border-border-l dark:border-border-d mt-12 bg-l-bg-2 dark:bg-d-bg-2 transition-colors">
      <div className="container mx-auto">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/favicon.svg"
                alt="DevInsight Logo"
                className="w-6 h-6"
              />
              <h3 className="text-l-text-1 dark:text-d-text-1 font-semibold text-lg">
                About DevInsight
              </h3>
            </div>
            <p className="text-l-text-2 dark:text-d-text-2 text-sm">
              Visual Dashboard Builder for developers to analyze profiles,
              repositories, and track contributions with style.
            </p>
          </div>

          {/* Quick links column */}
          <div className="space-y-3">
            <h3 className="text-l-text-1 dark:text-d-text-1 font-semibold text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-l-text-2 dark:text-d-text-2 hover:text-accent-1 transition-colors inline-flex items-center gap-1"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/battle"
                  className="text-l-text-2 dark:text-d-text-2 hover:text-accent-1 transition-colors inline-flex items-center gap-1"
                >
                  <Trophy size={14} />
                  Battle Mode
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/YousifAbozid/DevInsight"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-l-text-2 dark:text-d-text-2 hover:text-accent-1 transition-colors inline-flex items-center gap-1"
                >
                  <Github size={14} />
                  Source Code
                </a>
              </li>
            </ul>
          </div>

          {/* Connect column */}
          <div className="space-y-3">
            <h3 className="text-l-text-1 dark:text-d-text-1 font-semibold text-lg">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/YousifAbozid"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-all transform hover:-translate-y-1"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-all transform hover:-translate-y-1"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-l-bg-1 dark:bg-d-bg-1 text-l-text-2 dark:text-d-text-2 hover:text-accent-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover transition-all transform hover:-translate-y-1"
                aria-label="Website"
              >
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border-l dark:bg-border-d my-4"></div>

        {/* Bottom copyright section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="DevInsight Logo" className="w-4 h-4" />
            <p className="text-l-text-3 dark:text-d-text-3 text-sm">
              © {currentYear} DevInsight. All rights reserved.
            </p>
          </div>
          <p className="text-l-text-3 dark:text-d-text-3 text-sm mt-2 md:mt-0 flex items-center gap-1.5">
            Built with
            <Heart
              size={14}
              className="text-accent-danger fill-accent-danger animate-pulse"
            />
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
