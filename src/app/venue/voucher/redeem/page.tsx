"use client";

import { useState } from "react";
import {
  validateVoucherItem,
  redeemVoucherItem,
} from "@/api/venue/vouchers/api";

export default function RedeemVoucherPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!code) {
      setMessage("Vui lòng nhập voucher code");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await validateVoucherItem(code);

      setValid(true);
      setMessage("✅ Voucher hợp lệ. Có thể sử dụng.");
    } catch (err: any) {
      setValid(false);
      setMessage(
        err?.response?.data?.message || "❌ Voucher không hợp lệ"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    try {
      setLoading(true);

      await redeemVoucherItem(code);

      setMessage("🎉 Redeem voucher thành công!");
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

  return (
    <div className="p-6 max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">
        Redeem Voucher
      </h1>

      <div className="space-y-2">
        <label className="font-medium">
          Voucher Code
        </label>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Nhập voucher code"
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleValidate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Kiểm tra
        </button>

        {valid && (
          <button
            onClick={handleRedeem}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Redeem
          </button>
        )}
      </div>

      {message && (
        <p className="text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  );
}