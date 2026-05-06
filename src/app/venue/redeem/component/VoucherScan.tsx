"use client";

import { useEffect, useState } from "react";
import QRScanner from "@/app/venue/redeem/component/QRScanner";
import {
    validateVoucherItem,
    redeemVoucherItem,
} from "@/api/venue/vouchers/api";
import { RefreshCw, QrCode, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
    venueLocationId: number;
};

export default function VoucherScan({ venueLocationId }: Props) {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validatedCode, setValidatedCode] = useState("");
    const [scannerKey, setScannerKey] = useState(0);
    const [isScanning, setIsScanning] = useState(true);


    useEffect(() => {
        console.log("🟢 VoucherScan mounted");

        return () => {
            console.log("🔴 VoucherScan unmounted");
        };
    }, []);

    const handleScan = async (scannedText: string) => {
        const normalizedCode = scannedText.trim().toUpperCase();

        if (!normalizedCode) {
            setValid(false);
            setCode("");
            setValidatedCode("");
            setMessage("Không đọc được mã voucher");
            return;
        }
        setIsScanning(false);

        if (!venueLocationId) {
            setValid(false);
            setValidatedCode("");
            setMessage("Vui lòng chọn địa điểm");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setValid(false);

            setCode(normalizedCode);

            const res = await validateVoucherItem({
                itemCode: normalizedCode,
                venueLocationId,
            });

            const data = res.data;

            if (data?.isValid) {
                setValid(true);
                setValidatedCode(normalizedCode);
                setMessage(data.validationMessage || "Voucher hợp lệ. Có thể sử dụng.");
            } else {
                setValid(false);
                setValidatedCode("");
                setMessage(data?.validationMessage || "Voucher không hợp lệ");
            }
        } catch (err: any) {
            setValid(false);
            setValidatedCode("");
            setMessage(
                err?.response?.data?.message || "Voucher không hợp lệ"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async () => {
        if (!validatedCode) {
            setMessage("Vui lòng quét và kiểm tra voucher hợp lệ trước");
            return;
        }

        if (!venueLocationId) {
            setMessage("Vui lòng chọn địa điểm");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            await redeemVoucherItem({
                itemCode: validatedCode,
                venueLocationId,
            });

            await redeemVoucherItem({
                itemCode: validatedCode,
                venueLocationId,
            });

            toast.success("Sử dụng voucher thành công!");
            setValid(false);
            setCode("");
            setValidatedCode("");
            setIsScanning(true);
            setScannerKey(prev => prev + 1);
        } catch (err: any) {
            setMessage(
                err?.response?.data?.message || "Sử dụng voucher thất bại"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRescan = () => {
        setCode("");
        setMessage("");
        setValid(false);
        setValidatedCode("");
        setIsScanning(true);
        setScannerKey(prev => prev + 1);
    };

    return (
        <div className="flex space-y-4 sm:space-y-5">
            <div className="flex-1 flex flex-col justify-center">
                {isScanning && (
                    <div className="flex flex-col gap-3">

                        <div className="text-lg font-bold text-gray-800">
                            Hướng dẫn quét mã QR
                        </div>

                        <div className="px-4 py-3 border border-blue-200 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium shadow-sm">
                            Đưa mã QR lại gần camera
                        </div>

                        <div className="px-4 py-3 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium shadow-sm">
                            Đặt vào trong khung quét
                        </div>

                        <div className="px-4 py-3 border border-amber-200 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium shadow-sm">
                            Giữ yên để nhận diện nhanh
                        </div>

                    </div>
                )}
                {/* Scanned Code Display */}
                {code && (
                    <div className="p-3 mb-4 sm:p-4 rounded-xl border border-gray-200 bg-linear-to-br from-gray-50 to-white">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">Mã đã quét</p>
                                <p className="text-sm sm:text-base font-bold text-gray-900 font-mono tracking-wider truncate">
                                    {code}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 animate-spin" />
                        <span className="text-xs sm:text-sm text-blue-700 font-medium">Đang xác thực voucher...</span>
                    </div>
                )}

                {/* Valid State with Redeem Button */}
                {valid && !loading && (
                    <div className="space-y-3">
                        <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs sm:text-sm font-medium text-emerald-900">Voucher hợp lệ</p>
                                <p className="text-xs text-emerald-700 mt-0.5">Sẵn sàng để sử dụng</p>
                            </div>
                        </div>
                        <button
                            onClick={handleRedeem}
                            disabled={loading}
                            className="w-full mb-4 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            Xác nhận sử dụng
                        </button>
                    </div>
                )}

                {/* Scan Again Button - Always visible */}
                {!isScanning && (
                    <button
                        onClick={handleRescan}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                        Scan lại
                    </button>
                )}

                {/* Error Message */}
                {message && !valid && !loading && !message.includes("thành công") && (
                    <div className="flex items-start gap-2 sm:gap-3 p-3 mt-4 sm:p-4 bg-red-50 border border-red-100 rounded-xl">
                        <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-red-800 flex-1">{message}</p>
                    </div>
                )}

                {/* Success Message after Redeem */}
                {/* {message && message.includes("thành công") && (
                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-emerald-800 flex-1 font-medium">{message}</p>
                    </div>
                )} */}
            </div>
            <div className="flex-1">
                {/* QR Scanner */}
                <div className="relative w-full max-w-xl mx-auto aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 border-gray-200 bg-black">
                    <QRScanner key={scannerKey} onScan={handleScan} />
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-t-3 sm:border-t-4 border-l-3 sm:border-l-4 border-emerald-500 rounded-tl-lg"></div>
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-t-3 sm:border-t-4 border-r-3 sm:border-r-4 border-emerald-500 rounded-tr-lg"></div>
                        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-b-3 sm:border-b-4 border-l-3 sm:border-l-4 border-emerald-500 rounded-bl-lg"></div>
                        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-b-3 sm:border-b-4 border-r-3 sm:border-r-4 border-emerald-500 rounded-br-lg"></div>
                    </div>
                </div>
            </div>



        </div>
    );
}