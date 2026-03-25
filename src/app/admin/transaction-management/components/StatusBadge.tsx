export function StatusBadge({ status }: { status: "SUCCESS" | "PENDING" | "CANCELLED" | "EXPIRED" }) {
  const map = {
    SUCCESS: "bg-green-100 text-green-600",
    PENDING: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-500",
    EXPIRED: "bg-gray-100 text-gray-500",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${map[status]}`}>
      {status}
    </span>
  );
}