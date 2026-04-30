'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getReportTypeDetail,
  updateReportType,
} from "@/api/admin/api";
import { toast } from "sonner";

export default function UpdateReportTypePage() {
  const { id } = useParams();
  const router = useRouter();

  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const res = await getReportTypeDetail(Number(id));
      const data = res.data;

      setTypeName(data.typeName);
      setDescription(data.description || "");
      setIsActive(data.isActive);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được dữ liệu");
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!typeName.trim()) {
      toast.error("Tên loại không được để trống");
      return;
    }

    try {
      setSaving(true);

      await updateReportType(Number(id), {
        typeName: typeName.trim(),
        description: description.trim(),
        isActive,
      });

      toast.success("Cập nhật thành công");

      setTimeout(() => {
        router.push("/admin/report-management/report-types");
      }, 800);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Cập nhật loại báo cáo thất bại";
      toast.error(errorMessage);
    }

    setSaving(false);
  };

  if (loading) return <Skeleton />;

  return (
    <div className="max-w-xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Cập nhật loại báo cáo #{id}
        </h1>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 cursor-pointer border rounded-lg hover:bg-gray-100"
        >
          ← Trở lại
        </button>
      </div>

      {/* FORM */}
      <div className="max-w-2xl bg-white rounded-2xl shadow p-6 space-y-6">

        {/* TYPE NAME */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tên loại <span className="text-red-500">*</span>
          </label>

          <input
            value={typeName}
            onChange={(e) => setTypeName(e.target.value.toUpperCase())}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#B388EB]"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Mô tả
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#B388EB]"
          />
        </div>

        {/* ACTIVE TOGGLE */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">
            Kích hoạt loại báo cáo
          </span>
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 cursor-pointer border rounded-lg hover:bg-gray-100"
          >
            Hủy
          </button>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="px-5 py-2 cursor-pointer bg-[#B388EB] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* SKELETON */
function Skeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-6 w-60 bg-gray-200 rounded mb-6"></div>

      <div className="bg-white p-6 rounded-xl space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}