'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const handleBackToLocations = () => {
    if (type === "advertisement") {
      router.push("/venue/advertisement/");
    }

    if (type === "location") {
      router.push("/venue/location/mylocation");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white max-w-xl w-full text-center">
        <div className="flex justify-center">
          <Image src="/thankyou.png" alt="Thank you"
            width={600}
            height={10}
          />
        </div>

        {/* Message */}
        <p className="text-gray-600 text-md">
          Cảm ơn bạn đã sử dụng dịch vụ!
        </p>
        <p className="text-gray-600 text-md mb-8">
          Gói của bạn đang được xử lý và sẽ sớm có hiệu lực.
        </p>


        {/* Button */}
        <button
          onClick={handleBackToLocations}
          className="w-full bg-violet-400 text-white py-3 rounded-full font-semibold hover:bg-violet-700 transition"
        >
          Quay về danh sách
        </button>
      </div>
    </div>
  );
}