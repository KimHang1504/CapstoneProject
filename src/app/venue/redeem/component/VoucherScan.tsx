"use client";

import { useEffect, useState } from "react";
import QRScanner from "@/app/venue/redeem/component/QRScanner";
import {
    validateVoucherItem,
    redeemVoucherItem,
} from "@/api/venue/vouchers/api";

type Props = {
    venueLocationId: number;
};

export default function VoucherScan({ venueLocationId }: Props) {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);

        useEffect(() => {
        console.log("🟢 VoucherScan mounted");

        return () => {
            console.log("🔴 VoucherScan unmounted");
        };
    }, []);

    const handleScan = async (text: string) => {
        const value = text.toUpperCase();

        setCode(value);
        setLoading(true);
        setMessage("");

        try {
            const res = await validateVoucherItem(value, venueLocationId);
            const data = res.data;

            if (data.isValid) {
                setValid(true);
                setMessage("Voucher hợp lệ. Có thể sử dụng.");
            } else {
                setValid(false);
                setMessage(data.validationMessage || "Không hợp lệ");
            }
        } catch (err: any) {
            setValid(false);
            setMessage(err?.response?.data?.message || "Không hợp lệ");
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async () => {
        try {
            setLoading(true);

            await redeemVoucherItem(code);

            setMessage("Redeem thành công!");
            setValid(false);
        } catch {
            setMessage("Redeem thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* QR Scanner */}
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-black">
                <QRScanner onScan={handleScan} />
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
                </div>
            </div>

            {/* Scanned Code Display */}
            {code && (
                <div className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium mb-1">Mã đã quét</p>
                            <p className="text-base font-bold text-gray-900 font-mono tracking-wider truncate">
                                {code}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm text-blue-700 font-medium">Đang xác thực voucher...</span>
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

            {/* Error Message */}
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