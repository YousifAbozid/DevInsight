export default function LanguageChartSkeleton() {
  return (
    <div className="animate-pulse bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <div className="h-6 w-48 bg-l-bg-3 dark:bg-d-bg-3 rounded mb-6"></div>
      <div className="flex justify-center items-center h-64">
        <div className="w-40 h-40 rounded-full bg-l-bg-3 dark:bg-d-bg-3"></div>
      </div>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-4 bg-l-bg-3 dark:bg-d-bg-3 rounded"></div>
          ))}
      </div>
    </div>
  );
}
