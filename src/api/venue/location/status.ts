export const VENUE_STATUS_CONFIG = {
  ACTIVE: {
    label: 'Đang mở',
    className: 'bg-green-100 text-green-700',
  },
  INACTIVE: {
    label: 'Đang đóng',
    className: 'bg-red-100 text-red-700',
  },
  PENDING: {
    label: 'Chờ duyệt',
    className: 'bg-yellow-100 text-yellow-700',
  },
  DRAFTED: {
    label: 'Bản nháp',
    className: 'bg-gray-100 text-gray-600',
  },
} as const;
