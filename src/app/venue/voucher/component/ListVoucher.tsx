"use client";

import { Voucher } from "@/api/venue/vouchers/type";
import Link from "next/link";
import { Calendar, Tag, Package } from "lucide-react";

type Props = {
  vouchers: Voucher[];
  loading: boolean;
};

const STATUS_CONFIG = {
  DRAFTED: { label: "Nháp", color: "bg-gray-100 text-gray-600" },
  PENDING: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "Đã duyệt", color: "bg-blue-100 text-blue-700" },
  REJECTED: { label: "Từ chối", color: "bg-red-100 text-red-700" },
  ACTIVE: { label: "Hoạt động", color: "bg-green-100 text-green-700" },
  ENDED: { label: "Kết thúc", color: "bg-gray-100 text-gray-500" },
};

export default function ListVoucher({ vouchers, loading }: Props) {

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!vouchers.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Không có voucher nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">

      {vouchers.map((v) => {
        const statusConfig = STATUS_CONFIG[v.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.DRAFTED;

        return (
          <div
            key={v.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >

            {/* Content */}
            <div className="p-4 space-y-3">
              
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                {v.title}
              </h3>

              {/* Code */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Tag size={12} />
                <span className="font-mono">{v.code}</span>
              </div>

              {/* Discount */}
              <p className="text-lg font-bold text-orange-600">
                {v.discountType === "FIXED_AMOUNT"
                  ? `${v.discountAmount?.toLocaleString()} ₫`
                  : `${v.discountPercent}%`}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Package size={12} />
                <span>Còn lại: {v.remainingQuantity}/{v.quantity}</span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={12} />
                <span>Bắt đầu: {new Date(v.startDate).toLocaleDateString('vi-VN')}</span>
              </div>

            </div>

            {/* Action */}
            <Link
              href={`/venue/voucher/${v.id}`}
              className="block text-center bg-gray-50 hover:bg-gray-100 py-2.5 text-sm font-medium text-gray-700 transition-colors border-t border-gray-200"
            >
              Quản lý
            </Link>

          </div>
        );
      })}

    </div>
  );
}
