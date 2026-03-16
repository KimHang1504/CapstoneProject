"use client";

import { useState } from "react";
import { VoucherDetail } from "@/api/venue/vouchers/type";
import HistoryExchange from "@/app/venue/voucher/[id]/component/HistoryExchange";
import VoucherItemsPage from "@/app/venue/voucher/[id]/items/page";

type Props = {
    voucher: VoucherDetail;
};

export default function VoucherTabs({ voucher }: Props) {
    const [tab, setTab] = useState<"info" | "items" | "history">("info");

    return (
        <div className="space-y-4">

            {/* TAB HEADER */}
            <div className="flex gap-6 border-b border-gray-300">

                <button
                    onClick={() => setTab("info")}
                    className={`pb-2 text-sm font-medium border-b-2 transition
                            ${tab === "info"
                            ? "border-violet-500 text-violet-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Thông tin cơ bản
                </button>

                <button
                    onClick={() => setTab("items")}
                    className={`pb-2 text-sm font-medium border-b-2 transition
                            ${tab === "items"
                            ? "border-violet-500 text-violet-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Voucher items
                </button>

                <button
                    onClick={() => setTab("history")}
                    className={`pb-2 text-sm font-medium border-b-2 transition
                            ${tab === "history"
                            ? "border-violet-500 text-violet-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Lịch sử đổi
                </button>

            </div>

            {/* TAB CONTENT */}
            {tab === "info" && (
                <div className="space-y-8">

                    {/* HEADER */}
                    <div>
                        <h2 className="text-2xl font-semibold">
                            {voucher.title}
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Mã voucher:{" "}
                            <span className="font-medium text-gray-800">
                                {voucher.code}
                            </span>
                        </p>
                    </div>

                    {/* HIGHLIGHT CARD */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 space-y-4">

                        {/* Discount */}
                        <p className="text-xl font-semibold text-yellow-800">
                            {voucher.discountType === "FIXED_AMOUNT"
                                ? `Giảm ${voucher.discountAmount?.toLocaleString()} VND`
                                : `Giảm ${voucher.discountPercent}%`}
                        </p>

                        {/* Date */}
                        <p className="text-sm text-yellow-700">
                                Thời gian:{" "}
                            {new Date(voucher.startDate).toLocaleDateString("vi-VN")}
                            {" → "}
                            {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                        </p>

                        {/* Locations */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            Áp dụng tại:{" "}
                            {voucher.locations.map((l) => (
                                <span
                                    key={l.venueLocationId}
                                    className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs"
                                >
                                    {l.venueLocationName}
                                </span>
                            ))}
                        </div>

                    </div>

                    {/* OPERATION INFO */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Thông tin vận hành
                        </h3>

                        <div className="grid grid-cols-2 gap-6">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Điểm đổi
                                </p>
                                <p className="font-semibold">
                                    {voucher.pointPrice} điểm
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Giới hạn mỗi user
                                </p>
                                <p className="font-semibold">
                                    {voucher.usageLimitPerMember} lần
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Hạn dùng sau khi nhận
                                </p>
                                <p className="font-semibold">
                                    {voucher.usageValiDays} ngày
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Số lượng phát hành
                                </p>
                                <p className="font-semibold">
                                    {voucher.remainingQuantity} / {voucher.quantity}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">
                            Chi tiết chương trình
                        </h3>

                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {voucher.description || "Không có mô tả chi tiết."}
                        </p>
                    </div>

                </div>
            )}

            {tab === "items" && (
                <VoucherItemsPage />
            )}

            {tab === "history" && (
                <HistoryExchange voucherId={voucher.id} />
            )}

        </div>
    );
}