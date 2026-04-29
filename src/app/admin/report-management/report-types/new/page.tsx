'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReportType } from "@/api/admin/api";
import { toast } from "sonner";
import { FileText, Plus } from "lucide-react";

const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

const inputClass = "w-full mt-2 border border-violet-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition placeholder-gray-300";

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-0.5">{children}</div>;
}

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
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/40 to-violet-50/30 p-6">
            <div className="max-w-2xl mx-auto space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Tạo loại báo cáo
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Thêm loại báo cáo mới cho hệ thống
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <div className="bg-white rounded-2xl shadow p-8 space-y-7">

                    <FieldWrapper>
                        <label className={labelClass}>Tên loại báo cáo</label>
                        <input
                            value={typeName}
                            onChange={(e) => setTypeName(e.target.value)}
                            placeholder="VD: SPAM, ABUSE, OFFENSIVE..."
                            className={inputClass}
                            required
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <label className={labelClass}>Mô tả</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả chi tiết về loại báo cáo này..."
                            rows={4}
                            className={`${inputClass} resize-none`}
                        />
                    </FieldWrapper>

                    {/* ACTION */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 border cursor-pointer border-violet-200 text-violet-600 rounded-xl hover:bg-violet-50 transition font-medium"
                        >
                            Hủy
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 cursor-pointer bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition font-medium"
                        >
                            <FileText size={18} />
                            {loading ? "Đang tạo..." : "Tạo loại báo cáo"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}