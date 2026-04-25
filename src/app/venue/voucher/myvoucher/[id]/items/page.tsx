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
                    pageSize: 999,
                });

                setItems(res.data.items);

            } finally {
                setLoading(false);
            }
        };

        fetchItems();

    }, [id]);

    // =======================
    // Mapping tiếng Việt
    // =======================
    const getStatusText = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "Đang hoạt động";
            case "INACTIVE":
                return "Không hoạt động";
            case "USED":
                return "Đã sử dụng";
            case "EXPIRED":
                return "Hết hạn sử dụng";
            case "PENDING":
                return "Chờ xử lý";
                case "ENDED":
                return "Voucher đã kết thúc";
            default:
                return status;
        }
    };

    if (loading) return <p className="p-6">Đang tải voucher items...</p>;

    if (items.length === 0) {
        return (
            <div className="p-6">
                <div className="p-6 text-center text-gray-500">
                    Chưa có item nào được tạo cho voucher này.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">

            <h1 className="text-2xl font-semibold">
                Danh sách item của voucher
            </h1>

            <div className="border rounded overflow-hidden">

                <table className="w-full text-sm">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Mã code</th>
                            <th className="p-3 text-left">Trạng thái</th>
                            <th className="p-3 text-left">Đã sở hữu</th>
                            <th className="p-3 text-left">Ngày hết hạn</th>
                            <th className="p-3 text-left">Ngày tạo</th>
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
                                    {getStatusText(item.status)}
                                </td>

                                <td className="p-3">
                                    {item.isAssigned ? "Đã sở hữu" : "Chưa sở hữu"}
                                </td>

                                <td className="p-3">
                                    {item.expiredAt
                                        ? new Date(item.expiredAt).toLocaleDateString("vi-VN")
                                        : "-"}
                                </td>

                                <td className="p-3">
                                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}