import { disableVoucher } from "@/api/admin/api";
import { Voucher } from "@/api/admin/type";
import { AlignLeft, Ban, CalendarDays, Coins, Hash, ListFilterIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

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
      case "DISABLED":
        return "bg-blue-50 text-blue-600 border-blue-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  const [showDisable, setShowDisable] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="group flex gap-5 rounded-2xl p-5 bg-white border border-violet-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      {/* Image */}
      <div className="w-42 h-42 shrink-0 rounded-xl overflow-hidden bg-gray-100">
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
          {(voucher.status === "APPROVED" || voucher.status === "ACTIVE") && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDisable(true);
              }}
              className="p-2 rounded-lg cursor-pointer bg-red-50 text-red-500 hover:bg-red-100 transition"
              title="Vô hiệu hóa voucher"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Code */}
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Hash className="w-4 h-4 text-pink-400" />
          <span>
            Mã:{" "}
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
            {" "}→{" "}
            {voucher.endDate
              ? new Date(voucher.endDate).toLocaleDateString("vi-VN")
              : "Chưa đặt"}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1 text-sm">
          <div className="text-pink-500 font-medium flex items-center gap-2">
            <ListFilterIcon className="w-4 h-4" /> Số lượng: {voucher.remainingQuantity}/{voucher.quantity}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-1 text-sm">
          <div className="flex items-center gap-2 text-violet-600 font-medium">
            <Coins className="w-4 h-4" />
            {voucher.pointPrice.toLocaleString("vi-VN")} điểm
          </div>
        </div>

      </div>
      {showDisable && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-[400px] space-y-4 shadow-xl">
            <h3 className="font-semibold text-lg text-gray-800">
              Vô hiệu hóa voucher
            </h3>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do..."
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              rows={4}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDisable(false)}
                className="px-4 py-2 text-sm rounded-lg border"
              >
                Hủy
              </button>

              <button
                disabled={!reason.trim() || loading}
                onClick={async () => {
                  try {
                    setLoading(true);

                    const res = await disableVoucher(voucher.id, { reason });

                    console.log("Disable API response:", res);

                    toast.success("Đã vô hiệu hóa voucher");
                    console.log("Voucher disabled:", voucher.id);

                    // window.location.reload();
                  } catch (error: any) {
                    toast.error(error.message || "Thất bại");
                    console.log("Error disabling voucher:", error);
                  } finally {
                    setLoading(false);
                  }
                }}
                className={`px-4 py-2 text-sm rounded-lg text-white transition
            ${!reason.trim() || loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                  }`}
              >
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}