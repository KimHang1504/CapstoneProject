"use client";

import { useState } from "react";
import { AdStatus, AdvertisementAcceptRequest, AdvertisementRejectRequest } from "@/api/admin/type";
import { acceptPendingAdvertisements, rejectPendingAdvertisements } from "@/api/admin/api";
import { StatusBadge } from "./StatusBadge";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export function StatusCard({
    status,
    adId,
    onSuccess,
}: {
    status: AdStatus;
    adId: number;
    onSuccess?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ ACCEPT
    const handleAccept = () => {
        toast("Xác nhận duyệt quảng cáo?", {
            action: {
                label: "Duyệt",
                onClick: async () => {
                    try {
                        setLoading(true);

                        const body: AdvertisementAcceptRequest = {
                            advertisementId: adId,
                        };

                        const res = await acceptPendingAdvertisements(body);

                        if (res.code === 200) {
                            toast.success("Đã duyệt quảng cáo");
                            onSuccess?.();
                        } else {
                            toast.error(res.message || "Không thể duyệt");
                        }
                    } catch (err) {
                        toast.error("Có lỗi xảy ra");
                    } finally {
                        setLoading(false);
                    }
                },
            },
            cancel: {
                label: "Hủy",
                onClick: () => { },
            },
        });
    };

    // ❌ REJECT
    const handleReject = () => {
        setOpen(true);
    };

    const confirmReject = async () => {
        if (!reason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối");
            return;
        }

        try {
            setLoading(true);

            const body: AdvertisementRejectRequest = {
                advertisementId: adId,
                reason,
            };

            const res = await rejectPendingAdvertisements(body);

            if (res.code === 200) {
                toast.success("Đã từ chối quảng cáo");
                onSuccess?.();
            } else {
                toast.error(res.message || "Không thể từ chối");
            }
        } catch (err) {
            toast.error("Có lỗi xảy ra");
        } finally {
            setLoading(false);
            setOpen(false);
            setReason("");
        }
    };

    return (
        <>
            <div className="p-5 rounded-2xl bg-white border border-violet-100 shadow-sm space-y-5">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-800">
                        Trạng thái quảng cáo
                    </h3>
                    <StatusBadge status={status} />
                </div>

                {/* STATUS MESSAGE */}
                <div className="text-sm text-gray-500">
                    {status === "PENDING" && "Quảng cáo đang chờ duyệt từ admin"}
                    {status === "COMPLETED" && "Quảng cáo đã được duyệt"}
                    {status === "REFUNDED" && "Quảng cáo đã hoàn tiền"}
                </div>

                {/* ACTIONS */}
                {status === "PENDING" && (
                    <div className="flex gap-3 pt-2">
                        <button
                            disabled={loading}
                            onClick={handleAccept}
                            className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-green-500 text-white py-2.5 rounded-xl text-sm font-medium shadow hover:scale-[1.02] hover:shadow-md transition disabled:opacity-50"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Chấp nhận
                        </button>

                        <button
                            disabled={loading}
                            onClick={handleReject}
                            className="cursor-pointer flex-1 flex items-center justify-center gap-2 border border-red-400 text-red-500 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
                        >
                            <XCircle className="w-4 h-4" />
                            Từ chối
                        </button>
                    </div>
                )}
            </div>

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
        </>
    );
}