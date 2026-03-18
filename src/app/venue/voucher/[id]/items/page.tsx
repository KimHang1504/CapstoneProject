"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getVoucherItems } from "@/api/venue/vouchers/api";
import { VoucherItem } from "@/api/venue/vouchers/type";

export default function VoucherItemsPage() {

    const { id } = useParams();

    const [items, setItems] = useState<VoucherItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchItems = async () => {
            try {

                const res = await getVoucherItems({
                    voucherId: Number(id),
                    pageNumber: 1,
                    pageSize: 20,
                });

                setItems(res.data.items);

            } finally {
                setLoading(false);
            }
        };

        fetchItems();

    }, [id]);

    if (loading) return <p className="p-6">Loading voucher items...</p>;
    if (loading) return <p className="p-6">Loading voucher items...</p>;

    if (items.length === 0) {
        return (
            <div className="p-6">
                <div className="p-6 text-center text-gray-500">
                    Hãy gửi duyệt để phát hành voucher nào!
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">

            <h1 className="text-2xl font-semibold">
                Voucher Items
            </h1>

            <div className="border rounded overflow-hidden">

                <table className="w-full text-sm">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Code</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Assigned</th>
                            <th className="p-3 text-left">Expired At</th>
                            <th className="p-3 text-left">Created</th>
                        </tr>
                    </thead>

                    <tbody>

                        {items.map((item) => (

                            <tr key={item.id} className="border-t">

                                <td className="p-3">{item.id}</td>

                                <td className="p-3 font-mono">
                                    {item.itemCode}
                                </td>

                                <td className="p-3">
                                    {item.status}
                                </td>

                                <td className="p-3">
                                    {item.isAssigned ? "Yes" : "No"}
                                </td>

                                <td className="p-3">
                                    {item.expiredAt
                                        ? new Date(item.expiredAt).toLocaleDateString()
                                        : "-"}
                                </td>

                                <td className="p-3">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}