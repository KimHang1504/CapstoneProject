'use client';

import { useState } from 'react';
import { AdsOrderTransaction, PLACEMENT_LABEL } from '@/api/venue/advertisement/type';
import ImageWithFallback from '@/components/ImageWithFallback';
import { CreditCard, Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export const STATUS_STYLE: Record<string, string> = {
  COMPLETED: 'bg-emerald-100 text-emerald-600',
  PENDING:   'bg-amber-100 text-amber-600',
  REFUNDED:  'bg-sky-100 text-sky-600',
  PAYMENT_FAILED:'bg-rose-100 text-rose-500',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

export const STATUS_LABEL: Record<string, string> = {
  COMPLETED: 'Hoàn thành',
  PENDING:   'Đang chờ',
  REFUNDED:  'Hoàn tiền',
  PAYMENT_FAILED:'Thất bại',
  CANCELLED: 'Đã hủy',
};

const AD_STATUS_STYLE: Record<string, string> = {
  ACTIVE:   'bg-emerald-100 text-emerald-600',
  PENDING:  'bg-amber-100 text-amber-600',
  DRAFT:    'bg-gray-100 text-gray-500',
  REJECTED: 'bg-rose-100 text-rose-500',
  APPROVED: 'bg-blue-100 text-blue-600',
  INACTIVE: 'bg-gray-100 text-gray-400',
};

export const AD_STATUS_LABEL: Record<string, string> = {
  ACTIVE:   'Đang chạy',
  PENDING:  'Đang xét duyệt',
  DRAFT:    'Nháp',
  REJECTED: 'Bị từ chối',
  APPROVED: 'Đã duyệt',
  INACTIVE: 'Không hoạt động',
};
export default function TransactionCard({ item }: { item: AdsOrderTransaction }) {
  const [expanded, setExpanded] = useState(false);
  const ad = item.advertisement;

  return (
    <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4">
        {/* Banner */}
        <div className="relative w-full h-40 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
          <ImageWithFallback
            src={ad.bannerUrl || ''}
            alt={ad.title}
            className="absolute inset-0 object-cover w-full h-full"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 truncate">{ad.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-600 font-medium">
                  {PLACEMENT_LABEL[item.package.placementType as keyof typeof PLACEMENT_LABEL] ?? item.package.placementType}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${AD_STATUS_STYLE[ad.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  QC: {AD_STATUS_LABEL[ad.status] ?? ad.status}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_STYLE[item.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {STATUS_LABEL[item.status] ?? item.status}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0 w-full sm:w-auto">
              <p className={`text-xl sm:text-lg font-bold ${
                item.status === 'REFUNDED' ? 'text-sky-500'
                : item.status === 'COMPLETED' ? 'text-emerald-600'
                : 'text-gray-700'
              }`}>
                {item.status === 'REFUNDED' ? '−' : ''}{item.payment.amount.toLocaleString('vi-VN')} ₫
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <CreditCard size={11} />{item.payment.paymentMethod}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={11} />{new Date(item.payment.paidAt).toLocaleDateString('vi-VN')}
            </span>
            <span>{item.package.name} · {item.package.durationDays} ngày</span>
            <span className="hidden sm:inline">Đơn #{item.id}</span>
          </div>
        </div>
      </div>

      {/* Expand venues */}
      {item.venueLocationAds.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center justify-between px-4 py-2 border-t border-gray-50 text-xs text-gray-400 hover:bg-gray-50 transition"
          >
            <span className="flex items-center gap-1">
              <MapPin size={11} />{item.venueLocationAds.length} địa điểm áp dụng
            </span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <div className="px-4 pb-4 space-y-2">
              {item.venueLocationAds.map(v => (
                <div key={v.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 rounded-xl px-3 py-2 text-xs gap-2">
                  <div>
                    <span className="font-medium text-gray-700">{v.venueName}</span>
                    <span className="text-gray-400 block sm:inline sm:ml-2">
                      {new Date(v.startDate).toLocaleDateString('vi-VN')} → {new Date(v.endDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 w-fit">{v.status}</span>
                </div>
              ))}
              {ad.targetUrl && (
                <a
                  href={ad.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-violet-500 hover:underline mt-1"
                >
                  <ExternalLink size={11} /> Xem trang đích
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
