// PaymentFailureContent.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, Home } from 'lucide-react';

export default function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");
  const locationId = searchParams.get("locationId");
  const adId = searchParams.get("adId");

  const title =
    searchParams.get('title') || 'Thanh toán thất bại';
  const message =
    searchParams.get('message') ||
    'Giao dịch của bạn không thể hoàn tất. Vui lòng thử lại.';

  const handleBack = () => {
    if (type === "location" && locationId) {
      router.push(`/venue/location/mylocation/${locationId}`);
    }

    if (type === "advertisement" && adId) {
      router.push(`/venue/advertisement/myadvertisement/${adId}`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6 animate-pulse">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {title}
          </h1>

          <p className="text-gray-600 mb-6">{message}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleBack}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-full cursor-pointer font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Về trang chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}