// Placement type (FE tự khóa trước dù BE chưa enum)
export type PlacementType =
  | "HOME_BANNER"
  | "DETAIL_BANNER"
  | "POPUP";

export type AdvertisementStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PENDING"
  | "INACTIVE";

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
  createdAt: string;
  updatedAt: string;
  venueLocationAds: any[];
  adsOrders: any[];
}

export interface AdvertisementListItem {
  id: number;
  title: string;
  bannerUrl: string;
  placementType: string; // tạm để string vì BE đang trả linh tinh
  status: "DRAFT" | "ACTIVE" | "REJECTED" | "EXPIRED";
  rejectionReason: string | null;
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