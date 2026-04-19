import { Voucher } from "@/api/admin/type";
import { AlignLeft, CalendarDays, Coins, Hash } from "lucide-react";
import Link from "next/link";

export default function VoucherCard({ voucher }: { voucher: Voucher }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "DRAFTED":
        return "bg-violet-50 text-violet-600 border-violet-200";
      case "ENDED":
        return "bg-gray-100 text-gray-500 border-gray-200";
      case "REJECTED":
        return "bg-red-50 text-red-500 border-red-200";
      case "PENDING":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "APPROVED":
        return "bg-green-50 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  return (
    <div className="group flex gap-5 rounded-2xl p-5 bg-white border border-violet-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      {/* Image */}
      <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
        {voucher.imageUrl ? (
          <img
            src={voucher.imageUrl}
            alt="voucher"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Không có ảnh
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">

        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <Link
            href={`/admin/voucher-management/voucher/${voucher.id}`}
            className="flex-1"
          >
            <h2 className="font-semibold text-lg text-gray-800 group-hover:text-violet-600 transition">
              {voucher.title}
            </h2>
          </Link>

          <span
            className={`text-xs px-3 py-1 rounded-full border font-semibold ${getStatusColor(
              voucher.status
            )}`}
          >
            {voucher.status === "ACTIVE" && "Hoạt động"}
            {voucher.status === "ENDED" && "Kết thúc"}
            {voucher.status === "PENDING" && "Đang chờ duyệt"}
            {voucher.status === "REJECTED" && "Từ chối"}
            {voucher.status === "DISABLED" && "Vô hiệu hóa"}
            {voucher.status === "APPROVED" && "Đã duyệt"}
          </span>
        </div>

        {/* Code */}
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Hash className="w-4 h-4 text-pink-400" />
          <span>
            Code:{" "}
            <span className="font-medium text-gray-700">
              {voucher.code}
            </span>
          </span>
        </div>

        {/* Description */}
        <div className="flex items-start gap-2 mt-1 text-sm text-gray-500">
          <AlignLeft className="w-4 h-4 text-violet-400 mt-0.5" />
          <p className="line-clamp-2">{voucher.description}</p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 mt-1 text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <CalendarDays className="w-4 h-4 text-purple-400" />
            Từ ngày
          </span>

          <span className="font-medium text-gray-700">
            {voucher.startDate
              ? new Date(voucher.startDate).toLocaleDateString("vi-VN")
              : "Chưa đặt"}
          </span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-3 text-sm">
          <div className="flex items-center gap-2 text-violet-600 font-medium">
            <Coins className="w-4 h-4" />
            {voucher.voucherPrice.toLocaleString("vi-VN")} đ
          </div>

          <div className="text-pink-500 font-medium">
            {voucher.remainingQuantity}/{voucher.quantity}
          </div>
        </div>

      </div>
    </div>
  );
}