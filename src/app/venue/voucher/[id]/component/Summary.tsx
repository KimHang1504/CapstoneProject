"use client";

import { useEffect, useState } from "react";
import { getVoucherSummary } from "@/api/venue/vouchers/api";
import { VoucherSummary } from "@/api/venue/vouchers/type";

export default function Summary({ voucherId }: { voucherId: number }) {

    const [summary, setSummary] = useState<VoucherSummary | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            const res = await getVoucherSummary(voucherId);
            setSummary(res.data);
        };

        fetchSummary();
    }, [voucherId]);

    if (!summary) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-3 gap-4">

            <div className="border p-4 rounded">
                <p>Total</p>
                <h2>{summary.totalQuantity}</h2>
            </div>

            <div className="border p-4 rounded">
                <p>Remaining</p>
                <h2>{summary.remainingQuantity}</h2>
            </div>

            <div className="border p-4 rounded">
                <p>Available</p>
                <h2>{summary.availableCount}</h2>
            </div>

            <div className="border p-4 rounded">
                <p>Claimed</p>
                <h2>{summary.acquiredCount}</h2>
            </div>

            <div className="border p-4 rounded">
                <p>Used</p>
                <h2>{summary.usedCount}</h2>
            </div>

            <div className="border p-4 rounded">
                <p>Ended</p>
                <h2>{summary.endedCount}%</h2>
            </div>

            <div className="border p-4 rounded">
                <p>Expired</p>
                <h2>{summary.expiredCount}%</h2>
            </div>

            <div className="border p-4 rounded">
                <p>Usage Rate</p>
                <h2>{summary.usageRate}%</h2>
            </div>

        </div>
    );
}