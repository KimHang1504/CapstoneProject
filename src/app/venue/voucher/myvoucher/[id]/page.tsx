"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getVoucherDetail } from "@/api/venue/vouchers/api";
import { VoucherDetail } from "@/api/venue/vouchers/type";
import VoucherActions from "@/app/venue/voucher/component/VoucherActions";
import Summary from "@/app/venue/voucher/myvoucher/[id]/component/Summary";
import VoucherTabs from "@/app/venue/voucher/myvoucher/[id]/component/VoucherTabs";


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

    if (loading) return <p>Loading...</p>;
    if (!voucher) return <p>Voucher not found</p>;

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">

                {/* LEFT */}
                <div className="flex items-center gap-3">

                    <h1 className="text-3xl font-bold text-gray-900">
                        {voucher.title}
                    </h1>

                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border
                ${voucher.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : voucher.status === "APPROVED"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : voucher.status === "PENDING"
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : voucher.status === "DRAFTED"
                                            ? "bg-gray-100 text-gray-600 border-gray-200"
                                            : "bg-rose-50 text-rose-600 border-rose-200"
                            }`}
                    >
                        {voucher.status === "ACTIVE" && "Đang chạy"}
                        {voucher.status === "APPROVED" && "Đã duyệt"}
                        {voucher.status === "PENDING" && "Chờ duyệt"}
                        {voucher.status === "DRAFTED" && "Bản nháp"}
                        {voucher.status === "REJECTED" && "Từ chối"}
                    </span>

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