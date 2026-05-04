"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PaymentQrInfoLocation } from "@/api/venue/location/type";
import { getPaymentQrInfo } from "@/api/venue/location/api";
import { getPaymentStatus, cancelPayment } from "@/api/venue/payment/api";
import { toast } from "sonner";
import {
  Copy,
  MousePointerClick,
  ShieldCheck,
  Zap,
  CheckCircle2,
  X,
  AlertTriangle
} from "lucide-react";

export default function QRContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const locationId = searchParams.get("locationId");
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentQrInfoLocation | null>(null);
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

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

  // 2. Polling Status & Redirect logic
  useEffect(() => {
    if (!transactionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await getPaymentStatus(Number(transactionId));
        const status = res.data.status;

        if (status === "SUCCESS") {
          clearInterval(interval);
          router.push(`/payment/success?transactionId=${transactionId}&type=location&locationId=${locationId}`);
        }

        if (["FAILED", "CANCELLED", "EXPIRED"].includes(status)) {
          clearInterval(interval);
          router.push(`/payment/failure?transactionId=${transactionId}&type=location&locationId=${locationId}`);
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [transactionId, router, locationId]);

  // 3. Block Back Button (Popstate)
  useEffect(() => {
    if (!transactionId) return;

    const handlePopState = () => {
      if (!isLeaving) {
        window.history.pushState(null, "", window.location.href);
        setShowLeavePopup(true);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [transactionId, isLeaving]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const handleCancelPayment = async () => {
    if (!transactionId) return;
    try {
      await cancelPayment(Number(transactionId));
      router.push(`/venue/location/mylocation/${locationId}`);
      toast.success("Đã hủy thanh toán thành công");
    } catch {
      toast.error("Không thể hủy thanh toán");
    }
  };

  const confirmLeave = async () => {
    try {
      setIsLeaving(true);
      await cancelPayment(Number(transactionId));
      router.push(`/payment/failure?transactionId=${transactionId}&type=location&locationId=${locationId}`);
    } catch {
      setIsLeaving(false);
      toast.error("Không thể hủy thanh toán");
    }
  };

  if (!payment) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans text-slate-900">

      <div className="w-full max-w-[900px]">

        {/* Header Area */}
        <div className="flex justify-between items-center mb-8 px-2">
          <h1 className="text-2xl font-black tracking-tight uppercase">Thanh toán</h1>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Cổng VietQR</span>
          </div>
        </div>

        {/* TICKET CONTAINER (Landscape) */}
        <div className="flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative">

          {/* LEFT: QR SECTION */}
          <div className="p-10 flex flex-col items-center justify-center bg-slate-50 md:w-[300px] border-b md:border-b-0 md:border-r border-dashed border-slate-200">
            <div className="relative group p-3 bg-white rounded-3xl shadow-md border border-white">
              <Image
                src={payment.qrCodeUrl}
                alt="QR"
                width={200}
                height={200}
                unoptimized
                className="w-44 h-44 rounded-lg mix-blend-multiply"
              />
              <div className="absolute inset-x-4 top-4 h-[2px] bg-slate-900/10 animate-scan" />
            </div>

            <div className="mt-8 text-center space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quét mã để chuyển khoản</p>

            </div>
          </div>

          {/* RIGHT: INFO SECTION */}
          <div className="flex-1 p-10 flex flex-col justify-between">
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 block mb-1">Ngân hàng thụ hưởng</label>
                    <p className="text-base font-black text-slate-900 leading-tight">{payment.bankInfo.BankName}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 block mb-1">Chủ tài khoản</label>
                    <p className="text-sm font-bold text-slate-500 uppercase">{payment.bankInfo.AccountName}</p>
                  </div>
                </div>

                <div className="md:text-right">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 block mb-1">Tổng tiền</label>
                  <div className="text-5xl font-black tracking-tighter italic text-purple-900">
                    {payment.amount.toLocaleString()}<span className="text-xl ml-1 opacity-30 italic">₫</span>
                  </div>
                </div>
              </div>

              {/* STK Box */}
              <div
                onClick={() => copy(payment.bankInfo.AccountNumber, "STK")}
                className="group cursor-pointer flex items-center justify-between transition-all"
              >
                  <label className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 block mb-1">Số tài khoản</label>
                  <p className="text-2xl font-mono font-black tracking-tighter text-slate-900">{payment.bankInfo.AccountNumber}</p>
                
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

            {/* Footer của vé */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-900 text-white rounded-full shadow-lg">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-tighter italic">Đang chờ xác nhận...</span>
              </div>
              <button
                onClick={handleCancelPayment}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-xs font-bold uppercase tracking-widest"
              >
                <X size={14} /> Hủy đơn
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LEAVE POPUP MODAL */}
      {showLeavePopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-[360px] shadow-2xl border border-slate-100">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Xác nhận rời đi?</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              Giao dịch thanh toán của bạn chưa hoàn tất. Nếu rời khỏi trang này, đơn hàng sẽ bị <b>hủy bỏ</b> ngay lập tức.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowLeavePopup(false)}
                className="py-3 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
              >
                Ở lại
              </button>
              <button
                onClick={confirmLeave}
                className="py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                Rời đi
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