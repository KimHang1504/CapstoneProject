"use client";

import { acceptPendingAdvertisements, getPendingAdvertisements, rejectPendingAdvertisements } from "@/api/admin/api";
import { Advertisement, AdvertisementAcceptRequest, AdvertisementRejectRequest } from "@/api/admin/type";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import ImagePreview from "../venue-management/location/[id]/components/ImagePreview";

export default function AdvertisementList() {
  const [data, setData] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const res = await getPendingAdvertisements();
      if (res.code === 200) {
        setData(res.data);
      } else {
        console.error("Failed to fetch advertisements:", res.message);
      }
    } catch (error) {
      console.error("Error fetching advertisements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn chấp nhận yêu cầu quảng cáo này?")) {
      const body: AdvertisementAcceptRequest = {
        advertisementId: id,
      };
      try {
        const res = await acceptPendingAdvertisements(body);
        if (res.code === 200) {
          alert("Đã chấp nhận yêu cầu quảng cáo.");
          fetchAdvertisements();
        } else {
          alert("Không thể chấp nhận yêu cầu quảng cáo: " + res.message);
        }
      } catch (error) {
        console.error("Error accepting advertisement:", error);
      }
    }
  };

  const handleReject = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn từ chối yêu cầu quảng cáo này?")) {
      const body: AdvertisementRejectRequest = {
        advertisementId: id,
        reason: reason,
      };
      try {
        const res = await rejectPendingAdvertisements(body);
        if (res.code === 200) {
          alert("Đã từ chối yêu cầu quảng cáo.");
          fetchAdvertisements();
        } else {
          alert("Không thể từ chối yêu cầu quảng cáo: " + res.message);
        }
      } catch (error) {
        console.error("Error rejecting advertisement:", error);
      } finally {
        setOpen(false);
        setReason("");
      }
    }
  }


  useEffect(() => {
    fetchAdvertisements();
  }, []);


  return (
    <div className="px-8 py-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quản lí quảng cáo</h2>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow border overflow-hidden animate-pulse"
            >
              <div className="w-full h-48 bg-gray-300" />

              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-gray-50 text-center">
          <svg
            className="w-10 h-10 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 12l2 2 4-4" />
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>

          <p className="text-gray-600 font-medium">
            Không có yêu cầu quảng cáo nào
          </p>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((ad) => (
            <div
              key={ad.id}
              className="bg-white rounded-xl shadow border overflow-hidden"
            >
              {/* Banner */}
              <div className="relative h-50 w-full rounded-xl overflow-hidden">
                <ImagePreview src={ad.bannerUrl} alt={ad.title} />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="font-semibold text-lg">{ad.title}</h2>

                <p className="text-sm text-gray-500">
                  Vị trí: {ad.placementType}
                </p>

                <p className="text-sm text-gray-500">
                  Địa điểm sự kiện: {ad.venueLocationCount}
                </p>

                <p className="text-sm text-gray-500">
                  Ngày bắt đầu:{" "}
                  {ad.desiredStartDate
                    ? new Date(ad.desiredStartDate).toLocaleDateString()
                    : "Chưa đặt"}
                </p>

                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full font-medium
                  ${ad.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : ad.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {ad.status}
                </span>
                <div className="flex gap-2 pt-2">

                  <button
                    onClick={() => setOpen(true)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleAccept(ad.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    Chấp nhận
                  </button>
                </div>
                {open && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-xl w-100 space-y-4">
                      <h2 className="text-lg font-semibold">
                        Từ chối
                      </h2>
                      <textarea
                        className="w-full border rounded-lg p-2"
                        rows={4}
                        placeholder="Nhập lý do..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setOpen(false)}
                          className="px-4 py-2 border rounded-lg"
                        >
                          Hủy
                        </button>

                        <button
                          onClick={() => handleReject(ad.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                          Xác nhận
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      )}
    </div>

  );


}