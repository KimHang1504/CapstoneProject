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
      alert("Yêu cầu rút tiền thất bại");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-xl shadow-lg">

        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Rút tiền</h2>
          <p className="text-sm text-gray-500">
            Chuyển tiền từ ví của bạn về tài khoản ngân hàng
          </p>
        </div>

        <div className="p-6 space-y-5">

          {/* Amount */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Số tiền rút
            </label>
            <input
              type="number"
              placeholder="Nhập số tiền"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </div>

          {/* Bank section */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">
              Thông tin ngân hàng
            </p>

            <div>
              <label className="text-sm block mb-1">
                Tên ngân hàng
              </label>
              <input
                placeholder="VD: Vietcombank, ACB, Techcombank..."
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.bankName}
                onChange={(e) => handleChange("bankName", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm block mb-1">
                Số tài khoản
              </label>
              <input
                placeholder="Nhập số tài khoản"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.accountNumber}
                onChange={(e) =>
                  handleChange("accountNumber", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm block mb-1">
                Tên chủ tài khoản
              </label>
              <input
                placeholder="Nhập tên chủ tài khoản"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.accountName}
                onChange={(e) =>
                  handleChange("accountName", e.target.value)
                }
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Gửi yêu cầu rút tiền
          </button>
        </div>

      </div>
    </div>
  );
}