"use client";

import { Voucher } from "@/api/venue/vouchers/type";
import Link from "next/link";
import { Calendar, Tag, Package, MapPin } from "lucide-react";

type Props = {
  vouchers: Voucher[];
  loading: boolean;
};

const STATUS_CONFIG = {
  DRAFTED: { label: "Nháp", color: "bg-purple-100 text-purple-600" },
  PENDING: { label: "Chờ duyệt", color: "bg-pink-100 text-pink-600" },
  APPROVED: { label: "Đã duyệt", color: "bg-indigo-100 text-indigo-600" },
  REJECTED: { label: "Từ chối", color: "bg-rose-100 text-rose-600" },
  ACTIVE: { label: "Hoạt động", color: "bg-fuchsia-100 text-fuchsia-600" },
  ENDED: { label: "Kết thúc", color: "bg-gray-100 text-gray-500" },
};

export default function ListVoucher({ vouchers, loading }: Props) {

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-purple-100 p-4 animate-pulse">
            <div className="h-4 bg-purple-100 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-purple-100 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-purple-100 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!vouchers.length) {
    return (
      <div className="bg-white rounded-xl border border-purple-100 p-12 text-center">
        <p className="text-gray-500">Không có voucher nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">

      {vouchers.map((v) => {
        const statusConfig =
          STATUS_CONFIG[v.status as keyof typeof STATUS_CONFIG] ||
          STATUS_CONFIG.DRAFTED;

        return (
          <div
            key={v.id}
            className="bg-white border border-purple-100 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-pink-100 transition-all duration-200"
          >

            {/* Content */}
            <div className="p-4 space-y-3">

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] text-gray-800">
                {v.title}
              </h3>

              {/* Code */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Tag size={12} className="text-purple-400" />
                <span className="font-mono">{v.code}</span>
              </div>

              {/* Discount */}
              <p className="text-lg font-bold text-pink-600">
                {v.discountType === "FIXED_AMOUNT"
                  ? `${v.discountAmount?.toLocaleString()} ₫`
                  : `${v.discountPercent}%`}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Package size={12} className="text-purple-400" />
                <span>
                  Còn lại: {v.remainingQuantity}/{v.quantity}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={12} className="text-purple-400" />
                <span>
                  Bắt đầu:{" "}
                  {new Date(v.startDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {v.locations?.map((l) => (
                  <span
                    key={l.venueLocationId}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-600"
                  >
                    {l.venueLocationName}
                  </span>
                ))}
              </div>
            </div>


            {/* Action */}
            <Link
              href={`/venue/voucher/${v.id}`}
              className="block text-center bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 py-2.5 text-sm font-medium text-purple-700 transition-all border-t border-purple-100"
            >
              Quản lý
            </Link>
          </div>
        );
      })}

    </div>
  );
}