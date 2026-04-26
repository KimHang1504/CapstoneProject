// /api/venue/dashboard/api.ts

import { apiClient, ApiResponse } from "@/lib/api-client";
import { VenueOwnerDashboardOverview, VenueOwnerSubscriptionInfo, VenueSettlementRevenueResponse } from "./type";

export const getVenueOwnerDashboardOverview = async () => {
  return apiClient.get<ApiResponse<VenueOwnerDashboardOverview>>(
    "/api/venue-owner/dashboard/overview"
  );
};

export const getVenueOwnerSubscriptionInfo = async () => {
  return apiClient.get<ApiResponse<VenueOwnerSubscriptionInfo>>(
    "/api/venue-owner/dashboard/subscription-info"
  );
};

export const getVenueSettlementRevenue = async (
  fromDate: string,
  toDate: string,
  groupBy: 'day' | 'month' | 'year'
) => {
  return apiClient.get<ApiResponse<VenueSettlementRevenueResponse>>(
    `/api/VenueSettlement/revenue?FromDate=${fromDate}&ToDate=${toDate}&GroupBy=${groupBy}`
  );
};
