"use client";

import { useEffect, useState } from "react";
import { getVoucherExchanges } from "@/api/venue/vouchers/api";
import { VoucherExchangeItem } from "@/api/venue/vouchers/type";

type Props = {
  voucherId: number;
};

// =====================
// STATUS MAPPING (VI)
// =====================
const voucherExchangeStatusText: Record<string, string> = {
  PENDING: "Chờ xử lý",
  CLAIMED: "Đã nhận",
  USED: "Đã sử dụng",
  EXPIRED: "Hết hạn",
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

  const formatVietnamPhone = (phone: string) => {
    if (!phone) return "-";

    // bỏ hết ký tự không phải số
    const digits = phone.replace(/\D/g, "");

    // format theo nhóm 3-4-3 (VN mobile phổ biến 10 số)
    if (digits.length === 10) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    }

    return phone;
  };

  const getUsedAtText = (item: VoucherExchangeItem) => {
    if (item.usedAt) {
      return new Date(item.usedAt).toLocaleString("vi-VN");
    }

    switch (item.status) {
      case "ACQUIRED":
        return "Chưa sử dụng";
      case "EXPIRED":
        return "Không sử dụng";
      default:
        return "—";
    }
  };

  if (loading) return <p className="p-6">Đang tải lịch sử đổi voucher...</p>;

  if (items.length === 0) {
    return (
      <div className="p-6">
        <div className="p-6 text-center text-gray-500">
          Chưa có ai đổi voucher này.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">

      <h2 className="text-xl font-semibold mb-4">
        Lịch sử đổi voucher
      </h2>

      <table className="w-full border border-gray-300 text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-left">Mã item</th>
            <th className="p-2 border text-left">Thành viên</th>
            <th className="p-2 border text-left">Số điện thoại</th>
            <th className="p-2 border text-left">Điểm đã dùng</th>
            <th className="p-2 border text-left">Trạng thái</th>
            <th className="p-2 border text-left">Thời gian nhận</th>
            <th className="p-2 border text-left">Thời gian sử dụng</th>
          </tr>
        </thead>

        <tbody>

          {items.map((item) => (
            <tr key={item.voucherItemId} className="hover:bg-gray-50">

              {/* ITEM CODE */}
              <td className="border p-2 font-mono">
                {item.itemCode}
              </td>

              {/* MEMBER NAME */}
              <td className="border p-2">
                {item.memberName}
              </td>

              {/* PHONE */}
              <td className="border p-2">
                {formatVietnamPhone(item.memberPhone)}
              </td>

              {/* POINTS */}
              <td className="border p-2">
                {item.totalPointsUsed}
              </td>

              {/* STATUS (VIETNAMESE MAPPING) */}
              <td className="border p-2">
                {voucherExchangeStatusText[item.status] ?? item.status}
              </td>

              {/* ACQUIRED AT */}
              <td className="border p-2">
                {item.acquiredAt
                  ? new Date(item.acquiredAt).toLocaleString("vi-VN")
                  : "-"}
              </td>

              {/* USED AT */}
              <td className="border p-2">
                {getUsedAtText(item)}
              </td>

            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
}