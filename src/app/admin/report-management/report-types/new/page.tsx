'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReportType } from "@/api/admin/api";
import { toast } from "sonner";

export default function CreateReportTypePage() {
    const router = useRouter();

    const [typeName, setTypeName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!typeName.trim()) {
            toast.error("Tên loại không được để trống");
            return;
        }

        try {
            setLoading(true);

            await createReportType({
                typeName,
                description,
            });

            toast.success("Tạo loại báo cáo thành công");

            setTimeout(() => {
                router.push("/admin/report-management/report-types");
            }, 800);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Tạo loại báo cáo thất bại";
            toast.error(errorMessage);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto p-6">

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tạo loại báo cáo
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Thêm loại báo cáo mới cho hệ thống
                    </p>
                </div>

                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
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
                        onChange={(e) => setTypeName(e.target.value)}
                        placeholder="VD: SPAM, ABUSE..."
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
                        placeholder="Mô tả loại báo cáo..."
                        rows={4}
                        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#B388EB]"
                    />
                </div>

                {/* ACTION */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 bg-[#B388EB] text-white rounded-lg hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Đang tạo..." : "Tạo mới"}
                    </button>
                </div>

            </div>
        </div>
    );
}