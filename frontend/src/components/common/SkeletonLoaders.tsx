export function SkeletonCard() {
  return (
    <div className="bg-surface-container-low rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-surface-container rounded mb-4 w-3/4"></div>
      <div className="h-8 bg-surface-container rounded mb-4 w-1/2"></div>
      <div className="space-y-2">
        <div className="h-3 bg-surface-container rounded w-full"></div>
        <div className="h-3 bg-surface-container rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container-low rounded p-4 animate-pulse flex gap-4"
        >
          <div className="h-4 bg-surface-container rounded flex-1"></div>
          <div className="h-4 bg-surface-container rounded w-1/4"></div>
          <div className="h-4 bg-surface-container rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonMetricCard() {
  return (
    <div className="bg-surface-container-low rounded-lg p-6 animate-pulse">
      <div className="h-3 bg-surface-container rounded mb-3 w-1/2"></div>
      <div className="h-10 bg-surface-container rounded mb-2 w-2/3"></div>
      <div className="h-3 bg-surface-container rounded w-1/3"></div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-surface-container-low rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-surface-container rounded mb-6 w-1/2"></div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-2 bg-surface-container rounded flex-1"></div>
            <div className="h-3 bg-surface-container rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMetricCard key={i} />
      ))}
    </div>
  );
}
