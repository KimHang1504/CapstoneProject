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
} as const;

export const getMappingLabel = (
    group: keyof typeof MAPPING,
    key?: string
) => {
    if (!key) return "Không xác định";
    return MAPPING[group]?.[key as never] ?? key;
};