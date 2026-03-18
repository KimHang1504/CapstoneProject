"use client";

import { Voucher } from "@/api/venue/vouchers/type";
import Link from "next/link";

type Props = {
  vouchers: Voucher[];
  loading: boolean;
};

export default function ListVoucher({ vouchers, loading }: Props) {

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!vouchers.length) {
    return <p>Không có voucher</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-6">

      {vouchers.map((v) => (

        <div
          key={v.id}
          className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white"
        >


          {/* CONTENT */}
          <div className="p-4 space-y-2">

            <h3 className="font-semibold text-sm line-clamp-2">
              {v.title}
            </h3>

            <p className="text-xs text-gray-500">
              Code: {v.code}
            </p>

            <p className="text-sm font-medium text-orange-600">
              {v.discountType === "FIXED_AMOUNT"
                ? `${v.discountAmount?.toLocaleString()} VND`
                : `${v.discountPercent}%`}
            </p>

            <p className="text-xs text-gray-500">
              Còn lại: {v.remainingQuantity}/{v.quantity}
            </p>

            <p className="text-xs text-gray-500">
              Bắt đầu: {new Date(v.startDate).toLocaleDateString()}
            </p>

          </div>

          {/* ACTION */}
          <Link
            href={`/venue/voucher/${v.id}`}
            className="block text-center bg-green-200 py-2 text-sm font-medium hover:bg-green-300"
          >
            Quản lý
          </Link>


        </div>

      ))}

    </div>
  );
}