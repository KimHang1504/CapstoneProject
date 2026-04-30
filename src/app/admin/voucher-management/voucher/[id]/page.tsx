import { AlignLeft, ArrowLeft, CalendarDays, Coins, Hash, ListFilterIcon, MapPin, Percent } from "lucide-react";
import Link from "next/link";
import { Voucher, VoucherStatus } from "@/api/admin/type";
import { getVoucherDetail } from "@/api/admin/api";
import VoucherApprovalActions from "./components/VoucherApprovalActions";
import BackButton from "@/components/BackButton";

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
            case "PENDING":
                return "bg-amber-50 text-amber-600 border-amber-200";
            case "REJECTED":
                return "bg-red-200/20 text-[#F87171]";
            case "ENDED":
                return "bg-gray-200 text-gray-600";
            case "APPROVED":
                return "bg-green-200/20 text-[#34D399]";
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
            <BackButton />

            <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-6 space-y-5">
                {voucher.imageUrl && (
                    <div className="w-full h-48 rounded-xl overflow-hidden border border-violet-100">
                        <img
                            src={voucher.imageUrl}
                            alt={voucher.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-2xl font-bold bg-linear-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                        {voucher.title}
                    </h1>

                    <span
                        className={`text-xs px-3 py-1 rounded-full border font-semibold ${getStatusColor(
                            voucher.status
                        )}`}
                    >
                        {voucher.status === "ACTIVE" && "Hoạt động"}
                        {voucher.status === "ENDED" && "Kết thúc"}
                        {voucher.status === "PENDING" && "Đang chờ duyệt"}
                        {voucher.status === "REJECTED" && "Từ chối"}
                        {voucher.status === "DISABLED" && "Vô hiệu hóa"}
                        {voucher.status === "APPROVED" && "Đã duyệt"}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Hash className="w-4 h-4 text-pink-400" />
                    Mã:
                    <span className="font-medium text-gray-700">
                        {voucher.code}
                    </span>
                </div>

                <div className="flex items-start gap-2 text-gray-700">
                    <AlignLeft className="w-4 h-4 text-violet-400 mt-1" />
                    <p className="whitespace-pre-line">{voucher.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                    <div className="flex items-center justify-between bg-violet-50 px-4 py-3 rounded-xl">
                        <span className="flex items-center gap-2 text-gray-500">
                            <Percent className="w-4 h-4 text-violet-400" />
                            Giảm giá
                        </span>

                        <span className="font-semibold text-pink-500">
                            {voucher.discountType === "PERCENTAGE"
                                ? `${voucher.discountPercent}%`
                                : `${voucher.discountAmount?.toLocaleString()}đ`}
                        </span>
                    </div>

                    <div className="flex items-center justify-between bg-pink-50 px-4 py-3 rounded-xl">
                        <span className="flex items-center gap-2 text-gray-500">
                            <Coins className="w-4 h-4 text-pink-400" />
                            Điểm đổi
                        </span>

                        <span className="font-semibold text-violet-600">
                            {voucher.voucherPrice}
                        </span>
                    </div>

                    <div className="flex items-center justify-between bg-violet-50 px-4 py-3 rounded-xl">
                        <span className="flex items-center gap-2 text-gray-500">
                            <CalendarDays className="w-4 h-4 text-purple-400" />
                            Thời gian
                        </span>

                        <span className="font-medium text-gray-700">
                            {formatDate(voucher.startDate)} →{" "}
                            {formatDate(voucher.endDate)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between bg-pink-50 px-4 py-3 rounded-xl">
                        <span className="flex items-center gap-2 text-gray-500">
                            <ListFilterIcon className="w-4 h-4 text-gray-400" />
                            Số lượng
                        </span>

                        <span className="font-semibold text-violet-600">
                            {voucher.remainingQuantity}/{voucher.quantity}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <MapPin className="w-4 h-4 text-violet-500" />
                    Địa điểm áp dụng
                </h2>

                <div className="flex flex-wrap gap-2">
                    {voucher.locations.map((location) => (
                        <div
                            key={location.venueLocationId}
                            className="px-3 py-1.5 rounded-full bg-linear-to-r from-violet-100 to-pink-100 text-xs font-medium text-violet-700"
                        >
                            {location.venueLocationName}
                        </div>
                    ))}
                </div>
            </div>

            {voucher.status === "PENDING" && (
                <VoucherApprovalActions voucherId={voucher.id} />
            )}
        </div>
    );
}