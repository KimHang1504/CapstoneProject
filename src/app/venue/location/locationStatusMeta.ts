import { LocationDisplayStatus } from "@/app/venue/location/status";

export const locationStatusMeta: Record<
  LocationDisplayStatus,
  {
    label: string;
    color: string;
  }
> = {
  ACTIVE: {
    label: "Đang mở",
    color: "bg-green-100 text-green-700",
  },
  INACTIVE: {
    label: "Tạm ngưng",
    color: "bg-red-100 text-red-700",
  },
  PENDING: {
    label: "Chờ duyệt",
    color: "bg-yellow-100 text-yellow-700",
  },
  DRAFTED: {
    label: "Bản nháp",
    color: "bg-gray-100 text-gray-600",
  },

  REJECTED: {
    label: "Bị từ chối",
    color: "bg-red-100 text-red-700",
  },
  CLOSED: {
    label: "Đóng cửa",
    color: "bg-red-100 text-red-700",
  },
  EXPIRED: {
    label: "Hết hạn",
    color: "bg-red-100 text-red-700",
  },
};