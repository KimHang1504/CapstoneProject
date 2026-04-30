export const MAPPING = {
    paymentMethod: {
        REFUND: "Hoàn tiền",
        WALLET: "Ví",
        VIETQR: "VietQR",
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