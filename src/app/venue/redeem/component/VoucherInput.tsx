"use client";

import { useEffect, useState } from "react";
import {
    validateVoucherItem,
    redeemVoucherItem,
} from "@/api/venue/vouchers/api";

type Props = {
    venueLocationId: number;
};

export default function VoucherInput({ venueLocationId }: Props) {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleValidate = async (voucherCode: string) => {
        if (!voucherCode) return;

        try {
            setLoading(true);
            setMessage("");

            const res = await validateVoucherItem(voucherCode, venueLocationId);
            const data = res.data;

            if (data.isValid) {
                setValid(true);
                setMessage("Voucher hợp lệ. Có thể sử dụng.");
            } else {
                setValid(false);
                setMessage(data.validationMessage || "Voucher không hợp lệ");
            }
        } catch (err: any) {
            setValid(false);
            setMessage(
                err?.response?.data?.message || "Voucher không hợp lệ"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async () => {
        try {
            setLoading(true);

            await redeemVoucherItem(code);

            setMessage("Redeem voucher thành công!");
            setValid(false);
            setCode("");
        } catch (err: any) {
            setMessage(
                err?.response?.data?.message || "Redeem thất bại"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!code) return;

        const delay = setTimeout(() => {
            handleValidate(code);
        }, 500);

        return () => clearTimeout(delay);
    }, [code]);

    return (
        <div className="space-y-5">
            {/* Input Field */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                </div>
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã voucher (VD: ABCD-1234)"
                    className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white font-mono tracking-wider"
                />
                {code && (
                    <button
                        onClick={() => setCode("")}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm text-blue-700 font-medium">Đang kiểm tra voucher...</span>
                </div>
            )}

            {/* Valid State with Redeem Button */}
            {valid && !loading && (
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-emerald-900">Voucher hợp lệ</p>
                            <p className="text-xs text-emerald-700 mt-0.5">Sẵn sàng để sử dụng</p>
                        </div>
                    </div>
                    <button
                        onClick={handleRedeem}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Xác nhận sử dụng
                    </button>
                </div>
            )}

            {/* Error/Info Message */}
            {message && !valid && !loading && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <p className="text-sm text-red-800 flex-1">{message}</p>
                </div>
            )}

            {/* Success Message after Redeem */}
            {message && message.includes("thành công") && (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-sm text-emerald-800 flex-1 font-medium">{message}</p>
                </div>
            )}
        </div>
    );
}