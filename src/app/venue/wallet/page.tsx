"use client";

import { useEffect, useState } from "react";
import { getWalletBalance, getWithdrawRequests, getTransactionHistory } from "@/api/venue/wallet/api";
import { Wallet, WithdrawRequest, PaginatedTransactionResponse } from "@/api/venue/wallet/type";
import WithdrawModal from "@/app/venue/wallet/components/WithdrawModal";
import TopupModal from "@/app/venue/wallet/components/TopupModal";
import { Wallet as WalletIcon, ArrowDownCircle, ArrowDownRight, ArrowUpRight, History, ChevronLeft, ChevronRight, QrCode } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  APPROVED: { label: "Đã duyệt", cls: "bg-emerald-100 text-emerald-600" },
  PENDING: { label: "Đang chờ", cls: "bg-amber-100 text-amber-600" },
  REJECTED: { label: "Từ chối", cls: "bg-rose-100 text-rose-500" },
};

const TRANSACTION_TYPE_MAP: Record<string, string> = {
  ADS_ORDER: "Quảng cáo",
  VENUE_SUBSCRIPTION: "Đăng ký địa điểm",
  REFUND: "Hoàn tiền",
  DEPOSIT: "Nạp tiền",
  WITHDRAW: "Rút tiền",
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>([]);
  const [transactionData, setTransactionData] = useState<PaginatedTransactionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const [activeTab, setActiveTab] = useState<'transactions' | 'withdraws'>('transactions');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => { loadWallet(); }, []);

  useEffect(() => {
    if (activeTab === 'transactions') {
      loadTransactions(currentPage);
    }
  }, [currentPage, activeTab]);

  const loadWallet = async () => {
    try {
      setLoading(true);
      const [walletData, withdrawData] = await Promise.all([
        getWalletBalance(),
        getWithdrawRequests(),
      ]);
      setWallet(walletData);
      setWithdraws(withdrawData);
      
      // Load first page of transactions
      const transactionResponse = await getTransactionHistory(1, pageSize);
      setTransactionData(transactionResponse);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (page: number) => {
    try {
      setLoadingTransactions(true);
      const response = await getTransactionHistory(page, pageSize);
      setTransactionData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
        {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
        <div className="col-span-1 sm:col-span-2 h-48 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full space-y-5">

        {/* Balance Cards */}
        <div className="relative overflow-hidden bg-linear-to-br from-violet-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="flex items-center gap-2 mb-3 relative">
            <WalletIcon size={20} className="opacity-80" />
            <span className="text-sm sm:text-base opacity-80">Số dư ví</span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold relative">
            {wallet?.balance.toLocaleString("vi-VN")}
            <span className="text-base sm:text-lg font-normal ml-1 opacity-80">₫</span>
          </p>
        </div>


        {/* Withdraw Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <History size={16} />
            <span className="text-sm">
              {transactionData?.totalCount || 0} giao dịch
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowTopup(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <QrCode size={16} />
              Nạp tiền
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <ArrowDownCircle size={16} />
              Rút tiền
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('transactions');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-sm font-medium transition relative ${
              activeTab === 'transactions'
                ? 'text-violet-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Biến động số dư
            {activeTab === 'transactions' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('withdraws')}
            className={`px-4 py-2.5 text-sm font-medium transition relative ${
              activeTab === 'withdraws'
                ? 'text-violet-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lịch sử rút tiền
            {activeTab === 'withdraws' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
            )}
          </button>
        </div>

        {/* Transaction History */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Biến động số dư</h2>
            </div>

            {loadingTransactions ? (
              <div className="flex items-center justify-center py-14">
                <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              </div>
            ) : !transactionData || transactionData.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-gray-400 gap-2">
                <History size={36} className="opacity-30" />
                <p className="text-sm">Chưa có giao dịch nào</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-50">
                  {transactionData.items.map((item) => {
                    const isIncoming = item.direction === 'IN';
                    return (
                      <div key={item.transactionId} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-violet-50/40 transition">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncoming ? 'bg-emerald-100' : 'bg-rose-100'
                        }`}>
                          {isIncoming ? (
                            <ArrowDownRight size={18} className="text-emerald-600" />
                          ) : (
                            <ArrowUpRight size={18} className="text-rose-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">
                            {TRANSACTION_TYPE_MAP[item.transactionType] || item.transactionType}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                            {item.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(item.createdAt).toLocaleString("vi-VN")}
                          </p>
                        </div>
                        <div className="text-left sm:text-right shrink-0 w-full sm:w-auto">
                          <p className={`font-bold text-base ${
                            isIncoming ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {isIncoming ? '+' : '-'}{Math.abs(item.balanceChange).toLocaleString("vi-VN")} ₫
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.paymentMethod}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {transactionData.totalPages > 1 && (
                  <div className="px-4 sm:px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Trang {transactionData.pageNumber} / {transactionData.totalPages} 
                      <span className="ml-2 text-gray-400">
                        ({transactionData.totalCount} giao dịch)
                      </span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!transactionData.hasPreviousPage}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft size={16} />
                        Trước
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!transactionData.hasNextPage}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        Sau
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Withdraw History */}
        {activeTab === 'withdraws' && (
          <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Lịch sử rút tiền</h2>
              <span className="text-xs text-gray-400">{withdraws.length} yêu cầu</span>
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
                  const hasBankInfo = item.bankInfo?.bankName && item.bankInfo?.accountNumber;
                  return (
                    <div key={item.id} className="px-4 sm:px-5 py-4 hover:bg-violet-50/40 transition">
                      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          item.status === 'APPROVED' ? 'bg-emerald-100' : 
                          item.status === 'REJECTED' ? 'bg-rose-100' : 'bg-violet-100'
                        }`}>
                          <ArrowDownCircle size={18} className={
                            item.status === 'APPROVED' ? 'text-emerald-500' : 
                            item.status === 'REJECTED' ? 'text-rose-500' : 'text-violet-500'
                          } />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-gray-900 text-lg">
                              {item.amount.toLocaleString("vi-VN")} ₫
                            </p>
                            <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${s.cls}`}>
                              {s.label}
                            </span>
                          </div>

                          {/* Bank Info */}
                          {hasBankInfo ? (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-gray-700">
                                <span className="font-medium">{item.bankInfo?.bankName}</span>
                                <span className="hidden sm:inline text-gray-300">|</span>
                                <span className="font-mono">{item.bankInfo?.accountNumber}</span>
                              </div>
                              {item.bankInfo?.accountName && (
                                <p className="text-xs text-gray-500 mt-1 uppercase">
                                  {item.bankInfo.accountName}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="mt-2 text-xs text-gray-400 italic">
                              Không có thông tin ngân hàng
                            </p>
                          )}

                          {/* Rejection Reason */}
                          {item.rejectionReason && (
                            <div className="mt-2 p-2 bg-rose-50 rounded-lg border border-rose-100">
                              <p className="text-xs text-rose-600">
                                <span className="font-medium">Lý do từ chối:</span> {item.rejectionReason}
                              </p>
                            </div>
                          )}

                          {/* Proof Image */}
                          {item.proofImageUrl && (
                            <div className="mt-2">
                              <a 
                                href={item.proofImageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 hover:underline"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                  <circle cx="9" cy="9" r="2"/>
                                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                </svg>
                                Xem ảnh chứng từ
                              </a>
                            </div>
                          )}

                          {/* Timestamp */}
                          <p className="text-xs text-gray-400 mt-2">
                            Yêu cầu lúc {new Date(item.requestedAt).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {showWithdraw && (
          <WithdrawModal onClose={() => setShowWithdraw(false)} onSuccess={loadWallet} />
        )}

        {showTopup && (
          <TopupModal onClose={() => setShowTopup(false)} onSuccess={loadWallet} />
        )}
      </div>
    </div>
  );
}
