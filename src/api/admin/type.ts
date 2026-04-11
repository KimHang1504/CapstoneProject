//Dashboard
export interface ChartItem {
  label: string;
  value: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalVenueOwnerProfiles: number;
  totalVenueLocations: number;
  totalMemberProfiles: number;
  activeCouples: number;
  totalTransactions: number;
  totalRevenue: number;
  totalReports: number;
  totalPosts: number;
  totalAdsOrders: number;
  activeAdsOrders: number;
  totalMemberSubscriptions: number;
  activeMemberSubscriptions: number;
  totalVenueSubscriptions: number;
  activeVenueSubscriptions: number;

  userGrowthChart: ChartItem[];
  revenueChart: ChartItem[];
  transactionChart: ChartItem[];
  venueGrowthChart: ChartItem[];
  postActivityChart: ChartItem[];
}

export interface DashboardRequest {
  Year: number;
  Month?: number;
}

//Venue management
export interface Venue {
  id: number;

  name: string;
  description?: string;

  address?: string;
  email?: string;
  phoneNumber?: string;
  websiteUrl?: string;

  priceMin?: number;
  priceMax?: number;

  latitude?: number;
  longitude?: number;
  area?: string | null;

  averageRating?: number;
  avarageCost?: number;
  reviewCount?: number;

  status: 'DRAFTED' | 'PENDING' | 'ACTIVE' | 'REJECTED' | 'INACTIVE';

  coverImage?: string[];
  interiorImage?: string[];
  fullPageMenuImage?: string[];

  category?: string | null;

  isOwnerVerified?: boolean;
  businessLicenseUrl?: string | null;

  createdAt?: string;
  updatedAt?: string;

  locationTags?: LocationTag[];
}

export interface LocationTag {
  id: number;
  tagName: string;

  detailTag: string[];

  coupleMoodType: CoupleMoodType;
  couplePersonalityType: CouplePersonalityType;
}

