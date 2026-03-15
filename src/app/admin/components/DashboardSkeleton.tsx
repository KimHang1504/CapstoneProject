export default function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">

      {/* STAT CARDS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>

      {/* BIG CHART */}
      <div className="h-85 rounded-2xl bg-gray-200 animate-pulse" />

      {/* TWO CHARTS */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="h-85 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-85 rounded-2xl bg-gray-200 animate-pulse" />
      </div>

      {/* TWO CHARTS */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="h-85 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-85 rounded-2xl bg-gray-200 animate-pulse" />
      </div>

    </div>
  );
}