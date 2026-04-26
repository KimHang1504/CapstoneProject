// /api/venue/dashboard/api.ts

import { apiClient, ApiResponse } from "@/lib/api-client";
import { VenueOwnerDashboardOverview, VenueOwnerSubscriptionInfo } from "./type";

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
