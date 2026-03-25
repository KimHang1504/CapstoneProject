export function TypeBadge({ type }: { type: string }) {
  return (
    <span className="bg-violet-50 text-violet-600 px-2 py-1 rounded text-xs">
      {type}
    </span>
  );
}