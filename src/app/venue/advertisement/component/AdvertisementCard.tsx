"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AdvertisementListItem } from "@/api/venue/advertisement/type";

type Props = {
  ad: AdvertisementListItem;
};

export default function AdvertisementCard({ ad }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-75">
      
      {/* Banner */}
      <div className="relative w-full h-27.5">
        <Image
          src={ad.bannerUrl}
          alt={ad.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <h2 className="font-semibold text-[15px]">
          {ad.title}
        </h2>

      </div>
      <div>
        {ad.desiredStartDate && (
          <p className="text-sm text-gray-500 mb-2 px-4">
            Bắt đầu từ: {new Date(ad.desiredStartDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Button */}
      <button
        onClick={() =>
          router.push(`/venue/advertisement/myadvertisement/${ad.id}`)
        }
        className="bg-[#A2E0C1] hover:bg-[#54dc98] py-3 text-sm font-medium"
      >
        Quản lý
      </button>
    </div>
  );
}