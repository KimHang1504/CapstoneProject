'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [countdown, setCountdown] = useState(5);
  
  // Query params
  const title = searchParams.get('title') || 'Thanh toán thành công';
  const message = searchParams.get('message') || 'Giao dịch của bạn đã được xử lý thành công';
  const redirectUrl = searchParams.get('redirect') || '/';
  const amount = searchParams.get('amount');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push(redirectUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectUrl, router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
        </div>

        {/* Transaction Details */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Chi tiết giao dịch</h2>
          
          <div className="space-y-3">
            {orderId && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-semibold text-gray-900">{orderId}</span>
              </div>
            )}
            
            {amount && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-green-600 text-lg">
                  {Number(amount).toLocaleString('vi-VN')} VND
                </span>
              </div>
            )}
            
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                <CheckCircle size={16} />
                Thành công
              </span>
            </div>
          </div>
        </div> */}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push(redirectUrl)}
            className="w-full bg-violet-600 text-white py-4 rounded-full font-semibold hover:bg-violet-700 transition"
          >
            Tiếp tục
          </button>
          
          <p className="text-center text-sm text-gray-500">
            Tự động chuyển hướng sau {countdown} giây...
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800 text-center">
            ✓ Giao dịch đã được xác nhận
            <br />
            ✓ Bạn sẽ nhận được email xác nhận trong vài phút
          </p>
        </div>
      </div>
    </div>
  );
}