export interface CoupleMoodType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CouplePersonalityType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface VenuePagination {
  items: Venue[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface VenueDetail {
  id: number;
  name: string;
  websiteUrl: string | null;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | string;
  businessLicenseUrl: string;
  venueOwner: VenueOwner;
}

// LocationDetail 

export interface LocationDetail {
  id: number;
  name: string;
  description: string | null;
  address: string;

  email: string | null;
  phoneNumber: string | null;
  websiteUrl: string | null;

  priceMin: number | null;
  priceMax: number | null;

  latitude: number | null;
  longitude: number | null;

  averageRating: number;
  avarageCost: number | null;
  reviewCount: number;

  favoriteCount: number | null;

  status: string;
  category: string | null;

  coverImage: string[];
  interiorImage: string[];
  fullPageMenuImage: string[];

  isOwnerVerified: boolean;

  businessLicenseUrl: string | null;

  createdAt: string;
  updatedAt: string;

  coupleMoodTypes: CoupleMoodType[];
  couplePersonalityTypes: CouplePersonalityType[];

  venueOwner: VenueOwner | null;

  todayDayName: string | null;
  todayOpeningHour: OpeningHour | null;

  openingHours: OpeningHour[] | null;

  userState: string | null;
}

export interface CoupleMoodType {
  id: number;
  name: string;
}

export interface CouplePersonalityType {
  id: number;
  name: string;
}

export interface VenueOwner {
  id: number;
  businessName: string;
  phoneNumber: string;
  email: string;
  address: string;
  citizenIdFrontUrl: string;
  citizenIdBackUrl: string;
  businessLicenseUrl: string | null;
}

export interface OpeningHour {
  dayName: string;
  openTime: string;
  closeTime: string;
}

// Accept or reject venue application
export interface VenueApprovalRequest {
  venueId: number;
  status: 'ACTIVE' | 'DRAFTED';
  reason: string | null;
}

//Special event management
export type SpecialEvent = {
  id: number;
  eventName: string;
  description: string;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  isYearly: boolean;
};

export interface SpecialEventPagination {
  items: SpecialEvent[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateSpecialEventRequest {
  eventName: string,
  description: string,
  bannerUrl: string,
  startDate: string,
  endDate: string,
  isYearly: boolean
};


//Challenge management
export type Challenge = {
  id: number,
  title: string,
  description: string,
  triggerEvent: "POST" | "REVIEW" | "CHECKIN",
  goalMetric: "COUNT" | "UNIQUE_LIST" | "STREAK",
  targetGoal: number,
  rewardPoints: number,
  startDate: string,
  endDate: string,
  status: string,
  createdAt: string,
  ruleData: {
    hash_tags: string[] | null,
    has_image: boolean | null
    venue_id: number[] | null
  },
  instructions: string[]
};

export interface ChallengePagination {
  items: Challenge[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ChallengeRequest {
  title: string,
  description: string,
  triggerEvent: string,
  goalMetric: string,
  targetGoal: number,
  rewardPoints: number,
  startDate: string | null,
  endDate: string | null,
  ruleData: {
    hash_tags: string[] | null,
    has_image: boolean | null
    venue_id: number[] | null
  }
};
//Definitions
export interface TaskType {
  code: string;
  label: string;
}

export interface Metric {
  code: string;
  label: string;
}

export interface RuleField {
  key: string;
  label: string;
  type: "STRING" | "NUMBER" | "BOOLEAN";
}

export type ChallengeRules = {
  [taskType: string]: RuleField[];
};

export interface ChallengeConfigResponse {
  taskTypes: TaskType[];
  metrics: Metric[];
  rules: ChallengeRules;
}

//Location select for challenge
export interface LocationRequest {
  query: string;
  page: number;
  pageSize: number;
}

export interface Location {
  id: number;
  name: string;
  description: string | null;
  address: string;
  coverImage: string[];
  coupleMoodTypeNames: string[];
  couplePersonalityTypeNames: string[];
  venueOwnerName: string,
  venueOwnerId: number,
  isOpenNow: boolean,
}

export interface LocationPagination {
  items: Location[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Recommendations {
  recommendations: LocationPagination;
}

//Advertisement
export interface Advertisement {
  id: number;
  title: string;
  bannerUrl: string;
  placementType: string;
  status: string;
  rejectionHistory: AdvertisementRejectionHistory[];
  desiredStartDate: string;
  venueLocationCount: number;
}

export interface AdvertisementRejectionHistory {
  rejectedBy: string;
  reason: string;
  rejectedAt: string;
}

export interface AdvertisementAcceptRequest {
  advertisementId: number;
}

export interface AdvertisementRejectRequest {
  advertisementId: number;
  reason: string;
}

//Voucher
export interface VoucherSearchRequest {
  PageNumber: number;
  PageSize: number;
  Status?: string;
  Keyword?: string;
  VenueOwnerId?: number;
  SortBy: 'createdAt' | 'updatedAt';
  SortDirection: 'asc' | 'desc';
}

export interface VoucherLocation {
  venueLocationId: number;
  venueLocationName: string;
}

export type DiscountType = "PERCENTAGE" | "AMOUNT";

export type VoucherStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "DISABLED"
  | "ENDED";

export interface Voucher {
  id: number;
  venueOwnerId: number;
  venueOwnerName: string;
  code: string;
  title: string;
  description: string;

  voucherPrice: number;

  discountType: DiscountType;
  discountAmount: number | null;
  discountPercent: number | null;

  quantity: number;
  remainingQuantity: number;

  usageLimitPerMember: number;
  usageValiDays: number | null;

  rejectReason: string | null;

  startDate: string;
  endDate: string;

  status: VoucherStatus;

  createdAt: string;
  updatedAt: string;

  locations: VoucherLocation[];
}


export interface VoucherPagination {
  items: Voucher[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface VoucherRejectRequest {
  voucherId: number;
  rejectReason: string;
}

//Report
export interface Report {
  id: number;
  reporterId: number;
  reporterName: string;
  targetType: 'POST' | 'REVIEW' | 'USER' | 'VENUE' | 'COMMENT';
  targetId: number;
  evidenceSnapshot: EvidenceSnapshot;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export type EvidenceSnapshot =
  | {
    targetType: "POST";
    targetId: number;
    capturedAt: string;
    data: PostData;
  }
  | {
    targetType: "REVIEW";
    targetId: number;
    capturedAt: string;
    data: ReviewData;
  }
  | {
    targetType: "VENUE";
    targetId: number;
    capturedAt: string;
    data: VenueData;
  }
  | {
    targetType: "COMMENT";
    targetId: number;
    capturedAt: string;
    data: CommentData;
  }
  | {
    targetType: "USER";
    targetId: number;
    capturedAt: string;
    data: UserData;
  };


export interface PostData {
  Id: number;
  Status: "PUBLISHED" | "DRAFT" | string;
  Content: string;
  AuthorId: number;
  HashTags: string[];
  CreatedAt: string;
  UpdatedAt: string;
  MediaPayload: MediaItem[];
}

export interface ReviewData {
  Id: number;
  Rating: number;
  Status: string;
  Content: string;
  VenueId: number;
  MemberId: number;
  CreatedAt: string;
  UpdatedAt: string;
  ImageUrls: string[] | null;
  VisitedAt: string | null;
}

export interface VenueData {
  Id: number;
  Name: string;
  Email: string;
  Status: string;
  Address: string;
  Category: string;
  CreatedAt: string;
  UpdatedAt: string;
  CoverImage: string;
  Description: string;
  PhoneNumber: string;
  VenueOwnerId: number;
}

export interface CommentData {
  Id: number;
  PostId: number;
  AuthorId: number;
  TargetMemberId: number;
  Content: string;
  ParentId: number | null;
  RootId: number | null;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface UserData {
  Id: number;
  UserId: number;
  FullName: string;
  Gender: "MALE" | "FEMALE" | string;
  Bio: string | null;
  RelationshipStatus: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface MediaItem {
  Url: string;
  Type: "IMAGE" | "VIDEO" | string;
}


export interface ReportPagination {
  reports: Report[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ReportType {
  id: number;
  typeName: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTypePagination {
  items: ReportType[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateReportTypeRequest {
  typeName: string;
  description?: string;
  isActive?: boolean;
}

//Configuration
export interface Config {
  id: number;
  configKey: string;
  configValue: string;
  description: string | null;
  updatedAt: string;
}

export interface ConfigPagination {
  items: Config[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UpdateConfigRequest {
  configKey: string;
  configValue: string;
}

//WithDraw Request
export interface WithdrawRequest {
  id: number;
  walletId: number;
  amount: number;
  bankInfo: BankInfo;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  rejectionReason: string | null;
  proofImageUrl: string | null;
  requestedAt: string;
}

export interface BankInfo {
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
}

export interface RejectWithdrawRequestBody {
  reason: string;
}

export interface CompleteWithdrawRequestBody {
  status: "COMPLETED";
  proofImageUrl: string;
}

export interface WithdrawRequestPagination {
  items: WithdrawRequest[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

//Transaction management

export type TransactionStatus =
  | "SUCCESS"
  | "PENDING"
  | "CANCELLED"
  | "EXPIRED";

export type TransactionType =
  | "WALLET_TOPUP"
  | "MEMBER_SUBSCRIPTION"
  | "MONEY_TO_POINT"
  | "ADS_ORDER"
  | "VENUE_SUBSCRIPTION"
  | "VENUE_SETTLEMENT_PAYOUT";

export const TransactionTypeToInt: Record<TransactionType, number> = {
  VENUE_SUBSCRIPTION: 1,
  ADS_ORDER: 2,
  MEMBER_SUBSCRIPTION: 3,
  WALLET_TOPUP: 4,
  VENUE_SETTLEMENT_PAYOUT: 5,
  MONEY_TO_POINT: 6,

};

export const TransactionTypeFromInt: Record<number, TransactionType> = {
  1: "VENUE_SUBSCRIPTION",
  2: "ADS_ORDER",
  3: "MEMBER_SUBSCRIPTION",
  4: "WALLET_TOPUP",
  5: "VENUE_SETTLEMENT_PAYOUT",
  6: "MONEY_TO_POINT",
};

export interface Transaction {
  transactionId: number;
  userId: number;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionType: TransactionType;
  docNo: number;
  description: string;
  externalRefCode: ExternalRefCode | null;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalRefCode {
  sepayTransactionId: number;
  qrCodeUrl: string | null;
  qrData: string | null;
  orderCode: string | null;
  expireAt: string | null;
  bankInfo: any;
}

export interface TransactionPagination {
  items: Transaction[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}