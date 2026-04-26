// /api/venue/dashboard/type.ts

export interface TopPerformingVenue {
  venueId: number;
  venueName: string;
  category: string | null;
  area: string | null;
  status: string;
  averageRating: number;
  reviewCount: number;
  checkInCount: number;
  favoriteCount: number;
  datePlanCount: number;
  collectionCount: number;
  coverImage: string[] | null;
}

export interface VenuePerformance {
  venueId: number;
  venueName: string;
  category: string | null;
  area: string | null;
  status: string;
  averageRating: number;
  reviewCount: number;
  checkInCount: number;
  favoriteCount: number;
  datePlanCount: number;
  collectionCount: number;
  coverImage: string[] | null;
}

export interface RecentAdvertisement {
  id: number;
  title: string;
  bannerUrl: string;
  placementType: 'HOME_BANNER' | 'POPUP';
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE';
  category: string | null;
  desiredStartDate: string;
  createdAt: string;
  venueCount: number;
}

export interface VenueOwnerDashboardOverview {
  // venue metrics
  totalVenues: number;
  activeVenues: number;
  inactiveVenues: number;

  // review metrics
  averageRating: number;
  totalReviews: number;
  totalCheckIns: number;
  totalFavorites: number;

  // voucher metrics
  totalVouchers: number;
  activeVouchers: number;
  totalVoucherExchanged: number;
  totalVoucherUsed: number;
  voucherExchangeRate: number;
  voucherUsageRate: number;

  // engagement metrics
  totalDatePlanInclusions: number;
  totalCollectionSaves: number;
  uniqueCustomers: number;
  returningCustomers: number;

  // recent activity
  newReviewsThisWeek: number;
  newCheckInsThisWeek: number;
  newReviewsThisMonth: number;
  newCheckInsThisMonth: number;

  // growth metrics
  reviewGrowthRate: number;
  checkInGrowthRate: number;
  ratingTrend: number;

  // advertisement metrics
  totalAdvertisements: number;
  activeAdvertisements: number;
  pendingAdvertisements: number;
  rejectedAdvertisements: number;
  draftAdvertisements: number;
  recentAdvertisements: RecentAdvertisement[];

  // top venue
  topPerformingVenue: TopPerformingVenue | null;

  // venues list
  venues: VenuePerformance[];
}

// Subscription Info Types
export interface ActiveSubscriptionDetail {
  subscriptionId: number;
  packageId: number;
  packageName: string | null;
  packageType: string | null;
  startDate: string | null;
  endDate: string | null;
  venueId: number | null;
  features: Record<string, boolean> | null;
}

export interface FeatureAccessInfo {
  hasAccess: boolean;
  expiryDate: string | null;
  daysRemaining: number | null;
  providingPackages: string[];
}

export interface VenueOwnerSubscriptionInfo {
  hasActiveSubscription: boolean;
  activeSubscriptions: ActiveSubscriptionDetail[];
  venueInsightAccess: FeatureAccessInfo | null;
}
