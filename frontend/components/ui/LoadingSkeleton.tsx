export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <LoadingSkeleton className="h-6 w-1/3 mb-4" />
      <LoadingSkeleton className="h-4 w-full mb-2" />
      <LoadingSkeleton className="h-4 w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <LoadingSkeleton className="h-4 w-1/4" />
            <LoadingSkeleton className="h-4 w-1/4" />
            <LoadingSkeleton className="h-4 w-1/4" />
            <LoadingSkeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

