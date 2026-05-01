export const MAPPING = {
    paymentMethod: {
        REFUND: "Hoàn tiền",
        WALLET: "Ví",
        VIETQR: "VietQR",
    },
        adsOrderStatus: {
        COMPLETED: "Thành công",
        PAYMENT_FAILED: "Thất bại",
        CANCELLED: "Đã huỷ",
        REFUNDED: "Đã hoàn tiền",
    },

} as const;

export const getMappingLabel = (
    group: keyof typeof MAPPING,
    key?: string
) => {
    if (!key) return "Không xác định";

    const groupMap = MAPPING[group] as Record<string, string>;

    return groupMap[key] ?? key;
};

export const STATUS_STYLE = {
    adsOrderStatus: {
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
