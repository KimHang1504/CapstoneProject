"use client";

import { useEffect, useState } from "react";
import { getVoucherSummary } from "@/api/venue/vouchers/api";
import { VoucherSummary } from "@/api/venue/vouchers/type";

import {
  Package,
  Boxes,
  Ticket,
  ShoppingBag,
  CheckCircle,
  Percent
} from "lucide-react";

type CardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  variant?: "blue" | "green" | "purple" | "orange" | "red" | "pink" | "yellow";
};

const styles = {
  blue: {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-700",
    glow: "shadow-blue-200/60",
  },
  green: {
    bg: "bg-green-500",
    light: "bg-green-50",
    text: "text-green-700",
    glow: "shadow-green-200/60",
  },
  purple: {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    text: "text-purple-700",
    glow: "shadow-purple-200/60",
  },
  orange: {
    bg: "bg-orange-500",
    light: "bg-orange-50",
    text: "text-orange-700",
    glow: "shadow-orange-200/60",
  },
  red: {
    bg: "bg-red-500",
    light: "bg-red-50",
    text: "text-red-700",
    glow: "shadow-red-200/60",
  },
    pink: {
    bg: "bg-pink-500",
    light: "bg-pink-50",
    text: "text-pink-700",
    glow: "shadow-pink-200/60",
  },
      yellow: {
    bg: "bg-yellow-500",
    light: "bg-yellow-50",
    text: "text-yellow-700",
    glow: "shadow-yellow-200/60",
  },
};

function Card({ icon, label, value, variant = "blue" }: CardProps) {
  const v = styles[variant];

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl p-4 flex items-center gap-3
        bg-white border border-gray-100
        shadow-sm hover:shadow-lg transition-all
      `}
    >
      {/* LEFT ACCENT BAR */}
      <div className={`absolute left-0 top-0 h-full w-1 ${v.bg}`} />

      {/* ICON */}
      <div
        className={`p-2 rounded-lg ${v.light} ${v.text} shadow-sm`}
      >
        {icon}
      </div>

      {/* TEXT */}
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          {label}
        </p>

        <p className={`text-2xl font-bold ${v.text}`}>
          {value}
        </p>
      </div>

      {/* GLOW DOT */}
      <div className={`w-2 h-2 rounded-full ${v.bg} opacity-70`} />
    </div>
  );
}

export default function Summary({ voucherId }: { voucherId: number }) {

  const [summary, setSummary] = useState<VoucherSummary | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await getVoucherSummary(voucherId);
      setSummary(res.data);
    };

    fetchSummary();
  }, [voucherId]);
  console.log("Voucher Summary:", summary);

  if (!summary) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6">

      {/* SỐ LƯỢNG */}
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-3 uppercase">
          Số lượng voucher
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <Card icon={<Package size={18} />} label="Tổng số" value={summary.totalQuantity} variant="blue" />
          <Card icon={<Boxes size={18} />} label="Còn lại" value={summary.remainingQuantity} variant="green" />
          <Card icon={<Ticket size={18} />} label="Có thể dùng" value={summary.availableCount} variant="purple" />
        </div>
      </div>

      {/* HOẠT ĐỘNG */}
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-3 uppercase">
          Hoạt động người dùng
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <Card icon={<ShoppingBag size={18} />} label="Đã nhận" value={summary.acquiredCount} variant="orange" />
          <Card icon={<CheckCircle size={18} />} label="Đã sử dụng" value={summary.usedCount} variant="yellow" />
          <Card icon={<Percent size={18} />} label="Tỷ lệ sử dụng" value={`${summary.usageRate}%`} variant="pink" />

        </div>
      </div>

      {/* TRẠNG THÁI */}
      {/* <div>
        <p className="text-sm font-semibold text-gray-500 mb-3 uppercase">
          Trạng thái
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <Card icon={<XCircle size={18} />} label="Đã kết thúc" value={summary.endedCount} />
          <Card icon={<XCircle size={18} />} label="Hết hạn" value={summary.expiredCount} />
        </div>
      </div> */}

    </div>
  );
}