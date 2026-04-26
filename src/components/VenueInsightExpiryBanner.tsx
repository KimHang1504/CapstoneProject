'use client';

import { useEffect, useState } from 'react';
import { getVenueOwnerSubscriptionInfo } from '@/api/venue/dashboard/api';
import { FeatureAccessInfo } from '@/api/venue/dashboard/type';
import { Calendar, AlertCircle, Clock, Package } from 'lucide-react';

export default function VenueInsightExpiryBadge() {
  const [insightAccess, setInsightAccess] = useState<FeatureAccessInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      try {
        const res = await getVenueOwnerSubscriptionInfo();
        if (res.code === 200 && res.data) {
          setInsightAccess(res.data.venueInsightAccess);
        }
      } catch (error) {
        console.error('Failed to fetch subscription info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionInfo();
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 animate-pulse">
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!insightAccess || !insightAccess.hasAccess) {
    return (
      <div className="group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 cursor-help">
        <AlertCircle size={12} className="text-red-600" />
        <span className="text-xs font-medium text-red-700">Chưa kích hoạt</span>
        
        {/* Tooltip */}
        <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-900 mb-1">
                Tính năng chưa được kích hoạt
              </p>
              <p className="text-xs text-gray-600">
                Vui lòng mua gói subscription để sử dụng VENUE_INSIGHT.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { expiryDate, daysRemaining, providingPackages } = insightAccess;

  // Xác định màu sắc dựa trên số ngày còn lại
  const getStatusColor = () => {
    if (!daysRemaining) return 'gray';
    if (daysRemaining <= 7) return 'red';
    if (daysRemaining <= 30) return 'yellow';
    return 'green';
  };

  const statusColor = getStatusColor();

  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      text: 'text-red-700',
    },
    yellow: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      text: 'text-amber-700',
    },
    green: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      text: 'text-emerald-700',
    },
    gray: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      text: 'text-gray-700',
    },
  };

  const colors = colorClasses[statusColor];

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors.bg} cursor-help`}>
      <Calendar size={12} className={colors.icon} />
      <span className={`text-xs font-medium ${colors.text}`}>
        {daysRemaining !== null ? `Còn ${daysRemaining} ngày` : 'Không giới hạn'}
      </span>

      {/* Tooltip chi tiết */}
      <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Calendar size={14} className="text-violet-600" />
            <p className="text-sm font-semibold text-gray-900">
              Hạn sử dụng VENUE_INSIGHT
            </p>
          </div>

          {/* Thời gian */}
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
              <Clock size={14} className={colors.icon} />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-[10px] mb-0.5">Hết hạn</p>
              <p className="font-semibold text-gray-900">
                {expiryDate ? formatDate(expiryDate) : 'Không giới hạn'}
              </p>
            </div>
          </div>

          {/* Số ngày còn lại */}
          {daysRemaining !== null && (
            <div className={`px-3 py-2 rounded-lg ${colors.bg}`}>
              <div className="flex items-center justify-center gap-2">
                <Clock size={14} className={colors.icon} />
                <p className={`text-sm font-semibold ${colors.text}`}>
                  Còn lại {daysRemaining} ngày
                </p>
              </div>
            </div>
          )}

          {/* Các gói đang cung cấp */}
          {providingPackages.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5 mb-2">
                <Package size={12} className="text-gray-500" />
                <p className="text-xs text-gray-500 font-medium">Các gói đang cung cấp</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {providingPackages.map((pkg, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-violet-50 text-violet-700 text-xs font-medium"
                  >
                    {pkg}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
