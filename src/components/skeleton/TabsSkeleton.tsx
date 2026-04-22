import Skeleton from "./Skeleton";

export default function TabsSkeleton() {
  return (
    <div className="mb-6 border-b border-gray-200">
      <div className="flex gap-4 pb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
    </div>
  );
}