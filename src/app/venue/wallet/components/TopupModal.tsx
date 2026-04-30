"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { createWalletTopup, getWalletBalance } from "@/api/venue/wallet/api";
import { WalletTopupResponse } from "@/api/venue/wallet/type";
import { cancelPayment, getPaymentStatus } from "@/api/venue/payment/api";
import { QrCode, X, Wallet, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "EXPIRED";

const POLL_INTERVAL_MS = 5000;
const MIN_TOPUP_AMOUNT = 1000;
const MAX_TOPUP_AMOUNT = 100_000_000;
const TOPUP_VALIDATION_TOAST_ID = "venue-owner-topup-amount-validation";

type AmountValidationState = "EMPTY" | "INVALID" | "BELOW_MIN" | "ABOVE_MAX" | "VALID";

export default function TopupModal({ onClose, onSuccess }: Props) {
  const [amountInput, setAmountInput] = useState("");
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [statusChecking, setStatusChecking] = useState(false);
  const [topup, setTopup] = useState<WalletTopupResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [amountValidation, setAmountValidation] = useState<AmountValidationState>("EMPTY");
  const [amountValue, setAmountValue] = useState<number>(0); // value thật

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    if (!number) return "";
    return Number(number).toLocaleString("vi-VN");
  };

  const parseCurrency = (value: string) => {
    return Number(value.replace(/\D/g, ""));
  };

  const transactionId = topup?.transactionId;

  // ======= NEW: track if already cancelled =======
  const hasCancelledRef = useRef(false);

  // ======= EXISTING: cancelPendingTransaction =======
  const cancelPendingTransaction = async (reason?: string) => {
    if (!transactionId || paymentStatus !== "PENDING") return;

    try {
      await cancelPayment(transactionId);
      setPaymentStatus("CANCELLED");
      if (reason) {
        console.info("Topup transaction cancelled:", reason, transactionId);
      }
    } catch (error) {
      console.error("Cancel pending topup error:", error);
    }
  };

  // ======= EXISTING: cancelPendingTransactionKeepalive =======
  const cancelPendingTransactionKeepalive = () => {
    if (!transactionId || paymentStatus !== "PENDING") return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) return;

    const endpoint = `${apiBase}/api/Payment/cancel/${transactionId}`;

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      keepalive: true,
    }).catch((error) => console.error("Keepalive cancel error:", error));
  };

  // ======= NEW: safeCancel wraps both cancel methods =======
  const safeCancel = async (reason?: string) => {
    if (!transactionId || hasCancelledRef.current) return;
    hasCancelledRef.current = true;

    if (reason === "user_click_cancel" || reason === "esc_close_modal" || reason === "close_modal") {
      await cancelPendingTransaction(reason);
    } else {
      cancelPendingTransactionKeepalive();
    }
  };

  const canSubmit = useMemo(() => amountValidation === "VALID", [amountValidation]);

  const validateAmountInput = (rawValue: string): AmountValidationState => {
    if (!rawValue.trim()) return "EMPTY";

    const amount = Number(rawValue);

    if (!Number.isFinite(amount) || amount <= 0) return "INVALID";
    if (amount < MIN_TOPUP_AMOUNT) return "BELOW_MIN";
    if (amount > MAX_TOPUP_AMOUNT) return "ABOVE_MAX";

    return "VALID";
  };

  const handleAmountInputChange = (value: string) => {
    const rawNumber = parseCurrency(value);

    setAmountValue(rawNumber);
    setAmountInput(formatCurrency(value));

    setAmountValidation(validateAmountInput(String(rawNumber)));
  };

  useEffect(() => {
    if (amountValidation === "BELOW_MIN") {
      toast.error(`Số tiền nạp tối thiểu là ${MIN_TOPUP_AMOUNT.toLocaleString("vi-VN")} VND`, {
        id: TOPUP_VALIDATION_TOAST_ID,
      });
      return;
    }

    if (amountValidation === "ABOVE_MAX") {
      toast.error(`Số tiền nạp tối đa là ${MAX_TOPUP_AMOUNT.toLocaleString("vi-VN")} VND`, {
        id: TOPUP_VALIDATION_TOAST_ID,
      });
      return;
    }

    if (amountValidation === "VALID" || amountValidation === "EMPTY") {
      toast.dismiss(TOPUP_VALIDATION_TOAST_ID);
    }
  }, [amountValidation]);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const data = await getWalletBalance();
        setWalletBalance(data.balance);
      } catch (error) {
        console.error("Load wallet balance error:", error);
      }
    };

    loadBalance();
  }, []);

  useEffect(() => {
    if (!topup?.expireAt || paymentStatus !== "PENDING") return;

    const expireTime = new Date(topup.expireAt).getTime();
    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expireTime - now) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        setPaymentStatus("EXPIRED");
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [topup?.expireAt, paymentStatus]);

  useEffect(() => {
    if (!transactionId || paymentStatus !== "PENDING") return;

    const interval = setInterval(async () => {
      try {
        setStatusChecking(true);
        const res = await getPaymentStatus(transactionId);
        const nextStatus = (res.data.status || "PENDING") as PaymentStatus;

        if (nextStatus === "SUCCESS") {
          setPaymentStatus("SUCCESS");
          toast.success("Nạp tiền thành công");
          await onSuccess();
          onClose();
          return;
        }

        if (nextStatus === "FAILED" || nextStatus === "CANCELLED" || nextStatus === "EXPIRED") {
          setPaymentStatus(nextStatus);
        }
      } catch (error) {
        console.error("Check payment status error:", error);
      } finally {
        setStatusChecking(false);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [transactionId, paymentStatus, onClose, onSuccess]);

  useEffect(() => {
    if (!topup || paymentStatus !== "PENDING") return;

    const handleBeforeUnload = () => safeCancel("unload");
    const handlePageHide = () => safeCancel("unload");
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") safeCancel("unload");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [topup, paymentStatus]); // <- dùng topup thay vì transactionId

  // ======= UPDATED: unmount cancel =======
  useEffect(() => {
    return () => {
      safeCancel("unmount");
    };
  }, [transactionId, paymentStatus]);

  // ======= UPDATED: ESC key cancel =======
  useEffect(() => {
    const onEsc = async (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (transactionId && paymentStatus === "PENDING") {
        const confirmed = window.confirm(
          "Bạn đang có giao dịch chờ thanh toán. Bạn có muốn hủy giao dịch trước khi đóng?"
        );
        if (!confirmed) return;
        await safeCancel("esc_close_modal");
      }

      onClose();
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [transactionId, paymentStatus, onClose]);

  const handleCreateTopup = async () => {
    try {
      setCreating(true);
      const amount = amountValue;
      if (!Number.isFinite(amount) || amount < MIN_TOPUP_AMOUNT) {
        toast.error(`Số tiền nạp tối thiểu là ${MIN_TOPUP_AMOUNT.toLocaleString("vi-VN")} VND`);
        return;
      }

      if (amount > MAX_TOPUP_AMOUNT) {
        toast.error(`Số tiền nạp tối đa là ${MAX_TOPUP_AMOUNT.toLocaleString("vi-VN")} VND`);
        return;
      }

      hasCancelledRef.current = false; // Reset flag for new transaction

      const response = await createWalletTopup({ amount });

      setTopup(response);
      setPaymentStatus("PENDING");
      toast.success("Đã tạo giao dịch nạp tiền");
    } catch (error: any) {
      console.error("Create topup error:", error);
      toast.error(error?.message || "Không thể tạo giao dịch nạp tiền");
    } finally {
      setCreating(false);
    }
  };

  const handleCancelByUser = async () => {
    await safeCancel("user_click_cancel");
    setPaymentStatus("CANCELLED");
    toast.message("Đã hủy giao dịch nạp tiền");
  };



  const handleClose = async () => {
    if (transactionId && paymentStatus === "PENDING") {
      const confirmed = window.confirm(
        "Bạn đang có giao dịch chờ thanh toán. Bạn có muốn hủy giao dịch trước khi đóng?"
      );
      if (!confirmed) return;

      await safeCancel("close_modal");
    }

    onClose();
  };

  const resetForRetry = () => {
    setTopup(null);
    setPaymentStatus("PENDING");
    setSecondsLeft(0);
    hasCancelledRef.current = false; // reset flag
  };

  const statusBadge = useMemo(() => {
    if (paymentStatus === "SUCCESS") return { label: "Thành công", cls: "bg-emerald-100 text-emerald-700" };
    if (paymentStatus === "FAILED") return { label: "Thất bại", cls: "bg-rose-100 text-rose-700" };
    if (paymentStatus === "CANCELLED") return { label: "Đã hủy", cls: "bg-slate-100 text-slate-700" };
    if (paymentStatus === "EXPIRED") return { label: "Hết hạn", cls: "bg-amber-100 text-amber-700" };
    return { label: "Đang chờ", cls: "bg-violet-100 text-violet-700" };
  }, [paymentStatus]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Wallet size={20} className="text-emerald-600" />
            <div>
              <h2 className="font-semibold text-gray-900">Nạp tiền vào ví</h2>
              <p className="text-xs text-gray-400">Venue Owner - VietQR</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <X size={16} />
          </button>
        </div>

        {!topup ? (
          <div className="flex-1 overflow-hidden p-6 space-y-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-800">
              Số dư hiện tại: <span className="font-semibold">{(walletBalance ?? 0).toLocaleString("vi-VN")} ₫</span>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Số tiền nạp</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Nhập số tiền nạp"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-900"
                  value={amountInput}
                  onChange={(e) => handleAmountInputChange(e.target.value)}
                  min={MIN_TOPUP_AMOUNT}
                  max={MAX_TOPUP_AMOUNT}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">₫</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Từ {MIN_TOPUP_AMOUNT.toLocaleString("vi-VN")} đến {MAX_TOPUP_AMOUNT.toLocaleString("vi-VN")} VND
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
              >
                Đóng
              </button>
              <button
                onClick={handleCreateTopup}
                disabled={creating || !canSubmit}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
                {creating ? "Đang tạo..." : "Tạo mã QR"}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Mã giao dịch #{topup.transactionId}</p>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge.cls}`}>{statusBadge.label}</span>
            </div>

            {/* Hiển thị QR và thông tin chi tiết chỉ khi giao dịch đang chờ */}
            {paymentStatus === "PENDING" && topup && (
              <>
                {topup.qrCodeUrl ? (
                  <div className="border border-gray-200 rounded-2xl p-4 ">
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={topup.qrCodeUrl} alt="VietQR" className="w-full max-h-[240px] object-contain" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Quét mã để chuyển khoản đúng nội dung
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm">
                    Không lấy được mã QR. Vui lòng tạo lại giao dịch.
                  </div>
                )}

                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm space-y-2">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Số tiền</span>
                    <span className="font-semibold text-gray-900">{topup.amount.toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Nội dung CK</span>
                    <span className="font-semibold text-gray-900">{topup.paymentContent}</span>
                  </div>
                  {topup.bankInfo && (
                    <>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Ngân hàng</span>
                        <span className="font-semibold text-gray-900">{topup.bankInfo.bankName}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Số tài khoản</span>
                        <span className="font-semibold text-gray-900">{topup.bankInfo.accountNumber}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Thời gian còn lại</span>
                    <span className={`font-semibold ${secondsLeft <= 30 ? "text-rose-600" : "text-gray-900"}`}>
                      {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Thông báo giao dịch hết hạn */}
            {paymentStatus === "EXPIRED" && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-800 flex items-center gap-2">
                <AlertTriangle size={16} />
                Giao dịch đã hết hạn. Vui lòng tạo mã QR mới.
              </div>
            )}

            {/* Thông báo giao dịch bị hủy */}
            {paymentStatus === "CANCELLED" && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-700 flex items-center gap-2">
                <AlertTriangle size={16} />
                Giao dịch đã hủy. Có thể tạo lại mã QR.
              </div>
            )}

            {/* {statusChecking && paymentStatus === "PENDING" && (
              <div className="text-xs text-gray-500 flex items-center gap-2 justify-center">
                <Loader2 size={14} className="animate-spin" />
                Đang kiểm tra trạng thái thanh toán...
              </div>
            )} */}

            <div className="flex gap-3 pt-2">
              {paymentStatus === "PENDING" && (
                <button
                  onClick={handleCancelByUser}
                  className="flex-1 py-2.5 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-50 transition"
                >
                  Hủy giao dịch
                </button>
              )}

              {(paymentStatus === "FAILED" || paymentStatus === "CANCELLED" || paymentStatus === "EXPIRED") && (
                <button
                  onClick={resetForRetry}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  Tạo lại QR
                </button>
              )}

              <button
                onClick={handleClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}