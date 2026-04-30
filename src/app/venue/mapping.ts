export const MAPPING = {
    paymentMethod: {
        REFUND: "Hoàn tiền",
        WALLET: "Ví",
        VIETQR: "VietQR",
    },
} as const;

export const getMappingLabel = <
    G extends keyof typeof MAPPING
>(
    group: G,
    key?: keyof typeof MAPPING[G] | string
) => {
    if (!key) return "Không xác định";

    const groupMap = MAPPING[group] as Record<string, string>;

    return groupMap[key as string] ?? key;
};