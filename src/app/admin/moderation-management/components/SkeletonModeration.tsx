export function EmptyStateModeration() {
  return (
    <div className="text-center py-16 text-slate-400">
      Không có nội dung vi phạm 🎉
    </div>
  );
}

export function SkeletonModeration() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-40 bg-slate-200 rounded-xl"></div>
      ))}
    </div>
  );
}