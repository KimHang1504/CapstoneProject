"use client";

import Link from "next/link";
import {
  submitVoucher,
  revokeVoucher,
  activateVoucher,
  endVoucher,
} from "@/api/venue/vouchers/api";
import { VoucherDetail } from "@/api/venue/vouchers/type";

import { Send, Pencil, RotateCcw, Play, Square } from "lucide-react";
import { toast } from "sonner";

type Props = {
  voucher: VoucherDetail;
  onChanged: () => Promise<void>;
};

export default function VoucherActions({ voucher, onChanged }: Props) {

  const isValidStartDate = (startDate: string) => {
    const today = new Date();
    const vnToday = new Date(today.getTime() + (7 - today.getTimezoneOffset() / 60) * 60 * 60 * 1000);
    vnToday.setHours(0, 0, 0, 0);

    const minStart = new Date(vnToday);
    minStart.setDate(minStart.getDate() + 3);

    const start = new Date(startDate);

    return start >= minStart;
  };

  const handleSubmit = async () => {
    if (!isValidStartDate(voucher.startDate)) {
      toast.error("Ngày bắt đầu không còn hợp lệ. Vui lòng chỉnh sửa lại.");
      return;
    }

    await submitVoucher(voucher.id);
    onChanged();
  };

  const handleRevoke = async () => {
    await revokeVoucher(voucher.id);
    onChanged();
  };

  const handleActivate = async () => {
    await activateVoucher(voucher.id);
    onChanged();
  };

  const handleEnd = async () => {
    await endVoucher(voucher.id);
    onChanged();
  };

  return (
    <div className="flex gap-3">

      {voucher.status === "DRAFTED" && (
        <>
          <Link
            href={`/venue/voucher/myvoucher/${voucher.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium
            bg-gray-100 text-gray-700 border border-gray-200
            hover:bg-gray-200 hover:shadow-sm transition-all duration-200"
          >
            <Pencil size={18} />
            Chỉnh sửa
          </Link>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm
            bg-gradient-to-r from-violet-500 to-purple-500 text-white
            hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-200"
          >
            <Send size={18} />
            Gửi duyệt
          </button>
        </>
      )}

      {voucher.status === "PENDING" && (
        <button
          onClick={handleRevoke}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm
          bg-amber-500 text-white
          hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-200"
        >
          <RotateCcw size={18} />
          Thu hồi
        </button>
      )}

      {voucher.status === "REJECTED" && (
        <Link
          href={`/venue/voucher/${voucher.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium
          bg-gray-100 text-gray-700 border border-gray-200
          hover:bg-gray-200 hover:shadow-sm transition-all duration-200"
        >
          <Pencil size={18} />
          Chỉnh sửa
        </Link>
      )}

      {voucher.status === "APPROVED" && (
        <button
          onClick={handleActivate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm
          bg-emerald-600 text-white
          hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-200"
        >
          <Play size={18} />
          Kích hoạt
        </button>
      )}

      {voucher.status === "ACTIVE" && (
        <button
          onClick={handleEnd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm
          bg-rose-600 text-white
          hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-200"
        >
          <Square size={18} />
          Kết thúc
        </button>
      )}

    </div>
  );
}