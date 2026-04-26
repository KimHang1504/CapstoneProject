"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getVoucherDetail } from "@/api/venue/vouchers/api";
import { VoucherDetail } from "@/api/venue/vouchers/type";
import VoucherActions from "@/app/venue/voucher/component/VoucherActions";
import Summary from "@/app/venue/voucher/myvoucher/[id]/component/Summary";
import VoucherTabs from "@/app/venue/voucher/myvoucher/[id]/component/VoucherTabs";
import Loading from "@/components/Loading";



export default function VoucherDetailPage() {

    const { id } = useParams();

    const [voucher, setVoucher] = useState<VoucherDetail | null>(null);
    const [loading, setLoading] = useState(true);


    const fetchVoucher = async () => {
        try {
            const res = await getVoucherDetail(Number(id));
            console.log("Voucher detail", res.data);
            setVoucher(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVoucher();
    }, [id]);

    if (loading) return <Loading />;
    if (!voucher) return <p>Voucher not found</p>;

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">

                {/* LEFT */}
                <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                            {voucher.title}
                        </h1>

                        <span
                            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap
            ${voucher.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : voucher.status === "APPROVED"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : voucher.status === "PENDING"
                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                            : voucher.status === "DRAFTED"
                                                ? "bg-gray-100 text-gray-600 border-gray-200"
                                                : voucher.status === "ENDED"
                                                    ? "bg-slate-100 text-slate-600 border-slate-200"
                                                    : "bg-rose-50 text-rose-600 border-rose-200"
                                }`}
                        >
                            {voucher.status === "ACTIVE" && "Đang chạy"}
                            {voucher.status === "APPROVED" && "Đã duyệt"}
                            {voucher.status === "PENDING" && "Chờ duyệt"}
                            {voucher.status === "DRAFTED" && "Bản nháp"}
                            {voucher.status === "REJECTED" && "Từ chối"}
                            {voucher.status === "ENDED" && "Đã kết thúc"}
                        </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z"
                            />
                        </svg>

                        <span>
                            {new Date(voucher.startDate).toLocaleDateString("vi-VN")}
                        </span>

                        <span className="text-gray-300">—</span>

                        <span>
                            {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                        </span>
                    </div>
                </div>


                {/* RIGHT ACTIONS */}
                <div>
                    <VoucherActions
                        voucher={voucher}
                        onChanged={fetchVoucher}
                    />
                </div>

            </div>
            <div>
                {voucher.status === "REJECTED" && voucher.rejectReason && (
                    <div className="border border-rose-200 bg-rose-50 text-rose-700 rounded-lg p-4">
                        <p className="font-medium">Voucher bị từ chối</p>
                        <p className="text-sm mt-1">
                            Lý do: {voucher.rejectReason}
                        </p>
                    </div>
                )}
            </div>
            <Summary voucherId={voucher.id} />

            <VoucherTabs voucher={voucher} />

        </div>
    );
}