"use client";

import { getWithdrawRequests } from "@/api/admin/api";
import { WithdrawRequest } from "@/api/admin/type";
import { useEffect, useState } from "react";

export default function WithdrawPage() {
  const [data, setData] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<WithdrawRequest["status"] | "">("");

  useEffect(() => {
    fetchData();
  }, [status]);

  const fetchData = async () => {
    setLoading(true);

    const res = await getWithdrawRequests(status);
    setData(res.data);

    setLoading(false);
  };

  const filtered = data.filter((item) =>
    status ? item.status === status : true
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lí rút tiền
          </h1>

          <button
            onClick={fetchData}
            className="bg-[#B388EB] text-white px-4 py-2 rounded-lg shadow hover:opacity-90 cursor-pointer"
          >
            Tải lại
          </button>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-2xl shadow flex gap-4 items-center">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as WithdrawRequest["status"] | "")
            }
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#B388EB] cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <button
            onClick={() => setStatus("")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Mặc định
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Số tiền</th>
                <th className="p-4 text-left">Ngân hàng</th>
                <th className="p-4 text-left">Tài khoản</th>
                <th className="p-4 text-left">Trạng thái</th>
                <th className="p-4 text-left">Thời gian</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-10 text-gray-400">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-purple-50 transition"
                  >
                    {/* ID */}
                    <td className="p-4 font-medium">{item.id}</td>

                    {/* Amount */}
                    <td className="p-4 text-violet-600 font-semibold">
                      {item.amount.toLocaleString()} ₫
                    </td>

                    {/* Bank */}
                    <td className="p-4">
                      {item.bankInfo.bankName || "N/A"}
                    </td>

                    {/* Account */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {item.bankInfo.accountName || "N/A"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.bankInfo.accountNumber || ""}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Time */}
                    <td className="p-4 text-gray-500 text-xs">
                      {new Date(item.requestedAt).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      {item.status === "PENDING" ? (
                        <div className="flex justify-center gap-2">
                          <button className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600">
                            Approve
                          </button>
                          <button className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : status === "REJECTED"
        ? "bg-red-100 text-red-600"
        : status === "APPROVED"
          ? "bg-green-100 text-green-600"
          : "bg-gray-100 text-gray-500";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-t animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
}