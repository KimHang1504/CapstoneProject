'use client';

import { useEffect, useState, useCallback } from 'react';
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

export default function AdTransactionPage() {
  const [status, setStatus] = useState('all');
  const [data, setData] = useState<AdsOrderTransaction[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [status, fetchData]);

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
          {data.map(item => <TransactionCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}
