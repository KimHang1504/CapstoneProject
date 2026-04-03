import { CheckCircle, Clock, XCircle, Ban } from "lucide-react";

export function StatusBadge({ status }: { status: "SUCCESS" | "PENDING" | "CANCELLED" | "EXPIRED" }) {
  const config = {
    SUCCESS: {
      bg: "bg-gradient-to-r from-emerald-50 to-green-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Thành công",
      icon: CheckCircle
    },
    PENDING: {
      bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
      text: "text-amber-700",
      border: "border-amber-200",
      label: "Chờ xử lý",
      icon: Clock
    },
    CANCELLED: {
      bg: "bg-gradient-to-r from-red-50 to-rose-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "Đã hủy",
      icon: XCircle
    },
    EXPIRED: {
      bg: "bg-gradient-to-r from-slate-50 to-gray-50",
      text: "text-slate-700",
      border: "border-slate-200",
      label: "Hết hạn",
      icon: Ban
    },
  };

  const style = config[status];
  const Icon = style.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {style.label}
    </span>
  );
}