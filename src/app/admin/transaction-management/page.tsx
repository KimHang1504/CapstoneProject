"use client";

import { useEffect, useState } from "react";

import { getTransactions } from "@/api/admin/api";
import { TypeBadge } from "./components/TypeBadge";
import { StatusBadge } from "./components/StatusBadge";
import { Transaction, TransactionStatus, TransactionType } from "@/api/admin/type";

const PAGE_SIZE = 20;

export default function TransactionPage() {
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [status, setStatus] = useState<TransactionStatus | "">("");
    const [type, setType] = useState<TransactionType | "">("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        fetchData();
    }, [page, status, type, userId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getTransactions(
                page,
                PAGE_SIZE,
                status || undefined,
                type || undefined,
                userId ? Number(userId) : undefined
            );

            setData(res.data.items);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const formatMoney = (amount: number) =>
        amount.toLocaleString("vi-VN") + " ₫";

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
            <div className="w-full max-w-7xl space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Quản lí giao dịch
                    </h1>

                    <button
                        onClick={fetchData}
                        className="bg-[#B388EB] text-white px-4 py-2 rounded-lg"
                    >
                        Tải lại
                    </button>
                </div>

                {/* FILTER */}
                <div className="bg-white p-4 rounded-2xl shadow flex gap-4 flex-wrap">

                    {/* STATUS */}
                    <select
                        value={status}
                        onChange={(e) => {
                            setPage(1);
                            setStatus(e.target.value as TransactionStatus | "");
                        }}
                        className="border px-4 py-2 rounded-lg"
                    >
                        <option value="">All Status</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="PENDING">PENDING</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="EXPIRED">EXPIRED</option>
                    </select>

                    {/* TYPE */}
                    <select
                        value={type}
                        onChange={(e) => {
                            setPage(1);
                            setType(e.target.value as TransactionType | "");
                        }}
                        className="border px-4 py-2 rounded-lg"
                    >
                        <option value="">All Type</option>
                        <option value="WALLET_TOPUP">WALLET_TOPUP</option>
                        <option value="MEMBER_SUBSCRIPTION">MEMBER_SUBSCRIPTION</option>
                        <option value="MONEY_TO_POINT">MONEY_TO_POINT</option>
                        <option value="ADS_ORDER">ADS_ORDER</option>
                        <option value="VENUE_SUBSCRIPTION">VENUE_SUBSCRIPTION</option>
                    </select>

                    {/* USER ID */}
                    <input
                        type="number"
                        placeholder="User ID"
                        value={userId}
                        onChange={(e) => {
                            setPage(1);
                            setUserId(e.target.value);
                        }}
                        className="border px-4 py-2 rounded-lg"
                    />

                    <button
                        onClick={() => {
                            setStatus("");
                            setType("");
                            setUserId("");
                            setPage(1);
                        }}
                        className="border px-4 py-2 rounded-lg"
                    >
                        Reset
                    </button>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <table className="w-full text-sm">

                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left">ID</th>
                                <th className="p-4 text-left">User</th>
                                <th className="p-4 text-left">Amount</th>
                                <th className="p-4 text-left">Type</th>
                                <th className="p-4 text-left">Method</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Time</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <SkeletonRow key={i} />
                                ))
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center p-10">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                data.map((t) => (
                                    <tr key={t.transactionId} className="border-t hover:bg-purple-50">
                                        <td className="p-4 font-medium">#{t.transactionId}</td>

                                        <td className="p-4">
                                            <div>
                                                <div className="font-medium">{t.userName}</div>
                                                <div className="text-xs text-gray-400">{t.userEmail}</div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-violet-600 font-semibold">
                                            {formatMoney(t.amount)}
                                        </td>

                                        <td className="p-4">
                                            <TypeBadge type={t.transactionType} />
                                        </td>

                                        <td className="p-4">{t.paymentMethod}</td>

                                        <td className="p-4">
                                            <StatusBadge status={t.status} />
                                        </td>

                                        <td className="p-4 text-xs text-gray-500">
                                            {new Date(t.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-center gap-2">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                        Prev
                    </button>

                    <span>{page} / {totalPages}</span>

                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                        Next
                    </button>
                </div>

            </div>
        </div>
    );
}

function SkeletonRow() {
    return (
        <tr className="border-t animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="p-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                </td>
            ))}
        </tr>
    );
}