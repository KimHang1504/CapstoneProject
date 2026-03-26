import { Tag } from "lucide-react";

export function TypeBadge({ type }: { type: string }) {
  const typeLabels: Record<string, string> = {
    WALLET_TOPUP: "Nạp ví",
    MEMBER_SUBSCRIPTION: "Gói thành viên",
    MONEY_TO_POINT: "Đổi điểm",
    ADS_ORDER: "Quảng cáo",
    VENUE_SUBSCRIPTION: "Gói địa điểm",
  };

  return (
    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
      <Tag className="w-3.5 h-3.5" />
      {typeLabels[type] || type}
    </span>
  );
}