"use client";

import { Voucher } from "@/api/venue/vouchers/type";
import Link from "next/link";
import { Calendar, Tag, Package, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteVoucher } from "@/api/venue/vouchers/api";
import { toast } from "sonner";

type Props = {
  vouchers: Voucher[];
  loading: boolean;
};

const STATUS_CONFIG = {
  DRAFTED: { label: "Nháp", color: "bg-gray-100 text-gray-500" },
  PENDING: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-600" },
  APPROVED: { label: "Đã duyệt", color: "bg-indigo-100 text-indigo-600" },
  REJECTED: { label: "Từ chối", color: "bg-rose-100 text-rose-600" },
  ACTIVE: { label: "Hoạt động", color: "bg-green-100 text-green-600" },
  ENDED: { label: "Kết thúc", color: "bg-pink-100 text-pink-600" },
};

export default function ListVoucher({ vouchers, loading }: Props) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [localVouchers, setLocalVouchers] = useState<Voucher[]>(vouchers);

  useEffect(() => {
    setLocalVouchers(vouchers);
  }, [vouchers]);

  const handleImageError = (voucherId: number) => {
    setImageErrors(prev => new Set(prev).add(voucherId));
  };

  const handleDelete = (id: number) => {
    toast("Bạn có chắc muốn xóa voucher này không?", {
      action: {
        label: "Xóa",
        onClick: async () => {
          const deletePromise = deleteVoucher(id);

          toast.promise(deletePromise, {
            loading: "Đang xóa voucher...",
            success: () => {
              window.location.reload();
              return "Xóa voucher thành công";
            },
            error: (err) => err.message || "Xóa thất bại",
          });
        },
      },
      cancel: {
        label: "Hủy",
        onClick: () => { },
      }
    });
  };

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
      <div className="p-12 text-center">
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

        const imageUrl = imageErrors.has(v.id) || !v.imageUrl ? "/voucher_thumbnail.png" : v.imageUrl;

        return (
          <div
            key={v.id}
            className="bg-white border border-purple-100 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-pink-100 transition-all duration-200"
          >

            {/* Image */}
            <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
              <img
                src={imageUrl}
                alt={v.title}
                className="w-full h-full object-cover"
                onError={() => handleImageError(v.id)}
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>

                {v.status === "DRAFTED" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(v.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition"
                    title="Xóa voucher"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-sm line-clamp-2 min-h-10 text-gray-800">
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
              <div className="overflow-hidden">
                <div className="flex gap-1 items-center flex-wrap">
                  {v.locations && v.locations.length > 0 && (
                    <>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-600">
                        {v.locations[0].venueLocationName}
                      </span>
                      {v.locations.length > 1 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 font-semibold">
                          +{v.locations.length - 1}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>


            {/* Action */}
            <Link
              href={`/venue/voucher/myvoucher/${v.id}`}
              className="block text-center bg-linear-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 py-2.5 text-sm font-medium text-purple-700 transition-all border-t border-purple-100"
            >
              Quản lý
            </Link>
          </div>
        );
      })}

    </div>
  );
}