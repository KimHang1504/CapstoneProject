import Skeleton from "./Skeleton";

export default function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Fake chart bars */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}