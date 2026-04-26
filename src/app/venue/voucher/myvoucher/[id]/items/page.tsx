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

    const getStatusText = (status: string) => {
        switch (status) {
            case "AVAILABLE":
                return "Có thể nhận";
            case "ACQUIRED":
                return "Đã nhận";
            case "USED":
                return "Đã sử dụng";
            case "EXPIRED":
                return "Hết hạn";
            case "ENDED":
                return "Đã kết thúc";
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
                            <th className="p-3 text-left">
                                <div className="flex items-center gap-2">
                                    Trạng thái

                                    <div className="relative group">
                                        {/* Icon */}
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs flex items-center justify-center shadow cursor-pointer hover:scale-110 transition">
                                            ?
                                        </div>

                                        {/* Tooltip */}
                                        <div className="
                                            absolute left-1/2 -translate-x-1/2 top-10
                                            hidden group-hover:block
                                            w-[340px]
                                            p-4
                                            text-sm
                                            bg-white
                                            border border-gray-100
                                            rounded-2xl
                                            shadow-[0_12px_32px_rgba(0,0,0,0.14)]
                                            z-50
                                        ">
                                            <ul className="space-y-2">

                                                {/* AVAILABLE */}
                                                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                                                    <span className="w-2.5 h-2.5 mt-1 rounded-full bg-blue-500" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">Có thể nhận</p>
                                                        <p className="text-xs text-gray-500">Chưa có người nhận, vẫn còn lượt.</p>
                                                    </div>
                                                </li>

                                                {/* ACQUIRED */}
                                                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                                                    <span className="w-2.5 h-2.5 mt-1 rounded-full bg-indigo-500" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">Đã nhận</p>
                                                        <p className="text-xs text-gray-500">Người dùng đã lưu nhưng chưa sử dụng.</p>
                                                    </div>
                                                </li>

                                                {/* USED */}
                                                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                                                    <span className="w-2.5 h-2.5 mt-1 rounded-full bg-purple-500" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">Đã sử dụng</p>
                                                        <p className="text-xs text-gray-500">Voucher đã được dùng.</p>
                                                    </div>
                                                </li>

                                                {/* EXPIRED */}
                                                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                                                    <span className="w-2.5 h-2.5 mt-1 rounded-full bg-red-500" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">Hết hạn</p>
                                                        <p className="text-xs text-gray-500">Đã quá thời gian sử dụng.</p>
                                                    </div>
                                                </li>

                                                {/* ENDED */}
                                                <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                                                    <span className="w-2.5 h-2.5 mt-1 rounded-full bg-gray-400" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">Đã kết thúc</p>
                                                        <p className="text-xs text-gray-500">Chương trình không còn phát hành.</p>
                                                    </div>
                                                </li>

                                            </ul>

                                            {/* Arrow */}
                                            <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th className="p-3 text-left">Đã sở hữu</th>
                            <th className="p-3 text-left">
                                <div className="flex items-center gap-2">

                                    Ngày hết hạn

                                    <div className="relative group">

                                        {/* Icon */}
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs flex items-center justify-center shadow cursor-pointer hover:scale-110 transition">
                                            ?
                                        </div>

                                        {/* Tooltip */}
                                        <div className="
                                                absolute left-1/2 -translate-x-1/2 top-8
                                                hidden group-hover:block
                                                w-[320px]
                                                p-4
                                                text-xs
                                                bg-white
                                                border border-gray-100
                                                rounded-xl
                                                shadow-[0_10px_25px_rgba(0,0,0,0.12)]
                                                z-50
                                            ">
                                            <ul className="space-y-2 text-gray-600 leading-relaxed">
                                                <li className="flex gap-2">
                                                    <span className="mt-[6px] w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                                    <span>
                                                        Voucher chưa có người nhận sẽ tự động hết hạn khi chương trình kết thúc.
                                                    </span>
                                                </li>

                                                <li className="flex gap-2">
                                                    <span className="mt-[6px] w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                                    <span>
                                                        Với voucher đã được nhận, thời gian sử dụng được tính riêng kể từ lúc nhận.
                                                    </span>
                                                </li>

                                                <li className="flex gap-2">
                                                    <span className="mt-[6px] w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                                    <span>
                                                        Sau thời gian quy định, voucher sẽ chuyển sang trạng thái hết hạn.
                                                    </span>
                                                </li>
                                            </ul>

                                            {/* Arrow */}
                                            <div className="
                                                absolute left-1/2 -translate-x-1/2 -top-2
                                                w-3 h-3
                                                bg-white
                                                border-l border-t border-gray-100
                                                rotate-45
                                                "></div>

                                        </div>

                                    </div>

                                </div>
                            </th>
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