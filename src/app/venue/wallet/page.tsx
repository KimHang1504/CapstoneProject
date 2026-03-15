"use client";

import { useEffect, useState } from "react";
import { getWalletBalance, getWithdrawRequests } from "@/api/venue/wallet/api";
import { Wallet, WithdrawRequest } from "@/api/venue/wallet/type";
import WithdrawModal from "@/app/venue/wallet/components/WithdrawModal";

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);

      const walletData = await getWalletBalance();
      const withdrawData = await getWithdrawRequests();

      setWallet(walletData);
      setWithdraws(withdrawData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Đang tải ví...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Ví cửa hàng
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý số dư và các yêu cầu rút tiền
        </p>
      </div>

      {/* WALLET CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Số dư */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Số dư
          </p>

          <p className="text-3xl font-bold text-purple-600 mt-1">
            {wallet?.balance.toLocaleString()} VND
          </p>
        </div>

        {/* Điểm */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Điểm tích lũy
          </p>

          <p className="text-3xl font-bold text-purple-600 mt-1">
            {wallet?.points.toLocaleString()}
          </p>
        </div>
      </div>

      {/* BUTTON RÚT TIỀN */}
      <div>
        <button
          onClick={() => setShowWithdraw(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Rút tiền
        </button>
      </div>

      {/* LỊCH SỬ RÚT TIỀN */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="border-b px-5 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Lịch sử rút tiền
          </h2>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Số tiền</th>
                <th className="p-3 text-left">Ngân hàng</th>
                <th className="p-3 text-left">Số tài khoản</th>
                <th className="p-3 text-left">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {withdraws.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-6 text-gray-500"
                  >
                    Chưa có yêu cầu rút tiền
                  </td>
                </tr>
              )}

              {withdraws.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3 font-medium">
                    {item.amount.toLocaleString()} VND
                  </td>

                  <td className="p-3">
                    {item.bankInfo?.bankName}
                  </td>

                  <td className="p-3">
                    {item.bankInfo?.accountNumber}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        item.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "PENDING"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {item.status === "APPROVED" && "Đã duyệt"}
                      {item.status === "PENDING" && "Đang chờ"}
                      {item.status === "REJECTED" && "Từ chối"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL RÚT TIỀN */}
      {showWithdraw && (
        <WithdrawModal
          onClose={() => setShowWithdraw(false)}
          onSuccess={loadWallet}
        />
      )}
    </div>
  );
}