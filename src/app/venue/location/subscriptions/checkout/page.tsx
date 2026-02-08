'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSubscriptionPackages } from '@/api/subscription/api';
import { SubscriptionPackage } from '@/api/subscription/type';
import { Check, ArrowLeft } from 'lucide-react';
import { redirectToPaymentSuccess, redirectToPaymentFailure } from '@/lib/payment-redirect';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locationId = searchParams.get('locationId');
  const subscriptionId = Number(searchParams.get('subscriptionId'));

  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setIsLoading(true);
        const response = await getSubscriptionPackages('VENUE');
        console.log('Checkout response:', response);
        const pkg = response.data?.find((p: SubscriptionPackage) => p.id === subscriptionId);
        setSelectedPackage(pkg || null);
      } catch (error) {
        console.error('Error fetching subscription package:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [subscriptionId]);

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

  const handleConfirmPayment = async () => {
    if (!selectedPackage) return;
    
    setIsProcessing(true);
    
    try {
      // TODO: Call API to submit location for approval
      // POST /api/VenueLocation/{id}/submit
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to success page
      const successUrl = redirectToPaymentSuccess({
        title: 'Đăng ký địa điểm thành công',
        message: 'Địa điểm của bạn đã được gửi duyệt. Chúng tôi sẽ xem xét trong vòng 2-3 ngày làm việc.',
        amount: selectedPackage.price,
        orderId: `LOC${locationId}`,
        redirectUrl: '/venue/location/mylocation'
      });
      
      router.push(successUrl);
    } catch (error) {
      // Failure - redirect to failure page
      const failureUrl = redirectToPaymentFailure({
        title: 'Thanh toán thất bại',
        message: 'Không thể xác nhận thanh toán. Vui lòng kiểm tra lại thông tin chuyển khoản.',
        errorCode: 'PAYMENT_NOT_FOUND',
        orderId: `LOC${locationId}`,
        retryUrl: `/venue/location/subscriptions/checkout?locationId=${locationId}&subscriptionId=${subscriptionId}`,
        homeUrl: '/venue/location/mylocation'
      });
      
      router.push(failureUrl);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy gói đăng ký</p>
      </div>
    );
  }

  const features = [
    'Hiển thị trên ứng dụng',
    `Thời hạn ${selectedPackage.durationDays} ngày`,
  ];

  if (selectedPackage.packageName.includes('PRO')) {
    features.push('Ưu tiên hiển thị', 'Báo cáo khách hàng');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                  {/* Placeholder for QR code - replace with actual QR code generator */}
                  <div className="text-center">
                    <div className="w-48 h-48 bg-white border-4 border-black mx-auto mb-2">
                      {/* QR Code will be here */}
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect width="100" height="100" fill="white"/>
                        <rect x="10" y="10" width="15" height="15" fill="black"/>
                        <rect x="75" y="10" width="15" height="15" fill="black"/>
                        <rect x="10" y="75" width="15" height="15" fill="black"/>
                        <rect x="30" y="30" width="40" height="40" fill="black"/>
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500">Mã QR thanh toán</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-semibold">MB Bank</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Số tài khoản:</span>
                <span className="font-semibold">0123456789</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Chủ tài khoản:</span>
                <span className="font-semibold">COUPLEMOOD</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-violet-600 text-lg">
                  {selectedPackage.price.toLocaleString('vi-VN')} VND
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Nội dung:</span>
                <span className="font-semibold">LOCATION{locationId}</span>
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
                  <span className="font-semibold text-lg">{selectedPackage.packageName}</span>
                  <span className="text-violet-600 font-bold text-xl">
                    {selectedPackage.price.toLocaleString('vi-VN')} VND
                  </span>
                </div>
                <p className="text-sm text-gray-600">Thời hạn: {selectedPackage.durationDays} ngày</p>
                <p className="text-sm text-gray-600 mt-2">{selectedPackage.description}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-3">Tính năng:</p>
                <ul className="space-y-2">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Tổng thanh toán</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giá gói:</span>
                  <span>{selectedPackage.price.toLocaleString('vi-VN')} VND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thuế VAT (0%):</span>
                  <span>0 VND</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-lg">Tổng cộng:</span>
                  <span className="font-bold text-violet-600 text-2xl">
                    {selectedPackage.price.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full bg-violet-600 text-white py-4 rounded-full font-semibold hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isProcessing ? 'Đang xử lý...' : 'Tôi đã thanh toán'}
            </button>

            <p className="text-xs text-center text-gray-500">
              Sau khi thanh toán, vui lòng bấm nút trên để xác nhận. 
              Hệ thống sẽ kiểm tra và kích hoạt gói đăng ký của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
