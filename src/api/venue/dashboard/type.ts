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
  coverImage: string;
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
  coverImage: string;
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

  // top venue
  topPerformingVenue: TopPerformingVenue | null;

  // venues list
  venues: VenuePerformance[];
}