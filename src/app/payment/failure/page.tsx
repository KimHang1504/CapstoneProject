'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, RefreshCw, Home } from 'lucide-react';

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Query params
  const title = searchParams.get('title') || 'Thanh toán thất bại';
  const message = searchParams.get('message') || 'Giao dịch của bạn không thể hoàn tất. Vui lòng thử lại.';
  const retryUrl = searchParams.get('retry');
  const homeUrl = searchParams.get('home') || '/';
  const errorCode = searchParams.get('errorCode');
  const orderId = searchParams.get('orderId');

  const handleRetry = () => {
    if (retryUrl) {
      router.push(retryUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6 animate-pulse">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
        </div>

        {/* Error Details */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Thông tin lỗi</h2>
          
          <div className="space-y-3">
            {orderId && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-semibold text-gray-900">{orderId}</span>
              </div>
            )}
            
            {errorCode && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Mã lỗi:</span>
                <span className="font-semibold text-red-600">{errorCode}</span>
              </div>
            )}
            
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                <XCircle size={16} />
                Thất bại
              </span>
            </div>
          </div>
        </div> */}

        {/* Common Reasons */}
        {/* <div className="bg-yellow-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Nguyên nhân thường gặp:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Số dư tài khoản không đủ</li>
            <li>• Thông tin thanh toán không chính xác</li>
            <li>• Phiên giao dịch đã hết hạn</li>
            <li>• Lỗi kết nối mạng</li>
          </ul>
        </div> */}

        {/* Actions */}
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

        {/* Support Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800 text-center">
            Cần hỗ trợ? Liên hệ với chúng tôi
            <br />
            <a href="mailto:support@couplemood.com" className="font-semibold underline">
              support@couplemood.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
