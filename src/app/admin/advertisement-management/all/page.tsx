"use client";

import {
    acceptPendingAdvertisements,
    rejectPendingAdvertisements,
    getAllAdvertisements,
} from "@/api/admin/api";

import {
    Advertisement,
    AdvertisementAcceptRequest,
    AdvertisementRejectRequest,
    AdvertisementRejectionHistory,
} from "@/api/admin/type";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MapPin, Megaphone, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import StatusDropdown from "../components/StatusDropdown";

export default function AdvertisementAllList() {
    const [data, setData] = useState<Advertisement[]>([]);
    const [filteredData, setFilteredData] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

    const [reason, setReason] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [historyOpen, setHistoryOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] =
        useState<AdvertisementRejectionHistory[]>([]);

    const router = useRouter();

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getAllAdvertisements();
            if (res.code === 200) {
                setData(res.data);
                setFilteredData(res.data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (statusFilter) {
            setFilteredData(data.filter(ad => ad.status === statusFilter));
        } else {
            setFilteredData(data);
        }
    }, [statusFilter, data]);

    // ✅ ACCEPT
    const handleAccept = (id: number) => {
        toast("Bạn có chắc chắn muốn duyệt quảng cáo này?", {
            action: {
                label: "Duyệt",
                onClick: async () => {
                    const body: AdvertisementAcceptRequest = {
                        advertisementId: id,
                    };

                    const res = await acceptPendingAdvertisements(body);
                    if (res.code === 200) {
                        toast.success("Đã duyệt");
                        fetchData();
                    } else {
                        toast.error(res.message);
                    }
                },
            },
        });
    };

    // ❌ REJECT
    const handleReject = (id: number) => {
        setSelectedId(id);
        setOpen(true);
    };

    const confirmReject = async () => {
        if (!selectedId || !reason.trim()) {
            toast.error("Nhập lý do");
            return;
        }

        const body: AdvertisementRejectRequest = {
            advertisementId: selectedId,
            reason,
        };

        const res = await rejectPendingAdvertisements(body);

        if (res.code === 200) {
            toast.success("Đã từ chối");
            fetchData();
        }

        setOpen(false);
        setReason("");
        setSelectedId(null);
    };

    return (
        <div className="px-8 py-4">
            <BackButton />
            <div className="mb-6">
                <h2 className="text-2xl font-bold bg-linear-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                    Tất cả quảng cáo
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Đang chờ duyệt: <span className="font-semibold text-yellow-600">{data.filter(ad => ad.status === "PENDING").length}</span> / Tổng số: <span className="font-semibold">{data.length}</span>
                </p>
            </div>

            {/* Filter */}
            <div className="mb-6 flex justify-end">
                <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
            </div>

            {/* LOADING */}
            {loading ? (
                <div className="grid grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-60 bg-gray-200 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.map((ad) => (
                        <div
                            key={ad.id}
                            className="group bg-white rounded-2xl overflow-hidden border border-violet-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition flex flex-col"
                        >
                            {/* IMAGE */}
                            <div className="relative h-44 w-full">
                                <Image
                                    src={ad.bannerUrl}
                                    alt={ad.title}
                                    fill
                                    className="object-cover"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                                {/* TYPE */}
                                <span className="absolute top-3 left-3 bg-white/90 text-violet-600 text-[10px] font-bold px-2 py-1 rounded-full">
                                    {ad.placementType}
                                </span>

                                {/* STATUS */}
                                <span
                                    className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full
                    ${ad.status === "PENDING"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : ad.status === "APPROVED"
                                                ? "bg-green-100 text-green-600"
                                                : ad.status === "ACTIVE"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : ad.status === "INACTIVE"
                                                        ? "bg-gray-200 text-gray-600"
                                                        : ad.status === "DRAFT"
                                                            ? "bg-slate-200 text-slate-600"
                                                            : "bg-red-100 text-red-500"
                                        }`}
                                >
                                    {ad.status === "PENDING" ? "Đang chờ duyệt"
                                        : ad.status === "APPROVED" ? "Đã duyệt"
                                            : ad.status === "ACTIVE" ? "Đang hoạt động"
                                                : ad.status === "INACTIVE" ? "Không hoạt động"
                                                    : ad.status === "DRAFT" ? "Nháp"
                                                        : "Bị từ chối"}
                                </span>

                                {/* TITLE */}
                                <div className="absolute bottom-0 px-4 py-3 w-full">
                                    <h2 className="text-white text-sm font-semibold truncate">
                                        {ad.title}
                                    </h2>
                                </div>
                            </div>

                            {/* INFO */}
                            <div className="p-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="flex gap-2 text-gray-500">
                                        <MapPin className="w-4 h-4 text-violet-400" />
                                        Địa điểm
                                    </span>
                                    <span className="text-violet-600 font-medium">
                                        {ad.venueLocationCount}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="flex gap-2 text-gray-500">
                                        <Megaphone className="w-4 h-4 text-pink-400" />
                                        Vị trí
                                    </span>
                                    <span className="text-pink-500 font-medium">
                                        {ad.placementType}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="flex gap-2 text-gray-500">
                                        <CalendarDays className="w-4 h-4 text-purple-400" />
                                        Bắt đầu
                                    </span>
                                    <span>
                                        {ad.desiredStartDate
                                            ? new Date(ad.desiredStartDate).toLocaleDateString("vi-VN")
                                            : "Chưa đặt"}
                                    </span>
                                </div>
                            </div>

                            {/* ACTION */}
                            <div className="p-4 space-y-2">
                                {ad.status === "PENDING" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleReject(ad.id)}
                                            className="cursor-pointer flex-1 border border-pink-400 text-pink-500 py-2 rounded-lg"
                                        >
                                            Từ chối
                                        </button>

                                        <button
                                            onClick={() => handleAccept(ad.id)}
                                            className="cursor-pointer flex-1 bg-linear-to-r from-violet-500 to-pink-500 text-white py-2 rounded-lg"
                                        >
                                            Duyệt
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() =>
                                        router.push(`/admin/advertisement-management/${ad.id}`)
                                    }
                                    className="cursor-pointer w-full border border-violet-400 text-violet-600 py-2 rounded-lg"
                                >
                                    Xem chi tiết
                                </button>
                            </div>

                            {/* HISTORY */}
                            {ad.rejectionHistory?.length > 0 && (
                                <div className="pb-4 text-center">
                                    <button
                                        onClick={() => {
                                            setSelectedHistory(ad.rejectionHistory);
                                            setHistoryOpen(true);
                                        }}
                                        className="cursor-pointer text-xs text-gray-500 underline hover:text-pink-500"
                                    >
                                        Xem lịch sử từ chối ({ad.rejectionHistory.length})
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL REJECT */}
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
                                className="cursor-pointer px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={confirmReject}
                                className="cursor-pointer px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:opacity-90"
                            >
                                Xác nhận từ chối
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* HISTORY MODAL */}
            {historyOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4">
                        <h3 className="font-semibold">Lịch sử từ chối</h3>

                        {selectedHistory.map((h, i) => (
                            <div key={i} className="border-b pb-2">
                                <p className="text-xs text-gray-500">
                                    {h.rejectedBy} -{" "}
                                    {new Date(h.rejectedAt).toLocaleString("vi-VN")}
                                </p>
                                <p>{h.reason || "Không có lý do"}</p>
                            </div>
                        ))}

                        <button
                            onClick={() => setHistoryOpen(false)}
                            className="cursor-pointer px-4 py-2 border rounded-lg"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}