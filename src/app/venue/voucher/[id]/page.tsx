"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getVoucherDetail } from "@/api/venue/vouchers/api";
import { VoucherDetail } from "@/api/venue/vouchers/type";
import VoucherActions from "@/app/venue/voucher/component/VoucherActions";
import Link from "next/link";
import Summary from "@/app/venue/voucher/[id]/component/Summary";
import HistoryExchange from "@/app/venue/voucher/[id]/component/HistoryExchange";


export default function VoucherDetailPage() {

    const { id } = useParams();

    const [voucher, setVoucher] = useState<VoucherDetail | null>(null);
    const [loading, setLoading] = useState(true);


    const fetchVoucher = async () => {
        try {
            const res = await getVoucherDetail(Number(id));
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
        <div className="p-6 space-y-4">
            <VoucherActions
                voucher={voucher}
                onChanged={fetchVoucher}

            />
            <h1 className="text-2xl font-semibold">
                {voucher.title}
            </h1>
            <Summary voucherId={voucher.id} />

            <div className="border p-4 rounded space-y-2">

                <p><b>Code:</b> {voucher.code}</p>

                <p>
                    <b>Discount:</b>{" "}
                    {voucher.discountType === "FIXED_AMOUNT"
                        ? `${voucher.discountAmount?.toLocaleString()} VND`
                        : `${voucher.discountPercent}%`}
                </p>

                <p>
                    <b>Quantity:</b>{" "}
                    {voucher.remainingQuantity}/{voucher.quantity}
                </p>

                <p>
                    <b>Status:</b> {voucher.status}
                </p>

                <p>
                    <b>Start:</b>{" "}
                    {new Date(voucher.startDate).toLocaleDateString()}
                </p>

                <p>
                    <b>End:</b>{" "}
                    {new Date(voucher.endDate).toLocaleDateString()}
                </p>

            </div>

            <div className="border p-4 rounded">
                <h2 className="font-semibold mb-2">
                    Locations
                </h2>

                <ul className="list-disc ml-5">
                    {voucher.locations.map((l) => (
                        <li key={l.venueLocationId}>
                            {l.venueLocationName}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border p-4 rounded">
                <h2 className="font-semibold mb-2">
                    Description
                </h2>

                <p className="whitespace-pre-line">
                    {voucher.description}
                </p>
            </div>
            <Link
                href={`/venue/voucher/${voucher.id}/items`}
                className="text-blue-600 underline"
            >
                Xem voucher items
            </Link>
            <HistoryExchange voucherId={voucher.id} />

        </div>
    );
}