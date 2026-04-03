"use client";

import { useEffect, useState, useRef } from "react";

import { getTransactions } from "@/api/admin/api";
import { TypeBadge } from "./components/TypeBadge";
import { StatusBadge } from "./components/StatusBadge";
import { Transaction, TransactionStatus, TransactionType } from "@/api/admin/type";
import { 
  RefreshCw, 
  ChevronDown, 
  X, 
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Receipt,
  User,
  Mail
} from "lucide-react";

const PAGE_SIZE = 5;

export default function TransactionPage() {
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [status, setStatus] = useState<TransactionStatus | "">("");
    const [type, setType] = useState<TransactionType | "">("");
    const [userId, setUserId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
    
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const typeDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchData();
    }, [page, status, type, userId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setStatusDropdownOpen(false);
            }
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
                setTypeDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getTransactions(
                page,
                PAGE_SIZE,
                status || undefined,
                type || undefined,
                userId ? Number(userId) : undefined
            );

            setData(res.data.items);
            setTotalPages(res.data.totalPages);
            setTotalCount(res.data.totalCount || 0);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const formatMoney = (amount: number) =>
        amount.toLocaleString("vi-VN") + " ₫";

    // Filter data based on search query (name or email)
    const filteredData = data.filter((t) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            t.userName?.toLowerCase().includes(query) ||
            t.userEmail?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <div className="max-w-7xl mx-auto p-6 space-y-5">

                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                            <Receipt className="w-6 h-6 text-blue-600" />
                            Quản lý giao dịch
                        </h1>
                        <p className="text-sm text-slate-500 mt-1.5">
                            {totalCount} giao dịch
                        </p>
                    </div>

                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="group px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        <span className="text-sm font-medium">Tải lại</span>
                    </button>
                </div>

                {/* FILTER */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex gap-3 flex-wrap items-center">
                        
                        {/* SEARCH */}
                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên hoặc email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* STATUS DROPDOWN */}
                        <div className="relative" ref={statusDropdownRef}>
                            <button
                                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                className="min-w-[150px] px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200 flex items-center justify-between shadow-sm"
                            >
                                <span className="text-slate-700">
                                    {status === "" ? "Tất cả trạng thái" : status}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {statusDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                                    {[
                                        { value: "", label: "Tất cả trạng thái" },
                                        { value: "SUCCESS", label: "SUCCESS" },
                                        { value: "PENDING", label: "PENDING" },
                                        { value: "CANCELLED", label: "CANCELLED" },
                                        { value: "EXPIRED", label: "EXPIRED" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setPage(1);
                                                setStatus(option.value as TransactionStatus | "");
                                                setStatusDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors ${
                                                status === option.value ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* TYPE DROPDOWN */}
                        <div className="relative" ref={typeDropdownRef}>
                            <button
                                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                                className="min-w-[180px] px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200 flex items-center justify-between shadow-sm"
                            >
                                <span className="text-slate-700 truncate">
                                    {type === "" ? "Tất cả loại" : type}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${typeDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {typeDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden max-h-60 overflow-y-auto">
                                    {[
                                        { value: "", label: "Tất cả loại" },
                                        { value: "WALLET_TOPUP", label: "WALLET_TOPUP" },
                                        { value: "MEMBER_SUBSCRIPTION", label: "MEMBER_SUBSCRIPTION" },
                                        { value: "MONEY_TO_POINT", label: "MONEY_TO_POINT" },
                                        { value: "ADS_ORDER", label: "ADS_ORDER" },
                                        { value: "VENUE_SUBSCRIPTION", label: "VENUE_SUBSCRIPTION" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setPage(1);
                                                setType(option.value as TransactionType | "");
                                                setTypeDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors ${
                                                type === option.value ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                     

                        {(status || type || userId || searchQuery) && (
                            <button
                                onClick={() => {
                                    setStatus("");
                                    setType("");
                                    setUserId("");
                                    setSearchQuery("");
                                    setPage(1);
                                }}
                                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">

                            <thead className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Số tiền</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Loại</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Phương thức</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Thời gian</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Receipt className="w-16 h-16 mb-3 text-slate-300" strokeWidth={1.5} />
                                                <p className="text-sm font-medium text-slate-600">Không có giao dịch nào</p>
                                                <p className="text-xs text-slate-400 mt-1">Các giao dịch sẽ hiển thị ở đây</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((t) => (
                                        <tr key={t.transactionId} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors duration-150">
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-semibold text-slate-700">#{t.transactionId}</span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                                        {t.userName}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                        {t.userEmail}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="text-sm font-bold text-blue-600">
                                                    {formatMoney(t.amount)}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <TypeBadge type={t.transactionType} />
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="text-sm text-slate-600">{t.paymentMethod}</span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <StatusBadge status={t.status} />
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="text-sm text-slate-600">
                                                    {new Date(t.createdAt).toLocaleDateString("vi-VN")}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {new Date(t.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
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
                    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm">
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
                                    className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang đầu"
                                >
                                    <ChevronsLeft className="w-4 h-4 text-slate-600" />
                                </button>
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
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
                                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
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
                                    className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang sau"
                                >
                                    <ChevronRight className="w-4 h-4 text-slate-600" />
                                </button>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    disabled={page === totalPages}
                                    className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
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

function SkeletonRow() {
    return (
        <tr className="animate-pulse border-b border-slate-100">
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="px-4 py-4">
                    <div className="h-4 bg-slate-200 rounded-lg w-full"></div>
                </td>
            ))}
        </tr>
    );
}