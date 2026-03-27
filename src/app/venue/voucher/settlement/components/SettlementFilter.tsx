"use client";

import { Funnel, RotateCcw, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  defaultValues: {
    page: number;
    size: number;
    status: string;
    fromDate: string;
    toDate: string;
    sortBy: "createdAt" | "updatedAt";
    orderBy: "asc" | "desc";
  };
};

export default function SettlementFilter({ defaultValues }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(defaultValues.status);
  const [fromDate, setFromDate] = useState(defaultValues.fromDate);
  const [toDate, setToDate] = useState(defaultValues.toDate);
  const [sortBy, setSortBy] = useState(defaultValues.sortBy);
  const [orderBy, setOrderBy] = useState(defaultValues.orderBy);
  const [size, setSize] = useState(String(defaultValues.size));

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");
    params.set("size", size);
    params.set("sortBy", sortBy);
    params.set("orderBy", orderBy);

    status ? params.set("status", status) : params.delete("status");
    fromDate ? params.set("fromDate", fromDate) : params.delete("fromDate");
    toDate ? params.set("toDate", toDate) : params.delete("toDate");

    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilter = () => {
    router.push(pathname);
  };

  return (
    <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-5 shadow-[0_10px_40px_rgba(168,85,247,0.08)]">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-xl bg-violet-100 p-2 text-violet-600">
          <Funnel className="h-4 w-4" />
        </div>
        <h2 className="font-semibold text-slate-800">Bộ lọc đối soát</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-2xl border border-violet-100 bg-white px-4 text-sm outline-none transition focus:border-violet-300"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ đối soát</option>
          <option value="PAID">Đã thanh toán</option>
          <option value="CANCELLED">Đã huỷ</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="h-11 rounded-2xl border border-violet-100 bg-white px-4 text-sm outline-none transition focus:border-violet-300"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="h-11 rounded-2xl border border-violet-100 bg-white px-4 text-sm outline-none transition focus:border-violet-300"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "createdAt" | "updatedAt")}
          className="h-11 rounded-2xl border border-violet-100 bg-white px-4 text-sm outline-none transition focus:border-violet-300"
        >
          <option value="createdAt">createdAt</option>
          <option value="updatedAt">updatedAt</option>
        </select>

        <select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value as "asc" | "desc")}
          className="h-11 rounded-2xl border border-violet-100 bg-white px-4 text-sm outline-none transition focus:border-violet-300"
        >
          <option value="desc">Mới nhất</option>
          <option value="asc">Cũ nhất</option>
        </select>

        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="h-11 rounded-2xl border border-violet-100 bg-white px-4 text-sm outline-none transition focus:border-violet-300"
        >
          <option value="10">10 / trang</option>
          <option value="20">20 / trang</option>
          <option value="50">50 / trang</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={applyFilter}
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 px-5 font-medium text-white shadow-lg shadow-pink-200 transition hover:opacity-95"
        >
          <Search className="h-4 w-4" />
          Áp dụng
        </button>

        <button
          type="button"
          onClick={resetFilter}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-violet-200 bg-white px-5 font-medium text-slate-700 transition hover:bg-violet-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}