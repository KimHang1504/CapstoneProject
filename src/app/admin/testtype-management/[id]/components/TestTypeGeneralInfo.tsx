import { TestTypeDetail } from "@/api/admin/testtype/type";
import React from "react";

type Props = {
  item: TestTypeDetail;
};

export default function TestTypeGeneralInfo({ item }: Props) {
  const formatDateTime = (value?: string) => {
    if (!value) return "-";

    try {
      return new Date(value).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return value;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">Thông tin chung</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
        <InfoItem label="Mã định danh" value={`#${item.id}`} />
        <InfoItem
          label="Mã bài test"
          value={
            item.code ? (
              <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs text-slate-700">
                {item.code}
              </span>
            ) : (
              "-"
            )
          }
        />
        <InfoItem label="Tên" value={item.name} />
        <InfoItem label="Mô tả" value={item.description || "-"} />
        <InfoItem label="Tổng số câu hỏi" value={item.totalQuestions} />
        <InfoItem label="Phiên bản đang áp dụng" value={`v${item.currentVersion}`} />
        <InfoItem
          label="Trạng thái"
          value={
            <span
              className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${
                item.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {item.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
            </span>
          }
        />
        <InfoItem label="Ngày tạo" value={formatDateTime(item.createdAt)} />
        <InfoItem label="Cập nhật lần cuối" value={formatDateTime(item.updatedAt)} />
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 text-sm font-medium text-slate-500">{label}</div>
      <div className="text-sm text-slate-900">{value}</div>
    </div>
  );
}