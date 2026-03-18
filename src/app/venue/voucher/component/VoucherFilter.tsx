"use client";

import { VoucherFilterType, VoucherStatus } from "@/api/venue/vouchers/type";
import { Dispatch, SetStateAction } from "react";

type Props = {
  filters: VoucherFilterType;
  setFilters: Dispatch<SetStateAction<VoucherFilterType>>;
  onFilter: () => void;
};

export default function VoucherFilter({
  filters,
  setFilters,
  onFilter,
}: Props) {
  return (
    <div className="flex gap-4 mb-4">

      <input
        type="text"
        placeholder="Search voucher"
        value={filters.keyword}
        onChange={(e) =>
          setFilters({ ...filters, keyword: e.target.value })
        }
        className="border px-3 py-2 rounded"
      />

      <select
        value={filters.status}
        onChange={(e) =>
          setFilters({
            ...filters,
            status: e.target.value as "" | VoucherStatus,
          })
        }
        className="border px-3 py-2 rounded"
      >
        <option value="">All status</option>
        <option value="DRAFTED">Drafted</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="ACTIVE">Active</option>
        <option value="ENDED">Ended</option>
      </select>

      <button
        onClick={onFilter}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Filter
      </button>

    </div>
  );
}