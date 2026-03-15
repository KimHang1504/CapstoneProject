"use client";

import Link from "next/link";
import {
  submitVoucher,
  revokeVoucher,
  activateVoucher,
  endVoucher,
} from "@/api/venue/vouchers/api";
import { VoucherDetail } from "@/api/venue/vouchers/type";

type Props = {
  voucher: VoucherDetail;
  onChanged: () => Promise<void>;
};

export default function VoucherActions({ voucher, onChanged }: Props) {


  const handleSubmit = async () => {
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
    <div className="flex gap-2">

      {voucher.status === "DRAFTED" && (
        <>
          <Link
            href={`/venue/voucher/${voucher.id}/edit`}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Edit
          </Link>

          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </>
      )}

      {voucher.status === "PENDING" && (
        <button
          onClick={handleRevoke}
          className="px-3 py-1 bg-yellow-500 text-white rounded"
        >
          Revoke
        </button>
      )}

      {voucher.status === "REJECTED" && (
        <Link
          href={`/venue/voucher/${voucher.id}/edit`}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Edit
        </Link>
      )}

      {voucher.status === "APPROVED" && (
        <button
          onClick={handleActivate}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Activate
        </button>
      )}

      {voucher.status === "ACTIVE" && (
        <button
          onClick={handleEnd}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          End
        </button>
      )}
    </div>
  );
}