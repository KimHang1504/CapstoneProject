export function Badge({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 text-sm rounded-full bg-white/20 backdrop-blur">
      {label}
    </span>
  );
}