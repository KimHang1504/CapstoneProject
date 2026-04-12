"use client";

import { useState } from "react";
import { withdrawWallet } from "@/api/venue/wallet/api";
import { X, ArrowDownCircle } from "lucide-react";
import { toast } from "sonner";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  balance: number;
};

export default function WithdrawModal({ onClose, onSuccess, balance }: Props) {
  const [form, setForm] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    const amount = Number(form.amount);
    const missingFields: string[] = [];

    if (!amount || amount <= 0) {
      toast.error("Số tiền không hợp lệ");
      return;
    }

    if (amount > balance) {
      toast.error(`Số dư không đủ. Bạn chỉ có ${balance.toLocaleString("vi-VN")} VND`);
      return;
    }
    // 3. Check các field bank info (nếu muốn validate ở FE)
    if (!form.bankName) missingFields.push("Tên ngân hàng");
    if (!form.accountNumber) missingFields.push("Số tài khoản");
    if (!form.accountName) missingFields.push("Tên chủ tài khoản");

    // 4. Nếu có field thiếu → báo
    if (missingFields.length > 0) {
      toast.error(`Vui lòng điền: ${missingFields.join(", ")}`);
      return;
    }
    try {
      setSubmitting(true);
      await withdrawWallet({
        amount,
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
      toast.error("Yêu cầu rút tiền thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <ArrowDownCircle size={20} className="text-violet-500" />
            <div>
              <h2 className="font-semibold text-gray-900">Rút tiền</h2>
              <p className="text-xs text-gray-400">Chuyển về tài khoản ngân hàng</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Số tiền rút</label>
            <div className="relative">
              <input
                type="number"
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-900"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">₫</span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">Thông tin ngân hàng</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Bank fields */}
          {[
            { field: "bankName", label: "Tên ngân hàng", placeholder: "VD: Vietcombank, ACB..." },
            { field: "accountNumber", label: "Số tài khoản", placeholder: "Nhập số tài khoản" },
            { field: "accountName", label: "Tên chủ tài khoản", placeholder: "Nhập tên chủ tài khoản" },
          ].map(({ field, label, placeholder }) => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
              <input
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-900"
                value={form[field as keyof typeof form]}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition"
          >
            {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>

      </div>
    </div>
  );
}
