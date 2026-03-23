"use client";

import { useEffect, useState } from "react";
import { getWalletBalance, getWithdrawRequests } from "@/api/venue/wallet/api";
import { Wallet, WithdrawRequest } from "@/api/venue/wallet/type";
import WithdrawModal from "@/app/venue/wallet/components/WithdrawModal";
import { Wallet as WalletIcon, Coins, ArrowDownCircle, Clock } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  APPROVED: { label: "Đã duyệt", cls: "bg-emerald-100 text-emerald-600" },
  PENDING: { label: "Đang chờ", cls: "bg-amber-100 text-amber-600" },
  REJECTED: { label: "Từ chối", cls: "bg-rose-100 text-rose-500" },
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => { loadWallet(); }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);
      const [walletData, withdrawData] = await Promise.all([
        getWalletBalance(),
        getWithdrawRequests(),
      ]);
      setWallet(walletData);
      setWithdraws(withdrawData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 grid grid-cols-2 gap-4 animate-pulse">
        {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
        <div className="col-span-2 h-48 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* Balance Cards */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="flex items-center gap-2 mb-3 relative">
          <WalletIcon size={18} className="opacity-80" />
          <span className="text-sm opacity-80">Số dư ví</span>
        </div>
        <p className="text-3xl font-bold relative">
          {wallet?.balance.toLocaleString("vi-VN")}
          <span className="text-base font-normal ml-1 opacity-80">₫</span>
        </p>
        <p className="text-xs opacity-60 mt-1 relative">
          {wallet?.isActive ? "Ví đang hoạt động" : "Ví tạm khóa"}
        </p>
      </div>


      {/* Withdraw Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={16} />
          <span className="text-sm">{withdraws.length} yêu cầu rút tiền</span>
        </div>
        <button
          onClick={() => setShowWithdraw(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
        >
          <ArrowDownCircle size={16} />
          Rút tiền
        </button>
      </div>

      {/* Withdraw History */}
      <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Lịch sử rút tiền</h2>
        </div>

        {withdraws.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-gray-400 gap-2">
            <ArrowDownCircle size={36} className="opacity-30" />
            <p className="text-sm">Chưa có yêu cầu rút tiền nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {withdraws.map((item) => {
              const s = STATUS_MAP[item.status] ?? { label: item.status, cls: "bg-gray-100 text-gray-500" };
              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-violet-50/40 transition">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                    <ArrowDownCircle size={18} className="text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">
                      {item.amount.toLocaleString("vi-VN")} ₫
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {item.bankInfo?.bankName} · {item.bankInfo?.accountNumber}
                    </p>
                    {item.rejectionReason && (
                      <p className="text-xs text-rose-500 truncate mt-1">
                        Lý do từ chối: {item.rejectionReason}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium ${s.cls}`}>
                      {s.label}
                    </span>
                    <p className="text-xs text-gray-400">
                      {new Date(item.requestedAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showWithdraw && (
        <WithdrawModal onClose={() => setShowWithdraw(false)} onSuccess={loadWallet} />
      )}
    </div>
  );
}
