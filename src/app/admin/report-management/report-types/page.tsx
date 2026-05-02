'use client';

import { useEffect, useState } from "react";
import { deleteReportType, getReportTypes } from "@/api/admin/api";
import { ReportType } from "@/api/admin/type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const PAGE_SIZE = 5;

export default function ReportTypePage() {
    const [types, setTypes] = useState<ReportType[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const router = useRouter();

    useEffect(() => {
        fetchTypes();
    }, [page]);

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const res = await getReportTypes(page, PAGE_SIZE);
            const data = res.data;

            setTypes(data.items);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        toast("Bạn có chắc muốn xóa loại báo cáo này không?", {
            action: {
                label: "Xóa",
                onClick: async () => {
                    try {
                        await deleteReportType(id);
                        toast.success("Đã xóa loại báo cáo");
                        fetchTypes();
                    } catch (err) {
                        console.error(err);
                        const errorMessage = err instanceof Error ? err.message : "Xóa loại báo cáo thất bại";
                        toast.error(errorMessage);
                    }
                }
            },
            cancel: {
                label: "Hủy",
                onClick: () => { }
            }
        });
    }


    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Loại báo cáo
                </h1>

                <div className="flex gap-3">
                    <button
                        onClick={() => router.push("/admin/report-management/report-types/new")}
                        className="bg-[#B388EB] text-white px-4 py-2 rounded-lg shadow hover:opacity-90 cursor-pointer"
                    >
                        + Tạo mới
                    </button>

                    <button
                        onClick={fetchTypes}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        Tải lại
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="p-4 text-left">ID</th>
                            <th className="p-4 text-left">Tên</th>
                            <th className="p-4 text-left">Mô tả</th>
                            <th className="p-4 text-left">Trạng thái</th>
                            <th className="p-4 text-left">Ngày tạo</th>
                            <th className="p-4 text-left">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <SkeletonRow key={i} />
                            ))
                        ) : types.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center p-10 text-gray-400">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            types.map((t) => (
                                <tr
                                    key={t.id}
                                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                                >
                                    <td className="p-4 font-medium">{t.id}</td>

                                    <td className="p-4 font-semibold">
                                        {t.typeName}
                                    </td>

                                    <td className="p-4 text-gray-600">
                                        {t.description || "—"}
                                    </td>

                                    <td className="p-4">
                                        <StatusBadge active={t.isActive} />
                                    </td>

                                    <td className="p-4 text-gray-500">
                                        {new Date(t.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* ACTION */}
                                    <td className="p-4 flex gap-5">
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="text-sm text-red-500 hover:text-red-700 transition cursor-pointer"
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            onClick={() => router.push(`/admin/report-management/report-types/${t.id}/edit`)}
                                            className="text-sm text-blue-500 hover:text-blue-700 transition cursor-pointer"
                                        >
                                            Sửa
                                        </button>
                                    </td>


                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-6 gap-2">
                <button
                    className="px-3 py-1 cursor-pointer border rounded-lg hover:bg-gray-100"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Trang trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        className={`px-3 py-1 cursor-pointer rounded-lg border ${page === p
                            ? "bg-[#B388EB] text-white border-[#B388EB]"
                            : "hover:bg-gray-100"
                            }`}
                        onClick={() => setPage(p)}
                    >
                        {p}
                    </button>
                ))}

                <button
                    className="px-3 py-1 border cursor-pointer rounded-lg hover:bg-gray-100"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
}

/* STATUS */
function StatusBadge({ active }: { active: boolean }) {
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${active
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
                }`}
        >
            {active ? "Hoạt động" : "Ngưng hoạt động"}
        </span>
    );
}

/* SKELETON */
function SkeletonRow() {
    return (
        <tr className="border-t animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
                <td key={i} className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                </td>
            ))}
        </tr>
    );
}