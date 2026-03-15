"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyVouchers } from "@/api/venue/vouchers/api";
import { Voucher, VoucherFilterType } from "@/api/venue/vouchers/type";
import VoucherFilter from "@/app/venue/voucher/component/VoucherFilter";
import ListVoucher from "@/app/venue/voucher/component/ListVoucher";

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VoucherFilterType>({
    keyword: "",
    status: "",
  });

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const res = await getMyVouchers({
        pageNumber: 1,
        pageSize: 10,
        keyword: filters.keyword || undefined,
        status: filters.status || undefined,
      });

      setVouchers(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-semibold">
          Quản lý Voucher
        </h1>

        <Link
          href="/venue/voucher/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tạo Voucher
        </Link>

      </div>
      <VoucherFilter
        filters={filters}
        setFilters={setFilters}
        onFilter={fetchVouchers}
      />
      <ListVoucher
        vouchers={vouchers}
        loading={loading}
      />

    </div>
  );
}