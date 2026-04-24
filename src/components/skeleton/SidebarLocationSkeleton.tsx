export default function SidebarLocationSkeleton() {
  return (
    <div className="w-[320px] space-y-3 animate-pulse">
      <div className="h-12 bg-gray-200 rounded-3xl" />

      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 rounded-2xl" />
      ))}

      <div className="h-20 bg-gray-200 rounded-full mt-5" />
    </div>
  );
}