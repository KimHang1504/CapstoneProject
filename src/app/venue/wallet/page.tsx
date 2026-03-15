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

    if (loading) return <p>Loading wallet...</p>;

    return (
        <div className="p-6 space-y-6">

            <h1 className="text-2xl font-bold">Wallet</h1>

            {/* Cards */}
            <div className="grid grid-cols-2 gap-4">

                <div className="border rounded-lg p-4 shadow">
                    <p className="text-gray-500">Balance</p>
                    <p className="text-2xl font-bold text-green-600">
                        {wallet?.balance.toLocaleString()} VND
                    </p>
                </div>

                <div className="border rounded-lg p-4 shadow">
                    <p className="text-gray-500">Points</p>
                    <p className="text-2xl font-bold">
                        {wallet?.points.toLocaleString()}
                    </p>
                </div>

            </div>

            {/* Withdraw button */}
            <button
                onClick={() => setShowWithdraw(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Withdraw
            </button>

            {/* Withdraw history */}
            <div className="border rounded-lg p-4">
                <h2 className="font-semibold mb-4">Withdraw History</h2>

                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Bank</th>
                            <th className="border p-2">Account</th>
                            <th className="border p-2">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {withdraws.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center p-4">
                                    No withdraw requests
                                </td>
                            </tr>
                        )}

                        {withdraws.map((item) => (
                            <tr key={item.id}>
                                <td className="border p-2">
                                    {item.amount.toLocaleString()} VND
                                </td>

                                <td className="border p-2">
                                    {item.bankInfo?.bankName}
                                </td>

                                <td className="border p-2">
                                    {item.bankInfo?.accountNumber}
                                </td>

                                <td className="border p-2">
                                    {item.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            {
                showWithdraw && (
                    <WithdrawModal
                        onClose={() => setShowWithdraw(false)}
                        onSuccess={loadWallet}
                    />
                )
            }
        </div>

    );

}