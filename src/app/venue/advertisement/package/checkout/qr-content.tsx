"use client";

import { getPaymentStatus, cancelPayment } from "@/api/venue/payment/api";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
    QrCode,
    X,
    Copy,
    ShieldCheck,
    Zap,
    CheckCircle2,
    AlertTriangle,
    MousePointerClick
} from "lucide-react";
import { toast } from "sonner";
import { PurchaseSubscriptionResponse } from "@/api/venue/subscription/type";
import { getPaymentQrInfo } from "@/api/venue/advertisement/api";

export default function QRContent() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get("transactionId");
    const type = searchParams.get("type");
    const adId = searchParams.get("adId");
    const router = useRouter();
    const [showLeavePopup, setShowLeavePopup] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const [payment, setPayment] = useState<PurchaseSubscriptionResponse | null>(null);

    // 1. Fetch QR Info
    useEffect(() => {
        if (!transactionId) return;

        const fetchQr = async () => {
            try {
                const res = await getPaymentQrInfo(Number(transactionId));
                setPayment(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchQr();
    }, [transactionId]);

    // 2. Polling Status
    useEffect(() => {
        if (!transactionId) return;

        const interval = setInterval(async () => {
            try {
                const res = await getPaymentStatus(Number(transactionId));
                const status = res.data.status;

                if (status === "SUCCESS") {
                    clearInterval(interval);
                    router.push(
                        `/payment/success?transactionId=${transactionId}&type=${type}`
                    );
                }

                if (
                    ["FAILED", "CANCELLED", "EXPIRED"].includes(status)
                ) {
                    clearInterval(interval);
                    router.push(
                        `/payment/failure?transactionId=${transactionId}&type=${type}&adId=${adId}`
                    );
                }
            } catch (err) {
                console.error("Check payment error:", err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [transactionId, router, type, adId]);

    // Helper Copy
    const copy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Đã sao chép ${label}`);
    };

    // 3. Handle Cancel Manual
    const handleCancel = async () => {
        if (!transactionId) return;

        try {
            await cancelPayment(Number(transactionId));
            router.push(
                `/payment/failure?transactionId=${transactionId}&type=${type}&adId=${adId}`
            );
        } catch (error) {
            console.error("Cancel payment error:", error);
            toast.error("Không thể huỷ thanh toán");
        }
    };

    // 4. Block Back & Popstate logic
    useEffect(() => {
        if (!transactionId) return;

        const handlePopState = () => {
            if (isLeaving) return;
            setShowLeavePopup(true);
            window.history.pushState(null, "", window.location.href);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [transactionId, isLeaving]);

    if (!payment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Đang chuẩn bị đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 font-sans">

            <div className="w-full max-w-[900px] animate-in fade-in zoom-in-95 duration-500">

                {/* Header */}
                <div className="flex justify-between items-center mb-8 px-2">
                    <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">Thanh toán quảng cáo</h1>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Cổng VietQR</span>
                    </div>
                </div>

                {/* MAIN TICKET */}
                <div className="flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative">

                    {/* LEFT: QR SECTION */}
                    <div className="p-10 flex flex-col items-center justify-center bg-slate-50 md:w-[320px] border-b md:border-b-0 md:border-r border-dashed border-slate-200">
                        <div className="relative p-3 bg-white rounded-3xl shadow-md border border-white">
                            <Image
                                src={payment.qrCodeUrl}
                                alt="QR"
                                width={200}
                                height={200}
                                unoptimized
                                className="w-48 h-48 rounded-lg mix-blend-multiply"
                            />
                            <div className="absolute inset-x-4 top-4 h-[2px] bg-indigo-500/20 animate-scan" />
                        </div>

                        <div className="mt-8 text-center space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quét mã để hoàn tất</p>
                           
                        </div>
                    </div>

                    {/* RIGHT: INFO SECTION */}
                    <div className="flex-1 p-10 flex flex-col justify-between">
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 block mb-1">Ngân hàng</label>
                                        <p className="text-base font-black text-slate-900">{payment.bankInfo.bankName}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 block mb-1">Người thụ hưởng</label>
                                        <p className="text-sm font-bold text-slate-600 uppercase">{payment.bankInfo.accountName}</p>
                                    </div>
                                </div>

                                <div className="md:text-right">
                                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 block mb-1">Số tiền</label>
                                    <div className="text-5xl font-black tracking-tighter italic text-purple-900">
                                        {payment.amount.toLocaleString()}<span className="text-xl ml-1 opacity-20 italic">₫</span>
                                    </div>
                                </div>
                            </div>

                            {/* STK & Content */}
                            <div className="space-y-5">
                                <div
                                    onClick={() => copy(payment.bankInfo.accountNumber, "STK")}
                                    className="group cursor-pointer flex items-center justify-between transition-all"
                                >
                                    <label className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 block mb-1">Số tài khoản</label>
                                    <p className="text-2xl font-mono font-black text-slate-900 leading-none">{payment.bankInfo.accountNumber}</p>
                                    <Copy className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                                </div>

                                <div
                                    onClick={() => copy(payment.paymentContent, "nội dung")}
                                    className="group bg-slate-50 hover:bg-purple-200 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between transition"
                                >
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                                            Nội dung
                                        </p>
                                        <p className="text-sm font-mono font-semibold text-slate-900 truncate">
                                            {payment.paymentContent}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-900 text-white rounded-full">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-tighter italic text-white">Đang chờ giao dịch...</span>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-xs font-bold uppercase tracking-widest"
                            >
                                <X size={14} /> Hủy giao dịch
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-center text-[10px] text-slate-400 uppercase tracking-[0.3em]">
                    Vui lòng không tắt trình duyệt cho đến khi nhận được thông báo thành công
                </p>
            </div>

            {/* POPUP XÁC NHẬN RỜI TRANG */}
            {showLeavePopup && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-[380px] shadow-2xl border border-slate-100">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                            <AlertTriangle className="text-red-500 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Hủy thanh toán?</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8">
                            Giao dịch của bạn đang được xử lý. Nếu rời khỏi trang, yêu cầu quảng cáo này sẽ bị <b>hủy bỏ ngay lập tức</b>.
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => {
                                    setShowLeavePopup(false);
                                    window.history.pushState(null, "", window.location.href);
                                }}
                                className="py-4 cursor-pointer bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-colors uppercase text-xs tracking-widest"
                            >
                                Ở lại
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        setIsLeaving(true);
                                        await cancelPayment(Number(transactionId));
                                        router.push(
                                            `/payment/failure?transactionId=${transactionId}&type=${type}&adId=${adId}`
                                        );
                                    } catch (error) {
                                        console.error("Auto cancel error:", error);
                                        setIsLeaving(false);
                                        toast.error("Không thể huỷ thanh toán");
                                    }
                                }}
                                className="py-4 cursor-pointer bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all uppercase text-xs tracking-widest"
                            >
                                Rời khỏi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
        @keyframes scan {
          0% { top: 1rem; opacity: 0; }
          50% { opacity: 1; }
          100% { top: calc(100% - 1rem); opacity: 0; }
        }
        .animate-scan { animation: scan 3s ease-in-out infinite; }
      `}</style>
        </div>
    );
}