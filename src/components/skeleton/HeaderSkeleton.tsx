import Skeleton from "./Skeleton";

export default function HeaderSkeleton() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-3 w-72" />
      </div>

      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
  );
}