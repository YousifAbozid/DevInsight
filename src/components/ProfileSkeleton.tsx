export default function ProfileSkeleton() {
  return (
    <div className="animate-pulse bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-24 h-24 bg-l-bg-3 dark:bg-d-bg-3 rounded-full"></div>
        <div className="flex-1 space-y-4">
          <div className="h-6 w-1/3 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-4 w-1/2 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          <div className="h-4 w-3/4 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-16 bg-l-bg-3 dark:bg-d-bg-3 rounded"
            ></div>
          ))}
      </div>
    </div>
  );
}
