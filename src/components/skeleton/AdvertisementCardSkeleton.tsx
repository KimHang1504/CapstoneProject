import Skeleton from "./Skeleton";

export default function AdvertisementCardSkeleton() {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-violet-200 flex flex-col">
      
      {/* Banner + overlay content */}
      <div className="relative w-full h-40">
        {/* Image */}
        <Skeleton className="w-full h-full" />

        {/* Placement chip */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Title (overlay bottom) */}
        <div className="absolute bottom-3 left-3 right-3">
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-violet-50">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 mt-auto flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}