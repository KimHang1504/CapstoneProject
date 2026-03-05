'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();

  const handleBackToLocations = () => {
    router.push('/venue/location/mylocation');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thanh toán thành công
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Gói của bạn đã được kích hoạt thành công.
        </p>

        {/* Button */}
        <button
          onClick={handleBackToLocations}
          className="w-full bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 transition"
        >
          Quay về danh sách địa điểm
        </button>

      </div>
    </div>
  );
}