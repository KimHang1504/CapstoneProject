'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, ArrowLeft } from 'lucide-react';
import { cancelPayment, getPaymentStatus } from '@/api/venue/location/api';
import { redirectToPaymentSuccess, redirectToPaymentFailure } from '@/lib/payment-redirect';

type PaymentData = {
  isSuccess: boolean;
  message: string;
  transactionId: number;
  subscriptionId: number;
  qrCodeUrl: string;
  amount: number;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  expireAt: string;
  paymentContent: string;
  packageName: string;
  totalDays: number;
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // const locationId = searchParams.get('locationId');
  const paymentDataParam = searchParams.get('paymentData');

  const [paymentData] = useState<PaymentData | null>(() => {
    if (paymentDataParam) {
      try {
        return JSON.parse(decodeURIComponent(paymentDataParam));
      } catch (error) {
        console.error('Error parsing payment data:', error);
        return null;
      }
    }
    return null;
  });

  const [countdown, setCountdown] = useState(() => {
    if (paymentData) {
      const expireTime = new Date(paymentData.expireAt).getTime();
      const now = Date.now();
      const remainingSeconds = Math.floor((expireTime - now) / 1000);
      return Math.max(0, remainingSeconds);
    }
    return 600;
  });

  useEffect(() => {
    if (!paymentData && paymentDataParam) {
      alert('Dữ liệu thanh toán không hợp lệ');
      router.back();
    }
  }, [paymentData, paymentDataParam, router]);

  // Payment status polling
  useEffect(() => {
    if (!paymentData) return;

    const checkPaymentStatus = async () => {
      try {
        const response = await getPaymentStatus(paymentData.transactionId);
        const status = response.data.status;

        console.log('Payment status:', status);

        if (status === 'SUCCESS' || status === 'COMPLETED') {
          // Redirect to success page
          const successUrl = redirectToPaymentSuccess({
            title: 'Thanh toán thành công!',
            message: 'Địa điểm của bạn đã được gửi duyệt. Chúng tôi sẽ xem xét và phản hồi sớm nhất.',
            amount: paymentData.amount,
            orderId: `TXN${paymentData.transactionId}`,
            redirectUrl: '/venue/location/mylocation'
          });
          router.push(successUrl);
        } else if (status === 'FAILED' || status === 'CANCELLED' || status === 'EXPIRED') {
          // Redirect to failure page
          const failureUrl = redirectToPaymentFailure({
            title: 'Thanh toán thất bại',
            message: status === 'EXPIRED' 
              ? 'Giao dịch đã hết hạn. Vui lòng thử lại.' 
              : 'Thanh toán không thành công. Vui lòng thử lại.',
            orderId: `TXN${paymentData.transactionId}`,
            // redirectUrl: '/venue/location/subscriptions?locationId=' + searchParams.get('locationId')
          });
          router.push(failureUrl);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    // Check immediately
    checkPaymentStatus();

    // Then check every 5 seconds
    const interval = setInterval(checkPaymentStatus, 5000);

    return () => clearInterval(interval);
  }, [paymentData, router, searchParams]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = async () => {
    if (!paymentData) {
      router.back();
      return;
    }

    try {
      // Call API to cancel the transaction
      await cancelPayment(paymentData.transactionId);
      console.log('Transaction cancelled successfully');
      router.back();
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      // Still go back even if cancel fails
      router.back();
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: QR Code & Payment Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Quét mã để thanh toán</h2>
              <p className="text-sm text-gray-600">
                Thời gian còn lại: <span className="font-bold text-violet-600">{formatTime(countdown)}</span>
              </p>
            </div>

            {/* QR Code from API */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <Image 
                  src={paymentData.qrCodeUrl} 
                  alt="QR Code" 
                  width={256} 
                  height={256}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-semibold">{paymentData.bankInfo.bankName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Số tài khoản:</span>
                <span className="font-semibold">{paymentData.bankInfo.accountNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Chủ tài khoản:</span>
                <span className="font-semibold">{paymentData.bankInfo.accountName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-violet-600 text-lg">
                  {paymentData.amount.toLocaleString('vi-VN')} VND
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Nội dung:</span>
                <span className="font-semibold">{paymentData.paymentContent}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng nội dung để hệ thống tự động xác nhận thanh toán
              </p>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-6">
            {/* Package Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Thông tin gói đăng ký</h3>
              
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-lg">{paymentData.packageName}</span>
                  <span className="text-violet-600 font-bold text-xl">
                    {paymentData.amount.toLocaleString('vi-VN')} VND
                  </span>
                </div>
                <p className="text-sm text-gray-600">Thời hạn: {paymentData.totalDays} ngày</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-3">Tính năng:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-green-600 mt-0.5 shrink-0" />
                    <span>Hiển thị trên ứng dụng</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-green-600 mt-0.5 shrink-0" />
                    <span>Thời hạn {paymentData.totalDays} ngày</span>
                  </li>

                  {paymentData.packageName.includes('PRO') && (
                    <>
                      <li className="flex items-start gap-2 text-sm">
                        <Check size={16} className="text-green-600 mt-0.5 shrink-0" />
                        <span className="font-semibold">Ưu tiên hiển thị hàng đầu</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check size={16} className="text-green-600 mt-0.5 shrink-0" />
                        <span className="font-semibold">Báo cáo chi tiết khách hàng</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Tổng thanh toán</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giá gói:</span>
                  <span>{paymentData.amount.toLocaleString('vi-VN')} VND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thuế VAT (0%):</span>
                  <span>0 VND</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-lg">Tổng cộng:</span>
                  <span className="font-bold text-violet-600 text-2xl">
                    {paymentData.amount.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="w-full bg-gray-200 text-gray-700 py-4 rounded-full font-semibold hover:bg-gray-300 transition"
            >
              Hủy
            </button>

            <p className="text-xs text-center text-gray-500">
              Sau khi thanh toán thành công, hệ thống sẽ tự động xác nhận và kích hoạt gói đăng ký của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
