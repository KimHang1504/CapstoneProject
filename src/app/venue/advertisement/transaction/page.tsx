'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { getAdsOrderTransactions } from '@/api/venue/advertisement/api';
import { AdsOrderTransaction } from '@/api/venue/advertisement/type';
import TransactionCard, { STATUS_LABEL } from './components/TransactionCard';
import { Receipt } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'all',       label: 'Tất cả' },
  { value: 'COMPLETED', label: STATUS_LABEL.COMPLETED },
  { value: 'REFUNDED',  label: STATUS_LABEL.REFUNDED },
  { value: 'PAYMENT_FAILED',    label: STATUS_LABEL.PAYMENT_FAILED },
  { value: 'CANCELLED', label: STATUS_LABEL.CANCELLED },
];

const ITEMS_PER_PAGE = 5;

export default function AdTransactionPage() {
  const [status, setStatus] = useState('all');
  const [data, setData] = useState<AdsOrderTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async (s: string) => {
    setLoading(true);
    try {
      const res = await getAdsOrderTransactions(s === 'all' ? undefined : s);
      setData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(status);
    setCurrentPage(1);
  }, [status, fetchData]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const totalPaid = data
    .filter(d => d.status === 'COMPLETED')
    .reduce((sum, d) => sum + d.payment.amount, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lịch sử giao dịch quảng cáo</h1>
          <p className="text-sm text-gray-400 mt-1">Các đơn hàng quảng cáo của bạn</p>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Receipt size={24} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">Tổng đã thanh toán</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{totalPaid.toLocaleString('vi-VN')} ₫</p>
              </div>
            </div>
            <div className="w-full sm:w-auto bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <p className="text-xs text-white/70">Tổng giao dịch</p>
              <p className="text-xl font-bold text-white">{data.length}</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`px-3 sm:px-4 py-2 cursor-pointer rounded-full text-xs sm:text-sm font-medium transition-all duration-200
                ${status === opt.value
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
                  : 'bg-white border border-violet-100 text-gray-600 hover:border-violet-300'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            <Receipt size={40} className="opacity-30" />
            <p className="text-sm">Không có giao dịch nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedData.map(item => <TransactionCard key={item.id} item={item} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && data.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-violet-100">
            <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
              Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, data.length)} trong tổng số {data.length} giao dịch
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-2 cursor-pointer rounded-lg border border-violet-200 text-sm font-medium text-gray-700 hover:bg-violet-50 hover:border-violet-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
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
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-violet-50 border border-violet-200 hover:border-violet-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm">
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
                className="px-2 sm:px-3 py-2 cursor-pointer rounded-lg border border-violet-200 text-sm font-medium text-gray-700 hover:bg-violet-50 hover:border-violet-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
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
