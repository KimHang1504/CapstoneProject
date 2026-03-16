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
};

function Card({ icon, label, value }: CardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition">
      <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
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

  if (!summary) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6">

      {/* SỐ LƯỢNG */}
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-3 uppercase">
          Số lượng voucher
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <Card icon={<Package size={18} />} label="Tổng số" value={summary.totalQuantity} />
          <Card icon={<Boxes size={18} />} label="Còn lại" value={summary.remainingQuantity} />
          <Card icon={<Ticket size={18} />} label="Có thể dùng" value={summary.availableCount} />
        </div>
      </div>

      {/* HOẠT ĐỘNG */}
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-3 uppercase">
          Hoạt động người dùng
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <Card icon={<ShoppingBag size={18} />} label="Đã nhận" value={summary.acquiredCount} />
          <Card icon={<CheckCircle size={18} />} label="Đã sử dụng" value={summary.usedCount} />
          <Card icon={<Percent size={18} />} label="Tỷ lệ sử dụng" value={`${summary.usageRate}%`} />

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