import Skeleton from "@/components/skeleton/Skeleton";


export default function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-5 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl p-6 bg-gray-50 border border-violet-200">
          <Skeleton className="h-3 w-24 mb-3" />
          <Skeleton className="h-8 w-16 mb-3" />
          <Skeleton className="h-1 w-12" />
        </div>
      ))}
    </div>
  );
}