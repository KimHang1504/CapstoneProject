import { AdStatus } from "@/api/admin/type";

export function StatusBadge({ status }: { status: AdStatus }) {
    const map = {
        PENDING: "bg-yellow-100 text-yellow-700",
        COMPLETED: "bg-green-100 text-green-700",
        REFUNDED: "bg-red-100 text-red-700",
        APPROVED: "bg-blue-100 text-blue-700",
        DRAFT: "bg-gray-100 text-gray-700",
        ACTIVE: "bg-green-100 text-green-700",
        INACTIVE: "bg-red-100 text-red-700",
        REJECTED: "bg-red-100 text-red-700",
    };

    const label = {
        PENDING: "Đang chờ",
        COMPLETED: "Hoàn tất",
        REFUNDED: "Đã hoàn tiền",
        APPROVED: "Đã duyệt",
        DRAFT: "Bản nháp",
        ACTIVE: "Đang hoạt động",
        INACTIVE: "Đã dừng",
        REJECTED: "Đã từ chối",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm ${map[status]}`}>
            {label[status]}
        </span>
    );
}