import { getSettlementList } from "@/api/venue/settlement/api";
import { SettlementItem } from "@/api/venue/settlement/type";
import SettlementFilter from "@/app/venue/voucher/settlement/components/SettlementFilter";
import Link from "next/link";

type Props = {
    searchParams: {
        page?: string;
        size?: string;
        status?: "PENDING" | "PAID" | "CANCELLED";
        fromDate?: string;
        toDate?: string;
        sortBy?: "createdAt" | "updatedAt";
        orderBy?: "asc" | "desc";
    };
};

const formatCurrency = (value: number) =>
    `${new Intl.NumberFormat("vi-VN").format(value)} đ`;

const formatDateTime = (value: string | null) => {
    if (!value) return "--";

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
};

const getStatusMeta = (status: SettlementItem["status"]) => {
    switch (status) {
        case "PENDING":
            return {
                label: "Chờ đối soát",
                className: "border border-violet-200 bg-violet-50 text-violet-700",
            };
        case "PAID":
            return {
                label: "Đã thanh toán",
                className: "border border-pink-200 bg-pink-50 text-pink-700",
            };
        case "CANCELLED":
            return {
                label: "Đã huỷ",
                className: "border border-rose-200 bg-rose-50 text-rose-700",
            };
        default:
            return {
                label: status,
                className: "border border-slate-200 bg-slate-50 text-slate-700",
            };
    }
};

export default async function SettlementListSection({ searchParams }: Props) {
    const page = Number(searchParams.page || 1);
    const size = Number(searchParams.size || 10);
    const status = searchParams.status;
    const fromDate = searchParams.fromDate;
    const toDate = searchParams.toDate;
    const sortBy = searchParams.sortBy || "createdAt";
    const orderBy = searchParams.orderBy || "desc";

    const data = await getSettlementList({
        PageNumber: page,
        PageSize: size,
        Status: status,
        FromDate: fromDate,
        ToDate: toDate,
        SortBy: sortBy,
        OrderBy: orderBy,
    });

    const startItem = data.totalCount === 0 ? 0 : (data.pageNumber - 1) * data.pageSize + 1;
    const endItem = Math.min(data.pageNumber * data.pageSize, data.totalCount);

    const createPageHref = (nextPage: number) => {
        const params = new URLSearchParams();

        params.set("page", String(nextPage));
        params.set("size", String(size));
        params.set("sortBy", sortBy);
        params.set("orderBy", orderBy);

        if (status) params.set("status", status);
        if (fromDate) params.set("fromDate", fromDate);
        if (toDate) params.set("toDate", toDate);

        return `?${params.toString()}`;
    };
    console.log("items:", data.items.length);
    return (
        <div className="space-y-5">
            <SettlementFilter
                defaultValues={{
                    page,
                    size,
                    status: status || "",
                    fromDate: fromDate || "",
                    toDate: toDate || "",
                    sortBy,
                    orderBy,
                }}
            />

            {data.items.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-violet-200 bg-linear-to-br from-violet-50 to-pink-50 p-10 text-center">
                    <h3 className="text-lg font-semibold text-slate-800">
                        Không có dữ liệu đối soát
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Hãy thử thay đổi bộ lọc hoặc khoảng thời gian tìm kiếm.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-[0_10px_40px_rgba(168,85,247,0.08)]">
                    <div className="overflow-x-auto">
                        <table className="min-w-275 w-full">
                            <thead className="bg-linear-to-r from-violet-50 to-pink-50">
                                <tr className="text-left text-sm text-slate-600">
                                    <th className="px-5 py-4 font-semibold">Mã</th>
                                    <th className="px-5 py-4 font-semibold">Tên</th>
                                    <th className="px-5 py-4 font-semibold">Tổng tiền</th>
                                    <th className="px-5 py-4 font-semibold">Hoa hồng</th>
                                    <th className="px-5 py-4 font-semibold">Thực nhận</th>
                                    <th className="px-5 py-4 font-semibold">Trạng thái</th>
                                    <th className="px-5 py-4 font-semibold">Đã dùng lúc</th>
                                    <th className="px-5 py-4 font-semibold">Có thể đối soát</th>
                                    <th className="px-5 py-4 font-semibold">Đã thanh toán</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.items.map((item, index) => {
                                    const statusMeta = getStatusMeta(item.status);

                                    return (
                                        <tr
                                            key={item.settlementId}
                                            className={`border-t border-slate-100 text-sm transition hover:bg-violet-50/40 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                                                }`}
                                        >
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-violet-700">
                                                    {item.voucherItemCode}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    ID: #{item.settlementId}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <Link
                                                    href={`/venue/voucher/settlement/${item.settlementId}`}
                                                    className="font-medium text-slate-800 transition-all duration-200 hover:text-violet-600 hover:underline underline-offset-4"
                                                >
                                                    {item.voucherTitle}
                                                </Link>
                                            </td>

                                            <td className="px-5 py-4 font-medium text-slate-700">
                                                {formatCurrency(item.grossAmount)}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-rose-600">
                                                {formatCurrency(item.commissionAmount)}
                                            </td>

                                            <td className="px-5 py-4 font-semibold text-violet-700">
                                                {formatCurrency(item.netAmount)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}
                                                >
                                                    {statusMeta.label}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                {formatDateTime(item.usedAt)}
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                {formatDateTime(item.availableAt)}
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                {formatDateTime(item.paidAt)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 rounded-3xl border border-violet-100 bg-white p-4 shadow-[0_10px_30px_rgba(168,85,247,0.06)] md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-500">
                    Hiển thị <span className="font-semibold text-slate-800">{startItem}</span> -{" "}
                    <span className="font-semibold text-slate-800">{endItem}</span> trên tổng{" "}
                    <span className="font-semibold text-slate-800">{data.totalCount}</span> bản ghi
                </div>

                <div className="flex items-center gap-2">
                    <a
                        href={data.hasPreviousPage ? createPageHref(data.pageNumber - 1) : undefined}
                        className={`inline-flex h-10 items-center rounded-2xl border px-4 text-sm font-medium ${data.hasPreviousPage
                            ? "border-violet-200 bg-white text-slate-700 hover:bg-violet-50"
                            : "pointer-events-none border-slate-200 bg-slate-50 text-slate-400"
                            }`}
                    >
                        Trước
                    </a>

                    <div className="rounded-2xl bg-linear-to-r from-violet-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white">
                        Trang {data.pageNumber} / {data.totalPages || 1}
                    </div>

                    <a
                        href={data.hasNextPage ? createPageHref(data.pageNumber + 1) : undefined}
                        className={`inline-flex h-10 items-center rounded-2xl border px-4 text-sm font-medium ${data.hasNextPage
                            ? "border-violet-200 bg-white text-slate-700 hover:bg-violet-50"
                            : "pointer-events-none border-slate-200 bg-slate-50 text-slate-400"
                            }`}
                    >
                        Sau
                    </a>
                </div>
            </div>
        </div>
    );
}