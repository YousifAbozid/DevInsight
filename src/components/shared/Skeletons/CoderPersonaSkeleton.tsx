import { Icons } from '../Icons';

export default function CoderPersonaSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d shadow-sm animate-pulse">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Icons.Users className="w-5 h-5 text-accent-1 flex-shrink-0" />
          <div className="flex flex-col">
            <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-1"></div>
            <div className="h-4 w-64 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-28 bg-l-bg-3 dark:bg-d-bg-3 rounded-md"></div>
          <div className="h-6 w-20 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        </div>
      </div>

      {/* Persona Card */}
      <div className="bg-l-bg-1 dark:bg-d-bg-1 rounded-lg p-6 border border-border-l dark:border-border-d mt-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Persona Icon and Title */}
          <div className="md:w-1/4 flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-l-bg-3 dark:bg-d-bg-3 mb-4 w-14 h-14"></div>
            <div className="h-6 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
            <div className="h-4 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>

          {/* Strength Bars area */}
          <div className="md:w-3/4">
            {/* Replicate the six strength bars with their labels */}
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-24 text-sm font-medium">
                    <div className="h-4 w-20 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                  </div>
                  <div className="flex-1 h-5 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personality Description */}
        <div className="mt-6">
          <div className="h-5 w-40 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
          <div className="h-4 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
          <div className="h-4 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>

        {/* Footer text */}
        <div className="mt-4 pt-3 border-t border-border-l dark:border-border-d flex justify-center">
          <div className="h-3 w-56 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-5 border-t border-border-l dark:border-border-d pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-l-bg-3 dark:bg-d-bg-3 rounded-full mr-2"></div>
            <div className="h-5 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          </div>

          <div className="flex w-full sm:w-auto gap-2.5">
            <div className="flex-1 sm:flex-initial h-9 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-md"></div>
            <div className="flex-1 sm:flex-initial h-9 w-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
