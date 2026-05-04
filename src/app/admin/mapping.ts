export const MAPPING = {
    venueStatus: {
        ACTIVE: "Đang hoạt động",
        PENDING: "Đang chờ duyệt",
        INACTIVE: "Đã bị hủy",
    },

    adPlacementType: {
        HOME_BANNER: "Banner đầu trang",
        POPUP: "Popup",
    },
    adsOrderStatus: {
        PENDING: "Đang chờ",
        COMPLETED: "Thành công",
        PAYMENT_FAILED: "Thất bại",
        CANCELLED: "Đã huỷ",
        REFUNDED: "Đã hoàn tiền",
    },

    adPackageName: {
        "Home banner basic": "Banner trang chủ – Cơ bản",
        "Home banner premium": "Banner trang chủ – Cao cấp",
        "Home banner vip": "Banner trang chủ – VIP",

        "Popup Basic": "Popup – Cơ bản",
        "Popup Standard": "Popup – Tiêu chuẩn",
        "Popup Premium": "Popup – Cao cấp",
    },
} as const;

export const getMappingLabel = (
    group: keyof typeof MAPPING,
    key?: string
) => {
    if (!key) return "Không xác định";
    return MAPPING[group]?.[key as never] ?? key;
};

export const STATUS_STYLE = {
    adsOrderStatus: {
        PENDING: "bg-amber-100 text-amber-700",
        COMPLETED: "bg-green-100 text-green-700",
        PAYMENT_FAILED: "bg-red-100 text-red-700",
        CANCELLED: "bg-gray-100 text-gray-700",
        REFUNDED: "bg-purple-100 text-purple-700",
    },
} as const;

export const getStatusStyle = (
    group: keyof typeof STATUS_STYLE,
    key?: string
) => {
    if (!key) return "bg-gray-100 text-gray-700";
    return STATUS_STYLE[group]?.[key as never] ?? "bg-gray-100 text-gray-700";
};

