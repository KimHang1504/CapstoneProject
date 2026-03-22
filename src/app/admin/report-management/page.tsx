'use client';
import { getReports } from "@/api/admin/api";
import { Report } from "@/api/admin/type";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

export default function ReportPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [status, setStatus] = useState<Report["status"] | "">("");
    const [targetType, setTargetType] = useState<Report["targetType"] | "">("");

    const router = useRouter();
    useEffect(() => {
        fetchReports();
    }, [page, status, targetType]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await getReports(page, PAGE_SIZE, targetType, status);
            setReports(res.data.reports);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">
                    Quản lí báo cáo
                </h1>

                <button
                    onClick={fetchReports}
                    className="bg-[#B388EB] text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
                >
                    Tải lại
                </button>
            </div>

            {/* FILTER CARD */}
            <div className="bg-white p-4 rounded-2xl shadow mb-6 flex gap-4 items-center">
                <select
                    value={status}
                    onChange={(e) => {
                        setPage(1);
                        setStatus(e.target.value as Report["status"] | "");
                    }}
                    className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#B388EB]"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                </select>

                <select
                    value={targetType}
                    onChange={(e) => {
                        setPage(1);
                        setTargetType(e.target.value as Report["targetType"] | "");
                    }}
                    className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#B388EB]"
                >
                    <option value="">Tất cả</option>
                    <option value="POST">POST</option>
                    <option value="COMMENT">COMMENT</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="USER">USER</option>
                    <option value="VENUE">VENUE</option>
                </select>

                <button
                    onClick={() => {
                        setStatus("");
                        setTargetType("");
                        setPage(1);
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                    Mặc định
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="p-4 text-left">ID</th>
                            <th className="p-4 text-left">Người báo cáo</th>
                            <th className="p-4 text-left">Mục tiêu</th>
                            <th className="p-4 text-left">Lý do</th>
                            <th className="p-4 text-left">Trạng thái</th>
                            <th className="p-4 text-left">Được tạo</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonRow key={i} />
                            ))
                        ) : reports.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center p-10 text-gray-400">
                                    Không tìm thấy báo cáo
                                </td>
                            </tr>
                        ) : (
                            reports.map((r) => (
                                <tr
                                    key={r.id}
                                    onClick={() => router.push(`/admin/report-management/${r.id}`)}
                                    className="border-t border-gray-300 hover:bg-purple-50 transition cursor-pointer"
                                >
                                    <td className="p-4 font-medium">{r.id}</td>
                                    <td className="p-4">{r.reporterName}</td>
                                    <td className="p-4">
                                        <span className="bg-gray-100 px-2 py-1 rounded">
                                            {r.targetType}
                                        </span>
                                    </td>
                                    <td className="p-4">{r.reason}</td>
                                    <td className="p-4">
                                        <StatusBadge status={r.status} />
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(r.createdAt).toLocaleString()}
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
                    className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        className={`px-3 py-1 rounded-lg border ${page === p
                                ? "bg-[#B388EB] text-white border-[#B388EB]"
                                : "hover:bg-gray-100"
                            }`}
                        onClick={() => setPage(p)}
                    >
                        {p}
                    </button>
                ))}

                <button
                    className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

/* STATUS BADGE */
function StatusBadge({ status }: { status: string }) {
    const style =
        status === "PENDING"
            ? "bg-yellow-100 text-yellow-700"
            : status === "REJECTED"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600";

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}>
            {status}
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