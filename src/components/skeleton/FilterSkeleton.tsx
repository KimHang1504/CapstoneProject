import Skeleton from "@/components/skeleton/Skeleton";


export default function FilterSkeleton() {
  return (
    <div className="flex justify-between mb-6 gap-4 flex-wrap">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-10 w-72 rounded-full" />
        <Skeleton className="h-10 w-16 rounded-xl" />
        <Skeleton className="h-10 w-16 rounded-xl" />
      </div>
    </div>
  );
}