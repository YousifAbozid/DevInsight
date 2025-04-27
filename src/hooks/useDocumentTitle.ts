import { useEffect, useRef } from 'react';

/**
 * Title format options
 */
export type TitleFormat = 'page-first' | 'brand-first' | 'custom';

/**
 * Configuration options for document title
 */
export interface TitleConfig {
  format?: TitleFormat;
  separator?: string;
  suffix?: string;
  brandName?: string;
}

// Default configuration that can be imported and modified
export const DEFAULT_TITLE_CONFIG: TitleConfig = {
  format: 'page-first',
  separator: ' | ',
  suffix: '',
  brandName: 'DevInsight',
};

/**
 * Custom hook to manage document title with consistent formatting
 *
 * @param pageTitle - The specific page title to display (optional)
 * @param config - Configuration options for title formatting (optional)
 */
export function useDocumentTitle(
  pageTitle?: string,
  config?: TitleConfig
): void {
  // Merge provided config with defaults
  const titleConfig = { ...DEFAULT_TITLE_CONFIG, ...config };
  const { format, separator, suffix, brandName } = titleConfig;

  // Store original title for cleanup
  const defaultTitle = 'DevInsight - GitHub Profile Explorer';
  const previousTitle = useRef(document.title);

  useEffect(() => {
    // If no pageTitle provided, use the default title
    if (!pageTitle) {
      document.title = defaultTitle;
      return;
    }

    // Format the title according to the specified format
    let formattedTitle = '';

    switch (format) {
      case 'page-first':
        formattedTitle = `${pageTitle}${separator}${brandName}`;
        break;
      case 'brand-first':
        formattedTitle = `${brandName}${separator}${pageTitle}`;
        break;
      case 'custom':
        formattedTitle = pageTitle; // Use exactly what was provided
        break;
      default:
        formattedTitle = `${pageTitle}${separator}${brandName}`;
    }

    // Add suffix if provided
    if (suffix) {
      formattedTitle += suffix;
    }

    // Set the document title
    document.title = formattedTitle;

    // Cleanup function to restore previous title when component unmounts
    return () => {
      document.title = previousTitle.current;
    };
  }, [pageTitle, format, separator, suffix, brandName]);
}
