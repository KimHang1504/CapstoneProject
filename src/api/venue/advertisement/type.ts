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
    | "CANCELLED";

export interface AdsOrder {
    id: number;
    packageName: string;
    pricePaid: number;
    status: AdsOrderStatus;
    createdAt: string;
}

// Type gửi lên khi create
export interface CreateAdvertisementRequest {
    title: string;
    content: string;
    bannerUrl: string;
    targetUrl: string;
    placementType: PlacementType;
}

// Type nhận về từ BE
export interface Advertisement {
    id: number;
    venueOwnerId: number;
    title: string;
    content: string;
    bannerUrl: string;
    targetUrl: string;
    placementType: PlacementType;
    status: AdvertisementStatus;
    rejectionReason: string | null;
    desiredStartDate: string | null;
    createdAt: string;
    updatedAt: string;
    venueLocationAds: VenueLocationAd[];
    adsOrders: AdsOrder[];
}

export interface AdvertisementListItem {
    id: number;
    title: string;
    bannerUrl: string;
    placementType: PlacementType;
    status: AdvertisementStatus;
    rejectionReason: string | null;
    desiredStartDate: string | null;
    createdAt: string;
    updatedAt: string;
    venueLocationCount: number;
    activeVenueAd: any | null;
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

// Type gửi lên khi submit payment
export interface SubmitAdvertisementPaymentRequest {
    packageId: number;
    venueId: number;
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

