// Placement type (FE tự khóa trước dù BE chưa enum)
export type PlacementType =
    | "HOME_BANNER"
    | "POPUP"

export const PLACEMENT_LABEL: Record<PlacementType, string> = {
    HOME_BANNER: "Banner đầu trang",
    POPUP: "Popup"
};

export type AdvertisementStatus =
    | "DRAFT"
    | "PENDING"
    | "ACTIVE"
    | "INACTIVE"
    | "APPROVED"
    | "REJECTED";

export interface VenueLocationAd {
    id: number;
    venueId: number;
    venueName: string;
    priorityScore: number;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DRAFTED';
}

export type AdsOrderStatus =
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED";

export interface AdsOrder {
    id: number;
    packageName: string;
    pricePaid: number;
    status: AdsOrderStatus;
    createdAt: string;

    hasRefund: boolean;
    refundInfo: any | null;
}

// Type gửi lên khi create
export interface CreateAdvertisementRequest {
    title: string;
    content: string;
    bannerUrl: string;
    targetUrl: string;
    placementType?: PlacementType;
}

// Type nhận về từ BE
export interface Advertisement {
    id: number;
    venueOwnerId: number;
    title: string;
    content: string;
    bannerUrl: string;
    targetUrl: string;
    placementType: PlacementType | null;
    moodTypeId: number;
    status: AdvertisementStatus;
    rejectionHistory: RejectionHistory[];
    desiredStartDate: string | null;
    createdAt: string;
    updatedAt: string;
    venueLocationAds: VenueLocationAd[];
    adsOrders: AdsOrder[];
    isDeleted: boolean;
}

export interface AdvertisementListItem {
    id: number;
    title: string;
    bannerUrl: string;
    placementType: PlacementType | null;
    status: AdvertisementStatus;
    rejectionReason: string | null;
    desiredStartDate: string | null;
    createdAt: string;
    updatedAt: string;
    venueLocationCount: number;
    activeVenueAd: any | null;
    isDeleted: boolean;
}

//package quảng cáo
export interface AdvertisementPackage {
    id: number;
    name: string;
    description: string;
    price: number;
    durationDays: number;
    priorityScore: number;
    placement: string;
    isActive: boolean;
    createdAt: string;
}

export type AdvertisementPackageGroup = Record<
    PlacementType,
    AdvertisementPackage[]
>;

export interface AdvertisementPackagesResponse {
    data: AdvertisementPackageGroup;
}

// Type gửi lên khi submit payment
export interface SubmitAdvertisementPaymentRequest {
    packageId: number;
    venueIds: number[];
    quantity?: number;
    paymentMethod?: 'VIETQR' | 'WALLET';
}

export interface SubmitAdvertisementPaymentResponse {
    isSuccess: boolean;
    message: string;
    transactionId: number;
    adsOrderId: number;
    qrCodeUrl: string;
    amount: number;
    paymentContent: string;
    packageName: string;
    durationDays: number;
    expireAt: string;
    bankInfo: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
}

export interface UpdateAdvertisementRequest {
    title: string;
    content: string;
    bannerUrl: string;
    targetUrl: string;
    placementType: PlacementType;
    desiredStartDate: string;
}

export interface RejectionHistory {
    rejectedAt: string;
    reason: string;
    rejectedBy: string;
}

export type AdsOrderStatusFilter =
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED";

export interface AdsOrderTransaction {
    id: number;
    status: AdsOrderStatusFilter;
    createdAt: string;
    updatedAt: string;
    payment: {
        transactionId: number;
        amount: number;
        paymentStatus: string;
        paymentMethod: string;
        paidAt: string;
        transactionCode: string | null;
    };
    package: {
        id: number;
        name: string;
        price: number;
        durationDays: number;
        placementType: string;
    };
    advertisement: {
        id: number;
        title: string;
        content: string;
        bannerUrl: string;
        targetUrl: string;
        placementType: string;
        status: string;
        desiredStartDate: string | null;
    };
    venueLocationAds: VenueLocationAd[];
}