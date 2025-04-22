import { Icons } from '../Icons';

export default function GithubProfileCardSkeleton() {
  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d relative animate-pulse">
      {/* Top Section with Avatar and Basic Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
        {/* Avatar Column */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="relative z-10">
              {/* Skeleton for avatar */}
              <div className="w-28 h-28 rounded-full border-4 border-accent-1 shadow-md bg-l-bg-3 dark:bg-d-bg-3"></div>
            </div>
          </div>

          {/* Skeleton for profile links */}
          <div className="flex flex-col w-full gap-3 mt-2">
            <div className="w-full h-10 bg-l-bg-3 dark:bg-d-bg-3 rounded-md"></div>
            <div className="w-full h-10 bg-l-bg-3 dark:bg-d-bg-3 rounded-md"></div>
          </div>
        </div>

        {/* User Info Column */}
        <div className="flex-1 w-full md:w-auto text-center md:text-left">
          {/* User Name and Type */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 flex-wrap justify-center md:justify-start">
            <div className="h-7 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>

            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
              <div className="h-5 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
            </div>
          </div>

          {/* Username */}
          <div className="h-6 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-1"></div>

          {/* Bio */}
          <div className="h-20 w-full bg-l-bg-3 dark:bg-d-bg-3 rounded mt-3"></div>

          {/* GitHub Membership Section */}
          <div className="mt-4 bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-md border border-border-l/50 dark:border-border-d/50 relative overflow-hidden">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-2 sm:mb-0">
                <Icons.Users className="w-5 h-5 mr-2 text-accent-1 flex-shrink-0" />
                <div className="h-5 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              </div>

              {/* Membership Duration Badge */}
              <div className="h-7 w-36 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
            </div>

            {/* Membership Timeline */}
            <div className="mt-4 space-y-3">
              {/* Join Date with Icon */}
              <div className="flex items-start">
                <div className="bg-l-bg-2 dark:bg-d-bg-2 p-1.5 rounded-full mr-3 mt-0.5">
                  <Icons.Clock className="w-4 h-4 text-accent-success" />
                </div>
                <div className="flex flex-col items-start">
                  <div className="h-5 w-28 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                  <div className="h-4 w-36 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-1"></div>
                </div>
              </div>

              {/* Next Anniversary */}
              <div className="flex items-start">
                <div className="bg-l-bg-2 dark:bg-d-bg-2 p-1.5 rounded-full mr-3 mt-0.5">
                  <Icons.Timer className="w-4 h-4 text-accent-warning" />
                </div>
                <div className="flex flex-col items-start">
                  <div className="h-5 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
                  <div className="h-4 w-40 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-1"></div>

                  {/* Countdown display skeleton */}
                  <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="h-6 w-20 bg-l-bg-3 dark:bg-d-bg-3 rounded-md"></div>
                    <div className="h-6 w-16 bg-l-bg-3 dark:bg-d-bg-3 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact and Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4">
            {/* Left column */}
            <div>
              <div className="flex items-center mt-1.5">
                <Icons.MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <div className="h-4 w-32 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              </div>

              <div className="flex items-center mt-1.5">
                <Icons.Building className="w-4 h-4 mr-2 flex-shrink-0" />
                <div className="h-4 w-40 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              </div>
            </div>

            {/* Right column */}
            <div>
              <div className="flex items-center">
                <Icons.Link className="w-4 h-4 mr-2 flex-shrink-0" />
                <div className="h-4 w-36 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              </div>

              <div className="flex items-center mt-1.5">
                <Icons.Twitter className="w-4 h-4 mr-2 flex-shrink-0" />
                <div className="h-4 w-28 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
              </div>
            </div>
          </div>

          {/* Last updated */}
          <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-4"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
        {[...Array(6)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l dark:border-border-d">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        <div className="h-4 w-12 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
      </div>
      <div className="h-6 w-8 bg-l-bg-3 dark:bg-d-bg-3 rounded mt-2"></div>
    </div>
  );
}
