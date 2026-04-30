'use client';
import { getReports } from "@/api/admin/api";
import { Report } from "@/api/admin/type";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { 
  RefreshCw, 
  ChevronDown, 
  X, 
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Flag,
  User,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  MessageSquare,
  Star,
  MapPin
} from "lucide-react";

const PAGE_SIZE = 5;

export default function ReportPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [status, setStatus] = useState<Report["status"] | "">("");
    const [targetType, setTargetType] = useState<Report["targetType"] | "">("");
    const [searchQuery, setSearchQuery] = useState("");

    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [targetTypeDropdownOpen, setTargetTypeDropdownOpen] = useState(false);

    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const targetTypeDropdownRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    useEffect(() => {
        fetchReports();
    }, [page, status, targetType]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setStatusDropdownOpen(false);
            }
            if (targetTypeDropdownRef.current && !targetTypeDropdownRef.current.contains(event.target as Node)) {
                setTargetTypeDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await getReports(page, PAGE_SIZE, targetType, status);
            setReports(res.data.reports);
            setTotalPages(res.data.totalPages);
            setTotalCount(res.data.totalCount || 0);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    // Filter reports based on search query (reporter name or reason)
    const filteredReports = reports.filter((r) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            r.reporterName?.toLowerCase().includes(query) ||
            r.reason?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <div className="max-w-7xl mx-auto p-6 space-y-5">
                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                            <Flag className="w-6 h-6 text-purple-600" />
                            Quản lý báo cáo
                        </h1>
                        <p className="text-sm text-slate-500 mt-1.5">
                            {totalCount} báo cáo
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push("/admin/report-management/report-types")}
                            className="px-4 py-2.5 cursor-pointer border border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 text-sm font-medium"
                        >
                            <FileText className="w-4 h-4" />
                            Loại báo cáo
                        </button>

                        <button
                            onClick={fetchReports}
                            disabled={loading}
                            className="group px-4 py-2.5 cursor-pointer bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                            <span className="text-sm font-medium">Tải lại</span>
                        </button>
                    </div>
                </div>

                {/* FILTER CARD */}
                <div className="">
                    <div className="flex gap-3 flex-wrap items-center">
                        
                        {/* SEARCH */}
                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo người báo cáo hoặc lý do..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-purple-300 rounded-xl text-sm text-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* STATUS DROPDOWN */}
                        <div className="relative" ref={statusDropdownRef}>
                            <button
                                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                className="min-w-37.5 cursor-pointer px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-50 transition-all duration-200 flex items-center justify-between shadow-sm"
                            >
                                <span className="text-slate-700">
                                    {status === "" ? "Tất cả trạng thái" : 
                                     status === "PENDING" ? "Chờ xử lý" :
                                     status === "APPROVED" ? "Đã duyệt" : "Từ chối"}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {statusDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                                    {[
                                        { value: "", label: "Tất cả trạng thái", icon: null },
                                        { value: "PENDING", label: "Chờ xử lý", icon: Clock },
                                        { value: "APPROVED", label: "Đã duyệt", icon: CheckCircle },
                                        { value: "REJECTED", label: "Từ chối", icon: XCircle },
                                    ].map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setPage(1);
                                                    setStatus(option.value as Report["status"] | "");
                                                    setStatusDropdownOpen(false);
                                                }}
                                                className={`w-full cursor-pointer px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 ${
                                                    status === option.value ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                                }`}
                                            >
                                                {Icon && <Icon className="w-4 h-4" />}
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* TARGET TYPE DROPDOWN */}
                        <div className="relative" ref={targetTypeDropdownRef}>
                            <button
                                onClick={() => setTargetTypeDropdownOpen(!targetTypeDropdownOpen)}
                                className="min-w-[150px] cursor-pointer px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200 flex items-center justify-between shadow-sm"
                            >
                                <span className="text-slate-700">
                                    {targetType === "" ? "Tất cả loại" : targetType}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${targetTypeDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {targetTypeDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                                    {[
                                        { value: "", label: "Tất cả loại", icon: null },
                                        { value: "POST", label: "Bài viết", icon: FileText },
                                        { value: "COMMENT", label: "Bình luận", icon: MessageSquare },
                                        { value: "REVIEW", label: "Đánh giá", icon: Star },
                                        { value: "USER", label: "Người dùng", icon: User },
                                        { value: "VENUE", label: "Địa điểm", icon: MapPin },
                                    ].map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setPage(1);
                                                    setTargetType(option.value as Report["targetType"] | "");
                                                    setTargetTypeDropdownOpen(false);
                                                }}
                                                className={`w-full cursor-pointer px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 ${
                                                    targetType === option.value ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                                }`}
                                            >
                                                {Icon && <Icon className="w-4 h-4" />}
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {(status || targetType || searchQuery) && (
                            <button
                                onClick={() => {
                                    setStatus("");
                                    setTargetType("");
                                    setSearchQuery("");
                                    setPage(1);
                                }}
                                className="text-sm cursor-pointer text-slate-500 hover:text-slate-700 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Người báo cáo</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Mục tiêu</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Lý do</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Được tạo</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))
                                ) : filteredReports.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Flag className="w-16 h-16 mb-3 text-slate-300" strokeWidth={1.5} />
                                                <p className="text-sm font-medium text-slate-600">Không tìm thấy báo cáo</p>
                                                <p className="text-xs text-slate-400 mt-1">Các báo cáo sẽ hiển thị ở đây</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReports.map((r) => (
                                        <tr
                                            key={r.id}
                                            onClick={() => router.push(`/admin/report-management/${r.id}`)}
                                            className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors duration-150 cursor-pointer"
                                        >
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-semibold text-slate-700">#{r.id}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                                    {r.reporterName}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <TargetTypeBadge type={r.targetType} />
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-slate-600 line-clamp-2">{r.reason}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge status={r.status} />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm text-slate-600">
                                                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {new Date(r.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">
                                    Hiển thị <span className="font-semibold text-slate-800">{((page - 1) * PAGE_SIZE) + 1}</span> đến{" "}
                                    <span className="font-semibold text-slate-800">{Math.min(page * PAGE_SIZE, totalCount)}</span> trong tổng số{" "}
                                    <span className="font-semibold text-slate-800">{totalCount}</span> kết quả
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    className="p-2 text-sm border cursor-pointer border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang đầu"
                                >
                                    <ChevronsLeft className="w-4 h-4 text-slate-600" />
                                </button>
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className="p-2 text-sm border cursor-pointer border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang trước"
                                >
                                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (page <= 3) {
                                            pageNum = i + 1;
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = page - 2 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`min-w-[36px] px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                    page === pageNum
                                                        ? "bg-purple-600 text-white shadow-md"
                                                        : "border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                    className="p-2 cursor-pointer text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang sau"
                                >
                                    <ChevronRight className="w-4 h-4 text-slate-600" />
                                </button>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    disabled={page === totalPages}
                                    className="p-2 cursor-pointer text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang cuối"
                                >
                                    <ChevronsRight className="w-4 h-4 text-slate-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* TARGET TYPE BADGE */
function TargetTypeBadge({ type }: { type: string }) {
    const config: Record<string, { label: string; icon: any; color: string }> = {
        POST: { label: "Bài viết", icon: FileText, color: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200" },
        COMMENT: { label: "Bình luận", icon: MessageSquare, color: "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200" },
        REVIEW: { label: "Đánh giá", icon: Star, color: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200" },
        USER: { label: "Người dùng", icon: User, color: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200" },
        VENUE: { label: "Địa điểm", icon: MapPin, color: "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-200" },
    };

    const style = config[type] || { label: type, icon: FileText, color: "bg-slate-50 text-slate-700 border-slate-200" };
    const Icon = style.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${style.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {style.label}
        </span>
    );
}

/* STATUS BADGE */
function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; icon: any; color: string }> = {
        PENDING: {
            label: "Chờ xử lý",
            icon: Clock,
            color: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200"
        },
        APPROVED: {
            label: "Đã duyệt",
            icon: CheckCircle,
            color: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200"
        },
        REJECTED: {
            label: "Từ chối",
            icon: XCircle,
            color: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200"
        },
    };

    const style = config[status] || config.PENDING;
    const Icon = style.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${style.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {style.label}
        </span>
    );
}

/* SKELETON */
function SkeletonRow() {
    return (
        <tr className="animate-pulse border-b border-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
                <td key={i} className="px-4 py-4">
                    <div className="h-4 bg-slate-200 rounded-lg w-full"></div>
                </td>
            ))}
        </tr>
    );
}