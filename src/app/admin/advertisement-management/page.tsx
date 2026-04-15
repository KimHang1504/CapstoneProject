"use client";

import { acceptPendingAdvertisements, getPendingAdvertisements, rejectPendingAdvertisements } from "@/api/admin/api";
import { Advertisement, AdvertisementAcceptRequest, AdvertisementRejectionHistory, AdvertisementRejectRequest } from "@/api/admin/type";
import { useEffect, useState } from "react";
import ImagePreview from "../venue-management/location/[id]/components/ImagePreview";
import { toast } from "sonner";
import { MapPin, Megaphone, CalendarDays, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function AdvertisementList() {
  const [data, setData] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reason, setReason] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<AdvertisementRejectionHistory[]>([]);
  const router = useRouter();

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

  const handleAccept = (id: number) => {
    toast("Bạn có chắc chắn muốn chấp nhận yêu cầu quảng cáo này?", {
      action: {
        label: "Chấp nhận",
        onClick: async () => {
          const body: AdvertisementAcceptRequest = {
            advertisementId: id,
          };

          try {
            const res = await acceptPendingAdvertisements(body);

            if (res.code === 200) {
              toast.success("Đã chấp nhận yêu cầu quảng cáo");
              fetchAdvertisements();
            } else {
              toast.error(res.message || "Không thể chấp nhận yêu cầu");
            }
          } catch (error) {
            console.error("Error accepting advertisement:", error);
            const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra";
            toast.error(errorMessage);
          }
        },
      },
      cancel: {
        label: "Hủy",
        onClick: () => { },
      },
    });
  };


  const handleReject = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedId) return;

    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    const body: AdvertisementRejectRequest = {
      advertisementId: selectedId,
      reason: reason,
    };

    try {
      const res = await rejectPendingAdvertisements(body);

      if (res.code === 200) {
        toast.success("Đã từ chối yêu cầu quảng cáo");
        fetchAdvertisements();
      } else {
        toast.error(res.message || "Không thể từ chối");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setOpen(false);
      setReason("");
      setSelectedId(null);
    }
  };


  useEffect(() => {
    fetchAdvertisements();
  }, []);


  return (
    <div className="px-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold bg-linear-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
          Quản lý quảng cáo
        </h2>
        <Link
          href="/admin/advertisement-management/all"
          className="inline-flex items-center gap-2 text-sm bg-linear-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-full shadow hover:opacity-90 transition"
        >
          Xem tất cả quảng cáo
        </Link>
      </div>
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
              className="group bg-white rounded-2xl overflow-hidden border border-violet-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <ImagePreview src={ad.bannerUrl} alt={ad.title} />

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                <span className="absolute top-3 left-3 bg-white/90 text-violet-600 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur">
                  {ad.placementType}
                </span>

                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border
      ${ad.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                      : ad.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-600 border-emerald-200"
                        : "bg-red-100 text-red-500 border-red-200"
                    }`}
                >
                  {ad.status === "PENDING" && "Đang chờ duyệt"}
                </span>

                <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                  <h2 className="text-white font-semibold text-sm truncate drop-shadow">
                    {ad.title}
                  </h2>
                </div>
              </div>

              <div className="px-4 py-3 border-b border-violet-50 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4 text-violet-400 group-hover:scale-110 transition" />
                    Địa điểm
                  </span>
                  <span className="font-medium text-violet-600">
                    {ad.venueLocationCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Megaphone className="w-4 h-4 text-pink-400 group-hover:scale-110 transition" />
                    Vị trí
                  </span>
                  <span className="font-medium text-pink-500">
                    {ad.placementType}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500">
                    <CalendarDays className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
                    Bắt đầu
                  </span>
                  <span className="font-medium text-gray-700">
                    {ad.desiredStartDate
                      ? new Date(ad.desiredStartDate).toLocaleDateString("vi-VN")
                      : "Chưa đặt"}
                  </span>
                </div>
              </div>

              <div className="p-4 flex gap-2">
                <button
                  onClick={() => handleReject(ad.id)}
                  className="flex-1 border border-pink-400 text-pink-500 hover:bg-pink-50 py-2 rounded-lg text-sm font-medium transition"
                >
                  Từ chối
                </button>

                <button
                  onClick={() => handleAccept(ad.id)}
                  className="flex-1 bg-linear-to-r from-violet-500 to-pink-500 hover:opacity-90 text-white py-2 rounded-lg text-sm font-medium transition"
                >
                  Chấp nhận
                </button>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => router.push(`/admin/advertisement-management/${ad.id}`)}
                  className="cursor-pointer w-full mt-2 border border-violet-400 text-violet-600 hover:bg-violet-50 py-2 rounded-lg text-sm font-medium transition"
                >
                  Xem chi tiết
                </button>
              </div>
              <div className="flex justify-center items-center pb-4">
                {ad.rejectionHistory?.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedHistory(ad.rejectionHistory);
                      setHistoryOpen(true);
                    }}
                    className="mt-2 text-xs text-gray-500 hover:text-pink-500 underline"
                  >
                    Xem lịch sử từ chối ({ad.rejectionHistory.length})
                  </button>
                )}
              </div>
            </div>
          ))}

        </div>
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">

            {/* TITLE */}
            <h3 className="text-lg font-semibold text-gray-800">
              Nhập lý do từ chối
            </h3>

            {/* INPUT */}
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do từ chối quảng cáo..."
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
              rows={4}
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setOpen(false);
                  setReason("");
                  setSelectedId(null);
                }}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              >
                Hủy
              </button>

              <button
                onClick={confirmReject}
                className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:opacity-90"
              >
                Xác nhận từ chối
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Lịch sử từ chối */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95">

            {/* TITLE */}
            <h3 className="text-lg font-semibold text-gray-800">
              Lịch sử từ chối
            </h3>

            {/* EMPTY */}
            {selectedHistory.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Chưa có lịch sử từ chối
              </p>
            ) : (

              <div className="space-y-4 max-h-100 overflow-auto pr-2">

                {selectedHistory
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.rejectedAt).getTime() -
                      new Date(a.rejectedAt).getTime()
                  )
                  .map((item, index) => (

                    <div key={index} className="flex gap-3">

                      {/* TIMELINE DOT */}
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 bg-pink-400 rounded-full mt-1" />
                        {index !== selectedHistory.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200" />
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">

                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{item.rejectedBy}</span>
                          <span>
                            {new Date(item.rejectedAt).toLocaleString("vi-VN")}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mt-1">
                          {item.reason || "Không có lý do"}
                        </p>

                      </div>

                    </div>

                  ))}

              </div>
            )}

            {/* ACTION */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setHistoryOpen(false);
                  setSelectedHistory([]);
                }}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}
    </div>

  );


}