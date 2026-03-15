"use client";

import { useState } from "react";
import { withdrawWallet } from "@/api/venue/wallet/api";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function WithdrawModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await withdrawWallet({
        amount: Number(form.amount),
        bankInfo: {
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          accountName: form.accountName,
        },
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Withdraw failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">

        <h2 className="text-lg font-semibold">Withdraw</h2>

        <input
          placeholder="Amount"
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={form.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
        />

        <input
          placeholder="Bank Name"
          className="w-full border px-3 py-2 rounded"
          value={form.bankName}
          onChange={(e) => handleChange("bankName", e.target.value)}
        />

        <input
          placeholder="Account Number"
          className="w-full border px-3 py-2 rounded"
          value={form.accountNumber}
          onChange={(e) => handleChange("accountNumber", e.target.value)}
        />

        <input
          placeholder="Account Name"
          className="w-full border px-3 py-2 rounded"
          value={form.accountName}
          onChange={(e) => handleChange("accountName", e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="border px-3 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}