export default function LocationCardSkeleton() {
  return (
    <div className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
      
      {/* Image */}
      <div className="w-24 h-24 rounded-xl bg-gray-200 shrink-0" />

      {/* Content */}
      <div className="flex-1 space-y-3">
        
        {/* Title + status */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-3/4 bg-gray-200 rounded" />
        </div>

        {/* Address */}
        <div className="h-3 w-2/3 bg-gray-200 rounded" />

        {/* Date */}
        <div className="h-3 w-24 bg-gray-200 rounded" />

        {/* Badge */}
        <div className="h-5 w-32 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}