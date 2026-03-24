'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { getAdsOrderTransactions } from '@/api/venue/advertisement/api';
import { AdsOrderTransaction } from '@/api/venue/advertisement/type';
import TransactionCard, { STATUS_LABEL } from './components/TransactionCard';
import { Receipt } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'all',       label: 'Tất cả' },
  { value: 'COMPLETED', label: STATUS_LABEL.COMPLETED },
  { value: 'PENDING',   label: STATUS_LABEL.PENDING },
  { value: 'REFUNDED',  label: STATUS_LABEL.REFUNDED },
  { value: 'FAILED',    label: STATUS_LABEL.FAILED },
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
    <div className="p-6 space-y-5 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Lịch sử giao dịch</h1>
          <p className="text-xs text-gray-400 mt-0.5">Các đơn hàng quảng cáo của bạn</p>
        </div>
        <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-4 py-2">
          <Receipt size={15} className="text-violet-500" />
          <span className="text-sm text-gray-600">Tổng đã thanh toán:</span>
          <span className="font-bold text-violet-600">{totalPaid.toLocaleString('vi-VN')} ₫</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setStatus(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
              ${status === opt.value
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'}`}
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
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, data.length)} trong tổng số {data.length} giao dịch
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-violet-50 hover:border-violet-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
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
                          ? "bg-violet-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-violet-50 border border-gray-200 hover:border-violet-300"
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
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-violet-50 hover:border-violet-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
