import React from "react";
import { EvidenceSnapshot } from "@/api/admin/type";

export default function VoucherItemSnapshot({
  snapshot,
}: {
  snapshot: Extract<EvidenceSnapshot, { targetType: "VOUCHER_ITEM" }>;
}) {
  const data = snapshot.data;

  const getStatusLabel = () => {
    switch (data.Status) {
      case "USED":
        return "Đã sử dụng";
      case "UNUSED":
        return "Chưa sử dụng";
      case "EXPIRED":
        return "Hết hạn";
      default:
        return data.Status;
    }
  };

  const getStatusColor = () => {
    switch (data.Status) {
      case "USED":
        return "bg-green-100 text-green-600";
      case "UNUSED":
        return "bg-blue-100 text-blue-600";
      case "EXPIRED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">
          {data.VoucherTitle}
        </h3>
        <span className="text-xs text-gray-400">
          ID: {data.Id}
        </span>
      </div>

      {/* Code */}
      <div className="bg-gray-50 border rounded-xl px-4 py-3 text-center">
        <p className="text-xs text-gray-500">Mã voucher</p>
        <p className="text-lg font-mono font-semibold tracking-widest text-gray-800">
          {data.ItemCode}
        </p>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Người sở hữu:</strong> {data.MemberName}</p>
        <p><strong>ID người dùng:</strong> {data.MemberId}</p>
        <p><strong>ID voucher:</strong> {data.VoucherId}</p>
      </div>

      {/* Time */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Nhận lúc:</strong>{" "}
          {new Date(data.AcquiredAt).toLocaleString()}
        </p>

        <p>
          <strong>Hết hạn:</strong>{" "}
          {new Date(data.ExpiredAt).toLocaleString()}
        </p>

        {data.UsedAt && (
          <p>
            <strong>Đã dùng lúc:</strong>{" "}
            {new Date(data.UsedAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="flex justify-between items-center">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor()}`}
        >
          {getStatusLabel()}
        </span>

        <span className="text-xs text-gray-400">
          Ghi nhận lúc: {new Date(snapshot.capturedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}