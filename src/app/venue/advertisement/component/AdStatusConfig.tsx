import { FEAdStatus } from "@/app/venue/advertisement/component/AdStatus";
import { CheckCircle2, Clock, XCircle, FileEdit } from "lucide-react";


export const STATUS_CONFIG: Record<FEAdStatus, any> = {
  DRAFT: {
    label: "Bản nháp",
    icon: FileEdit,
    className: "bg-gray-100 text-gray-600 border-gray-200"
  },
  PENDING: {
    label: "Chờ duyệt",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200"
  },
  APPROVED: {
    label: "Đã duyệt",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  REJECTED: {
    label: "Từ chối",
    icon: XCircle,
    className: "bg-rose-50 text-rose-600 border-rose-200"
  },
  RUNNING: {
    label: "Đang chạy",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  EXPIRED: {
    label: "Đã kết thúc",
    icon: XCircle,
    className: "bg-gray-100 text-gray-500 border-gray-200"
  }
};