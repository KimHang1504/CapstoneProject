"use client";

import { useEffect, useState, useMemo } from "react";
import { getMySubscriptions } from "@/api/venue/subscription/api";
import { MySubscription } from "@/api/venue/subscription/type";

const statusConfig: Record<string, { label: string; badge: string; dot: string }> = {
  ACTIVE:          { label: "Đang hoạt động", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  CANCELLED:       { label: "Đã hủy",         badge: "bg-gray-100 text-gray-500 border-gray-200",         dot: "bg-gray-400" },
  PENDING_PAYMENT: { label: "Chờ thanh toán", badge: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-400" },
  REFUNDED:        { label: "Đã hoàn tiền",   badge: "bg-blue-50 text-blue-600 border-blue-200",          dot: "bg-blue-400" },
  EXPIRED:         { label: "Hết hạn",        badge: "bg-rose-50 text-rose-600 border-rose-200",          dot: "bg-rose-400" },
};

const ITEMS_PER_PAGE = 5;

export default function SubscriptionTransactionPage() {
  const [subs, setSubs] = useState<MySubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getMySubscriptions()
      .then((res) => setSubs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  console.log("My subscriptions:", subs);
  const filtered = useMemo(() => {
    return subs
      .filter((s) => statusFilter === "ALL" || s.status === statusFilter)
      .filter((s) => s.venueName.toLowerCase().includes(search.toLowerCase()));
  }, [subs, statusFilter, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, search]);

  const countByStatus = (value: string) =>
    value === "ALL" ? subs.length : subs.filter((s) => s.status === value).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">Subscription</p>
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử đăng ký gói</h1>
          <p className="text-sm text-gray-400 mt-1">Toàn bộ gói subscription bạn đã mua</p>
        </div>


        {/* Filters */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Tất cả",         value: "ALL" },
              { label: "Đang hoạt động", value: "ACTIVE" },
              { label: "Chờ thanh toán", value: "PENDING_PAYMENT" },
              { label: "Đã hủy",         value: "CANCELLED" },
              { label: "Đã hoàn tiền",   value: "REFUNDED" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  statusFilter === f.value
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                    : "bg-white text-gray-500 border border-violet-100 hover:border-violet-300"
                }`}
              >
                {f.label} ({countByStatus(f.value)})
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên địa điểm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-violet-200 rounded-full pl-9 pr-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white shadow-sm"
            />
          </div>
        </div>


        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-violet-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="text-5xl mb-4">📭</span>
            <p className="text-lg font-medium">Không có kết quả</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedData.map((sub) => {
              const st = statusConfig[sub.status] ?? statusConfig["CANCELLED"];
              return (
                <div key={sub.id} className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5 flex items-center gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`w-1 h-14 rounded-full ${st.dot} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-gray-800 truncate">{sub.venueName}</p>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${st.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs text-violet-600 font-medium">{sub.package.packageName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub.package.description}</p>
                    {/* <p className="text-xs text-gray-300 mt-1">Đăng ký: {new Date(sub.createdAt).toLocaleDateString("vi-VN")}</p> */}
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    {sub.startDate ? (
                      <>
                        <p className="text-xs text-gray-400">Bắt đầu</p>
                        <p className="text-sm font-medium text-gray-700">{new Date(sub.startDate).toLocaleDateString("vi-VN")}</p>
                        <p className="text-xs text-gray-400 mt-1">Kết thúc</p>
                        <p className="text-sm font-medium text-gray-700">{sub.endDate ? new Date(sub.endDate).toLocaleDateString("vi-VN") : "—"}</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Chưa kích hoạt</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400 mb-0.5">{sub.package.durationDays} ngày</p>
                    <p className="text-base font-bold text-violet-600">{sub.package.price.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">VND</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-violet-100">
            <p className="text-sm text-gray-500">
              Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} trong tổng số {filtered.length} kết quả
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-violet-200 text-sm font-medium text-gray-700 hover:bg-violet-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-violet-50 border border-violet-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-violet-200 text-sm font-medium text-gray-700 hover:bg-violet-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
