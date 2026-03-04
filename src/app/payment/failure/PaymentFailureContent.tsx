// PaymentFailureContent.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, RefreshCw, Home } from 'lucide-react';

export default function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const title =
    searchParams.get('title') || 'Thanh toán thất bại';
  const message =
    searchParams.get('message') ||
    'Giao dịch của bạn không thể hoàn tất. Vui lòng thử lại.';
  const retryUrl = searchParams.get('retry');
  const homeUrl = searchParams.get('home') || '/';

  const handleRetry = () => {
    if (retryUrl) router.push(retryUrl);
    else router.back();
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
            onClick={handleRetry}
            className="w-full bg-violet-600 text-white py-4 rounded-full font-semibold hover:bg-violet-700 transition flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Thử lại
          </button>

          <button
            onClick={() => router.push(homeUrl)}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-full font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}