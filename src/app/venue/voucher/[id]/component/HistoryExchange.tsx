"use client";

import { useEffect, useState } from "react";
import { getVoucherExchanges } from "@/api/venue/vouchers/api";
import { VoucherExchangeItem } from "@/api/venue/vouchers/type";

type Props = {
  voucherId: number;
};

export default function HistoryExchange({ voucherId }: Props) {

  const [items, setItems] = useState<VoucherExchangeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [voucherId]);

  const fetchData = async () => {
    try {
      const res = await getVoucherExchanges({
        voucherId,
        pageNumber: 1,
        pageSize: 10,
        orderBy: "desc",
      });

      setItems(res.data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading exchange history...</p>;

  return (
    <div className="mt-8">

      <h2 className="text-xl font-semibold mb-4">
        Exchange History
      </h2>

      <table className="w-full border border-gray-300">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Item Code</th>
            <th className="p-2 border">Member</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Points</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Acquired</th>
            <th className="p-2 border">Used</th>
          </tr>
        </thead>

        <tbody>

          {items.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No exchange history
              </td>
            </tr>
          )}

          {items.map((item) => (
            <tr key={item.voucherItemId}>

              <td className="border p-2 font-mono">
                {item.itemCode}
              </td>

              <td className="border p-2">
                {item.memberName}
              </td>

              <td className="border p-2">
                {item.memberPhone}
              </td>

              <td className="border p-2">
                {item.totalPointsUsed}
              </td>

              <td className="border p-2">
                {item.status}
              </td>

              <td className="border p-2">
                {new Date(item.acquiredAt).toLocaleString()}
              </td>

              <td className="border p-2">
                {item.usedAt
                  ? new Date(item.usedAt).toLocaleString()
                  : "-"}
              </td>

            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
}