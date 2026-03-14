import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Voucher } from "@/api/admin/type";
import { getVoucherDetail } from "@/api/admin/api";

type Props = {
    params: Promise<{ id: number }>;
};

export default async function VoucherDetailPage({ params }: Props) {
    const { id } = await params;
    const res = await getVoucherDetail(id);
    const voucher = res.data;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (status: string) => {

        switch (status) {
            case "ACTIVE":
                return "bg-[#72DDF7]/20 text-[#72DDF7]";
            case "DRAFTED":
                return "bg-[#B388EB]/20 text-[#B388EB]";
            case "ENDED":
                return "bg-gray-200 text-gray-600";
            default:
                return "bg-gray-100 text-gray-500";
        }

    };

    if (!voucher) {

        return (
            <div className="p-8">
                Voucher không tồn tại
            </div>
        );

    }

    return (

        <div className="p-8 max-w-3xl mx-auto space-y-6">

            <Link
                href="/admin/voucher-management"
                className="flex items-center gap-2 text-sm"
            >
                <ArrowLeft size={18} />
                Quay lại
            </Link>

            <div className="bg-white rounded-2xl border border-black p-6 space-y-4">

                <div className="flex justify-between items-start">

                    <h1 className="text-xl font-bold text-gray-900">
                        {voucher.title}
                    </h1>

                    <span
                        className={`text-xs px-3 py-1 rounded-full ${getStatusColor(voucher.status)}`}
                    >
                        {voucher.status}
                    </span>

                </div>

                <p className="text-sm text-gray-500">
                    Code: <span className="font-medium">{voucher.code}</span>
                </p>

                <p className="text-gray-800 whitespace-pre-line">
                    {voucher.description}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">

                    <div>
                        <p className="text-sm text-gray-500">Giảm giá</p>

                        <p className="font-medium text-green-600">

                            {voucher.discountType === "PERCENTAGE"
                                ? `${voucher.discountPercent}%`
                                : `${voucher.discountAmount?.toLocaleString()}đ`
                            }

                        </p>

                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Điểm đổi</p>

                        <p className="font-medium">
                            {voucher.pointPrice}
                        </p>

                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Thời gian</p>

                        <p className="font-medium">

                            {formatDate(voucher.startDate)} → {formatDate(voucher.endDate)}

                        </p>

                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Số lượng</p>

                        <p className="font-medium">

                            {voucher.remainingQuantity}/{voucher.quantity}

                        </p>

                    </div>

                </div>

            </div>

            <div className="bg-white rounded-2xl border border-black p-6">

                <h2 className="font-semibold mb-3">
                    Địa điểm áp dụng
                </h2>

                <div className="space-y-2">

                    {voucher.locations.map(location => (

                        <div
                            key={location.venueLocationId}
                            className="px-3 py-2 rounded-lg bg-gray-200 text-sm"
                        >

                            {location.venueLocationName}

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}